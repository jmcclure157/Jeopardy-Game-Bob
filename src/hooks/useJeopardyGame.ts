'use client';

import { useState, useCallback, useMemo } from 'react';
import { GamePack, Player, RoundType, Clue, Category } from '../types/game';
import { GAME_PACKS } from '../data/gamePacks';
import { MASTER_CATEGORY_LIBRARY, CategoryWithMeta } from '../data/categoryLibrary';
import { checkAnswer } from '../lib/answer-matcher';
import { soundFx } from '../lib/sound';

const DEFAULT_PLAYERS: Player[] = [
  { id: 'p1', name: 'Player 1', score: 0, color: 'from-blue-600 to-indigo-700' },
  { id: 'p2', name: 'Player 2', score: 0, color: 'from-red-600 to-rose-700' },
  { id: 'p3', name: 'Player 3', score: 0, color: 'from-amber-600 to-yellow-600' }
];

export function useJeopardyGame() {
  const [packIndex, setPackIndex] = useState(0);
  const [currentPack, setCurrentPack] = useState<GamePack>(GAME_PACKS[0]);
  const [round, setRound] = useState<RoundType>('jeopardy');
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);

  // Board state per round (allows marking clues answered)
  const [jeopardyCategories, setJeopardyCategories] = useState<Category[]>(() =>
    JSON.parse(JSON.stringify(GAME_PACKS[0].jeopardy))
  );
  const [doubleJeopardyCategories, setDoubleJeopardyCategories] = useState<Category[]>(() =>
    JSON.parse(JSON.stringify(GAME_PACKS[0].doubleJeopardy))
  );

  // Active clue modal state
  const [activeClueData, setActiveClueData] = useState<{
    categoryName: string;
    clue: Clue;
    categoryIdx: number;
    clueIdx: number;
  } | null>(null);

  // Daily Double state
  const [isDailyDoubleActive, setIsDailyDoubleActive] = useState(false);
  const [dailyDoubleWager, setDailyDoubleWager] = useState<number>(0);
  const [isWagerConfirmed, setIsWagerConfirmed] = useState(false);

  // Final Jeopardy state
  const [finalStage, setFinalStage] = useState<'category' | 'wagers' | 'clue' | 'reveal' | 'results'>('category');

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      soundFx.enabled = next;
      return next;
    });
  }, []);

  const currentCategories = useMemo(() => {
    return round === 'jeopardy' ? jeopardyCategories : doubleJeopardyCategories;
  }, [round, jeopardyCategories, doubleJeopardyCategories]);

  // Check if current round's board is fully completed
  const isRoundComplete = useMemo(() => {
    return currentCategories.every(cat => cat.clues.every(c => c.isAnswered));
  }, [currentCategories]);

  // Reset or Switch Game Pack
  const selectGamePack = useCallback((index: number) => {
    const pack = GAME_PACKS[index] || GAME_PACKS[0];
    setPackIndex(index);
    setCurrentPack(pack);
    setRound('jeopardy');
    setJeopardyCategories(JSON.parse(JSON.stringify(pack.jeopardy)));
    setDoubleJeopardyCategories(JSON.parse(JSON.stringify(pack.doubleJeopardy)));
    setActiveClueData(null);
    setIsDailyDoubleActive(false);
    setIsWagerConfirmed(false);
    setFinalStage('category');
    setPlayers(prev => prev.map(p => ({ ...p, score: 0, finalWager: undefined, finalAnswer: undefined, finalCorrect: undefined })));
  }, []);

  const restartGame = useCallback(() => {
    selectGamePack(packIndex);
  }, [selectGamePack, packIndex]);

  // Shuffle Categories for the current round
  const shuffleCategories = useCallback(() => {
    soundFx.playDailyDouble();
    const targetRoundType = round === 'double-jeopardy' ? 'double-jeopardy' : 'jeopardy';
    const pool = MASTER_CATEGORY_LIBRARY.filter(c => c.roundType === targetRoundType);
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const new6 = JSON.parse(JSON.stringify(shuffled.slice(0, 6)));

    // Ensure Daily Double presence
    let hasDailyDouble = new6.some((cat: Category) => cat.clues.some(c => c.isDailyDouble));
    if (!hasDailyDouble && new6.length > 0) {
      const randomCatIdx = Math.floor(Math.random() * new6.length);
      const randomClueIdx = Math.floor(Math.random() * 5);
      new6[randomCatIdx].clues[randomClueIdx].isDailyDouble = true;
    }

    if (round === 'jeopardy') {
      setJeopardyCategories(new6);
    } else if (round === 'double-jeopardy') {
      setDoubleJeopardyCategories(new6);
    }
  }, [round]);

  // Apply custom chosen categories
  const setCustomCategories = useCallback((categories: Category[]) => {
    const cloned = JSON.parse(JSON.stringify(categories));
    
    // Ensure Daily Double presence
    let hasDailyDouble = cloned.some((cat: Category) => cat.clues.some(c => c.isDailyDouble));
    if (!hasDailyDouble && cloned.length > 0) {
      const randomCatIdx = Math.floor(Math.random() * cloned.length);
      const randomClueIdx = Math.floor(Math.random() * 5);
      cloned[randomCatIdx].clues[randomClueIdx].isDailyDouble = true;
    }

    if (round === 'jeopardy') {
      setJeopardyCategories(cloned);
    } else if (round === 'double-jeopardy') {
      setDoubleJeopardyCategories(cloned);
    }
  }, [round]);

  // Select Clue from Board
  const selectClue = useCallback((categoryIdx: number, clueIdx: number) => {
    const cats = round === 'jeopardy' ? jeopardyCategories : doubleJeopardyCategories;
    const cat = cats[categoryIdx];
    if (!cat) return;
    const clue = cat.clues[clueIdx];
    if (!clue || clue.isAnswered) return;

    if (clue.isDailyDouble) {
      setIsDailyDoubleActive(true);
      setIsWagerConfirmed(false);
      setDailyDoubleWager(0);
      soundFx.playDailyDouble();
    }

    setActiveClueData({
      categoryName: cat.name,
      clue,
      categoryIdx,
      clueIdx
    });
  }, [round, jeopardyCategories, doubleJeopardyCategories]);

  // Mark clue as answered on board
  const markClueAnswered = useCallback((categoryIdx: number, clueIdx: number, answeredBy?: string, isCorrect?: boolean) => {
    const updateCategories = (cats: Category[]) => {
      const next = [...cats];
      const targetCat = { ...next[categoryIdx] };
      const targetClues = [...targetCat.clues];
      targetClues[clueIdx] = {
        ...targetClues[clueIdx],
        isAnswered: true,
        answeredBy: answeredBy || null,
        answeredCorrectly: isCorrect ?? null
      };
      targetCat.clues = targetClues;
      next[categoryIdx] = targetCat;
      return next;
    };

    if (round === 'jeopardy') {
      setJeopardyCategories(updateCategories);
    } else if (round === 'double-jeopardy') {
      setDoubleJeopardyCategories(updateCategories);
    }
  }, [round]);

  // Close active clue modal
  const closeClueModal = useCallback(() => {
    setActiveClueData(null);
    setIsDailyDoubleActive(false);
    setIsWagerConfirmed(false);
    setDailyDoubleWager(0);
  }, []);

  // Answer Submission with fuzzy validation
  const submitAnswer = useCallback((
    userAnswer: string,
    playerId: string,
    customValue?: number
  ) => {
    if (!activeClueData) return;

    const { clue, categoryIdx, clueIdx } = activeClueData;
    const pointValue = customValue !== undefined ? customValue : clue.value;
    const match = checkAnswer(userAnswer, clue.answer, clue.acceptableAnswers);

    if (match.isCorrect) {
      soundFx.playCorrect();
      setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, score: p.score + pointValue } : p));
      markClueAnswered(categoryIdx, clueIdx, playerId, true);
      const pIdx = players.findIndex(p => p.id === playerId);
      if (pIdx !== -1) setActivePlayerIndex(pIdx);
    } else {
      soundFx.playIncorrect();
      setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, score: p.score - pointValue } : p));
      if (isDailyDoubleActive) {
        markClueAnswered(categoryIdx, clueIdx, playerId, false);
      }
    }

    return match;
  }, [activeClueData, isDailyDoubleActive, players, markClueAnswered]);

  // Manual Host Override (Score Adjustment)
  const hostOverride = useCallback((
    playerId: string,
    isCorrect: boolean,
    customValue?: number
  ) => {
    if (!activeClueData) return;
    const { clue, categoryIdx, clueIdx } = activeClueData;
    const pointValue = customValue !== undefined ? customValue : (isDailyDoubleActive ? dailyDoubleWager : clue.value);

    if (isCorrect) {
      soundFx.playCorrect();
      setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, score: p.score + pointValue } : p));
      markClueAnswered(categoryIdx, clueIdx, playerId, true);
    } else {
      soundFx.playIncorrect();
      setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, score: p.score - pointValue } : p));
    }
  }, [activeClueData, isDailyDoubleActive, dailyDoubleWager, markClueAnswered]);

  // Pass clue without anyone getting points
  const passClue = useCallback(() => {
    if (!activeClueData) return;
    const { categoryIdx, clueIdx } = activeClueData;
    markClueAnswered(categoryIdx, clueIdx);
    closeClueModal();
  }, [activeClueData, markClueAnswered, closeClueModal]);

  // Player manual score adjust (+/- buttons on scoreboard)
  const adjustPlayerScore = useCallback((playerId: string, delta: number) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, score: p.score + delta } : p));
  }, []);

  // Update Player Details (Name, count)
  const updatePlayerName = useCallback((playerId: string, newName: string) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, name: newName } : p));
  }, []);

  const setPlayerCount = useCallback((count: number) => {
    if (count < 1 || count > 3) return;
    setPlayers(DEFAULT_PLAYERS.slice(0, count));
  }, []);

  // Transition to next round
  const goToNextRound = useCallback(() => {
    if (round === 'jeopardy') {
      setRound('double-jeopardy');
      closeClueModal();
    } else if (round === 'double-jeopardy') {
      setRound('final-jeopardy');
      setFinalStage('category');
      closeClueModal();
    } else if (round === 'final-jeopardy') {
      setRound('game-over');
    }
  }, [round, closeClueModal]);

  // Final Jeopardy Actions
  const updateFinalWager = useCallback((playerId: string, wager: number) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, finalWager: wager } : p));
  }, []);

  const updateFinalAnswer = useCallback((playerId: string, answer: string) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, finalAnswer: answer } : p));
  }, []);

  const scoreFinalJeopardy = useCallback((evaluations: Record<string, boolean>) => {
    setPlayers(prev => prev.map(p => {
      const isCorrect = evaluations[p.id] ?? false;
      const wager = p.finalWager || 0;
      const newScore = isCorrect ? p.score + wager : p.score - wager;
      return {
        ...p,
        score: newScore,
        finalCorrect: isCorrect
      };
    }));
    setFinalStage('results');
  }, []);

  return {
    packIndex,
    currentPack,
    round,
    players,
    activePlayerIndex,
    currentCategories,
    activeClueData,
    isDailyDoubleActive,
    dailyDoubleWager,
    isWagerConfirmed,
    finalStage,
    soundEnabled,
    isRoundComplete,
    setActivePlayerIndex,
    selectGamePack,
    restartGame,
    shuffleCategories,
    setCustomCategories,
    selectClue,
    closeClueModal,
    submitAnswer,
    hostOverride,
    passClue,
    adjustPlayerScore,
    updatePlayerName,
    setPlayerCount,
    setDailyDoubleWager,
    setIsWagerConfirmed,
    goToNextRound,
    setFinalStage,
    updateFinalWager,
    updateFinalAnswer,
    scoreFinalJeopardy,
    toggleSound
  };
}
