'use client';
import { useState } from 'react';
import { Lock, LockOpen, Plus, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Btn, SimFrame } from './frame';

type Role = 'visitor' | 'choi' | 'park';
const ROLES: { key: Role; label: string; subj: string; desc: string }[] = [
  { key: 'visitor', label: '방문자', subj: '방문자가', desc: '로그인하지 않은 누구나' },
  { key: 'choi', label: '최라온 선생님', subj: '최라온 선생님이', desc: '로그인한 교사 (통합과학)' },
  { key: 'park', label: '박다올 선생님', subj: '박다올 선생님이', desc: '로그인한 교사 (영어)' },
];

/** public.assessments 테이블의 행 (가상 데이터) */
const rows: { id: number; title: string; subject: string; grade: number; deadline: string; teacher: string; owner: Role }[] = [
  { id: 1, title: '탐구 보고서', subject: '통합과학', grade: 1, deadline: '2026-11-27', teacher: '최라온', owner: 'choi' },
  { id: 2, title: '말하기 발표', subject: '영어', grade: 1, deadline: '2026-12-04', teacher: '박다올', owner: 'park' },
  { id: 3, title: '실험 포트폴리오', subject: '통합과학', grade: 1, deadline: '2026-12-04', teacher: '최라온', owner: 'choi' },
];

type Action = 'add' | 'edit' | 'delete';
const VERB: Record<Action, string> = { add: '추가', edit: '수정', delete: '삭제' };

export function RlsDemo() {
  const [rls, setRls] = useState(false);
  const [role, setRole] = useState<Role>('visitor');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  /** 정책: 누구나 읽기 / 로그인한 교사만 추가 / 등록한 본인만 수정 / 등록한 본인만 삭제 */
  const can = (action: Action, owner?: Role) => {
    if (!rls) return true;
    if (role === 'visitor') return false;
    if (action === 'add') return true;
    return owner === role;
  };

  const tryAction = (action: Action, r?: (typeof rows)[number]) => {
    const who = ROLES.find((x) => x.key === role)!;
    const verb = VERB[action];
    const target = r ? `"${r.title}" 평가를` : '새 평가를';
    if (!can(action, r?.owner)) {
      setMsg({
        ok: true,
        text:
          role === 'visitor'
            ? `차단됨: 로그인하지 않으면 평가를 ${verb}할 수 없습니다 (RLS 정책).`
            : `차단됨: ${r?.teacher} 선생님이 등록한 평가입니다. 등록한 본인만 ${verb}할 수 있습니다 (RLS 정책 ${verb === '삭제' ? 4 : 3}).`,
      });
      return;
    }
    // RLS가 꺼져 있어서 통과했지만, 정책대로라면 막혔어야 하는 경우
    const shouldBlock = role === 'visitor' || (action !== 'add' && r?.owner !== role);
    setMsg({
      ok: !shouldBlock,
      text: `${who.subj} ${target} ${verb}했습니다.${
        shouldBlock ? (role === 'visitor' ? ' 로그인도 안 한 사람이 데이터를 바꿨어요!' : ' 다른 선생님이 등록한 평가를 바꿨어요!') : ''
      }`,
    });
  };

  return (
    <SimFrame
      title="RLS(행 수준 보안) 체험"
      desc="수행평가 일정 보드의 assessments 테이블입니다. 역할을 바꿔 가며 [추가]·[수정]·[삭제]를 눌러 보세요. RLS를 끄면 무슨 일이 생기는지 비교해 보세요."
      onReset={() => {
        setRls(false);
        setRole('visitor');
        setMsg(null);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-pressed={rls}
          onClick={() => {
            setRls((v) => !v);
            setMsg(null);
          }}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-white',
            rls ? 'bg-[var(--color-ok)]' : 'bg-[var(--color-danger)]',
          )}
        >
          {rls ? <Lock className="size-4" /> : <LockOpen className="size-4" />} RLS {rls ? '켜짐' : '꺼짐'}
        </button>
        <div role="radiogroup" aria-label="역할" className="flex flex-wrap gap-1.5">
          {ROLES.map((r) => (
            <button
              key={r.key}
              type="button"
              role="radio"
              aria-checked={role === r.key}
              onClick={() => {
                setRole(r.key);
                setMsg(null);
              }}
              className={cn('rounded-lg border px-3 py-1.5 text-sm', role === r.key ? 'border-fd-primary bg-fd-primary/10 font-semibold' : 'hover:bg-fd-accent')}
              title={r.desc}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {!rls && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-[color-mix(in_oklab,var(--color-danger)_10%,transparent)] px-3 py-2 text-sm font-medium text-[var(--color-danger)]">
          <ShieldAlert className="size-4 shrink-0" /> RLS가 꺼져 있으면 공개 키만 있으면 누구나 모든 행을 추가하고, 고치고, 지울 수 있습니다.
        </p>
      )}
      {rls && (
        <pre className="mt-3 overflow-x-auto rounded-lg bg-fd-muted px-3 py-2 text-xs leading-5">
{`정책 1  누구나 읽기               → 로그인하지 않아도 목록이 보임
정책 2  로그인한 교사만 추가       → 추가한 사람이 "등록한 사람"으로 기록됨
정책 3  등록한 본인만 수정         → 등록한 사람 = 지금 로그인한 사람일 때만
정책 4  등록한 본인만 삭제         → 등록한 사람 = 지금 로그인한 사람일 때만`}
        </pre>
      )}

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[26rem] text-sm">
          <thead>
            <tr className="border-b text-left text-fd-muted-foreground">
              <th className="py-2 font-medium">평가명 (과목 · 학년 · 마감일)</th>
              <th className="py-2 font-medium">담당(등록)</th>
              <th className="py-2 text-right font-medium">해 보기</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-2">
                  {r.title}
                  <span className="block text-xs text-fd-muted-foreground tabular-nums">
                    {r.subject} · {r.grade}학년 · {r.deadline}
                  </span>
                </td>
                <td className="py-2 text-fd-muted-foreground">{r.teacher}</td>
                <td className="py-2 text-right">
                  <span className="inline-flex gap-1.5">
                    <Btn variant="outline" onClick={() => tryAction('edit', r)}>수정</Btn>
                    <Btn variant="outline" onClick={() => tryAction('delete', r)}>삭제</Btn>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2">
        <Btn variant="outline" onClick={() => tryAction('add')}>
          <Plus className="size-4" /> 새 평가 추가
        </Btn>
      </div>

      {msg && (
        <p
          aria-live="polite"
          className={cn(
            'mt-3 rounded-lg px-3 py-2 text-sm font-medium',
            msg.ok ? 'bg-[color-mix(in_oklab,var(--color-ok)_10%,transparent)]' : 'bg-[color-mix(in_oklab,var(--color-danger)_12%,transparent)] text-[var(--color-danger)]',
          )}
        >
          {msg.text}
        </p>
      )}
      <p className="mt-3 text-xs text-fd-muted-foreground">교육용 가상 데이터 — 실제 기관·인물과 관계없음</p>
    </SimFrame>
  );
}
