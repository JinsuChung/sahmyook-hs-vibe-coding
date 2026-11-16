// 콘텐츠의 끊어진 참조를 찾는다: node scripts/check-content.mjs
// - MDX가 가리키는 프롬프트·용어·체크리스트·시뮬레이터·사실(Fact) id가 실제로 있는지
// - id 중복, 깊이 파기 계획의 제목 링크, 자료실 파일, 원본 과정에서 남은 단어
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');
const walk = (dir, out = []) => {
  for (const name of readdirSync(join(root, dir))) {
    const rel = join(dir, name);
    if (statSync(join(root, rel)).isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
};

const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

/* ---------- 데이터 파일에서 id 모으기 ---------- */
const partFiles = walk('content/data/parts');
const idsIn = (file, re = /\bid:\s*'([^']+)'/g) => [...read(file).matchAll(re)].map((m) => m[1]);

const promptIds = [];
for (const f of partFiles.filter((f) => /prompts-/.test(f))) {
  // 프롬프트 객체의 id만: 바로 뒤에 title이 온다
  for (const m of read(f).matchAll(/\bid:\s*'([^']+)',\s*\n?\s*title:/g)) promptIds.push([m[1], f]);
}
const termIds = [];
for (const f of partFiles.filter((f) => /glossary-/.test(f))) {
  for (const m of read(f).matchAll(/\{\s*id:\s*'([^']+)',\s*term:/g)) termIds.push([m[1], f]);
}
const checklistIds = [];
for (const f of partFiles.filter((f) => /checklists-/.test(f))) {
  for (const m of read(f).matchAll(/\bid:\s*'([^']+)',\s*\n?\s*title:/g)) checklistIds.push([m[1], f]);
}
const simNames = [...read('components/sim/meta.ts').matchAll(/^\s*'?([a-z][a-z0-9-]*)'?:\s*\{\s*title:/gm)].map((m) => m[1]);
const factKeys = [...read('content/data/facts.ts').matchAll(/^\s*'([a-z0-9.-]+)':\s*\{/gm)].map((m) => m[1]);
const exampleIds = idsIn('content/data/examples.ts', /\bid:\s*'([^']+)',\s*\n?\s*title:/g);

const dup = (pairs, what) => {
  const seen = new Map();
  for (const [id, f] of pairs) {
    if (seen.has(id)) err(`${what} id 중복: "${id}" (${seen.get(id)} 와 ${f})`);
    else seen.set(id, f);
  }
  return new Set(seen.keys());
};
const promptSet = dup(promptIds, '프롬프트');
const termSet = dup(termIds, '용어');
const checklistSet = dup(checklistIds, '체크리스트');
dup(exampleIds.map((id) => [id, 'examples.ts']), '업무 예시');

/* ---------- MDX 검사 ---------- */
const slugify = (h) =>
  h
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');

const mdxFiles = walk('content/docs').filter((f) => f.endsWith('.mdx'));
const headings = {};
for (const f of mdxFiles) {
  const src = read(f);
  headings[f] = [...src.matchAll(/^#{2,4}\s+(.+)$/gm)].map((m) => slugify(m[1]));

  for (const m of src.matchAll(/<PromptCard[^>]*\bid="([^"]+)"/g)) if (!promptSet.has(m[1])) err(`${f}: 없는 프롬프트 id "${m[1]}"`);
  for (const m of src.matchAll(/<Term\s+id="([^"]+)"/g)) if (!termSet.has(m[1])) err(`${f}: 없는 용어 id "${m[1]}"`);
  for (const m of src.matchAll(/<Checklist\s+list="([^"]+)"/g)) if (!checklistSet.has(m[1])) err(`${f}: 없는 체크리스트 "${m[1]}"`);
  for (const m of src.matchAll(/<Sim\s+name="([^"]+)"/g)) if (!simNames.includes(m[1])) err(`${f}: 없는 시뮬레이터 "${m[1]}"`);
  for (const m of src.matchAll(/<Fact\s+k="([^"]+)"/g)) if (!factKeys.includes(m[1])) err(`${f}: 없는 Fact 키 "${m[1]}"`);
  for (const m of src.matchAll(/\]\(\/downloads\/([^)#]+)\)/g)) {
    if (!existsSync(join(root, 'public/downloads', m[1]))) err(`${f}: 없는 자료실 파일 "${m[1]}"`);
  }
  for (const m of src.matchAll(/\]\(\/examples\/([a-z0-9-]+)\)/g)) if (!exampleIds.includes(m[1])) err(`${f}: 없는 업무 예시 "${m[1]}"`);
  for (const m of src.matchAll(/\]\(\/prompts\/([a-z0-9-]+)\)/g)) if (!promptSet.has(m[1])) err(`${f}: 없는 프롬프트 링크 "${m[1]}"`);

  // 같은 페이지 안의 Step id 중복
  const steps = [...src.matchAll(/<Step\s+id="([^"]+)"/g)].map((m) => m[1]);
  for (const s of new Set(steps)) if (steps.filter((x) => x === s).length > 1) err(`${f}: Step id 중복 "${s}"`);

  // 문체·표기
  if (/\d~\d/.test(src)) warn(`${f}: 숫자 범위에 물결표(~)가 있습니다. en dash(–)로 바꾸세요`);
  for (const m of src.matchAll(/\*\*[^*\n]*[)”"'’?!.…:]\*\*[가-힣]/g)) warn(`${f}: 굵게 표시가 깨질 수 있음 → <b> 사용: ${m[0]}`);
  for (const w of ['산학협력', '산단', '연구비', '공모', '직원 관점', '행정 업무로 비유']) {
    if (src.includes(w)) warn(`${f}: 원본 과정의 단어가 남아 있음 "${w}"`);
  }
  if (/^title:\s*[^"'\n]*:\s/m.test(src.split('\n---')[0])) err(`${f}: 머리말 title에 콜론이 있으면 큰따옴표로 감싸야 합니다`);
  if (/준비 중입니다/.test(src)) warn(`${f}: 아직 자리표시 페이지입니다`);
}

/* ---------- 깊이 파기 계획 링크 ---------- */
const sessionsSrc = read('content/data/sessions.ts');
for (const block of sessionsSrc.split(/\n  \{\n    n: /).slice(1)) {
  const slug = block.match(/slug:\s*'\/sessions\/(self-\d+)'/)?.[1];
  if (!slug) continue;
  const file = `content/docs/sessions/${slug}.mdx`;
  for (const m of block.matchAll(/href:\s*'#([^']+)'/g)) {
    if (!headings[file]?.includes(m[1])) err(`${file}: sessions.ts의 계획 링크 "#${m[1]}"에 맞는 제목이 없습니다`);
  }
}

/* ---------- 데이터 안에서 가리키는 것 ---------- */
for (const f of partFiles.filter((f) => /prompts-/.test(f))) {
  for (const m of read(f).matchAll(/related:\s*\[([^\]]*)\]/g)) {
    for (const id of m[1].matchAll(/'([^']+)'/g)) if (!promptSet.has(id[1])) err(`${f}: related에 없는 프롬프트 "${id[1]}"`);
  }
}
const downloadsPage = read('app/(docs)/downloads/page.tsx');
for (const m of downloadsPage.matchAll(/file:\s*'\/downloads\/([^']+)'/g)) {
  if (!existsSync(join(root, 'public/downloads', m[1]))) err(`자료실 페이지: 파일이 없습니다 "${m[1]}"`);
}

/* ---------- 결과 ---------- */
console.log(`프롬프트 ${promptSet.size} · 용어 ${termSet.size} · 체크리스트 ${checklistSet.size} · 예시 ${exampleIds.length} · 시뮬레이터 ${simNames.length} · MDX ${mdxFiles.length}`);
for (const w of warns) console.log(`경고  ${w}`);
for (const e of errors) console.log(`오류  ${e}`);
console.log(`\n오류 ${errors.length}건, 경고 ${warns.length}건`);
process.exit(errors.length ? 1 : 0);
