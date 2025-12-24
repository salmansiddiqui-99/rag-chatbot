# Implementation Plan: Integrated RAG Chatbot for Physical AI Book

**Branch**: `001-rag-chatbot` | **Date**: 2025-12-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-rag-chatbot/spec.md`

**Note**: This plan outlines the architecture and design for the RAG chatbot feature. It follows the spec-driven development workflow and will be used to generate tasks via `/sp.tasks`.

## Summary

Implement a Retrieval-Augmented Generation (RAG) chatbot embedded in the Docusaurus-based Physical AI book. The chatbot will support two query modes: (1) full-book semantic search using Qdrant vector database, and (2) context-limited queries based on user-selected text. The backend FastAPI service will be deployed to Hugging Face Spaces, with a React widget integrated into the Docusaurus frontend hosted on GitHub Pages. The system will index 10-15 book chapters, handle 100 concurrent users, and maintain <3s response times while adhering to all constitution principles (RAG accuracy >90%, security via CORS/rate limiting, accessibility via ARIA labels).

## Technical Context

**Language/Version**: Python 3.11+ (backend), Node.js 18+ (frontend)
**Primary Dependencies**:
- Backend: FastAPI 0.104+, Uvicorn, qdrant-client, cohere, openai (configured for OpenRouter), python-dotenv, SQLAlchemy, psycopg2-binary
- Frontend: Docusaurus 2.4+, React 18+, axios for API calls
**Storage**:
- Vector Database: Qdrant Cloud (free tier, 1GB limit) for embeddings
- Relational Database: Neon Serverless Postgres (free tier, 512MB) for metadata tracking
**Testing**: pytest (backend unit/integration), Jest (frontend components), manual E2E validation
**Target Platform**:
- Backend: Linux container on Hugging Face Spaces (Docker deployment)
- Frontend: Static site on GitHub Pages (HTTPS required)
**Project Type**: Web application (backend + frontend)
**Performance Goals**:
- <3s response time for 95% of chatbot queries (p95 latency)
- Handle 100 concurrent users without crashes
- RAG retrieval precision >85% (top-5 relevant chunks)
**Constraints**:
- Free-tier service limits (Cohere embeddings, Qdrant storage, OpenRouter API rate limits)
- No authentication for chatbot (read-only access)
- Conversation history persists only within browser session (sessionStorage)
- HTTPS enforced; CORS restricted to GitHub Pages domain
**Scale/Scope**:
- Index 10-15 book chapters (total ~15,000-45,000 words)
- Support up to 100 concurrent users
- ~500-1000 content chunks in vector database
- Widget embedded on all Docusaurus pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Technical Accuracy & Source Verification
- ✅ **PASS**: RAG system will cite source chapters in responses (FR-016)
- ✅ **PASS**: Spec requires >95% accuracy for book questions, exceeding constitution's >90% threshold (SC-002)
- ✅ **PASS**: Grounding prompts will prevent hallucinations; responses limited to book content

### Principle II: User-Centric Personalization
- ✅ **PASS**: Personalization is out of scope for this feature (handled by separate auth/personalization feature per spec)
- ℹ️ **NOTE**: Chatbot adapts responses to query context (selected text mode) but not user profiles

### Principle III: Scalability & Maintainability
- ✅ **PASS**: Backend uses FastAPI with clear separation (models, services, API routes) per constitution
- ✅ **PASS**: RAG pipeline encapsulated as reusable service (ingestion, retrieval, generation modules)
- ✅ **PASS**: Vector DB and embeddings abstracted behind service layer for provider swaps
- ✅ **PASS**: Code will follow PEP8 (Python) and ESLint (JavaScript) with inline documentation

### Principle IV: Security & Privacy First
- ✅ **PASS**: No user data collected (read-only chatbot, no authentication per spec assumptions)
- ✅ **PASS**: API keys stored in environment variables (.env local, HF Secrets production) (FR-015)
- ✅ **PASS**: CORS restricted to GitHub Pages domain (FR-015)
- ✅ **PASS**: Rate limiting implemented on public API endpoints (constitution requirement)
- ✅ **PASS**: HTTPS enforced on both frontend (GitHub Pages) and backend (HF Spaces)

### Principle V: Open-Source Ethos
- ✅ **PASS**: Stack uses open-source/free tools: FastAPI, Docusaurus, Qdrant, Cohere (free tier), OpenRouter (free model)
- ✅ **PASS**: Deployment on Hugging Face Spaces (free, open platform)
- ✅ **PASS**: Agent skills can be documented as reusable patterns (query classification, context selection)

### Principle VI: Inclusivity & Accessibility
- ✅ **PASS**: Chatbot widget will include ARIA labels and keyboard navigation (FR-019)
- ✅ **PASS**: Multilingual support (Urdu) out of scope for this feature (handled by translation feature per spec)
- ✅ **PASS**: Mobile-responsive widget design for modern browsers

### Performance & Testing Standards (Constitution)
- ✅ **PASS**: Spec requires <3s response time, within constitution's <2s personalization goal (acceptable for RAG complexity)
- ✅ **PASS**: Spec requires 90%+ test coverage with pytest/Jest
- ✅ **PASS**: Integration tests planned for auth flows, RAG queries, E2E widget interaction

**Constitution Check Result**: ✅ **ALL GATES PASSED** - No violations; no complexity justification required

## Project Structure

### Documentation (this feature)

```text
specs/001-rag-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output: RAG patterns, MDX parsing, chunking strategies
├── data-model.md        # Phase 1 output: Entities for chunks, queries, sessions
├── quickstart.md        # Phase 1 output: Local setup, .env config, testing guide
├── contracts/           # Phase 1 output: OpenAPI spec for /chat, /ingest, /health
└── checklists/
    └── requirements.md  # Existing spec validation checklist
