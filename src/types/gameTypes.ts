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
  clientId: string;
  hand: CardInstance[];
}

export interface PlayerDeckUpdateMessage extends BaseMessage {
  type: 'PLAYER_DECK_UPDATE';
  clientId: string;
  deckSize: number;
}

export interface PlayerDiscardUpdateMessage extends BaseMessage {
  type: 'PLAYER_DISCARD_UPDATE';
  clientId: string;
  discardPile: CardInstance[];
}

export interface PlayerResourceUpdateMessage extends BaseMessage {
  type: 'PLAYER_RESOURCE_UPDATE';
  clientId: string;
  resources: {
    credits: number;
    dataTokens: number;
  };
}

export interface TurnChangeMessage extends BaseMessage {
  type: 'TURN_CHANGE';
  currentPlayerId: string;
  turnNumber: number;
}

export type Message =
  | ClientIdAssignedMessage
  | AllCardDefinitionsMessage
  | GameStateInitMessage
  | PlayerHandUpdateMessage
  | PlayerDeckUpdateMessage
  | PlayerDiscardUpdateMessage
  | PlayerResourceUpdateMessage
  | TurnChangeMessage;

export enum GamePhase {
  SETUP = 'SETUP',
  OVERWORLD = 'OVERWORLD',
  SCENARIO = 'SCENARIO',
  END = 'END',
}

export type FactionType = "CORPORATION" | "RUNNER";

export interface GameState {
  phase: GamePhase;
  turnNumber: number;
  currentPlayerId: string;
  playerStates: PlayerState[];
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
  effectDefinition?: CardEffect[];
}

export interface CardEffect {
  effectType: string;
  effectValue: number;
  targetType?: string;
}

export interface Territory {
  id: string;
  name: string;
  owner?: string;
  x?: number;
  y?: number;
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
}

export interface PlayCardMessage extends BaseMessage {
  type: MessageType.PLAY_CARD;
  cardInstanceId: string;
  targetId?: string; // Optional targeting information
}

export type ClientToServerMessage =
  | { type: 'END_TURN' }
  | PlayCardMessage;
