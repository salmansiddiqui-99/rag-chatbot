# RAG Chatbot for Physical AI & Humanoid Robotics Book

[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Live-success)](https://salmansiddiqui-99.github.io/rag-chatbot/)
[![Hugging Face](https://img.shields.io/badge/🤗_Hugging_Face-Live-yellow)](https://salman-giaic-rag.hf.space)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-blue)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-green)](https://www.python.org/)
[![Docusaurus](https://img.shields.io/badge/Docusaurus-3.x-purple)](https://docusaurus.io/)

A comprehensive RAG (Retrieval-Augmented Generation) chatbot system for the Physical AI & Humanoid Robotics educational book, featuring both a backend API and an interactive online book interface.

---

## 🌐 Live Deployments

### 📘 Online Book (GitHub Pages)
**URL**: [https://salmansiddiqui-99.github.io/rag-chatbot/](https://salmansiddiqui-99.github.io/rag-chatbot/)

The complete Physical AI & Humanoid Robotics book deployed as a static Docusaurus site with:
- 4 comprehensive modules (ROS 2, Digital Twin, NVIDIA Isaac, VLA)
- Interactive search functionality
- Dark/light mode toggle
- Mobile-responsive design
- Accessibility compliant (WCAG 2.1 AA)

### 🤖 RAG Chatbot API (Hugging Face Spaces)
**URL**: [https://salman-giaic-rag.hf.space](https://salman-giaic-rag.hf.space)
**API Docs**: [https://salman-giaic-rag.hf.space/docs](https://salman-giaic-rag.hf.space/docs)

FastAPI backend with:
- Semantic search using Qdrant vector database
- Cohere embeddings (embed-english-v3.0)
- OpenRouter AI generation (Mistral Devstral)
- Full RAG pipeline for book content queries
- RESTful API endpoints

---

## 📁 Project Structure

```
rag_chatbot/
├── backend/                    # RAG chatbot backend (FastAPI)
│   ├── src/
│   │   ├── api/               # API endpoints (chat, ingest, health)
│   │   ├── models/            # Pydantic models
│   │   ├── services/          # Core services (embedding, vector, generation)
│   │   └── utils/             # Utilities (chunking, MDX parsing, prompts)
│   ├── scripts/               # Setup and ingestion scripts
│   ├── Dockerfile             # Docker configuration
│   └── requirements.txt       # Python dependencies
│
├── physical-ai-book/          # Docusaurus online book
│   ├── docs/                  # Book content (MDX files)
│   │   ├── module-1-ros2/
│   │   ├── module-2-digital-twin/
│   │   ├── module-3-isaac/
│   │   ├── module-4-vla/
│   │   └── supporting/
│   ├── src/                   # React components and theming
│   ├── static/                # Static assets (images, favicon)
│   └── docusaurus.config.ts   # Docusaurus configuration
│
├── specs/                     # Spec-Driven Development artifacts
│   ├── 001-rag-chatbot/      # RAG backend specifications
│   └── 002-docusaurus-book/  # Book specifications
│
└── history/                   # Prompt History Records (PHRs)
    └── prompts/               # Development traceability
```

---

## 🚀 Quick Start

### Backend (RAG Chatbot API)

#### Prerequisites
- Python 3.11+
- PostgreSQL with pgvector extension (optional)
- Qdrant Cloud account (free tier)
- OpenRouter API key
- Cohere API key

#### Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Configure API keys in .env
OPENROUTER_API_KEY=your_openrouter_key
COHERE_API_KEY=your_cohere_key
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_key
```

#### Run Locally

```bash
# Start the API server
uvicorn src.main:app --reload

# Visit API documentation
# http://localhost:8000/docs
```

#### Deploy to Hugging Face Spaces

See [HUGGINGFACE_DEPLOYMENT_GUIDE.md](HUGGINGFACE_DEPLOYMENT_GUIDE.md) for detailed instructions.

---

### Frontend (Online Book)

#### Prerequisites
- Node.js 20+
- npm 10+

#### Setup

```bash
# Navigate to book directory
cd physical-ai-book

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

#### Deploy to GitHub Pages

The book automatically deploys to GitHub Pages via GitHub Actions when changes are pushed to the `physical-ai-book/` directory.

See [physical-ai-book/DEPLOYMENT.md](physical-ai-book/DEPLOYMENT.md) for detailed instructions.

---

## 🎯 Features

### RAG Chatbot Backend

- **Semantic Search**: Qdrant vector database with cosine similarity
- **Smart Embeddings**: Cohere embed-english-v3.0 (1024 dimensions)
- **AI Generation**: OpenRouter with Mistral Devstral (free tier)
- **Dual Query Modes**:
  - `rag`: Full-book retrieval with top-5 semantic chunks
  - `selected_text`: Contextual queries on user-selected text
- **Conversation History**: Multi-turn conversations with context
- **Citation Sources**: Chapter and section citations for transparency
- **Token Counting**: tiktoken-based token management
- **RESTful API**: FastAPI with automatic OpenAPI documentation

### Online Book

- **4 Comprehensive Modules**:
  - Module 1: ROS 2 (Robotic Nervous System)
  - Module 2: Digital Twin Simulation
  - Module 3: AI-Robot Brain (NVIDIA Isaac)
  - Module 4: Vision-Language-Action (VLA)
- **Supporting Resources**:
  - Introduction to Physical AI
  - Learning outcomes
  - Weekly breakdown (13 weeks)
  - Project assessments
  - Hardware requirements
- **Modern Design**: Futuristic theme with electric cyan accents
- **Search**: Local search with highlighting
- **Responsive**: 320px-2560px viewport support
- **Accessible**: WCAG 2.1 AA compliant

---

## 🔧 Technology Stack

### Backend
- **Framework**: FastAPI 0.104+
- **Language**: Python 3.11+
- **Vector DB**: Qdrant Cloud
- **Embeddings**: Cohere API
- **Generation**: OpenRouter API (Mistral)
- **Database**: PostgreSQL + pgvector (optional)
- **Deployment**: Hugging Face Spaces

### Frontend
- **Framework**: Docusaurus 3.x
- **Language**: TypeScript
- **Styling**: CSS3 with custom theme
- **Search**: docusaurus-search-local
- **Deployment**: GitHub Pages + GitHub Actions

---

## 📚 Documentation

- [Backend README](backend/README.md) - API setup and usage
- [Hugging Face Deployment Guide](HUGGINGFACE_DEPLOYMENT_GUIDE.md) - Deploy backend to HF Spaces
- [Book Deployment Guide](physical-ai-book/DEPLOYMENT.md) - Deploy book to GitHub Pages
- [Integration Guide](INTEGRATION_GUIDE.md) - Connect book to chatbot
- [Implementation Status](IMPLEMENTATION_STATUS.md) - Development progress
- [RAG Integration Complete](RAG_INTEGRATION_COMPLETE.md) - RAG system details

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/test_api.py
```

### Frontend Tests

```bash
cd physical-ai-book

# Lint check
npm run lint

# Build test
npm run build

# Serve production build
npm run serve
```

---

## 🛠️ Development Workflow

This project follows **Spec-Driven Development (SDD)** methodology:

1. **Specification** (`/sp.specify`) - Define requirements
2. **Planning** (`/sp.plan`) - Design architecture
3. **Tasks** (`/sp.tasks`) - Break down implementation
4. **Implementation** (`/sp.implement`) - Execute development
5. **Documentation** - Automatic PHR generation

All development artifacts are stored in `specs/` and `history/` directories for full traceability.

---

## 📝 API Endpoints

### Health Check
```
GET /health
```

### Chat (RAG Mode)
```
POST /chat
{
  "query": "What is ROS 2?",
  "mode": "rag",
  "conversation_history": []
}
```

### Chat (Selected Text Mode)
```
POST /chat
{
  "query": "Explain this in detail",
  "selected_text": "ROS 2 uses DDS middleware...",
  "mode": "selected_text"
}
```

### Ingest Documents
```
POST /ingest
{
  "content_path": "path/to/content"
}
```

See full API documentation at: [https://salman-giaic-rag.hf.space/docs](https://salman-giaic-rag.hf.space/docs)

---

## 🤝 Contributing

This project was built using Claude Code with Spec-Driven Development methodology. All contributions should:

1. Follow the SDD workflow (spec → plan → tasks → implement)
2. Create Prompt History Records (PHRs) for traceability
3. Maintain constitution compliance (see `.specify/memory/constitution.md`)
4. Include comprehensive documentation
5. Pass all tests and linting checks

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Course Content**: Physical AI & Humanoid Robotics curriculum
- **AI Assistant**: Claude Code (Anthropic Claude Sonnet 4.5)
- **Development Methodology**: Spec-Driven Development (SDD-RI)
- **Deployment Platforms**: Hugging Face Spaces, GitHub Pages

---

## 📊 Project Status

- ✅ Backend RAG API: **Deployed** ([Hugging Face](https://salman-giaic-rag.hf.space))
- ✅ Online Book: **Deployed** ([GitHub Pages](https://salmansiddiqui-99.github.io/rag-chatbot/))
- ✅ Specifications: **Complete** (2 features documented)
- ✅ Implementation: **Complete** (All core features functional)
- ✅ Testing: **Passing** (Manual validation completed)
- ✅ Documentation: **Comprehensive** (Guides and PHRs available)

---

## 🔗 Links

- **Live Book**: https://salmansiddiqui-99.github.io/rag-chatbot/
- **Live API**: https://salman-giaic-rag.hf.space
- **API Docs**: https://salman-giaic-rag.hf.space/docs
- **GitHub Repository**: https://github.com/salmansiddiqui-99/rag-chatbot
- **Spec-Driven Development**: https://github.com/anthropics/claude-code

---

**Built with** ❤️ **using Claude Code**

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
