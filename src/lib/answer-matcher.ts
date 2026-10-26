import { AnswerCheckResult } from '../types/game';

function normalizeString(str: string): string {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    // Strip common Jeopardy question prefixes
    .replace(/^(what|who|where|when|why|how)\s+(is|are|was|were|the|a|an)\s+/i, '')
    .replace(/^(it\s+is|they\s+are|the|a|an)\s+/i, '')
    .replace(/['’".,/#!$%^&*;:{}=\-_`~()]/g, ' ') // remove punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        );
      }
    }
  }

  return dp[m][n];
}

function calculateSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;
  
  const longerLength = Math.max(s1.length, s2.length);
  const distance = levenshteinDistance(s1, s2);
  return (longerLength - distance) / longerLength;
}

export function checkAnswer(
  userAnswer: string,
  officialAnswer: string,
  acceptableAnswers: string[] = []
): AnswerCheckResult {
  const cleanUser = normalizeString(userAnswer);
  const cleanOfficial = normalizeString(officialAnswer);
  
  if (!cleanUser) {
    return {
      isCorrect: false,
      confidence: 0,
      cleanUserAnswer: '',
      cleanExpectedAnswer: officialAnswer,
      feedback: 'No answer submitted'
    };
  }

  const allTargets = [officialAnswer, ...acceptableAnswers];
  let bestSimilarity = 0;
  let isMatch = false;

  for (const target of allTargets) {
    const cleanTarget = normalizeString(target);
    
    // Direct normalized match
    if (cleanUser === cleanTarget) {
      return {
        isCorrect: true,
        confidence: 1.0,
        cleanUserAnswer: cleanUser,
        cleanExpectedAnswer: officialAnswer,
        feedback: 'Exact match!'
      };
    }

    // Substring contains check for multi-word answers (e.g. "James I" in "King James I")
    if (
      (cleanTarget.length > 5 && cleanUser.includes(cleanTarget)) ||
      (cleanUser.length > 5 && cleanTarget.includes(cleanUser))
    ) {
      isMatch = true;
      bestSimilarity = Math.max(bestSimilarity, 0.95);
    }

    const similarity = calculateSimilarity(cleanUser, cleanTarget);
    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
    }

    // Threshold: 80% similarity or higher
    if (similarity >= 0.80) {
      isMatch = true;
    }
  }

  return {
    isCorrect: isMatch,
    confidence: bestSimilarity,
    cleanUserAnswer: cleanUser,
    cleanExpectedAnswer: officialAnswer,
    feedback: isMatch
      ? (bestSimilarity >= 0.9 ? 'Correct!' : 'Close enough — accepted!')
      : 'Incorrect'
  };
}
