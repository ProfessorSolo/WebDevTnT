// add-draft-false.js
// Adds "draft: false" to .mdx files that don't already declare it in frontmatter.

import fs from 'fs';
import path from 'path';

const ROOT = './src/content/docs';

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && full.endsWith('.mdx')) {
      processFile(full);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Only touch files with frontmatter
  const match = content.match(/^---([\s\S]*?)---/);
  if (!match) return;

  const fm = match[1];
  if (/draft\s*:/i.test(fm)) return; // already has it

  // Insert before closing ---
  const updated = content.replace(/^---([\s\S]*?)---/, (_, inner) => {
    const trimmed = inner.trimEnd();
    return `---\n${trimmed}\ndraft: false\n---`;
  });

  fs.writeFileSync(filePath, updated, 'utf8');
  console.log('Updated:', filePath);
}

walk(ROOT);
console.log('✅ All MDX files checked and updated where needed.');
