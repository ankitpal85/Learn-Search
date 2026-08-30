"""
===================================================================
  CONFIG SETTINGS
  Centralized configuration and environment variable manager.
===================================================================
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Safe Windows console UTF-8 output
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

# Project Root Directory
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")
load_dotenv()

# API Keys & Endpoints (supports both naming styles)
QDRANT_URL = os.getenv("QDRANT_URL") or os.getenv("cluster_Endpoint") or ""
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY") or os.getenv("qdrant_api_key") or ""
GROQ_API_KEY = os.getenv("GROQ_API_KEY") or os.getenv("Groq_api_key") or ""

# Model & Collection Constants
COLLECTION_NAME = "dsa_knowledge_base"
EMBED_MODEL_NAME = "all-MiniLM-L6-v2"
EMBEDDING_DIM = 384
GROQ_MODEL_NAME = "openai/gpt-oss-20b"

# Chunking Configuration
CHUNK_SECONDS = 120      # 2 minutes per transcript chunk
OVERLAP_SECONDS = 15     # 15 seconds overlap for smooth context
TRANSCRIPT_LANGUAGES = ["hi", "en", "en-IN", "en-US"]
