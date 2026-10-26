export type RoundType = 'jeopardy' | 'double-jeopardy' | 'final-jeopardy' | 'game-over';

export interface Clue {
  id: string;
  value: number;
  clue: string;
  answer: string;
  acceptableAnswers?: string[];
  isDailyDouble?: boolean;
  isAnswered?: boolean;
  answeredBy?: string | null;
  answeredCorrectly?: boolean | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  clues: Clue[];
}

export interface FinalJeopardyData {
  category: string;
  clue: string;
  answer: string;
  acceptableAnswers?: string[];
}

export interface GamePack {
  id: string;
  title: string;
  description: string;
  jeopardy: Category[];
  doubleJeopardy: Category[];
  finalJeopardy: FinalJeopardyData;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
  avatar?: string;
  finalWager?: number;
  finalAnswer?: string;
  finalCorrect?: boolean;
}

export type AnswerCheckResult = {
  isCorrect: boolean;
  confidence: number;
  cleanUserAnswer: string;
  cleanExpectedAnswer: string;
  feedback?: string;
};
