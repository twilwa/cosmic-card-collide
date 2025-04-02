// src/types/gameTypes.ts

// --- Enums (Keep Existing) ---
export enum FactionType {
	CORPORATION = 'CORPORATION',
	RUNNER = 'RUNNER',
}

export enum PlayerStatus {
	CONNECTED = 'CONNECTED',
	DISCONNECTED = 'DISCONNECTED',
	WAITING = 'WAITING', // Use WAITING phase instead?
}

export enum GamePhase {
	WAITING = 'WAITING',
	PRE_GAME = 'PRE_GAME', // Phase for setup before turns?
	TURN_BASED = 'TURN_BASED', // Main gameplay loop (Overworld or Scenario?)
	SCENARIO_ACTIVE = 'SCENARIO_ACTIVE', // Distinct phase for scenario
	GAME_OVER = 'GAME_OVER',
}

// --- Refined Card Structures ---

export type CardFaction = FactionType | 'NEUTRAL';

export type CardType = 'OVERWORLD' | 'SCENARIO'; // Added Overworld type

export type CardSubType =
	| 'OPERATION' | 'ASSET' | 'UPGRADE' | 'AGENDA' | 'ICE' // Corp
	| 'PROGRAM' | 'HARDWARE' | 'RESOURCE' | 'EVENT'; // Runner

export type CardTargetType = 'TERRITORY' | 'ENTITY' | 'PLAYER' | 'CARD_IN_PLAY' | null;

// --- Effect Definitions (Discriminated Union) ---
interface EffectBase {
	effect: string; // Discriminator
}

export interface EffectAddInfluence extends EffectBase {
	effect: 'ADD_INFLUENCE';
	value: number;
	targetRequired: true; // Explicitly state target need
	targetType: 'TERRITORY';
}

export interface EffectDrawCard extends EffectBase {
	effect: 'DRAW_CARD';
	count: number;
}

export interface EffectGainResources extends EffectBase {
	effect: 'GAIN_RESOURCES';
	resource: 'credits' | 'dataTokens'; // Add other resources here
	amount: number;
}

export interface EffectDealDamage extends EffectBase {
	effect: 'DEAL_DAMAGE';
	amount: number;
	targetRequired: true;
	targetType: 'ENTITY';
}

export interface EffectIncreaseSecurity extends EffectBase {
	effect: 'INCREASE_SECURITY';
	value: number;
	targetRequired: true;
	targetType: 'TERRITORY';
}

export interface EffectBreakIce extends EffectBase {
	effect: 'BREAK_ICE';
	strength: number; // Example property
	targetRequired: true;
	targetType: 'ENTITY'; // Target is ICE entity
}

// ... Add interfaces for all other specific effects listed in your mock data or plan ...
// Example: VIRUS_COUNTERS, MEMORY_UNITS, AVOID_TAGS, ACCESS_CARDS, INCREASE_MAX_HAND, RECURRING_CREDITS

// Union of all possible effect types
export type CardEffect =
	| EffectAddInfluence
	| EffectDrawCard
	| EffectGainResources
	| EffectDealDamage
	| EffectIncreaseSecurity
	| EffectBreakIce;
// | EffectVirusCounters // etc.


// --- Main Card Definition (Updated) ---
export interface CardDefinition {
	id: string; // Unique card identifier (e.g., "CORP_001")
	name: string;
	type: CardType; // Use 'OVERWORLD' or 'SCENARIO'
	subType: CardSubType;
	faction: CardFaction; // Use CardFaction type
	cost: number;
	targetType?: CardTargetType; // Optional target type
	effectDefinition: CardEffect | CardEffect[]; // Use Discriminated Union
	description?: string; // Gameplay text (can be auto-generated or manual)
	flavorText?: string; // Thematic text
	artUrl?: string; // Path or URL
}

// --- Card Instance (No change needed) ---
export interface CardInstance {
	instanceId: string; // Unique ID for this specific card instance in a game
	definitionId: string; // Links to CardDefinition.id
}

// --- Player State (Updated) ---
export interface PlayerState {
	id: string; // Corresponds to clientId / Supabase auth ID
	status: PlayerStatus; // Use PlayerStatus enum
	displayName?: string; // From Supabase Profile
	faction: FactionType | null; // Assigned on game start
	resources: {
		credits: number;
		dataTokens?: number; // Optional based on your design
	};
	deck: CardInstance[];
	hand: CardInstance[];
	discard: CardInstance[];
	// Potentially add max hand size, action points etc. here later
}

