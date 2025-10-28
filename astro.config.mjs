// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const COURSE_MODULES = [
  {
    label: 'Course Information',
    directory: '00-introduction',
    released: false,
  },
  {
    label: 'Advanced CSS and Accessible Forms',
    directory: '01-advanced-css-accessible-forms',
    released: false,
  },
  {
    label: 'Version Control with Git and GitHub',
    directory: '02-version-control-git-github',
    released: false,
  }, // UNRELEASED
  {
    label: 'Responsive Images and Navigation',
    directory: '03-day-three',
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

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Web Dev TnT',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/withastro/starlight',
        },
      ],
      sidebar: visibleSidebarModules,
      //   [
      //     {
      //       label: 'Course Information',
      //       autogenerate: { directory: '00-introduction' },
      //       collapsed: true,
      //     },
      //     {
      //       label: 'Day 01: Adv CSS and  Forms', // Your course unit name
      //       autogenerate: { directory: '01-borders-shadows-and-forms' },
      //       collapsed: true,
      //     },
      //   ],
    }),
  ],
});
