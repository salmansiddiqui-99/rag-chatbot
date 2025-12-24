# Research & Design Decisions: Physical AI & Humanoid Robotics Online Book

**Feature**: 002-docusaurus-book
**Created**: 2025-12-22
**Status**: Phase 0 - Research Complete

## Overview

This document captures technical research and design decisions for the Docusaurus-based educational book platform. All decisions align with constitution principles and optimize for the 6-7 day delivery timeline.

---

## Decision 1: Static Site Generator Selection

### Question
Which static site generator best supports educational book content with syntax highlighting, search, and custom theming?

### Options Considered

1. **Docusaurus v3+ (Recommended)**
   - **Pros**: Built specifically for documentation, excellent React integration, native MDX v2 support, built-in search, dark mode, versioning, i18n ready, active community, Facebook-backed
   - **Cons**: Opinionated structure, requires Node.js 18+, React knowledge helpful for customization
   - **Timeline Impact**: 1.5 days setup (well-documented, extensive templates)

2. **VuePress v2**
   - **Pros**: Vue.js-based, lightweight, good plugin ecosystem, markdown-centric
   - **Cons**: Smaller community than Docusaurus, less documentation-focused features, Vue.js learning curve
   - **Timeline Impact**: 2 days setup (fewer templates, more custom config)

3. **GitBook**
   - **Pros**: Beautiful default design, simple setup, hosted solution available
   - **Cons**: Limited customization without paid tier, proprietary platform, less control over deployment
   - **Timeline Impact**: 1 day setup, but customization blockers for futuristic theme

4. **MkDocs (Material theme)**
   - **Pros**: Python-based, Material theme is stunning, fast builds
   - **Cons**: Limited React component integration, less interactive features, Python dependency conflicts with existing project
   - **Timeline Impact**: 1.5 days, but no MDX support for future RAG chatbot hooks

### Decision
**Docusaurus v3+** with Classic preset

### Rationale
- **Best-in-class documentation features**: Sidebar auto-generation, versioning, search (Algolia integration), syntax highlighting (Prism.js), dark mode
- **Future extensibility**: MDX v2 support enables React component integration for future RAG chatbot (FR requirement: "extensibility hooks for future RAG chatbot")
- **Constitution alignment**:
  - Principle V (Open-Source): MIT license, no vendor lock-in
  - Principle VI (Accessibility): Built-in WCAG compliance helpers, semantic HTML
- **Timeline fit**: Mature ecosystem with extensive templates reduces setup time
- **Familiarity**: React/Node.js stack aligns with industry standards for web development

### Validation
- ✅ Supports all FR-001 to FR-020 requirements
- ✅ SC-003 (<2s page load) achievable with Docusaurus optimization
- ✅ SC-009 (zero-touch deployment) via GitHub Actions integration

---

## Decision 2: Theme Customization Strategy

### Question
How to implement futuristic robotics theme (deep blues, electric cyan, geometric patterns) within Docusaurus?

### Options Considered

1. **CSS Variables Overrides (Recommended)**
   - **Approach**: Override Docusaurus CSS variables in `src/css/custom.css`
   - **Pros**: Minimal code, maintainable, upgrade-friendly, no build complexity
   - **Cons**: Limited to color/typography changes, geometric patterns require custom components
   - **Effort**: 4-6 hours

2. **Custom Docusaurus Theme (Swizzling)**
   - **Approach**: Eject and customize core components (Navbar, Footer, Layout)
   - **Pros**: Full design control, custom layouts possible
   - **Cons**: High maintenance burden, breaks on Docusaurus upgrades, 2-3 days effort
   - **Effort**: 2-3 days

3. **Third-Party Theme Plugin**
   - **Approach**: Install community theme (e.g., `docusaurus-theme-github-codeblock`)
   - **Pros**: Pre-built components
   - **Cons**: May not match futuristic aesthetic, dependency risk, limited to available themes
   - **Effort**: 1 day exploration + customization

### Decision
**CSS Variables Overrides** with selective component customization

