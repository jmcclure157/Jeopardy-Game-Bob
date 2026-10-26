'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clue, Player, AnswerCheckResult } from '../types/game';
import { Check, X, Eye, EyeOff, Clock, UserCheck, Sparkles, Send } from 'lucide-react';
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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#060CE9] via-[#0409a8] to-[#020556] border-4 border-amber-400 rounded-2xl shadow-[0_0_60px_rgba(6,12,233,0.8)] p-5 sm:p-8 md:p-10 text-white flex flex-col justify-between min-h-[500px] md:min-h-[580px] overflow-hidden">

        {/* Top Header Row */}
        <div className="flex items-center justify-between border-b-2 border-blue-400/40 pb-4">
          <div>
            <span className="text-blue-300 font-bold uppercase tracking-widest text-xs sm:text-sm font-sans block">
              {categoryName}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              {isDailyDouble && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-amber-500 text-blue-950 animate-pulse">
                  <Sparkles className="w-3 h-3" />
                  Daily Double
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-serif drop-shadow-md">
                ${effectiveValue}
              </span>
            </div>
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-2 bg-blue-950/80 border border-blue-400/50 px-4 py-2 rounded-xl">
            <Clock className={`w-5 h-5 ${timeLeft <= 5 ? 'text-rose-400 animate-bounce' : 'text-amber-300'}`} />
            <span className={`text-xl sm:text-2xl font-mono font-bold ${timeLeft <= 5 ? 'text-rose-400' : 'text-amber-300'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="w-full h-2 bg-blue-950 rounded-full mt-3 overflow-hidden border border-blue-400/20">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              timeLeft <= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-yellow-300'
            }`}
            style={{ width: `${timePercent}%` }}
          />
        </div>

        {/* Clue Main Content Box */}
        <div className="my-auto py-6 sm:py-8 text-center px-2">
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-black tracking-wide leading-relaxed text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] max-w-3xl mx-auto">
            {clue.clue}
          </p>

          {/* Revealed Answer Box */}
          {showAnswer && (
            <div className="mt-6 p-4 rounded-xl bg-amber-400/10 border-2 border-amber-400/80 max-w-xl mx-auto animate-fadeIn">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block mb-1">
                Correct Response
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-300">
                &ldquo;What is {clue.answer}?&rdquo;
              </p>
              {clue.acceptableAnswers && clue.acceptableAnswers.length > 0 && (
                <p className="text-xs text-blue-200 mt-1">
                  Also accepting: {clue.acceptableAnswers.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Feedback message */}
          {result && !showAnswer && (
            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${
              result.isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400' : 'bg-rose-500/20 text-rose-300 border border-rose-400'
            }`}>
              {result.isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              <span>{result.feedback} ({Math.round(result.confidence * 100)}% match)</span>
            </div>
          )}
        </div>

        {/* Bottom Section: Active Player + Answer Form + Host Overrides */}
        <div className="space-y-4 pt-4 border-t-2 border-blue-400/40">
          
          {/* Active Buzzed-in Player Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-950/60 p-3 rounded-xl border border-blue-400/30">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase font-bold text-blue-200">Buzzed In:</span>
            </div>
            <div className="flex gap-2">
              {players.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlayerId(p.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedPlayerId === p.id
                      ? 'bg-amber-400 text-blue-950 ring-2 ring-amber-300 shadow'
                      : 'bg-blue-900/80 text-blue-200 hover:bg-blue-800'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Answer Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder='Type response (e.g. "What is...")'
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              className="flex-1 bg-blue-950/90 border-2 border-blue-400/60 focus:border-amber-400 rounded-xl px-4 py-2.5 text-base sm:text-lg font-medium text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-amber-400/40 shadow-inner"
            />
            <button
              type="submit"
              disabled={!typedAnswer.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-blue-950 font-bold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <span>Submit</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Host Override & Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              {/* Host Correct Button */}
              <button
                type="button"
                onClick={handleCorrectOverride}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold border border-emerald-400/50 shadow transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Award (+${effectiveValue})</span>
              </button>

              {/* Host Incorrect Button */}
              <button
                type="button"
                onClick={handleIncorrectOverride}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold border border-rose-400/50 shadow transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Deduct (-${effectiveValue})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Reveal Answer Button */}
              <button
                type="button"
                onClick={() => setShowAnswer(!showAnswer)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-200 text-xs sm:text-sm font-bold border border-blue-400/40 transition-colors"
              >
                {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-amber-300" />}
                <span>{showAnswer ? 'Hide' : 'Reveal'} Answer</span>
              </button>

              {/* Pass / Close Clue Button */}
              <button
                type="button"
                onClick={onPassClue}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-blue-950 font-black text-xs sm:text-sm shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                Done / Next
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
