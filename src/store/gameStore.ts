
import { create } from 'zustand';
import { 
  GameState, 
  CardDefinition, 
  CardInstance, 
  Territory, 
  Player,
  MessageType,
  ServerToClientMessage,
  GamePhase,
  FactionType,
} from '../types/gameTypes';

interface GameStore {
  // Game state
  gameState: GameState | null;
  cardDefinitions: { [id: string]: CardDefinition };
  myClientId: string | null;
  selectedCardId: string | null;
  selectedTerritoryId: string | null;
  
  // Actions
  setGameState: (gameState: GameState) => void;
  setCardDefinitions: (cardDefinitions: CardDefinition[]) => void;
  selectCard: (instanceId: string | null) => void;
  selectTerritory: (territoryId: string | null) => void;
  handleGameMessage: (message: ServerToClientMessage) => void;
  
  // Getters - these are computed properties
  getCardDefinition: (definitionId: string) => CardDefinition | undefined;
  getMyPlayer: () => Player | undefined;
  isMyTurn: () => boolean;
  
  // Computed properties - we'll create these as functions to maintain TypeScript support
  currentPlayer: Player | undefined;
  isPlayerTurn: boolean;
  phase: GamePhase;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: null,
  cardDefinitions: {},
  myClientId: 'player-1', // Hardcoded for mock data
  selectedCardId: null,
  selectedTerritoryId: null,
  
  // Actions
  setGameState: (gameState: GameState) => {
    set({ gameState });
  },
  
  setCardDefinitions: (cardDefinitions: CardDefinition[]) => {
    const cardDefsMap: { [id: string]: CardDefinition } = {};
    cardDefinitions.forEach(def => {
      cardDefsMap[def.id] = def;
    });
    set({ cardDefinitions: cardDefsMap });
  },
  
  selectCard: (instanceId: string | null) => {
    set({ selectedCardId: instanceId });
  },
  
  selectTerritory: (territoryId: string | null) => {
    set({ selectedTerritoryId: territoryId });
  },
  
  // Getters
  getCardDefinition: (definitionId: string) => {
    return get().cardDefinitions[definitionId];
  },
  
  getMyPlayer: () => {
    const { gameState, myClientId } = get();
    if (!gameState || !myClientId) return undefined;
    return gameState.players.find(player => player.id === myClientId);
  },
  
  isMyTurn: () => {
    const { gameState, myClientId } = get();
    if (!gameState || !myClientId || gameState.phase !== GamePhase.TURN_BASED) return false;
    return gameState.currentPlayerId === myClientId;
  },
  
  // Computed properties using getters
  get currentPlayer() {
    return get().getMyPlayer();
  },
  
  get isPlayerTurn() {
    return get().isMyTurn();
  },
  
  get phase() {
    return get().gameState?.phase || GamePhase.WAITING;
  },
  
  // Message handlers
  handleGameMessage: (message: ServerToClientMessage) => {
    console.log('Handling game message:', message);
    
    switch (message.type) {
      case MessageType.CLIENT_ID_ASSIGNED:
        set({ myClientId: message.clientId });
        break;
        
      case MessageType.ALL_CARD_DEFINITIONS:
        // Ensure card definitions match the expected type
        const typedCardDefinitions: CardDefinition[] = message.cardDefinitions.map(card => ({
          ...card,
          faction: card.faction as FactionType, // Cast to the proper type
        }));
        
        set({ 
          cardDefinitions: typedCardDefinitions.reduce((acc, def) => {
            acc[def.id] = def;
            return acc;
          }, {} as Record<string, CardDefinition>)
        });
        break;
        
      case MessageType.CONNECTION_ACK:
        console.log('Connection acknowledged by server');
        break;
        
      case MessageType.GAME_STATE_INIT:
        if ('gameState' in message) {
          console.log('Game state initialized', message.gameState);
          set({ gameState: message.gameState });
        }
        break;
        
      case MessageType.PLAYER_HAND_UPDATE:
        if ('playerId' in message && 'hand' in message) {
          console.log('Player hand updated', message.playerId, message.hand);
          
          set(state => {
            if (!state.gameState) return state;
            
            const updatedPlayers = state.gameState.players.map(player => {
              if (player.id === message.playerId) {
                return {
                  ...player,
                  hand: message.hand
                };
              }
              return player;
            });
            
            return {
              ...state,
              gameState: {
                ...state.gameState,
                players: updatedPlayers
              }
            };
          });
        }
        break;
        
      case MessageType.TURN_CHANGE:
        if ('currentPlayerId' in message && 'turnNumber' in message) {
          console.log('Turn changed', message.currentPlayerId, message.turnNumber);
          
          set(state => {
            if (!state.gameState) return state;
            
            return {
              ...state,
              gameState: {
                ...state.gameState,
                currentPlayerId: message.currentPlayerId,
                turnNumber: message.turnNumber,
                phase: GamePhase.TURN_BASED
              }
            };
          });
        }
        break;
        
      case MessageType.PLAYER_RESOURCE_UPDATE:
        if ('playerId' in message && 'resources' in message) {
          console.log('Player resources updated', message.playerId, message.resources);
          
          set(state => {
            if (!state.gameState) return state;
            
            const updatedPlayers = state.gameState.players.map(player => {
              if (player.id === message.playerId) {
                return {
                  ...player,
                  resources: message.resources
                };
              }
              return player;
            });
            
            return {
              ...state,
              gameState: {
                ...state.gameState,
                players: updatedPlayers
              }
            };
          });
        }
        break;
        
      case MessageType.TERRITORY_UPDATE:
        if ('territory' in message) {
          console.log('Territory updated', message.territory);
          
          set(state => {
            if (!state.gameState) return state;
            
            const territory = message.territory;
            const updatedTerritories = state.gameState.territories.map(t => {
              if (t.id === territory.id) {
                return territory;
              }
              return t;
            });
            
            return {
              ...state,
              gameState: {
                ...state.gameState,
                territories: updatedTerritories
              }
            };
          });
        }
        break;
        
      case MessageType.PLAYER_DISCARD_UPDATE:
        if ('playerId' in message && 'discard' in message) {
          console.log('Player discard updated', message.playerId, message.discard);
          
          set(state => {
            if (!state.gameState) return state;
            
            const updatedPlayers = state.gameState.players.map(player => {
              if (player.id === message.playerId) {
                return {
                  ...player,
                  discard: message.discard
                };
              }
              return player;
            });
            
            return {
              ...state,
              gameState: {
                ...state.gameState,
                players: updatedPlayers
              }
            };
          });
        }
        break;
        
      default:
        console.warn(`Unhandled message type: ${message.type}`);
    }
  }
}));
