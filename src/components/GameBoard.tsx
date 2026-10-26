'use client';

import React from 'react';
import { Category, Clue } from '../types/game';

interface GameBoardProps {
  categories: Category[];
  onSelectClue: (categoryIdx: number, clueIdx: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ categories, onSelectClue }) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6 select-none">
      {/* Category Headers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
        {categories.map((category, catIdx) => (
          <div
            key={category.id || catIdx}
            className="flex items-center justify-center p-3 sm:p-4 min-h-[70px] sm:min-h-[90px] md:min-h-[105px] bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 border-2 border-blue-400/50 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.5)] text-center transition-all"
          >
            <h3 className="text-white font-extrabold text-xs sm:text-sm md:text-base tracking-wider uppercase font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight line-clamp-3">
              {category.name}
            </h3>
          </div>
        ))}
      </div>

      {/* Clue Rows Grid (5 rows x 6 columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {[0, 1, 2, 3, 4].map((clueRowIdx) => (
          <React.Fragment key={`row-${clueRowIdx}`}>
            {categories.map((category, catIdx) => {
              const clue: Clue | undefined = category.clues[clueRowIdx];
              if (!clue) return <div key={`empty-${catIdx}-${clueRowIdx}`} />;

              const isAnswered = clue.isAnswered;

              return (
                <button
                  key={clue.id || `${catIdx}-${clueRowIdx}`}
                  disabled={isAnswered}
                  onClick={() => onSelectClue(catIdx, clueRowIdx)}
                  className={`relative flex items-center justify-center min-h-[65px] sm:min-h-[85px] md:min-h-[100px] rounded-lg border-2 transition-all duration-200 transform ${
                    isAnswered
                      ? 'bg-blue-950/40 border-blue-900/30 text-blue-900/40 cursor-default opacity-40'
                      : 'bg-gradient-to-b from-[#0e2a94] via-[#091b68] to-[#040c35] hover:from-[#1b3cb5] hover:to-[#0a1f73] border-blue-400/60 hover:border-amber-400 shadow-[0_6px_16px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:-translate-y-1 cursor-pointer active:scale-95 group'
                  }`}
                >
                  {!isAnswered ? (
                    <span className="text-amber-400 group-hover:text-amber-300 font-black text-xl sm:text-2xl md:text-3xl font-serif tracking-widest drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]">
                      ${clue.value}
                    </span>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-blue-700/30" />
                  )}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
