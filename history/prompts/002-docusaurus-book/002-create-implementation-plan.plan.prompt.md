---
id: 002
title: Create implementation plan for Docusaurus book
stage: plan
date: 2025-12-22
surface: agent
model: claude-sonnet-4-5-20250929
feature: 002-docusaurus-book
branch: 002-docusaurus-book
user: salmansiddiqui-99
command: /sp.plan
labels: ["plan", "docusaurus", "book", "physical-ai", "robotics", "architecture"]
links:
  spec: specs/002-docusaurus-book/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-docusaurus-book/plan.md
  - specs/002-docusaurus-book/research.md
  - specs/002-docusaurus-book/data-model.md
  - specs/002-docusaurus-book/contracts/sitemap.yaml
  - specs/002-docusaurus-book/quickstart.md
tests:
  - Constitution Check: ALL 6 PRINCIPLES PASSED
  - Plan completeness validation: All required sections present
  - Timeline feasibility: 6.5-7.5 days realistic for scope
---

## Prompt

User ran `/sp.plan` command with detailed phase breakdown request:

```
/sp.plan

Create a detailed implementation plan for the Docusaurus-based educational book "Physical AI & Humanoid Robotics" with the following comprehensive phase breakdown:

**Overview**: Comprehensive phased execution strategy for building and deploying a production-ready educational book within 6-7 days.

**Phase 1: Project Initialization and Docusaurus Setup (Dec 22-23, 1.5 days)**
- Initialize Docusaurus v3+ with TypeScript, configure GitHub repository
- Set up dev environment, install dependencies, customize theme (CSS variables for deep blues, cyan accents, geometric patterns)
- Configure GitHub Actions CI/CD pipeline for automated deployment
- Create project directory structure (docs/, static/img/, src/css/)

**Phase 2: Content Generation and Structure (Dec 24-26, 3 days)**
- Generate all 4 module directories with subsections using Claude Code CLI
- Create homepage with hero section and course overview
- Write 30-40 MDX pages: 4 modules with chapters + supporting sections (learning outcomes, weekly breakdown, assessments, hardware)
- Add Python/ROS 2 code examples with syntax highlighting
- Include diagrams and visuals with alt text

**Phase 3: Navigation, Features, and Polish (Dec 27, 1 day)**
- Configure sidebars.js for hierarchical navigation
- Implement search functionality (local plugin or Algolia)
- Add dark/light mode toggle, responsive design refinement
- Implement SEO (sitemap.xml, meta tags, Open Graph)
- Ensure WCAG 2.1 AA accessibility compliance

**Phase 4: Testing, Deployment, and Launch (Dec 28-29, 1-2 days)**
- Comprehensive testing: Lighthouse audit, WAVE accessibility check, broken link validation
- Manual testing on desktop, tablet, mobile
- Deploy to GitHub Pages via automated GitHub Actions
- Final validation of all 10 success criteria from spec.md
- Documentation completion and project handoff

**Timeline**: 7-8 days total with 1-day buffer for unexpected issues

**Resources**:
- Tools: Docusaurus v3+, Node.js 18+, GitHub Actions, Algolia (optional), WAVE, Lighthouse
- Team: Solo developer (Claude Code CLI assisting with 85%+ content generation)
- Budget: $0 (all free-tier tools)

**Risk Management**: Content generation timeline overrun mitigation via modular structure, Docusaurus learning curve < 1 day with Classic preset, theme customization via CSS-first approach

**Monitoring**: Track progress via GitHub commits, run Lighthouse audits daily, validate acceptance criteria incrementally
```

## Response snapshot

Created comprehensive implementation plan (`plan.md`) with 4 phases, plus supporting artifacts for Phase 0 (research) and Phase 1 (data model, contracts, quickstart):

**Phase 0: Research & Design Decisions** (`research.md`)
- **Decision 1: Static Site Generator Selection** → Docusaurus v3+ (best-in-class docs features, MDX v2 support, React integration, active community)
  - **Alternatives considered**: VuePress v2 (smaller community), GitBook (limited free tier), MkDocs (no React/MDX)
  - **Rationale**: Future extensibility for RAG chatbot (MDX components), constitution alignment (open-source, WCAG helpers), timeline fit (mature templates)

- **Decision 2: Theme Customization Strategy** → CSS Variables Overrides + Selective Swizzling
  - **Alternatives considered**: Custom theme (2-3 days effort, high maintenance), third-party theme plugin (limited futuristic aesthetic)
  - **Approach**: Override CSS variables in `src/css/custom.css` for colors/typography (4-6 hours), use gradient backgrounds for geometric patterns, selectively swizzle Hero component only if needed
  - **Color palette**: Deep blue #1E3A8A base, electric cyan #06B6D4 accents, light gray #F3F4F6 text