// --- Territory (Updated) ---
export interface Territory {
	id: string;
	name: string;
	type: 'CORPORATE_HQ' | 'DATA_CENTER' | 'FRINGE_NODE' | 'SAFE_HOUSE'; // Example specific types
	controlledBy: string | null; // Player ID or null
	influence: {
		[playerId: string]: number; // Track influence per player
	};
	// Add properties from spec (security_level, resource_value etc.)
	securityLevel?: number;
	resourceValue?: number;
	corporateInfluence?: number; // Example specific influence
	connections: string[]; // IDs of connected territories
	position: { // Keep for rendering
		x: number;
		y: number;
	};
}

// --- Scenario State (Placeholder - Add detail later) ---
export interface ScenarioState {
	scenarioId: string;
	type: string; // e.g., 'DATA_HEIST'
	status: 'ACTIVE' | 'RESOLVED';
	objective?: string;
	// Add grid, entities, turn etc. based on later prompts
	[key: string]: any; // Allow flexibility for now
}

// --- Game State (Updated) ---
export interface GameState {
	gameId: string;
	phase: GamePhase;
	players: PlayerState[]; // Use PlayerState[]
	territories: Territory[];
	turnNumber: number;
	currentPlayerId: string | null;
	currentScenario: ScenarioState | null; // Add scenario state holder
	// Add other global state: market cards, event deck, etc.
}


// --- WebSocket Message Types (Keep Existing Enum, Update Payloads) ---
export enum MessageType {
	// Connection
	CONNECTION_ACK = 'CONNECTION_ACK', // Client -> Server ? Maybe CLIENT_HELLO instead?
	CLIENT_ID_ASSIGNED = 'CLIENT_ID_ASSIGNED', // Server -> Client
	CLIENT_ERROR = 'CLIENT_ERROR', // Client -> Server (e.g., parse error) - Less common
	SERVER_ERROR = 'SERVER_ERROR', // Server -> Client (e.g., validation failed)

	// Game Setup / Static Data
	GAME_STATE_INIT = 'GAME_STATE_INIT', // Server -> Client (Specific client)
	ALL_CARD_DEFINITIONS = 'ALL_CARD_DEFINITIONS', // Server -> Client

	// Player Actions (Client -> Server)
	END_TURN = 'END_TURN',
	PLAY_CARD = 'PLAY_CARD',
	START_SCENARIO = 'START_SCENARIO',
	SCENARIO_ACTION = 'SCENARIO_ACTION',
	SELECT_TERRITORY = 'SELECT_TERRITORY', // Still useful for Overworld view info?

	// Game State Updates (Server -> Client - Broadcast usually)
	PHASE_CHANGE = 'PHASE_CHANGE',
	TURN_CHANGE = 'TURN_CHANGE',
	PLAYER_JOINED = 'PLAYER_JOINED',
	PLAYER_LEFT = 'PLAYER_LEFT',
	PLAYER_RESOURCE_UPDATE = 'PLAYER_RESOURCE_UPDATE',
	PLAYER_HAND_UPDATE = 'PLAYER_HAND_UPDATE',
	PLAYER_DECK_UPDATE = 'PLAYER_DECK_UPDATE', // Send count or full deck? Count is better.
	PLAYER_DISCARD_UPDATE = 'PLAYER_DISCARD_UPDATE',
	TERRITORY_UPDATE = 'TERRITORY_UPDATE',
	SCENARIO_ENTITY_UPDATE = 'SCENARIO_ENTITY_UPDATE', // Later
	SCENARIO_ENTITY_REMOVE = 'SCENARIO_ENTITY_REMOVE', // Later
	SCENARIO_TURN_CHANGE = 'SCENARIO_TURN_CHANGE', // Later
}

// --- Base Message Interfaces ---
export interface BaseMessage {
	type: MessageType | string; // Allow string for potential extension but prefer enum
	timestamp?: number; // Optional on base, required where needed? Let's make it optional.
}

export interface ClientToServerMessage<T = any> extends BaseMessage {
	payload: T;
	// clientId can be inferred by server from connection
}

export interface ServerToClientMessage<T = any> extends BaseMessage {
	payload: T;
	success?: boolean; // Optional success indicator for responses
	error?: string; // Optional error message
}

// --- Specific Message Payloads & Interfaces ---

// -- Server -> Client --
export interface ClientIdAssignedPayload { clientId: string; }
export interface ClientIdAssignedMessage extends ServerToClientMessage<ClientIdAssignedPayload> { type: MessageType.CLIENT_ID_ASSIGNED; }

export interface AllCardDefinitionsPayload { definitions: CardDefinition[]; }
export interface AllCardDefinitionsMessage extends ServerToClientMessage<AllCardDefinitionsPayload> { type: MessageType.ALL_CARD_DEFINITIONS; }

