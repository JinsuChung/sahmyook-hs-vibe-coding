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
import type { SimName } from './meta';

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
  const C = components[name];
  return C ? <C /> : null;
}
