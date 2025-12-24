---
id: 003
title: Generate RAG chatbot implementation tasks
stage: tasks
date: 2025-12-22
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-rag-chatbot
branch: 001-rag-chatbot
user: salmansiddiqui-99
command: /sp.tasks
labels: ["tasks", "implementation", "rag", "chatbot", "breakdown"]
links:
  spec: specs/001-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-rag-chatbot/tasks.md
tests:
  - Task organization: 9 phases, 105 tasks total
---

## Prompt

User provided comprehensive /sp.tasks input with detailed task breakdown:
- Phase 1: Project Setup and Backend Scaffold (6 tasks, ~3.5 hours)
- Phase 2: RAG Pipeline Implementation (7 tasks, ingestion script, /chat endpoint, generation service)
- Phase 3: Frontend Chatbot Widget Integration (4 tasks, React components, text selection)
- Phase 4: Testing, Deployment, and Verification (3 tasks, pytest, manual E2E, HF Spaces deployment)

Estimated total: 24 tasks, ~45 hours over 7 days.

## Response snapshot

Generated comprehensive tasks.md with 105 tasks organized into 9 phases:

**Phase 1: Setup (6 tasks, 3.5 hours)** - Shared infrastructure
- T001-T006: Backend repo, Python project structure, dependencies, .env files, venv setup

**Phase 2: Foundational (16 tasks, 10 hours)** - Blocking prerequisites
- T007-T022: FastAPI app, /health endpoint, Dockerfile, config.py, SQLAlchemy models (DocumentMetadata), Pydantic models (ChatQuery/Response), Neon schema setup, service layer (db_service, embedding_service, vector_service), utilities (chunking, MDX parser, prompts)
- ⚠️ CRITICAL: Must complete before ANY user story work begins

**Phase 3: User Story 1 - Ask General Questions (14 tasks, 12 hours)** 🎯 MVP
- T023-T036: Ingestion script (parse MDX, chunk 512 tokens, embed with Cohere, upsert to Qdrant/Neon), POST /ingest endpoint, generation_service (OpenRouter + Devstral), POST /chat endpoint (RAG mode: embed query → Qdrant search → generate with citations), error handling, testing (10 queries, >90% accuracy)
- Independent test: "What is ROS 2?" returns synthesized answer with chapter citations

**Phase 4: User Story 2 - Selected Text Questions (5 tasks, 2 hours)**
- T037-T041: Extend /chat endpoint for selected-text mode (skip retrieval, use selected_text as context), validation (max 5000 chars), mode="selected_text" response
- Independent test: Select paragraph → "Explain this" → response based only on selection

**Phase 5: User Story 3 - Conversation History (8 tasks, 6 hours)**
- T042-T049: React components (ChatbotWidget/index.tsx, ChatInput.tsx, MessageList.tsx with timestamps/citations, LoadingIndicator.tsx), sessionStorage persistence (max 50 messages), keyboard accessibility (Tab, Enter, Escape, ARIA labels), styling (Docusaurus theme match, mobile-responsive)
- Independent test: Ask 5 questions → scroll history → close/reopen (persists) → refresh (new session)

**Phase 6: Frontend Integration & Text Selection (16 tasks, 8 hours)**
- T050-T065: chatbotApi.ts service (axios, exponential backoff for 429), connect widget to API, TextSelectionHelper (window.getSelection(), "Ask about selection" button), swizzle Root.tsx, docusaurus.config.js backend URL, npm install axios, local testing, mobile responsiveness
- Checkpoint: Widget on all pages, both query modes work, text selection functional

**Phase 7: Testing & QA (14 tasks, 7 hours)**
- T066-T079: Backend unit tests (chunking, MDX parser, embedding_service), integration tests (RAG pipeline, API endpoints), pytest with >80% coverage, frontend tests (ChatbotWidget.test.tsx), Jest coverage, manual E2E (3 user stories from spec.md), edge cases (token limit, special chars, Qdrant unreachable, rate limits), performance test (20 concurrent queries, <3s p95), accessibility (keyboard, screen reader, WCAG 2.1 AA)

**Phase 8: Deployment & Production Verification (15 tasks, 4 hours)**
- T080-T094: Create HF Space (Docker), link GitHub repo, add secrets (5 API keys + CORS), push code, test /health, run /ingest (production), test /chat, update docusaurus.config.js for production URL, build frontend, deploy to GitHub Pages, E2E on live site (5 general + 2 selected-text queries), verify CORS, performance check, mobile verification