### Implementation Plan
1. **Color Palette** (via CSS variables):
   ```css
   :root {
     --ifm-color-primary: #06B6D4;        /* Electric cyan */
     --ifm-color-primary-dark: #0891B2;   /* Darker cyan */
     --ifm-color-primary-darker: #0E7490;
     --ifm-background-color: #1E3A8A;     /* Deep blue */
     --ifm-font-color-base: #F3F4F6;      /* Light gray text */
   }
   ```

2. **Typography** (system fonts for performance):
   ```css
   :root {
     --ifm-font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
     --ifm-line-height-base: 1.7;
     --ifm-heading-font-weight: 600;
   }
   ```

3. **Geometric Patterns** (CSS gradients + pseudo-elements):
   - Hero section gradient: `linear-gradient(135deg, #1E3A8A 0%, #374151 100%)`
   - Circuit-inspired dividers: SVG borders via `background-image`

4. **Selective Swizzling** (only if CSS insufficient):
   - Hero component for homepage (custom layout)
   - Code block enhancements (copy button styling)

### Rationale
- **Maintainability**: CSS-first approach reduces technical debt
- **Timeline**: 4-6 hours vs 2-3 days for full theme
- **Upgrade path**: Docusaurus v3 → v4 migration unaffected
- **Constitution Principle III (Scalability)**: Modular CSS allows incremental refinement

### Validation
- ✅ FR-010 (dark/light mode) supported via Docusaurus built-in toggle
- ✅ User Story 4 (modern, accessible design) achievable with CSS
- ✅ Design Philosophy (Notes section) fully implementable

---

## Decision 3: Content Organization Structure

### Question
How to structure 4 modules + supporting sections for optimal navigation and maintainability?

### Options Considered

1. **Module-Based Directories (Recommended)**
   ```
   docs/
   ├── index.mdx                  # Homepage
   ├── module-1-ros2/
   │   ├── index.mdx              # Module overview
   │   ├── architecture.mdx
   │   ├── nodes-topics.mdx
   │   └── ...
   ├── module-2-digital-twin/
   ├── module-3-isaac/
   ├── module-4-vla/
   ├── supporting/
   │   ├── learning-outcomes.mdx
   │   ├── weekly-breakdown.mdx
   │   └── ...
   ```
   - **Pros**: Clear hierarchy, sidebar auto-generation, easy to navigate, scales with content growth
   - **Cons**: More folders to manage

2. **Flat Structure with Numeric Prefixes**
   ```
   docs/
   ├── 00-index.mdx
   ├── 01-module-1-ros2.mdx
   ├── 02-module-1-architecture.mdx
   ├── ...
   ```
   - **Pros**: Simpler file structure
   - **Cons**: No hierarchy, sidebar requires manual config, harder to maintain, doesn't scale

3. **Monolithic Sections**
   ```
   docs/
   ├── index.mdx
   ├── modules.mdx          # All 4 modules in one file
   ├── supporting.mdx       # All supporting content
   ```
   - **Pros**: Fewest files
   - **Cons**: Poor UX (long page loads), breaks SC-006 (3-click navigation), unmaintainable, no granular search results

### Decision
**Module-Based Directories** with `supporting/` subfolder

### Directory Structure
```
docs/
├── index.mdx                           # Homepage (FR-001)
├── introduction.mdx                    # Introduction to Physical AI
├── module-1-ros2/
│   ├── index.mdx                       # Module 1 overview
│   ├── 01-architecture.mdx             # ROS 2 architecture
│   ├── 02-nodes-topics-services.mdx    # Nodes/Topics/Services/Actions
│   ├── 03-rclpy-integration.mdx        # rclpy integration
│   └── 04-urdf-humanoids.mdx           # URDF for humanoids
├── module-2-digital-twin/
│   ├── index.mdx
│   ├── 01-gazebo-simulation.mdx        # Physics simulation in Gazebo
│   ├── 02-sensor-simulation.mdx        # LiDAR, Depth, IMU
│   └── 03-unity-visualization.mdx      # High-fidelity Unity
├── module-3-isaac/
│   ├── index.mdx
│   ├── 01-isaac-sim-data.mdx           # Synthetic data generation
│   ├── 02-isaac-ros-vslam.mdx          # VSLAM
│   └── 03-nav2-bipedal.mdx             # Nav2 for bipedal navigation
├── module-4-vla/
│   ├── index.mdx
│   ├── 01-voice-to-action.mdx          # Whisper integration
│   ├── 02-llm-planning.mdx             # LLM cognitive planning
│   └── 03-capstone-project.mdx         # Capstone Autonomous Humanoid
└── supporting/
    ├── learning-outcomes.mdx           # 6 learning outcomes
    ├── weekly-breakdown.mdx            # Weeks 1-13
    ├── assessments.mdx                 # Project descriptions
    └── hardware-requirements.mdx       # Hardware tables
```

