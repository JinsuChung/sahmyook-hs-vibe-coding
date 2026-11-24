// 인쇄용 교재(/book)를 A4 PDF로 만든다. 차례에 쪽 번호를 넣으려고 두 번 인쇄한다.
//
// 1차: /book?markers=1 을 인쇄하고, 각 장 머리에 숨겨 둔 표식(@@장id@@)이 몇 쪽에 있는지 pdftotext로 찾는다.
// 2차: /book?pages={...} 로 차례에 쪽 번호를 채워 다시 인쇄한다.
//
// 준비물: playwright-core(프로젝트 의존성이 아니므로 다른 폴더에 설치), Chromium, pdftotext(poppler)
//   PLAYWRIGHT_CORE=/경로/node_modules/playwright-core/index.js \
//   CHROME_PATH=/경로/Chromium \
//   node scripts/make-book-pdf.mjs https://sahmyook-hs-vibe-coding.vercel.app public/downloads/sahmyook-hs-vibe-coding-book.pdf
import { execFileSync } from 'node:child_process';
import { mkdtempSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = (process.argv[2] ?? 'http://localhost:3219').replace(/\/$/, '');
const out = process.argv[3] ?? 'public/downloads/sahmyook-hs-vibe-coding-book.pdf';
const pw = await import(process.env.PLAYWRIGHT_CORE ?? 'playwright-core');
const chromium = pw.chromium ?? pw.default.chromium;

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
await page.emulateMedia({ media: 'print', colorScheme: 'light' });

async function render(query, file) {
  await page.goto(`${base}/book${query}`, { waitUntil: 'networkidle', timeout: 180_000 });
  // 개발 서버의 Next.js 표시를 숨긴다
  await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.waitForTimeout(1500);
  await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true });
  const text = execFileSync('pdftotext', ['-layout', file, '-'], { maxBuffer: 1 << 28 }).toString();
  return text.split('\f');
}

const dir = mkdtempSync(join(tmpdir(), 'book-'));
const first = join(dir, 'pass1.pdf');
const pages1 = await render('?markers=1', first);

const map = {};
pages1.forEach((t, i) => {
  for (const m of t.matchAll(/@@([a-z0-9-]+)@@/g)) map[m[1]] ??= i + 1;
});
console.log(`1차: ${pages1.length - 1}쪽, 장 표식 ${Object.keys(map).length}개`);

const second = join(dir, 'pass2.pdf');
const pages2 = await render(`?pages=${encodeURIComponent(JSON.stringify(map))}`, second);
await browser.close();

if (pages2.length !== pages1.length) {
  console.warn(`경고: 2차 쪽수(${pages2.length - 1})가 1차(${pages1.length - 1})와 다릅니다. 차례의 쪽 번호가 어긋났을 수 있습니다.`);
}
renameSync(second, out);
console.log(`완성: ${out} (${pages2.length - 1}쪽)`);
console.log(JSON.stringify(map));
