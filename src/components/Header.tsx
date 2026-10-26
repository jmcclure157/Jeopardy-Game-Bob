'use client';

import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle, Trophy, Sparkles, Shuffle, SlidersHorizontal } from 'lucide-react';
import { RoundType, GamePack } from '../types/game';
import { GAME_PACKS } from '../data/gamePacks';

interface HeaderProps {
  round: RoundType;
  packIndex: number;
  soundEnabled: boolean;
  onSelectPack: (index: number) => void;
  onShuffleBoard: () => void;
  onOpenCategoryPicker: () => void;
  onToggleSound: () => void;
  onRestart: () => void;
  onOpenRules: () => void;
  onOpenMultiplayer: () => void;
  onNextRound: () => void;
  isRoundComplete: boolean;
  connectedPlayerCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  round,
  packIndex,
  soundEnabled,
  onSelectPack,
  onShuffleBoard,
  onOpenCategoryPicker,
  onToggleSound,
  onRestart,
  onOpenRules,
  onOpenMultiplayer,
  onNextRound,
  isRoundComplete,
  connectedPlayerCount = 0
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
    <header className="w-full bg-gradient-to-r from-[#010418] via-[#040c36] to-[#010418] border-b border-amber-400/60 shadow-lg px-2 sm:px-4 py-1.5 select-none shrink-0">
      <div className="max-w-6xl mx-auto flex flex-row items-center justify-between gap-2">
        
        {/* Logo & Round Title */}
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-black font-jeopardy-title tracking-widest text-amber-300 drop-shadow-[0_2px_8px_rgba(252,192,20,0.8)] uppercase">
            JEOPARDY!
          </span>

          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-900/90 border border-blue-400/50 text-blue-100">
            {getRoundLabel(round)}
          </span>
        </div>

        {/* Board Controls: Pack Selector + Shuffle + Custom Picker + Next Round */}
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          
          {/* Preset Tournament Packs */}
          <select
            value={packIndex}
            onChange={(e) => onSelectPack(Number(e.target.value))}
            className="bg-blue-950/90 text-amber-300 text-xs font-bold border border-amber-400/60 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
          >
            {GAME_PACKS.map((pack, idx) => (
              <option key={pack.id} value={idx}>
                {pack.title}
              </option>
            ))}
          </select>

          {/* Shuffle Categories Button */}
          {round !== 'final-jeopardy' && round !== 'game-over' && (
            <button
              onClick={onShuffleBoard}
              title="Randomize & Shuffle 6 Categories"
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-amber-300 border border-amber-400/50 text-xs font-bold transition-all cursor-pointer"
            >
              <Shuffle className="w-3 h-3" />
              <span className="hidden sm:inline">Shuffle</span>
            </button>
          )}

          {/* Choose Custom Categories Button */}
          {round !== 'final-jeopardy' && round !== 'game-over' && (
            <button
              onClick={onOpenCategoryPicker}
              title="Choose Specific 6 Categories"
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-amber-300 border border-amber-400/50 text-xs font-bold transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="hidden sm:inline">Categories</span>
            </button>
          )}

          {/* Multiplayer Host Modal Button */}
          <button
            onClick={onOpenMultiplayer}
            title="Host Multiplayer Game (Join from Phones)"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-700 to-blue-800 hover:from-indigo-600 hover:to-blue-700 text-amber-300 border border-amber-400/60 text-xs font-bold transition-all cursor-pointer shadow"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${connectedPlayerCount > 0 ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${connectedPlayerCount > 0 ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            </span>
            <span>{connectedPlayerCount > 0 ? `${connectedPlayerCount} Phone${connectedPlayerCount > 1 ? 's' : ''}` : 'Buzzers'}</span>
          </button>

          {/* Next Round Button */}
          {round !== 'game-over' && (
            <button
              onClick={onNextRound}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                isRoundComplete
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-blue-950 animate-pulse hover:brightness-110'
                  : 'bg-blue-900/90 hover:bg-blue-800 text-blue-100 border border-blue-500/40'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>
                {round === 'jeopardy'
                  ? 'Double Jeop'
                  : round === 'double-jeopardy'
                  ? 'Final Jeop'
                  : 'Finish'}
              </span>
            </button>
          )}

          {/* Audio Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
            className="p-1 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-500/40 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
          </button>

          {/* Rules Modal */}
          <button
            onClick={onOpenRules}
            title="How to Play"
            className="p-1 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-500/40 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-300" />
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            title="Reset Game"
            className="p-1 rounded-lg bg-blue-950 hover:bg-rose-950 text-blue-200 hover:text-rose-200 border border-blue-500/40 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
