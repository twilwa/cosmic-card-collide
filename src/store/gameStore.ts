
import { create } from 'zustand';
import { 
  GameState, 
  CardDefinition, 
  CardInstance, 
  Territory, 
  PlayerState,
  MessageType,
  ServerToClientMessage,
  GamePhase,
  PlayerData,
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
  getMyPlayer: () => PlayerData | undefined;
  isMyTurn: () => boolean;
  
  // Derived state - these are calculated properties
  currentPlayer: string | undefined;
  isPlayerTurn: boolean;
  phase: GamePhase;
  territories: Territory[];
  myHand: string[];
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
    
    const playerState = gameState.playerStates.find(player => player.clientId === myClientId);
    if (!playerState) return undefined;
    
    return {
      id: playerState.clientId,
      username: playerState.displayName,
      faction: playerState.faction,
      avatar_url: '', // Default value
      resources: playerState.resources
    };
  },
  
  isMyTurn: () => {
    const { gameState, myClientId } = get();
    if (!gameState || !myClientId || gameState.phase !== GamePhase.TURN_BASED) return false;
    return gameState.currentPlayerId === myClientId;
  },
  
  // Computed properties
  get currentPlayer() {
    const player = get().getMyPlayer();
    return player?.username;
  },
  
  get isPlayerTurn() {
    return get().isMyTurn();
  },
  
  get phase() {
    return get().gameState?.phase || GamePhase.WAITING;
  },
  
  get territories() {
    return get().gameState?.territories || [];
  },
  
  get myHand() {
    return get().gameState?.playerHand || [];
  },
  
  // Message handlers
  handleGameMessage: (message: ServerToClientMessage) => {
    console.log('Handling game message:', message);
    
    switch (message.type) {
      case MessageType.CLIENT_ID_ASSIGNED:
        set({ myClientId: message.clientId });
        break;
        
      case MessageType.ALL_CARD_DEFINITIONS:
        set(state => ({ 
          cardDefinitions: message.cardDefinitions.reduce((acc, def) => {
            acc[def.id] = def;
            return acc;
          }, {} as Record<string, CardDefinition>)
        }));
        break;
        
      case MessageType.GAME_STATE_INIT:
        set({ gameState: message.gameState });
        break;
        
      case MessageType.PLAYER_HAND_UPDATE:
        set(state => {
          if (!state.gameState) return state;
          
          const updatedPlayerStates = state.gameState.playerStates.map(player => {
            if (player.clientId === message.clientId) {
              return {
                ...player,
                zones: {
                  ...player.zones,
                  hand: message.hand
                }
              };
            }
            return player;
          });
          
          return {
            ...state,
            gameState: {
              ...state.gameState,
              playerStates: updatedPlayerStates
            }
          };
        });
        break;
        
      case MessageType.TURN_CHANGE:
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
        break;
        
      case MessageType.PLAYER_RESOURCE_UPDATE:
        set(state => {
          if (!state.gameState) return state;
          
          const updatedPlayerStates = state.gameState.playerStates.map(player => {
            if (player.clientId === message.clientId) {
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
              playerStates: updatedPlayerStates
            }
          };
        });
        break;
        
      case MessageType.TERRITORY_UPDATE:
        set(state => {
          if (!state.gameState) return state;
          
          return {
            ...state,
            gameState: {
              ...state.gameState,
              territories: message.territories
            }
          };
        });
        break;
        
      case MessageType.PLAYER_DISCARD_UPDATE:
        set(state => {
          if (!state.gameState) return state;
          
          const updatedPlayerStates = state.gameState.playerStates.map(player => {
            if (player.clientId === message.clientId) {
              return {
                ...player,
                zones: {
                  ...player.zones,
                  discardPile: message.discardPile
                }
              };
            }
            return player;
          });
          
          return {
            ...state,
            gameState: {
              ...state.gameState,
              playerStates: updatedPlayerStates
            }
          };
        });
        break;
        
      case MessageType.PLAYER_DECK_UPDATE:
        set(state => {
          if (!state.gameState) return state;
          
          // Only updating the deckSize, not the actual deck content for security
          const updatedPlayerStates = state.gameState.playerStates.map(player => {
            if (player.clientId === message.clientId) {
              // Create a deck of the right size with undefined contents
              const dummyDeck: CardInstance[] = Array(message.deckSize).fill(null);
              
              return {
                ...player,
                zones: {
                  ...player.zones,
                  deck: dummyDeck
                }
              };
            }
            return player;
          });
          
          return {
            ...state,
            gameState: {
              ...state.gameState,
              playerStates: updatedPlayerStates
            }
          };
        });
        break;
        
      default:
        console.warn(`Unhandled message type: ${message.type}`);
    }
  }
}));
