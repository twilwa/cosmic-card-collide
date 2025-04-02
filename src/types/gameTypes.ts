
// Game Types - Shared between client and server

// Factions
export enum FactionType {
  CORPORATION = 'CORPORATION',
  RUNNER = 'RUNNER',
}

// Player status
export enum PlayerStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  WAITING = 'WAITING',
}

// Game phases
export enum GamePhase {
  WAITING = 'WAITING',
  PRE_GAME = 'PRE_GAME',
  TURN_BASED = 'TURN_BASED',
  GAME_OVER = 'GAME_OVER',
}

// Card interfaces
export interface CardEffect {
  type: 'DRAW_CARD' | 'GAIN_RESOURCES' | 'ADD_INFLUENCE';
  value: number;
  targetRequired?: boolean;
}

export interface CardDefinition {
  id: string;
  name: string;
  cost: number;
  type: 'ICE' | 'PROGRAM' | 'HARDWARE' | 'RESOURCE' | 'OPERATION' | 'EVENT';
  faction: FactionType;
  description: string;
  effects: CardEffect[];
}

export interface CardInstance {
  instanceId: string;
  definitionId: string;
}

// Player state
export interface PlayerState {
  id: string;
  status: PlayerStatus;
  faction: FactionType;
  resources: {
    credits: number;
    dataTokens: number;
  };
  deck: CardInstance[];
  hand: CardInstance[];
  discard: CardInstance[];
}

// Territory
export interface Territory {
  id: string;
  name: string;
  controlledBy: string | null; // Player ID or null
  influence: {
    [playerId: string]: number;
  };
  connections: string[]; // IDs of connected territories
  position: {
    x: number;
    y: number;
  };
}

// Game state
export interface GameState {
  gameId: string;
  phase: GamePhase;
  players: PlayerState[];
  territories: Territory[];
  turnNumber: number;
  currentPlayerId: string | null;
}

// WebSocket message types
export enum MessageType {
  // Connection messages
  CONNECTION_ACK = 'CONNECTION_ACK',
  CLIENT_ERROR = 'CLIENT_ERROR',
  
  // Game state messages
  GAME_STATE_INIT = 'GAME_STATE_INIT',
  ALL_CARD_DEFINITIONS = 'ALL_CARD_DEFINITIONS',
  
  // Player actions
  END_TURN = 'END_TURN',
  PLAY_CARD = 'PLAY_CARD',
  SELECT_TERRITORY = 'SELECT_TERRITORY',
  
  // Game updates
  TURN_CHANGE = 'TURN_CHANGE',
  PLAYER_RESOURCE_UPDATE = 'PLAYER_RESOURCE_UPDATE',
  PLAYER_HAND_UPDATE = 'PLAYER_HAND_UPDATE',
  PLAYER_DECK_UPDATE = 'PLAYER_DECK_UPDATE',
  PLAYER_DISCARD_UPDATE = 'PLAYER_DISCARD_UPDATE',
  TERRITORY_UPDATE = 'TERRITORY_UPDATE',
}

// Base message interface
export interface BaseMessage {
  type: MessageType;
  timestamp: number;
}

// Client to server message
export interface ClientToServerMessage extends BaseMessage {
  clientId?: string;
}

// Server to client message
export interface ServerToClientMessage extends BaseMessage {
  success?: boolean;
  error?: string;
}

// Specific message types will be defined as extensions of these base interfaces
