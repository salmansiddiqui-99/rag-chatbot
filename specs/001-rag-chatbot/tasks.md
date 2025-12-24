# Tasks: Integrated RAG Chatbot for Physical AI Book

**Input**: Design documents from `/specs/001-rag-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, SETUP, FOUND for foundational)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths shown below use web application structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 [SETUP] Create backend repository directory at `backend/` with README.md describing RAG chatbot project
- [ ] T002 [SETUP] Initialize Python project structure: Create `backend/src/`, `backend/scripts/`, `backend/tests/`, `backend/.gitignore`
- [ ] T003 [P] [SETUP] Create `backend/pyproject.toml` or `backend/requirements.txt` with dependencies: fastapi==0.104.1, uvicorn==0.24.0, qdrant-client==1.7.0, cohere==4.37, openai==1.6.1, python-dotenv==1.0.0, sqlalchemy==2.0.23, psycopg2-binary==2.9.9, tiktoken==0.5.2, pytest==7.4.3
- [ ] T004 [P] [SETUP] Create `backend/.env.example` with placeholder keys: OPENROUTER_API_KEY, COHERE_API_KEY, QDRANT_URL, QDRANT_API_KEY, NEON_DB_URL, CORS_ORIGINS
- [ ] T005 [SETUP] Create `backend/.env` (copy from .env.example) and add to .gitignore; populate with actual API keys
- [ ] T006 [SETUP] Create virtual environment in backend/, install dependencies via `pip install -r requirements.txt`, verify no conflicts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 [FOUND] Create `backend/src/main.py` with FastAPI app instance, load environment variables via python-dotenv, configure CORS middleware for GitHub Pages origin
- [ ] T008 [FOUND] Add GET `/health` endpoint in `backend/src/api/health.py` returning `{status, version, services: {qdrant, neon, cohere, openrouter}}` with connectivity checks
- [ ] T009 [FOUND] Verify FastAPI server runs locally: `uvicorn backend.src.main:app --reload --port 8000`, test /health and /docs endpoints accessible
- [ ] T010 [FOUND] Create `backend/Dockerfile` with python:3.11-slim base, COPY code, RUN pip install, EXPOSE 8000, CMD uvicorn
- [ ] T011 [FOUND] Test Docker build: `docker build -t rag-chatbot backend/` and run container, verify /health endpoint accessible
- [ ] T012 [FOUND] Create `backend/src/config.py` to load and validate environment variables (check all required keys present)
- [ ] T013 [FOUND] Create `backend/src/models/document.py` with SQLAlchemy DocumentMetadata model (id, file_path unique, content_hash, last_indexed_at, chunk_count)
- [ ] T014 [FOUND] Create `backend/src/models/query.py` with Pydantic models: ChatQuery (query, selected_text optional, conversation_history optional with validation) and ChatResponse (response, source_chunks, mode enum, timestamp)
- [ ] T015 [FOUND] Create `backend/scripts/setup_db.py` to initialize Neon Postgres: CREATE TABLE document_metadata with indexes on file_path and last_indexed_at
- [ ] T016 [FOUND] Run `python backend/scripts/setup_db.py` to create database schema; verify table exists in Neon dashboard
- [ ] T017 [P] [FOUND] Create `backend/src/services/db_service.py` with functions: get_document_metadata(file_path), upsert_document_metadata(file_path, content_hash, chunk_count)
- [ ] T018 [P] [FOUND] Create `backend/src/services/embedding_service.py` with Cohere client wrapper: embed_text(text) returns 1024-dim vector, embed_batch(texts) for efficiency
- [ ] T019 [P] [FOUND] Create `backend/src/services/vector_service.py` with Qdrant client: create_collection(physical_ai_book, 1024 dims, cosine distance), upsert_chunks(chunks), search(query_vector, limit=5)
- [ ] T020 [FOUND] Create `backend/src/utils/chunking.py` with chunk_text(text, chunk_size=512, overlap=50) function using tiktoken for accurate token counting
- [ ] T021 [FOUND] Create `backend/src/utils/mdx_parser.py` with parse_mdx(file_path) function using unified + remark to extract plain text, strip code blocks/images, extract headings
- [ ] T022 [FOUND] Create `backend/src/utils/prompts.py` with system prompt templates for grounding (use ONLY provided context) and selected-text mode

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Ask General Questions About Book Content (Priority: P1) 🎯 MVP

**Goal**: Enable readers to ask questions about book content and receive synthesized answers with citations from relevant chapters

**Independent Test**: Load chatbot widget, ask "What is ROS 2 and how is it used in humanoid robotics?", verify response synthesizes info from multiple indexed chapters with citations

### Implementation for User Story 1

- [ ] T023 [US1] Create `backend/scripts/ingest.py` script: Parse MDX files from specified directory, chunk content using chunking.py (512 tokens, 50 overlap), compute SHA-256 hash per file
- [ ] T024 [US1] In `backend/scripts/ingest.py`: For each chunk, call embedding_service.embed_text(), create payload with {chunk_id, text, chapter_title, section_heading, chunk_index, source_file_path}
- [ ] T025 [US1] In `backend/scripts/ingest.py`: Upsert chunks to Qdrant via vector_service.upsert_chunks(), store metadata in Neon via db_service.upsert_document_metadata()
- [ ] T026 [US1] Test ingestion script manually: `python backend/scripts/ingest.py --content-dir ../sample_chapters`, verify Qdrant dashboard shows ~487 chunks, Neon shows 12 documents
- [ ] T027 [US1] Create POST `/ingest` endpoint in `backend/src/api/ingest.py`: Trigger scripts/ingest.py logic, return {indexed_files, total_chunks, duration_seconds}, handle 409 if already indexing
- [ ] T028 [US1] Create `backend/src/services/generation_service.py`: Initialize OpenAI client with base_url="https://openrouter.ai/api/v1", model="mistralai/devstral-2512:free"
- [ ] T029 [US1] In `backend/src/services/generation_service.py`: Implement generate_response(prompt, context, conversation_history) function, handle rate limit errors (429), return response text
- [ ] T030 [US1] Create POST `/chat` endpoint in `backend/src/api/chat.py`: Accept ChatQuery, validate token count (max 1000), determine mode (RAG if no selected_text)
- [ ] T031 [US1] In `backend/src/api/chat.py` (RAG mode): Embed query via embedding_service, search Qdrant top-5 chunks via vector_service, build prompt with retrieved context using prompts.py
- [ ] T032 [US1] In `backend/src/api/chat.py` (RAG mode): Call generation_service.generate_response() with grounding prompt + retrieved chunks, format source_chunks with chapter/section/snippet
- [ ] T033 [US1] In `backend/src/api/chat.py`: Return ChatResponse with response text, source_chunks array, mode="rag", timestamp (ISO 8601)
- [ ] T034 [US1] Add error handling in `/chat`: Catch validation errors (400), rate limits (429), AI service errors (500), return user-friendly error messages per data-model.md
- [ ] T035 [US1] Test `/chat` endpoint locally: `curl -X POST http://localhost:8000/chat -d '{"query":"What are actuators?"}'`, verify response includes citations and mode="rag"
- [ ] T036 [US1] Test RAG accuracy: Submit 10 test queries from contracts/chat-examples.json, verify >90% provide relevant answers with citations

