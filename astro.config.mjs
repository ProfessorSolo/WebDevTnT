// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import fs from 'node:fs';
import path from 'node:path';

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
    released: false,
  }, // true
  {
    label: 'Hamburgers on the Menu',
    directory: '05-hamburgers-on-the-menu',
    released: false,
  }, // UNRELEASED
  {
    label: 'CSS Transforms, Transitions, and Animation',
    directory: '04-css-transforms-transitions-animation',
    released: false,
  }, // UNRELEASED
  {
    label: 'CSS Variables and Custom Properties',
    directory: '05-css-variables-custom-properties',
    released: false,
  }, // UNRELEASED
  {
    label: 'CSS Layouts with Flexbox and Grid',
    directory: '06-css-layouts-flexbox-grid',
    released: false,
  }, // UNRELEASED
  {
    label: 'CSS Preprocessing with SASS',
    directory: '07-css-preprocessing-sass',
    released: false,
  }, // UNRELEASED
  {
    label: 'Automated Task Runners with Gulp',
    directory: '08-automated-task-runners-gulp',
    released: false,
  }, // UNRELEASED
  {
    label: 'Bits, Bytes, and Bobs: Course Resources, Guides, and Tips',
    directory: '99-bits-bytes-and-bobs',
    released: true,
  },
];

// SHOW_ALL_CONTENT is TRUE if running the local dev server.
// It is FALSE (only show released content) during the final production build.
const SHOW_ALL_CONTENT = import.meta.env.DEV;

// Filter based on the flag:
const visibleSidebarModules = COURSE_MODULES
  // Only show the module if it's released OR if we are in dev mode
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
        if (import.meta.env.DEV) return;
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
    }),
  ],
  vite: { plugins: [assertNoDraftsInReleased()] },
});
