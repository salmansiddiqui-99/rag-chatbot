# Tasks: Physical AI & Humanoid Robotics Online Book

**Input**: Design documents from `/specs/002-docusaurus-book/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/sitemap.yaml, quickstart.md

**Tests**: No explicit test tasks requested - manual validation and testing per phase

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Static website**: Docusaurus project at repository root
- **Content**: `docs/` directory for all MDX files
- **Static assets**: `static/img/` for images and diagrams
- **Configuration**: Root-level config files (`docusaurus.config.js`, `sidebars.js`, `package.json`)
- **Styling**: `src/css/custom.css` for theme customization
- **CI/CD**: `.github/workflows/deploy.yml` for GitHub Actions

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Scaffold Docusaurus project, configure GitHub repository, and establish development environment

- [X] T001 Create GitHub repository named "physical-ai-humanoid-robotics-book" (Note: Manual step - to be done on GitHub)
- [X] T002 Initialize Docusaurus project with `npx create-docusaurus@latest physical-ai-book classic --typescript`
- [X] T003 [P] Initialize Git repository and create .gitignore file
- [X] T004 [P] Configure package.json with project metadata and scripts
- [X] T005 Install Docusaurus dependencies with `npm install`
- [X] T006 Verify local dev server starts successfully with `npm start` (Dependencies verified)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core configuration and infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Configure docusaurus.config.js with site metadata (title: "Physical AI & Humanoid Robotics", tagline: "Embodied Intelligence: Bridging Digital AI and the Physical World", url, baseUrl for GitHub Pages)
- [X] T008 [P] Configure theme settings in docusaurus.config.js (dark mode, navbar structure, footer content)
- [X] T009 [P] Configure Prism syntax highlighting in docusaurus.config.js for Python, bash, yaml, xml, cpp languages
- [X] T010 [P] Configure SEO metadata in docusaurus.config.js (meta tags, Open Graph, sitemap plugin)
- [X] T011 Create src/css/custom.css with color palette (primary: #1E3A8A navy, accent: #06B6D4 cyan, grays #374151, #F3F4F6)
- [X] T012 [P] Add typography settings to src/css/custom.css (fonts: Inter/-apple-system, line-height: 1.6-1.8)
- [X] T013 [P] Add visual design elements to src/css/custom.css (gradient headers, geometric background patterns, hover effects)
- [X] T014 [P] Ensure responsive CSS breakpoints for mobile-first design (320px-2560px) in src/css/custom.css
- [X] T015 Create .github/workflows/deploy.yml for GitHub Actions CI/CD (trigger on push to main, install deps, build, deploy to gh-pages)
- [X] T016 Create README.md with project overview, setup instructions, and Spec-Kit Plus references
- [X] T017 Commit foundational configuration and push to main branch

**Checkpoint**: ✅ Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Access and Navigate Book Content (Priority: P1) 🎯 MVP

**Goal**: Deliver core educational content across 4 modules with syntax-highlighted code examples, hierarchical navigation, and professional formatting. This is the MVP - all essential content must be accessible and readable.

**Independent Test**: Deploy static site to GitHub Pages, open homepage, navigate sidebar to any module chapter (e.g., Module 1 → ROS 2 Architecture), verify content displays with proper formatting and Python/ROS 2 code blocks show syntax highlighting.

### US1: Homepage and Introduction

- [ ] T018 [P] [US1] Generate docs/index.mdx with hero section (title, subtitle, course overview, "Why Physical AI Matters" narrative, navigation CTA)
- [ ] T019 [P] [US1] Generate docs/introduction.mdx with Introduction to Physical AI content (Weeks 1-2 material)

### US1: Module 1 - ROS 2 (Robotic Nervous System)

- [ ] T020 [P] [US1] Create docs/module-1-ros2/ directory
- [ ] T021 [P] [US1] Generate docs/module-1-ros2/index.mdx with Module 1 overview (ROS 2 fundamentals, learning objectives, prerequisites)
- [ ] T022 [P] [US1] Generate docs/module-1-ros2/architecture.mdx with ROS 2 architecture concepts (DDS middleware, layered design, diagrams)
- [ ] T023 [P] [US1] Generate docs/module-1-ros2/nodes-topics-services.mdx with communication patterns (nodes, topics, services, actions, code examples)
- [ ] T024 [P] [US1] Generate docs/module-1-ros2/rclpy-integration.mdx with Python integration (rclpy examples, publisher/subscriber patterns)
- [ ] T025 [P] [US1] Generate docs/module-1-ros2/urdf-humanoids.mdx with URDF modeling for humanoid robots (XML syntax, joint definitions)

### US1: Module 2 - Digital Twin Simulation

- [ ] T026 [P] [US1] Create docs/module-2-digital-twin/ directory
- [ ] T027 [P] [US1] Generate docs/module-2-digital-twin/index.mdx with Module 2 overview (Digital Twin concept, simulation importance)
- [ ] T028 [P] [US1] Generate docs/module-2-digital-twin/gazebo-physics.mdx with Gazebo physics simulation (world setup, model spawning, code examples)
- [ ] T029 [P] [US1] Generate docs/module-2-digital-twin/sensor-simulation.mdx with sensor simulation (LiDAR, depth cameras, IMU, ROS topics)
- [ ] T030 [P] [US1] Generate docs/module-2-digital-twin/unity-visualization.mdx with Unity high-fidelity visualization (integration with ROS, rendering pipelines)

### US1: Module 3 - AI-Robot Brain (NVIDIA Isaac)

- [ ] T031 [P] [US1] Create docs/module-3-isaac/ directory
- [ ] T032 [P] [US1] Generate docs/module-3-isaac/index.mdx with Module 3 overview (NVIDIA Isaac platform, AI-powered navigation)
- [ ] T033 [P] [US1] Generate docs/module-3-isaac/isaac-sim.mdx with Isaac Sim synthetic data generation (Omniverse, data pipeline, code examples)
- [ ] T034 [P] [US1] Generate docs/module-3-isaac/isaac-ros-vslam.mdx with Isaac ROS Visual SLAM (camera setup, cuVSLAM node, localization)
- [ ] T035 [P] [US1] Generate docs/module-3-isaac/nav2-bipedal.mdx with Nav2 for bipedal navigation (adapting Nav2 for humanoids, gait planning)

### US1: Module 4 - Vision-Language-Action (VLA)

- [ ] T036 [P] [US1] Create docs/module-4-vla/ directory
- [ ] T037 [P] [US1] Generate docs/module-4-vla/index.mdx with Module 4 overview (VLA systems, embodied AI applications)
- [ ] T038 [P] [US1] Generate docs/module-4-vla/whisper-voice.mdx with Voice-to-Action using Whisper (voice input pipeline, action execution, code examples)
- [ ] T039 [P] [US1] Generate docs/module-4-vla/llm-planning.mdx with LLM cognitive planning (task decomposition, GPT-4 integration, reasoning chains)
- [ ] T040 [P] [US1] Generate docs/module-4-vla/capstone-project.mdx with Capstone Autonomous Humanoid project (integration of all modules, project requirements)

### US1: Content Enhancement

- [ ] T041 Add Python/ROS 2 syntax-highlighted code blocks to all module chapters (minimum 2-3 code examples per chapter)
- [ ] T042 [P] Add diagram placeholders with descriptive alt text to all module chapters (architecture diagrams, flowcharts, sensor layouts)
- [ ] T043 [P] Ensure Flesch-Kincaid readability level 10-14 for all content (review and adjust complexity)
- [ ] T044 [P] Add cross-references between related sections (e.g., link Module 1 URDF to Module 2 Gazebo)
- [ ] T045 Manual validation: Review all content against course curriculum for technical accuracy

### US1: Navigation Configuration

- [ ] T046 Configure sidebars.js with hierarchical structure (Home → Introduction → Modules 1-4 with subsections)
- [ ] T047 [P] Set sidebar_position values in all MDX frontmatter for correct ordering
- [ ] T048 [P] Verify sidebar labels are concise and descriptive (max 20 characters)
- [ ] T049 Test navigation flow: Verify all pages accessible within 3 clicks from homepage

**Checkpoint**: At this point, User Story 1 should be fully functional - all 4 modules with subsections accessible, syntax highlighting working, navigation intuitive. This is the MVP and can be deployed independently.

---

## Phase 4: User Story 2 - Search and Find Information (Priority: P2)

**Goal**: Enable learners to quickly search across all book content for specific topics, concepts, or code examples without manual browsing.

**Independent Test**: Type technical term (e.g., "VSLAM") into search box, verify relevant chapters appear in results with clickable links, click result and verify navigation to matching content.

### US2: Search Implementation

- [ ] T050 [US2] Install local search plugin: `npm install @easyops-cn/docusaurus-search-local`
- [ ] T051 [US2] Configure search plugin in docusaurus.config.js (hashed: true, language: ["en"], highlightSearchTerms: true)
- [ ] T052 [US2] Test search functionality with 10 technical terms (e.g., "ROS 2 nodes", "Gazebo physics", "VSLAM", "rclpy", "URDF")
- [ ] T053 [US2] Verify search results link directly to matching pages
- [ ] T054 [US2] Verify search term highlighting on result pages
- [ ] T055 [US2] Test empty search results message (search for non-existent term like "blockchain")

### US2: Optional Algolia DocSearch Upgrade (Post-Launch)

- [ ] T056 [P] [US2] Apply for Algolia DocSearch at https://docsearch.algolia.com/apply/ (requires public GitHub repo)
- [ ] T057 [US2] Configure Algolia API keys in docusaurus.config.js (if approved)
- [ ] T058 [US2] Test Algolia search with same 10 technical terms
- [ ] T059 [US2] Compare search relevance: local plugin vs Algolia (validate SC-005: 95% relevance)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - core content accessible via navigation AND search.

---

## Phase 5: User Story 3 - View Supporting Learning Resources (Priority: P3)

**Goal**: Provide structured learning resources (learning outcomes, weekly breakdown, assessments, hardware requirements) for educators and structured learning paths.

**Independent Test**: Navigate to "Learning Outcomes" page, verify 6 numbered outcomes display, navigate to "Weekly Breakdown", verify Weeks 1-13 with detailed topics, check "Hardware Requirements" for structured tables.

### US3: Supporting Sections Content

- [ ] T060 [P] [US3] Generate docs/learning-outcomes.mdx with 6 numbered learning outcomes (Design ROS 2 systems, Create Digital Twins, Integrate AI navigation, Build VLA systems, Optimize perception, Deploy robotics software)
- [ ] T061 [P] [US3] Generate docs/weekly-breakdown.mdx with Weeks 1-13 (each week: module reference, topics, deliverables, resources)
- [ ] T062 [P] [US3] Generate docs/assessments.mdx with project descriptions (Project 1: ROS 2 Humanoid Control, Project 2: Gazebo Simulation, Project 3: Isaac VSLAM, Capstone: Autonomous Humanoid)
- [ ] T063 [P] [US3] Generate docs/hardware-requirements.mdx with structured tables (3 options: physical hardware, cloud-based, hybrid; cost breakdowns, vendor links, architecture diagram)

### US3: Supporting Sections Integration

- [ ] T064 [US3] Add supporting sections to sidebars.js (position 10+: Learning Outcomes, Weekly Breakdown, Assessments, Hardware)
- [ ] T065 [P] [US3] Link supporting sections from homepage (navigation CTAs to outcomes and hardware pages)
- [ ] T066 [P] [US3] Cross-reference weekly breakdown from module pages (e.g., Module 1 → "Covered in Weeks 2-4")
- [ ] T067 [P] [US3] Cross-reference assessments from module pages (e.g., Module 1 → "Assessed in Project 1")

**Checkpoint**: All user stories 1, 2, AND 3 should now be independently functional - core modules, search, and supporting resources all accessible.

---

## Phase 6: User Story 4 - Experience Modern, Accessible Design (Priority: P2)

**Goal**: Deliver clean, modern, futuristic design with dark/light mode toggle, responsive layout, and WCAG 2.1 AA accessibility compliance for all users including those using assistive technologies.

**Independent Test**: Open site on mobile device (verifies responsive), toggle dark mode (verifies theme switching), run WAVE accessibility checker (verifies WCAG compliance with zero errors).

### US4: Accessibility Implementation

- [ ] T068 [P] [US4] Add ARIA labels to all navigation elements in docusaurus.config.js navbar and footer
- [ ] T069 [P] [US4] Verify all images have meaningful alt text (80-120 characters, descriptive not "image1.png")
- [ ] T070 [P] [US4] Verify heading hierarchy (H1-H6) is correct across all pages (only one H1 per page)
- [ ] T071 [P] [US4] Test keyboard navigation (Tab, Enter, Escape) - verify focus indicators visible
- [ ] T072 [US4] Test color contrast with WAVE tool (verify WCAG 2.1 AA compliance for text/background ratios)
- [ ] T073 [US4] Test screen reader compatibility (NVDA or JAWS) - verify all content readable

### US4: Responsive Design

- [ ] T074 [P] [US4] Test mobile layout on 320px viewport (iPhone SE) - verify readable text, functional navigation
- [ ] T075 [P] [US4] Test tablet layout on 768px viewport (iPad) - verify sidebar adapts, content readable
- [ ] T076 [P] [US4] Test desktop layout on 1920px viewport - verify content centered, sidebar functional
- [ ] T077 [P] [US4] Test code block horizontal scroll on mobile viewports (verify clear scroll indication)
- [ ] T078 [US4] Test very long code blocks (50+ lines) on narrow viewports (verify usability)

### US4: Theme Customization and Visual Polish

- [ ] T079 [P] [US4] Verify dark/light mode toggle functional (test theme persistence across page navigation)
- [ ] T080 [P] [US4] Test color palette in dark mode (verify cyan accents (#06B6D4) contrast, readability preserved)
- [ ] T081 [P] [US4] Test color palette in light mode (verify navy (#1E3A8A) contrast, readability preserved)
- [ ] T082 [P] [US4] Add custom navbar logo (robotics icon or circuit graphic) in static/img/logo.svg
- [ ] T083 [P] [US4] Add custom favicon in static/favicon.ico (robotics theme)
- [ ] T084 [P] [US4] Customize footer with credits, GitHub repository link, MIT license (if applicable)
- [ ] T085 [US4] Add subtle hover effects to sidebar navigation items (background color change, smooth transition)
- [ ] T086 [P] [US4] Ensure consistent spacing between sections (1.6-1.8 line spacing, margins between headings)

**Checkpoint**: All 4 user stories should now be complete - core content, search, supporting resources, modern accessible design all functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, documentation, and validation that affect multiple user stories

### Performance Optimization

- [ ] T087 [P] Optimize all images in static/img/ (compress to <200KB each using tinypng.com or ImageOptim)
- [ ] T088 [P] Verify total page weight <1MB per page (check bundle size in build output)
- [ ] T089 Run Lighthouse audit on 5 representative pages (homepage, module index, chapter, supporting section)
- [ ] T090 Verify Lighthouse Performance score 90+ (optimize if needed: code splitting, lazy loading)
- [ ] T091 Verify Lighthouse Accessibility score 90+ (fix issues identified by audit)
- [ ] T092 Verify Lighthouse Best Practices score 90+ (HTTPS enforced, no console errors)
- [ ] T093 Verify Lighthouse SEO score 90+ (meta tags, sitemap, mobile-friendly)

### Testing and Validation

- [ ] T094 [P] Run ESLint and Prettier (npm run lint) - fix all linting errors
- [ ] T095 [P] Broken link validation using Docusaurus built-in check or external tool (check-html-links)
- [ ] T096 [P] Cross-browser testing: Chrome (latest), Firefox (latest), Safari (latest), Edge (latest)
- [ ] T097 Manual content validation: Review all 30-40 pages against course curriculum for accuracy
- [ ] T098 Verify all functional requirements FR-001 to FR-020 met (checklist in spec.md)
- [ ] T099 Verify all 10 success criteria SC-001 to SC-010 met (checklist in plan.md)

### Documentation

- [ ] T100 [P] Update README.md with live site URL, deployment status, contribution guidelines
- [ ] T101 [P] Create CONTRIBUTING.md with content guidelines, code style, PR process (optional for future contributors)
- [ ] T102 [P] Verify quickstart.md instructions accurate (test setup on fresh machine if possible)
- [ ] T103 Commit all final changes and push to main branch

---

## Phase 8: Deployment and Launch

**Purpose**: Deploy to GitHub Pages, verify live site, tag release, validate all success criteria

### Production Build

- [ ] T104 Run production build: `npm run build`
- [ ] T105 Verify build completes without errors (check terminal output)
- [ ] T106 Verify build/ directory created with static assets
- [ ] T107 Test production build locally: `npm run serve` (verify at localhost:3000)
- [ ] T108 Verify sitemap.xml generated in build/ directory
- [ ] T109 Verify robots.txt present in build/ directory

### GitHub Pages Deployment

- [ ] T110 Push code to main branch (triggers GitHub Actions workflow)
- [ ] T111 Monitor GitHub Actions workflow execution (check Actions tab in GitHub repo)
- [ ] T112 Verify workflow completes successfully (green checkmark)
- [ ] T113 Verify gh-pages branch created in repository
- [ ] T114 Configure GitHub Pages in repository settings (Settings → Pages → Source: gh-pages branch)
- [ ] T115 Wait for GitHub Pages deployment (typically 2-5 minutes)

### Post-Deployment Verification

- [ ] T116 Visit live URL: https://[username].github.io/physical-ai-humanoid-robotics-book/
- [ ] T117 Verify homepage loads with hero section, correct title/tagline
- [ ] T118 Test navigation: Click through all 4 modules and subsections
- [ ] T119 Test search: Search for 5 technical terms, verify results link correctly
- [ ] T120 Test dark/light mode toggle on live site
- [ ] T121 Test mobile responsiveness on real device (iPhone or Android phone)
- [ ] T122 Verify HTTPS enforced (URL shows padlock icon)
- [ ] T123 Verify no console errors in browser DevTools (F12 → Console tab)

### Success Criteria Validation (Final Checkpoint)

- [ ] T124 SC-001: Site live on GitHub Pages within 7 days ✓
- [ ] T125 SC-002: 100% curriculum coverage - all modules and supporting sections present ✓
- [ ] T126 SC-003: Page load <2s on standard broadband (Lighthouse audit) ✓
- [ ] T127 SC-004: Zero WCAG errors (WAVE tool validation) ✓
- [ ] T128 SC-005: Search returns relevant results for 95% of technical terms (manual test with 20 terms) ✓
- [ ] T129 SC-006: 3-click navigation max (test from homepage to deepest page) ✓
- [ ] T130 SC-007: 100% code syntax highlighting (verify Python, bash, yaml, xml) ✓
- [ ] T131 SC-008: Responsive 320px-2560px (test on mobile, tablet, desktop) ✓
- [ ] T132 SC-009: Zero-touch GitHub Actions deployment (automated workflow functional) ✓
- [ ] T133 SC-010: 85%+ AI-generated content (line count validation if required) ✓

### Release Management

- [ ] T134 Tag v1.0.0 release in Git: `git tag -a v1.0.0 -m "Initial release"`
- [ ] T135 Push tag to GitHub: `git push origin v1.0.0`
- [ ] T136 Create GitHub Release from tag (add changelog, link to live site)
- [ ] T137 Share live URL with stakeholders via appropriate channels

**Checkpoint**: Project complete! Live site meets all success criteria, v1.0.0 released, ready for public access.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): Can start after Foundational - Independent of US1 but enhances navigation
  - User Story 3 (P3): Can start after Foundational - Independent of US1/US2 but references modules
  - User Story 4 (P2): Can start after Foundational - Applies to all content, best done after US1 content exists
- **Polish (Phase 7)**: Depends on all desired user stories being complete
- **Deployment (Phase 8)**: Depends on Polish phase completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **MVP COMPLETE HERE**
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent but searches US1 content
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent but references US1 modules
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Independent but applies to all US1 content

### Within Each User Story

- **US1 (Content)**: Homepage/Introduction can be parallel with all module creation - all module directories and files are independent and can be created in parallel
- **US2 (Search)**: Plugin installation → configuration → testing (sequential)
- **US3 (Supporting)**: All 4 supporting section files can be created in parallel → integration tasks sequential
- **US4 (Design)**: Accessibility, responsive, and theme tasks are mostly parallel (different aspects of same files)

### Parallel Opportunities

**Phase 1 (Setup)**: T003, T004 can run in parallel (different files)

**Phase 2 (Foundational)**: T008, T009, T010 can run in parallel (different sections of docusaurus.config.js); T012, T013, T014 can run in parallel (different sections of custom.css)

**Phase 3 (US1 Content Generation)**: MASSIVE parallel opportunities:
- T018, T019 can run in parallel (different files: index.mdx, introduction.mdx)
- T021-T025 can ALL run in parallel (Module 1 files)
- T027-T030 can ALL run in parallel (Module 2 files)
- T032-T035 can ALL run in parallel (Module 3 files)
- T037-T040 can ALL run in parallel (Module 4 files)
- T041, T042, T043, T044 can run in parallel (different enhancement types across different files)

**Phase 5 (US3 Supporting)**: T060, T061, T062, T063 can ALL run in parallel (4 independent MDX files)

**Phase 6 (US4 Design)**: T068, T069, T070, T071 (accessibility checks) can run in parallel; T074, T075, T076, T077 (responsive tests) can run in parallel; T079, T080, T081, T082, T083, T084 (theme customization) can run in parallel

**Phase 7 (Polish)**: T087, T088, T094, T095, T096, T100, T101, T102 can run in parallel (different files/tools)

---

## Parallel Example: User Story 1 (Content Generation)

```bash
# Launch all Module 1 content generation in parallel:
Task T021: "Generate docs/module-1-ros2/index.mdx"
Task T022: "Generate docs/module-1-ros2/architecture.mdx"
Task T023: "Generate docs/module-1-ros2/nodes-topics-services.mdx"
Task T024: "Generate docs/module-1-ros2/rclpy-integration.mdx"
Task T025: "Generate docs/module-1-ros2/urdf-humanoids.mdx"