**Checkpoint**: At this point, User Story 1 should be fully functional - backend indexes book content and answers general queries with citations

---

## Phase 4: User Story 2 - Ask Questions About Selected Text (Priority: P2)

**Goal**: Enable readers to select text and ask questions based solely on that selection (no additional retrieval)

**Independent Test**: Select paragraph on book page, click "Ask about this selection", ask "Explain this in simpler terms", verify response based only on selected text

### Implementation for User Story 2

- [ ] T037 [US2] In `backend/src/api/chat.py` (selected-text mode): If selected_text provided in ChatQuery, skip Qdrant search, use selected_text directly as context
- [ ] T038 [US2] In `backend/src/api/chat.py` (selected-text mode): Build prompt with "Selected text: {selected_text}" using prompts.py template, call generation_service
- [ ] T039 [US2] In `backend/src/api/chat.py` (selected-text mode): Return ChatResponse with mode="selected_text", empty source_chunks array (no retrieval)
- [ ] T040 [US2] Add validation: Ensure selected_text max 5000 characters, return 400 if exceeded
- [ ] T041 [US2] Test selected-text mode: `curl -X POST http://localhost:8000/chat -d '{"query":"Explain this","selected_text":"Hydraulic actuators use pressurized fluid..."}'`, verify mode="selected_text" and no source_chunks