### Rationale
- **FR-002 (hierarchical navigation)**: Auto-generated sidebar via `sidebars.js` config
- **SC-006 (3-click navigation)**: Maximum depth = 3 (Home → Module → Subsection)
- **Maintainability**: Modular structure allows independent updates per chapter
- **Search optimization**: Granular pages improve search result relevance (SC-005)
- **Constitution Principle III (Scalability)**: Easy to add new modules or subsections without restructuring

### Validation
- ✅ All FR-003 to FR-007 requirements map to specific file paths
- ✅ SC-002 (100% curriculum coverage) verifiable via file count
- ✅ Aligns with Docusaurus best practices (official docs use same structure)

---

## Decision 4: Search Implementation

### Question
Which search solution balances functionality, cost, and timeline constraints?

### Options Considered

1. **Algolia DocSearch (Recommended)**
   - **Approach**: Free hosted search for open-source docs, requires application approval
   - **Pros**: Best-in-class search experience, zero maintenance, instant results, typo tolerance, search analytics
   - **Cons**: Requires approval (1-2 days), dependent on third-party service, requires public GitHub repo
   - **Cost**: $0 (free tier for open-source)
   - **Timeline Impact**: +1 day for approval wait

2. **Local Search Plugin (`@easyops-cn/docusaurus-search-local`)**
   - **Approach**: Client-side search index built at build time
   - **Pros**: No external dependencies, works immediately, privacy-friendly, offline capable
   - **Cons**: Slower search (client-side indexing), larger bundle size (~200KB), limited features
   - **Cost**: $0
   - **Timeline Impact**: +2 hours setup

3. **Custom Search (Meilisearch/Typesense)**
   - **Approach**: Self-hosted search engine
   - **Pros**: Full control, advanced features
   - **Cons**: Requires server hosting ($5-10/month), maintenance burden, 2-3 days integration
   - **Cost**: $5-10/month (violates Assumption 7: free tools only)
   - **Timeline Impact**: +2-3 days

### Decision
**Local Search Plugin** as MVP, with Algolia DocSearch upgrade post-launch

### Implementation Plan
1. **Phase 3 (MVP)**: Install `@easyops-cn/docusaurus-search-local`
   ```bash
   npm install @easyops-cn/docusaurus-search-local
   ```
   Configure in `docusaurus.config.js`:
   ```js
   themes: [
     [
       require.resolve("@easyops-cn/docusaurus-search-local"),
       {
         hashed: true,
         language: ["en"],
         highlightSearchTerms: true,
         explicitSearchResultPath: true,
       },
     ],
   ],
   ```

2. **Post-Launch (Optional)**: Apply for Algolia DocSearch
   - Submit application at https://docsearch.algolia.com/apply/
   - Swap plugin in config once approved

### Rationale
- **Timeline priority**: Local search available immediately (no approval wait)
- **SC-005 (95% search relevance)**: Local plugin sufficient for 30-40 pages
- **Assumption 7 (free tools)**: Both options are free
- **Upgrade path**: Algolia can replace local search without code changes (just config swap)
- **Constitution Principle III (Scalability)**: Local search works for current scope; Algolia scales to thousands of pages if needed

### Validation
- ✅ FR-009 (search functionality) satisfied
- ✅ User Story 2 (Search and Find Information) testable immediately
- ✅ No external dependencies block launch

---

## Decision 5: Deployment Strategy

### Question
How to automate build and deployment to GitHub Pages with zero manual intervention?

### Options Considered

