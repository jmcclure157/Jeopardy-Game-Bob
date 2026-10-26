'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PeerConnectionState } from '../types/multiplayer';
import { Player, RoundType, Category, Clue } from '../types/game';
import { Wifi, ArrowLeft, Clock, Check, X, Zap, Eye, Send, Sparkles } from 'lucide-react';
import { soundFx } from '../lib/sound';

interface MobileBuzzerControllerProps {
  connectionState: PeerConnectionState;
  remoteState: {
    round: RoundType;
    clueState: 'none' | 'wager' | 'reading' | 'buzzed' | 'revealed';
    categories: Category[];
    activeClue?: Clue;
    activeCategoryName?: string;
    activeCategoryIdx?: number;
    activeClueIdx?: number;
    activeClueValue?: number;
    categoryName?: string;
    clueText?: string;
    clueAnswer?: string;
    buzzedPlayerId?: string;
    buzzedPlayerName?: string;
    players: Player[];
    isDailyDouble?: boolean;
    dailyDoubleWager?: number;
    clueOpenedAt?: number;
    activePickerPlayerId?: string;
  };
  answerResult: { isCorrect: boolean; pointValue: number; feedback: string; confidence: number } | null;
  onSendBuzz: () => void;
  onSendAnswer: (answer: string) => void;
  onSelectClue: (categoryIdx: number, clueIdx: number) => void;
  onSendWager: (wager: number) => void;
  onLeave: () => void;
}