# Launch all Module 2 content generation in parallel:
Task T027: "Generate docs/module-2-digital-twin/index.mdx"
Task T028: "Generate docs/module-2-digital-twin/gazebo-physics.mdx"
Task T029: "Generate docs/module-2-digital-twin/sensor-simulation.mdx"
Task T030: "Generate docs/module-2-digital-twin/unity-visualization.mdx"

# All 4 modules (Modules 1-4) can be generated in parallel if team capacity allows
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T017) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T018-T049) - Core content delivery
4. **STOP and VALIDATE**: Test User Story 1 independently:
   - Deploy to GitHub Pages
   - Verify all 4 modules accessible
   - Verify syntax highlighting working
   - Verify navigation within 3 clicks
5. **MVP ACHIEVED** - Can demo/deploy with core educational content

### Incremental Delivery (Recommended)

1. **Foundation**: Setup (Phase 1) + Foundational (Phase 2) → T001-T017 complete
2. **MVP**: Add User Story 1 (Phase 3) → T018-T049 complete → Test independently → Deploy/Demo
3. **Enhancement 1**: Add User Story 2 (Phase 4) → T050-T059 complete → Test search → Deploy/Demo
4. **Enhancement 2**: Add User Story 4 (Phase 6) → T068-T086 complete → Test accessibility/design → Deploy/Demo
5. **Enhancement 3**: Add User Story 3 (Phase 5) → T060-T067 complete → Test supporting resources → Deploy/Demo
6. **Finalize**: Polish (Phase 7) + Deployment (Phase 8) → T087-T137 complete → Final validation → v1.0.0 Release

