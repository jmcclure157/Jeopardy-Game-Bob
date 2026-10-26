'use client';

import React, { useState } from 'react';
import { Category, RoundType } from '../types/game';
import { MASTER_CATEGORY_LIBRARY, CategoryWithMeta } from '../data/categoryLibrary';
import { X, Shuffle, Check, Sparkles, Filter, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundFx } from '../lib/sound';

interface CategoryPickerModalProps {
  isOpen: boolean;
  round: RoundType;
  currentCategories: Category[];
  onApplyCategories: (selectedCats: Category[]) => void;
  onShuffleCategories: () => void;
  onClose: () => void;
}

export const CategoryPickerModal: React.FC<CategoryPickerModalProps> = ({
  isOpen,
  round,
  currentCategories,
  onApplyCategories,
  onShuffleCategories,
  onClose
}) => {
  if (!isOpen) return null;

  const targetRoundType = round === 'double-jeopardy' ? 'double-jeopardy' : 'jeopardy';
  const availableCategories = MASTER_CATEGORY_LIBRARY.filter(c => c.roundType === targetRoundType);

  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    currentCategories.map(c => c.id || c.name)
  );
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  const topics = ['All', ...Array.from(new Set(availableCategories.map(c => c.topic)))];

  const filteredCategories = selectedTopic === 'All'
    ? availableCategories
    : availableCategories.filter(c => c.topic === selectedTopic);

  const toggleCategory = (cat: CategoryWithMeta) => {
    soundFx.playTimerTick();
    const id = cat.id;
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      if (selectedIds.length < 6) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const handleRandomize = () => {
    soundFx.playDailyDouble();
    const shuffled = [...availableCategories].sort(() => 0.5 - Math.random());
    const random6 = shuffled.slice(0, 6).map(c => c.id);
    setSelectedIds(random6);
  };

  const handleApply = () => {
    if (selectedIds.length !== 6) return;
    soundFx.playCorrect();
    const chosenCategories = selectedIds
      .map(id => availableCategories.find(c => c.id === id))
      .filter((c): c is CategoryWithMeta => !!c);
    
    onApplyCategories(chosenCategories);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#091b68] via-[#040d3a] to-[#010418] border-4 border-amber-400 rounded-3xl shadow-[0_0_80px_rgba(252,192,20,0.5)] p-5 sm:p-8 text-white flex flex-col max-h-[90vh] overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-white/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400/20 border border-amber-400 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-blue-300 tracking-widest block">
                {round === 'double-jeopardy' ? 'Double Jeopardy! Round' : 'Jeopardy! Round'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-jeopardy-title text-amber-300 uppercase tracking-wider">
                Custom Category Picker
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

        {/* Top Controls: Topic Filter + Randomize Button + Selection Count */}
        <div className="py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          
          {/* Topic Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-blue-300 font-bold uppercase mr-1">Topic:</span>
            {topics.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedTopic === t
                    ? 'bg-amber-400 text-blue-950 shadow font-black'
                    : 'bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-700/50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Randomizer / Quick Shuffle */}
          <button
            type="button"
            onClick={handleRandomize}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-900/90 hover:bg-blue-800 text-amber-300 border border-amber-400/50 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Randomize 6</span>
          </button>
        </div>

        {/* Categories Selection Grid */}
        <div className="flex-1 overflow-y-auto py-4 pr-1">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-blue-200">
              Select exactly <strong>6 categories</strong> for the board:
            </span>
            <span className={`font-bold px-2.5 py-0.5 rounded-full ${
              selectedIds.length === 6 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400' : 'bg-amber-500/20 text-amber-300 border border-amber-400'
            }`}>
              {selectedIds.length} / 6 selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredCategories.map((cat) => {
              const isSelected = selectedIds.includes(cat.id);
              const isDisabled = !isSelected && selectedIds.length >= 6;

              return (
                <button
                  key={cat.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => toggleCategory(cat)}
                  className={`relative p-3.5 rounded-2xl border-2 text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#0b2488] to-[#04124c] border-amber-400 shadow-[0_0_20px_rgba(252,192,20,0.5)] scale-102 ring-2 ring-amber-300'
                      : isDisabled
                      ? 'bg-blue-950/30 border-blue-900/30 text-blue-400/40 cursor-not-allowed opacity-40'
                      : 'bg-gradient-to-b from-[#060ce9]/60 to-[#020556]/80 border-blue-500/40 hover:border-blue-300 hover:scale-101'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold text-blue-300 px-2 py-0.5 rounded bg-black/40">
                      {cat.topic}
                    </span>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected ? 'bg-amber-400 border-amber-300 text-blue-950 font-black' : 'border-blue-400/40'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <h4 className="font-jeopardy-title text-sm sm:text-base text-white font-bold mt-2 leading-tight">
                    {cat.name}
                  </h4>

                  <p className="text-[11px] text-blue-200/80 mt-1">
                    5 clues (${cat.clues[0].value} - ${cat.clues[4].value})
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-200 text-sm font-bold border border-blue-600/40 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={selectedIds.length !== 6}
            onClick={handleApply}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:brightness-110 text-blue-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-[0_0_30px_rgba(252,192,20,0.8)] transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer animate-pulseGlow"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Apply Selected Board</span>
          </button>
        </div>

      </div>
    </div>
  );
};