```

### Source Code (repository root)

This project uses **Option 2: Web application** structure:

```text
backend/
├── src/
│   ├── main.py                    # FastAPI app entry point, CORS config
│   ├── config.py                  # Environment variables loader
│   ├── models/
│   │   ├── document.py            # SQLAlchemy models for document metadata
│   │   ├── query.py               # Pydantic models for API request/response
│   │   └── chunk.py               # Qdrant point schema definition
│   ├── services/
│   │   ├── embedding_service.py   # Cohere embedding wrapper
│   │   ├── vector_service.py      # Qdrant client, search operations
│   │   ├── generation_service.py  # OpenAI SDK (OpenRouter) chat completion
│   │   ├── ingestion_service.py   # MDX parsing, chunking, indexing pipeline
│   │   └── db_service.py          # Neon Postgres metadata operations
│   ├── api/
│   │   ├── chat.py                # POST /chat endpoint
│   │   ├── ingest.py              # POST /ingest endpoint
│   │   └── health.py              # GET /health endpoint
│   └── utils/
│       ├── chunking.py            # Text chunking logic (512 tokens, overlap)
│       ├── mdx_parser.py          # MDX to plain text parser
│       └── prompts.py             # System prompts for grounding, citation
├── scripts/
│   ├── ingest.py                  # Standalone ingestion script for book chapters
│   └── setup_db.py                # Initialize Neon Postgres tables
├── tests/
│   ├── unit/
│   │   ├── test_chunking.py
│   │   ├── test_embedding_service.py
│   │   └── test_mdx_parser.py
│   ├── integration/
│   │   ├── test_rag_pipeline.py   # End-to-end: ingest → query → response
│   │   └── test_api_endpoints.py
│   └── fixtures/
│       └── sample_chapter.mdx     # Test MDX content
├── .env.example                   # Placeholder secrets
├── .gitignore
├── Dockerfile                     # HF Spaces deployment
├── pyproject.toml                 # Poetry dependencies
└── README.md

frontend/ (existing Docusaurus book repo, modifications only)
├── src/
│   ├── components/
│   │   ├── ChatbotWidget/
│   │   │   ├── index.tsx          # Main chatbot component
│   │   │   ├── ChatInput.tsx      # User input field
│   │   │   ├── MessageList.tsx    # Conversation history display
│   │   │   ├── LoadingIndicator.tsx
│   │   │   └── styles.module.css
│   │   └── TextSelectionHelper/
│   │       └── index.tsx          # Captures text selection, triggers query
│   ├── services/
│   │   └── chatbotApi.ts          # Axios client for /chat endpoint
│   └── theme/
│       └── Root.tsx               # Inject ChatbotWidget globally
├── docusaurus.config.js           # Add backend API URL to config
├── package.json                   # Add axios dependency
└── tests/
    └── ChatbotWidget.test.tsx     # Jest tests for React component
