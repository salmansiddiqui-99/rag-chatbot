# Physical AI & Humanoid Robotics Online Book

[![Build Status](https://github.com/salmansiddiqui-99/physical-ai-humanoid-robotics-book/actions/workflows/deploy.yml/badge.svg)](https://github.com/salmansiddiqui-99/physical-ai-humanoid-robotics-book/actions)
[![Docusaurus](https://img.shields.io/badge/Docusaurus-3.9.2-blue.svg)](https://docusaurus.io/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**Embodied Intelligence: Bridging Digital AI and the Physical World**

A comprehensive online course covering Physical AI and Humanoid Robotics, built with Docusaurus and following the Spec-Kit Plus workflow.

🌐 **Live Site**: [https://salmansiddiqui-99.github.io/physical-ai-humanoid-robotics-book/](https://salmansiddiqui-99.github.io/physical-ai-humanoid-robotics-book/)

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.0 or higher
- **npm**: v8.0 or higher
- **Git**: For version control

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The site will open at `http://localhost:3000` with hot reload enabled.

### Build for Production

```bash
# Create optimized production build
npm run build

# Test production build locally
npm run serve
```

## 📚 Course Content

### Core Modules

1. **Module 1: The Robotic Nervous System (ROS 2)**
2. **Module 2: Digital Twin Simulation**
3. **Module 3: The AI-Robot Brain (NVIDIA Isaac)**
4. **Module 4: Vision-Language-Action (VLA)**

### Supporting Resources

- Introduction to Physical AI
- Learning Outcomes (6 objectives)
- Weekly Breakdown (13 weeks)
- Assessments (4 projects + labs)
- Hardware Requirements

## 🎨 Design

- **Color Palette**: Deep navy (#1E3A8A), electric cyan (#06B6D4)
- **Typography**: Inter font family, 1.7 line-height
- **Features**: Gradient headers, geometric patterns, dark mode
- **Accessibility**: WCAG 2.1 AA compliant

## 🛠️ Development Tools

### Code Quality

```bash
# Linting
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting errors

# Formatting
npm run format        # Format all code with Prettier
npm run format:check  # Check formatting without changes

# Type checking
npm run typecheck     # Run TypeScript compiler
```

### Validation

```bash
# Run acceptance criteria validation
node validate.js
```

This validates:

- 20+ MDX content files
- Search functionality configured
- Custom theme and branding
- Accessibility features (WCAG 2.1 AA)
- Dark mode support
- Production build artifacts
- CI/CD workflow

## 🚢 Deployment

### GitHub Pages (Recommended)

1. Create GitHub repository (public)
2. Update `docusaurus.config.ts` with your GitHub username
3. Push code to GitHub
4. Enable GitHub Pages in repository settings (Source: GitHub Actions)
5. Workflow automatically deploys on push to `main` branch

📖 **Detailed Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions

### Alternative Platforms

- **Netlify**: Connect GitHub repo, configure build command `npm run build`, publish directory `build/`
- **Vercel**: Import project, framework preset Docusaurus, build command `npm run build`
- **AWS S3 + CloudFront**: Upload `build/` folder, configure static website hosting

## ✨ Features

- **🔍 Search**: Local search with keyword highlighting
- **🌓 Dark Mode**: Auto-detects system preference
- **📱 Responsive**: Mobile-first design (320px-2560px)
- **♿ Accessible**: WCAG 2.1 AA compliant, keyboard navigation
- **⚡ Fast**: Optimized build with code splitting
- **🎨 Beautiful**: Custom theme with gradient headers
- **📊 SEO Optimized**: Sitemap, meta tags, OpenGraph
- **🔧 Developer Friendly**: ESLint, Prettier, TypeScript

## 🧰 Technologies

- **Framework**: [Docusaurus 3.9.2](https://docusaurus.io/)
- **Language**: TypeScript 5.6
- **Styling**: Custom CSS with CSS Variables
- **Search**: [@easyops-cn/docusaurus-search-local](https://github.com/easyops-cn/docusaurus-search-local)
- **Deployment**: GitHub Actions + GitHub Pages
- **Code Quality**: ESLint + Prettier
- **Syntax Highlighting**: Prism.js (Python, Bash, YAML, JSON)

## 📂 Project Structure

```
physical-ai-book/
├── .github/workflows/     # GitHub Actions CI/CD
├── docs/                  # Course content (23 MDX files)
│   ├── index.mdx         # Homepage
│   ├── introduction.mdx  # Course introduction
│   ├── module-1-ros2/    # ROS 2 Basics
│   ├── module-2-digital-twin/  # Gazebo Simulation
│   ├── module-3-isaac/   # NVIDIA Isaac Platform
│   ├── module-4-vla/     # Vision-Language-Action
│   └── supporting/       # Assessments, requirements
├── src/
│   └── css/custom.css    # Custom theme and styles
├── static/
│   └── img/              # Logo, favicon, assets
├── docusaurus.config.ts  # Main configuration
├── sidebars.ts           # Navigation structure
├── validate.js           # Acceptance criteria validator
├── DEPLOYMENT.md         # Deployment instructions
└── package.json          # Dependencies and scripts
```

## 📄 License

Open-source educational content.

---

Built with [Docusaurus](https://docusaurus.io/) | Powered by Spec-Kit Plus
