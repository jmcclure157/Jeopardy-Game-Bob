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
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-2">
      {/* Contestant Podiums Row */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6">
        {players.map((player, idx) => {
          const isActive = activePlayerIndex === idx;
          const isNegative = player.score < 0;

          return (
            <div
              key={player.id}
              onClick={() => onSelectActivePlayer(idx)}
              className={`relative flex-1 w-full max-w-xs rounded-2xl p-3 sm:p-4 transition-all duration-200 border-2 sm:border-3 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-[#0b1682] via-[#050c53] to-[#01041b] border-amber-400 shadow-[0_0_35px_rgba(252,192,20,0.6)] scale-102 ring-2 ring-amber-300'
                  : 'bg-gradient-to-b from-[#040828] to-[#010312] border-blue-900/80 hover:border-blue-600/60 shadow-lg'
              }`}
            >
              {/* Podium Indicator Light */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isActive
                        ? 'bg-amber-400 shadow-[0_0_10px_#fcc014] animate-pulse'
                        : 'bg-blue-950 border border-blue-800'
                    }`}
                  />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-blue-300">
                    Podium {idx + 1}
                  </span>
                </div>

                {isActive && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-blue-950 font-black text-[9px] uppercase tracking-wider">
                    In Control
                  </span>
                )}
              </div>

              {/* Name Plate */}
              <div className="mb-2">
                {editingId === player.id ? (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEditing(player)}
                      autoFocus
                      className="w-full bg-blue-950 border-2 border-amber-400 rounded-lg px-2 py-1 text-sm font-bold text-white focus:outline-none"
                    />
                    <button
                      onClick={() => saveEditing(player)}
                      className="p-1 rounded bg-amber-400 text-blue-950 hover:bg-amber-300"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg">
                    <span className="font-jeopardy-title font-bold text-sm sm:text-base text-white tracking-wider truncate">
                      {player.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(player);
                      }}
                      className="text-blue-400 hover:text-amber-300 p-0.5 rounded transition-colors"
                      title="Edit name"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Digital LED Scoreboard Box */}
              <div className="bg-black rounded-xl border-2 border-blue-950 p-2.5 sm:p-3 text-center shadow-inner relative overflow-hidden">
                <span
                  className={`font-digital-led text-3xl sm:text-4xl md:text-5xl font-black tracking-widest ${
                    isNegative
                      ? 'text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                      : 'text-amber-300 drop-shadow-[0_0_15px_rgba(252,192,20,0.9)]'
                  }`}
                >
                  {isNegative ? `-$${Math.abs(player.score)}` : `$${player.score}`}
                </span>
              </div>

              {/* Quick Score Adjusters */}
              <div
                className="flex items-center justify-center gap-1 mt-2.5 pt-2 border-t border-white/10 text-xs font-bold"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onAdjustScore(player.id, -200)}
                  className="px-2 py-0.5 rounded bg-blue-950 hover:bg-rose-950 text-blue-300 hover:text-rose-200 border border-blue-800 transition-colors cursor-pointer"
                  title="-$200"
                >
                  -$200
                </button>
                <button
                  onClick={() => onAdjustScore(player.id, -100)}
                  className="p-1 rounded bg-blue-950 hover:bg-rose-950 text-blue-300 hover:text-rose-200 border border-blue-800 transition-colors cursor-pointer"
                  title="-$100"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onAdjustScore(player.id, 100)}
                  className="p-1 rounded bg-blue-950 hover:bg-emerald-950 text-blue-300 hover:text-emerald-200 border border-blue-800 transition-colors cursor-pointer"
                  title="+$100"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onAdjustScore(player.id, 200)}
                  className="px-2 py-0.5 rounded bg-blue-950 hover:bg-emerald-950 text-blue-300 hover:text-emerald-200 border border-blue-800 transition-colors cursor-pointer"
                  title="+$200"
                >
                  +$200
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contestant Count Selector */}
      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-blue-300">
        <Users className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-semibold uppercase text-[10px] tracking-wider">Contestants:</span>
        <div className="flex gap-1">
          {[1, 2, 3].map((count) => (
            <button
              key={count}
              onClick={() => onSetPlayerCount(count)}
              className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                players.length === count
                  ? 'bg-amber-400 text-blue-950 shadow-md font-black'
                  : 'bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800/60'
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