- **Decision 3: Content Organization** → Module-Based Directories with `supporting/` subfolder
  - **Structure**: `docs/module-{n}-{slug}/` with numbered chapters (`01-architecture.mdx`, `02-nodes-topics.mdx`, ...), `docs/supporting/` for learning outcomes/assessments/hardware
  - **Rationale**: FR-002 hierarchical navigation via auto-generated sidebar, SC-006 max 3-click depth, granular search results, easy to maintain/scale

- **Decision 4: Search Implementation** → Local Search Plugin (MVP), Algolia DocSearch (post-launch upgrade)
  - **Approach**: Install `@easyops-cn/docusaurus-search-local` for immediate functionality (no approval wait), apply for Algolia DocSearch after launch for upgrade
  - **Rationale**: Timeline priority (local search works immediately), SC-005 satisfied for 30-40 pages, free tools requirement, seamless Algolia swap later

- **Decision 5: Deployment Strategy** → GitHub Actions with `peaceiris/actions-gh-pages`
  - **Workflow**: `.github/workflows/deploy.yml` triggers on push to `main`, builds site, deploys to `gh-pages` branch
  - **Rationale**: SC-009 zero-touch deployment, CI catches build errors, version-controlled workflow, $0 cost (GitHub Actions free for public repos)

- **Decision 6: SEO Optimization** → Docusaurus Built-In SEO + Manual Meta Tags
  - **Approach**: Sitemap.xml auto-generated via Classic preset, global meta tags in `docusaurus.config.js`, per-page overrides via MDX frontmatter, Open Graph tags via custom `<SEO />` component
  - **Rationale**: FR-012/FR-013 compliance, 3-4 hours effort (templated across pages), no proprietary tracking (privacy-friendly)

**Phase 1: Data Model Definition** (`data-model.md`)
- Defined 8 key entities matching spec.md: Module, Subsection/Chapter, Code Example, Diagram/Visual, Learning Outcome, Weekly Topic, Assessment, Hardware Item
- **Module entity**: Attributes (id, title, sidebar_label, description, keywords, image), relationships (contains 3-5 subsections), validation rules (unique sidebar_position, 120-160 char description)
- **Code Example entity**: Inline fenced code blocks with language identifier, optional title/line numbers, 5-50 line limit, context paragraphs before/after
- **Diagram/Visual entity**: Static files in `static/img/{module-slug}/`, alt text required (80-120 chars), max 200KB, PNG/SVG formats
- Content relationships diagram (Mermaid) showing Module → Chapters → Code Examples/Diagrams, Supporting sections linking to Weekly Breakdown/Assessments
- File naming conventions: `module-{n}-{slug}/index.mdx`, `{nn}-{chapter-slug}.mdx`, `supporting/{name}.mdx`

**Phase 1: URL Structure Contract** (`contracts/sitemap.yaml`)
- **Complete URL mapping**: 23 total pages (1 homepage + 1 intro + 4 modules × 4 chapters + 4 supporting sections)
- **Navigation hierarchy**: Homepage (position 1) → Introduction (position 2) → 4 Modules (positions 3-6, each with 3-4 chapters) → Supporting (position 10+)
- **SEO metadata**: Priority values (0.7-1.0), changefreq "monthly", descriptions 120-160 chars, keywords per page
- **Routing rules**: Clean URLs (no .html), no trailing slash, index pages map to directory root (e.g., `/module-1-ros2`)
- **Redirects**: `/ros2` → `/module-1-ros2`, `/gazebo` → `/module-2-digital-twin/gazebo-simulation`, `/isaac` → `/module-3-isaac`
- **Breadcrumb patterns**: Max 3 levels (Home → Module → Chapter)

**Phase 1: Developer Quickstart** (`quickstart.md`)
- **Prerequisites**: Node.js 18+, npm 8+, Git, VS Code
- **Quick setup**: Clone repo → `npm install` → `npm start` (5 minutes to local dev server at localhost:3000)
- **Common tasks**: Add new chapter (create MDX file with frontmatter), add code examples (fenced blocks with language), add images (`static/img/`), customize theme (`src/css/custom.css`)
- **Deployment**: Automatic via GitHub Actions (push to `main` triggers build + deploy), manual fallback (`GIT_USER=username npm run deploy`)
- **Troubleshooting**: Port 3000 in use (use `npx kill-port 3000`), broken links (check MDX paths), hot reload broken (clear cache with `npm run clear`)
- **Testing checklist**: Build succeeds, no broken links, images load, code highlighting, responsive, dark mode, search, accessibility (WAVE), performance (Lighthouse >90)

