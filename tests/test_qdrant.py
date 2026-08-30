"""Test Qdrant Cloud Connection"""
import sys
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from vectordb.client import get_qdrant_client, get_collection_stats

if __name__ == "__main__":
    try:
        client = get_qdrant_client(timeout=10)
        collections = client.get_collections()
        print("[OK] Qdrant Cloud connected successfully!")
        print(f"     Collections: {[c.name for c in collections.collections]}")
        stats = get_collection_stats()
        print(f"     Stats: {stats}")
    except Exception as e:
        print(f"[FAIL] Qdrant connection failed: {e}")
