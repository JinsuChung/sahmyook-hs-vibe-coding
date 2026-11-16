export type CheckItem = { id: string; label: string; hint?: string; href?: string };
export type CheckList = { id: string; title: string; items: CheckItem[] };
import { checklistsS1 } from './parts/checklists-s1';
import { checklistsS2 } from './parts/checklists-s2';
import { checklistsS3 } from './parts/checklists-s3';
import { checklistsS4 } from './parts/checklists-s4';
import { checklistsS5 } from './parts/checklists-s5';
import { checklistsS6 } from './parts/checklists-s6';
import { checklistsS7 } from './parts/checklists-s7';
import { checklistsS8 } from './parts/checklists-s8';

export const checklists: Record<string, CheckList> = {
  ...checklistsS1,
  ...checklistsS2,
  ...checklistsS3,
  ...checklistsS4,
  ...checklistsS5,
  ...checklistsS6,
  ...checklistsS7,
  ...checklistsS8,
};