**Checkpoint**: At this point, User Story 2 should be functional - chatbot handles selected-text queries independently from RAG mode

---

## Phase 5: User Story 3 - View Conversation History and Navigate Responses (Priority: P3)

**Goal**: Enable readers to scroll through chat history and review previous exchanges

**Independent Test**: Ask 3-5 questions in sequence, scroll up in chat widget, verify all exchanges visible with timestamps

### Implementation for User Story 3 (Frontend Focus)

- [ ] T042 [P] [US3] Create `frontend/src/components/ChatbotWidget/index.tsx` with React state for messages array, input value, loading state, widget open/closed state
- [ ] T043 [P] [US3] Create `frontend/src/components/ChatbotWidget/ChatInput.tsx` with textarea for user input, submit button, character count (warn if approaching 1000 tokens)
- [ ] T044 [P] [US3] Create `frontend/src/components/ChatbotWidget/MessageList.tsx` with scrollable message history, display user/assistant messages with timestamps, render citations as clickable links
- [ ] T045 [P] [US3] Create `frontend/src/components/ChatbotWidget/LoadingIndicator.tsx` with animated dots/spinner for "Thinking..." state
- [ ] T046 [US3] In `frontend/src/components/ChatbotWidget/index.tsx`: Implement sessionStorage persistence - load conversation on mount, save after each message (max 50 messages)
- [ ] T047 [US3] Add keyboard accessibility in ChatbotWidget: Tab navigation, Enter to send, Escape to close, ARIA labels for screen readers per FR-019
- [ ] T048 [US3] Style ChatbotWidget with `frontend/src/components/ChatbotWidget/styles.module.css`: Match Docusaurus theme, mobile-responsive (min-width 320px)
- [ ] T049 [US3] Test conversation history: Ask 5 questions, close widget, reopen, verify history persists; refresh page, verify new session starts

**Checkpoint**: User Story 3 complete - conversation history displays and persists within session

---

## Phase 6: Frontend Integration & Text Selection

**Purpose**: Integrate chatbot widget into Docusaurus and enable text selection capture

