"""
===================================================================
  EMBEDDINGS MODULE
  Generates dense vector embeddings using SentenceTransformer.
  Optimized for low-memory (512MB RAM) CPU environments.
===================================================================
"""

import gc
from typing import List
import torch
from sentence_transformers import SentenceTransformer
from config.settings import EMBED_MODEL_NAME

# Limit PyTorch CPU threads to 1 to prevent memory fragmentation and thread overhead
torch.set_num_threads(1)

_embed_model_instance = None


def get_embed_model() -> SentenceTransformer:
    """
    Singleton loader for SentenceTransformer model on CPU.
    """
    global _embed_model_instance
    if _embed_model_instance is None:
        print(f"[EMBED] Loading SentenceTransformer model '{EMBED_MODEL_NAME}' on CPU...")
        _embed_model_instance = SentenceTransformer(EMBED_MODEL_NAME, device="cpu")
        gc.collect()
        print("[EMBED] Model loaded successfully on CPU!")
    return _embed_model_instance


def generate_embedding(text: str) -> List[float]:
    """
    Generates a 384-dim vector embedding for a single string.
    """
    model = get_embed_model()
    with torch.inference_mode():
        return model.encode(text, convert_to_numpy=True).tolist()


def generate_embeddings_batch(texts: List[str], batch_size: int = 16) -> List[List[float]]:
    """
    Generates 384-dim vector embeddings for a list of text strings in batches.
    """
    model = get_embed_model()
    with torch.inference_mode():
        embeddings = model.encode(
            texts,
            batch_size=batch_size,
            show_progress_bar=False,
            convert_to_numpy=True
        )
    return embeddings.tolist()
