"""
===================================================================
  VECTOR DB CLIENT (QDRANT)
  Manages Qdrant Cloud connection and health checks.
===================================================================
"""

from qdrant_client import QdrantClient
from config.settings import QDRANT_URL, QDRANT_API_KEY, COLLECTION_NAME

_qdrant_client_instance = None


def get_qdrant_client(timeout: int = 30) -> QdrantClient:
    """
    Returns a connected QdrantClient singleton instance.
    """
    global _qdrant_client_instance
    if _qdrant_client_instance is None:
        if not QDRANT_URL or not QDRANT_API_KEY:
            raise ValueError("Qdrant credentials missing. Check QDRANT_URL and QDRANT_API_KEY in .env")
        
        print(f"[QDRANT] Connecting to Qdrant Cloud at {QDRANT_URL[:30]}...")
        _qdrant_client_instance = QdrantClient(
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY,
            timeout=timeout
        )
        print("[QDRANT] Connection established successfully!")
    return _qdrant_client_instance


def get_collection_stats():
    """
    Fetches point count and configuration of the DSA knowledge collection.
    """
    client = get_qdrant_client()
    try:
        info = client.get_collection(COLLECTION_NAME)
        return {
            "status": "connected",
            "collection": COLLECTION_NAME,
            "total_points": info.points_count,
            "indexed_vectors_count": getattr(info, "indexed_vectors_count", info.points_count),
        }
    except Exception as e:
        return {
            "status": "error",
            "collection": COLLECTION_NAME,
            "error": str(e),
            "total_points": 0
        }
