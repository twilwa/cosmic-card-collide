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
}

export interface Territory {
  id: string;
  name: string;
  type: string;
  influence: {
    [playerId: string]: number;
  };
  controlledBy: string | null;
}

export interface GameState {
  players: Player[];
  territories: Territory[];
  turnNumber: number;
  currentPlayerId: string;
  phase: string;
}

export enum MessageType {
  CONNECTION_ACK = 'CONNECTION_ACK',
  ERROR = 'ERROR',
  TURN_CHANGE = 'TURN_CHANGE',
  PLAYER_HAND_UPDATE = 'PLAYER_HAND_UPDATE',
  PLAYER_DISCARD_UPDATE = 'PLAYER_DISCARD_UPDATE',
  TERRITORY_UPDATE = 'TERRITORY_UPDATE',
  PLAY_CARD = 'PLAY_CARD',
  END_TURN = 'END_TURN'
}

export interface BaseMessage {
  type: MessageType;
  timestamp: number;
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

// Union type for all client-to-server messages
export type ClientToServerMessage = PlayCardMessage | EndTurnMessage | BaseMessage;

// Union type for all server-to-client messages
export type ServerToClientMessage = TurnChangeMessage | PlayerHandUpdateMessage | PlayerDiscardUpdateMessage | TerritoryUpdateMessage | BaseMessage;
