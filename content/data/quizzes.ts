export type Question =
  | { type: 'single'; q: string; options: string[]; answer: number; explain: string; ref?: string }
  | { type: 'ox'; q: string; answer: boolean; explain: string; ref?: string }
  | { type: 'order'; q: string; items: string[]; explain: string; ref?: string };

import { quizS1, quizS15 } from './parts/quiz-s1';
import { quizS2, quizS25 } from './parts/quiz-s2';
import { quizS3, quizS35 } from './parts/quiz-s3';
import { quizS4, quizS45 } from './parts/quiz-s4';
import { quizS5, quizS55 } from './parts/quiz-s5';
import { quizS6, quizS65 } from './parts/quiz-s6';
import { quizS7, quizS75 } from './parts/quiz-s7';
import { quizS8, quizS85 } from './parts/quiz-s8';

/** 회차별 퀴즈. 키는 회차 번호(깊이 파기는 1.5처럼) */
export const quizzes: Record<number, Question[]> = {
  1: quizS1,
  1.5: quizS15,
  2: quizS2,
  2.5: quizS25,
  3: quizS3,
  3.5: quizS35,
  4: quizS4,
  4.5: quizS45,
  5: quizS5,
  5.5: quizS55,
  6: quizS6,
  6.5: quizS65,
  7: quizS7,
  7.5: quizS75,
  8: quizS8,
  8.5: quizS85,
};
