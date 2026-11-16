'use client';
import { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { AssessmentDraft } from '@/lib/supabase';

type Item = AssessmentDraft & { note: string };
type Result = { items: Item[]; suspicious: boolean; suspicious_text: string };

const MAX_CHARS = 12_000; // 서버(app/api/extract/route.ts)의 제한과 같은 값

/**
 * 평가계획 문서를 붙여 넣으면 서버(/api/extract)가 Claude API로 평가 항목을 뽑아 목록으로 보여 준다.
 * 목록에서 [등록 폼에 채우기]를 누르면 아래 등록 폼이 채워지고, 저장은 교사가 확인한 뒤 직접 누른다.
 */
export function ExtractPanel({ session, onPick }: { session: Session; onPick: (draft: AssessmentDraft) => void }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [picked, setPicked] = useState<number[]>([]);
  const [error, setError] = useState('');

  async function extract() {
    setBusy(true);
    setError('');
    setResult(null);
    setPicked([]);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ text }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) setError(data?.error ?? '실패했어요. 잠시 뒤 다시 시도하세요.');
      else setResult(data as Result);
    } catch {
      setError('서버에 연결하지 못했어요. 인터넷 연결을 확인하세요.');
    }
    setBusy(false);
  }

  return (
    <div className="form">
      <strong>평가계획 문서로 등록</strong>
      <span className="meta">
        평가계획 문서의 글을 붙여 넣으면 AI가 평가명·과목·학년·마감일·담당 교사를 뽑아 줍니다. AI 결과는 초안이에요. 저장 전에 원문과
        꼭 대조하세요. 학생 이름·성적 같은 개인정보가 든 문서는 넣지 마세요.
      </span>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="평가계획 문서 내용을 여기에 붙여 넣으세요" />
      <div className="row">
        <button disabled={busy || !text.trim() || text.length > MAX_CHARS} onClick={extract}>
          {busy ? 'AI가 읽는 중…' : 'AI로 항목 뽑기'}
        </button>
        <span className={text.length > MAX_CHARS ? 'error' : 'meta'}>
          {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}자
        </span>
      </div>
      {error && <span className="error">{error}</span>}
      {result && (
        <>
          {result.suspicious && (
            <div className="warn" role="alert">
              <p>
                <b>⚠ 숨은 지시문 의심</b> — 문서 안에 AI에게 보내는 지시로 보이는 문장이 있어요. AI는 이 문장을 따르지 않도록 설정돼
                있지만, 아래 결과를 원문과 한 줄씩 대조한 뒤 저장하세요.
              </p>
              {result.suspicious_text && <blockquote>{result.suspicious_text}</blockquote>}
            </div>
          )}
          {result.items.length === 0 ? (
            <p className="notice">평가 항목을 찾지 못했어요. 문서 내용을 확인하거나 아래 폼에 직접 입력하세요.</p>
          ) : (
            <div className="notice">
              <p>
                <b>{result.items.length}건</b>을 찾았어요. 하나씩 [등록 폼에 채우기]를 눌러 값을 확인·수정한 뒤 [저장]을 누르세요. 자동으로
                저장되지 않습니다.
              </p>
              <ul className="items">
                {result.items.map((item, i) => (
                  <li key={i}>
                    <div className="info">
                      <strong>{item.title}</strong>
                      <div className="meta">
                        {item.grade ? `${item.grade}학년` : '학년 미정'} · {item.subject || '과목 미정'} · 마감 {item.deadline || '(직접 입력)'} ·
                        담당 {item.teacher || '미정'}
                      </div>
                      {item.note && <div className="error">{item.note}</div>}
                    </div>
                    <button
                      className="secondary"
                      onClick={() => {
                        onPick({ title: item.title, subject: item.subject, grade: item.grade, deadline: item.deadline, teacher: item.teacher });
                        setPicked((p) => (p.includes(i) ? p : [...p, i]));
                      }}
                    >
                      {picked.includes(i) ? '다시 채우기' : '등록 폼에 채우기'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
