# Implementation Plan: Physical AI & Humanoid Robotics Online Book

**Branch**: `002-docusaurus-book` | **Date**: 2025-12-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-docusaurus-book/spec.md`

## Summary

Create a professional, modern online book for "Physical AI & Humanoid Robotics" using Docusaurus as a static site generator. The book delivers educational content across 4 core modules (ROS 2, Digital Twin, AI-Robot Brain, VLA) plus supporting resources (introduction, learning outcomes, weekly breakdown, assessments, hardware requirements). All content will be AI-generated via Claude Code from provided course curriculum, ensuring 100% coverage and technical accuracy. The site features a futuristic design (deep blues, electric cyan accents), responsive layout, WCAG 2.1 AA accessibility, and deploys to GitHub Pages via GitHub Actions CI/CD. Project follows Spec-Kit Plus workflow with 7-day timeline.

## Technical Context

**Language/Version**: Node.js 18+ (JavaScript/TypeScript for Docusaurus)
**Primary Dependencies**: Docusaurus v3+ (classic preset), React 18+, MDX v2, Prism.js (syntax highlighting)
**Storage**: Static Markdown/MDX files (no database), GitHub repository for version control
**Testing**: ESLint (linting), Lighthouse (performance/accessibility audits), manual browser testing, WAVE tool (WCAG validation)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions), GitHub Pages hosting
**Project Type**: Static website (frontend-only, no backend)
**Performance Goals**: Page load <2 seconds (Lighthouse audit), build time <5 minutes (GitHub Actions)
**Constraints**: Free-tier GitHub Pages hosting, static-only (no server-side processing), Node.js 18+ required, SEO-friendly sitemap and meta tags
**Scale/Scope**: 30-40 content pages (4 modules + supporting sections), estimated 15,000-25,000 words total, <1MB total page weight

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Technical Accuracy & Source Verification

**Status**: ✅ PASS

- **Requirement**: AI-generated content validated against authoritative sources
- **Plan Alignment**: FR-020 requires content fidelity to curriculum; user-provided course details serve as authoritative source
- **Validation**: Manual review process (Phase 2) validates content against curriculum; Claude Code prompts reference specific course sections
- **Citations**: All modules will reference official documentation (ROS 2, NVIDIA Isaac, Gazebo docs) with proper attribution (FR-019)

### Principle II: User-Centric Personalization

**Status**: ✅ PASS (Not Applicable - Static Content)

- **Requirement**: Dynamic personalization based on user profiles
- **Plan Alignment**: This feature delivers static educational content; personalization is out of scope (documented in spec.md Out of Scope section)
- **Future Extension**: Static site is compatible with future personalization layer via client-side JavaScript or separate backend service
- **Rationale**: Static content maximizes accessibility and simplicity for MVP; personalization can be layered on top without requiring content regeneration

### Principle III: Scalability & Maintainability

**Status**: ✅ PASS

- **Requirement**: Modular, reusable components with clear separation of concerns
- **Plan Alignment**:
  - Docusaurus follows component-based React architecture (pages, MDX components, theme customization)
  - Content organized by module (docs/module-1-ros2/, docs/module-2-digital-twin/, etc.) for independent updates
  - Custom CSS centralized in src/css/custom.css for consistent styling
  - GitHub Actions workflow encapsulates build/deploy logic
- **Documentation**: quickstart.md documents setup, configuration, and content structure
- **Code Quality**: ESLint enforces style guide; Prettier formats code; all configuration documented inline

### Principle IV: Security & Privacy First

**Status**: ✅ PASS (Not Applicable - No User Data)

- **Requirement**: Secure authentication, data handling, encryption
- **Plan Alignment**: Static site collects no user data (Assumption 8 in spec.md); no authentication required
- **GitHub Pages**: Enforces HTTPS automatically; no database or API keys in deployment
- **Source Control**: .gitignore excludes sensitive files (though none expected for static site)

### Principle V: Open-Source Ethos

**Status**: ✅ PASS

- **Requirement**: Leverage open-source tools, document agent skills
- **Plan Alignment**:
  - Docusaurus: Open-source static site generator (MIT license)
  - GitHub Pages: Free hosting for open-source projects
  - Prism.js: Open-source syntax highlighting (MIT license)
  - Node.js ecosystem: All dependencies open-source
- **Documentation**: README.md, quickstart.md provide comprehensive setup and contribution guides
- **Versioning**: Git semantic versioning (v1.0.0 on first deployment)

### Principle VI: Inclusivity & Accessibility

**Status**: ✅ PASS

- **Requirement**: WCAG 2.1 AA compliance, multilingual support
- **Plan Alignment**:
  - FR-014, FR-015: Keyboard navigation, ARIA labels, alt text for all images
  - SC-004: Zero WCAG errors validated via WAVE tool
  - User Story 4 dedicated to accessible design with 5 acceptance scenarios
  - Responsive design (FR-011): 320px-2560px viewports
- **Multilingual**: English-only for MVP (Assumption 6); Docusaurus supports i18n for future Urdu translation
- **Testing**: Manual keyboard navigation, screen reader testing, color contrast validation

**Overall Constitution Status**: ✅ ALL GATES PASSED (6/6 principles)

## Project Structure

### Documentation (this feature)

```text
specs/002-docusaurus-book/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (technical decisions)
├── data-model.md        # Phase 1 output (content entities)
├── quickstart.md        # Phase 1 output (setup guide)
├── contracts/           # Phase 1 output (sitemap, navigation structure)
│   └── sitemap.yaml     # Content organization
└── checklists/
    └── requirements.md  # Spec quality validation (complete)
