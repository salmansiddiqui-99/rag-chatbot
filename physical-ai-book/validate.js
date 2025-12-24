#!/usr/bin/env node
/**
 * Validation script for acceptance criteria (T100-T103)
 * Verifies all requirements from spec.md are met
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running acceptance criteria validation...\n');

let passCount = 0;
let failCount = 0;

function check(name, condition, details = '') {
  if (condition) {
    console.log(`✅ ${name}`);
    if (details) console.log(`   ${details}`);
    passCount++;
  } else {
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
    failCount++;
  }
}

// AC1: 20+ educational MDX files created (comprehensive content)
const docsDir = path.join(__dirname, 'docs');
const mdxFiles = [];
function findMDX(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findMDX(fullPath);
    } else if (file.endsWith('.mdx')) {
      mdxFiles.push(fullPath);
    }
  });
}
findMDX(docsDir);
check('AC1: 20+ MDX files created', mdxFiles.length >= 20, `Found ${mdxFiles.length} MDX files`);

// AC2: Search functionality configured
const configPath = path.join(__dirname, 'docusaurus.config.ts');
const config = fs.readFileSync(configPath, 'utf-8');
check(
  'AC2: Search plugin configured',
  config.includes('docusaurus-search-local'),
  'Local search enabled'
);

// AC3: Custom theme (CSS exists and has colors)
const cssPath = path.join(__dirname, 'src/css/custom.css');
const css = fs.readFileSync(cssPath, 'utf-8').toLowerCase();
check(
  'AC3: Custom theme with brand colors',
  css.includes('#06b6d4') && css.includes('#1e3a8a'),
  'Electric cyan and deep navy theme'
);

// AC4: Accessibility features
check('AC4: Focus indicators', css.includes('focus-visible'), 'WCAG-compliant focus styles');
check('AC4: High contrast mode', css.includes('prefers-contrast: high'), 'Supports high contrast');
check('AC4: Reduced motion', css.includes('prefers-reduced-motion'), 'Respects motion preferences');

// AC5: Responsive design
check(
  'AC5: Mobile breakpoints',
  css.includes('@media') && (css.includes('768px') || css.includes('996px')),
  'Media queries for responsive design'
);

// AC6: Dark mode support
check(
  'AC6: Dark mode',
  config.includes('respectPrefersColorScheme') && css.includes("[data-theme='dark']"),
  'Light/dark mode toggle'
);

// AC7: Build artifacts exist
const buildDir = path.join(__dirname, 'build');
check('AC7: Production build exists', fs.existsSync(buildDir), 'Build directory created');

// AC8: Code formatting tools
const prettierConfig = path.join(__dirname, '.prettierrc');
const eslintConfig = path.join(__dirname, '.eslintrc.json');
check('AC8: Prettier configured', fs.existsSync(prettierConfig), 'Code formatting ready');
check('AC8: ESLint configured', fs.existsSync(eslintConfig), 'Linting ready');

// AC9: GitHub Actions workflow
const workflowPath = path.join(__dirname, '.github/workflows/deploy.yml');
check('AC9: CI/CD workflow', fs.existsSync(workflowPath), 'GitHub Actions configured');

// AC10: Visual assets
const logoPath = path.join(__dirname, 'static/img/logo.svg');
const faviconPath = path.join(__dirname, 'static/img/favicon.ico');
check('AC10: Logo created', fs.existsSync(logoPath), 'Custom SVG logo');
check('AC10: Favicon created', fs.existsSync(faviconPath), 'Custom favicon');

// Summary
console.log(`\n${'='.repeat(50)}`);
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`📊 Total: ${passCount + failCount}`);
console.log(`${'='.repeat(50)}\n`);

if (failCount === 0) {
  console.log('🎉 All acceptance criteria validated successfully!');
  process.exit(0);
} else {
  console.log('⚠️  Some acceptance criteria failed. Review above.');
  process.exit(1);
}
