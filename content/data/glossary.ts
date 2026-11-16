export type Term = { id: string; term: string; en?: string; def: string; analogy?: string; session?: number };
import { glossaryS1 } from './parts/glossary-s1';
import { glossaryS2 } from './parts/glossary-s2';
import { glossaryS3 } from './parts/glossary-s3';
import { glossaryS4 } from './parts/glossary-s4';
import { glossaryS5 } from './parts/glossary-s5';
import { glossaryS6 } from './parts/glossary-s6';
import { glossaryS7 } from './parts/glossary-s7';
import { glossaryS8 } from './parts/glossary-s8';

export const glossary: Term[] = [
  ...glossaryS1,
  ...glossaryS2,
  ...glossaryS3,
  ...glossaryS4,
  ...glossaryS5,
  ...glossaryS6,
  ...glossaryS7,
  ...glossaryS8,
];

export const getTerm = (id: string) => glossary.find((t) => t.id === id);
