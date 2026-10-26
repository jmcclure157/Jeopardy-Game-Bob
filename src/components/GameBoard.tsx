'use client';

import React from 'react';
import { Category, Clue } from '../types/game';

interface GameBoardProps {
  categories: Category[];
  onSelectClue: (categoryIdx: number, clueIdx: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ categories, onSelectClue }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-3 py-1 select-none">
      {/* 6x6 TV Grid Container with Outer Bevel */}
      <div className="bg-black p-1.5 sm:p-2 rounded-xl tv-board-border shadow-[0_10px_40px_rgba(0,0,0,0.85)]">
        
        {/* Category Headers (Top Row) */}
        <div className="grid grid-cols-6 gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
          {categories.map((category, catIdx) => (
            <div
              key={category.id || catIdx}
              className="flex items-center justify-center p-1 sm:p-2 min-h-[46px] sm:min-h-[52px] md:min-h-[58px] tv-category-header rounded-md text-center"
            >
              <h3 className="text-white font-extrabold text-[10px] sm:text-[11px] md:text-xs font-jeopardy-title uppercase leading-tight line-clamp-2">
                {category.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Clue Rows (5 Dollar Rows x 6 Category Columns) */}
        <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
          {[0, 1, 2, 3, 4].map((clueRowIdx) => (
            <React.Fragment key={`row-${clueRowIdx}`}>
              {categories.map((category, catIdx) => {
                const clue: Clue | undefined = category.clues[clueRowIdx];
                if (!clue) return <div key={`empty-${catIdx}-${clueRowIdx}`} className="min-h-[38px] sm:min-h-[46px] md:min-h-[54px]" />;

                const isAnswered = clue.isAnswered;

                return (
                  <button
                    key={clue.id || `${catIdx}-${clueRowIdx}`}
                    disabled={isAnswered}
                    onClick={() => onSelectClue(catIdx, clueRowIdx)}
                    className={`relative flex items-center justify-center min-h-[38px] sm:min-h-[46px] md:min-h-[54px] rounded-md transition-all duration-150 transform cursor-pointer ${
                      isAnswered
                        ? 'bg-[#030626] border border-[#0a1140] opacity-20 cursor-default'
                        : 'tv-tile active:scale-95 group'
                    }`}
                  >
                    {!isAnswered ? (
                      <span className="font-jeopardy-dollar text-lg sm:text-2xl md:text-3xl tv-gold-text group-hover:scale-105 transition-transform duration-150">
                        ${clue.value}
                      </span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-blue-950/60" />
                    )}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>

      </div>
    </div>
  );
};
