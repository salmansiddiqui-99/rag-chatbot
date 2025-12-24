---
id: 002
title: Create RAG chatbot implementation plan
stage: plan
date: 2025-12-22
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-rag-chatbot
branch: 001-rag-chatbot
user: salmansiddiqui-99
command: /sp.plan
labels: ["plan", "architecture", "rag", "chatbot", "fastapi", "docusaurus"]
links:
  spec: specs/001-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-rag-chatbot/plan.md
  - specs/001-rag-chatbot/research.md
  - specs/001-rag-chatbot/data-model.md
  - specs/001-rag-chatbot/contracts/openapi.yaml
  - specs/001-rag-chatbot/contracts/chat-examples.json
  - specs/001-rag-chatbot/quickstart.md
  - CLAUDE.md (updated context)
tests:
  - Constitution Check: ALL PASSED (6/6 principles)
---

## Prompt

User provided comprehensive /sp.plan input with 4 phases:
1. Project Setup and Backend Scaffold (Days 1-2): FastAPI, environment variables, Dockerfile, Hugging Face Spaces config
2. RAG Pipeline Implementation (Days 3-4): Ingestion script (MDX parsing, chunking, embedding, Qdrant storage), /chat endpoint, generation service
3. Frontend Chatbot Widget Integration (Day 5): React component, text selection capture, API calls, Docusaurus swizzling
4. Testing, Deployment, and Verification (Days 6-7): pytest, Jest, E2E validation, HF Spaces deployment, GitHub Pages integration

Tech stack specified: Python 3.11+ backend (FastAPI, Qdrant, Cohere, OpenAI SDK via OpenRouter, Neon Postgres), Node.js frontend (Docusaurus 2+, React, axios), Docker deployment to HF Spaces.

## Response snapshot

Created comprehensive implementation plan with:

**Technical Context** (all resolved, no NEEDS CLARIFICATION):
- Languages: Python 3.11+ (backend), Node.js 18+ (frontend)
- Dependencies: FastAPI, Uvicorn, qdrant-client, cohere, openai (OpenRouter), SQLAlchemy, psycopg2, Docusaurus, React, axios
- Storage: Qdrant Cloud (1GB free), Neon Serverless Postgres (512MB free)
- Testing: pytest (backend), Jest (frontend), manual E2E
- Performance: <3s response time (p95), 100 concurrent users, >85% retrieval precision

**Constitution Check**: ✅ ALL GATES PASSED (6/6 principles)
1. Technical Accuracy: RAG >95% accuracy, citations required, grounding prompts prevent hallucinations
2. User-Centric: Personalization out of scope (separate feature); chatbot adapts to query context
3. Scalability: FastAPI modular architecture, RAG pipeline encapsulated, service layer abstraction
4. Security: No user data collected, API keys in .env/HF Secrets, CORS restricted, rate limiting, HTTPS enforced
5. Open-Source: Free-tier stack (FastAPI, Docusaurus, Qdrant, Cohere, OpenRouter free model), HF Spaces deployment
6. Inclusivity: ARIA labels, keyboard navigation, mobile-responsive (Urdu translation out of scope per spec)

**Project Structure**: Web application (backend + frontend)
- Backend: FastAPI with models/, services/, api/, utils/, scripts/, tests/ (unit, integration, fixtures)
- Frontend: Docusaurus with ChatbotWidget/, TextSelectionHelper/, chatbotApi service, theme/Root.tsx swizzling

**Phase 0: Research** (6 decisions documented):
1. Chunk size: 512 tokens, 50-token overlap (fixed-size sliding window)
2. MDX parsing: unified + remark ecosystem, strip code blocks and images
3. Qdrant: Cohere embed-english-v3.0 (1024 dims), cosine similarity, HNSW index
4. Docusaurus: Swizzle Root.tsx, floating button widget, window.getSelection() for text capture
5. OpenRouter: OpenAI SDK with custom base_url, full response (streaming deferred to post-MVP)
6. Error handling: Client-side exponential backoff, user-friendly fallback messages, no backend rate limiting for MVP

