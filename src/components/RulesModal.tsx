'use client';

import React from 'react';
import { X, CheckCircle, Award, Sparkles, HelpCircle } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0a1e64] via-[#05113c] to-[#02071a] border-2 border-blue-400 rounded-3xl shadow-2xl p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-serif text-amber-400 uppercase tracking-wider">
              How to Play Jeopardy!
            </h2>
            <p className="text-xs text-blue-300">Game Rules & Host Guide</p>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-sm text-blue-100 leading-relaxed">
          <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-800/60 space-y-2">
            <h3 className="font-bold text-amber-300 uppercase text-xs tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              1. The Game Structure
            </h3>
            <p>
              The game is played across three rounds: <strong>Jeopardy!</strong> (Round 1), <strong>Double Jeopardy!</strong> (Round 2 with doubled values), and <strong>Final Jeopardy!</strong> (Round 3 with wagering).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-800/60 space-y-2">
            <h3 className="font-bold text-amber-300 uppercase text-xs tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              2. Clues & Scoring
            </h3>
            <p>
              Click any value tile on the board to reveal the clue. The buzzed-in player types their response or states it aloud.
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-blue-200 pl-2">
              <li><strong>Correct Answer:</strong> Awards the clue&apos;s dollar value.</li>
              <li><strong>Incorrect Answer:</strong> Deducts the clue&apos;s dollar value from the player&apos;s bank.</li>
              <li><strong>Host Overrides:</strong> The host can click Award or Deduct at any time to manually adjust points.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-800/60 space-y-2">
            <h3 className="font-bold text-amber-300 uppercase text-xs tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              3. Smart Answer Engine
            </h3>
            <p>
              You can type answers with or without <em>&quot;What is...&quot;</em> or <em>&quot;Who is...&quot;</em>. The built-in fuzzy matching engine automatically handles minor typos, capitalization, and alternative accepted answers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-800/60 space-y-2">
            <h3 className="font-bold text-amber-300 uppercase text-xs tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              4. Daily Doubles & Final Jeopardy
            </h3>
            <p>
              Hidden <strong>Daily Doubles</strong> let the controlling contestant wager any amount up to their total score (or the round maximum if their score is low). In <strong>Final Jeopardy</strong>, all contenders with a positive bankroll place secret wagers before tackling the final clue!
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-blue-950 font-black rounded-xl text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
          >
            Got It, Let&apos;s Play!
          </button>
        </div>

      </div>
    </div>
  );
};
