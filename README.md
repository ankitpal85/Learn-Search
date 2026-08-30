# DSA Neural Search & AI Revision Platform ⚡

A high-performance **Vector Search & LLM-Powered RAG Platform** for Striver's A2Z DSA Course. Features semantic timestamp deep-linking into YouTube lecture clips and instant structured revision notes powered by Qdrant Vector Cloud and Groq LLM.

---

## 🚀 Key Features

- **Semantic Video Timestamp Retrieval**: Over 3,950+ video transcript segments indexed in Qdrant Cloud. Jump straight to the exact second where the concept or algorithm is explained.
- **Groq LLM Revision Engine**: Generates high-yield revision summaries, brute-to-optimal logic breakdowns, full code implementations, and algorithmic complexity matrices.
- **Cyberpunk / Obsidian UI**: Built with React, Tailwind CSS, and Vite, featuring keyboard command docks (`⌘K` or `/`), speech synthesis, PDF exports, and audio equalizer playback animations.
- **Modular Python Architecture**: Cleanly separated layers for `config`, `embeddings`, `vectordb`, `retrieval`, `llm`, `pipeline`, and `server`.

---

## 📁 Repository Structure

```
├── config/                  # Settings & environment variables
├── embeddings/              # SentenceTransformer embedding generator
├── vectordb/                # Qdrant Cloud client & vector operations
├── retrieval/               # Semantic search & chunk scoring
├── llm/                     # Groq LLM notes synthesizer & prompt templates
├── pipeline/                # Knowledge base indexing & transcript pipelines
├── server/                  # FastAPI web backend (/api/stats, /api/search, /api/ask)
├── tests/                   # Qdrant & Groq verification tests
├── frontend/                # React + Tailwind Cyberpunk UI
└── requirements.txt         # Python dependencies
```

---

## 🛠️ Quick Start

### 1. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Fill in your QDRANT_URL, QDRANT_API_KEY, and GROQ_API_KEY in .env

# Run FastAPI server
python -m uvicorn server.app:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 🧪 Tests

```bash
# Test Qdrant Vector Cloud connection
python tests/test_qdrant.py

# Test Groq LLM API connection
python tests/test_groq.py
```

---

## 📄 License
MIT
