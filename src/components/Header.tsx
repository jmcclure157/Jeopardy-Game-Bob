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
    <header className="w-full bg-gradient-to-r from-[#010418] via-[#040c36] to-[#010418] border-b-2 border-amber-400/60 shadow-2xl px-3 sm:px-6 py-2.5 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Logo & Round Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black font-jeopardy-title tracking-widest text-amber-300 drop-shadow-[0_2px_12px_rgba(252,192,20,0.8)] uppercase">
              JEOPARDY!
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-900/90 border border-blue-400/50 text-blue-100 shadow-inner">
            {getRoundLabel(round)}
          </div>
        </div>

        {/* Board Controls: Pack Selector + Shuffle + Custom Picker + Next Round */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          
          {/* Preset Tournament Packs */}
          <select
            value={packIndex}
            onChange={(e) => onSelectPack(Number(e.target.value))}
            className="bg-blue-950/90 text-amber-300 text-xs sm:text-sm font-bold border-2 border-amber-400/60 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-md"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-amber-300 border border-amber-400/50 text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Shuffle</span>
            </button>
          )}

          {/* Choose Custom Categories Button */}
          {round !== 'final-jeopardy' && round !== 'game-over' && (
            <button
              onClick={onOpenCategoryPicker}
              title="Choose Specific 6 Categories"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-amber-300 border border-amber-400/50 text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Choose Categories</span>
            </button>
          )}

          {/* Multiplayer Host Modal Button */}
          <button
            onClick={onOpenMultiplayer}
            title="Host Multiplayer Game (Join from Phones)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-700 to-blue-800 hover:from-indigo-600 hover:to-blue-700 text-amber-300 border border-amber-400/60 text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          >
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${connectedPlayerCount > 0 ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${connectedPlayerCount > 0 ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            </span>
            <span>{connectedPlayerCount > 0 ? `${connectedPlayerCount} Phone${connectedPlayerCount > 1 ? 's' : ''}` : 'Host Phone Buzzers'}</span>
          </button>

          {/* Next Round Button */}
          {round !== 'game-over' && (
            <button
              onClick={onNextRound}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all shadow-md cursor-pointer ${
                isRoundComplete
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-blue-950 animate-pulse hover:brightness-110 ring-2 ring-white'
                  : 'bg-blue-900/90 hover:bg-blue-800 text-blue-100 border border-blue-500/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {round === 'jeopardy'
                  ? 'Double Jeopardy'
                  : round === 'double-jeopardy'
                  ? 'Final Jeopardy'
                  : 'Finish'}
              </span>
            </button>
          )}

          {/* Audio Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
            className="p-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-500/40 transition-colors cursor-pointer shadow-sm"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>

          {/* Rules Modal */}
          <button
            onClick={onOpenRules}
            title="How to Play"
            className="p-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-500/40 transition-colors cursor-pointer shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-blue-300" />
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            title="Reset Game"
            className="p-2 rounded-xl bg-blue-950 hover:bg-rose-950 text-blue-200 hover:text-rose-200 border border-blue-500/40 transition-colors cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
