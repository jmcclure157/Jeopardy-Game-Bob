'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useJeopardyGame } from '../hooks/useJeopardyGame';
import { useMultiplayer } from '../hooks/useMultiplayer';
import { Header } from '../components/Header';
import { GameBoard } from '../components/GameBoard';
import { Scoreboard } from '../components/Scoreboard';
import { ClueModal } from '../components/ClueModal';
import { DailyDoubleModal } from '../components/DailyDoubleModal';
import { FinalJeopardyModal } from '../components/FinalJeopardyModal';
import { WinnerPodium } from '../components/WinnerPodium';
import { RulesModal } from '../components/RulesModal';
import { CategoryPickerModal } from '../components/CategoryPickerModal';
import { HostMultiplayerModal } from '../components/HostMultiplayerModal';
import { MobileBuzzerController } from '../components/MobileBuzzerController';
import { Smartphone, Sparkles, Wifi } from 'lucide-react';
import { soundFx } from '../lib/sound';

export default function JeopardyApp() {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [isPlayerMode, setIsPlayerMode] = useState(false);
  const [buzzedPlayerId, setBuzzedPlayerId] = useState<string | null>(null);

  // Player Join Inputs
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');

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
    addPlayer,
    removePlayer,
    setDailyDoubleWager,
    setIsWagerConfirmed,
    goToNextRound,
    updateFinalWager,
    updateFinalAnswer,
    scoreFinalJeopardy,
    toggleSound
  } = useJeopardyGame();

  // Handle Host receiving buzz from remote player
  const handleHostReceiveBuzz = useCallback((playerId: string) => {
    setBuzzedPlayerId(playerId);
    const pIdx = players.findIndex(p => p.id === playerId);
    if (pIdx !== -1) {
      setActivePlayerIndex(pIdx);
    }
  }, [players, setActivePlayerIndex]);

  // Handle Host receiving answer from remote player
  const handleHostReceiveAnswer = useCallback((playerId: string, answer: string) => {
    if (activeClueData) {
      submitAnswer(answer, playerId);
    }
  }, [activeClueData, submitAnswer]);

  // Handle Host receiving new player joined over WebRTC
  const handleHostPlayerJoined = useCallback((player: any) => {
    addPlayer(player);
  }, [addPlayer]);

  // WebRTC Multiplayer Hook
  const {
    connectionState,
    remoteState,
    hostRoom,
    joinRoom,
    broadcastState,
    sendBuzzIn,
    sendAnswer,
    leaveRoom
  } = useMultiplayer(
    handleHostReceiveBuzz,
    handleHostReceiveAnswer,
    handleHostPlayerJoined
  );

  // Check URL parameters on mount (?role=player&room=CODE)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const role = params.get('role');
      const room = params.get('room');
      if (role === 'player' || room) {
        setIsPlayerMode(true);
        if (room) setJoinCode(room.toUpperCase());
      }
    }
  }, []);

  // Broadcast game state to connected phones whenever state changes
  useEffect(() => {
    if (connectionState.isHost && connectionState.status === 'connected') {
      let clueState: 'none' | 'reading' | 'buzzed' | 'revealed' = 'none';
      if (activeClueData) {
        if (buzzedPlayerId) {
          clueState = 'buzzed';
        } else {
          clueState = 'reading';
        }
      }

      const buzzedPlayer = players.find(p => p.id === buzzedPlayerId);

      broadcastState({
        round,
        clueState,
        activeClueValue: activeClueData?.clue.value,
        categoryName: activeClueData?.categoryName,
        clueText: activeClueData?.clue.clue,
        buzzedPlayerId: buzzedPlayerId || undefined,
        buzzedPlayerName: buzzedPlayer?.name,
        players,
        isDailyDouble: isDailyDoubleActive
      });
    }
  }, [
    connectionState.isHost,
    connectionState.status,
    round,
    activeClueData,
    buzzedPlayerId,
    players,
    isDailyDoubleActive,
    broadcastState
  ]);

  // Clear remote buzzed player when clue is closed or passed
  const handleCloseClue = useCallback(() => {
    setBuzzedPlayerId(null);
    closeClueModal();
  }, [closeClueModal]);

  const handlePassClue = useCallback(() => {
    setBuzzedPlayerId(null);
    passClue();
  }, [passClue]);

  const handleDailyDoubleWagerConfirmed = (wager: number, playerId: string) => {
    setDailyDoubleWager(wager);
    setIsWagerConfirmed(true);
    const pIdx = players.findIndex(p => p.id === playerId);
    if (pIdx !== -1) setActivePlayerIndex(pIdx);
  };

  // Mobile Player Mode View
  if (isPlayerMode) {
    if (connectionState.status === 'connected' && connectionState.isPlayer) {
      return (
        <MobileBuzzerController
          connectionState={connectionState}
          remoteState={remoteState}
          onSendBuzz={sendBuzzIn}
          onSendAnswer={sendAnswer}
          onLeave={() => {
            leaveRoom();
            setIsPlayerMode(false);
          }}
        />
      );
    }

    return (
      <main className="min-h-screen bg-[#020524] text-white flex flex-col justify-between p-4 max-w-md mx-auto select-none font-sans">
        <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-amber-300 font-jeopardy-title text-xl">
              JEOPARDY!
            </span>
          </div>
          <button
            onClick={() => setIsPlayerMode(false)}
            className="text-xs text-blue-300 hover:text-white px-2.5 py-1 rounded-lg bg-blue-950 border border-blue-800"
          >
            Switch to TV Board
          </button>
        </div>

        <div className="my-auto py-6 space-y-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 p-0.5 shadow-[0_0_40px_rgba(252,192,20,0.6)]">
            <div className="w-full h-full bg-[#040d3a] rounded-[22px] flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-amber-400 animate-pulse" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black font-jeopardy-title text-white uppercase tracking-wider">
              Contestant Buzzer
            </h1>
            <p className="text-xs text-blue-300 mt-1 max-w-xs mx-auto">
              Join your friend&apos;s Jeopardy! game to buzz in and play from your phone.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (joinCode.trim() && joinName.trim()) {
                joinRoom(joinCode.trim(), joinName.trim());
              }
            }}
            className="space-y-4 max-w-xs mx-auto"
          >
            <div>
              <label className="text-[11px] uppercase font-bold text-blue-300 tracking-wider block mb-1 text-left">
                Room Code:
              </label>
              <input
                type="text"
                maxLength={6}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="JEOP"
                className="w-full bg-black/80 border-2 border-amber-400 rounded-xl py-2.5 px-4 text-2xl font-black font-mono text-amber-300 text-center tracking-widest uppercase focus:outline-none focus:ring-4 focus:ring-amber-400/50"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold text-blue-300 tracking-wider block mb-1 text-left">
                Your Name:
              </label>
              <input
                type="text"
                maxLength={20}
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                placeholder="Ken Jennings"
                className="w-full bg-black/80 border-2 border-blue-500/60 rounded-xl py-2.5 px-4 text-base font-bold text-white text-center focus:outline-none focus:border-amber-400"
              />
            </div>

            {connectionState.errorMessage && (
              <p className="text-rose-400 text-xs font-bold">
                {connectionState.errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={!joinCode.trim() || !joinName.trim() || connectionState.status === 'connecting'}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-blue-950 font-black rounded-xl text-base uppercase tracking-wider shadow-[0_0_25px_rgba(252,192,20,0.7)] transition-transform active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              {connectionState.status === 'connecting' ? 'Connecting...' : 'Join Game'}
            </button>
          </form>
        </div>

        <footer className="text-center text-[10px] text-blue-400/50 pt-2 border-t border-blue-950">
          Jeopardy! Mobile Controller • Real-time WebRTC
        </footer>
      </main>
    );
  }

  // TV Host Screen View
  return (
    <main className="h-screen max-h-screen overflow-hidden flex flex-col justify-between bg-[#020524] text-white selection:bg-amber-400 selection:text-blue-950 font-sans">
      {/* Header Bar with Shuffle, Choose Category, and Host Multiplayer Controls */}
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
        onOpenMultiplayer={() => setIsHostModalOpen(true)}
        onNextRound={goToNextRound}
        isRoundComplete={isRoundComplete}
        connectedPlayerCount={connectionState.connectedCount}
      />

      {/* Main Game Screen */}
      <div className="flex-1 flex flex-col justify-center items-center px-2 py-0.5 w-full min-h-0 overflow-y-auto sm:overflow-hidden">
        {round === 'game-over' ? (
          <WinnerPodium players={players} onRestart={restartGame} />
        ) : (
          <div className="w-full space-y-1 sm:space-y-1.5 flex flex-col items-center justify-center my-auto">
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
              onRemovePlayer={removePlayer}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full flex items-center justify-between px-3 py-1 text-[10px] text-blue-400/50 border-t border-blue-950/80 shrink-0">
        <span>Classic Jeopardy! Game Show App</span>
        <button
          onClick={() => setIsPlayerMode(true)}
          className="flex items-center gap-1 text-blue-300 hover:text-amber-300 transition-colors font-medium"
        >
          <Smartphone className="w-3 h-3" />
          <span>Switch to Phone Buzzer</span>
        </button>
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

      {/* Host Multiplayer Lobby Modal */}
      <HostMultiplayerModal
        isOpen={isHostModalOpen}
        connectionState={connectionState}
        players={players}
        onStartHosting={hostRoom}
        onClose={() => setIsHostModalOpen(false)}
      />

      {/* Daily Double Wager Modal */}
      {activeClueData && isDailyDoubleActive && !isWagerConfirmed && (
        <DailyDoubleModal
          players={players}
          activePlayerIndex={activePlayerIndex}
          round={round}
          onConfirmWager={handleDailyDoubleWagerConfirmed}
          onCancel={handleCloseClue}
        />
      )}

      {/* Clue Modal with Spacebar & Remote Phone Buzzer */}
      {activeClueData && (!isDailyDoubleActive || isWagerConfirmed) && (
        <ClueModal
          categoryName={activeClueData.categoryName}
          clue={activeClueData.clue}
          players={players}
          activePlayerIndex={activePlayerIndex}
          isDailyDouble={isDailyDoubleActive}
          dailyDoubleWager={dailyDoubleWager}
          externalBuzzedPlayerId={buzzedPlayerId}
          onSubmitAnswer={submitAnswer}
          onHostOverride={hostOverride}
          onPassClue={handlePassClue}
          onClose={handleCloseClue}
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
