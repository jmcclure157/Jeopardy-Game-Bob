'use client';

import React from 'react';
import { Category, Clue } from '../types/game';

interface GameBoardProps {
  categories: Category[];
  onSelectClue: (categoryIdx: number, clueIdx: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ categories, onSelectClue }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2 select-none">
      {/* 6x6 TV Grid Container with Outer Bevel */}
      <div className="bg-black p-2 sm:p-3 rounded-2xl tv-board-border shadow-[0_15px_50px_rgba(0,0,0,0.9)]">
        
        {/* Category Headers (Top Row) */}
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2.5 mb-1.5 sm:mb-2.5">
          {categories.map((category, catIdx) => (
            <div
              key={category.id || catIdx}
              className="flex items-center justify-center p-2 sm:p-3 min-h-[75px] sm:min-h-[100px] md:min-h-[115px] tv-category-header rounded-lg text-center"
            >
              <h3 className="text-white font-extrabold text-[11px] sm:text-xs md:text-sm lg:text-base font-jeopardy-title uppercase leading-snug line-clamp-3">
                {category.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Clue Rows (5 Dollar Rows x 6 Category Columns) */}
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2.5">
          {[0, 1, 2, 3, 4].map((clueRowIdx) => (
            <React.Fragment key={`row-${clueRowIdx}`}>
              {categories.map((category, catIdx) => {
                const clue: Clue | undefined = category.clues[clueRowIdx];
                if (!clue) return <div key={`empty-${catIdx}-${clueRowIdx}`} className="min-h-[60px] sm:min-h-[85px] md:min-h-[100px]" />;

                const isAnswered = clue.isAnswered;

                return (
                  <button
                    key={clue.id || `${catIdx}-${clueRowIdx}`}
                    disabled={isAnswered}
                    onClick={() => onSelectClue(catIdx, clueRowIdx)}
                    className={`relative flex items-center justify-center min-h-[60px] sm:min-h-[85px] md:min-h-[105px] rounded-lg transition-all duration-150 transform cursor-pointer ${
                      isAnswered
                        ? 'bg-[#030626] border-2 border-[#0a1140] opacity-25 cursor-default'
                        : 'tv-tile active:scale-95 group'
                    }`}
                  >
                    {!isAnswered ? (
                      <span className="font-jeopardy-dollar text-2xl sm:text-3xl md:text-4xl lg:text-5xl tv-gold-text group-hover:scale-110 transition-transform duration-150">
                        ${clue.value}
                      </span>
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-950/60" />
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
