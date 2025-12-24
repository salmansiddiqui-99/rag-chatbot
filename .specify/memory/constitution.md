<!--
SYNC IMPACT REPORT
==================
Version Change: [Not previously versioned] → 1.0.0
Rationale: MINOR bump - Initial constitution creation with comprehensive principles, constraints, and governance for Physical AI & Humanoid Robotics Book Platform.

Modified Principles:
  - NEW: Technical Accuracy & Source Verification
  - NEW: User-Centric Personalization
  - NEW: Scalability & Maintainability
  - NEW: Security & Privacy First
  - NEW: Open-Source Ethos
  - NEW: Inclusivity & Accessibility

Added Sections:
  - Tech Stack & Architecture Constraints
  - Development & Testing Standards
  - Success Metrics & Validation

Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section will reference new principles
  ✅ spec-template.md - Requirements align with personalization, security, and accessibility principles
  ✅ tasks-template.md - Task categorization supports testing, security, and performance principles

Follow-up TODOs:
  - None - all placeholders resolved
-->

# Physical AI & Humanoid Robotics Book Platform Constitution

## Core Principles

### I. Technical Accuracy & Source Verification

All content on Physical AI and Humanoid Robotics MUST be based on verified, up-to-date sources from robotics, AI, and engineering domains.

**Rationale**: Misinformation in technical education can lead to fundamental misunderstandings. Educational content requires rigorous fact-checking and source citation to maintain credibility and ensure learners build correct mental models.

**Non-Negotiable Rules**:
- Every technical claim MUST be traceable to authoritative sources (academic papers, official documentation, peer-reviewed publications)
- Book chapters MUST cite sources in APA style where applicable
- AI-generated content MUST be validated against known-good references before publication
- Minimum 10 chapters covering core topics: actuators, AI control systems, humanoid design, sensors, locomotion, manipulation, perception systems
- RAG (Retrieval-Augmented Generation) system MUST achieve >90% accuracy in test queries against ground truth
- Monitor AI model outputs for hallucinations; flag unverifiable claims for human review

### II. User-Centric Personalization

Tailor book content dynamically to users' software and hardware backgrounds for enhanced learning experiences.

**Rationale**: Learners come with diverse technical backgrounds. Personalized content adapts explanations to match existing knowledge, accelerating comprehension and reducing cognitive load.

**Non-Negotiable Rules**:
- User profiles MUST capture software experience level (beginner/intermediate/advanced) and hardware experience level (beginner/intermediate/advanced)
- Personalization system MUST generate content adapted to user background on-demand (triggered per-chapter)
- Base content MUST maintain Flesch-Kincaid readability score of 10-14 (high school to college level)
- Personalized versions MUST adjust readability and technical depth based on user profile
- Users MUST be able to access both original and personalized versions of chapters
- Personalization engine MUST leverage user profile data stored securely in Neon DB
- All personalization requests MUST complete within 2 seconds (p95 latency)

### III. Scalability & Maintainability

Build with modular, reusable components (e.g., AI subagents, RAG pipelines) to allow easy updates and expansions.

**Rationale**: Long-term maintenance costs exceed initial development. Modular architecture enables independent updates, parallel development, and component reuse across features.

**Non-Negotiable Rules**:
- Backend MUST use FastAPI with clear separation of concerns: models, services, API routes, utilities
- Frontend MUST use Docusaurus with modular MDX components for chapters, personalization UI, chatbot integration
- RAG pipeline MUST be encapsulated as reusable service with defined interfaces (indexing, querying, updating)
- AI agents (both Claude Code Subagents and runtime agents via OpenAI SDK) MUST be defined as independent skills with clear inputs/outputs
- Define Claude Code Subagents for development tasks: code generation, spec validation, testing automation
- Define Agent Skills for runtime tasks: `simplify_text`, `translate_urdu`, `personalize_chapter`, `answer_question`
- Vector database (Qdrant) and embeddings (Cohere) MUST be abstracted behind service layer to allow provider swaps
- All components MUST have comprehensive inline documentation and API contracts
- Code MUST adhere to PEP8 (Python) and ESLint (JavaScript) with automated linting in CI/CD

### IV. Security & Privacy First

Prioritize secure authentication, data handling, and compliance with user data protection standards.

**Rationale**: Educational platforms handle user data; breaches undermine trust and violate legal obligations. Security must be built-in, not bolted-on.

**Non-Negotiable Rules**:
- Authentication MUST use Better Auth with secure session management
- User data (background profiles) MUST be stored in Neon DB with encryption at rest
- Collect ONLY essential background info (software/hardware experience levels); NO PII beyond email for authentication
- Database credentials and API keys MUST be stored in environment variables (`.env`), NEVER hardcoded
- All API endpoints handling user data MUST implement authentication and authorization checks
- RAG embeddings in Qdrant MUST have access controls; no public read/write
- HTTPS MUST be enforced for all deployments
- Regular security audits: zero critical vulnerabilities in authentication/database layers (validated via tools like Bandit, Safety for Python; npm audit for JavaScript)
- Rate limiting MUST be implemented on all public-facing API endpoints to prevent abuse

