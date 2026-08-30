"""
=================================================================
  DSA Revision Platform -- Fill Missing Videos with Groq Whisper
=================================================================
"""

import os
import sys
import io
import json
import time
import uuid

if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from config.settings import (
    QDRANT_URL,
    QDRANT_API_KEY,
    GROQ_API_KEY,
    COLLECTION_NAME,
    EMBED_MODEL_NAME,
    EMBEDDING_DIM,
    CHUNK_SECONDS,
    OVERLAP_SECONDS,
    BASE_DIR,
)
from embeddings.embedder import get_embed_model
from vectordb.client import get_qdrant_client
from vectordb.operations import ensure_collection_exists
from llm.groq_client import get_groq_client

DATA_DIR = os.path.join(BASE_DIR, "data")
TRANSCRIPT_DIR = os.path.join(DATA_DIR, "transcripts")
TEMP_AUDIO_DIR = os.path.join(DATA_DIR, "temp_audio")
PROGRESS_FILE = os.path.join(DATA_DIR, "progress.json")
BATCH_SIZE = 32
MAX_RETRIES = 5
RETRY_DELAY = 3


def load_progress() -> dict:
    if os.path.exists(PROGRESS_FILE):
        try:
            with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def save_progress(data: dict):
    os.makedirs(DATA_DIR, exist_ok=True)
    tmp = PROGRESS_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    os.replace(tmp, PROGRESS_FILE)


def fill_missing():
    progress = load_progress()
    videos = progress.get("videos", {})
    missing = [
        (vid, info) for vid, info in videos.items()
        if not info.get("transcribed") or info.get("failed")
    ]

    print(f"[WHISPER] Total missing videos to transcribe: {len(missing)}")
    if not missing:
        print("[WHISPER] No missing videos found.")
        return


if __name__ == "__main__":
    fill_missing()