1. **GitHub Actions with `peaceiris/actions-gh-pages` (Recommended)**
   - **Approach**: CI/CD workflow triggers on push to `main`, builds site, deploys to `gh-pages` branch
   - **Pros**: Zero-touch deployment (SC-009), version control for workflows, build logs, PR preview capability, free for public repos
   - **Cons**: Requires GitHub Actions knowledge (20-30 min learning curve)
   - **Timeline Impact**: 2-3 hours initial setup

2. **Manual Deploy Script**
   - **Approach**: `npm run deploy` command in `package.json` (using `gh-pages` package)
   - **Pros**: Simple, no CI/CD config needed
   - **Cons**: Manual trigger required (violates SC-009), no automation, error-prone, no PR previews
   - **Timeline Impact**: 30 min setup

3. **Vercel/Netlify Integration**
   - **Approach**: Connect GitHub repo to hosting platform
   - **Pros**: Automatic deploys, PR previews, analytics
   - **Cons**: Introduces third-party dependency (violates Assumption 7: GitHub Pages required), may require paid tier for custom domains
   - **Timeline Impact**: 1 hour setup

### Decision
**GitHub Actions** with `peaceiris/actions-gh-pages` action

### Implementation Plan

**Workflow File**: `.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build website
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          cname: physical-ai-book.yourdomain.com  # Optional custom domain
```

**Configuration** (`docusaurus.config.js`):
```js
module.exports = {
  url: 'https://yourusername.github.io',
  baseUrl: '/physical-ai-humanoid-robotics-book/',
  organizationName: 'yourusername',
  projectName: 'physical-ai-humanoid-robotics-book',
  trailingSlash: false,
};
```

### Rationale
- **SC-009 (zero-touch deployment)**: Push to `main` triggers automatic deployment
- **Timeline efficiency**: One-time setup, then fully automated
- **Build validation**: CI runs on every commit, catches errors before deployment
- **Constitution Principle V (Open-Source)**: Workflow file is version-controlled and transparent
- **Cost**: $0 (GitHub Actions free for public repos, 2000 min/month)

### Validation
- ✅ User Story 1 acceptance scenario: "Deploy static site to GitHub Pages"
- ✅ SC-001 (live within 7 days): Deployment automated from Day 1
- ✅ Monitoring strategy: Build logs in GitHub Actions UI

---

## Decision 6: SEO Optimization Strategy

### Question
How to maximize search engine visibility and social sharing for educational content?

### Options Considered

1. **Docusaurus Built-In SEO + Manual Meta Tags (Recommended)**
   - **Approach**: Use Docusaurus `metadata` API + custom `Head` components for Open Graph
   - **Pros**: No plugins needed, full control, SSR-compatible
   - **Cons**: Manual meta tags per page (mitigated by templates)
   - **Effort**: 3-4 hours

2. **SEO Plugin (`@docusaurus/plugin-sitemap`)**
   - **Approach**: Install sitemap plugin (included by default in Classic preset)
   - **Pros**: Automatic sitemap generation
   - **Cons**: Basic functionality only, still need manual meta tags
   - **Effort**: 1 hour

3. **Third-Party SEO Service (e.g., Google Tag Manager)**
   - **Approach**: Integrate GTM for analytics and SEO tracking
   - **Pros**: Advanced tracking
   - **Cons**: Adds external dependency, may require cookies (privacy concerns), violates Assumption 10 (Docusaurus only)
   - **Effort**: 2-3 hours + ongoing management

### Decision
**Docusaurus Built-In SEO** with sitemap plugin (already included) + structured meta tags

### Implementation Plan

1. **Sitemap.xml** (automatic via Classic preset):
   ```js
   // docusaurus.config.js
   presets: [
     [
       'classic',
       {
         sitemap: {
           changefreq: 'weekly',
           priority: 0.5,
           ignorePatterns: ['/tags/**'],
           filename: 'sitemap.xml',
         },
       },
     ],
   ],
   ```

