import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  // Site metadata (T007)
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'Embodied Intelligence: Bridging Digital AI and the Physical World',
  favicon: 'img/favicon.ico',

  // Future flags for Docusaurus v4 compatibility
  future: {
    v4: true,
  },

  // Production URL (T007 - Update with actual GitHub Pages URL)
  url: 'https://salmansiddiqui-99.github.io',
  baseUrl: '/physical-ai-humanoid-robotics-book/',

  // GitHub Pages deployment config (T007)
  organizationName: 'salmansiddiqui-99', // Replace with your GitHub username
  projectName: 'physical-ai-humanoid-robotics-book',

  onBrokenLinks: 'throw',

  // Markdown configuration (v4-compatible)
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Internationalization config
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // SEO metadata (T010)
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content:
          'physical ai, humanoid robotics, ros2, gazebo, nvidia isaac, vla, embodied intelligence, robot learning',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // Serve docs at root path
          editUrl: undefined, // Disable edit links for now
        },
        blog: false, // Disable blog feature
        theme: {
          customCss: './src/css/custom.css',
        },
        // Sitemap plugin configuration (T010)
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  // Plugins configuration
  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en'],
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig: {
    // SEO - Social card image (T010)
    image: 'img/og-image.png',

    // SEO - Metadata (T010)
    metadata: [
      {
        name: 'description',
        content:
          'Comprehensive online course on Physical AI and Humanoid Robotics covering ROS 2, Digital Twins, NVIDIA Isaac, and Vision-Language-Action systems',
      },
      { name: 'og:title', content: 'Physical AI & Humanoid Robotics' },
      {
        name: 'og:description',
        content: 'Embodied Intelligence: Bridging Digital AI and the Physical World',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],

    // Dark mode configuration (T008)
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    // Navbar configuration (T008)
    navbar: {
      title: 'Physical AI & Robotics',
      logo: {
        alt: 'Robotics Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Course',
        },
        {
          href: 'https://github.com/salmansiddiqui-99/physical-ai-humanoid-robotics-book',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    // Footer configuration (T008)
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Course',
          items: [
            {
              label: 'Introduction',
              to: '/introduction',
            },
            {
              label: 'Learning Outcomes',
              to: '/supporting/learning-outcomes',
            },
            {
              label: 'Hardware Requirements',
              to: '/supporting/hardware-requirements',
            },
          ],
        },
        {
          title: 'Modules',
          items: [
            {
              label: 'ROS 2',
              to: '/module-1-ros2',
            },
            {
              label: 'Digital Twin',
              to: '/module-2-digital-twin',
            },
            {
              label: 'NVIDIA Isaac',
              to: '/module-3-isaac',
            },
            {
              label: 'VLA Systems',
              to: '/module-4-vla',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/salmansiddiqui-99/physical-ai-humanoid-robotics-book',
            },
            {
              label: 'Weekly Breakdown',
              to: '/supporting/weekly-breakdown',
            },
            {
              label: 'Assessments',
              to: '/supporting/assessments',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics Course. Built with Docusaurus.`,
    },

    // Prism syntax highlighting configuration (T009)
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'yaml', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
