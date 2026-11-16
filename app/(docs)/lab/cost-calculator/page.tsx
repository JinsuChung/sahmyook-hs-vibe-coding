import type { Metadata } from 'next';
import { PageShell } from '@/components/ui/page-shell';
import { CostCalculator, CostTable } from '@/components/tools/cost';

export const metadata: Metadata = { title: 'API 비용 계산기', description: '문서 추출과 학습 도우미 대화에 드는 Claude API 비용을 모델별로 어림합니다.' };

export default function Page() {
  return (
    <PageShell
      title="API 비용 계산기"
      description="4회차의 평가계획 일정 추출, 8회차의 학습 도우미처럼 내 앱 안에서 Claude API를 부를 때 드는 비용을 어림합니다. Claude Code를 쓰는 구독료와는 따로 청구됩니다."
      full={false}
    >
      <CostCalculator />
      <h2>모델별 요금</h2>
      <CostTable />
    </PageShell>
  );
}
