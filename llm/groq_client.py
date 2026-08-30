"""
===================================================================
  LLM MODULE (GROQ ENGINE)
  Synthesizes high-yield structured DSA revision notes using Groq LLM.
===================================================================
"""

from typing import List, Optional
from groq import Groq
from config.settings import GROQ_API_KEY, GROQ_MODEL_NAME
from retrieval.search import ChunkItem

_groq_client_instance = None


def get_groq_client() -> Groq:
    """
    Returns a connected Groq client instance.
    """
    global _groq_client_instance
    if _groq_client_instance is None:
        if not GROQ_API_KEY:
            raise ValueError("Groq API key is missing. Check GROQ_API_KEY in .env")
        _groq_client_instance = Groq(api_key=GROQ_API_KEY)
    return _groq_client_instance


DSA_SYSTEM_PROMPT = """You are a world-class DSA (Data Structures & Algorithms) instructor and revision coach.
You provide clear, compact, and high-yield revision notes for the requested topic based on Striver's A2Z DSA course.

Format your response strictly using clean GitHub Markdown with this structure:
### 💡 Core Concept & Intuition
Crisp 2-3 sentence summary of what the technique is and why it is used.

### ⚡ Approaches & Logic
- **Brute Force**: Brief description + Time/Space complexity.
- **Optimal Approach**: Step-by-step logic and intuition.

### 💻 Optimal Code Implementation
Provide clean, idiomatic, well-commented code (C++ or Python).

### 📊 Complexity Analysis
| Metric | Complexity | Explanation |
| :--- | :--- | :--- |
| **Time Complexity** | `O(...)` | Brief reason |
| **Space Complexity** | `O(...)` | Brief reason |

### 🎯 Key Interview Takeaways
- 2-3 critical points or common pitfalls to remember during interviews.

IMPORTANT: Do NOT include any 'Video References' or 'Sources' section at the end. Keep it focused entirely on high-quality technical notes."""


def generate_dsa_notes(
    question: str,
    chunks: List[ChunkItem],
    model: str = GROQ_MODEL_NAME,
    temperature: float = 0.2
) -> str:
    """
    Takes retrieved chunks, constructs context, and queries Groq LLM.
    """
    client = get_groq_client()

    # Build structured context string from retrieved chunks
    context_blocks = []
    for i, c in enumerate(chunks, 1):
        context_blocks.append(
            f"Source [{i}]: Video: \"{c.title}\" ({c.start_fmt} - {c.end_fmt})\n"
            f"Transcript Segment: {c.text}\n"
            f"Link: {c.youtube_url}"
        )
    context_str = "\n\n".join(context_blocks)

    user_prompt = f"""Context from DSA Course Videos:
{context_str}

User Question:
{question}

Please provide a detailed revision guide and solution based on the course transcripts."""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": DSA_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        temperature=temperature,
    )

    return response.choices[0].message.content or ""