**Phase 9: Documentation & Polish (11 tasks, 4 hours)**
- T095-T105: backend/README.md, frontend/README.md, inline docstrings/JSDoc, architecture diagram (Mermaid/draw.io), update quickstart.md, TROUBLESHOOTING.md, logging (Python logging module), optional rate limiting (SlowAPI), optimize Qdrant queries, frontend polish (skeleton, error styling, "Clear history"), accessibility improvements (NVDA/JAWS testing)

**Task Organization Features**:
- **[P] tags**: 15 tasks can run in parallel (different files, no dependencies)
- **[Story] labels**: SETUP (6), FOUND (16), US1 (14), US2 (5), US3 (8), FRONTEND (16), TEST (14), DEPLOY (15), DOC (11)
- **Exact file paths**: Every task includes specific paths for Claude Code CLI (e.g., `backend/src/api/chat.py`, `frontend/src/components/ChatbotWidget/index.tsx`)
- **Acceptance criteria**: Each task has clear validation (e.g., "pytest passes with >80% coverage", "curl returns 200 with citations")

**Dependencies & Execution Order**:
- Sequential: Setup → Foundational → US1 → Frontend Integration → Testing → Deployment
- Parallel opportunities: Within Foundational (T017-T022), US3 components (T042-T045), unit tests (T066-T068), docs (T095-T098)
- Critical path: 7 days assuming 6-7 hours/day
- MVP path: Setup + Foundational + US1 + minimal frontend → deployable in 3-4 days

**Timeline Breakdown**:
| Phase | Hours | Days |
|-------|-------|------|
| Setup | 3.5 | Day 1 morning |
| Foundational | 10 | Day 1 afternoon - Day 2 |
| US1 (RAG) | 12 | Day 3 - Day 4 morning |
| US2 (Selected Text) | 2 | Day 4 afternoon |
| US3 (History) | 6 | Day 4 evening - Day 5 morning |
| Frontend Integration | 8 | Day 5 afternoon - Day 6 morning |
| Testing | 7 | Day 6 afternoon |
| Deployment | 4 | Day 6 evening - Day 7 morning |
| Documentation | 4 | Day 7 afternoon |
| **Total** | **45 hours** | **7 days** |

**Implementation Strategies Documented**:
1. **MVP First**: Setup + Foundational + US1 only → Deploy → Validate
2. **Incremental**: Add US1 → Test → US2 → Test → US3 → Full deployment
3. **Parallel Team**: Dev A (backend T001-T041), Dev B (frontend T042-T065) simultaneously after Foundational complete

**Ready for /sp.implement**: Tasks.md provides atomic, testable tasks with exact file paths for Claude Code CLI code generation.

## Outcome

- ✅ Impact: Created production-ready task breakdown with 105 atomic, testable tasks across 9 phases; organized by user story for independent implementation; includes exact file paths, acceptance criteria, time estimates
- 🧪 Tests: 14 test tasks (T066-T079) covering unit, integration, E2E, performance, accessibility; targets >80% coverage
- 📁 Files: Created 1 file (specs/001-rag-chatbot/tasks.md)
- 🔁 Next prompts: `/sp.implement` to begin execution with Claude Code CLI assistance starting from T001
- 🧠 Reflection: Task list comprehensively breaks down 7-day implementation into actionable steps. Parallel opportunities identified (15 [P] tags). Critical path clear: Setup → Foundational (blocker) → US1 (MVP) → Frontend → Testing → Deployment. All tasks reference plan.md architecture and spec.md acceptance scenarios.

## Evaluation notes (flywheel)

- Failure modes observed: None - user-provided task input successfully expanded into granular 105-task breakdown with phasing, dependencies, and time estimates
- Graders run and results (PASS/FAIL): Task validation PASS - all tasks have acceptance criteria, file paths, story labels, time estimates
- Prompt variant (if applicable): Standard tasks generation from plan + user task outline
- Next experiment (smallest change to try): During /sp.implement, validate T023-T025 (ingestion script) handles edge cases from research.md (frontmatter, code blocks, nested headings); ensure SHA-256 hash computation (T023) matches data-model.md specification
