"""
===================================================================
  EMBEDDINGS MODULE
  Generates dense vector embeddings using SentenceTransformer.
===================================================================
"""

from typing import List, Union
from sentence_transformers import SentenceTransformer
from config.settings import EMBED_MODEL_NAME

_embed_model_instance = None


def get_embed_model() -> SentenceTransformer:
    """
    Singleton loader for SentenceTransformer model to avoid repeated disk reads.
    """
    global _embed_model_instance
    if _embed_model_instance is None:
        print(f"[EMBED] Loading SentenceTransformer model '{EMBED_MODEL_NAME}'...")
        _embed_model_instance = SentenceTransformer(EMBED_MODEL_NAME)
        print("[EMBED] Model loaded successfully!")
    return _embed_model_instance


def generate_embedding(text: str) -> List[float]:
    """
    Generates a 384-dim vector embedding for a single string.
    """
    model = get_embed_model()
    return model.encode(text).tolist()


def generate_embeddings_batch(texts: List[str], batch_size: int = 32) -> List[List[float]]:
    """
    Generates 384-dim vector embeddings for a list of text strings in batches.
    """
    model = get_embed_model()
    embeddings = model.encode(
        texts,
        batch_size=batch_size,
        show_progress_bar=False,
        convert_to_numpy=True
    )
    return embeddings.tolist()
