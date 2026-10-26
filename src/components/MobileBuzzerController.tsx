'use client';

import React, { useState, useEffect } from 'react';
import { PeerConnectionState } from '../types/multiplayer';
import { Player, RoundType } from '../types/game';
import { Zap, Send, Trophy, Wifi, AlertCircle, ArrowLeft } from 'lucide-react';
import { soundFx } from '../lib/sound';

interface MobileBuzzerControllerProps {
  connectionState: PeerConnectionState;
  remoteState: {
    round: RoundType;
    clueState: 'none' | 'reading' | 'buzzed' | 'revealed';
    activeClueValue?: number;
    categoryName?: string;
    clueText?: string;
    buzzedPlayerId?: string;
    buzzedPlayerName?: string;
    players: Player[];
    isDailyDouble?: boolean;
  };
  onSendBuzz: () => void;
  onSendAnswer: (answer: string) => void;
  onLeave: () => void;
}

export const MobileBuzzerController: React.FC<MobileBuzzerControllerProps> = ({
  connectionState,
  remoteState,
  onSendBuzz,
  onSendAnswer,
  onLeave
}) => {
  const [typedAnswer, setTypedAnswer] = useState('');
  const myPlayer = remoteState.players.find(p => p.id === connectionState.myPlayerId);
  const isMyTurn = remoteState.buzzedPlayerId === connectionState.myPlayerId;
  const isSomeoneElseTurn = remoteState.buzzedPlayerId && !isMyTurn;

  const handleBuzzClick = () => {
    if (remoteState.clueState === 'reading' && !remoteState.buzzedPlayerId) {
      onSendBuzz();
    }
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedAnswer.trim()) return;
    onSendAnswer(typedAnswer.trim());
    setTypedAnswer('');
  };

  return (
    <div className="min-h-screen bg-[#020524] text-white flex flex-col justify-between p-4 max-w-md mx-auto select-none font-sans">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-xs font-bold text-amber-300 uppercase">
            Room: {connectionState.roomCode}
          </span>
        </div>

        <button
          onClick={onLeave}
          className="text-xs text-blue-300 hover:text-white px-2.5 py-1 rounded-lg bg-blue-950 border border-blue-800"
        >
          Leave
        </button>
      </div>

      {/* Player Score & Name Podium */}
      <div className="bg-gradient-to-b from-[#0e2a94] to-[#040c35] border-2 border-amber-400/80 rounded-2xl p-4 text-center shadow-lg my-2">
        <span className="text-xs uppercase font-bold text-blue-200 tracking-wider block">
          {myPlayer?.name || 'Contestant'}
        </span>
        <span className="font-digital-led text-4xl font-black text-amber-300 drop-shadow-[0_0_12px_rgba(252,192,20,0.8)] block mt-1">
          ${myPlayer?.score ?? 0}
        </span>
      </div>

      {/* Main Game Status / Buzzer Area */}
      <div className="flex-1 flex flex-col items-center justify-center my-4 text-center">

        {/* State 1: No Active Clue */}
        {remoteState.clueState === 'none' && (
          <div className="space-y-3 py-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-900/40 border border-blue-600/40 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="font-jeopardy-title text-xl text-white font-bold">
              Watching TV Board
            </h3>
            <p className="text-xs text-blue-300 max-w-xs mx-auto">
              The host is selecting a category. Keep your thumb ready on the buzzer!
            </p>
          </div>
        )}

        {/* State 2: Clue Open & Waiting for Buzz */}
        {remoteState.clueState === 'reading' && !remoteState.buzzedPlayerId && (
          <div className="w-full space-y-4">
            <div>
              <span className="text-[11px] uppercase font-bold text-amber-400 tracking-widest block">
                {remoteState.categoryName}
              </span>
              <span className="text-2xl font-black text-white font-jeopardy-dollar">
                ${remoteState.activeClueValue}
              </span>
            </div>

            {/* GIANT BUZZER BUTTON */}
            <button
              onClick={handleBuzzClick}
              className="w-56 h-56 sm:w-64 sm:h-64 mx-auto rounded-full bg-gradient-to-b from-rose-500 via-red-600 to-rose-900 active:from-rose-600 active:to-red-950 border-8 border-amber-400 shadow-[0_0_60px_rgba(244,63,94,0.8)] flex flex-col items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer animate-pulseGlow"
            >
              <Zap className="w-14 h-14 text-white fill-white animate-bounce" />
              <span className="font-jeopardy-title text-2xl font-black text-white uppercase tracking-wider drop-shadow-md">
                BUZZ IN!
              </span>
            </button>
          </div>
        )}

        {/* State 3: THIS Player Buzzed In! */}
        {isMyTurn && (
          <div className="w-full space-y-4 animate-fadeIn">
            <div className="p-3 rounded-2xl bg-amber-400/20 border-2 border-amber-400">
              <span className="font-black text-lg text-amber-300 uppercase tracking-widest block">
                ⚡ YOU BUZZED IN!
              </span>
              <span className="text-xs text-blue-100">
                Type your answer below or speak it to the host:
              </span>
            </div>

            <form onSubmit={handleAnswerSubmit} className="space-y-3">
              <input
                type="text"
                autoFocus
                placeholder='Type answer (e.g. "Chile")...'
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                className="w-full bg-black/90 border-2 border-amber-400 rounded-xl px-4 py-3 text-lg text-white font-bold text-center focus:outline-none focus:ring-4 focus:ring-amber-400/50"
              />
              <button
                type="submit"
                disabled={!typedAnswer.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-blue-950 font-black rounded-xl text-base uppercase tracking-wider shadow-lg transition-transform active:scale-95 disabled:opacity-40"
              >
                Submit Response
              </button>
            </form>
          </div>
        )}

        {/* State 4: Someone Else Buzzed In */}
        {isSomeoneElseTurn && (
          <div className="space-y-3 py-6 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-950 border-2 border-blue-700 flex items-center justify-center">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="font-bold text-lg text-amber-300">
              {remoteState.buzzedPlayerName || 'Opponent'} Buzzed In!
            </h3>
            <p className="text-xs text-blue-300">
              Waiting for their response on the host screen...
            </p>
          </div>
        )}

        {/* State 5: Revealed Answer */}
        {remoteState.clueState === 'revealed' && (
          <div className="space-y-2 py-6 animate-fadeIn">
            <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
              Round Complete
            </span>
            <p className="text-sm text-blue-200">
              Board updating... get ready for the next clue!
            </p>
          </div>
        )}

      </div>

      {/* Footer Info */}
      <footer className="text-center text-[10px] text-blue-400/50 pt-2 border-t border-blue-950">
        Jeopardy! Mobile Controller • Connected via WebRTC
      </footer>

    </div>
  );
};
