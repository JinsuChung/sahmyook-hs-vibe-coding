'use client';
import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigured, type Assessment, type AssessmentDraft } from '@/lib/supabase';
import { dday, todayInKorea, weekday } from '@/lib/dday';
import { ExtractPanel } from '@/components/extract-panel';

const EMPTY: AssessmentDraft = { title: '', subject: '', grade: null, deadline: '', teacher: '' };

export function Board() {
  const [list, setList] = useState<Assessment[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // 등록 폼에 채울 값. AI 추출 결과나 [수정] 버튼이 여기에 값을 넣는다
  const [draft, setDraft] = useState<{ values: AssessmentDraft; editingId: number | null } | null>(null);

  // 목록 불러오기 (누구나 읽기 정책)
  const load = useCallback(async () => {
    const { data, error } = await supabase.from('assessments').select('*').order('deadline');
    if (error) setError(`목록을 불러오지 못했어요: ${error.message}`);
    else {
      setError('');
      setList(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }
    load();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [load]);

  if (!supabaseConfigured) {
    return (
      <p className="notice">
        Supabase 연결 정보가 없어요. <code>.env.local.example</code>을 복사해 <code>.env.local</code>을 만들고 값을 넣은 뒤 개발 서버를 다시
        시작하세요.
      </p>
    );
  }

  const today = todayInKorea();
  const urgentCount = list.filter((a) => {
    const d = dday(a.deadline, today);
    return d >= 0 && d <= 7;
  }).length;

  return (
    <>
      <AuthPanel session={session} />
      {session && <ExtractPanel session={session} onPick={(values) => setDraft({ values, editingId: null })} />}
      {session && <AssessmentForm draft={draft} onSaved={load} onCancel={() => setDraft(null)} />}
      {error && <p className="notice error">{error}</p>}
      {loading ? (
        <p className="meta">불러오는 중…</p>
      ) : (
        <>
          <p className="summary">
            오늘 {today}({weekday(today)}) 기준 · 전체 {list.length}건 · 7일 안에 마감 <b>{urgentCount}건</b>
          </p>
          <div className="grid">
            {list.map((a) => {
              const d = dday(a.deadline, today);
              return (
                <article key={a.id} className={`card ${d >= 0 && d <= 7 ? 'urgent' : ''} ${d < 0 ? 'past' : ''}`}>
                  <div className="dday">{d < 0 ? '마감' : d === 0 ? 'D-DAY' : `D-${d}`}</div>
                  <strong>{a.title}</strong>
                  <div className="meta">
                    {a.grade ? `${a.grade}학년` : '학년 미정'} · {a.subject ?? '과목 미정'} · 담당 {a.teacher ?? '미정'}
                  </div>
                  <div className="meta">
                    마감 {a.deadline}({weekday(a.deadline)})
                  </div>
                  {session && (
                    <div>
                      <button
                        className="link"
                        onClick={() => {
                          setDraft({
                            values: { title: a.title, subject: a.subject ?? '', grade: a.grade, deadline: a.deadline, teacher: a.teacher ?? '' },
                            editingId: a.id,
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        수정
                      </button>
                      <button
                        className="link danger"
                        onClick={async () => {
                          if (!confirm(`"${a.title}"을(를) 삭제할까요?`)) return;
                          const { error, count } = await supabase.from('assessments').delete({ count: 'exact' }).eq('id', a.id);
                          if (error) alert(error.message);
                          else if (count === 0) alert('본인이 등록한 평가만 삭제할 수 있어요 (RLS 정책).');
                          load();
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

/** 교사 로그인: 계정은 Supabase 대시보드 Authentication → Users 에서 미리 만들어 둔다 (누구나 가입하는 화면은 일부러 두지 않았다) */
function AuthPanel({ session }: { session: Session | null }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  if (session) {
    return (
      <div className="bar">
        <span>{session.user.email} 로그인 중 · 평가를 등록할 수 있어요</span>
        <button className="secondary" onClick={() => supabase.auth.signOut()}>
          로그아웃
        </button>
      </div>
    );
  }
  return (
    <form
      className="bar"
      onSubmit={async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setMsg(error ? '로그인 실패: 이메일과 비밀번호를 확인하세요.' : '');
      }}
    >
      <span>교사 로그인</span>
      <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">로그인</button>
      {msg && <span className="error">{msg}</span>}
    </form>
  );
}

/** 평가 등록·수정 폼 (로그인한 교사만 추가, 등록한 본인만 수정 정책) */
function AssessmentForm({
  draft,
  onSaved,
  onCancel,
}: {
  draft: { values: AssessmentDraft; editingId: number | null } | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<AssessmentDraft>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // AI 추출 결과나 [수정] 버튼이 값을 보내면 폼을 채운다. 저장은 사람이 누른다
  useEffect(() => {
    if (!draft) return;
    setForm(draft.values);
    setEditingId(draft.editingId);
    setMsg(draft.editingId ? '' : '값을 채웠어요. 원문과 대조한 뒤 [저장]을 누르세요.');
  }, [draft]);

  const set = (k: 'title' | 'subject' | 'deadline' | 'teacher') => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  function reset() {
    setForm(EMPTY);
    setEditingId(null);
    onCancel();
  }

  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        const row = {
          title: form.title.trim(),
          subject: form.subject.trim() || null,
          grade: form.grade,
          deadline: form.deadline,
          teacher: form.teacher.trim() || null,
        };
        let failed = '';
        if (editingId) {
          // 수정: 본인이 등록한 행이 아니면 RLS 정책 때문에 바뀐 행이 0건으로 돌아온다
          const { data, error } = await supabase.from('assessments').update(row).eq('id', editingId).select('id');
          if (error) failed = `수정 실패: ${error.message}`;
          else if (!data?.length) failed = '본인이 등록한 평가만 수정할 수 있어요 (RLS 정책).';
        } else {
          const { error } = await supabase.from('assessments').insert(row);
          if (error) failed = `저장 실패: ${error.message}`;
        }
        setSaving(false);
        if (failed) return setMsg(failed);
        setMsg(editingId ? '수정했어요.' : '저장했어요.');
        setForm(EMPTY);
        setEditingId(null);
        onSaved();
      }}
    >
      <strong>{editingId ? '평가 수정' : '평가 등록'}</strong>
      <input placeholder="평가명 (필수)" value={form.title} onChange={set('title')} maxLength={100} required />
      <div className="row">
        <input placeholder="과목" value={form.subject} onChange={set('subject')} maxLength={30} />
        <select
          aria-label="학년"
          value={form.grade ?? ''}
          onChange={(e) => setForm({ ...form, grade: e.target.value ? Number(e.target.value) : null })}
        >
          <option value="">학년 선택</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </select>
        <input placeholder="담당 교사" value={form.teacher} onChange={set('teacher')} maxLength={30} />
      </div>
      <label>
        마감일 <input type="date" value={form.deadline} onChange={set('deadline')} required />
      </label>
      <div className="row">
        <button type="submit" disabled={saving}>
          {saving ? '저장 중…' : editingId ? '수정 저장' : '저장'}
        </button>
        {(editingId || form.title) && (
          <button type="button" className="secondary" onClick={reset}>
            {editingId ? '수정 취소' : '비우기'}
          </button>
        )}
        {msg && <span className="meta">{msg}</span>}
      </div>
    </form>
  );
}
