---
title: Physical AI RAG Chatbot
emoji: 🤖
colorFrom: blue
colorTo: cyan
sdk: docker
pinned: false
license: mit
---

# Physical AI RAG Chatbot Backend

**Purpose**: Backend API for the Physical AI & Humanoid Robotics Book RAG chatbot

## Overview

FastAPI backend service providing:
- Document ingestion from MDX book chapters (22 files, 50 chunks indexed)
- Vector search via Qdrant Cloud
- AI-generated responses via Cohere (Command model)
- Embeddings via Cohere (embed-english-v3.0, 1024-dim vectors)
- Dual-mode queries: full-book RAG + selected-text context

## Architecture

```
MDX Files → Ingestion Script → Qdrant (vectors) + Neon (metadata)
                                         ↓
User Query → /chat endpoint → Vector Search → AI Generation → Response
```

## Tech Stack

- **Python**: 3.11+
- **Framework**: FastAPI 0.115+, Uvicorn
- **Vector DB**: Qdrant Cloud (free tier)
- **Embeddings**: Cohere embed-english-v3.0 (1024-dim vectors)
- **AI Generation**: Cohere Command (LLM)
- **Database**: Neon Serverless Postgres

## Setup

See `../specs/001-rag-chatbot/quickstart.md` for complete setup instructions.

Quick start:
```bash
# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Initialize database
python scripts/setup_db.py

# Run server
uvicorn src.main:app --reload --port 8000
```

## API Endpoints

- `GET /` - Root health check
- `GET /api/health` - Detailed health check
- `POST /api/chatbot/query` - Submit chatbot query (RAG mode)
- `GET /api/rag/stats` - RAG statistics (indexed chunks, etc.)
- `GET /docs` - Interactive API documentation (Swagger UI)

**Example Usage**:
```bash
curl -X POST https://YOUR-USERNAME-rag-chatbot.hf.space/api/chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is ROS 2?"}'
```

## Project Structure

```
backend/
├── src/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Environment variable config
│   ├── models/              # Data models (SQLAlchemy, Pydantic)
│   ├── services/            # Business logic (embeddings, vector, generation, db)
│   ├── api/                 # API endpoints
│   └── utils/               # Utilities (chunking, MDX parsing, prompts)
├── scripts/
│   ├── setup_db.py          # Database initialization
│   └── ingest.py            # Content ingestion script
├── tests/
│   ├── unit/                # Unit tests
│   └── integration/         # Integration tests
├── requirements.txt         # Python dependencies
├── .env.example             # Environment template
├── Dockerfile               # Docker configuration for HF Spaces
└── README.md                # This file
```

## Development

Run tests:
```bash
pytest tests/ --cov=src
```

Run with Docker:
```bash
docker build -t rag-chatbot .
docker run -p 8000:8000 --env-file .env rag-chatbot
```

## Deployment

Backend deployed to Hugging Face Spaces. See deployment tasks T080-T086 in `specs/001-rag-chatbot/tasks.md`.
