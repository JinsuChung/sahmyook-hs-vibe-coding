import type { Metadata } from 'next';
import { BookOpen, Download, FileArchive, GitBranch } from 'lucide-react';
import { Callout } from 'fumadocs-ui/components/callout';
import { PageShell } from '@/components/ui/page-shell';
import { ProgressTransfer } from '@/components/library/progress-transfer';
import { gitConfig } from '@/lib/shared';

export const metadata: Metadata = { title: '자료실', description: '실습 자료, 회차별 완성본, 진도 옮기기.' };

type FileItem = { name: string; file: string; desc: string; icon: typeof FileArchive };

const groups: { title: string; files: FileItem[] }[] = [
  {
    title: '교재',
    files: [
      { name: '인쇄용 교재 PDF · 전체 과정 한 권', file: '/downloads/sahmyook-hs-vibe-coding-book.pdf', desc: 'A4 360여 쪽. 시작하기, 1–8회차와 깊이 파기, 내 수업 사이트 만들기, 퀴즈 정답·용어사전·자주 묻는 질문까지. 브라우저에서 바로 인쇄하려면 /book 페이지를 여세요', icon: BookOpen },
    ],
  },
  {
    title: '1부 · 바이브 코딩 기초',
    files: [
      { name: '1회차 실습 자료 · 교무실 공유폴더', file: '/downloads/session1-practice.zip', desc: '정리 안 된 새봄고(가상) 교무실 공유폴더: 여러 부서의 가정통신문·공문·평가 계획·시간표·회의록·행사 사진 40여 개', icon: FileArchive },
      { name: '2회차 실습 자료 · 점수·제출물·출결·설문', file: '/downloads/session2-practice.zip', desc: '반별 수행평가 점수 엑셀 6개(양식이 조금씩 다름), 학생 제출물 파일, 출결표, 설문 응답, 글자 수 연습 문장', icon: FileArchive },
      { name: '3회차 시작 자료 · 생기부 글자 수 계산기', file: '/downloads/session3-start.zip', desc: '2회차 실습의 완성본. 2회차 결과물이 없으면 이것으로 3회차를 시작하세요', icon: FileArchive },
      { name: '3회차 완성본 · 수행평가 일정 보드', file: '/downloads/session3-assessment-board.zip', desc: 'Next.js로 만든 수행평가 D-day 보드 (가상 데이터 10건). 4회차를 이것으로 시작할 수 있어요', icon: FileArchive },
      { name: '4회차 실습 자료 · 평가계획·공문·문의', file: '/downloads/session4-practice.zip', desc: '가상 평가계획 문서 3개(1개는 숨은 지시문 포함), 공문 5개, 학부모 문의 8개', icon: FileArchive },
      { name: '4회차 완성본 · 보드 + 데이터베이스 + AI 추출', file: '/downloads/session4-assessment-board.zip', desc: 'Supabase 연결, 교사 로그인, 등록 폼, RLS 정책 SQL, Claude API로 평가계획 문서에서 일정 추출', icon: FileArchive },
    ],
  },
  {
    title: '2부 · 에이전트 개발',
    files: [
      { name: '5회차 시작 자료 · 교무수첩 업무 폴더', file: '/downloads/session5-workspace-start.zip', desc: '가상 공문 7건, 양식, 학사일정, 생기부 초안 연습 파일. 5–7회차에 이 폴더를 에이전트의 작업장으로 키웁니다', icon: FileArchive },
      { name: '7회차 완성본 · 교무수첩 (스킬·서브에이전트·자동화 포함)', file: '/downloads/session7-workspace-done.zip', desc: '완성한 CLAUDE.md, 스킬 3개, 검토 서브에이전트, 주간 브리핑 지시문과 실행 예시. 막혔을 때 비교해 보세요', icon: FileArchive },
      { name: '8회차 완성본 · 새봄 학습 도우미', file: '/downloads/session8-tutor.zip', desc: '답 대신 질문하는 과목 튜터 웹앱. 설정 파일, 시스템 프롬프트, 시험 질문 세트 포함', icon: FileArchive },
    ],
  },
];

export default function Page() {
  return (
    <PageShell title="자료실" description="실습 자료는 모두 교육용 가상 데이터입니다. 새봄고등학교와 등장하는 학생·교사·기관은 실제와 관계없습니다." full={false}>
      <div className="not-prose grid gap-3">
        {groups.map((g) => (
          <div key={g.title} className="grid gap-3">
            <h2 className="mt-3 text-base font-bold">{g.title}</h2>
            {g.files.map((f) => {
              const Icon = f.icon;
              return (
                <a
                  key={f.file}
                  href={f.file}
                  download
                  className="flex items-center gap-4 rounded-xl border bg-fd-card p-4 transition-colors hover:border-fd-primary"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold">{f.name}</span>
                    <span className="block text-sm text-fd-muted-foreground">{f.desc}</span>
                  </span>
                  <Download className="size-4 text-fd-muted-foreground" />
                </a>
              );
            })}
          </div>
        ))}
        <a
          href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-4 rounded-xl border bg-fd-card p-4 transition-colors hover:border-fd-primary"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">
            <GitBranch className="size-5" />
          </span>
          <span className="flex-1">
            <span className="block font-semibold">이 사이트의 소스 (GitHub)</span>
            <span className="block text-sm text-fd-muted-foreground">이 강의 사이트도 Claude Code로 만들었습니다. 3회차를 마치면 복제해서 직접 고쳐 볼 수 있어요.</span>
          </span>
        </a>
      </div>

      <Callout type="info" title="압축 풀기 (Windows)">
        zip 파일을 오른쪽 클릭 → <b>모두 압축 풀기</b>를 누르세요. 한국어 Windows 기본 압축 풀기에서 한글 파일명이 깨지지 않게 만들었고, 반디집·7-Zip·macOS에서도 정상으로 보입니다. 압축을 푼 폴더를 Claude Code에서 열면 됩니다. zip 안에서 파일을 바로 열지 말고 꼭 압축을 먼저 푸세요.
      </Callout>

      <h2 id="진도-옮기기">진도 옮기기</h2>
      <p>진도는 이 브라우저에만 저장됩니다. 다른 PC나 브라우저로 옮기려면 코드를 복사해 그쪽에서 붙여 넣으세요.</p>
      <ProgressTransfer />
    </PageShell>
  );
}