export const MobileBuzzerController: React.FC<MobileBuzzerControllerProps> = ({
  connectionState,
  remoteState,
  answerResult,
  onSendBuzz,
  onSendAnswer,
  onSelectClue,
  onSendWager,
  onLeave
}) => {
  const [typedAnswer, setTypedAnswer] = useState('');
  const [hasBuzzed, setHasBuzzed] = useState(false);
  const [wagerInput, setWagerInput] = useState<number>(0);
  const [wagerError, setWagerError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const myPlayer = remoteState.players.find(p => p.id === connectionState.myPlayerId);
  const isMyBuzz = remoteState.buzzedPlayerId === connectionState.myPlayerId;
  const clueOpen = remoteState.clueState !== 'none';
  const effectiveValue = remoteState.isDailyDouble
    ? (remoteState.dailyDoubleWager ?? remoteState.activeClueValue ?? 0)
    : (remoteState.activeClueValue ?? 0);

  // Derive reading-phase countdown from the host's clue-open timestamp
  const READING_TOTAL = 12;
  const [timeLeft, setTimeLeft] = useState<number>(READING_TOTAL);
  useEffect(() => {
    if (remoteState.clueState !== 'reading') return;
    const openedAt = remoteState.clueOpenedAt;
    const tick = () => {
      if (!openedAt) {
        setTimeLeft(READING_TOTAL);
        return;
      }
      const elapsed = (Date.now() - openedAt) / 1000;
      setTimeLeft(Math.max(0, Math.round(READING_TOTAL - elapsed)));
    };
    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [remoteState.clueState, remoteState.clueOpenedAt]);

  // Reset state when clue closes; init wager when DD opens
  useEffect(() => {
    if (remoteState.clueState === 'none') {
      setHasBuzzed(false);
      setTypedAnswer('');
      setWagerError(null);
    }
    if (remoteState.clueState === 'wager') {
      const maxRound = remoteState.round === 'jeopardy' ? 1000 : 2000;
      const score = myPlayer?.score ?? 0;
      setWagerInput(Math.min(Math.max(score, maxRound), Math.max(score, maxRound)));
      setWagerError(null);
    }
  }, [remoteState.clueState]);

  // Focus input when I buzz in
  useEffect(() => {
    if (isMyBuzz) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isMyBuzz]);

  const handleBuzz = () => {
    if (remoteState.clueState === 'reading' && !remoteState.buzzedPlayerId && !hasBuzzed) {
      setHasBuzzed(true);
      onSendBuzz();
      soundFx.playBuzzerPress();
    }
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedAnswer.trim()) return;
    onSendAnswer(typedAnswer.trim());
    setTypedAnswer('');
  };

  const isNotMyTurn = !!(remoteState.activePickerPlayerId && remoteState.activePickerPlayerId !== connectionState.myPlayerId);

  const handleTileClick = (categoryIdx: number, clueIdx: number, clue: Clue) => {
    if (clue.isAnswered || clueOpen) return;
    if (isNotMyTurn) return;
    onSelectClue(categoryIdx, clueIdx);
  };

  // ─── CLUE OVERLAY ───────────────────────────────────────────────
  const ClueOverlay = () => {
    if (!clueOpen) return null;
    const isWagerPhase = remoteState.clueState === 'wager';
    const answered = remoteState.clueState === 'revealed';

    // Wager screen
    if (isWagerPhase) {
      const maxRound = remoteState.round === 'jeopardy' ? 1000 : 2000;
      const score = myPlayer?.score ?? 0;
      const maxWager = Math.max(score, maxRound);
      const minWager = 5;

      const handleWagerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (wagerInput < minWager || wagerInput > maxWager) {
          setWagerError(`Wager must be between $${minWager} and $${maxWager}`);
          return;
        }
        onSendWager(wagerInput);
      };

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-gradient-to-b from-[#0a1e64] to-[#02071a] border-4 border-amber-400 rounded-2xl shadow-[0_0_50px_rgba(251,191,36,0.6)] p-6 text-center text-white space-y-5">
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Daily Double!
              </span>
              <p className="text-2xl font-black font-jeopardy-title text-amber-300 uppercase tracking-wider">
                Place Your Wager
              </p>
              <p className="text-xs text-blue-200 mt-1">
                Score: ${score} &nbsp;·&nbsp; Max: ${maxWager}
              </p>
            </div>

            <form onSubmit={handleWagerSubmit} className="space-y-3">
              <div className="relative flex items-center">
                <span className="absolute left-4 text-amber-400 font-bold text-2xl">$</span>
                <input
                  type="number"
                  min={minWager}
                  max={maxWager}
                  value={wagerInput}
                  onChange={(e) => {
                    setWagerInput(Number(e.target.value));
                    setWagerError(null);
                  }}
                  className="w-full bg-blue-950/90 border-2 border-amber-400 rounded-xl py-3 pl-10 pr-4 text-2xl font-black text-amber-300 text-center focus:outline-none focus:ring-4 focus:ring-amber-400/50"
                />
              </div>
              {wagerError && <p className="text-rose-400 text-xs font-semibold">{wagerError}</p>}

              <div className="flex gap-2 justify-center">
                <button type="button" onClick={() => setWagerInput(maxWager)}
                  className="px-3 py-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 text-yellow-300 text-xs font-bold uppercase">
                  All In (${maxWager})
                </button>
                <button type="button" onClick={() => setWagerInput(maxRound)}
                  className="px-3 py-1.5 rounded-lg bg-blue-800/40 hover:bg-blue-700/50 border border-blue-400/40 text-blue-200 text-xs font-bold uppercase">
                  Max Round (${maxRound})
                </button>
              </div>

              <button type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-blue-950 font-black rounded-xl text-sm uppercase tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer">
                Lock In Wager
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/95 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-lg bg-[#060ce9] border-4 border-black rounded-2xl shadow-[0_0_60px_rgba(6,12,233,0.9)] p-4 text-white flex flex-col gap-3 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-jeopardy-title text-sm text-yellow-300 tracking-widest uppercase">
                {remoteState.activeCategoryName || remoteState.categoryName}
              </span>
              {remoteState.isDailyDouble && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black uppercase bg-amber-400 text-blue-950 animate-pulse">
                  <Sparkles className="w-3 h-3" />
                  Daily Double
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {remoteState.clueState === 'reading' && (
                <span className={`inline-flex items-center gap-1 text-sm font-black ${timeLeft <= 3 ? 'text-red-500' : 'text-amber-300'}`}>
                  <Clock className="w-4 h-4" />
                  {timeLeft}s
                </span>
              )}
              <span className="font-jeopardy-dollar text-xl text-amber-300 font-black">
                ${effectiveValue}
              </span>
            </div>
          </div>

          {/* Clue Text */}
          <div className="py-4 text-center px-2">
            <p className="font-jeopardy-clue text-lg sm:text-xl uppercase leading-relaxed text-white tracking-wide">
              {remoteState.clueText}
            </p>
          </div>

          {/* Buzz status */}
          {!answered && (
            <div className="text-center">
              {remoteState.buzzedPlayerId ? (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
                  isMyBuzz
                    ? 'bg-amber-400/20 border-2 border-amber-400 text-amber-300'
                    : 'bg-blue-900/60 border border-blue-600 text-blue-200'
                }`}>
                  <Zap className="w-4 h-4" />
                  {isMyBuzz ? 'You buzzed in!' : `${remoteState.buzzedPlayerName} buzzed in!`}
                </div>
              ) : (
                <button
                  onClick={handleBuzz}
                  disabled={hasBuzzed}
                  className="w-full py-4 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:brightness-110 border-4 border-amber-400 rounded-2xl font-jeopardy-title text-xl font-black text-white uppercase tracking-wider shadow-[0_0_30px_rgba(244,63,94,0.7)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer animate-pulseGlow flex items-center justify-center gap-3"
                >
                  <Zap className="w-6 h-6 fill-white" />
                  BUZZ IN!
                </button>
              )}
            </div>
          )}

          {/* Answer input (only when I'm buzzed in) */}
          {isMyBuzz && !answered && (
            <form onSubmit={handleAnswerSubmit} className="flex gap-2 animate-fadeIn">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your answer..."
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                className="flex-1 bg-black/90 border-2 border-amber-400 rounded-xl px-3 py-2.5 text-base text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              />
              <button
                type="submit"
                disabled={!typedAnswer.trim()}
                className="flex items-center gap-1 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black rounded-xl text-sm uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Answer verdict (only for the player who answered) */}
          {isMyBuzz && answerResult && (
            <div
              className={`text-center rounded-xl p-3 border-2 animate-fadeIn ${
                answerResult.isCorrect
                  ? 'bg-emerald-900/70 border-emerald-400 text-emerald-200'
                  : 'bg-rose-900/70 border-rose-400 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2 font-black text-lg uppercase tracking-wider">
                {answerResult.isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                <span>
                  {answerResult.isCorrect ? '+' : '-'}${answerResult.pointValue}
                </span>
              </div>
              {answerResult.feedback && (
                <p className="text-xs mt-1 opacity-90">{answerResult.feedback}</p>
              )}
            </div>
          )}

          {/* Revealed answer */}
          {answered && remoteState.clueAnswer && (
            <div className="text-center bg-black/80 border border-amber-400 rounded-xl p-3">
              <span className="text-xs uppercase font-bold text-amber-300 tracking-widest block mb-1">
                Correct Answer
              </span>
              <p className="font-jeopardy-clue text-xl text-yellow-300 uppercase font-black">
                {remoteState.clueAnswer}
              </p>
            </div>
          )}

          {/* Waiting message when revealed */}
          {answered && (
            <p className="text-center text-xs text-blue-300">
              Waiting for host to return to board...
            </p>
          )}
        </div>
      </div>
    );
  };

  // ─── MAIN BOARD VIEW ────────────────────────────────────────────
  const categories = remoteState.categories;
  const values = categories.length > 0
    ? categories[0].clues.map(c => c.value)
    : [];

  const roundLabel =
    remoteState.round === 'jeopardy' ? 'Jeopardy!'
    : remoteState.round === 'double-jeopardy' ? 'Double Jeopardy!'
    : 'Final Jeopardy!';

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col bg-[#020524] text-white select-none font-sans">

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b-2 border-blue-800/60 bg-[#030b35] shrink-0">
        <div className="flex flex-col">
          <span className="font-jeopardy-title text-base font-black text-amber-300 uppercase tracking-wider leading-tight">
            JEOPARDY!
          </span>
          <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">
            {roundLabel} · Room {connectionState.roomCode}
          </span>
        </div>
        <button
          onClick={onLeave}
          className="text-xs text-blue-300 hover:text-white px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-700 cursor-pointer"
        >
          Leave
        </button>
      </div>

      {/* Whose turn indicator */}
      {!clueOpen && remoteState.activePickerPlayerId && (
        <div className={`text-center text-xs font-bold py-1 uppercase tracking-wider shrink-0 ${
          remoteState.activePickerPlayerId === connectionState.myPlayerId
            ? 'text-amber-300'
            : 'text-blue-300'
        }`}>
          {remoteState.activePickerPlayerId === connectionState.myPlayerId
            ? '⭐ Your turn to pick!'
            : `${remoteState.players.find(p => p.id === remoteState.activePickerPlayerId)?.name ?? 'Opponent'}'s turn to pick`
          }
        </div>
      )}

      {/* Board */}
      <div className="flex-1 p-2 min-h-0 overflow-hidden">
        {categories.length === 0 ? (
          <div className="flex items-center justify-center h-full text-blue-400 text-sm">
            Waiting for host to start the game...
          </div>
        ) : (
          <div
            className="grid gap-1.5 w-full h-full"
            style={{
              gridTemplateColumns: `repeat(${categories.length}, 1fr)`,
              gridTemplateRows: `auto repeat(${values.length}, 1fr)`,
            }}
          >
            {/* Category headers */}
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-[#060ce9] border-2 border-blue-500 rounded-lg flex items-center justify-center p-1.5 text-center"
              >
                <span className="font-jeopardy-title text-[10px] sm:text-xs font-black text-white uppercase tracking-wide leading-tight">
                  {cat.name}
                </span>
              </div>
            ))}

            {/* Clue tiles row by row */}
            {values.map((_, rowIdx) =>
              categories.map((cat) => {
                const clue = cat.clues[rowIdx];
                if (!clue) return <div key={`${cat.id}-${rowIdx}`} />;
                const answered = clue.isAnswered;
                return (
                  <button
                    key={clue.id}
                    onClick={() => handleTileClick(categories.indexOf(cat), rowIdx, clue)}
                    disabled={answered || clueOpen || isNotMyTurn}
                    className={`rounded-lg flex items-center justify-center font-jeopardy-dollar font-black transition-all text-sm sm:text-base cursor-pointer shadow-md ${
                      answered
                        ? 'bg-[#010420] border border-blue-950/30 text-transparent'
                        : clueOpen || isNotMyTurn
                        ? 'bg-[#060ce9] border-2 border-blue-600 text-amber-300 opacity-50 cursor-not-allowed'
                        : 'bg-[#060ce9] border-2 border-blue-600 text-amber-300 hover:bg-[#0a14ff] hover:border-amber-400/70 active:scale-95'
                    }`}
                  >
                    {answered ? '' : `$${clue.value}`}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Scoreboard strip */}
      <div className="shrink-0 border-t-2 border-blue-800/60 bg-[#030b35] px-2 py-2">
        <div className="flex gap-2 justify-center overflow-x-auto">
          {remoteState.players.map((p) => {
            const isMe = p.id === connectionState.myPlayerId;
            const isNeg = p.score < 0;
            return (
              <div
                key={p.id}
                className={`flex flex-col items-center px-3 py-2 rounded-lg border min-w-[80px] ${
                  isMe
                    ? 'bg-gradient-to-b from-[#0b1682] to-[#01041b] border-amber-400 shadow-[0_0_14px_rgba(252,192,20,0.5)]'
                    : 'bg-[#040828] border-blue-900'
                }`}
              >
                <span className="text-[9px] font-bold text-blue-200 truncate max-w-[72px]">
                  {p.name}{isMe ? ' (You)' : ''}
                </span>
                <span className={`font-digital-led text-base font-black ${isNeg ? 'text-rose-400' : 'text-amber-300'}`}>
                  {isNeg ? `-$${Math.abs(p.score)}` : `$${p.score}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clue overlay (portal-style fixed overlay) */}
      <ClueOverlay />
    </div>
  );
};