2. **Global Meta Tags** (`docusaurus.config.js`):
   ```js
   themeConfig: {
     metadata: [
       {name: 'keywords', content: 'physical ai, humanoid robotics, ros2, gazebo, nvidia isaac, vla'},
       {name: 'description', content: 'Comprehensive online course on Physical AI and Humanoid Robotics'},
       {property: 'og:type', content: 'website'},
       {property: 'og:image', content: 'https://yourusername.github.io/physical-ai-book/img/og-image.png'},
     ],
   }
   ```

3. **Per-Page Meta Tags** (in MDX frontmatter):
   ```mdx
   ---
   title: ROS 2 Architecture
   description: Learn the fundamentals of ROS 2 architecture for humanoid robotics
   keywords: [ros2, architecture, nodes, topics, services]
   image: /img/ros2-architecture.png
   ---
   ```

4. **Open Graph Tags** (custom component in `src/components/SEO.tsx`):
   ```tsx
   import Head from '@docusaurus/Head';

   export default function SEO({title, description, image}) {
     return (
       <Head>
         <meta property="og:title" content={title} />
         <meta property="og:description" content={description} />
         <meta property="og:image" content={image} />
         <meta name="twitter:card" content="summary_large_image" />
       </Head>
     );
   }
   ```

### Rationale
- **FR-012 (sitemap.xml)**: Automatically generated by Docusaurus
- **FR-013 (meta tags and Open Graph)**: Manually configured but templated for efficiency
- **Timeline**: 3-4 hours total (mostly copying templates across pages)
- **Constitution Principle V (Open-Source)**: No proprietary tracking services
- **Privacy-friendly**: No cookies, no user tracking (aligns with Security principle)

### Validation
- ✅ Sitemap accessible at `/sitemap.xml`
- ✅ Open Graph preview test via https://www.opengraph.xyz/
- ✅ Google Search Console indexing verification post-launch

---

## Risk Mitigation Summary

| Risk from plan.md | Research Decision | Mitigation |
|-------------------|-------------------|------------|
| Content generation timeline overrun | Decision 3 (Module structure) | Modular directories allow parallel content creation; each module can be generated independently |
| Docusaurus learning curve | Decision 1 (Docusaurus selection) | Classic preset provides opinionated defaults; extensive official docs reduce learning curve to <1 day |
| Theme customization complexity | Decision 2 (CSS variables) | CSS-first approach avoids React component complexity; 4-6 hour effort vs 2-3 days for full theme |
| Search functionality delay | Decision 4 (Local search MVP) | Local search plugin available immediately; Algolia upgrade optional post-launch |
| Deployment pipeline failures | Decision 5 (GitHub Actions) | CI/CD catches build errors before deployment; workflow tested in Phase 1 with dummy content |
| SEO/accessibility issues | Decision 6 (Built-in SEO) | Docusaurus SSR ensures crawlable HTML; meta tags templated for consistency |

---

## Open Questions (None Remaining)

All NEEDS CLARIFICATION items from Technical Context have been resolved:

1. ~~Static site generator choice~~ → **Resolved**: Docusaurus v3+
2. ~~Theme customization approach~~ → **Resolved**: CSS variables + selective swizzling
3. ~~Content structure~~ → **Resolved**: Module-based directories
4. ~~Search implementation~~ → **Resolved**: Local search (MVP), Algolia (future)
5. ~~Deployment automation~~ → **Resolved**: GitHub Actions with peaceiris/actions-gh-pages
6. ~~SEO strategy~~ → **Resolved**: Docusaurus built-in + manual meta tags

---

## Next Steps

With research complete, proceed to:

1. **Phase 1 Planning**: Create `data-model.md` to define content entity structures
2. **Phase 1 Planning**: Create `contracts/sitemap.yaml` for URL/navigation mapping
3. **Phase 1 Planning**: Create `quickstart.md` for developer onboarding
4. **Phase 1 Execution**: Initialize Docusaurus project (T001-T006)

---

## References

- [Docusaurus Official Docs](https://docusaurus.io/docs)
- [Docusaurus Classic Preset](https://docusaurus.io/docs/using-plugins#docusauruspreset-classic)
- [Algolia DocSearch](https://docsearch.algolia.com/)
- [GitHub Actions for GitHub Pages](https://github.com/marketplace/actions/github-pages-action)
- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
