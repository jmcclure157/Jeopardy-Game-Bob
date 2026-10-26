'use client';

import React from 'react';
import { Category, Clue } from '../types/game';

interface GameBoardProps {
  categories: Category[];
  onSelectClue: (categoryIdx: number, clueIdx: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ categories, onSelectClue }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-1 select-none">
      {/* 6x6 TV Grid Container with Outer Bevel */}
      <div className="bg-black p-2 rounded-2xl tv-board-border shadow-[0_12px_45px_rgba(0,0,0,0.9)]">
        
        {/* Category Headers (Top Row) */}
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          {categories.map((category, catIdx) => (
            <div
              key={category.id || catIdx}
              className="flex items-center justify-center p-1.5 sm:p-2.5 min-h-[56px] sm:min-h-[64px] md:min-h-[70px] tv-category-header rounded-lg text-center"
            >
              <h3 className="text-white font-extrabold text-[11px] sm:text-xs md:text-sm font-jeopardy-title uppercase leading-snug line-clamp-3">
                {category.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Clue Rows (5 Dollar Rows x 6 Category Columns) */}
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {[0, 1, 2, 3, 4].map((clueRowIdx) => (
            <React.Fragment key={`row-${clueRowIdx}`}>
              {categories.map((category, catIdx) => {
                const clue: Clue | undefined = category.clues[clueRowIdx];
                if (!clue) return <div key={`empty-${catIdx}-${clueRowIdx}`} className="min-h-[48px] sm:min-h-[58px] md:min-h-[64px]" />;

                const isAnswered = clue.isAnswered;

                return (
                  <button
                    key={clue.id || `${catIdx}-${clueRowIdx}`}
                    disabled={isAnswered}
                    onClick={() => onSelectClue(catIdx, clueRowIdx)}
                    className={`relative flex items-center justify-center min-h-[48px] sm:min-h-[58px] md:min-h-[64px] rounded-lg transition-all duration-150 transform cursor-pointer ${
                      isAnswered
                        ? 'bg-[#030626] border border-[#0a1140] opacity-20 cursor-default'
                        : 'tv-tile active:scale-95 group'
                    }`}
                  >
                    {!isAnswered ? (
                      <span className="font-jeopardy-dollar text-xl sm:text-3xl md:text-4xl tv-gold-text group-hover:scale-105 transition-transform duration-150">
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
