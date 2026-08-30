# ======================================================
#   PART 1 - IMPORTS AND ENVIRONMENT
# ======================================================

import os
import sys
import io
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq
import numpy as np
from sentence_transformers import SentenceTransformer
from qdrant_client.models import Distance, VectorParams, PointStruct
from qdrant_client import QdrantClient

# Windows console UTF-8 fix
if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Load variables from .env (both current dir and parent if any)
BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
load_dotenv(ROOT_DIR / ".env")
load_dotenv()

# Flexible env variable loading to support both naming styles
my_api_key = os.getenv("GROQ_API_KEY") or os.getenv("Groq_api_key")
qdrant_api_key = os.getenv("QDRANT_API_KEY") or os.getenv("qdrant_api_key")
qdrant_url = os.getenv("QDRANT_URL") or os.getenv("cluster_Endpoint")

if not my_api_key:
    raise ValueError("Groq API key is missing. Check GROQ_API_KEY in .env")

if not qdrant_api_key:
    raise ValueError("Qdrant API key is missing. Check QDRANT_API_KEY in .env")

if not qdrant_url:
    raise ValueError("Qdrant URL is missing. Check QDRANT_URL in .env")


# ===============================================
# PART 2 - CONNECT TO QDRANT
# ===============================================

client = QdrantClient(
    url=qdrant_url,
    api_key=qdrant_api_key,
)

print("Connected to Qdrant Cloud!")

# =============================================
# PART 3 - CREATE QDRANT COLLECTION
# =============================================

COLLECTION_NAME = "knowledge"
EMBEDDING_SIZE = 384

# delete collection if it already exists
if client.collection_exists(COLLECTION_NAME):
    print(f"Deleting existing collection: {COLLECTION_NAME}")
    client.delete_collection(COLLECTION_NAME)

# Create collection
client.create_collection(
    collection_name=COLLECTION_NAME,
    vectors_config=VectorParams(
        size=EMBEDDING_SIZE,
        distance=Distance.COSINE,  # similarity metric
    ),
)

print(f"Created collection: {COLLECTION_NAME}")
print(f"Vector size: {EMBEDDING_SIZE}")
print("Distance: COSINE")

# ==================================
# PART 4 - LOAD OUR KNOWLEDGE
# ==================================

# Check in current dir or root dir
knowledge_file = BASE_DIR / "knowledge.txt"
if not knowledge_file.exists():
    knowledge_file = ROOT_DIR / "knowledge.txt"

if not knowledge_file.exists():
    # Fallback sample knowledge text if not present
    default_text = """Employees are entitled to 20 days of paid vacation per year.
Sick leave is provided up to 10 days per calendar year with full pay.
Working hours are flexible between 9 AM and 6 PM Monday through Friday.
Health insurance coverage begins on the first day of employment.
Annual performance bonuses are distributed in December based on company and individual goals.
"""
    knowledge_file = BASE_DIR / "knowledge.txt"
    with open(knowledge_file, "w", encoding="utf-8") as f:
        f.write(default_text)
    print(f"Created default knowledge.txt at {knowledge_file}")

with open(knowledge_file, "r", encoding="utf-8") as f:
    documents = [
        line.strip()
        for line in f
        if line.strip()
    ]

print(f"Loaded {len(documents)} documents from {knowledge_file.name}")

# ============================================
# PART 5 - CREATE EMBEDDINGS
# ============================================

print(f"Loading embedding model.....")

model = SentenceTransformer("all-MiniLM-L6-v2")

print("Embedding model ready!")

embeddings = model.encode(documents)

print(f"Generated {len(embeddings)} embeddings")
print(f"Embedding size: {len(embeddings[0])}")

# ====================================================
# PART 6 - CREATE QDRANT POINTS
# ====================================================

points = []

for i, embedding in enumerate(embeddings):
    point = PointStruct(
        id=i + 1,
        vector=embedding.tolist(),
        payload={
            "text": documents[i]
        }
    )
    points.append(point)


# =============================================
# PART 7 - UPLOAD TO QDRANT
# =============================================

client.upsert(
    collection_name=COLLECTION_NAME,
    points=points
)

print(f"Uploaded {len(points)} documents to Qdrant!")

# ======================================================
# PART 8 - SEARCH QDRANT
# ======================================================

def search(query, top_k=3):
    # Convert the question into an embedding
    query_vector = model.encode(query).tolist()

    # Search Qdrant for similar vectors
    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=top_k,
        with_payload=True,
    ).points

    return results


# ==========================================
# PART 9 - TEST SEARCH
# ==========================================

query = "How much vacation do I get ? "

results = search(query, top_k=3)

print("\n--- Search results ---")
for result in results:
    print(f"Score: {result.score:.3f}")
    print(result.payload["text"])
    print()

# =========================================
# PART 10 - CONNECT TO GROQ
# =========================================

groq_client = Groq(
    api_key=my_api_key
)

groq_model = "openai/gpt-oss-20b"

# =========================================
# PART 11 - ASK THE LLM
# =========================================

def ask_llm(question, context):
    prompt = f"""Answer the question using only the information provided below.

Context:
{context}

Question:
{question}
If the answer is not present in the context, say:
"I don't know based on the provided information."
"""
    response = groq_client.chat.completions.create(
        model=groq_model,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )
    answer = response.choices[0].message.content
    return answer


# ==============================================
# PART 12 - COMPLETE RAG PIPELINE
# ==============================================

question = "How much vacation do I get ? "

results = search(question, top_k=3)

# Extract text from the search results
context = "\n".join(
    result.payload["text"]
    for result in results
)

answer = ask_llm(question, context)

print("--- Final Answer ---")
print(answer)
