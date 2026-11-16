import type { Metadata } from 'next';
import { PageShell } from '@/components/ui/page-shell';
import { PromptBuilder } from '@/components/tools/prompt-builder';

export const metadata: Metadata = { title: '프롬프트 빌더', description: '업무 프롬프트 5요소를 채워 완성된 프롬프트를 만듭니다.' };

export default function Page() {
  return (
    <PageShell
      title="프롬프트 빌더"
      description="평가계획서를 쓰듯 다섯 칸을 채우면 Claude Code에 바로 붙여 넣을 프롬프트가 만들어집니다. 입력한 내용은 이 브라우저에만 저장돼요. 실제 학생의 이름이나 성적은 적지 마세요."
    >
      <PromptBuilder />
    </PageShell>
  );
}
