'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clue, Player, AnswerCheckResult } from '../types/game';
import { Check, X, Eye, EyeOff, Clock, UserCheck, Sparkles, Send, Volume2 } from 'lucide-react';
import { soundFx } from '../lib/sound';

interface ClueModalProps {
  categoryName: string;
  clue: Clue;
  players: Player[];
  activePlayerIndex: number;
  isDailyDouble: boolean;
  dailyDoubleWager: number;
  onSubmitAnswer: (answer: string, playerId: string, customValue?: number) => AnswerCheckResult | undefined;
  onHostOverride: (playerId: string, isCorrect: boolean, customValue?: number) => void;
  onPassClue: () => void;
  onClose: () => void;
}

export const ClueModal: React.FC<ClueModalProps> = ({
  categoryName,
  clue,
  players,
  activePlayerIndex,
  isDailyDouble,
  dailyDoubleWager,
  onSubmitAnswer,
  onHostOverride,
  onPassClue,
  onClose
}) => {
  const effectiveValue = isDailyDouble ? dailyDoubleWager : clue.value;
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    players[activePlayerIndex]?.id || players[0]?.id || 'p1'
  );
  const [typedAnswer, setTypedAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [result, setResult] = useState<AnswerCheckResult | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(isDailyDouble ? 25 : 15);
  const [timerRunning, setTimerRunning] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Buzzer key handlers (1, 2, 3 or Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        if (players[idx]) {
          setSelectedPlayerId(players[idx].id);
          soundFx.playTimerTick();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [players]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedPlayerId]);

  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          soundFx.playTimesUp();
          return 0;
        }
        if (prev <= 5) {
          soundFx.playTimerTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedAnswer.trim()) return;

    setTimerRunning(false);
    const checkRes = onSubmitAnswer(typedAnswer, selectedPlayerId, effectiveValue);
    if (checkRes) {
      setResult(checkRes);
      setHasSubmitted(true);
      if (checkRes.isCorrect) {
        setShowAnswer(true);
      }
    }
  };

  const handleCorrectOverride = () => {
    onHostOverride(selectedPlayerId, true, effectiveValue);
    setShowAnswer(true);
    setHasSubmitted(true);
    setTimerRunning(false);
  };

  const handleIncorrectOverride = () => {
    onHostOverride(selectedPlayerId, false, effectiveValue);
    setHasSubmitted(true);
    setTimerRunning(false);
  };

  const totalTime = isDailyDouble ? 25 : 15;
  const timePercent = (timeLeft / totalTime) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/95 backdrop-blur-md animate-fadeIn">
      {/* Authentic TV Clue Frame */}
      <div className="relative w-full max-w-5xl bg-[#060ce9] border-4 sm:border-8 border-black rounded-3xl shadow-[0_0_80px_rgba(6,12,233,0.9)] p-4 sm:p-8 md:p-10 text-white flex flex-col justify-between min-h-[550px] md:min-h-[640px] overflow-hidden tv-screen-scanline">

        {/* Top TV Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-white/20 pb-3">
          <div className="flex items-center gap-3">
            <span className="font-jeopardy-title text-sm sm:text-lg md:text-xl text-yellow-300 tracking-widest uppercase">
              {categoryName}
            </span>
            {isDailyDouble && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-400 text-blue-950 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                Daily Double
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="font-jeopardy-dollar text-2xl sm:text-3xl text-amber-300 font-black">
              ${effectiveValue}
            </span>

            {/* Countdown Timer Display */}
            <div className="flex items-center gap-1.5 bg-black/70 border border-white/30 px-3 py-1.5 rounded-xl">
              <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-rose-400 animate-spin' : 'text-amber-300'}`} />
              <span className={`font-digital-led text-xl sm:text-2xl font-bold ${timeLeft <= 5 ? 'text-rose-400' : 'text-amber-300'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Countdown Timer Bar */}
        <div className="w-full h-2.5 bg-black/60 rounded-full mt-2 overflow-hidden border border-white/20">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              timeLeft <= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-yellow-300'
            }`}
            style={{ width: `${timePercent}%` }}
          />
        </div>

        {/* MAIN CLUE SCREEN (The Classic TV Shot) */}
        <div className="my-auto py-6 sm:py-10 text-center px-2 sm:px-6">
          <p className="font-jeopardy-clue text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase leading-relaxed text-white tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] max-w-4xl mx-auto">
            {clue.clue}
          </p>

          {/* Revealed Answer Card */}
          {showAnswer && (
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-black/80 border-2 border-amber-400 max-w-2xl mx-auto animate-fadeIn shadow-2xl">
              <span className="text-xs uppercase font-jeopardy-title text-amber-300 tracking-widest block mb-1">
                Official Answer
              </span>
              <p className="font-jeopardy-clue text-2xl sm:text-3xl md:text-4xl text-yellow-300 uppercase font-black">
                &ldquo;What is {clue.answer}?&rdquo;
              </p>
              {clue.acceptableAnswers && clue.acceptableAnswers.length > 0 && (
                <p className="text-xs text-blue-200 mt-2 font-mono">
                  Also accepted: {clue.acceptableAnswers.join(' • ')}
                </p>
              )}
            </div>
          )}

          {/* Fuzzy Matching Status */}
          {result && !showAnswer && (
            <div className={`mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl ${
              result.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}>
              {result.isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              <span>{result.feedback} ({Math.round(result.confidence * 100)}% match)</span>
            </div>
          )}
        </div>

        {/* INTERACTIVE BUZZER & HOST CONTROLS */}
        <div className="space-y-3 pt-3 border-t-2 border-white/20 bg-black/50 -mx-4 -mb-4 sm:-mx-8 sm:-mb-8 md:-mx-10 md:-mb-10 p-4 sm:p-6 rounded-b-2xl">
          
          {/* Buzzer Podium Selection */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase">
              <UserCheck className="w-4 h-4" />
              <span>Contestant at Podium:</span>
            </div>
            <div className="flex gap-2">
              {players.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlayerId(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPlayerId === p.id
                      ? 'bg-amber-400 text-blue-950 ring-2 ring-white shadow-lg scale-105'
                      : 'bg-blue-950/80 text-blue-200 hover:bg-blue-900 border border-blue-500/40'
                  }`}
                >
                  [{idx + 1}] {p.name} (${p.score})
                </button>
              ))}
            </div>
          </div>

          {/* Answer Type Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder='Type response here (e.g. "What is...")'
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              className="flex-1 bg-black/80 border-2 border-blue-400 focus:border-amber-400 rounded-xl px-4 py-2.5 text-base sm:text-lg text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
            />
            <button
              type="submit"
              disabled={!typedAnswer.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-blue-950 font-black rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 cursor-pointer uppercase text-sm tracking-wider"
            >
              <span>Submit</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Host Overrides & Finished Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCorrectOverride}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Award (+${effectiveValue})</span>
              </button>

              <button
                type="button"
                onClick={handleIncorrectOverride}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Deduct (-${effectiveValue})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAnswer(!showAnswer)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-amber-200 text-xs font-bold transition-colors cursor-pointer"
              >
                {showAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showAnswer ? 'Hide' : 'Reveal'} Answer</span>
              </button>

              <button
                type="button"
                onClick={onPassClue}
                className="px-5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-blue-950 font-black text-xs uppercase tracking-wider transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              >
                Return to Board
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
