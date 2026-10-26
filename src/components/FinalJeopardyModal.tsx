'use client';

import React, { useState, useEffect } from 'react';
import { Player, FinalJeopardyData } from '../types/game';
import { Sparkles, Clock, Check, X, ArrowRight, Eye, Trophy, Music } from 'lucide-react';
import { soundFx } from '../lib/sound';

interface FinalJeopardyModalProps {
  finalData: FinalJeopardyData;
  players: Player[];
  onUpdateWager: (playerId: string, wager: number) => void;
  onUpdateAnswer: (playerId: string, answer: string) => void;
  onScoreFinal: (evaluations: Record<string, boolean>) => void;
  onFinishGame: () => void;
}

export const FinalJeopardyModal: React.FC<FinalJeopardyModalProps> = ({
  finalData,
  players,
  onUpdateWager,
  onUpdateAnswer,
  onScoreFinal,
  onFinishGame
}) => {
  const [stage, setStage] = useState<'category' | 'wagers' | 'clue' | 'reveal' | 'finished'>('category');
  const [wagers, setWagers] = useState<Record<string, number>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<Record<string, boolean>>({});
  
  // Timer for 30s clue phase
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);

  // Eligible players (score > 0)
  const eligiblePlayers = players.filter(p => p.score > 0);

  // Start Think theme & timer when entering 'clue' stage
  useEffect(() => {
    if (stage === 'clue') {
      setTimeLeft(30);
      setTimerRunning(true);
      soundFx.playFinalJeopardyThinkTheme();
    }
  }, [stage]);

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
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const handleWagersSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    eligiblePlayers.forEach(p => {
      const w = wagers[p.id] !== undefined ? wagers[p.id] : Math.max(0, p.score);
      onUpdateWager(p.id, w);
    });
    setStage('clue');
  };

  const handleClueFinished = () => {
    setTimerRunning(false);
    eligiblePlayers.forEach(p => {
      const ans = answers[p.id] || '';
      onUpdateAnswer(p.id, ans);
    });
    setStage('reveal');
  };

  const handleFinalScoring = () => {
    onScoreFinal(evaluations);
    setStage('finished');
    onFinishGame();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#08185c] via-[#040c36] to-[#010414] border-4 border-amber-400 rounded-3xl shadow-[0_0_80px_rgba(251,191,36,0.5)] p-6 sm:p-10 text-white flex flex-col justify-between min-h-[550px] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-400/40 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs uppercase tracking-widest text-blue-300 font-bold block">
                The Final Showdown
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-serif text-amber-400 uppercase tracking-wider">
                FINAL JEOPARDY!
              </h2>
            </div>
          </div>

          {stage === 'clue' && (
            <div className="flex items-center gap-2 bg-blue-950/90 border border-amber-400 px-4 py-2 rounded-2xl shadow">
              <Clock className="w-5 h-5 text-amber-300 animate-spin" />
              <span className="text-2xl font-mono font-bold text-amber-300">
                {timeLeft}s
              </span>
            </div>
          )}
        </div>

        {/* STAGE 1: CATEGORY REVEAL */}
        {stage === 'category' && (
          <div className="my-auto text-center space-y-6 py-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-900/60 border border-blue-400/30 text-blue-200 text-xs uppercase tracking-widest font-bold">
              The Final Category Is...
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-serif uppercase tracking-widest text-amber-300 drop-shadow-[0_4px_16px_rgba(251,191,36,0.6)]">
              {finalData.category}
            </h1>
            <p className="text-blue-200 text-sm max-w-lg mx-auto">
              Contenders with a positive balance may now place their secret wagers up to their current bankroll.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setStage('wagers')}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-blue-950 font-black text-lg rounded-2xl shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <span>Enter Wagers</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: WAGERING PHASE */}
        {stage === 'wagers' && (
          <form onSubmit={handleWagersSubmit} className="my-auto space-y-6 py-6 max-w-2xl mx-auto w-full">
            <div className="text-center">
              <h3 className="text-xl font-bold text-amber-300 uppercase tracking-wider">
                Place Your Wagers
              </h3>
              <p className="text-xs text-blue-300 mt-1">
                Category: <strong className="text-white">{finalData.category}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {players.map((p) => {
                const isEligible = p.score > 0;
                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      isEligible
                        ? 'bg-blue-950/80 border-blue-400/50 shadow-lg'
                        : 'bg-blue-950/30 border-blue-900/40 opacity-40'
                    }`}
                  >
                    <span className="font-bold text-sm block text-amber-200">{p.name}</span>
                    <span className="text-xs text-blue-300 block mb-3">Bank: ${p.score}</span>

                    {isEligible ? (
                      <div>
                        <label className="text-[10px] uppercase font-bold text-blue-200 block mb-1">
                          Wager ($0 to ${p.score})
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={p.score}
                          defaultValue={Math.min(p.score, 1000)}
                          onChange={(e) =>
                            setWagers({ ...wagers, [p.id]: Math.min(p.score, Math.max(0, Number(e.target.value))) })
                          }
                          className="w-full bg-blue-900/80 border border-amber-400/60 rounded-xl px-3 py-2 text-lg font-bold text-amber-300 text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                    ) : (
                      <p className="text-xs text-rose-400 font-semibold italic">Ineligible (Score ≤ $0)</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-blue-950 font-black text-lg rounded-2xl shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <span>Lock In & Reveal Clue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {/* STAGE 3: CLUE REVEAL + 30-SEC THINK TIME */}
        {stage === 'clue' && (
          <div className="my-auto space-y-6 py-6 w-full max-w-3xl mx-auto">
            {/* Clue Text */}
            <div className="text-center px-4">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-2">
                Category: {finalData.category}
              </span>
              <p className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-wide leading-relaxed text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                {finalData.clue}
              </p>
            </div>

            {/* Answer Inputs for players */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              {eligiblePlayers.map((p) => (
                <div key={p.id} className="bg-blue-950/80 p-3 rounded-2xl border border-blue-400/40">
                  <span className="text-xs font-bold text-amber-300 block mb-1">{p.name}&apos;s Response</span>
                  <input
                    type="text"
                    placeholder="What is..."
                    value={answers[p.id] || ''}
                    onChange={(e) => setAnswers({ ...answers, [p.id]: e.target.value })}
                    className="w-full bg-blue-900/90 border border-blue-400/60 rounded-xl px-3 py-2 text-sm text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleClueFinished}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-blue-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all hover:scale-105"
              >
                <span>Reveal Responses & Score</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 4: REVEAL ANSWERS & SCORING */}
        {stage === 'reveal' && (
          <div className="my-auto space-y-6 py-4 w-full max-w-3xl mx-auto">
            {/* Official Answer Box */}
            <div className="p-4 rounded-2xl bg-amber-400/10 border-2 border-amber-400 text-center">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block mb-1">
                The Correct Response
              </span>
              <p className="text-3xl font-serif font-black text-amber-300">
                &ldquo;What is {finalData.answer}?&rdquo;
              </p>
            </div>

            {/* Player Responses & Grade Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {eligiblePlayers.map((p) => {
                const response = answers[p.id] || '(No answer)';
                const wager = wagers[p.id] ?? 0;
                const isMarkedCorrect = evaluations[p.id] ?? false;

                return (
                  <div key={p.id} className="bg-blue-950/90 p-4 rounded-2xl border-2 border-blue-400/40 text-center space-y-3">
                    <div>
                      <span className="font-bold text-amber-200 block">{p.name}</span>
                      <span className="text-xs text-blue-300">Wager: ${wager}</span>
                    </div>

                    <div className="bg-blue-900/60 p-2.5 rounded-xl border border-blue-400/20 min-h-[50px] flex items-center justify-center">
                      <span className="text-sm font-semibold italic text-white line-clamp-2">
                        &ldquo;{response}&rdquo;
                      </span>
                    </div>

                    {/* Grade Buttons */}
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => setEvaluations({ ...evaluations, [p.id]: true })}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                          isMarkedCorrect
                            ? 'bg-emerald-500 text-white shadow ring-2 ring-emerald-300'
                            : 'bg-blue-900/60 text-emerald-300 hover:bg-emerald-900/40 border border-emerald-500/30'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEvaluations({ ...evaluations, [p.id]: false })}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                          !isMarkedCorrect && evaluations[p.id] !== undefined
                            ? 'bg-rose-600 text-white shadow ring-2 ring-rose-300'
                            : 'bg-blue-900/60 text-rose-300 hover:bg-rose-900/40 border border-rose-500/30'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Wrong</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-3">
              <button
                onClick={handleFinalScoring}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-blue-950 font-black text-lg uppercase tracking-wider rounded-2xl shadow-2xl transition-all hover:scale-105 cursor-pointer"
              >
                <span>Calculate Final Winner</span>
                <Trophy className="w-5 h-5 text-blue-950" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
