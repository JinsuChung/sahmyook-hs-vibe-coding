'use client';
import type { ComponentType } from 'react';
import { ChatVsAgent } from './chat-vs-agent';
import { AgentLoop } from './agent-loop';
import { CommitTimeline } from './commit-timeline';
import { DeployPipeline } from './deploy-pipeline';
import { RlsDemo } from './rls-demo';
import { KeyPlacement } from './key-placement';
import { Injection } from './injection';
import { SkillLoading } from './skill-loading';
import { SchedulePicker } from './schedule-picker';
import { TutorCompare } from './tutor-compare';
import { simMeta, type SimName } from './meta';
import { PrintPlaceholder } from '@/components/ui/print-placeholder';
import { usePrintMode } from '@/lib/print-mode';

const components: Record<SimName, ComponentType> = {
  'chat-vs-agent': ChatVsAgent,
  'agent-loop': AgentLoop,
  'commit-timeline': CommitTimeline,
  'deploy-pipeline': DeployPipeline,
  rls: RlsDemo,
  keys: KeyPlacement,
  injection: Injection,
  'skill-loading': SkillLoading,
  'schedule-picker': SchedulePicker,
  'tutor-compare': TutorCompare,
};

export function Sim({ name }: { name: SimName }) {
  const print = usePrintMode();
  if (print.on) return <PrintPlaceholder kind="시뮬레이터" title={simMeta[name].title} />;
  const C = components[name];
  return C ? <C /> : null;
}