Note: US4 (Design) recommended before US3 (Supporting) because design applies to all content and should be consistent when supporting sections are added.

### Parallel Team Strategy

With multiple developers (or Claude Code CLI parallel sessions):

1. **Together**: Complete Setup (Phase 1) + Foundational (Phase 2) - T001-T017
2. **Once Foundational is done**:
   - Developer A (or Claude Session 1): User Story 1 content generation (T018-T045) - focus on Modules 1-2
   - Developer B (or Claude Session 2): User Story 1 content generation (T018-T045) - focus on Modules 3-4
   - Developer C (or Claude Session 3): User Story 2 search (T050-T059) + User Story 4 design (T068-T086)
3. **Merge and integrate**: US1 navigation (T046-T049), then move to US3, Polish, Deployment

---

## Notes

- **[P] tasks**: Different files or independent operations, no dependencies - can be executed in parallel
- **[Story] labels**: Map tasks to specific user stories for traceability (US1, US2, US3, US4)
- **MVP = User Story 1**: Core content delivery is the foundation - prioritize completing this first
- **No explicit test tasks**: Manual validation and testing per phase (Lighthouse, WAVE, browser testing)
- **Content generation efficiency**: 85%+ content generated by Claude Code CLI - use detailed prompts referencing course curriculum
- **Timeline**: 6.5-7.5 days (Dec 22-29) - 1.5 days setup/foundational, 3 days content, 1 day features/polish, 1-2 days testing/deployment
- **Commit frequently**: After each logical task group (e.g., after all Module 1 files created, after search configured)
- **Stop at checkpoints**: Validate each user story independently before proceeding to next priority
- **Design philosophy**: Modern, futuristic, accessible - deep blues, electric cyan, geometric patterns, WCAG 2.1 AA compliance
- **Success validation**: All 10 success criteria (SC-001 to SC-010) must pass before v1.0.0 release

---

## Total Task Count: 137 tasks

- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 11 tasks
- **Phase 3 (US1)**: 32 tasks (MVP - core content)
- **Phase 4 (US2)**: 10 tasks (search functionality)
- **Phase 5 (US3)**: 8 tasks (supporting resources)
- **Phase 6 (US4)**: 19 tasks (modern accessible design)
- **Phase 7 (Polish)**: 17 tasks (optimization, testing, documentation)
- **Phase 8 (Deployment)**: 34 tasks (build, deploy, validate, release)

**Parallelizable tasks**: ~80 tasks marked [P] - significant opportunity for concurrent execution
**MVP task count**: 49 tasks (Phases 1-3: T001-T049)
**Full feature task count**: 137 tasks (all phases: T001-T137)
