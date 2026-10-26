'use client';

import React, { useState } from 'react';
import { Player, RoundType } from '../types/game';
import { Sparkles, DollarSign, ArrowRight } from 'lucide-react';

interface DailyDoubleModalProps {
  players: Player[];
  activePlayerIndex: number;
  round: RoundType;
  onConfirmWager: (wager: number, playerId: string) => void;
  onCancel: () => void;
}

export const DailyDoubleModal: React.FC<DailyDoubleModalProps> = ({
  players,
  activePlayerIndex,
  round,
  onConfirmWager,
  onCancel
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState(players[activePlayerIndex]?.id || players[0]?.id);
  const selectedPlayer = players.find(p => p.id === selectedPlayerId) || players[0];

  const maxRoundValue = round === 'jeopardy' ? 1000 : 2000;
  const maxWager = Math.max(selectedPlayer?.score || 0, maxRoundValue);
  const minWager = 5;

  const [wager, setWager] = useState<number>(Math.min(maxRoundValue, Math.max(minWager, selectedPlayer?.score || maxRoundValue)));
  const [error, setError] = useState<string | null>(null);

  const handleWagerChange = (val: number) => {
    setWager(val);
    if (val < minWager) {
      setError(`Minimum wager is $${minWager}`);
    } else if (val > maxWager) {
      setError(`Maximum wager is $${maxWager}`);
    } else {
      setError(null);
    }
  };

  const handleAllIn = () => {
    handleWagerChange(maxWager);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wager < minWager || wager > maxWager) {
      setError(`Wager must be between $${minWager} and $${maxWager}`);
      return;
    }
    onConfirmWager(wager, selectedPlayerId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0a1e64] via-[#05113c] to-[#02071a] border-4 border-amber-400/90 rounded-2xl shadow-[0_0_50px_rgba(251,191,36,0.6)] p-6 md:p-8 text-center text-white overflow-hidden">
        
        {/* Animated Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Daily Double Retro 3D Title */}
        <div className="mb-6 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs uppercase tracking-widest font-bold mb-3">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            Special Clue
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-serif uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-500 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] animate-pulse">
            DAILY DOUBLE!
          </h2>
        </div>

        {/* Player Selection */}
        <div className="mb-6">
          <label className="block text-xs uppercase tracking-wider text-blue-200 mb-2 font-bold">
            Select Contender
          </label>
          <div className="flex justify-center gap-2 flex-wrap">
            {players.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPlayerId(p.id);
                  const pMax = Math.max(p.score, maxRoundValue);
                  setWager(Math.min(pMax, Math.max(minWager, p.score > 0 ? p.score : maxRoundValue)));
                  setError(null);
                }}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  selectedPlayerId === p.id
                    ? 'bg-amber-500 text-blue-950 ring-2 ring-amber-300 shadow-lg scale-105'
                    : 'bg-blue-950/80 border border-blue-500/40 text-blue-100 hover:bg-blue-800'
                }`}
              >
                {p.name} (${p.score})
              </button>
            ))}
          </div>
        </div>

        {/* Wager Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
          <div>
            <div className="flex justify-between items-center text-xs text-blue-200 font-semibold mb-1">
              <span>Wager Amount</span>
              <span>Max allowed: ${maxWager}</span>
            </div>
            
            <div className="relative flex items-center">
              <span className="absolute left-4 text-amber-400 font-bold text-2xl font-serif">$</span>
              <input
                type="number"
                min={minWager}
                max={maxWager}
                value={wager}
                onChange={(e) => handleWagerChange(Number(e.target.value))}
                className="w-full bg-blue-950/90 border-2 border-amber-400/80 rounded-xl py-3 pl-10 pr-4 text-2xl font-black text-amber-300 font-serif text-center focus:outline-none focus:ring-4 focus:ring-amber-400/50 shadow-inner"
              />
            </div>

            {error && <p className="text-rose-400 text-xs font-semibold mt-1.5">{error}</p>}
          </div>

          {/* Quick Buttons */}
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={handleAllIn}
              className="px-3 py-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 text-yellow-300 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              True Daily Double (${maxWager})
            </button>
            <button
              type="button"
              onClick={() => handleWagerChange(maxRoundValue)}
              className="px-3 py-1.5 rounded-lg bg-blue-800/40 hover:bg-blue-700/50 border border-blue-400/40 text-blue-200 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Round Max (${maxRoundValue})
            </button>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-3 justify-center">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 font-bold text-sm border border-blue-500/40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!error}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-blue-950 font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <span>Lock Wager & Reveal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