### V. Open-Source Ethos

Leverage open tools (e.g., Docusaurus, Qdrant, Hugging Face) and encourage reusable intelligence via documented agent skills.

**Rationale**: Open-source tools reduce vendor lock-in, enable community contributions, and align with educational mission of transparent, accessible knowledge.

**Non-Negotiable Rules**:
- Prefer open-source libraries and free-tier services: Docusaurus, FastAPI, Qdrant (Cloud free tier), Cohere (free tier), Neon (free tier), Hugging Face Spaces
- All code MUST be version-controlled in Git with semantic versioning (MAJOR.MINOR.PATCH)
- Agent skills (both Subagents and runtime skills) MUST be documented with usage examples in `.specify/` or project docs
- Public repository (if applicable) MUST include comprehensive README with setup instructions, architecture diagrams, and contribution guidelines
- Use OpenRouter with free model (`mistralai/devstral-2512:free`) for AI interactions to avoid paid API lock-in
- Deploy on Hugging Face Spaces for zero-cost hosting and community access
- Documentation MUST use Docusaurus for project-level docs, FastAPI Swagger for API docs

### VI. Inclusivity & Accessibility

Support multilingual access (e.g., Urdu translation) and accessibility features in the frontend.

**Rationale**: Knowledge should be accessible to global audiences, including non-English speakers and users with disabilities. Inclusivity expands impact and aligns with educational equity.

**Non-Negotiable Rules**:
- Platform MUST support Urdu translation of book chapters via Agent Skill (`translate_urdu`)
- Translation accuracy MUST exceed 95% (validated via manual spot-checks of sample chapters)
- Docusaurus theme MUST be mobile-responsive and support modern browsers (Chrome, Firefox, Edge)
- Frontend MUST implement accessibility best practices: semantic HTML, ARIA labels, keyboard navigation, screen reader compatibility
- Content MUST provide alternative text for all images and diagrams
- Color contrast MUST meet WCAG 2.1 AA standards for readability
- Translation system MUST store both original and translated versions for retrieval without re-generation overhead

## Tech Stack & Architecture Constraints

**Technology Stack Lock** (Non-Negotiable):
- **Frontend**: Docusaurus (React-based static site generator with MDX support)
- **Backend**: FastAPI (Python 3.11+)
- **Vector Database**: Qdrant (Cloud free tier for RAG embeddings)
- **Embeddings**: Cohere (free tier for text embeddings)
- **User Database**: Neon DB (PostgreSQL-compatible, free tier)
- **Authentication**: Better Auth (open-source auth library)
- **AI Models**: OpenAI Agents SDK via OpenRouter with `mistralai/devstral-2512:free` model
- **Deployment**: Hugging Face Spaces (free hosting with auto-build from Git)
- **CI/CD**: GitHub Actions (or HF Spaces auto-deploy)

**Budget Constraint**:
- Rely exclusively on free tiers: Cohere free tier, OpenRouter free model, Qdrant Cloud free tier, Neon free tier
- No paid service upgrades without documented justification and approval
- Design for OpenRouter free model rate limits (queue personalization/translation requests if necessary)

**Content Constraints**:
- Book MUST contain 10-15 chapters, each 1,000-3,000 words
- RAG system MUST handle queries up to 1,000 tokens
- All chapters MUST be written in Markdown/MDX format for Docusaurus rendering

**Compatibility**:
- Support modern browsers: Chrome (latest 2 versions), Firefox (latest 2 versions), Edge (latest 2 versions)
- Mobile-responsive design required for all pages
- Minimum viewport width: 320px (mobile devices)

## Development & Testing Standards

### Code Quality

**Python (Backend)**:
- MUST adhere to PEP8 style guide
- MUST achieve 80%+ test coverage using pytest
- MUST include type hints for all functions and classes
- MUST pass automated linting (flake8, black) and security checks (Bandit, Safety)

**JavaScript (Frontend)**:
- MUST adhere to ESLint rules (Airbnb or Standard config)
- MUST achieve 80%+ test coverage using Jest
- MUST use Prettier for code formatting
- MUST pass `npm audit` with zero high/critical vulnerabilities

### Testing Requirements

**Integration Testing**:
- End-to-end tests MUST cover:
  - Auth flows: signup with background questions, signin, session persistence
  - RAG queries: indexing book content, querying chatbot, retrieving relevant snippets
  - Personalization: triggering per-chapter personalization, storing adapted versions, retrieving personalized content
  - Translation: generating Urdu translations, storing translated chapters, retrieval without re-generation
- Use Playwright or Cypress for browser-based E2E tests