- [ ] T050 [FRONTEND] Create `frontend/src/services/chatbotApi.ts` with axios client: sendQuery(query, selected_text, conversation_history) calling POST /chat, exponential backoff for 429 errors (60s, 120s, 180s retries)
- [ ] T051 [FRONTEND] In `frontend/src/services/chatbotApi.ts`: Add error mapping function mapErrorMessage() converting status codes to user-friendly messages per quickstart.md
- [ ] T052 [FRONTEND] Connect ChatbotWidget to chatbotApi: On submit, call sendQuery(), update messages state with user query and loading indicator
- [ ] T053 [FRONTEND] In ChatbotWidget: On API response, add assistant message to state, save to sessionStorage, clear loading indicator; on error, show error message
- [ ] T054 [FRONTEND] Create `frontend/src/components/TextSelectionHelper/index.tsx` with window.getSelection() listener on document.mouseup event
- [ ] T055 [FRONTEND] In TextSelectionHelper: When text selected (>10 chars), show "Ask about this selection" button positioned near selection using getBoundingClientRect()
- [ ] T056 [FRONTEND] In TextSelectionHelper: On button click, open ChatbotWidget with selected_text pre-populated, set mode indicator (e.g., badge "Selected Text Mode")
- [ ] T057 [FRONTEND] Handle text selection edge cases: Multi-element spans, special characters, embedded code blocks (clean with .trim())
- [ ] T058 [FRONTEND] Swizzle Docusaurus Root component: Run `npm run swizzle @docusaurus/theme-classic Root -- --wrap` in frontend/
- [ ] T059 [FRONTEND] Edit `frontend/src/theme/Root.tsx` to wrap children with ChatbotWidget and TextSelectionHelper components for global availability
- [ ] T060 [FRONTEND] Update `frontend/docusaurus.config.js`: Add customFields.backendApiUrl for local (http://localhost:8000) and production (https://your-hf-space.hf.space)
- [ ] T061 [FRONTEND] Add axios dependency: `npm install axios` in frontend/, verify package.json updated
- [ ] T062 [FRONTEND] Start Docusaurus dev server: `npm start` in frontend/, verify chatbot button appears on http://localhost:3000
- [ ] T063 [FRONTEND] Test widget UI: Click button, chat panel opens; type query, send, verify loading indicator; receive response, verify display
- [ ] T064 [FRONTEND] Test text selection: Select paragraph on any page, click "Ask about this", verify chat opens with selection, submit question, verify response
- [ ] T065 [FRONTEND] Test mobile responsiveness: Open on mobile viewport (320px width), verify widget usable, input accessible, no layout breaks

**Checkpoint**: Frontend fully integrated - widget appears on all pages, handles both query modes, text selection works

---

## Phase 7: Testing & Quality Assurance

**Purpose**: Comprehensive testing to meet 90%+ coverage and validate all acceptance scenarios

- [ ] T066 [P] [TEST] Write unit tests in `backend/tests/unit/test_chunking.py`: Test chunk_text() with various inputs (512 tokens, 1024 tokens, edge cases with special chars)
- [ ] T067 [P] [TEST] Write unit tests in `backend/tests/unit/test_mdx_parser.py`: Test parse_mdx() strips code blocks, extracts headings, handles frontmatter
- [ ] T068 [P] [TEST] Write unit tests in `backend/tests/unit/test_embedding_service.py`: Mock Cohere API, test embed_text() and embed_batch() return 1024-dim vectors
- [ ] T069 [TEST] Write integration tests in `backend/tests/integration/test_rag_pipeline.py`: End-to-end ingest → query → response flow with mock sample_chapter.mdx
- [ ] T070 [TEST] Write integration tests in `backend/tests/integration/test_api_endpoints.py`: Test POST /chat (RAG and selected-text modes), POST /ingest, GET /health
- [ ] T071 [TEST] Run backend tests: `pytest backend/tests/` with coverage `pytest --cov=backend/src`, verify >80% coverage, all tests pass
- [ ] T072 [P] [TEST] Write frontend tests in `frontend/tests/ChatbotWidget.test.tsx`: Test component renders, sends queries, displays responses, handles errors
- [ ] T073 [TEST] Run frontend tests: `npm test` in frontend/, verify tests pass, check coverage with `npm test -- --coverage`
- [ ] T074 [TEST] Manual E2E test - User Story 1 (P1): Open widget, ask 10 general queries from chat-examples.json, verify >90% accurate with citations, time responses (<3s each)
- [ ] T075 [TEST] Manual E2E test - User Story 2 (P2): Select 5 different text passages, ask questions, verify responses based only on selection (no external retrieval), mode="selected_text"
- [ ] T076 [TEST] Manual E2E test - User Story 3 (P3): Ask 5 questions, scroll history, close/reopen widget (history persists), refresh page (new session starts), verify all scenarios from spec.md
- [ ] T077 [TEST] Test edge cases from spec.md: Query >1000 tokens (400 error), special characters, Qdrant unreachable (500 error), rate limit (429 with retry), empty selected text (400)
- [ ] T078 [TEST] Performance test: Submit 20 concurrent queries (simulate multiple users), verify <3s response time for 95% (p95 latency), no crashes
- [ ] T079 [TEST] Accessibility test: Navigate widget with keyboard only (Tab, Enter, Escape), verify ARIA labels with screen reader (e.g., NVDA, JAWS), check color contrast (WCAG 2.1 AA)

**Checkpoint**: All tests passing, >90% coverage, acceptance scenarios validated

---

## Phase 8: Deployment & Production Verification

**Purpose**: Deploy backend to Hugging Face Spaces, update frontend to use production API, verify live system

- [ ] T080 [DEPLOY] Create Hugging Face Space: Sign up/login at hf.co, create new Docker Space named "physical-ai-book-rag"
- [ ] T081 [DEPLOY] Link HF Space to GitHub repo: In Space settings, connect to backend/ directory or push backend code to HF repo
- [ ] T082 [DEPLOY] Add secrets in HF Space settings: OPENROUTER_API_KEY, COHERE_API_KEY, QDRANT_URL, QDRANT_API_KEY, NEON_DB_URL, CORS_ORIGINS (include github.io domain)
- [ ] T083 [DEPLOY] Push backend code to HF Space, trigger build, monitor logs for errors, verify build succeeds
- [ ] T084 [DEPLOY] Test deployed backend: `curl https://your-username-physical-ai-book-rag.hf.space/health`, verify 200 response with all services "connected"/"available"
- [ ] T085 [DEPLOY] Run ingestion on production: `curl -X POST https://your-hf-space.hf.space/ingest`, wait for completion (~2-3 minutes for 12 chapters), verify Qdrant dashboard shows chunks
- [ ] T086 [DEPLOY] Test production /chat endpoint: `curl -X POST https://your-hf-space.hf.space/chat -d '{"query":"What is ROS?"}'`, verify response with citations
- [ ] T087 [DEPLOY] Update `frontend/docusaurus.config.js`: Set customFields.backendApiUrl to "https://your-username-physical-ai-book-rag.hf.space" for production
- [ ] T088 [DEPLOY] Build Docusaurus for production: `npm run build` in frontend/, verify no build errors, check build/ directory created
- [ ] T089 [DEPLOY] Deploy frontend to GitHub Pages: `npm run deploy` or push to gh-pages branch, wait for GitHub Actions to complete
- [ ] T090 [DEPLOY] Test live site: Open https://your-username.github.io/physical-ai-book, verify chatbot widget appears, click button
- [ ] T091 [DEPLOY] End-to-end production test: On live site, ask 5 general queries, verify responses with citations; select text, ask 2 questions, verify selected-text mode
- [ ] T092 [DEPLOY] Test CORS: Open browser DevTools, verify no CORS errors when chatbot makes requests to HF Spaces backend
- [ ] T093 [DEPLOY] Performance check: Submit 10 queries on live site, measure response times (should be <3s for 95%), check HF Space logs for errors
- [ ] T094 [DEPLOY] Mobile verification: Open live site on mobile device (or Chrome DevTools mobile view), test chatbot functionality, verify responsive UI

**Checkpoint**: Backend live on HF Spaces, frontend on GitHub Pages, chatbot functional end-to-end in production

---

## Phase 9: Documentation & Polish

**Purpose**: Complete project documentation and final refinements

- [ ] T095 [P] [DOC] Update `backend/README.md`: Add project overview, architecture diagram (ASCII or link to image), setup instructions from quickstart.md, API endpoints summary
- [ ] T096 [P] [DOC] Create `frontend/README.md`: Document chatbot widget integration, configuration options (backend URL), development setup, troubleshooting
- [ ] T097 [DOC] Add inline code documentation: Docstrings for all Python functions (Google style), JSDoc comments for TypeScript functions, explain non-obvious logic
- [ ] T098 [DOC] Create architecture diagram: Use Mermaid or draw.io to show data flow (MDX → Ingestion → Qdrant/Neon → /chat → Widget), save to `docs/architecture.png`
- [ ] T099 [DOC] Update `specs/001-rag-chatbot/quickstart.md`: Add production deployment section, link to live demo, document common production issues (cold starts, rate limits)
- [ ] T100 [DOC] Create troubleshooting guide in `backend/TROUBLESHOOTING.md`: Document 8 common issues from quickstart.md with solutions, add HF-specific issues (logs, secrets)
- [ ] T101 [POLISH] Add logging: Use Python logging module in backend services (INFO for requests, ERROR for failures), configure log level via environment variable
- [ ] T102 [POLISH] Add request rate limiting (optional): Implement SlowAPI or FastAPI rate limiting middleware (10 requests/min per IP), document in README if enabled
- [ ] T103 [POLISH] Optimize Qdrant queries: Test different limit values (5, 8, 10 chunks), measure retrieval precision, document optimal value in research.md
- [ ] T104 [POLISH] Frontend polish: Add loading skeleton for initial widget load, improve error message styling, add "Clear history" button in settings dropdown
- [ ] T105 [POLISH] Accessibility improvements: Test with NVDA/JAWS screen reader, add missing ARIA labels, ensure focus indicators visible for keyboard navigation

**Checkpoint**: Documentation complete, polish items finished, ready for production use

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Setup (T001-T006) - BLOCKS all user stories
- **Phase 3 (User Story 1 - RAG)**: Depends on Foundational (T007-T022)
- **Phase 4 (User Story 2 - Selected Text)**: Depends on US1 /chat endpoint (T030-T034) - extends same endpoint
- **Phase 5 (User Story 3 - History)**: Can start after Foundational (T007-T022) - focuses on frontend
- **Phase 6 (Frontend Integration)**: Depends on US1 backend (T023-T036) and US3 components (T042-T049)
- **Phase 7 (Testing)**: Depends on all user stories (T023-T065)
- **Phase 8 (Deployment)**: Depends on Testing passing (T066-T079)
- **Phase 9 (Documentation)**: Can run in parallel with Testing/Deployment

### Critical Path (Sequential)

1. Setup (T001-T006) → Foundational (T007-T022)
2. US1 Implementation (T023-T036) → Frontend Integration (T050-T065)
3. Testing (T066-T079) → Deployment (T080-T094)
4. Documentation (T095-T105) - final polish

### Parallel Opportunities

Within Foundational phase (after T016):
- T017 (db_service), T018 (embedding_service), T019 (vector_service) can run in parallel
- T020 (chunking), T021 (mdx_parser), T022 (prompts) can run in parallel

Within User Story 3:
- T042, T043, T044, T045 (React components) can be built in parallel

Within Testing:
- T066, T067, T068 (backend unit tests) can run in parallel
- T072 (frontend tests) can run while backend tests execute

Within Documentation:
- T095, T096, T098 (README, diagram) can be written in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T022) - CRITICAL blocker
3. Complete Phase 3: User Story 1 (T023-T036)
4. **STOP and VALIDATE**: Test RAG queries, verify citations, check <3s response time
5. Deploy backend to HF Spaces (T080-T086)
6. Create minimal frontend widget (T042-T049, T050-T053, T058-T062)
7. Deploy MVP to production

