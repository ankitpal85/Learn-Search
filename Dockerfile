# Multi-stage Docker build for AlgoMind AI
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim
WORKDIR /app

# Memory optimizations for 512MB RAM environments (Render Free Tier)
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    MALLOC_ARENA_MAX=2 \
    OMP_NUM_THREADS=1 \
    MKL_NUM_THREADS=1 \
    TORCH_NUM_THREADS=1

# 1. Install lightweight CPU-only PyTorch first (saves ~600MB RAM over default CUDA torch)
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# 2. Install remaining production dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 3. Pre-download SentenceTransformer model into Docker image using CPU device
RUN python -c "import torch; torch.set_num_threads(1); from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2', device='cpu')"

# Copy application code and compiled frontend assets
COPY . .
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Default port for Hugging Face (7860) or dynamic PORT for Render ($PORT)
EXPOSE 7860
ENV PORT=7860

CMD ["sh", "-c", "exec uvicorn server.app:app --host 0.0.0.0 --port ${PORT:-7860}"]