```

**Structure Decision**: The project is split into backend (FastAPI) and frontend (Docusaurus) to align with the deployment strategy (HF Spaces + GitHub Pages). The backend follows FastAPI best practices with models, services, and API layers. The frontend integrates a custom React component into the existing Docusaurus book. This structure supports independent deployment, clear separation of concerns, and aligns with the constitution's modularity principle.

## Complexity Tracking

> **No violations to justify** - Constitution Check passed all gates.

---

## Phase 0: Research & Technical Discovery

**Objective**: Resolve technical unknowns and document best practices for RAG implementation, MDX parsing, chunking strategies, and Docusaurus plugin integration.

### Research Tasks

1. **RAG Pipeline Architecture**
   - Research best practices for RAG systems in educational contexts
   - Evaluate chunking strategies (semantic vs. fixed-size, overlap ratios)
   - Investigate prompt engineering patterns for grounding and citation
   - Decision needed: Optimal chunk size (512 tokens recommended in spec) and overlap percentage

2. **MDX Parsing and Content Extraction**
   - Research MDX parsing libraries (e.g., unified, remark, gray-matter)
   - Evaluate how to handle frontmatter, code blocks, images in MDX files
   - Decision needed: Clean text extraction approach (strip code blocks vs. include as context)

3. **Qdrant Collection Configuration**
   - Research Qdrant collection setup (vector size from Cohere model, distance metric)
   - Evaluate indexing strategies for metadata filtering (chapter, section)
   - Decision needed: Cohere embedding model (embed-english-v3.0 recommended, 1024 dimensions)

4. **Docusaurus Plugin Integration**
   - Research custom Docusaurus theme component patterns (theme swizzling vs. custom plugin)
   - Evaluate text selection capture mechanisms (window.getSelection(), browser compatibility)
   - Decision needed: Widget placement (floating button, sidebar, or navbar integration)

5. **OpenRouter API Configuration**
   - Research OpenAI SDK configuration for custom base URLs (OpenRouter endpoint)
   - Evaluate Devstral model capabilities and rate limits
   - Decision needed: Streaming vs. full response generation for chat endpoint

6. **Error Handling and Rate Limiting**
   - Research exponential backoff strategies for API rate limits
   - Evaluate graceful degradation patterns (fallback messages, queue systems)
   - Decision needed: Rate limiting implementation (per-IP, per-session, or none for MVP)

### Expected Outputs

- **research.md**: Consolidated findings for each research task with:
  - Decisions made (e.g., chunk size: 512 tokens with 50-token overlap)
  - Rationale for choices (e.g., balance retrieval granularity with context coherence)
  - Alternatives considered (e.g., 256 vs. 1024 token chunks)
  - References to documentation/best practices

**Deliverable**: `specs/001-rag-chatbot/research.md`

---

## Phase 1: Design & API Contracts

**Prerequisites**: `research.md` complete

**Objective**: Design data models, define API contracts, and create a quickstart guide for local development.

### Design Deliverables

#### 1. Data Model (`data-model.md`)

Define entities and their relationships based on spec requirements:

**Entities**:
- **ContentChunk**: Represents a 512-token segment of book content
  - Fields: chunk_id (UUID), text (str), embedding (vector[1024]), chapter_title (str), section_heading (str), chunk_index (int), source_file_path (str)
  - Stored in: Qdrant collection
  - Relationships: Belongs to one Book Chapter

- **DocumentMetadata**: Tracks indexed book chapters for change detection
  - Fields: id (int, primary key), file_path (str, unique), content_hash (str), last_indexed_at (timestamp), chunk_count (int)
  - Stored in: Neon Postgres
  - Relationships: References multiple ContentChunks

- **ChatQuery**: Represents a user's question (not persisted, request model only)
  - Fields: query (str, required), selected_text (str, optional), conversation_history (list[dict], optional)
  - Validation: query max 1000 tokens, selected_text max 5000 chars

- **ChatResponse**: Represents chatbot's answer (not persisted, response model only)
  - Fields: response (str), source_chunks (list[dict], contains chapter + section citations), mode (str, "rag" or "selected_text"), timestamp (str)

- **ConversationSession**: Browser-session conversation history (not persisted backend, frontend sessionStorage only)
  - Fields: session_id (UUID), messages (list[{role, content, timestamp}]), created_at (timestamp)

**Validation Rules**:
- Query text must not exceed 1000 tokens (per spec constraint)
- Selected text must not exceed 5000 characters (reasonable browser limit)
- Chunk embeddings must be 1024 dimensions (Cohere embed-english-v3.0)
- Content hashes use SHA-256 for change detection

**State Transitions**:
- Document: unindexed → indexing → indexed → stale (hash mismatch) → re-indexing
- Query: submitted → embedding → retrieval (if RAG mode) → generation → responded

#### 2. API Contracts (`contracts/`)

Generate OpenAPI 3.0 specification for three endpoints:

**Endpoint 1: POST /chat**
- Request Body: `{query: string, selected_text?: string, conversation_history?: [{role, content}]}`
- Response: `{response: string, source_chunks: [{chapter, section, snippet}], mode: "rag"|"selected_text", timestamp: string}`
- Status Codes: 200 (success), 400 (invalid query), 429 (rate limit), 500 (server error)
- Description: Main chatbot interaction endpoint; supports dual query modes

**Endpoint 2: POST /ingest**
- Request Body: `{content_dir?: string}` (optional path to book chapters)
- Response: `{indexed_files: number, total_chunks: number, duration_seconds: number}`
- Status Codes: 200 (success), 409 (already indexing), 500 (error)
- Description: Triggers book content ingestion and indexing to Qdrant
- Note: Typically run on deployment; may be protected or admin-only

**Endpoint 3: GET /health**
- Response: `{status: "healthy", version: string, services: {qdrant, neon, cohere, openrouter}}`
- Status Codes: 200 (all services up), 503 (degraded)
- Description: Health check for monitoring; returns status of external dependencies

**Contract Files**:
- `contracts/openapi.yaml`: Full OpenAPI 3.0 spec
- `contracts/chat-examples.json`: Sample request/response pairs for testing

#### 3. Quickstart Guide (`quickstart.md`)

Step-by-step guide for local development:

**Setup**:
1. Clone repo and checkout `001-rag-chatbot` branch
2. Backend: Install Python 3.11+, create virtualenv, install dependencies (`poetry install` or `pip install -r requirements.txt`)
3. Frontend: Install Node.js 18+, run `npm install` in Docusaurus directory
4. Create `.env` file with API keys (see `.env.example`)
5. Initialize Neon database: `python scripts/setup_db.py`

**Run Locally**:
1. Backend: `uvicorn src.main:app --reload --port 8000`
2. Frontend: `npm start` in Docusaurus directory (proxies API to localhost:8000 in dev mode)
3. Ingest sample chapters: `python scripts/ingest.py --content-dir ./sample_chapters`
4. Open `http://localhost:3000`, test chatbot widget

