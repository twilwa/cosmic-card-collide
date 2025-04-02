
import { useState, useEffect, useCallback, useRef } from 'react';
import { MessageType, ClientToServerMessage, ServerToClientMessage, GameState, GamePhase, CardDefinition, CardInstance, FactionType } from '@/types/gameTypes';
import { useToast } from '@/hooks/use-toast';

// Initialize a mock game state
const initMockGameState = (): GameState => ({
  gameId: 'mock-game-1',
  phase: GamePhase.WAITING,
  players: [
    {
      id: 'player-1',
      name: 'You',
      status: 'CONNECTED',
      faction: FactionType.CORPORATION,
      resources: {
        credits: 5,
        dataTokens: 3
      },
      deck: Array.from({ length: 20 }, (_, i) => ({
        instanceId: `card-instance-${i}`,
        definitionId: `card-def-${i % 10}`
      })),
      hand: [],
      discard: []
    }
  ],
  territories: [
    {
      id: 'territory-1',
      name: 'Central Server',
      type: 'server',
      controlledBy: null,
      influence: {},
      connections: ['territory-2', 'territory-3'],
      position: { x: 50, y: 50 }
    },
    {
      id: 'territory-2',
      name: 'R&D Facility',
      type: 'facility',
      controlledBy: null,
      influence: {},
      connections: ['territory-1'],
      position: { x: 100, y: 30 }
    },
    {
      id: 'territory-3',
      name: 'HQ Servers',
      type: 'server',
      controlledBy: null,
      influence: {},
      connections: ['territory-1'],
      position: { x: 80, y: 80 }
    }
  ],
  turnNumber: 0,
  currentPlayerId: null
});

// Sample card definitions
const mockCardDefinitions: CardDefinition[] = [
  {
    id: 'card-def-0',
    name: 'Neural Katana',
    cost: 3,
    type: 'ICE',
    faction: FactionType.CORPORATION,
    description: 'End the runner\'s turn if they don\'t have a breaker.',
    effects: [{ type: 'GAIN_RESOURCES', value: 1 }]
  },
  {
    id: 'card-def-1',
    name: 'Hedge Fund',
    cost: 2,
    type: 'OPERATION',
    faction: FactionType.CORPORATION,
    description: 'Gain 5 credits.',
    effects: [{ type: 'GAIN_RESOURCES', value: 5 }]
  },
  {
    id: 'card-def-2',
    name: 'Corroder',
    cost: 2,
    type: 'PROGRAM',
    faction: FactionType.RUNNER,
    description: 'Break barrier subroutines.',
    effects: [{ type: 'DRAW_CARD', value: 1 }]
  },
  {
    id: 'card-def-3',
    name: 'Sure Gamble',
    cost: 3,
    type: 'EVENT',
    faction: FactionType.RUNNER,
    description: 'Gain 4 credits.',
    effects: [{ type: 'GAIN_RESOURCES', value: 4 }]
  },
  {
    id: 'card-def-4',
    name: 'Data Terminal',
    cost: 1,
    type: 'HARDWARE',
    faction: FactionType.RUNNER,
    description: 'Add 1 influence to a territory.',
    effects: [{ type: 'ADD_INFLUENCE', value: 1, targetRequired: true }]
  },
  {
    id: 'card-def-5',
    name: 'Proxy Server',
    cost: 2,
    type: 'ICE',
    faction: FactionType.CORPORATION,
    description: 'Add 1 influence to a territory.',
    effects: [{ type: 'ADD_INFLUENCE', value: 1, targetRequired: true }]
  },
  {
    id: 'card-def-6',
    name: 'Memory Chip',
    cost: 1,
    type: 'HARDWARE',
    faction: FactionType.RUNNER,
    description: 'Draw 2 cards.',
    effects: [{ type: 'DRAW_CARD', value: 2 }]
  },
  {
    id: 'card-def-7',
    name: 'Corporate Restructuring',
    cost: 4,
    type: 'OPERATION',
    faction: FactionType.CORPORATION,
    description: 'Gain 3 credits and draw 1 card.',
    effects: [
      { type: 'GAIN_RESOURCES', value: 3 },
      { type: 'DRAW_CARD', value: 1 }
    ]
  },
  {
    id: 'card-def-8',
    name: 'System Outage',
    cost: 3,
    type: 'EVENT',
    faction: FactionType.RUNNER,
    description: 'Add 2 influence to a territory.',
    effects: [{ type: 'ADD_INFLUENCE', value: 2, targetRequired: true }]
  },
  {
    id: 'card-def-9',
    name: 'Defensive Matrix',
    cost: 3,
    type: 'ICE',
    faction: FactionType.CORPORATION,
    description: 'Add 2 influence to a territory.',
    effects: [{ type: 'ADD_INFLUENCE', value: 2, targetRequired: true }]
  }
];

