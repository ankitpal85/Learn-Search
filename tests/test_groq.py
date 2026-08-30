"""Test Groq LLM API Connection"""
import sys
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from llm.groq_client import get_groq_client

if __name__ == "__main__":
    try:
        client = get_groq_client()
        models = client.models.list()
        print("[OK] Groq Client authenticated successfully!")
        print(f"     Total Models Available: {len(models.data)}")
    except Exception as e:
        print(f"[FAIL] Groq connection failed: {e}")
