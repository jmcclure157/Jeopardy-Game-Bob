'use client';

import React, { useState } from 'react';
import { PeerConnectionState } from '../types/multiplayer';
import { Player } from '../types/game';
import { X, Copy, Check, Users, Wifi, QrCode, Sparkles, ExternalLink } from 'lucide-react';
import { soundFx } from '../lib/sound';

interface HostMultiplayerModalProps {
  isOpen: boolean;
  connectionState: PeerConnectionState;
  players: Player[];
  onStartHosting: (code: string) => void;
  onClose: () => void;
}

export const HostMultiplayerModal: React.FC<HostMultiplayerModalProps> = ({
  isOpen,
  connectionState,
  players,
  onStartHosting,
  onClose
}) => {
  const [customCode, setCustomCode] = useState('JEOP');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const joinUrl = connectionState.roomCode
    ? `${currentOrigin}?room=${connectionState.roomCode}&role=player`
    : '';

  const handleCopyLink = () => {
    if (!joinUrl) return;
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    soundFx.playTimerTick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCode.trim()) return;
    onStartHosting(customCode.trim().toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0a1e64] via-[#05113c] to-[#02071a] border-4 border-amber-400 rounded-3xl shadow-[0_0_80px_rgba(252,192,20,0.6)] p-6 sm:p-8 text-white">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-white/20 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400/20 border border-amber-400 text-amber-300">
              <Wifi className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-300 tracking-widest block">
                Multiplayer Lobby
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-jeopardy-title text-amber-300 uppercase tracking-wider">
                Host Game with Friends
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/60 hover:bg-rose-900/80 text-white border border-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Hosting Yet Form */}
        {connectionState.status !== 'connected' ? (
          <form onSubmit={handleHost} className="space-y-5 py-4">
            <div className="text-center">
              <p className="text-sm text-blue-200 mb-4">
                Choose a 4-letter Room Code for your friends to join from their phones:
              </p>

              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  placeholder="JEOP"
                  className="w-full bg-black/80 border-3 border-amber-400 rounded-2xl py-3 px-4 text-3xl font-black font-mono text-amber-300 text-center tracking-widest uppercase focus:outline-none focus:ring-4 focus:ring-amber-400/50 shadow-inner"
                />
              </div>

              {connectionState.errorMessage && (
                <p className="text-rose-400 text-xs font-bold mt-2">
                  {connectionState.errorMessage}
                </p>
              )}
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={!customCode.trim()}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:brightness-110 text-blue-950 font-black text-base uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(252,192,20,0.7)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 stroke-[2.5]" />
                <span>Create Multiplayer Room</span>
              </button>
            </div>
          </form>
        ) : (
          /* Active Room Screen */
          <div className="space-y-5 py-2">
            {/* Big Room Code Box */}
            <div className="bg-black/80 border-2 border-amber-400 p-4 rounded-2xl text-center shadow-inner">
              <span className="text-xs uppercase font-bold text-blue-300 tracking-widest block mb-1">
                Room Code
              </span>
              <span className="text-4xl sm:text-5xl font-black font-mono text-amber-300 tracking-widest">
                {connectionState.roomCode}
              </span>
            </div>

            {/* Shareable Link Box */}
            <div className="bg-blue-950/80 border border-blue-400/40 p-3.5 rounded-2xl space-y-2">
              <span className="text-xs text-blue-200 font-bold uppercase block">
                Share this link with friends:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={joinUrl}
                  className="flex-1 bg-black/60 border border-blue-600/50 rounded-xl px-3 py-2 text-xs text-blue-100 font-mono select-all truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer shadow"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Connected Contestants List */}
            <div className="bg-black/60 border border-white/10 p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-1.5 text-blue-200 font-bold uppercase">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Contestants Joined ({connectionState.connectedCount}):</span>
                </div>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Room Online
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {players.map((p, idx) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between bg-blue-950/80 border border-blue-500/40 px-3 py-2 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-blue-950 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-white">{p.name}</span>
                    </div>
                    <span className="font-mono font-black text-amber-300 text-sm">
                      ${p.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-blue-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                Close & Return to TV Board
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
