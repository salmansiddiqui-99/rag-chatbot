# RAG Chatbot Integration Guide

## Overview

This guide explains how the Physical AI Book (Docusaurus frontend) is integrated with the RAG Chatbot backend to provide an interactive AI assistant for readers.

## Architecture

```
┌─────────────────────────────────┐
│   Docusaurus Frontend           │
│   (physical-ai-book/)           │
│                                 │
│   ┌─────────────────────┐      │
│   │  Chat Widget        │      │
│   │  (React Component)  │      │
│   └─────────┬───────────┘      │
└─────────────┼───────────────────┘
              │ HTTP POST
              │ /api/chatbot/query
              ▼
┌─────────────────────────────────┐
│   FastAPI Backend               │
│   (backend/)                    │
│                                 │
│   ┌─────────────────────┐      │
│   │  RAG Pipeline       │      │
│   │  - Embedding        │      │
│   │  - Vector Search    │      │
│   │  - Generation       │      │
│   └─────────────────────┘      │
│                                 │
│   ┌─────────┐  ┌──────────┐   │
│   │ Qdrant  │  │   Neon   │   │
│   │ Vector  │  │ Postgres │   │
│   │   DB    │  │    DB    │   │
│   └─────────┘  └──────────┘   │
└─────────────────────────────────┘
```

## Components

### 1. Backend (RAG System)

**Location**: `backend/`

**Key Files**:
- `backend/src/main.py` - FastAPI application
- `backend/src/api/chat.py` - Chat endpoint handler
- `backend/src/services/vector_service.py` - Qdrant vector search
- `backend/src/services/embedding_service.py` - Cohere embeddings
- `backend/src/services/generation_service.py` - Cohere LLM generation
- `backend/scripts/ingest.py` - Document indexing script

**Database**:
- **Qdrant**: Vector database storing embedded content chunks (50 chunks from 22 MDX files)
- **Neon Postgres**: Metadata storage for documents and chunks

### 2. Frontend (Docusaurus)

**Location**: `physical-ai-book/`

**Key Files**:
- `physical-ai-book/src/components/ChatWidget/index.tsx` - Chat widget React component
- `physical-ai-book/src/components/ChatWidget/styles.module.css` - Widget styles
- `physical-ai-book/src/theme/Root.tsx` - Global theme wrapper that includes the chat widget

**Features**:
- Floating chat button (bottom-right corner)
- Expandable chat interface
- Message history with user/assistant roles
- Source citations with chapter/section information
- Mobile-responsive design
- Dark mode support

## Setup Instructions

### Step 1: Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Fill in required API keys:
     - `COHERE_API_KEY` - Get from https://cohere.com/
     - `QDRANT_URL` and `QDRANT_API_KEY` - Get from https://qdrant.tech/
     - `NEON_DATABASE_URL` - Get from https://neon.tech/

5. **Initialize database**:
   ```bash
   python scripts/setup_db.py
   ```

6. **Index the Physical AI book content**:
   ```bash
   python scripts/ingest.py --content-dir "../physical-ai-book/docs"
   ```

   This will:
   - Process all 22 MDX files from the docs/ directory
   - Create 50 chunks (with chunk_size=600, overlap=100)
   - Generate embeddings using Cohere embed-english-v3.0
   - Store vectors in Qdrant
   - Store metadata in Neon Postgres

7. **Start the backend server**:
   ```bash
   uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
   ```

   Backend will be available at `http://localhost:8000`

### Step 2: Frontend Setup

1. **Navigate to physical-ai-book directory**:
   ```bash
   cd physical-ai-book
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **(Optional) Configure API endpoint**:
   - Copy `.env.local.example` to `.env.local`
   - Update `DOCUSAURUS_RAG_API_ENDPOINT` if using a different backend URL

4. **Start development server**:
   ```bash
   npm start
   ```

   Frontend will be available at `http://localhost:3000`

### Step 3: Test the Integration

1. **Open the Docusaurus site** in your browser (`http://localhost:3000`)

2. **Look for the chat button** (💬 icon) in the bottom-right corner

3. **Click the chat button** to open the chat widget

4. **Ask a question** like:
   - "What is ROS 2?"
   - "Explain VSLAM"
   - "What is Physical AI?"
   - "Tell me about humanoid robotics"

5. **Verify the response**:
   - AI response should appear within a few seconds
   - Sources section should show which book chapters were referenced
   - Citations should include chapter titles and snippets

## API Endpoints

### Backend API

Base URL: `http://localhost:8000`

#### 1. Chat Query
```http
POST /api/chatbot/query
Content-Type: application/json

{
  "query": "What is ROS 2?"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "query_id": "uuid",
    "query_text": "What is ROS 2?",
    "response_text": "ROS 2 (Robot Operating System 2) is...",
    "retrieval_mode": "global",
    "response_status": "success",
    "retrieved_chunks": [
      {
        "chapter_title": "Module 1: The Robotic Nervous System",
        "section_heading": "ROS 2 Architecture",
        "snippet": "ROS 2 is the industry standard...",
        "score": 0.85
      }
    ],
    "timestamp": "2025-12-23T19:00:00"
  },
  "timestamp": "2025-12-23T19:00:00"
}
```

#### 2. RAG Stats
```http
GET /api/rag/stats
```

**Response**:
```json
{
  "success": true,
  "data": {
    "total_chunks_indexed": 50,
    "total_chapters": 22,
    "avg_chunk_tokens": 150,
    "embedding_model": "embed-english-v3.0",
    "vector_dimension": 1024,
    "vectors_indexed": 50
  }
}
```

#### 3. Health Check
```http
GET /api/health
```

