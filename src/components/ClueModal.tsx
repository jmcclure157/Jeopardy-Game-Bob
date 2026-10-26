'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clue, Player, AnswerCheckResult } from '../types/game';
import { Check, X, Eye, EyeOff, Clock, UserCheck, Sparkles, Send, ArrowLeft, Zap } from 'lucide-react';
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

  // Buzz-in state (Daily doubles bypass buzz-in)
  const [isBuzzedIn, setIsBuzzedIn] = useState<boolean>(isDailyDouble);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [result, setResult] = useState<AnswerCheckResult | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Timer: 12s reading time before buzz, 8s answering time after buzz
  const [timeLeft, setTimeLeft] = useState(isDailyDouble ? 25 : 12);
  const [timerRunning, setTimerRunning] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Trigger Buzz In
  const handleBuzzIn = (playerId?: string) => {
    if (isBuzzedIn || hasCompleted) return;
    
    soundFx.playBuzzerPress();
    setIsBuzzedIn(true);
    if (playerId) {
      setSelectedPlayerId(playerId);
    }
    setTimeLeft(8); // 8 seconds to answer once buzzed
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Keyboard navigation: Spacebar to Buzz in, Escape to return, Enter to submit/return
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onPassClue();
      } else if (hasCompleted && e.key === 'Enter') {
        onPassClue();
      } else if (!isBuzzedIn && !hasCompleted) {
        if (e.code === 'Space') {
          e.preventDefault();
          handleBuzzIn(players[activePlayerIndex]?.id || players[0]?.id);
        } else if (['1', '2', '3'].includes(e.key)) {
          const idx = parseInt(e.key) - 1;
          if (players[idx]) {
            handleBuzzIn(players[idx].id);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [players, isBuzzedIn, hasCompleted, activePlayerIndex, onPassClue]);

  useEffect(() => {
    if (isBuzzedIn && !hasCompleted) {
      inputRef.current?.focus();
    }
  }, [isBuzzedIn, hasCompleted]);

  useEffect(() => {
    if (!timerRunning || timeLeft <= 0 || hasCompleted) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          soundFx.playTimesUp();
          if (isBuzzedIn) {
            setShowAnswer(true);
            setHasCompleted(true);
          }
          return 0;
        }
        if (prev <= 4) {
          soundFx.playTimerTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, hasCompleted, isBuzzedIn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedAnswer.trim()) return;

    setTimerRunning(false);
    const checkRes = onSubmitAnswer(typedAnswer, selectedPlayerId, effectiveValue);
    if (checkRes) {
      setResult(checkRes);
      setShowAnswer(true);
      setHasCompleted(true);
    }
  };

  const handleCorrectOverride = () => {
    onHostOverride(selectedPlayerId, true, effectiveValue);
    setShowAnswer(true);
    setHasCompleted(true);
    setTimerRunning(false);
  };

  const handleIncorrectOverride = () => {
    onHostOverride(selectedPlayerId, false, effectiveValue);
    setShowAnswer(true);
    setHasCompleted(true);
    setTimerRunning(false);
  };

  const handleRevealClick = () => {
    setShowAnswer(true);
    setHasCompleted(true);
    setTimerRunning(false);
  };

  const totalTime = isBuzzedIn ? 8 : (isDailyDouble ? 25 : 12);
  const timePercent = Math.min(100, Math.max(0, (timeLeft / totalTime) * 100));

  const buzzedPlayer = players.find(p => p.id === selectedPlayerId) || players[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/95 backdrop-blur-md animate-fadeIn select-none">
      {/* Authentic TV Clue Frame */}
      <div className="relative w-full max-w-5xl bg-[#060ce9] border-4 sm:border-8 border-black rounded-3xl shadow-[0_0_90px_rgba(6,12,233,0.95)] p-4 sm:p-8 md:p-10 text-white flex flex-col justify-between min-h-[550px] md:min-h-[640px] overflow-hidden tv-screen-scanline">

        {/* Top Header Row with Category, Value, Timer & Close X button */}
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

          <div className="flex items-center gap-3 sm:gap-4">
            <span className="font-jeopardy-dollar text-2xl sm:text-3xl text-amber-300 font-black">
              ${effectiveValue}
            </span>

            {/* Countdown Timer Display */}
            {!hasCompleted && (
              <div className="flex items-center gap-1.5 bg-black/70 border border-white/30 px-3 py-1.5 rounded-xl">
                <Clock className={`w-4 h-4 ${timeLeft <= 3 ? 'text-rose-400 animate-spin' : 'text-amber-300'}`} />
                <span className={`font-digital-led text-xl sm:text-2xl font-bold ${timeLeft <= 3 ? 'text-rose-400' : 'text-amber-300'}`}>
                  {timeLeft}s
                </span>
              </div>
            )}

            {/* Close / Return Button */}
            <button
              onClick={onPassClue}
              className="p-2 rounded-xl bg-black/60 hover:bg-rose-900/80 text-white border border-white/30 transition-colors cursor-pointer"
              title="Close and return to board (Escape)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Countdown Timer Bar */}
        {!hasCompleted && (
          <div className="w-full h-2.5 bg-black/60 rounded-full mt-2 overflow-hidden border border-white/20">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                timeLeft <= 3 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-yellow-300'
              }`}
              style={{ width: `${timePercent}%` }}
            />
          </div>
        )}

        {/* MAIN CLUE SCREEN (The Classic TV Shot) */}
        <div className="my-auto py-6 sm:py-8 text-center px-2 sm:px-6">
          <p className="font-jeopardy-clue text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase leading-relaxed text-white tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] max-w-4xl mx-auto">
            {clue.clue}
          </p>

          {/* SPACEBAR BUZZER CTA (Shown when waiting for players to buzz in) */}
          {!isBuzzedIn && !hasCompleted && (
            <div className="mt-8 animate-bounce">
              <button
                type="button"
                onClick={() => handleBuzzIn(players[activePlayerIndex]?.id || players[0]?.id)}
                className="inline-flex items-center gap-3 px-8 sm:px-12 py-4 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:brightness-110 text-blue-950 font-black text-lg sm:text-xl uppercase tracking-widest rounded-2xl shadow-[0_0_40px_rgba(252,192,20,0.9)] transition-all hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-white/60 animate-pulseGlow"
              >
                <Zap className="w-6 h-6 fill-blue-950" />
                <span>HIT SPACEBAR TO BUZZ IN</span>
              </button>
              <p className="text-xs text-blue-200 mt-2 font-semibold">
                (Or click the button • Keys 1, 2, 3 for players)
              </p>
            </div>
          )}

          {/* REVEALED ANSWER CARD & RETURN BUTTON */}
          {showAnswer && (
            <div className="mt-6 p-4 sm:p-6 rounded-2xl bg-black/90 border-3 border-amber-400 max-w-2xl mx-auto animate-fadeIn shadow-[0_0_40px_rgba(252,192,20,0.5)]">
              {result && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 ${
                  result.isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400' : 'bg-rose-500/20 text-rose-300 border border-rose-400'
                }`}>
                  {result.isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>{result.feedback} ({Math.round(result.confidence * 100)}% match)</span>
                </div>
              )}

              <span className="text-xs uppercase font-jeopardy-title text-amber-300 tracking-widest block mb-1">
                Correct Answer
              </span>
              <p className="font-jeopardy-clue text-2xl sm:text-3xl md:text-4xl text-yellow-300 uppercase font-black">
                {clue.answer}
              </p>

              {clue.acceptableAnswers && clue.acceptableAnswers.length > 0 && (
                <p className="text-xs text-blue-200 mt-2 font-mono">
                  Also accepted: {clue.acceptableAnswers.join(' • ')}
                </p>
              )}

              {/* Back to Board Action Button */}
              <div className="mt-5 pt-3 border-t border-white/20">
                <button
                  type="button"
                  onClick={onPassClue}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:brightness-110 text-blue-950 font-black text-base uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(252,192,20,0.7)] transition-all hover:scale-105 active:scale-95 cursor-pointer animate-pulseGlow"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[3]" />
                  <span>Return to Game Board (Enter / Esc)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM BAR: ACTIVE BUZZED-IN INPUT & HOST CONTROLS */}
        {!hasCompleted ? (
          <div className="space-y-3 pt-3 border-t-2 border-white/20 bg-black/60 -mx-4 -mb-4 sm:-mx-8 sm:-mb-8 md:-mx-10 md:-mb-10 p-4 sm:p-6 rounded-b-2xl">
            
            {/* Buzzed Player Notification */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isBuzzedIn ? 'bg-amber-400 animate-ping' : 'bg-blue-600'}`} />
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wide">
                  {isBuzzedIn ? `⚡ ${buzzedPlayer.name} Buzzed In!` : 'Waiting for buzzer...'}
                </span>
              </div>
              <div className="flex gap-2">
                {players.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlayerId(p.id);
                      if (!isBuzzedIn) handleBuzzIn(p.id);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedPlayerId === p.id
                        ? 'bg-amber-400 text-blue-950 ring-2 ring-white shadow-lg font-black'
                        : 'bg-blue-950/80 text-blue-200 hover:bg-blue-900 border border-blue-500/40'
                    }`}
                  >
                    [{idx + 1}] {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Type Input (Active after Buzz) */}
            {isBuzzedIn && (
              <form onSubmit={handleSubmit} className="flex gap-2 animate-fadeIn">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder='Type your answer and press Enter...'
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  className="flex-1 bg-black/90 border-2 border-amber-400 focus:border-yellow-300 rounded-xl px-4 py-3 text-base sm:text-lg text-white placeholder-blue-300/40 focus:outline-none focus:ring-4 focus:ring-amber-400/40 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!typedAnswer.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-blue-950 font-black rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 cursor-pointer uppercase text-sm tracking-wider"
                >
                  <span>Submit</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Quick Host Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCorrectOverride}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Award (+${effectiveValue})</span>
                </button>

                <button
                  type="button"
                  onClick={handleIncorrectOverride}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Deduct (-${effectiveValue})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRevealClick}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-amber-200 font-bold transition-colors cursor-pointer border border-blue-700"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Reveal Answer / Pass</span>
                </button>

                <button
                  type="button"
                  onClick={onPassClue}
                  className="px-4 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white font-bold border border-white/20 transition-colors cursor-pointer"
                >
                  Back to Board
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Finished State Bottom Bar */
          <div className="flex items-center justify-center p-3 border-t-2 border-white/20 bg-black/60 -mx-4 -mb-4 sm:-mx-8 sm:-mb-8 md:-mx-10 md:-mb-10 rounded-b-2xl">
            <button
              type="button"
              onClick={onPassClue}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-400 to-yellow-300 hover:brightness-110 text-blue-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Back to Game Board (or press Enter / Escape)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