**Unit Testing**:
- Backend: pytest for models, services, API routes
- Frontend: Jest for React components, utility functions
- MUST achieve 100% passing tests before deployment

**Manual Testing**:
- Validate 5 sample user profiles with varying software/hardware backgrounds
- Verify personalized content adapts correctly to each profile
- Spot-check Urdu translations for accuracy (minimum 5 chapters)

### Performance Standards

- **API Response Time**: <2 seconds (p95 latency) for RAG queries and personalization requests
- **Embedding Optimization**: Use Cohere batching to reduce API calls and latency
- **RAG Retrieval Precision**: >85% (relevant snippets retrieved in top-3 results)

### Version Control & Deployment

**Git Workflow**:
- Semantic versioning: MAJOR.MINOR.PATCH
- Feature branches named by category: `auth/<feature>`, `rag/<feature>`, `agents/<feature>`, `frontend/<feature>`
- All commits MUST include meaningful messages following Conventional Commits spec (e.g., `feat:`, `fix:`, `docs:`, `test:`)

**Deployment Standards**:
- CI/CD via GitHub Actions or Hugging Face Spaces auto-build
- Monitor application logs using Sentry (free tier) or equivalent
- Deployment MUST pass all integration tests before going live
- Zero downtime deployments preferred (blue-green or rolling updates)

## Success Metrics & Validation

### Functional Success Criteria

1. **Functional Auth**:
   - Users can signup with background questions (software/hardware levels)
   - Users can signin and session data persists in Neon DB
   - Personalization adapts content based on stored user profile

2. **Working RAG Chatbot**:
   - Indexes all book chapters accurately in Qdrant
   - Responds to user queries with relevant snippets (accuracy >90% in test cases)
   - Handles queries up to 1,000 tokens without errors

3. **Personalization & Translation**:
   - Logged-in users can trigger per-chapter personalization buttons
   - AI generates adapted versions based on user background
   - Urdu translations generated on-demand with >95% accuracy
   - Personalized/translated versions stored for retrieval without re-generation

4. **AI Reusability**:
   - Claude Code Subagents successfully generate/validate code during development
   - Runtime agents (via OpenAI SDK + OpenRouter) handle skills (`simplify_text`, `translate_urdu`, etc.) without errors
   - All agent skills documented with usage examples

5. **Deployment**:
   - Application live on Hugging Face Spaces
   - End-to-end flow works: auth → read chapter → personalize → chat with RAG bot
   - Zero crashes in production during beta testing phase

### Testing & Validation

- **100% Passing Tests**: All unit and integration tests pass before deployment
- **Manual Verification**: 5 sample users with varying backgrounds successfully use all features
- **User Experience**: Base content Flesch-Kincaid readability 10-14; personalized versions adjust accordingly
- **No Usability Issues**: Beta testing reveals no major usability blockers

### Security & Performance

- **Zero Security Vulnerabilities**: No critical/high severity issues in auth/database layers (validated via automated scans)
- **RAG Retrieval Precision**: >85% (measured via test query set against ground truth)
- **Translation Accuracy**: >95% (manual spot-check of 5 chapters minimum)
- **API Latency**: <2 seconds (p95) for RAG/personalization/translation requests

## Governance

### Amendment Procedure

1. **Proposal**: Any team member may propose a constitution amendment by documenting:
   - Proposed change (principle addition/modification/removal)
   - Rationale and impact analysis
   - Affected templates and codebase areas

2. **Review**: Proposal reviewed by project lead or designated governance committee

3. **Approval**: Requires documented approval (via PR review, meeting notes, or decision log)

4. **Migration**: Approved amendments trigger:
   - Constitution version increment (MAJOR/MINOR/PATCH)
   - Sync of dependent templates (plan-template.md, spec-template.md, tasks-template.md)
   - Update of agent guidance files (CLAUDE.md or equivalent)
   - Communication to team of governance changes

### Versioning Policy

- **MAJOR**: Backward-incompatible governance changes (principle removal, redefinition of core constraints)
- **MINOR**: New principle/section added, material expansion of existing guidance
- **PATCH**: Clarifications, wording improvements, typo fixes, non-semantic refinements

### Compliance & Review

- All pull requests MUST verify compliance with constitution principles (automated checks where possible)
- Complexity that violates simplicity principles (e.g., over-engineering, unnecessary abstractions) MUST be justified in plan.md Complexity Tracking section
- Constitution compliance is a mandatory gate in the `/sp.plan` Constitution Check section
- Periodic reviews (quarterly or at major milestones) to ensure constitution remains aligned with project reality

### Runtime Guidance

For day-to-day development guidance and tool-specific instructions, refer to `.specify/memory/CLAUDE.md` (or agent-specific guidance files). The constitution defines WHAT we build and WHY; runtime guidance defines HOW.

---

**Version**: 1.0.0 | **Ratified**: 2025-12-22 | **Last Amended**: 2025-12-22
