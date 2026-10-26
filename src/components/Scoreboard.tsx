'use client';

import React, { useState } from 'react';
import { Player } from '../types/game';
import { Plus, Minus, Edit2, Check, Users } from 'lucide-react';

interface ScoreboardProps {
  players: Player[];
  activePlayerIndex: number;
  onSelectActivePlayer: (index: number) => void;
  onAdjustScore: (playerId: string, delta: number) => void;
  onUpdatePlayerName: (playerId: string, newName: string) => void;
  onSetPlayerCount: (count: number) => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  players,
  activePlayerIndex,
  onSelectActivePlayer,
  onAdjustScore,
  onUpdatePlayerName,
  onSetPlayerCount
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');

  const startEditing = (p: Player) => {
    setEditingId(p.id);
    setTempName(p.name);
  };

  const saveEditing = (p: Player) => {
    if (tempName.trim()) {
      onUpdatePlayerName(p.id, tempName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4">
      {/* Contestant Podiums Grid */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
        {players.map((player, idx) => {
          const isActive = activePlayerIndex === idx;
          const isNegative = player.score < 0;

          return (
            <div
              key={player.id}
              onClick={() => onSelectActivePlayer(idx)}
              className={`relative flex-1 w-full max-w-sm rounded-2xl p-4 sm:p-5 transition-all duration-300 border-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-[#0e2a94] via-[#091b68] to-[#040c35] border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.5)] scale-102 ring-2 ring-amber-400/50'
                  : 'bg-gradient-to-b from-blue-950/80 to-[#030922]/90 border-blue-600/40 hover:border-blue-400/80 shadow-lg'
              }`}
            >
              {/* Active Indicator Badge */}
              {isActive && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-blue-950 font-black text-[10px] uppercase tracking-wider shadow">
                  In Control
                </div>
              )}

              {/* Name Display / Edit */}
              <div className="flex items-center justify-between gap-2 mb-2">
                {editingId === player.id ? (
                  <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEditing(player)}
                      autoFocus
                      className="w-full bg-blue-900 border border-amber-400 rounded-lg px-2 py-1 text-sm font-bold text-white focus:outline-none"
                    />
                    <button
                      onClick={() => saveEditing(player)}
                      className="p-1 rounded bg-amber-400 text-blue-950 hover:bg-amber-300"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-sm sm:text-base text-blue-100 font-sans tracking-wide truncate">
                      {player.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(player);
                      }}
                      className="text-blue-400 hover:text-amber-300 p-1 rounded transition-colors"
                      title="Edit player name"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Digital LED Score Box */}
              <div className="bg-black/80 rounded-xl border border-blue-900/60 p-3 sm:p-4 text-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-radial from-amber-500/5 to-transparent pointer-events-none" />
                <span
                  className={`text-3xl sm:text-4xl md:text-5xl font-mono font-black tracking-wider ${
                    isNegative ? 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]'
                  }`}
                >
                  {isNegative ? `-$${Math.abs(player.score)}` : `$${player.score}`}
                </span>
              </div>

              {/* Quick +/- Score Adjustments */}
              <div
                className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-blue-800/40"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onAdjustScore(player.id, -200)}
                  className="px-2 py-1 rounded bg-blue-900/60 hover:bg-rose-900/50 text-blue-300 hover:text-rose-200 text-xs font-bold border border-blue-700/40 transition-colors"
                  title="Deduct $200"
                >
                  -$200
                </button>
                <button
                  onClick={() => onAdjustScore(player.id, -100)}
                  className="p-1.5 rounded bg-blue-900/60 hover:bg-rose-900/50 text-blue-300 hover:text-rose-200 text-xs font-bold border border-blue-700/40 transition-colors"
                  title="Deduct $100"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onAdjustScore(player.id, 100)}
                  className="p-1.5 rounded bg-blue-900/60 hover:bg-emerald-900/50 text-blue-300 hover:text-emerald-200 text-xs font-bold border border-blue-700/40 transition-colors"
                  title="Add $100"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onAdjustScore(player.id, 200)}
                  className="px-2 py-1 rounded bg-blue-900/60 hover:bg-emerald-900/50 text-blue-300 hover:text-emerald-200 text-xs font-bold border border-blue-700/40 transition-colors"
                  title="Add $200"
                >
                  +$200
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Player Count Bar */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-blue-300">
        <Users className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-semibold">Contestants:</span>
        <div className="flex gap-1">
          {[1, 2, 3].map((count) => (
            <button
              key={count}
              onClick={() => onSetPlayerCount(count)}
              className={`px-2.5 py-0.5 rounded font-bold transition-colors ${
                players.length === count
                  ? 'bg-amber-400 text-blue-950 shadow'
                  : 'bg-blue-900/60 hover:bg-blue-800 text-blue-300'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
