
import { useState, useEffect, useCallback, useRef } from 'react';
import { BaseMessage, MessageType, ServerToClientMessage, GamePhase } from '../types/gameTypes';

interface UseWebSocketOptions {
  url: string;
  onOpen?: () => void;
  onClose?: () => void;
  onMessage?: (message: ServerToClientMessage) => void;
  onError?: (error: Event) => void;
  reconnect?: boolean;
  reconnectDelay?: number;
}

interface UseWebSocketReturn {
  connected: boolean;
  connecting: boolean;
  sendMessage: <T extends BaseMessage>(message: T) => void;
  error: Event | null;
  lastMessage: ServerToClientMessage | null;
}

export const useWebSocket = ({
  url,
  onOpen,
  onClose,
  onMessage,
  onError,
  reconnect = true,
  reconnectDelay = 3000,
}: UseWebSocketOptions): UseWebSocketReturn => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<Event | null>(null);
  const [lastMessage, setLastMessage] = useState<ServerToClientMessage | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  
  // For mocking during development (later we would use a real server)
  const mockWebSocket = useCallback(() => {
    // This is a mock implementation for development/demo
    console.log('Creating mock WebSocket');
    
    const mockSocket = {
      send: (data: string) => {
        console.log('Mock WebSocket sending:', data);
        
        // Parse the message
        const parsedMessage = JSON.parse(data);
        
        // Simulate server response
        setTimeout(() => {
          const mockResponse: ServerToClientMessage = {
            type: MessageType.CONNECTION_ACK,
            timestamp: Date.now(),
          };
          
          if (onMessage) {
            onMessage(mockResponse);
          }
          
          setLastMessage(mockResponse);
        }, 500);
      },
      close: () => {
        console.log('Mock WebSocket closed');
        setConnected(false);
        if (onClose) onClose();
      },
    };
    
    // Simulate connection established
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      if (onOpen) onOpen();
      
      // Send initial state after connection
      const mockGameStateInit = {
        type: MessageType.GAME_STATE_INIT,
        timestamp: Date.now(),
        gameState: {
          gameId: 'mock-game-1',
          phase: GamePhase.WAITING,
          players: [
            {
              id: 'player-1',
              name: 'Player 1',
              status: 'CONNECTED',
              faction: 'CORPORATION',
              resources: { credits: 5, dataTokens: 3 },
              deck: Array(20).fill(0).map((_, i) => ({ 
                instanceId: `card-instance-${i}`, 
                definitionId: `card-def-${i % 10}` 
              })),
              hand: [],
              discard: [],
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
              position: { x: 50, y: 50 },
            },
            {
              id: 'territory-2',
              name: 'R&D Facility',
              type: 'server',
              controlledBy: null,
              influence: {},
              connections: ['territory-1'],
              position: { x: 25, y: 30 },
            },
            {
              id: 'territory-3',
              name: 'HQ Servers',
              type: 'server',
              controlledBy: null,
              influence: {},
              connections: ['territory-1'],
              position: { x: 75, y: 70 },
            },
          ],
          turnNumber: 0,
          currentPlayerId: null,
        }
      };
      
      if (onMessage) {
        onMessage(mockGameStateInit as ServerToClientMessage);
      }
      
      setLastMessage(mockGameStateInit as ServerToClientMessage);
      
      // Send card definitions
      setTimeout(() => {
        const mockCardDefinitions = {
          type: MessageType.ALL_CARD_DEFINITIONS,
          timestamp: Date.now(),
          cardDefinitions: [
            {
              id: 'card-def-0',
              name: 'Neural Katana',
              cost: 3,
              type: 'ICE',
              faction: 'CORPORATION',
              description: 'End the runner\'s turn if they don\'t have a breaker.',
              effects: [{ type: 'GAIN_RESOURCES', value: 1 }],
            },
            {
              id: 'card-def-1',
              name: 'Hedge Fund',
              cost: 2,
              type: 'OPERATION',
              faction: 'CORPORATION',
              description: 'Gain 5 credits.',
              effects: [{ type: 'GAIN_RESOURCES', value: 5 }],
            },
            {
              id: 'card-def-2',
              name: 'Corroder',
              cost: 2,
              type: 'PROGRAM',
              faction: 'RUNNER',
              description: 'Break barrier subroutines.',
              effects: [{ type: 'DRAW_CARD', value: 1 }],
            },
            {
              id: 'card-def-3',
              name: 'Sure Gamble',
              cost: 3,
              type: 'EVENT',
              faction: 'RUNNER',
              description: 'Gain 4 credits.',
              effects: [{ type: 'GAIN_RESOURCES', value: 4 }],
            },
            {
              id: 'card-def-4',
              name: 'Data Terminal',
              cost: 1,
              type: 'HARDWARE',
              faction: 'RUNNER',
              description: 'Add 1 influence to a territory.',
              effects: [{ 
                type: 'ADD_INFLUENCE', 
                value: 1,
                targetRequired: true 
              }],
            },
            {
              id: 'card-def-5',
              name: 'Proxy Server',
              cost: 2,
              type: 'ICE',
              faction: 'CORPORATION',
              description: 'Add 1 influence to a territory.',
              effects: [{ 
                type: 'ADD_INFLUENCE', 
                value: 1,
                targetRequired: true 
              }],
            },
            {
              id: 'card-def-6',
              name: 'Memory Chip',
              cost: 1,
              type: 'HARDWARE',
              faction: 'RUNNER',
              description: 'Draw 2 cards.',
              effects: [{ type: 'DRAW_CARD', value: 2 }],
            },
            {
              id: 'card-def-7',
              name: 'Corporate Restructuring',
              cost: 4,
              type: 'OPERATION',
              faction: 'CORPORATION',
              description: 'Gain 3 credits and draw 1 card.',
              effects: [
                { type: 'GAIN_RESOURCES', value: 3 },
                { type: 'DRAW_CARD', value: 1 }
              ],
            },
            {
              id: 'card-def-8',
              name: 'System Outage',
              cost: 3,
              type: 'EVENT',
              faction: 'RUNNER',
              description: 'Add 2 influence to a territory.',
              effects: [{ 
                type: 'ADD_INFLUENCE', 
                value: 2,
                targetRequired: true 
              }],
            },
            {
              id: 'card-def-9',
              name: 'Defensive Matrix',
              cost: 3,
              type: 'ICE',
              faction: 'CORPORATION',
              description: 'Add 2 influence to a territory.',
              effects: [{ 
                type: 'ADD_INFLUENCE', 
                value: 2,
                targetRequired: true
              }],
            },
          ]
        };
        
        if (onMessage) {
          onMessage(mockCardDefinitions as ServerToClientMessage);
        }
        
        setLastMessage(mockCardDefinitions as ServerToClientMessage);
        
        // Draw some cards
        setTimeout(() => {
          const mockHandUpdate = {
            type: MessageType.PLAYER_HAND_UPDATE,
            timestamp: Date.now(),
            playerId: 'player-1',
            hand: [
              { instanceId: 'card-instance-1', definitionId: 'card-def-1' },
              { instanceId: 'card-instance-2', definitionId: 'card-def-2' },
              { instanceId: 'card-instance-3', definitionId: 'card-def-3' },
              { instanceId: 'card-instance-4', definitionId: 'card-def-5' },
              { instanceId: 'card-instance-5', definitionId: 'card-def-8' },
            ]
          };
          
          if (onMessage) {
            onMessage(mockHandUpdate as ServerToClientMessage);
          }
          
          setLastMessage(mockHandUpdate as ServerToClientMessage);
          
          // Start the first turn
          setTimeout(() => {
            const mockTurnStart = {
              type: MessageType.TURN_CHANGE,
              timestamp: Date.now(),
              currentPlayerId: 'player-1',
              turnNumber: 1
            };
            
            if (onMessage) {
              onMessage(mockTurnStart as ServerToClientMessage);
            }
            
            setLastMessage(mockTurnStart as ServerToClientMessage);
          }, 500);
        }, 500);
      }, 500);
    }, 500);
    
    return mockSocket as unknown as WebSocket;
  }, [onMessage, onOpen, onClose]);
  
  // Connect to WebSocket or create mock
  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;
    
    setConnecting(true);
    setError(null);
    
    try {
      // For now we'll use the mock implementation
      socketRef.current = mockWebSocket();
    } catch (err) {
      console.error('WebSocket connection error:', err);
      setConnecting(false);
      setError(err as Event);
      
      if (reconnect && reconnectTimeoutRef.current === null) {
        reconnectTimeoutRef.current = window.setTimeout(() => {
          reconnectTimeoutRef.current = null;
          connect();
        }, reconnectDelay);
      }
    }
  }, [mockWebSocket, reconnect, reconnectDelay]);
  
  // Send message through WebSocket
  const sendMessage = useCallback(<T extends BaseMessage>(message: T) => {
    if (!socketRef.current || (socketRef.current as any).readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }
    
    const messageWithTimestamp = {
      ...message,
      timestamp: Date.now(),
    };
    
    try {
      (socketRef.current as any).send(JSON.stringify(messageWithTimestamp));
    } catch (err) {
      console.error('Error sending message:', err);
    }
  }, []);
  
  // Connect on component mount
  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeoutRef.current !== null) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      if (socketRef.current) {
        (socketRef.current as any).close();
        socketRef.current = null;
      }
    };
  }, [connect]);
  
  return {
    connected,
    connecting,
    sendMessage,
    error,
    lastMessage,
  };
};
