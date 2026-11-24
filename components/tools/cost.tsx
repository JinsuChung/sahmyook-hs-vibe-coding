'use client';
import { useMemo, useState } from 'react';
import { modelPricing, pricingChecked, pricingSource, type ModelPrice } from '@/content/data/facts';
import { cn } from '@/lib/cn';
import { usePrintMode } from '@/lib/print-mode';
import { PrintPlaceholder } from '@/components/ui/print-placeholder';

/**
 * 어림 계산에 쓰는 가정.
 * - 한국어 A4 1장 ≈ 1,500토큰 (글자 크기·여백에 따라 달라지는 어림값)
 * - 원화는 아래 환율을 "가정"으로 곱한 참고값이다. 실제 환율이 아니다.
 * - Claude Haiku 5.5의 기본 요금은 요청 한 번의 프롬프트가 10만 토큰 이하일 때 기준이다.
 *   10만 토큰을 넘는 요청에는 facts.ts의 long 요금을 적용한다.
 */
const TOKENS_PER_PAGE = 1500;
const ASSUMED_RATE = 1400;

/** 요청 한 번의 비용(달러). 프롬프트 길이에 따라 요금이 달라지는 모델을 반영한다. */
function requestCost(m: ModelPrice, inTok: number, outTok: number) {
  const p = m.long && inTok > m.long.over ? m.long : m;
  return (inTok * p.input + outTok * p.output) / 1e6;
}

function usd(v: number) {
  if (v === 0) return '$0';
  if (v < 0.01) return `$${v.toFixed(4)}`;
  if (v < 1) return `$${v.toFixed(3)}`;
  return `$${v.toFixed(2)}`;
}

/** 100만 토큰당 요금 표기: 1달러 미만은 소수 둘째 자리까지 */
function price(v: number) {
  return '$' + (v < 1 ? v.toFixed(2) : String(v));
}

function won(v: number, rate: number) {
  const w = v * rate;
  if (w < 10) return `${w.toFixed(1)}원`;
  return `${Math.round(w).toLocaleString('ko-KR')}원`;
}