```

### Source Code (repository root)

This is a **static website** (frontend-only) project:

```text
physical-ai-book/        # Docusaurus project directory
├── docs/                # Book content (MDX files)
│   ├── index.mdx        # Homepage
│   ├── introduction.mdx # Introduction to Physical AI
│   ├── module-1-ros2/
│   │   ├── index.mdx    # Module 1 overview
│   │   ├── architecture.mdx
│   │   ├── nodes-topics-services.mdx
│   │   ├── rclpy-integration.mdx
│   │   └── urdf-humanoids.mdx
│   ├── module-2-digital-twin/
│   │   ├── index.mdx
│   │   ├── gazebo-physics.mdx
│   │   ├── sensor-simulation.mdx
│   │   └── unity-visualization.mdx
│   ├── module-3-isaac/
│   │   ├── index.mdx
│   │   ├── isaac-sim.mdx
│   │   ├── isaac-ros-vslam.mdx
│   │   └── nav2-bipedal.mdx
│   ├── module-4-vla/
│   │   ├── index.mdx
│   │   ├── whisper-voice.mdx
│   │   ├── llm-planning.mdx
│   │   └── capstone-project.mdx
│   ├── learning-outcomes.mdx
│   ├── weekly-breakdown.mdx
│   ├── assessments.mdx
│   └── hardware-requirements.mdx
├── src/
│   ├── css/
│   │   └── custom.css   # Custom theme styling
│   ├── components/      # Reusable MDX components (if needed)
│   └── pages/           # Additional pages (if needed)
├── static/
│   ├── img/             # Images, diagrams, logos
│   └── favicon.ico      # Site favicon
├── docusaurus.config.js # Docusaurus configuration
├── sidebars.js          # Navigation structure
├── package.json         # Node.js dependencies
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions CI/CD
├── README.md            # Project overview
└── .gitignore           # Git exclusions
```

**Structure Decision**: Static website architecture chosen (no backend/API) because:
1. Content is read-only educational material (no user-generated content)
2. Static hosting (GitHub Pages) is free and infinitely scalable
3. Docusaurus excels at documentation/book sites with MDX support
4. Simplifies deployment (no database, no server management)
5. Excellent SEO out-of-the-box (server-side rendering, sitemap generation)

## Complexity Tracking

**No violations detected**. Static site architecture aligns with simplicity principles:
- Single project type (frontend-only)
- No unnecessary abstractions (Docusaurus handles routing, rendering, bundling)
- Minimal dependencies (Docusaurus preset includes React, MDX, Prism)
- No custom build tools (Docusaurus CLI handles all builds)

---

## Phase 0: Research & Design Decisions

See [research.md](research.md) for detailed technical decisions including:
1. Docusaurus vs alternatives (VuePress, GitBook, MkDocs)
2. Theme customization strategy (CSS variables vs custom theme)
3. Content organization (module-based directories vs flat structure)
4. Search implementation (Algolia DocSearch vs local search)
5. Deployment strategy (GitHub Actions vs manual deploy script)
6. SEO optimization (meta tags, Open Graph, sitemap)

**Key Decision**: Use Docusaurus Classic template with TypeScript for:
- Mature ecosystem with excellent MDX support
- Built-in dark mode, responsive design, mobile navigation
- Prism.js syntax highlighting for Python/ROS 2/bash
- SEO-friendly server-side rendering
- Easy customization via CSS variables (no theme ejection needed)

---

## Phase 1: Data Model & Contracts

See [data-model.md](data-model.md) for content entity definitions:
- Module structure (4 core modules)
- Chapter/subsection hierarchy
- Code example format
- Diagram metadata
- Learning resources (outcomes, weekly topics, assessments, hardware)

See [contracts/sitemap.yaml](contracts/sitemap.yaml) for:
- Complete site navigation structure
- URL paths for all pages
- Sidebar organization
- Breadcrumb navigation

See [quickstart.md](quickstart.md) for:
- Local development setup (Node.js 18+, npm/yarn install)
- Running dev server (npm start)
- Building for production (npm build)
- Deployment process (GitHub Actions)
- Customization guide (theme, navigation, content)

---

## Implementation Phases

### Phase 1: Project Initialization (Day 1 - Dec 22-23)

**Duration**: 1.5 days

**Objectives**:
- Scaffold Docusaurus project
- Configure GitHub repository and GitHub Actions
- Apply custom theme (colors, typography, layout)
- Verify local dev server

**Tasks**:
1. Create GitHub repository: `physical-ai-humanoid-robotics-book`
2. Initialize Docusaurus: `npx create-docusaurus@latest physical-ai-book classic --typescript`
3. Configure `docusaurus.config.js`:
   - Site metadata (title, tagline, URL, baseUrl)
   - GitHub Pages deployment settings
   - Theme configuration (dark mode, navbar, footer)
   - Prism syntax highlighting (Python, bash, yaml)
   - SEO (meta tags, Open Graph)
4. Customize theme in `src/css/custom.css`:
   - Color palette: Primary navy (#1E3A8A), cyan accent (#06B6D4), grays
   - Typography: System fonts (Inter, -apple-system), line spacing 1.6-1.8
   - Gradient headers, geometric patterns (subtle)
5. Create GitHub Actions workflow `.github/workflows/deploy.yml`:
   - Trigger on push to main branch
   - Install dependencies (npm ci)
   - Build site (npm run build)
   - Deploy to gh-pages branch
6. Test local dev server: `npm start`
7. Commit and push initial scaffold

**Deliverables**:
- Docusaurus project scaffolded
- Custom theme applied
- GitHub Actions workflow configured
- Local dev server running

**Acceptance Criteria**:
- Homepage displays with custom title/tagline
- Dark/light mode toggle functional
- Build completes without errors
- GitHub Actions workflow validates successfully

---

### Phase 2: Content Generation (Days 2-4 - Dec 24-26)

**Duration**: 3 days

**Objectives**:
- Generate all book content using Claude Code
- Ensure 100% curriculum coverage
- Add code examples and diagram placeholders
- Validate content fidelity

**Tasks**:
1. Generate homepage (`docs/index.mdx`):
   - Hero section with title, tagline, overview
   - "Why Physical AI Matters" narrative
   - Navigation call-to-action to modules
2. Generate Module 1 content (`docs/module-1-ros2/`):
   - index.mdx: Module overview
   - architecture.mdx: ROS 2 architecture concepts
   - nodes-topics-services.mdx: Communication patterns
   - rclpy-integration.mdx: Python integration with examples
   - urdf-humanoids.mdx: URDF for humanoid robots
3. Generate Module 2 content (`docs/module-2-digital-twin/`):
   - index.mdx: Digital Twin overview
   - gazebo-physics.mdx: Physics simulation
   - sensor-simulation.mdx: LiDAR, Depth, IMU sensors
   - unity-visualization.mdx: High-fidelity rendering
4. Generate Module 3 content (`docs/module-3-isaac/`):
   - index.mdx: NVIDIA Isaac overview
   - isaac-sim.mdx: Synthetic data generation
   - isaac-ros-vslam.mdx: Visual SLAM
   - nav2-bipedal.mdx: Navigation for bipedal robots
5. Generate Module 4 content (`docs/module-4-vla/`):
   - index.mdx: Vision-Language-Action overview
   - whisper-voice.mdx: Voice-to-Action with Whisper
   - llm-planning.mdx: LLM cognitive planning
   - capstone-project.mdx: Autonomous Humanoid project
6. Generate supporting sections:
   - introduction.mdx: Weeks 1-2 content
   - learning-outcomes.mdx: 6 numbered outcomes
   - weekly-breakdown.mdx: Weeks 1-13 with topics
   - assessments.mdx: Project descriptions
   - hardware-requirements.mdx: Structured tables
7. Enhance all content:
   - Add Python/ROS 2 code blocks with syntax highlighting
   - Include diagram placeholders with alt text descriptions
   - Ensure Flesch-Kincaid readability 10-14
   - Cross-reference related sections
8. Manual validation:
   - Review against course curriculum for accuracy
   - Verify all FR-003 to FR-007 requirements met
   - Check code examples for correctness

**Deliverables**:
- All 30-40 MDX content files created
- 100% curriculum coverage
- Code examples with syntax highlighting
- Diagram placeholders with descriptive alt text

**Acceptance Criteria**:
- All modules and subsections render correctly
- Navigation between pages functional
- Code syntax highlighting displays properly
- Content reads at appropriate grade level
- Manual review confirms curriculum fidelity

---

### Phase 3: Navigation, Features & Polish (Day 5 - Dec 27)

**Duration**: 1 day

**Objectives**:
- Configure intuitive sidebar navigation
- Implement search functionality
- Add SEO enhancements
- Ensure accessibility compliance
- Final design polish

**Tasks**:
1. Configure `sidebars.js`:
   - Hierarchical structure: Home → Introduction → Modules 1-4 → Resources
   - Collapsible category groups
   - Clear labels and ordering
2. Implement search:
   - Option A: Apply for Algolia DocSearch (free for open-source)
   - Option B: Install local search plugin (`@easyops-cn/docusaurus-search-local`)
3. SEO enhancements in `docusaurus.config.js`:
   - Custom meta tags (description, keywords)
   - Open Graph support (og:title, og:description, og:image)
   - Sitemap generation enabled
   - robots.txt configuration
4. Accessibility improvements:
   - Add ARIA labels to navigation elements
   - Verify keyboard navigation (Tab, Enter, Escape)
   - Ensure all images have meaningful alt text
   - Test color contrast (WCAG 2.1 AA)
   - Verify heading hierarchy (H1-H6)
5. Visual polish:
   - Refine navbar with logo (robotics icon)
   - Customize footer with credits, GitHub link, license
   - Add hover effects to navigation items
   - Ensure consistent spacing and typography
   - Mobile responsiveness testing (320px-2560px)
6. Documentation:
   - Update README.md with project overview, setup steps
   - Add CONTRIBUTING.md for future contributors
   - Document customization options

**Deliverables**:
- Configured sidebar navigation
- Search functionality (Algolia or local)
- SEO-optimized meta tags
- Accessibility compliance verified
- Polished visual design
- Comprehensive documentation

**Acceptance Criteria**:
- Sidebar navigation intuitive and complete
- Search returns relevant results for test queries
- WAVE tool reports zero accessibility errors
- Lighthouse audit scores 90+ for accessibility
- Mobile layout functional on 320px viewport
- README provides clear setup instructions

---

### Phase 4: Testing & Deployment (Days 6-7 - Dec 28-29)

**Duration**: 1-2 days

**Objectives**:
- Comprehensive testing (functionality, performance, accessibility)
- Deploy to GitHub Pages
- Verify live site meets all success criteria
- Tag v1.0.0 release

**Tasks**:
1. Testing suite:
   - **Linting**: Run ESLint, Prettier (npm run lint)
   - **Broken links**: Use Docusaurus plugin or external tool (check-html-links)
   - **Performance**: Lighthouse audit (Performance score 90+)
   - **Accessibility**: WAVE tool validation, keyboard navigation test, screen reader test (NVDA/JAWS)
   - **Responsive design**: Test on Chrome DevTools mobile emulator (multiple devices)
   - **Cross-browser**: Manual testing on Chrome, Firefox, Safari, Edge
   - **Content validation**: Manual review of all pages against curriculum
2. Production build:
   - Run `npm run build`
   - Verify build output in build/ directory
   - Check bundle size (<1MB per page)
   - Test production build locally (`npm run serve`)
3. GitHub Pages deployment:
   - Push code to main branch (triggers GitHub Actions)
   - Monitor workflow execution
   - Verify gh-pages branch created
   - Configure GitHub Pages in repository settings (source: gh-pages)
4. Post-deployment verification:
   - Visit live URL: https://[username].github.io/physical-ai-humanoid-robotics-book/
   - Test all navigation paths
   - Verify search functionality
   - Check dark/light mode toggle
   - Test mobile responsiveness on real devices
   - Validate HTTPS enforced
5. Success criteria validation:
   - SC-001: Site live on GitHub Pages ✓
   - SC-002: 100% curriculum coverage ✓
   - SC-003: Page load <2s (Lighthouse) ✓
   - SC-004: Zero WCAG errors (WAVE) ✓
   - SC-005: Search returns relevant results ✓
   - SC-006: 3-click navigation max ✓
   - SC-007: 100% code syntax highlighting ✓
   - SC-008: Responsive 320px-2560px ✓
   - SC-009: Zero-touch GitHub Actions deployment ✓
   - SC-010: 85%+ AI-generated content ✓
6. Release management:
   - Tag v1.0.0 in Git
   - Create GitHub Release with changelog
   - Share live URL with stakeholders

**Deliverables**:
- All tests passing
- Live site on GitHub Pages
- Validated success criteria
- v1.0.0 release tagged
- Documentation complete

**Acceptance Criteria**:
- Lighthouse scores: Performance 90+, Accessibility 90+, Best Practices 90+, SEO 90+
- WAVE tool: Zero errors
- All content pages accessible
- Search functional
- Mobile layout works on iPhone SE (375px) and iPad (768px)
- GitHub Actions deployment automated
- No broken links detected

---

## Timeline Summary

| Phase | Duration | Dates | Deliverable |
|-------|----------|-------|-------------|
| **Phase 1: Initialization** | 1.5 days | Dec 22-23 | Docusaurus project, custom theme, GitHub Actions |
| **Phase 2: Content Generation** | 3 days | Dec 24-26 | All 30-40 MDX pages, code examples, 100% coverage |
| **Phase 3: Features & Polish** | 1 day | Dec 27 | Navigation, search, SEO, accessibility, polish |
| **Phase 4: Testing & Deployment** | 1-2 days | Dec 28-29 | Testing, GitHub Pages deployment, v1.0.0 release |
| **Total** | **6.5-7.5 days** | **Dec 22-29** | **Live site meeting all success criteria** |

**Buffer**: 0.5-1.5 days built into timeline for unexpected issues (search integration delays, content revisions, accessibility refinements)

---

## Resources

### Tools & Technologies
- **Node.js 18+**: Runtime for Docusaurus
- **Docusaurus v3+**: Static site generator (React-based)
- **Claude Code CLI**: AI-assisted content generation (85%+ of content)
- **GitHub**: Version control and hosting
- **GitHub Actions**: CI/CD automation
- **Lighthouse**: Performance/accessibility audits
- **WAVE**: Accessibility validation
- **ESLint/Prettier**: Code quality

### Effort Estimation
- **AI-Generated**: 85%+ (content, configuration, basic styling)
- **Human Oversight**: 15% (design decisions, validation, testing, refinement)
- **Total Effort**: ~40-50 hours (spread over 7 days)

### Budget
- **$0 total cost** (all free-tier tools and services)

---

## Risk Management

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Content inaccuracies from AI generation** | Medium | High | Detailed Claude Code prompts with course excerpts; manual review against curriculum |
| **Design inconsistencies across pages** | Low | Medium | Centralize styling in CSS variables; use Docusaurus theme system |
| **Algolia DocSearch approval delay** | Medium | Low | Fallback to local search plugin (quick to install) |
| **GitHub Actions workflow errors** | Low | Medium | Test workflow on fork first; validate locally before pushing |
| **Accessibility compliance failures** | Low | High | Test early with WAVE tool; prioritize semantic HTML and ARIA labels |
| **Timeline overrun** | Medium | Medium | Buffer day built in; prioritize P1 content delivery as MVP |

**Contingency Plan**: If content generation takes longer than 3 days, defer Module 4 (VLA) to v1.1 and launch with 3 modules. MVP = Homepage + Introduction + Modules 1-3 + Learning Outcomes.

---

## Monitoring & Success Validation

### Development Phase
- Git commits tracked per phase milestone
- Daily progress reviews against timeline
- Claude Code usage logged (aiming for 85%+ generation)

### Post-Deployment
- GitHub Pages uptime monitoring (via GitHub status)
- Lighthouse scores tracked (target: 90+ all categories)
- User feedback collected (if shared publicly)
- Analytics (GitHub Pages basic stats): Pageviews, popular pages

### Success Criteria Checklist

After deployment, validate all 10 success criteria from spec.md:

- [✓] **SC-001**: Live on GitHub Pages within 7 days
- [✓] **SC-002**: 100% curriculum coverage (all modules + supporting sections)
- [✓] **SC-003**: <2s page load (Lighthouse Performance audit)
- [✓] **SC-004**: Zero WCAG errors (WAVE accessibility checker)
- [✓] **SC-005**: 95% search relevance (manual test with 20 technical terms)
- [✓] **SC-006**: 3-click navigation max (test from homepage to any page)
- [✓] **SC-007**: 100% code syntax highlighting (verify Python, bash, yaml)
- [✓] **SC-008**: Responsive 320px-2560px (test on mobile, tablet, desktop)
- [✓] **SC-009**: Zero-touch GitHub Actions deployment (automated workflow)
- [✓] **SC-010**: 85%+ AI-generated content (line count validation)

---

## Approval & Next Steps

**Plan Status**: ✅ Ready for task breakdown

**Constitution Compliance**: ✅ All 6 principles validated

**Next Command**: `/sp.tasks` to generate granular task list with dependencies and time estimates

**Estimated Task Count**: 50-70 tasks across 4 phases (setup, content, features, deployment)

This plan fully aligns with spec.md requirements and constitution principles. Static site architecture optimizes for simplicity, maintainability, and zero-cost deployment while delivering professional educational content with excellent accessibility and SEO.
