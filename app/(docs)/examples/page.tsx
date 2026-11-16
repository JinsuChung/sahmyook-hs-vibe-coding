import type { Metadata } from 'next';
import { PageShell } from '@/components/ui/page-shell';
import { ExampleGallery } from '@/components/library/example-gallery';
import { examples } from '@/content/data/examples';

export const metadata: Metadata = {
  title: `학교 업무 예시 ${examples.length}`,
  description: `수업·평가, 학급 운영, 생활기록부, 교무·학사, 공문까지. 교실과 교무실에서 바로 만들어 볼 수 있는 도구와 에이전트 예시 ${examples.length}개.`,
};

export default function Page() {
  return (
    <PageShell
      title={`학교 업무 예시 ${examples.length}`}
      description="교실과 교무실의 장면별로 기획 → 따라 하기 프롬프트 → 꼭 확인할 것 → 더 키워 보기를 담았습니다. 내 PC에서 쓰는 작은 도구부터 스킬·예약 작업·학습 도우미 같은 에이전트까지 회차 순서로 놓여 있어요. 학생 정보가 필요한 장면은 가명 처리한 파일을 쓰고, 연습은 모두 가상 데이터로 하세요."
    >
      <ExampleGallery />
    </PageShell>
  );
}
