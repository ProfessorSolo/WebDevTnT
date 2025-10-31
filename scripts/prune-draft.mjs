// scripts/prune-drafts.mjs
// Remove any .md/.mdx with `draft: true` from the build in PROD.
import fs from 'node:fs';
import path from 'node:path';

if (process.env.NODE_ENV !== 'production') {
  console.log('prune-drafts: not production -> no-op');
  process.exit(0);
}

const ROOT = path.resolve('src/content/docs');
const TRASH = path.resolve('.drafts-bin'); // temp holding place (gitignored)
fs.mkdirSync(TRASH, { recursive: true });

/** Recursively walk directory */
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(md|mdx)$/i.test(entry.name)) maybePrune(full);
  }
}

/** If file has frontmatter with draft: true, move it out */
function maybePrune(file) {
  const src = fs.readFileSync(file, 'utf8');
  const fm = src.match(/^---([\s\S]*?)---/m)?.[1] ?? '';
  const isDraft = /\bdraft\s*:\s*true\b/i.test(fm);
  if (!isDraft) return;

  const rel = path.relative(ROOT, file);
  const dest = path.join(TRASH, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(file, dest); // move out of content so Starlight won't see it
  console.log('🔒 pruned draft:', rel);
}

if (fs.existsSync(ROOT)) walk(ROOT);
else console.log('prune-drafts: no docs dir found (skip)');