// Function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<ServerToClientMessage | null>(null);
  const socket = useRef<WebSocket | null>(null);
  const mockSocketRef = useRef<any>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const { toast } = useToast();
  
  const drawCard = useCallback((numCards: number = 1) => {
    if (!gameStateRef.current || !gameStateRef.current.players[0].deck.length) return;
    
    const player = gameStateRef.current.players[0];
    const cardsToMove = Math.min(numCards, player.deck.length);
    const newHand = [...player.hand];
    const newDeck = [...player.deck];
    
    for (let i = 0; i < cardsToMove; i++) {
      const drawnCard = newDeck.pop();
      if (drawnCard) newHand.push(drawnCard);
    }
    
    const updatedPlayer = { 
      ...player, 
      hand: newHand, 
      deck: newDeck 
    };
    
    gameStateRef.current = {
      ...gameStateRef.current,
      players: [updatedPlayer]
    };
    
    // Send player hand update message
    setTimeout(() => {
      mockSocketRef.current?.onMessage({
        type: MessageType.PLAYER_HAND_UPDATE,
        playerId: player.id,
        hand: newHand,
        timestamp: Date.now()
      });
    }, 100);
  }, []);

  const startGame = useCallback(() => {
    if (!gameStateRef.current) return;
    
    // Shuffle the player's deck
    const player = gameStateRef.current.players[0];
    const shuffledDeck = shuffleArray(player.deck);
    
    const updatedPlayer = { 
      ...player, 
      deck: shuffledDeck,
      hand: [] // Clear hand before drawing initial cards
    };
    
    gameStateRef.current = {
      ...gameStateRef.current,
      players: [updatedPlayer],
      phase: GamePhase.TURN_BASED,
      currentPlayerId: updatedPlayer.id,
      turnNumber: 1
    };
    
    // Update game state
    setTimeout(() => {
      mockSocketRef.current?.onMessage({
        type: MessageType.GAME_STATE_INIT,
        gameState: gameStateRef.current,
        timestamp: Date.now()
      });
      
      // Draw initial hand
      drawCard(5);
    }, 100);
  }, [drawCard]);

  const handleMessage = useCallback((message: ClientToServerMessage) => {
    if (!gameStateRef.current) return;
    
    switch (message.type) {
      case MessageType.CONNECTION_ACK:
        console.info('Connection acknowledged');
        
        // Send initial game state
        setTimeout(() => {
          mockSocketRef.current?.onMessage({
            type: MessageType.GAME_STATE_INIT,
            gameState: gameStateRef.current,
            timestamp: Date.now()
          });
          
          // Send card definitions
          mockSocketRef.current?.onMessage({
            type: MessageType.ALL_CARD_DEFINITIONS,
            cardDefinitions: mockCardDefinitions,
            timestamp: Date.now()
          });
          
          // Start the game after a short delay
          setTimeout(() => {
            startGame();
          }, 500);
        }, 200);
        break;
        
      case MessageType.PLAY_CARD:
        // Find the card in player's hand
        const player = gameStateRef.current.players[0];
        const cardIndex = player.hand.findIndex(c => c.instanceId === message.cardInstanceId);
        
        if (cardIndex === -1) {
          mockSocketRef.current?.onMessage({
            type: MessageType.ERROR,
            message: 'Card not found in hand',
            timestamp: Date.now()
          });
          return;
        }
        
        const card = player.hand[cardIndex];
        const cardDef = mockCardDefinitions.find(d => d.id === card.definitionId);
        
        if (!cardDef) {
          mockSocketRef.current?.onMessage({
            type: MessageType.ERROR,
            message: 'Card definition not found',
            timestamp: Date.now()
          });
          return;
        }
        
        // Check if player has enough resources
        if (player.resources.credits < cardDef.cost) {
          mockSocketRef.current?.onMessage({
            type: MessageType.ERROR,
            message: 'Not enough credits to play this card',
            timestamp: Date.now()
          });
          return;
        }
        
        // Process card effects
        const newResources = { ...player.resources };
        newResources.credits -= cardDef.cost;
        
        cardDef.effects.forEach(effect => {
          if (effect.type === 'GAIN_RESOURCES') {
            newResources.credits += effect.value;
          } else if (effect.type === 'DRAW_CARD' && effect.value) {
            setTimeout(() => drawCard(effect.value), 300);
          } else if (effect.type === 'ADD_INFLUENCE' && message.targetId) {
            // Update territory influence
            const territory = gameStateRef.current!.territories.find(t => t.id === message.targetId);
            if (territory) {
              const updatedInfluence = { ...territory.influence };
              updatedInfluence[player.id] = (updatedInfluence[player.id] || 0) + (effect.value || 1);
              
              // Check if player now controls territory
              let totalInfluence = 0;
              let controllingPlayer = null;
              let maxInfluence = 0;
              
              Object.entries(updatedInfluence).forEach(([playerId, value]) => {
                totalInfluence += value;
                if (value > maxInfluence) {
                  maxInfluence = value;
                  controllingPlayer = playerId;
                }
              });
              
              // Update territory
              const updatedTerritory = {
                ...territory,
                influence: updatedInfluence,
                controlledBy: controllingPlayer
              };
              
              // Update game state with new territory
              const territories = gameStateRef.current!.territories.map(t => 
                t.id === updatedTerritory.id ? updatedTerritory : t
              );
              
              gameStateRef.current = {
                ...gameStateRef.current!,
                territories
              };
              
              // Send territory update
              setTimeout(() => {
                mockSocketRef.current?.onMessage({
                  type: MessageType.TERRITORY_UPDATE,
                  territory: updatedTerritory,
                  timestamp: Date.now()
                });
              }, 200);
            }
          }
        });
        
        // Remove the card from hand
        const newHand = [...player.hand];
        newHand.splice(cardIndex, 1);
        
        // Add card to discard
        const newDiscard = [...player.discard, card];
        
        // Update player
        const updatedPlayer = {
          ...player,
          hand: newHand,
          discard: newDiscard,
          resources: newResources
        };
        
        gameStateRef.current = {
          ...gameStateRef.current,
          players: [updatedPlayer]
        };
        
        // Send player updates
        setTimeout(() => {
          mockSocketRef.current?.onMessage({
            type: MessageType.PLAYER_HAND_UPDATE,
            playerId: player.id,
            hand: newHand,
            timestamp: Date.now()
          });
          
          mockSocketRef.current?.onMessage({
            type: MessageType.PLAYER_RESOURCE_UPDATE,
            playerId: player.id,
            resources: newResources,
            timestamp: Date.now()
          });
          
          mockSocketRef.current?.onMessage({
            type: MessageType.PLAYER_DISCARD_UPDATE,
            playerId: player.id,
            discard: newDiscard,
            timestamp: Date.now()
          });
        }, 200);
        break;
        
      case MessageType.END_TURN:
        // Update game state for next turn
        gameStateRef.current = {
          ...gameStateRef.current,
          turnNumber: gameStateRef.current.turnNumber + 1
        };
        
        // Draw a card for the next turn
        drawCard(1);
        
        // Send turn change message
        setTimeout(() => {
          mockSocketRef.current?.onMessage({
            type: MessageType.TURN_CHANGE,
            currentPlayerId: gameStateRef.current!.players[0].id,
            turnNumber: gameStateRef.current!.turnNumber,
            timestamp: Date.now()
          });
        }, 200);
        break;
        
      default:
        console.warn('Unhandled message type:', message.type);
    }
  }, [drawCard, startGame]);

  // Create mock WebSocket
  useEffect(() => {
    console.info('Creating mock WebSocket');
    
    // Initialize game state
    gameStateRef.current = initMockGameState();
    
    const mockSocket = {
      send: (data: string) => {
        try {
          const message = JSON.parse(data) as ClientToServerMessage;
          console.log('Sending message:', message);
          handleMessage(message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      },
      close: () => {
        console.info('Mock WebSocket closed');
        setConnected(false);
      },
      onMessage: (message: ServerToClientMessage) => {
        console.log('Received message:', message);
        setLastMessage(message);
      }
    };
    
    mockSocketRef.current = mockSocket;
    socket.current = mockSocket as any;
    setConnected(true);
    
    return () => {
      console.info('Mock WebSocket closed');
      setConnected(false);
      mockSocketRef.current = null;
      socket.current = null;
    };
  }, [handleMessage]);

  // Send a message to the server
  const sendMessage = useCallback((message: ClientToServerMessage) => {
    // Add a timestamp if not already present
    const messageWithTimestamp = { 
      ...message, 
      timestamp: message.timestamp || Date.now() 
    };
    
    if (socket.current) {
      socket.current.send(JSON.stringify(messageWithTimestamp));
    } else {
      toast({
        title: "Connection Error",
        description: "Not connected to game server",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    connected,
    sendMessage,
    lastMessage
  };
};