**Main Implementation Plan** (`plan.md`)
- **Technical Context**: Node.js 18+, Docusaurus v3+ with Classic preset, React 18+, MDX v2, Prism.js for syntax highlighting, static website (no backend)
- **Constitution Check**: ALL 6 PRINCIPLES PASSED
  - Principle I (Technical Accuracy): FR-020 content fidelity, manual review vs curriculum ✅
  - Principle II (Personalization): N/A for static content, documented as out of scope ✅
  - Principle III (Scalability): Modular Docusaurus architecture, infinite GitHub Pages scaling ✅
  - Principle IV (Security): No user data, GitHub Pages HTTPS enforcement ✅
  - Principle V (Open-Source): All MIT/open-source tools, transparent workflow ✅
  - Principle VI (Accessibility): WCAG 2.1 AA required (FR-014, FR-015, SC-004) ✅

- **Project Structure**: `docs/` (4 module directories + supporting/), `static/img/` (diagrams organized by module), `src/css/` (custom.css), `docusaurus.config.js`, `sidebars.js`, `.github/workflows/deploy.yml`

- **4 Implementation Phases**:
  1. **Project Initialization (Days 1-2, Dec 22-23)**: Create GitHub repo, initialize Docusaurus with TypeScript, configure theme (CSS variables), set up GitHub Actions workflow, validate local build
  2. **Content Generation (Days 2-4, Dec 24-26)**: Generate homepage hero section, create all 4 module directories with subsections (30-40 MDX files), add Python/ROS 2 code examples, include diagrams with alt text, write supporting sections (outcomes, weekly breakdown, assessments, hardware)
  3. **Navigation & Features (Day 5, Dec 27)**: Configure `sidebars.js` for hierarchical nav, implement local search plugin, add dark mode toggle, responsive CSS refinements, SEO implementation (sitemap, meta tags, Open Graph), accessibility audit (keyboard nav, ARIA labels)
  4. **Testing & Deployment (Days 6-7, Dec 28-29)**: Lighthouse audit (target >90 performance/accessibility), WAVE checker (zero errors), broken link validation, manual cross-browser testing, deploy to GitHub Pages, validate all 10 success criteria

- **Timeline**: 6.5-7.5 days (Dec 22-29), with 0.5-1.5 day buffer for issues

- **Resources**: Solo developer, Claude Code CLI (85%+ content generation), all free-tier tools ($0 budget)

- **Risk Management Table**:
  - Content generation timeline overrun → Modular structure allows parallel creation
  - Docusaurus learning curve → Classic preset reduces curve to <1 day
  - Theme customization complexity → CSS-first approach (4-6 hours vs 2-3 days)
  - Search functionality delay → Local search available immediately
  - Deployment pipeline failures → CI/CD catches build errors pre-deploy
  - SEO/accessibility issues → Docusaurus SSR + meta tag templates

- **Monitoring Strategy**: Daily Lighthouse audits, GitHub commit tracking, incremental acceptance criteria validation, manual testing at each phase milestone

## Outcome

- ✅ Impact: Created comprehensive implementation plan with 4 phases, 6 architectural decisions, complete data model (8 entities), URL structure (23 pages), and developer quickstart guide; all artifacts ready for Phase 1 execution
- 🧪 Tests: Constitution Check PASSED (6/6 principles), plan completeness validated (all required sections present), timeline feasibility confirmed (6.5-7.5 days realistic for scope)
- 📁 Files: Created 5 files (plan.md, research.md, data-model.md, contracts/sitemap.yaml, quickstart.md)
- 🔁 Next prompts: `/sp.tasks` to generate dependency-ordered tasks from implementation plan, then `/sp.implement` to execute tasks sequentially
- 🧠 Reflection: Implementation plan successfully balances timeline constraints (6-7 days) with quality requirements (WCAG 2.1 AA, <2s load time, 100% curriculum coverage). Research phase resolved all NEEDS CLARIFICATION items upfront, preventing mid-implementation blockers. CSS-first theme customization strategy (4-6 hours) vs full custom theme (2-3 days) demonstrates appropriate trade-off for timeline. Local search MVP → Algolia upgrade path provides immediate functionality while preserving future enhancement option. Modular content structure (module-based directories) enables parallel content generation if needed, reducing timeline risk.

## Evaluation notes (flywheel)

- Failure modes observed: None during planning phase; all design decisions resolved via research.md; no NEEDS CLARIFICATION markers remaining
- Graders run and results (PASS/FAIL): Constitution Check PASS (6/6 principles validated); Plan template compliance PASS (all required sections present: Technical Context, Constitution Check, Project Structure, Complexity Tracking, Phases, Timeline, Resources, Risks, Monitoring); Research completeness PASS (6 architectural decisions documented with alternatives/rationale)
- Prompt variant (if applicable): Standard `/sp.plan` workflow with comprehensive phase breakdown provided by user upfront (reduced planning ambiguity)
- Next experiment (smallest change to try): During `/sp.tasks` generation, validate that 30-40 MDX pages can be created within 3-day content generation window (Phase 2); consider task breakdown strategy (e.g., group by module vs. group by artifact type) to optimize for Claude Code CLI content generation workflow; ensure tasks account for MDX frontmatter requirements (id, title, sidebar_position) to avoid rework
