
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
  FactionType
} from '../types/gameTypes';

interface GameStore {
  // Game state
  gameState: GameState | null;
  cardDefinitions: { [id: string]: CardDefinition };
  myClientId: string | null;
  selectedCardId: string | null;
  selectedTerritoryId: string | null;
  
  // Getters
  getCardDefinition: (definitionId: string) => CardDefinition | undefined;
  getMyPlayer: () => PlayerState | undefined;
  isMyTurn: () => boolean;
  
  // Game actions
  selectCard: (instanceId: string | null) => void;
  selectTerritory: (territoryId: string | null) => void;
  
  // Message handlers
  handleGameMessage: (message: ServerToClientMessage) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: null,
  cardDefinitions: {},
  myClientId: 'player-1', // Hardcoded for mock data
  selectedCardId: null,
  selectedTerritoryId: null,
  
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
  
  // Actions
  selectCard: (instanceId: string | null) => {
    set({ selectedCardId: instanceId });
  },
  
  selectTerritory: (territoryId: string | null) => {
    set({ selectedTerritoryId: territoryId });
  },
  
  // Message handlers
  handleGameMessage: (message: ServerToClientMessage) => {
    switch (message.type) {
      case MessageType.CONNECTION_ACK:
        console.log('Connection acknowledged by server');
        break;
        
      case MessageType.GAME_STATE_INIT:
        if ('gameState' in message) {
          console.log('Game state initialized', message.gameState);
          set({ gameState: message.gameState as unknown as GameState });
        }
        break;
        
      case MessageType.ALL_CARD_DEFINITIONS:
        if ('cardDefinitions' in message) {
          console.log('Received card definitions', message.cardDefinitions);
          const cardDefsMap: { [id: string]: CardDefinition } = {};
          const cardDefs = message.cardDefinitions as CardDefinition[];
          
          cardDefs.forEach(def => {
            cardDefsMap[def.id] = def;
          });
          
          set({ cardDefinitions: cardDefsMap });
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
                  hand: message.hand as CardInstance[]
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
                currentPlayerId: message.currentPlayerId as string,
                turnNumber: message.turnNumber as number,
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
                  resources: message.resources as PlayerState['resources']
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
            
            const territory = message.territory as Territory;
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
        
      default:
        console.log('Unhandled message type:', message.type);
    }
  }
}));
