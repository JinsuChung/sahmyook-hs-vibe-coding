// MDX 문법만 빠르게 검사한다: node scripts/check-mdx.mjs content/docs/sessions/1.mdx …  (인자가 없으면 전부)
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
// fumadocs-mdx가 쓰는 @mdx-js/mdx를 찾아 쓴다 (pnpm이라 최상위에는 없다)
const fmdx = require.resolve('fumadocs-mdx/package.json');
const mdxPath = createRequire(fmdx).resolve('@mdx-js/mdx');
const { compile } = await import(pathToFileURL(mdxPath).href);
let remarkGfm;
try {
  remarkGfm = (await import(pathToFileURL(createRequire(fmdx).resolve('remark-gfm')).href)).default;
} catch {}

const walk = (d, out = []) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    statSync(p).isDirectory() ? walk(p, out) : p.endsWith('.mdx') && out.push(p);
  }
  return out;
};
const files = process.argv.slice(2).length ? process.argv.slice(2) : walk('content/docs');
let bad = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
  try {
    await compile(src, { remarkPlugins: remarkGfm ? [remarkGfm] : [] });
    console.log('ok   ', f);
  } catch (e) {
    bad++;
    console.log('오류 ', f, `${e.line ?? ''}:${e.column ?? ''}`, e.reason ?? e.message);
  }
}
process.exit(bad ? 1 : 0);
