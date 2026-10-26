'use client';

import React, { useState } from 'react';
import { useJeopardyGame } from '../hooks/useJeopardyGame';
import { Header } from '../components/Header';
import { GameBoard } from '../components/GameBoard';
import { Scoreboard } from '../components/Scoreboard';
import { ClueModal } from '../components/ClueModal';
import { DailyDoubleModal } from '../components/DailyDoubleModal';
import { FinalJeopardyModal } from '../components/FinalJeopardyModal';
import { WinnerPodium } from '../components/WinnerPodium';
import { RulesModal } from '../components/RulesModal';
import { CategoryPickerModal } from '../components/CategoryPickerModal';

export default function JeopardyApp() {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

  const {
    packIndex,
    currentPack,
    round,
    players,
    activePlayerIndex,
    currentCategories,
    activeClueData,
    isDailyDoubleActive,
    dailyDoubleWager,
    isWagerConfirmed,
    soundEnabled,
    isRoundComplete,
    setActivePlayerIndex,
    selectGamePack,
    restartGame,
    shuffleCategories,
    setCustomCategories,
    selectClue,
    closeClueModal,
    submitAnswer,
    hostOverride,
    passClue,
    adjustPlayerScore,
    updatePlayerName,
    setPlayerCount,
    setDailyDoubleWager,
    setIsWagerConfirmed,
    goToNextRound,
    updateFinalWager,
    updateFinalAnswer,
    scoreFinalJeopardy,
    toggleSound
  } = useJeopardyGame();

  const handleDailyDoubleWagerConfirmed = (wager: number, playerId: string) => {
    setDailyDoubleWager(wager);
    setIsWagerConfirmed(true);
    const pIdx = players.findIndex(p => p.id === playerId);
    if (pIdx !== -1) setActivePlayerIndex(pIdx);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#020524] text-white selection:bg-amber-400 selection:text-blue-950 font-sans">
      {/* Header Bar with Shuffle & Choose Category Controls */}
      <Header
        round={round}
        packIndex={packIndex}
        soundEnabled={soundEnabled}
        onSelectPack={selectGamePack}
        onShuffleBoard={shuffleCategories}
        onOpenCategoryPicker={() => setIsCategoryPickerOpen(true)}
        onToggleSound={toggleSound}
        onRestart={restartGame}
        onOpenRules={() => setIsRulesOpen(true)}
        onNextRound={goToNextRound}
        isRoundComplete={isRoundComplete}
      />

      {/* Main Game Screen */}
      <div className="flex-1 flex flex-col justify-center items-center py-2 sm:py-4 w-full">
        {round === 'game-over' ? (
          <WinnerPodium players={players} onRestart={restartGame} />
        ) : (
          <div className="w-full space-y-3 sm:space-y-4">
            <GameBoard
              categories={currentCategories}
              onSelectClue={selectClue}
            />

            <Scoreboard
              players={players}
              activePlayerIndex={activePlayerIndex}
              onSelectActivePlayer={setActivePlayerIndex}
              onAdjustScore={adjustPlayerScore}
              onUpdatePlayerName={updatePlayerName}
              onSetPlayerCount={setPlayerCount}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-2 text-[11px] text-blue-400/50 border-t border-blue-950">
        Classic Jeopardy! Game Show App • Built with Next.js & Tailwind CSS
      </footer>

      {/* Category Picker Modal */}
      <CategoryPickerModal
        isOpen={isCategoryPickerOpen}
        round={round}
        currentCategories={currentCategories}
        onApplyCategories={setCustomCategories}
        onShuffleCategories={shuffleCategories}
        onClose={() => setIsCategoryPickerOpen(false)}
      />

      {/* Daily Double Wager Modal */}
      {activeClueData && isDailyDoubleActive && !isWagerConfirmed && (
        <DailyDoubleModal
          players={players}
          activePlayerIndex={activePlayerIndex}
          round={round}
          onConfirmWager={handleDailyDoubleWagerConfirmed}
          onCancel={closeClueModal}
        />
      )}

      {/* Clue Modal with Spacebar Buzzer */}
      {activeClueData && (!isDailyDoubleActive || isWagerConfirmed) && (
        <ClueModal
          categoryName={activeClueData.categoryName}
          clue={activeClueData.clue}
          players={players}
          activePlayerIndex={activePlayerIndex}
          isDailyDouble={isDailyDoubleActive}
          dailyDoubleWager={dailyDoubleWager}
          onSubmitAnswer={submitAnswer}
          onHostOverride={hostOverride}
          onPassClue={passClue}
          onClose={closeClueModal}
        />
      )}

      {/* Final Jeopardy Modal */}
      {round === 'final-jeopardy' && (
        <FinalJeopardyModal
          finalData={currentPack.finalJeopardy}
          players={players}
          onUpdateWager={updateFinalWager}
          onUpdateAnswer={updateFinalAnswer}
          onScoreFinal={scoreFinalJeopardy}
          onFinishGame={goToNextRound}
        />
      )}

      {/* Rules & Help Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </main>
  );
}