export function CostTable() {
  const input = 3000;
  const output = 500;
  return (
    <div className="not-prose my-5 overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[34rem] text-sm">
        <thead className="bg-fd-muted text-left">
          <tr>
            <th className="px-3 py-2 font-semibold">모델</th>
            <th className="px-3 py-2 font-semibold">성격</th>
            <th className="px-3 py-2 font-semibold">입력 / 출력 (100만 토큰당)</th>
            <th className="px-3 py-2 font-semibold">평가계획 문서 1건 추출 어림값*</th>
          </tr>
        </thead>
        <tbody>
          {modelPricing.map((m) => {
            const one = requestCost(m, input, output);
            return (
              <tr key={m.id} className="border-t">
                <td className="px-3 py-2 font-medium">
                  {m.name}
                  <code className="block text-xs font-normal text-fd-muted-foreground">{m.id}</code>
                </td>
                <td className="px-3 py-2 text-fd-muted-foreground">{m.note}</td>
                <td className="px-3 py-2 tabular-nums">
                  {price(m.input)} / {price(m.output)}
                  {m.cond && <span className="block text-xs text-fd-muted-foreground">{m.cond}</span>}
                </td>
                <td className="px-3 py-2 font-semibold tabular-nums">
                  {usd(one)}
                  <span className="block text-xs font-normal text-fd-muted-foreground">약 {won(one, ASSUMED_RATE)}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="border-t px-3 py-2 text-xs leading-5 text-fd-muted-foreground">
        * 입력 3,000토큰(A4 2장 안팎의 평가계획 문서) + 출력 500토큰으로 어림했습니다. 원화는 1달러 = {ASSUMED_RATE.toLocaleString('ko-KR')}원으로{' '}
        <b>가정한</b> 참고값이며 실제 환율이 아닙니다. Claude Haiku 5.5 요금은 요청 한 번의 프롬프트가 10만 토큰 이하일 때 기준입니다. {pricingChecked} 확인한 Claude API
        요금이며 바뀔 수 있습니다 (
        <a href={pricingSource} target="_blank" rel="noreferrer" className="underline">
          요금표
        </a>
        ).
      </p>
    </div>
  );
}

type Mode = 'doc' | 'chat';
type Doc = { pages: number; out: number; count: number };
type Chat = { sys: number; ask: number; reply: number; turns: number; students: number; sessions: number };

const DOC_DEFAULT: Doc = { pages: 2, out: 500, count: 1 };
const CHAT_DEFAULT: Chat = { sys: 800, ask: 60, reply: 250, turns: 20, students: 28, sessions: 1 };

const PRESETS: { label: string; mode: Mode; doc?: Doc; chat?: Chat }[] = [
  { label: '평가계획 문서 1건에서 일정 추출', mode: 'doc', doc: { pages: 2, out: 500, count: 1 } },
  { label: '공문 20건 요약', mode: 'doc', doc: { pages: 3, out: 400, count: 20 } },
  { label: '한 반 28명이 학습 도우미와 20턴 대화', mode: 'chat', chat: { sys: 800, ask: 60, reply: 250, turns: 20, students: 28, sessions: 1 } },
  { label: '1학년 6개 반이 한 달 동안 주 1회 대화', mode: 'chat', chat: { sys: 800, ask: 60, reply: 250, turns: 20, students: 156, sessions: 4 } },
];

/**
 * 대화는 턴마다 지금까지의 대화 전체를 다시 보낸다.
 * k번째 턴의 입력 = 시스템 프롬프트 + 앞선 (k-1)번의 질문·답 + 이번 질문.
 */
function chatCost(m: ModelPrice, c: Chat) {
  let total = 0;
  let inSum = 0;
  for (let k = 1; k <= c.turns; k++) {
    const inTok = c.sys + (k - 1) * (c.ask + c.reply) + c.ask;
    inSum += inTok;
    total += requestCost(m, inTok, c.reply);
  }
  return { one: total, inSum, outSum: c.turns * c.reply };
}

export function CostCalculator() {
  const print = usePrintMode();
  if (print.on) return <PrintPlaceholder kind="계산기" title="API 비용 계산기" />;
  return <CostCalculatorInner />;
}

function CostCalculatorInner() {
  const [model, setModel] = useState<string>(modelPricing[0].id);
  const [mode, setMode] = useState<Mode>('doc');
  const [doc, setDoc] = useState<Doc>(DOC_DEFAULT);
  const [chat, setChat] = useState<Chat>(CHAT_DEFAULT);
  const [rate, setRate] = useState(ASSUMED_RATE);

  const calc = useMemo(
    () =>
      modelPricing.map((m) => {
        if (mode === 'doc') {
          const inTok = doc.pages * TOKENS_PER_PAGE;
          const one = requestCost(m, inTok, doc.out);
          return { ...m, one, total: one * doc.count, inTok, outTok: doc.out, longApplied: !!m.long && inTok > m.long.over };
        }
        const c = chatCost(m, chat);
        const lastIn = chat.sys + (chat.turns - 1) * (chat.ask + chat.reply) + chat.ask;
        return { ...m, one: c.one, total: c.one * chat.students * chat.sessions, inTok: c.inSum, outTok: c.outSum, longApplied: !!m.long && lastIn > m.long.over };
      }),
    [mode, doc, chat],
  );
  const selected = calc.find((c) => c.id === model) ?? calc[0];
  const tiered = modelPricing.find((m) => m.long);
  const max = Math.max(...calc.map((c) => c.total));

  const num = (label: string, value: number, set: (n: number) => void, opts: { min?: number; max?: number; step?: number; unit?: string }) => (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-fd-muted-foreground">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={opts.min ?? 0}
          max={opts.max}
          step={opts.step ?? 1}
          onChange={(e) => set(Math.min(opts.max ?? Infinity, Math.max(opts.min ?? 0, Number(e.target.value) || 0)))}
          className="w-full rounded-lg border bg-fd-background px-3 py-2 tabular-nums outline-none focus:ring-2 focus:ring-fd-ring"
        />
        {opts.unit && <span className="shrink-0 text-fd-muted-foreground">{opts.unit}</span>}
      </span>
    </label>
  );

  const unitLabel = mode === 'doc' ? '문서 1건당' : '학생 1명의 대화 1회당';
  const totalLabel =
    mode === 'doc'
      ? `모두 합쳐 (${doc.count.toLocaleString('ko-KR')}건)`
      : `모두 합쳐 (${chat.students.toLocaleString('ko-KR')}명 × ${chat.sessions}회)`;

  return (
    <div className="not-prose my-6 rounded-2xl border bg-fd-card p-5">
      <p className="mb-3 text-lg font-bold">API 비용 어림 계산기</p>

      <p className="mb-1.5 text-xs font-semibold text-fd-muted-foreground">학교 예시로 채우기</p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setMode(p.mode);
              if (p.doc) setDoc(p.doc);
              if (p.chat) setChat(p.chat);
            }}
            className="rounded-full border px-2.5 py-1 text-xs font-medium hover:bg-fd-accent"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div role="radiogroup" aria-label="모델" className="mb-4 grid gap-2 sm:grid-cols-3">
        {modelPricing.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={model === m.id}
            onClick={() => setModel(m.id)}
            className={cn('rounded-xl border px-3 py-2 text-left', model === m.id ? 'border-fd-primary bg-fd-primary/10' : 'hover:bg-fd-accent')}
          >
            <span className="block font-semibold">{m.name}</span>
            <span className="block text-xs text-fd-muted-foreground">
              {price(m.input)} / {price(m.output)} · {m.note}
            </span>
            {m.cond && <span className="block text-xs text-fd-muted-foreground">({m.cond})</span>}
          </button>
        ))}
      </div>

      <div role="radiogroup" aria-label="쓰임새" className="mb-3 inline-flex rounded-full border bg-fd-muted p-0.5 text-sm font-medium">
        {(
          [
            ['doc', '문서 처리 (추출·요약)'],
            ['chat', '대화 (학습 도우미)'],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={mode === k}
            onClick={() => setMode(k)}
            className={cn('rounded-full px-3 py-1.5 transition-colors', mode === k ? 'bg-fd-primary text-fd-primary-foreground shadow-sm' : 'text-fd-muted-foreground hover:text-fd-foreground')}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'doc' ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {num('문서 1건의 분량', doc.pages, (n) => setDoc((d) => ({ ...d, pages: n })), { min: 0.5, step: 0.5, unit: 'A4장' })}
          {num('1건의 응답 길이', doc.out, (n) => setDoc((d) => ({ ...d, out: n })), { min: 50, step: 50, unit: '토큰' })}
          {num('문서 건수', doc.count, (n) => setDoc((d) => ({ ...d, count: n })), { min: 1, unit: '건' })}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          {num('시스템 프롬프트 길이', chat.sys, (n) => setChat((c) => ({ ...c, sys: n })), { min: 0, step: 100, unit: '토큰' })}
          {num('학생 질문 1번', chat.ask, (n) => setChat((c) => ({ ...c, ask: n })), { min: 10, step: 10, unit: '토큰' })}
          {num('AI 답 1번', chat.reply, (n) => setChat((c) => ({ ...c, reply: n })), { min: 50, step: 50, unit: '토큰' })}
          {num('대화 1회의 턴 수', chat.turns, (n) => setChat((c) => ({ ...c, turns: Math.round(n) })), { min: 1, max: 200, unit: '턴' })}
          {num('학생 수', chat.students, (n) => setChat((c) => ({ ...c, students: Math.round(n) })), { min: 1, unit: '명' })}
          {num('학생 1명의 대화 횟수', chat.sessions, (n) => setChat((c) => ({ ...c, sessions: Math.round(n) })), { min: 1, unit: '회' })}
        </div>
      )}

      <div className="mt-5 grid gap-4 rounded-xl bg-fd-background p-4 sm:grid-cols-2" aria-live="polite">
        <div>
          <p className="text-sm text-fd-muted-foreground">{unitLabel}</p>
          <p className="text-2xl font-bold tabular-nums">{usd(selected.one)}</p>
          <p className="text-xs text-fd-muted-foreground tabular-nums">약 {won(selected.one, rate)}</p>
          <p className="mt-2 text-sm text-fd-muted-foreground">{totalLabel}</p>
          <p className="text-3xl font-bold tabular-nums text-fd-primary">{usd(selected.total)}</p>
          <p className="text-xs text-fd-muted-foreground tabular-nums">약 {won(selected.total, rate)}</p>
          <p className="mt-2 text-xs leading-5 text-fd-muted-foreground tabular-nums">
            {mode === 'doc' ? '1건' : '대화 1회'}에 입력 {Math.round(selected.inTok).toLocaleString('ko-KR')}토큰, 출력 {Math.round(selected.outTok).toLocaleString('ko-KR')}토큰
          </p>
          {selected.longApplied && (
            <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-warn)]">
              요청 한 번의 프롬프트가 10만 토큰을 넘어 {selected.name}의 높은 요금({price(selected.long?.input ?? 0)} / {price(selected.long?.output ?? 0)})으로 계산했습니다.
            </p>
          )}
        </div>
        <div className="space-y-2" aria-label="모델별 비용 비교">
          {calc.map((c) => (
            <div key={c.id}>
              <div className="flex justify-between text-xs">
                <span className={cn(c.id === model && 'font-semibold')}>{c.name}</span>
                <span className="tabular-nums">{usd(c.total)}</span>
              </div>
              <div className="mt-1 h-2.5 rounded-full bg-fd-muted">
                <div
                  className={cn('h-full rounded-full', c.id === model ? 'bg-fd-primary' : 'bg-fd-muted-foreground/40')}
                  style={{ width: `${max ? Math.max(1, (c.total / max) * 100) : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div className="w-44">{num('원화 환산에 쓸 환율 (가정)', rate, setRate, { min: 1, step: 10, unit: '원/$' })}</div>
        <p className="min-w-0 flex-1 basis-64 text-xs leading-5 text-fd-muted-foreground">
          원화는 위 환율을 곱한 참고값입니다. 처음 들어 있는 {ASSUMED_RATE.toLocaleString('ko-KR')}원은 계산을 위한 가정이니 오늘 환율로 고쳐 쓰세요.
        </p>
      </div>

      <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-5 text-fd-muted-foreground">
        <li>한국어 A4 1장을 약 {TOKENS_PER_PAGE.toLocaleString('ko-KR')}토큰으로 어림했습니다. 실제 토큰 수는 글에 따라 다릅니다.</li>
        {mode === 'chat' && <li>대화는 턴마다 지금까지의 대화 전체를 다시 보내므로, 턴이 길어질수록 입력 토큰이 빠르게 늘어납니다. 턴 수를 바꿔 보세요.</li>}
        {tiered?.long && (
          <li>
            {tiered.name}의 {price(tiered.input)} / {price(tiered.output)} 요금은 요청 한 번의 프롬프트가 {(tiered.long.over / 10000).toLocaleString('ko-KR')}만 토큰 이하일 때 기준입니다. 넘는
            요청은 {price(tiered.long.input)} / {price(tiered.long.output)}로 계산됩니다.
          </li>
        )}
        <li>
          요금 확인일 {pricingChecked} (
          <a href={pricingSource} target="_blank" rel="noreferrer" className="underline">
            공식 요금표
          </a>
          ). 실제 사용량과 비용은 Claude Console에서 확인하세요.
        </li>
      </ul>
    </div>
  );
}
