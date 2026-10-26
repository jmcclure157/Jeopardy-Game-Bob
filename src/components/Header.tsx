'use client';

import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle, Trophy, Sparkles } from 'lucide-react';
import { RoundType, GamePack } from '../types/game';
import { GAME_PACKS } from '../data/gamePacks';

interface HeaderProps {
  round: RoundType;
  packIndex: number;
  soundEnabled: boolean;
  onSelectPack: (index: number) => void;
  onToggleSound: () => void;
  onRestart: () => void;
  onOpenRules: () => void;
  onNextRound: () => void;
  isRoundComplete: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  round,
  packIndex,
  soundEnabled,
  onSelectPack,
  onToggleSound,
  onRestart,
  onOpenRules,
  onNextRound,
  isRoundComplete
}) => {
  const getRoundLabel = (r: RoundType) => {
    switch (r) {
      case 'jeopardy':
        return 'Round 1: Jeopardy!';
      case 'double-jeopardy':
        return 'Round 2: Double Jeopardy!';
      case 'final-jeopardy':
        return 'Round 3: Final Jeopardy!';
      case 'game-over':
        return 'Game Over';
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 border-b border-blue-700/60 shadow-2xl px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Round Title */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <span className="text-3xl md:text-4xl font-black tracking-widest text-amber-400 font-serif drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)] uppercase">
              JEOPARDY!
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-800/80 border border-blue-400/40 text-blue-100 shadow-inner">
            {getRoundLabel(round)}
          </div>
        </div>

        {/* Game Pack Selector & Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Pack Selector */}
          <select
            value={packIndex}
            onChange={(e) => onSelectPack(Number(e.target.value))}
            className="bg-blue-900/90 text-amber-200 text-xs md:text-sm font-semibold border border-blue-500/50 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-md"
          >
            {GAME_PACKS.map((pack, idx) => (
              <option key={pack.id} value={idx}>
                {pack.title}
              </option>
            ))}
          </select>

          {/* Next Round Button */}
          {round !== 'game-over' && (
            <button
              onClick={onNextRound}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all shadow-md ${
                isRoundComplete
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-blue-950 animate-pulse hover:brightness-110 ring-2 ring-amber-300'
                  : 'bg-blue-800/80 hover:bg-blue-700 text-blue-100 border border-blue-500/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {round === 'jeopardy'
                  ? 'Go to Double Jeopardy'
                  : round === 'double-jeopardy'
                  ? 'Go to Final Jeopardy'
                  : 'Finish Game'}
              </span>
            </button>
          )}

          {/* Audio Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
            className="p-2 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-200 border border-blue-500/30 transition-colors shadow-sm"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>

          {/* Rules Modal */}
          <button
            onClick={onOpenRules}
            title="How to Play"
            className="p-2 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-200 border border-blue-500/30 transition-colors shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-blue-300" />
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            title="Restart Game"
            className="p-2 rounded-lg bg-blue-900/80 hover:bg-rose-900/60 text-blue-200 hover:text-rose-200 border border-blue-500/30 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
