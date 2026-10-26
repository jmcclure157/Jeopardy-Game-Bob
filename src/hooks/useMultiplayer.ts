'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { DataConnection } from 'peerjs';
import { Player, RoundType, Category, Clue } from '../types/game';
import { NetworkMessage, PeerConnectionState } from '../types/multiplayer';
import { soundFx } from '../lib/sound';

export function useMultiplayer(
  onHostReceiveBuzz?: (playerId: string) => void,
  onHostReceiveAnswer?: (playerId: string, answer: string) => void,
  onHostPlayerJoined?: (player: Player) => void,
  onHostReceiveSelectClue?: (categoryIdx: number, clueIdx: number) => void,
  onHostReceiveWager?: (playerId: string, wager: number) => void
) {
  const [connectionState, setConnectionState] = useState<PeerConnectionState>({
    isHost: false,
    isPlayer: false,
    roomCode: null,
    myPlayerId: null,
    connectedCount: 0,
    status: 'disconnected'
  });

  // Host connections map: playerId -> DataConnection
  const hostConnectionsRef = useRef<Map<string, DataConnection>>(new Map());
  // Player single connection to host
  const playerConnectionRef = useRef<DataConnection | null>(null);
  const peerRef = useRef<any>(null);

  // Latest synced state received on remote player
  const [remoteState, setRemoteState] = useState<{
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
  }>({
    round: 'jeopardy',
    clueState: 'none',
    categories: [],
    players: []
  });

  // Cleanup peer
  const cleanup = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    hostConnectionsRef.current.clear();
    playerConnectionRef.current = null;
    setConnectionState({
      isHost: false,
      isPlayer: false,
      roomCode: null,
      myPlayerId: null,
      connectedCount: 0,
      status: 'disconnected'
    });
  }, []);

  // HOST: Create a Room
  const hostRoom = useCallback(async (code: string) => {
    cleanup();
    const cleanCode = code.toUpperCase().trim();
    setConnectionState(prev => ({ ...prev, status: 'connecting', roomCode: cleanCode, isHost: true }));

    try {
      const { default: Peer } = await import('peerjs');
      const peerId = `jeopardy-room-${cleanCode.toLowerCase()}`;
      const peer = new Peer(peerId, {
        debug: 1
      });

      peer.on('open', () => {
        setConnectionState(prev => ({ ...prev, status: 'connected', isHost: true, roomCode: cleanCode }));
      });

      peer.on('connection', (conn: DataConnection) => {
        conn.on('data', (data: any) => {
          const msg = data as NetworkMessage;
          if (msg.type === 'JOIN_ROOM') {
            const playerId = `p-${Date.now().toString().slice(-4)}`;
            const newPlayer: Player = {
              id: playerId,
              name: msg.playerName || `Contestant ${hostConnectionsRef.current.size + 1}`,
              score: 0,
              color: 'from-blue-600 to-indigo-700'
            };

            hostConnectionsRef.current.set(playerId, conn);
            setConnectionState(prev => ({
              ...prev,
              connectedCount: hostConnectionsRef.current.size
            }));

            // Notify Host game engine
            onHostPlayerJoined?.(newPlayer);
            soundFx.playBuzzerPress();

            // Reply to the joining player
            conn.send({
              type: 'PLAYER_ACCEPTED',
              playerId,
              roomCode: cleanCode,
              players: [newPlayer]
            } as NetworkMessage);
          } else if (msg.type === 'BUZZ_IN') {
            onHostReceiveBuzz?.(msg.playerId);
          } else if (msg.type === 'SUBMIT_ANSWER') {
            onHostReceiveAnswer?.(msg.playerId, msg.answer);
          } else if (msg.type === 'SELECT_CLUE') {
            onHostReceiveSelectClue?.(msg.categoryIdx, msg.clueIdx);
          } else if (msg.type === 'SUBMIT_WAGER') {
            onHostReceiveWager?.(msg.playerId, msg.wager);
          }
        });

        conn.on('close', () => {
          for (const [id, c] of hostConnectionsRef.current.entries()) {
            if (c === conn) {
              hostConnectionsRef.current.delete(id);
              break;
            }
          }
          setConnectionState(prev => ({
            ...prev,
            connectedCount: hostConnectionsRef.current.size
          }));
        });
      });

      peer.on('error', (err: any) => {
        console.error('Host Peer Error:', err);
        setConnectionState(prev => ({
          ...prev,
          status: 'error',
          errorMessage: err.type === 'unavailable-id' ? 'Room code already in use' : 'Connection error'
        }));
      });

      peerRef.current = peer;
    } catch (err: any) {
      console.error('Failed to init Host Peer:', err);
      setConnectionState(prev => ({ ...prev, status: 'error', errorMessage: err.message }));
    }
  }, [cleanup, onHostPlayerJoined, onHostReceiveBuzz, onHostReceiveAnswer, onHostReceiveSelectClue, onHostReceiveWager]);

  // HOST: Broadcast state to all connected remote players
  const broadcastState = useCallback((state: {
    round: RoundType;
    clueState: 'none' | 'reading' | 'buzzed' | 'revealed';
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
  }) => {
    const msg: NetworkMessage = {
      type: 'STATE_SYNC',
      ...state
    };
    hostConnectionsRef.current.forEach(conn => {
      if (conn.open) {
        conn.send(msg);
      }
    });
  }, []);

  // PLAYER: Join a Room from mobile phone
  const joinRoom = useCallback(async (code: string, playerName: string) => {
    cleanup();
    const cleanCode = code.toUpperCase().trim();
    setConnectionState(prev => ({ ...prev, status: 'connecting', roomCode: cleanCode, isPlayer: true }));

    try {
      const { default: Peer } = await import('peerjs');
      const peer = new Peer({ debug: 1 });

      peer.on('open', () => {
        const hostPeerId = `jeopardy-room-${cleanCode.toLowerCase()}`;
        const conn = peer.connect(hostPeerId, { reliable: true });

        conn.on('open', () => {
          playerConnectionRef.current = conn;
          // Send Join Request
          conn.send({
            type: 'JOIN_ROOM',
            playerName: playerName.trim() || 'Contestant'
          } as NetworkMessage);
        });

        conn.on('data', (data: any) => {
          const msg = data as NetworkMessage;
          if (msg.type === 'PLAYER_ACCEPTED') {
            setConnectionState(prev => ({
              ...prev,
              status: 'connected',
              isPlayer: true,
              roomCode: cleanCode,
              myPlayerId: msg.playerId
            }));
            soundFx.playCorrect();
          } else if (msg.type === 'STATE_SYNC') {
            setRemoteState({
              round: msg.round,
              clueState: msg.clueState,
              categories: msg.categories ?? [],
              activeClue: msg.activeClue,
              activeCategoryName: msg.activeCategoryName,
              activeCategoryIdx: msg.activeCategoryIdx,
              activeClueIdx: msg.activeClueIdx,
              activeClueValue: msg.activeClueValue,
              categoryName: msg.categoryName,
              clueText: msg.clueText,
              clueAnswer: msg.clueAnswer,
              buzzedPlayerId: msg.buzzedPlayerId,
              buzzedPlayerName: msg.buzzedPlayerName,
              players: msg.players,
              isDailyDouble: msg.isDailyDouble,
              dailyDoubleWager: msg.dailyDoubleWager
            });

            // Vibrate phone when buzzed in
            if (msg.clueState === 'buzzed' && msg.buzzedPlayerId) {
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
              }
            }
          }
        });

        conn.on('close', () => {
          setConnectionState(prev => ({
            ...prev,
            status: 'disconnected',
            errorMessage: 'Disconnected from host'
          }));
        });
      });

      peer.on('error', (err: any) => {
        console.error('Player Peer Error:', err);
        setConnectionState(prev => ({
          ...prev,
          status: 'error',
          errorMessage: 'Could not connect to host. Check room code.'
        }));
      });

      peerRef.current = peer;
    } catch (err: any) {
      console.error('Failed to init Player Peer:', err);
      setConnectionState(prev => ({ ...prev, status: 'error', errorMessage: err.message }));
    }
  }, [cleanup]);

  // PLAYER: Send Buzz In
  const sendBuzzIn = useCallback(() => {
    if (playerConnectionRef.current && connectionState.myPlayerId) {
      soundFx.playBuzzerPress();
      playerConnectionRef.current.send({
        type: 'BUZZ_IN',
        playerId: connectionState.myPlayerId,
        timestamp: Date.now()
      } as NetworkMessage);
    }
  }, [connectionState.myPlayerId]);

  // PLAYER: Send Answer
  const sendAnswer = useCallback((answer: string) => {
    if (playerConnectionRef.current && connectionState.myPlayerId) {
      playerConnectionRef.current.send({
        type: 'SUBMIT_ANSWER',
        playerId: connectionState.myPlayerId,
        answer
      } as NetworkMessage);
    }
  }, [connectionState.myPlayerId]);

  // PLAYER: Request host to open a clue
  const sendSelectClue = useCallback((categoryIdx: number, clueIdx: number) => {
    if (playerConnectionRef.current) {
      playerConnectionRef.current.send({
        type: 'SELECT_CLUE',
        categoryIdx,
        clueIdx
      } as NetworkMessage);
    }
  }, []);

  // PLAYER: Submit Daily Double wager to host
  const sendWager = useCallback((wager: number) => {
    if (playerConnectionRef.current && connectionState.myPlayerId) {
      playerConnectionRef.current.send({
        type: 'SUBMIT_WAGER',
        playerId: connectionState.myPlayerId,
        wager
      } as NetworkMessage);
    }
  }, [connectionState.myPlayerId]);

  return {
    connectionState,
    remoteState,
    hostRoom,
    joinRoom,
    broadcastState,
    sendBuzzIn,
    sendAnswer,
    sendSelectClue,
    sendWager,
    leaveRoom: cleanup
  };
}
