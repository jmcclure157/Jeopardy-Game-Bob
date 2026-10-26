'use client';

import React, { useEffect } from 'react';
import { Player } from '../types/game';
import confetti from 'canvas-confetti';
import { Trophy, Medal, RotateCcw, Sparkles } from 'lucide-react';

interface WinnerPodiumProps {
  players: Player[];
  onRestart: () => void;
}

export const WinnerPodium: React.FC<WinnerPodiumProps> = ({ players, onRestart }) => {
  // Sort players by score descending
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  useEffect(() => {
    // Fire confetti cannon
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fbbf24', '#3b82f6', '#f59e0b', '#ffffff']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fbbf24', '#3b82f6', '#f59e0b', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 text-center animate-fadeIn">
      {/* Trophy Header */}
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-[0_0_50px_rgba(251,191,36,0.8)] animate-bounce flex items-center justify-center">
          <Trophy className="w-14 h-14 text-blue-950" />
        </div>
      </div>

      <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-widest mb-3">
        Tournament Champion
      </span>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-serif text-white uppercase tracking-wider drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] mb-2">
        {winner?.name || 'Player 1'}
      </h1>

      <p className="text-3xl sm:text-4xl font-mono font-black text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.7)] mb-8">
        ${winner?.score || 0}
      </p>

      {/* Standings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
        {sortedPlayers.map((player, idx) => (
          <div
            key={player.id}
            className={`p-5 rounded-2xl border-2 text-center transition-all ${
              idx === 0
                ? 'bg-gradient-to-b from-amber-500/20 to-blue-950/80 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-105'
                : 'bg-blue-950/60 border-blue-700/40'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Medal
                className={`w-5 h-5 ${
                  idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : 'text-amber-700'
                }`}
              />
              <span className="font-bold text-xs uppercase text-blue-300">
                {idx === 0 ? '1st Place' : idx === 1 ? '2nd Place' : '3rd Place'}
              </span>
            </div>

            <h4 className="font-bold text-lg text-white mb-1 truncate">{player.name}</h4>
            <span
              className={`text-2xl font-mono font-black ${
                player.score < 0 ? 'text-rose-400' : 'text-amber-300'
              }`}
            >
              ${player.score}
            </span>
          </div>
        ))}
      </div>

      {/* Play Again Button */}
      <button
        onClick={onRestart}
        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-blue-950 font-black text-lg uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.6)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <RotateCcw className="w-5 h-5" />
        <span>Play Another Game</span>
      </button>
    </div>
  );
};