// Rehydrate GameState.players Map on client if server sends array
export type GameStateInitPayload = Omit<GameState, 'players' | 'territories'> & { players: PlayerState[]; territories: Territory[] };
export interface GameStateInitMessage extends ServerToClientMessage<GameStateInitPayload> { type: MessageType.GAME_STATE_INIT; }

export interface PlayerJoinedPayload { player: PlayerState; }
export interface PlayerJoinedMessage extends ServerToClientMessage<PlayerJoinedPayload> { type: MessageType.PLAYER_JOINED; }

export interface PlayerLeftPayload { playerId: string; }
export interface PlayerLeftMessage extends ServerToClientMessage<PlayerLeftPayload> { type: MessageType.PLAYER_LEFT; }

export interface PhaseChangePayload { newPhase: GamePhase; scenarioState?: ScenarioState | null; }
export interface PhaseChangeMessage extends ServerToClientMessage<PhaseChangePayload> { type: MessageType.PHASE_CHANGE; }

export interface TurnChangePayload { currentPlayerId: string | null; turnNumber: number; }
export interface TurnChangeMessage extends ServerToClientMessage<TurnChangePayload> { type: MessageType.TURN_CHANGE; }

export interface PlayerResourceUpdatePayload { playerId: string; resources: PlayerState['resources']; }
export interface PlayerResourceUpdateMessage extends ServerToClientMessage<PlayerResourceUpdatePayload> { type: MessageType.PLAYER_RESOURCE_UPDATE; }

export interface PlayerHandUpdatePayload { playerId: string; hand: CardInstance[]; }
export interface PlayerHandUpdateMessage extends ServerToClientMessage<PlayerHandUpdatePayload> { type: MessageType.PLAYER_HAND_UPDATE; }

export interface PlayerDeckUpdatePayload { playerId: string; deckCount: number; } // Send count only
export interface PlayerDeckUpdateMessage extends ServerToClientMessage<PlayerDeckUpdatePayload> { type: MessageType.PLAYER_DECK_UPDATE; }

export interface PlayerDiscardUpdatePayload { playerId: string; discard?: CardInstance[]; discardCount?: number } // Send count or array? Count might be enough
export interface PlayerDiscardUpdateMessage extends ServerToClientMessage<PlayerDiscardUpdatePayload> { type: MessageType.PLAYER_DISCARD_UPDATE; }

export interface TerritoryUpdatePayload { territory: Territory; } // Send the whole updated territory
export interface TerritoryUpdateMessage extends ServerToClientMessage<TerritoryUpdatePayload> { type: MessageType.TERRITORY_UPDATE; }

export interface ServerErrorPayload { message: string; originalActionType?: string; }
export interface ServerErrorMessage extends ServerToClientMessage<ServerErrorPayload> { type: MessageType.SERVER_ERROR; success: false; } // Explicitly success=false

// -- Client -> Server --
export interface EndTurnPayload { }
export interface EndTurnMessage extends ClientToServerMessage<EndTurnPayload> { type: MessageType.END_TURN; }

export interface PlayCardPayload { cardInstanceId: string; targetId?: string; }
export interface PlayCardMessage extends ClientToServerMessage<PlayCardPayload> { type: MessageType.PLAY_CARD; }

export interface StartScenarioPayload { territoryId: string; }
export interface StartScenarioMessage extends ClientToServerMessage<StartScenarioPayload> { type: MessageType.START_SCENARIO; }

// Define specific scenario action payloads as needed
export interface ScenarioActionMovePayload { entityId: string; targetX: number; targetY: number; }
export interface ScenarioActionAttackPayload { attackerEntityId: string; targetEntityId: string; }
export type ScenarioActionDetails = ScenarioActionMovePayload | ScenarioActionAttackPayload | any; // Add other actions

export interface ScenarioActionPayload { actionType: string; details: ScenarioActionDetails; }
export interface ScenarioActionMessage extends ClientToServerMessage<ScenarioActionPayload> { type: MessageType.SCENARIO_ACTION; }

// Maybe not needed if selection doesn't trigger server action directly?
export interface SelectTerritoryPayload { territoryId: string; }
export interface SelectTerritoryMessage extends ClientToServerMessage<SelectTerritoryPayload> { type: MessageType.SELECT_TERRITORY; }

// --- Union Types for Handlers (Example) ---
// export type AnyClientToServerMessage = EndTurnMessage | PlayCardMessage | StartScenarioMessage | ScenarioActionMessage | SelectTerritoryMessage | ClientToServerMessage<{}>;
// export type AnyServerToClientMessage = GameStateInitMessage | AllCardDefinitionsMessage | /* ... other messages ... */ | ServerErrorMessage;