**Testing**:
- Backend unit tests: `pytest tests/unit`
- Backend integration tests: `pytest tests/integration`
- Frontend tests: `npm test` in Docusaurus directory
- Manual E2E: Follow acceptance scenarios in spec.md

**Common Issues**:
- CORS errors: Ensure `CORS_ORIGINS` in .env includes `http://localhost:3000`
- Qdrant connection: Verify `QDRANT_URL` and `QDRANT_API_KEY` are correct
- Empty responses: Check if content is indexed (call `/ingest` endpoint)

**Deliverable**: `specs/001-rag-chatbot/quickstart.md`

#### 4. Agent Context Update

Run agent context update script to add new technologies from this plan to the agent-specific context file:

```bash
.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude
```

This will update `.specify/memory/CLAUDE.md` (or equivalent) to include:
- FastAPI with Uvicorn
- Qdrant vector database
- Cohere embeddings API
- OpenAI SDK with OpenRouter
- Neon Serverless Postgres
- Docusaurus custom React components

**Deliverable**: Updated `.specify/memory/CLAUDE.md`

---

## Phase 2: Summary & Next Steps

**Deliverables from `/sp.plan`**:
- ✅ `plan.md` (this file) - Architecture and design decisions
- ✅ `research.md` - Technical research findings
- ✅ `data-model.md` - Entity definitions and validation rules
- ✅ `contracts/` - OpenAPI specs and example payloads
- ✅ `quickstart.md` - Local development guide
- ✅ Updated agent context file

**Constitution Re-Check**: All principles remain satisfied after Phase 1 design. No complexity violations introduced.

**Ready for `/sp.tasks`**: This plan provides sufficient detail to generate actionable, testable tasks. The next command (`/sp.tasks`) will break down implementation into:
- Phase 1: Setup (backend scaffold, .env, Dockerfile, dependencies)
- Phase 2: Foundational (Qdrant setup, Neon schema, service layer architecture)
- Phase 3: User Story 1 (full-book RAG mode with ingestion, retrieval, generation)
- Phase 4: User Story 2 (selected-text mode with context isolation)
- Phase 5: User Story 3 (conversation history display in widget)
- Phase 6: Testing & Deployment (pytest, Jest, HF Spaces, GitHub Pages integration)

**Estimated Timeline**: 7 days (per user's /sp.plan input)
- Days 1-2: Backend scaffold, RAG pipeline core
- Days 3-4: Ingestion script, /chat endpoint, generation service
- Day 5: Frontend chatbot widget, text selection
- Days 6-7: Testing, deployment, E2E verification

**Risk Mitigations**:
- Rate limits (Cohere/OpenRouter): Implement exponential backoff, monitor free-tier quotas
- Cold starts (HF Spaces): Accept initial latency, inform users via loading indicator
- Content changes: Document re-ingestion process in quickstart.md
- CORS issues: Test early with localhost:3000 → localhost:8000 setup

**Approval**: This plan is complete and ready for task generation. All unknowns from Technical Context resolved via Phase 0 research. Constitution compliance verified. Next: run `/sp.tasks` to generate task list.