### Incremental Delivery (Recommended)

1. Setup + Foundational (T001-T022) → Foundation ready
2. Add US1 - RAG Mode (T023-T036) → Test independently (T074) → Deploy backend (T080-T086)
3. Add US2 - Selected Text (T037-T041) → Test independently (T075)
4. Add US3 - History + Full Frontend (T042-T065) → Test independently (T076)
5. Final Testing & Deployment (T066-T094) → Production-ready
6. Documentation & Polish (T095-T105) → Release

### Parallel Team Strategy

If multiple developers available:
1. **Dev A**: Setup + Foundational backend (T001-T022)
2. Once T022 complete:
   - **Dev A**: User Story 1 backend (T023-T036)
   - **Dev B**: User Story 3 frontend components (T042-T049) in parallel
3. Once T036 complete:
   - **Dev A**: User Story 2 backend (T037-T041) + Testing (T066-T071)
   - **Dev B**: Frontend integration (T050-T065) + Tests (T072-T073)
4. **Both**: E2E testing (T074-T079), deployment (T080-T094), docs (T095-T105)

---

## Timeline Estimate

**Total**: ~45 hours over 7 days (assumes 6-7 hours/day)

| Phase | Tasks | Estimated Time | Days |
|-------|-------|----------------|------|
| Phase 1: Setup | T001-T006 | 3.5 hours | Day 1 (morning) |
| Phase 2: Foundational | T007-T022 | 10 hours | Day 1 (afternoon) - Day 2 |
| Phase 3: User Story 1 | T023-T036 | 12 hours | Day 3 - Day 4 (morning) |
| Phase 4: User Story 2 | T037-T041 | 2 hours | Day 4 (afternoon) |
| Phase 5: User Story 3 | T042-T049 | 6 hours | Day 4 (evening) - Day 5 (morning) |
| Phase 6: Frontend Integration | T050-T065 | 8 hours | Day 5 (afternoon) - Day 6 (morning) |
| Phase 7: Testing | T066-T079 | 7 hours | Day 6 (afternoon) |
| Phase 8: Deployment | T080-T094 | 4 hours | Day 6 (evening) - Day 7 (morning) |
| Phase 9: Documentation | T095-T105 | 4 hours | Day 7 (afternoon) |

**Buffer**: 1 extra day for API limit issues, debugging, iterations

---

## Notes

- [P] tasks = different files/modules, can run in parallel if multiple devs
- [Story] label maps task to user story for traceability (SETUP, FOUND, US1, US2, US3)
- Each task includes exact file paths for Claude Code CLI code generation
- Commit after completing each phase for clean git history
- Stop at any checkpoint to validate independently
- Use `specs/001-rag-chatbot/contracts/chat-examples.json` for testing queries
- Reference `specs/001-rag-chatbot/quickstart.md` for local development setup
- Avoid: vague tasks, same file conflicts, missing acceptance criteria

**Ready to Start**: Run `/sp.implement` to begin execution with Claude Code CLI assistance, or manually execute tasks sequentially starting with T001.
