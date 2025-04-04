
export interface BaseMessage {
  type: string;
}

export interface ClientIdAssignedMessage extends BaseMessage {
  type: 'CLIENT_ID_ASSIGNED';
  clientId: string;
}

export interface AllCardDefinitionsMessage extends BaseMessage {
  type: 'ALL_CARD_DEFINITIONS';
  cardDefinitions: CardDefinition[];
}

export interface GameStateInitMessage extends BaseMessage {
  type: 'GAME_STATE_INIT';
  gameState: GameState;
}

export interface PlayerHandUpdateMessage extends BaseMessage {
  type: 'PLAYER_HAND_UPDATE';
  playerId: string;
  hand: CardInstance[];
}

export interface PlayerDeckUpdateMessage extends BaseMessage {
  type: 'PLAYER_DECK_UPDATE';
  playerId: string;
  deckSize: number;
}

export interface PlayerDiscardUpdateMessage extends BaseMessage {
  type: 'PLAYER_DISCARD_UPDATE';
  playerId: string;
  discard: CardInstance[];
}

export interface PlayerResourceUpdateMessage extends BaseMessage {
  type: 'PLAYER_RESOURCE_UPDATE';
  playerId: string;
  resources: {
    credits: number;
    dataTokens: number;
  };
}

export interface TerritoryUpdateMessage extends BaseMessage {
  type: 'TERRITORY_UPDATE';
  territory: Territory;
}

export interface TurnChangeMessage extends BaseMessage {
  type: 'TURN_CHANGE';
  currentPlayerId: string;
  turnNumber: number;
}

export interface ConnectionAckMessage extends BaseMessage {
  type: 'CONNECTION_ACK';
}

export type ServerToClientMessage =
  | ClientIdAssignedMessage
  | AllCardDefinitionsMessage
  | GameStateInitMessage
  | PlayerHandUpdateMessage
  | PlayerDeckUpdateMessage
  | PlayerDiscardUpdateMessage
  | PlayerResourceUpdateMessage
  | TerritoryUpdateMessage
  | TurnChangeMessage
  | ConnectionAckMessage;

export enum GamePhase {
  SETUP = 'SETUP',
  OVERWORLD = 'OVERWORLD',
  SCENARIO = 'SCENARIO',
  END = 'END',
  WAITING = 'WAITING',
  TURN_BASED = 'TURN_BASED'
}

export type FactionType = "CORPORATION" | "RUNNER";

export interface PlayerData {
  id: string;
  username: string | null;
  faction: FactionType | null;
  avatar_url: string | null;
  resources: {
    credits: number;
    dataTokens: number;
  };
}

export interface GameState {
  phase: GamePhase;
  turnNumber: number;
  currentPlayerId: string;
  playerStates: PlayerState[];
  territories: Territory[];
  playerHand: string[]; // Card instance IDs
  activeScenario?: ScenarioState;
}

export interface PlayerState {
  clientId: string;
  faction: FactionType | null;
  displayName: string;
  resources: {
    credits: number;
    dataTokens: number;
  };
  zones: {
    hand: CardInstance[];
    deck: CardInstance[];
    discardPile: CardInstance[];
    inPlay: CardInstance[];
  };
  status: 'connected' | 'disconnected';
}

export interface ScenarioState {
  scenarioType: string;
  progress: number;
  zones: {
    grid: GridCell[][];
  };
}

export interface GridCell {
  x: number;
  y: number;
  terrain: string;
  occupant?: Entity;
}

export interface Entity {
  entityType: string;
  health: number;
  attack: number;
}

export interface CardInstance {
  instanceId: string;
  cardDefinitionId: string;
}

export interface CardDefinition {
  id: string;
  name: string;
  cost: number;
  type: string;
  faction: FactionType;
  description: string;
  flavorText?: string;
  effectDefinition?: CardEffect[];
}

export interface CardEffect {
  effectType: string;
  effectValue: number;
  targetType?: string;
  amount?: number;
  resource?: string;
  count?: number;
  strength?: number;
  value?: number;
}

export interface Territory {
  id: string;
  name: string;
  owner?: string;
  controlledBy?: string;
  x?: number;
  y?: number;
  position?: { x: number, y: number };
  connections?: string[];
}

export enum MessageType {
  CLIENT_ID_ASSIGNED = 'CLIENT_ID_ASSIGNED',
  ALL_CARD_DEFINITIONS = 'ALL_CARD_DEFINITIONS',
  GAME_STATE_INIT = 'GAME_STATE_INIT',
  END_TURN = 'END_TURN',
  PLAYER_HAND_UPDATE = 'PLAYER_HAND_UPDATE',
  PLAYER_DECK_UPDATE = 'PLAYER_DECK_UPDATE',
  PLAYER_DISCARD_UPDATE = 'PLAYER_DISCARD_UPDATE',
  PLAYER_RESOURCE_UPDATE = 'PLAYER_RESOURCE_UPDATE',
  TURN_CHANGE = 'TURN_CHANGE',
  PLAY_CARD = 'PLAY_CARD',
  TERRITORY_UPDATE = 'TERRITORY_UPDATE',
  CONNECTION_ACK = 'CONNECTION_ACK'
}

export interface PlayCardMessage extends BaseMessage {
  type: MessageType.PLAY_CARD;
  cardInstanceId: string;
  targetId?: string; // Optional targeting information
}

export type ClientToServerMessage =
  | { type: 'END_TURN' }
  | PlayCardMessage;