**Phase 1: Design Artifacts**:
1. **data-model.md**: 5 entities defined
   - ContentChunk (Qdrant): chunk_id, text, embedding[1024], chapter_title, section_heading, chunk_index, source_file_path
   - DocumentMetadata (Neon Postgres): id, file_path, content_hash (SHA-256), last_indexed_at, chunk_count (state machine: unindexed → indexing → indexed → stale → re-indexing)
   - ChatQuery (API request): query (max 1000 tokens), selected_text (max 5000 chars), conversation_history (max 10 messages)
   - ChatResponse (API response): response, source_chunks[{chapter, section, snippet}], mode (rag/selected_text), timestamp
   - ConversationSession (frontend sessionStorage): session_id, messages[], created_at

2. **contracts/openapi.yaml**: OpenAPI 3.0 spec with 3 endpoints
   - POST /chat: Dual-mode (RAG with top-5 chunks or selected-text), conversation history support, 200/400/429/500 status codes
   - POST /ingest: Trigger content indexing, returns indexed_files/total_chunks/duration, 200/409/500 status codes
   - GET /health: Service health check, returns status + external dependencies (qdrant, neon, cohere, openrouter), 200/503 status codes

3. **contracts/chat-examples.json**: 11 test cases
   - Simple RAG, selected-text simplification, follow-up with context, out-of-scope query, multi-chapter query, selected-text summary, specific chapter query, definition, comparison, empty text error, query too long error

4. **quickstart.md**: Step-by-step local development guide
   - Backend setup: venv, Poetry/pip, .env config (5 API keys), database init, uvicorn server, ingestion script
   - Frontend setup: npm install, docusaurus.config.js backend URL, npm start
   - Testing: 4 test scenarios (health check, RAG query, selected-text query, widget interaction), pytest, Jest, manual E2E
   - Troubleshooting: 8 common issues (CORS, Qdrant timeout, empty responses, rate limits, token count, DB migration, widget not appearing, slow embeddings)

5. **Agent context update**: Updated CLAUDE.md with Python 3.11+ (backend), Node.js 18+ (frontend), web application project type

**Ready for /sp.tasks**: Plan provides sufficient detail for task generation
- Estimated timeline: 7 days (setup: 2 days, RAG pipeline: 2 days, frontend: 1 day, testing/deployment: 2 days)
- No complexity violations; no NEEDS CLARIFICATION markers remaining

## Outcome

- ✅ Impact: Created production-ready implementation plan with architecture, data models, API contracts, local dev guide, and research findings; all constitution gates passed
- 🧪 Tests: Constitution Check PASSED (6/6 principles); test examples created for 11 scenarios
- 📁 Files: Created 7 files (plan.md, research.md, data-model.md, openapi.yaml, chat-examples.json, quickstart.md, updated CLAUDE.md)
- 🔁 Next prompts: `/sp.tasks` to generate actionable task list from plan (6 phases: setup, foundational, 3 user stories, testing/deployment)
- 🧠 Reflection: Plan comprehensively addresses dual-mode RAG (full-book + selected-text) with detailed technical decisions from research phase. All unknowns resolved; ready for implementation task breakdown.

## Evaluation notes (flywheel)

- Failure modes observed: None - user-provided plan input successfully structured into complete architecture with research, data models, contracts, and quickstart guide
- Graders run and results (PASS/FAIL): Constitution Check PASS (6/6 principles validated against spec requirements)
- Prompt variant (if applicable): Standard plan generation with comprehensive user-provided phase structure
- Next experiment (smallest change to try): During /sp.tasks, validate chunking logic handles edge cases (code blocks in MDX, nested headings, frontmatter); ensure ingestion script includes hash computation for change detection
