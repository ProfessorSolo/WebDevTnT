// astro.config.mjs

import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import fs from 'node:fs';
import path from 'node:path';

// Google Analytics
const googleAnalyticsId = 'G-D2FGLZE0C8'; // your GA4 Measurement ID

// Define all course modules here:
const COURSE_MODULES = [
  {
    label: 'Course Information',
    directory: '00-introduction',
    released: false,
  },
  {
    label: 'CSS Dynamite: Styling That Pops',
    directory: '01-css-dynamite',
    released: true,
  },
  {
    label: 'Form Factor: Portal to Data',
    directory: '02-form-factor',
    released: true,
  },
  {
    label: 'Git Control of Your Code',
    directory: '03-git-control-of-your-code',
    released: true,
  },
  {
    label: 'Optimal Image Prime',
    directory: '04-optimal-image-prime',
    released: true,
  },
  {
    label: 'Hamburger Menu Magic',
    directory: '05-hamburger-menu-magic',
    released: true,
  },
  {
    label: 'Transformative Styling',
    directory: '06-transformative-styling',
    released: true,
  },
  {
    label: 'Ion Drive Transition Lab',
    directory: '07-ion-drive-transition-lab',
    released: true,
  },
  {
    label: 'Annie Mation',
    directory: '08-annie-mation',
    released: true,
  },
  {
    label: 'CSS Variable Wizardry',
    directory: '09-css-variable-wizardry',
    released: true,
  },
  {
    label: 'CSS Selector Spells',
    directory: '10-css-selector-spells',
    released: true,
  },
  {
    label: 'CSS Function Forge',
    directory: '11-css-function-forge',
    released: true,
  },
  {
    label: 'Flexbox and Grid',
    directory: '06-css-layouts-flexbox-grid',
    released: false,
  }, // UNRELEASED
  {
    label: 'SASS',
    directory: '07-css-preprocessing-sass',
    released: false,
  }, // UNRELEASED
  {
    label: 'Gulp',
    directory: '08-automated-task-runners-gulp',
    released: false,
  }, // UNRELEASED
  {
    label: 'Bits, Bytes, and Bobs: Course Resources, Guides, and Tips',
    directory: '99-bits-bytes-and-bobs',
    released: true,
  },
];

// SHOW_ALL_CONTENT is TRUE in non-production (local dev / preview).
// It is FALSE (only show released content) during the final production build.
const SHOW_ALL_CONTENT = process.env.NODE_ENV !== 'production';

// Filter based on the flag:
const visibleSidebarModules = COURSE_MODULES
  // Only show the module if it's released OR if we are in dev/preview mode
  .filter((module) => module.released || SHOW_ALL_CONTENT)
  .map((module) => ({
    label: module.label,
    autogenerate: { directory: module.directory },
    collapsed: true,
  }));

function assertNoDraftsInReleased() {
  return {
    name: 'assert-no-drafts-in-released',
    hooks: {
      'astro:build:start': async () => {
        if (process.env.NODE_ENV !== 'production') return;

        const releasedDirs = COURSE_MODULES.filter((m) => m.released).map(
          (m) => m.directory
        );

        for (const dir of releasedDirs) {
          const root = path.join(process.cwd(), 'src', 'content', 'docs', dir);
          if (!fs.existsSync(root)) continue;

          const files = fs.readdirSync(root, { withFileTypes: true });
          for (const f of files) {
            if (!f.isFile()) continue;
            if (!/\.(md|mdx)$/i.test(f.name)) continue;

            const src = fs.readFileSync(path.join(root, f.name), 'utf8');
            if (/^\s*---[\s\S]*?\bdraft:\s*true\b[\s\S]*?---/m.test(src)) {
              throw new Error(
                `Draft found in released module "${dir}": ${f.name}`
              );
            }
          }
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://webdevtnt.professorsolo.com',
  base: '/',
  output: 'static',
  integrations: [
    starlight({
      title: 'Web Dev TnT',
      sidebar: visibleSidebarModules,
      favicon: '/favicon.ico',
      head: [
        // Google Analytics
        {
          tag: 'script',
          attrs: {
            async: true,
            src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
          },
        },
        {
          tag: 'script',
          content: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `,
        },
      ],
      customCss: ['./src/styles/global.css'],
    }),
  ],
  vite: {
    plugins: [assertNoDraftsInReleased()],
  },
});
