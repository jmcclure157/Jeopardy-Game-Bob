import { Player, RoundType, Category, Clue } from './game';

export type NetworkMessage =
  | { type: 'JOIN_ROOM'; playerName: string }
  | { type: 'PLAYER_ACCEPTED'; playerId: string; players: Player[]; roomCode: string }
  | {
      type: 'STATE_SYNC';
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
    }
  | { type: 'BUZZ_IN'; playerId: string; timestamp: number }
  | { type: 'SUBMIT_ANSWER'; playerId: string; answer: string }
  | { type: 'SUBMIT_WAGER'; playerId: string; wager: number }
  | { type: 'SELECT_CLUE'; categoryIdx: number; clueIdx: number };

export interface PeerConnectionState {
  isHost: boolean;
  isPlayer: boolean;
  roomCode: string | null;
  myPlayerId: string | null;
  connectedCount: number;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  errorMessage?: string;
}
