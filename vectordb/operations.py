"""
===================================================================
  VECTOR DB OPERATIONS
  Collection management and vector point insertions.
===================================================================
"""

from typing import List, Dict, Any
from qdrant_client.models import Distance, VectorParams, PointStruct
from config.settings import COLLECTION_NAME, EMBEDDING_DIM
from .client import get_qdrant_client


def ensure_collection_exists(
    collection_name: str = COLLECTION_NAME,
    vector_dim: int = EMBEDDING_DIM,
    distance: Distance = Distance.COSINE
):
    """
    Creates collection in Qdrant if it does not already exist.
    """
    client = get_qdrant_client()
    if not client.collection_exists(collection_name):
        print(f"[QDRANT] Creating collection '{collection_name}' (dim={vector_dim}, metric={distance})...")
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(
                size=vector_dim,
                distance=distance,
            ),
        )
        print(f"[QDRANT] Collection '{collection_name}' created successfully!")
    else:
        print(f"[QDRANT] Collection '{collection_name}' already exists.")


def upsert_points(points: List[PointStruct], collection_name: str = COLLECTION_NAME):
    """
    Batch inserts or updates points into Qdrant collection.
    """
    client = get_qdrant_client()
    client.upsert(
        collection_name=collection_name,
        points=points,
        wait=True
    )
