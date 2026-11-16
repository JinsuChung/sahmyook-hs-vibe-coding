import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BookOpen, FlaskConical, FolderDown, LayoutGrid, MessageSquareText } from 'lucide-react';
import { gitConfig } from './shared';
import { OSSwitch } from '@/components/ui/os';
import { PresentButton } from '@/components/present/present';

export function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/mark.svg" alt="" className="size-7" />
      <span className="text-[0.95rem] font-semibold tracking-[-0.03em]">
        바이브 코딩 <span className="hidden font-normal text-fd-muted-foreground sm:inline">· 교사 연수</span>
      </span>
    </span>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Brand />,
      url: '/',
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      { text: '회차', url: '/sessions/1', icon: <BookOpen />, active: 'nested-url' },
      { text: '프롬프트', url: '/prompts', icon: <MessageSquareText />, active: 'nested-url' },
      { text: '학교 업무 예시', url: '/examples', icon: <LayoutGrid />, active: 'nested-url' },
      { text: '실습 도구', url: '/lab', icon: <FlaskConical />, active: 'nested-url' },
      { text: '자료실', url: '/downloads', icon: <FolderDown />, active: 'nested-url' },
      { type: 'custom', on: 'nav', secondary: true, children: <OSSwitch /> },
      { type: 'custom', on: 'nav', secondary: true, children: <PresentButton /> },
    ],
  };
}