## Configuration

### Environment Variables

#### Backend (.env)
```env
# Cohere API (for embeddings and generation)
COHERE_API_KEY=your_cohere_api_key

# Qdrant (vector database)
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key

# Neon Postgres (metadata storage)
NEON_DATABASE_URL=postgresql://user:pass@host/db

# RAG Configuration
CHUNK_SIZE=600
CHUNK_OVERLAP=100
TOP_K_CHUNKS=5
MAX_QUERY_TOKENS=200
MAX_SELECTED_TEXT_CHARS=5000

# CORS (for frontend access)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### Frontend (.env.local)
```env
# RAG Backend API
DOCUSAURUS_RAG_API_ENDPOINT=http://localhost:8000/api/chatbot/query
```

### Chat Widget Configuration

Edit `physical-ai-book/src/theme/Root.tsx` to customize:

```tsx
<ChatWidget
  apiEndpoint={customEndpoint}
/>
```

## Customization

### Styling the Chat Widget

Edit `physical-ai-book/src/components/ChatWidget/styles.module.css`:

```css
/* Change chat button colors */
.chatToggle {
  background: linear-gradient(135deg, #06B6D4 0%, #1E3A8A 100%);
}

/* Change widget size */
.chatWidget {
  width: 400px;        /* Default: 380px */
  height: 650px;       /* Default: 600px */
}
```

### Adjusting RAG Parameters

Edit `backend/.env`:

```env
# Retrieve more/fewer chunks per query
TOP_K_CHUNKS=5          # Default: 5, Range: 1-20

# Adjust chunk size for indexing
CHUNK_SIZE=600          # Default: 600, Range: 300-1000
CHUNK_OVERLAP=100       # Default: 100, Range: 50-200
```

## Troubleshooting

### Chat Widget Not Appearing

1. **Check browser console** for errors (F12 → Console)
2. **Verify Root.tsx** is being loaded:
   ```bash
   ls physical-ai-book/src/theme/Root.tsx
   ```
3. **Clear Docusaurus cache**:
   ```bash
   npm run clear
   npm start
   ```

### No Response from Chat

1. **Check backend is running**:
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Check CORS configuration**:
   - Ensure `CORS_ORIGINS` in backend `.env` includes your frontend URL
   - Default: `http://localhost:3000`

3. **Check browser network tab**:
   - F12 → Network tab
   - Look for `/api/chatbot/query` request
   - Check for CORS errors or 404/500 responses

### No Relevant Context Retrieved

1. **Verify content is indexed**:
   ```bash
   curl http://localhost:8000/api/rag/stats
   ```
   Should show `total_chunks_indexed > 0`

2. **Re-index content**:
   ```bash
   cd backend
   python scripts/ingest.py --content-dir "../physical-ai-book/docs"
   ```

3. **Check query relevance**:
   - Try queries closely related to book content
   - Examples: "ROS 2", "Gazebo", "VSLAM", "humanoid robotics"

## Deployment

### Production Deployment

1. **Deploy backend** to a cloud platform:
   - **Vercel** (recommended for FastAPI)
   - **Railway**
   - **Render**
   - **AWS Lambda** + API Gateway

2. **Update frontend environment variable**:
   ```env
   # .env.local
   DOCUSAURUS_RAG_API_ENDPOINT=https://your-backend-api.com/api/chatbot/query
   ```

3. **Deploy frontend** to GitHub Pages:
   ```bash
   cd physical-ai-book
   npm run build
   npm run deploy
   ```

4. **Update CORS** in backend `.env`:
   ```env
   CORS_ORIGINS=https://your-username.github.io
   ```

## File Structure

```
rag_chatbot/
├── backend/                          # RAG chatbot backend
│   ├── src/
│   │   ├── api/
│   │   │   └── chat.py              # Chat endpoint
│   │   ├── services/
│   │   │   ├── vector_service.py    # Qdrant integration
│   │   │   ├── embedding_service.py # Cohere embeddings
│   │   │   └── generation_service.py# Cohere generation
│   │   └── main.py                  # FastAPI app
│   ├── scripts/
│   │   └── ingest.py                # Content indexing
│   ├── .env                         # Backend config
│   └── requirements.txt             # Python dependencies
│
├── physical-ai-book/                # Docusaurus frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatWidget/          # Chat widget component
│   │   │       ├── index.tsx        # Component logic
│   │   │       └── styles.module.css# Component styles
│   │   └── theme/
│   │       └── Root.tsx             # Global wrapper
│   ├── docs/                        # Book content (22 MDX files)
│   ├── .env.local                   # Frontend config
│   └── package.json                 # Node dependencies
│
└── INTEGRATION_GUIDE.md             # This file
```

## Next Steps

1. **Enhance chat widget**:
   - Add conversation history persistence (localStorage)
   - Implement typing indicators
   - Add "Clear chat" button
   - Support for code syntax highlighting in responses

2. **Improve RAG quality**:
   - Experiment with different chunk sizes
   - Implement hybrid search (semantic + keyword)
   - Add re-ranking of retrieved chunks
   - Fine-tune prompt templates

3. **Add analytics**:
   - Track popular queries
   - Monitor response quality
   - A/B test different RAG parameters

4. **Extend functionality**:
   - Support for follow-up questions
   - Ability to select text and ask questions about it
   - Multi-language support
   - Export chat history

## Support

For issues or questions:
- Check the troubleshooting section above
- Review backend logs: `backend/logs/`
- Review browser console for frontend errors
- Ensure all API keys are valid and have sufficient quota

## License

This integration is part of the Physical AI & Humanoid Robotics educational project.
