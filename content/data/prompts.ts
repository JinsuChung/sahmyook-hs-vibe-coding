export * from './prompt-types';
import type { Prompt, PromptVar } from './prompt-types';
import { promptsCommon } from './parts/prompts-common';
import { promptsFlow } from './parts/prompts-flow';
import { promptsRemix } from './parts/prompts-remix';
import { promptsS1 } from './parts/prompts-s1';
import { promptsS2 } from './parts/prompts-s2';
import { promptsS3 } from './parts/prompts-s3';
import { promptsS4 } from './parts/prompts-s4';
import { promptsS5 } from './parts/prompts-s5';
import { promptsS6 } from './parts/prompts-s6';
import { promptsS7 } from './parts/prompts-s7';
import { promptsS8 } from './parts/prompts-s8';

/** 프롬프트의 단일 출처. 회차별 파일은 content/data/parts/prompts-s{n}.ts */
export const prompts: Prompt[] = [
  ...promptsS1,
  ...promptsS2,
  ...promptsS3,
  ...promptsS4,
  ...promptsS5,
  ...promptsS6,
  ...promptsS7,
  ...promptsS8,
  ...promptsCommon,
  ...promptsFlow,
  ...promptsRemix,
];

export const getPrompt = (id: string) => prompts.find((p) => p.id === id);

export function fillPrompt(text: string, values: Record<string, string>, vars: PromptVar[] = []) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => {
    const val = values[k]?.trim();
    if (val) return val;
    return vars.find((x) => x.key === k)?.placeholder ?? k;
  });
}
