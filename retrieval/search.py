"""
===================================================================
  RETRIEVAL MODULE
  Performs semantic vector search across video transcript chunks.
===================================================================
"""

from typing import List, Optional
from pydantic import BaseModel
from config.settings import COLLECTION_NAME
from embeddings.embedder import generate_embedding
from vectordb.client import get_qdrant_client


class ChunkItem(BaseModel):
    id: str
    video_id: str
    title: str
    start: float
    end: float
    start_fmt: str
    end_fmt: str
    youtube_url: str
    text: str
    score: float


def retrieve_relevant_chunks(
    query: str,
    limit: int = 6,
    collection_name: str = COLLECTION_NAME
) -> List[ChunkItem]:
    """
    1. Embeds search query using SentenceTransformer.
    2. Executes cosine similarity vector query against Qdrant collection.
    3. Formats & returns ranked ChunkItem list.
    """
    if not query.strip():
        return []

    # Generate query vector
    query_vector = generate_embedding(query)
    client = get_qdrant_client()

    # Query Qdrant Cloud
    results = client.query_points(
        collection_name=collection_name,
        query=query_vector,
        limit=limit,
        with_payload=True,
    ).points

    # Map to ChunkItem schema
    items: List[ChunkItem] = []
    for r in results:
        payload = r.payload or {}
        items.append(ChunkItem(
            id=str(r.id),
            video_id=payload.get("video_id", ""),
            title=payload.get("title", ""),
            start=float(payload.get("start", 0)),
            end=float(payload.get("end", 0)),
            start_fmt=payload.get("start_fmt", "00:00"),
            end_fmt=payload.get("end_fmt", "00:00"),
            youtube_url=payload.get("youtube_url", ""),
            text=payload.get("text", ""),
            score=round(float(r.score), 4)
        ))

    return items
