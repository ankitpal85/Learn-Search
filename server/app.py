"""
===================================================================
  DSA Revision & AI Search Platform - FastAPI Backend Server
  Clean Modular Architecture:
    - config: Settings & Environment Variables
    - embeddings: Vector Embedding Generator (SentenceTransformer)
    - vectordb: Qdrant Cloud Client & Operations
    - retrieval: Semantic Search & Chunk Ranking
    - llm: Groq LLM Notes Generator
===================================================================
"""

import sys
from typing import List, Optional
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Safe Windows console encoding
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

# Modular Imports
from config.settings import COLLECTION_NAME, EMBED_MODEL_NAME, GROQ_MODEL_NAME
from vectordb.client import get_collection_stats
from retrieval.search import retrieve_relevant_chunks, ChunkItem
from llm.groq_client import generate_dsa_notes

# FastAPI Application Initialization
app = FastAPI(
    title="DSA AI Revision API",
    description="Vector Search & LLM RAG engine for Striver DSA Course Knowledge Base",
    version="2.0.0",
)

# Allow CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Request Schemas ---

class SearchRequest(BaseModel):
    query: str
    limit: Optional[int] = 6
    topic: Optional[str] = None


class AskRequest(BaseModel):
    question: str
    limit: Optional[int] = 3
    chat_history: Optional[List[dict]] = []


# --- API Endpoints ---

@app.get("/api/stats")
def get_stats():
    """
    Returns live statistics from Qdrant Cloud collection.
    """
    stats_data = get_collection_stats()
    return {
        "status": stats_data.get("status", "connected"),
        "collection": COLLECTION_NAME,
        "total_points": stats_data.get("total_points", 3950),
        "total_videos": 315,
        "embed_model": EMBED_MODEL_NAME,
        "llm_model": GROQ_MODEL_NAME,
        "sample_queries": [
            "LRU Cache implementation in O(1)",
            "Detect cycle in Linked List using Floyd Cycle",
            "Kadane's Algorithm for Maximum Subarray Sum",
            "Dijkstra's Shortest Path in Graph",
            "0/1 Knapsack Problem Dynamic Programming",
            "Celebrity Problem using Stack",
            "Trapping Rainwater Problem",
            "Longest Increasing Subsequence (LIS)",
        ]
    }


@app.post("/api/search")
def search_api(req: SearchRequest):
    """
    Endpoint for raw semantic vector search on video transcripts.
    """
    if not req.query.strip():
        return {"query": req.query, "results": []}

    results = retrieve_relevant_chunks(req.query, limit=req.limit or 6)
    return {
        "query": req.query,
        "count": len(results),
        "results": [r.model_dump() for r in results]
    }


@app.post("/api/ask")
def ask_api(req: AskRequest):
    """
    RAG Endpoint: Retrieves transcript chunks and synthesizes AI revision notes.
    """
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    # 1. Retrieve top matching chunks from Qdrant Vector DB
    chunks = retrieve_relevant_chunks(req.question, limit=req.limit or 3)
    if not chunks:
        return {
            "answer": "No relevant video transcripts found in the DSA Knowledge Base for this query.",
            "sources": []
        }

    # 2. Synthesize structured revision guide via Groq LLM
    try:
        answer = generate_dsa_notes(req.question, chunks)
        return {
            "question": req.question,
            "answer": answer,
            "sources": [c.model_dump() for c in chunks]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq LLM Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.app:app", host="127.0.0.1", port=8000, reload=True)
