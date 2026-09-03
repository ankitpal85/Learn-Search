# Multi-stage Docker build for AlgoMind AI
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim
WORKDIR /app

# Prevent Python from writing pyc files to disc and enable immediate log streaming
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Install Python production dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download SentenceTransformer model into Docker image to eliminate runtime cold-start timeouts
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Copy application code and compiled frontend assets
COPY . .
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Default port for Hugging Face (7860) or dynamic PORT for Render/Railway ($PORT)
EXPOSE 7860
ENV PORT=7860

CMD ["sh", "-c", "exec uvicorn server.app:app --host 0.0.0.0 --port ${PORT:-7860}"]
