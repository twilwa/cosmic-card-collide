
export interface CardDefinition {
  id: string;
  name: string;
  cost: number;
  type: string;
  faction: 'CORPORATION' | 'RUNNER';
  description: string;
  effects: any[];
}

export interface CardInstance {
  instanceId: string;
  definitionId: string;
}

export interface Player {
  id: string;
  name: string;
  faction: 'CORPORATION' | 'RUNNER';
  resources: {
    credits: number;
    dataTokens: number;
  };
  hand: CardInstance[];
  discard: CardInstance[];
  status?: string;
  deck?: CardInstance[];
}

// Alias PlayerState to Player for compatibility
export type PlayerState = Player;

export interface Territory {
  id: string;
  name: string;
  type: string;
  influence: {
    [playerId: string]: number;
  };
  controlledBy: string | null;
  connections: string[];
  position: {
    x: number;
    y: number;
  };
}

export interface GameState {
  gameId?: string;
  players: Player[];
  territories: Territory[];
  turnNumber: number;
  currentPlayerId: string | null;
  phase: GamePhase;
}

export enum GamePhase {
  WAITING = 'WAITING',
  TURN_BASED = 'TURN_BASED',
  GAME_OVER = 'GAME_OVER'
}

export enum FactionType {
  CORPORATION = 'CORPORATION',
  RUNNER = 'RUNNER'
}

export enum MessageType {
  CONNECTION_ACK = 'CONNECTION_ACK',
  ERROR = 'ERROR',
  TURN_CHANGE = 'TURN_CHANGE',
  PLAYER_HAND_UPDATE = 'PLAYER_HAND_UPDATE',
  PLAYER_DISCARD_UPDATE = 'PLAYER_DISCARD_UPDATE',
  TERRITORY_UPDATE = 'TERRITORY_UPDATE',
  PLAY_CARD = 'PLAY_CARD',
  END_TURN = 'END_TURN',
  // Add the missing message types
  GAME_STATE_INIT = 'GAME_STATE_INIT',
  ALL_CARD_DEFINITIONS = 'ALL_CARD_DEFINITIONS',
  PLAYER_RESOURCE_UPDATE = 'PLAYER_RESOURCE_UPDATE'
}

export interface BaseMessage {
  type: MessageType;
  timestamp: number;
  success?: boolean;
}

export interface TurnChangeMessage extends BaseMessage {
  type: MessageType.TURN_CHANGE;
  currentPlayerId: string;
  turnNumber: number;
}

export interface PlayerHandUpdateMessage extends BaseMessage {
  type: MessageType.PLAYER_HAND_UPDATE;
  playerId: string;
  hand: CardInstance[];
}

export interface PlayerDiscardUpdateMessage extends BaseMessage {
  type: MessageType.PLAYER_DISCARD_UPDATE;
  playerId: string;
  discard: CardInstance[];
}

export interface TerritoryUpdateMessage extends BaseMessage {
  type: MessageType.TERRITORY_UPDATE;
  territory: Territory;
}

export interface PlayCardMessage extends BaseMessage {
  type: MessageType.PLAY_CARD;
  cardInstanceId: string;
  targetId?: string;
}

export interface EndTurnMessage extends BaseMessage {
  type: MessageType.END_TURN;
}

export interface GameStateInitMessage extends BaseMessage {
  type: MessageType.GAME_STATE_INIT;
  gameState: GameState;
}

export interface AllCardDefinitionsMessage extends BaseMessage {
  type: MessageType.ALL_CARD_DEFINITIONS;
  cardDefinitions: CardDefinition[];
}

export interface PlayerResourceUpdateMessage extends BaseMessage {
  type: MessageType.PLAYER_RESOURCE_UPDATE;
  playerId: string;
  resources: Player['resources'];
}

// Union type for all client-to-server messages
export type ClientToServerMessage = PlayCardMessage | EndTurnMessage | BaseMessage;

// Union type for all server-to-client messages
export type ServerToClientMessage = 
  | TurnChangeMessage 
  | PlayerHandUpdateMessage 
  | PlayerDiscardUpdateMessage 
  | TerritoryUpdateMessage 
  | GameStateInitMessage 
  | AllCardDefinitionsMessage
  | PlayerResourceUpdateMessage
  | BaseMessage;
