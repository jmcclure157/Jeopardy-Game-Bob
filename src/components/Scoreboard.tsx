'use client';

import React, { useState } from 'react';
import { Player } from '../types/game';
import { Plus, Minus, Edit2, Check, Users, X } from 'lucide-react';

interface ScoreboardProps {
  players: Player[];
  activePlayerIndex: number;
  onSelectActivePlayer: (index: number) => void;
  onAdjustScore: (playerId: string, delta: number) => void;
  onUpdatePlayerName: (playerId: string, newName: string) => void;
  onSetPlayerCount: (count: number) => void;
  onRemovePlayer: (playerId: string) => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  players,
  activePlayerIndex,
  onSelectActivePlayer,
  onAdjustScore,
  onUpdatePlayerName,
  onSetPlayerCount,
  onRemovePlayer
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
    <div className="w-full max-w-4xl mx-auto px-3 py-1">
      {/* Contestant Podiums Row */}
      <div className="flex flex-row items-stretch justify-center gap-3">
        {players.map((player, idx) => {
          const isActive = activePlayerIndex === idx;
          const isNegative = player.score < 0;

          return (
            <div
              key={player.id}
              onClick={() => onSelectActivePlayer(idx)}
              className={`relative flex-1 min-w-[130px] max-w-[210px] rounded-xl p-2 transition-all duration-150 border cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-[#0b1682] via-[#050c53] to-[#01041b] border-amber-400 shadow-[0_0_20px_rgba(252,192,20,0.5)] ring-1 ring-amber-300'
                  : 'bg-gradient-to-b from-[#040828] to-[#010312] border-blue-900/80 hover:border-blue-600/60 shadow'
              }`}
            >
              {/* Podium Top Bar: Name & Control badge */}
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-amber-400 shadow-[0_0_6px_#fcc014] animate-pulse'
                        : 'bg-blue-950 border border-blue-800'
                    }`}
                  />
                  {editingId === player.id ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEditing(player)}
                        autoFocus
                        className="w-20 bg-blue-950 border border-amber-400 rounded px-1 text-[11px] font-bold text-white focus:outline-none"
                      />
                      <button
                        onClick={() => saveEditing(player)}
                        className="p-0.5 rounded bg-amber-400 text-blue-950 hover:bg-amber-300"
                      >
                        <Check className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="font-jeopardy-title font-bold text-xs sm:text-sm text-white tracking-wide truncate">
                        {player.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(player);
                        }}
                        className="text-blue-400 hover:text-amber-300 p-0.5 transition-colors shrink-0"
                        title="Edit name"
                      >
                        <Edit2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isActive && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-400 text-blue-950 font-black text-[8px] uppercase tracking-wider">
                      Active
                    </span>
                  )}
                  {players.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemovePlayer(player.id);
                      }}
                      className="p-0.5 rounded text-blue-500 hover:text-rose-400 hover:bg-rose-950/60 transition-colors cursor-pointer"
                      title="Remove player"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Digital LED Scoreboard Box */}
              <div className="bg-black rounded-lg border border-blue-950 py-1 px-1.5 text-center shadow-inner relative overflow-hidden">
                <span
                  className={`font-digital-led text-xl sm:text-2xl font-black tracking-wider ${
                    isNegative
                      ? 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]'
                      : 'text-amber-300 drop-shadow-[0_0_10px_rgba(252,192,20,0.8)]'
                  }`}
                >
                  {isNegative ? `-$${Math.abs(player.score)}` : `$${player.score}`}
                </span>
              </div>

              {/* Quick Score Adjusters */}
              <div
                className="flex items-center justify-center gap-1 mt-1 pt-1 border-t border-white/10 text-[10px] font-bold"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onAdjustScore(player.id, -200)}
                  className="px-1.5 py-0.5 rounded bg-blue-950 hover:bg-rose-950 text-blue-300 hover:text-rose-200 border border-blue-800 transition-colors cursor-pointer text-[10px]"
                  title="-$200"
                >
                  -200
                </button>
                <button
                  onClick={() => onAdjustScore(player.id, -100)}
                  className="p-1 rounded bg-blue-950 hover:bg-rose-950 text-blue-300 hover:text-rose-200 border border-blue-800 transition-colors cursor-pointer"
                  title="-$100"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <button
                  onClick={() => onAdjustScore(player.id, 100)}
                  className="p-1 rounded bg-blue-950 hover:bg-emerald-950 text-blue-300 hover:text-emerald-200 border border-blue-800 transition-colors cursor-pointer"
                  title="+$100"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
                <button
                  onClick={() => onAdjustScore(player.id, 200)}
                  className="px-1.5 py-0.5 rounded bg-blue-950 hover:bg-emerald-950 text-blue-300 hover:text-emerald-200 border border-blue-800 transition-colors cursor-pointer text-[10px]"
                  title="+$200"
                >
                  +200
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contestant Count Selector */}
      <div className="flex items-center justify-center gap-1.5 mt-1 text-[11px] text-blue-300">
        <Users className="w-3 h-3 text-blue-400" />
        <span className="font-semibold uppercase text-[9px] tracking-wider">Contestants:</span>
        <div className="flex gap-1">
          {[1, 2, 3].map((count) => (
            <button
              key={count}
              onClick={() => onSetPlayerCount(count)}
              className={`px-2 py-0.2 rounded text-[10px] font-bold transition-all cursor-pointer ${
                players.length === count
                  ? 'bg-amber-400 text-blue-950 shadow font-black'
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
