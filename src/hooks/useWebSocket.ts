
import { useCallback, useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ClientToServerMessage, MessageType } from '@/types/gameTypes';

// Using the development server URL for WebSocket connection
// If running in Lovable, we don't need to connect since the backend is mocked
const WS_URL = window.location.hostname.includes('lovableproject.com') 
  ? 'wss://mock-server.lovableproject.com' // Use a mock URL for Lovable environment
  : 'ws://localhost:8080'; // Use localhost for local development

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const handleGameMessage = useGameStore(state => state.handleGameMessage);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Initialize WebSocket connection
  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    // In Lovable environment, just simulate a connection
    if (window.location.hostname.includes('lovableproject.com')) {
      console.log('Running in Lovable sandbox, using mock WebSocket');
      setIsConnected(true);
      setIsConnecting(false);
      
      // Simulate initial game state after "connection"
      setTimeout(() => {
        const mockInitMessage = {
          type: MessageType.GAME_STATE_INIT,
          gameState: {
            phase: 'OVERWORLD',
            turnNumber: 1,
            currentPlayerId: 'player-1',
            playerStates: [
              {
                clientId: 'player-1',
                displayName: 'You',
                faction: 'RUNNER',
                resources: { credits: 5, dataTokens: 3 },
                zones: {
                  hand: [],
                  deck: [],
                  discardPile: [],
                  inPlay: []
                },
                status: 'connected'
              }
            ],
            territories: [
              { id: 'territory-1', name: 'Downtown', x: 100, y: 100 },
              { id: 'territory-2', name: 'Suburbs', x: 300, y: 150 },
              { id: 'territory-3', name: 'Industrial Zone', x: 200, y: 250 }
            ],
            playerHand: ['card-1', 'card-2', 'card-3']
          }
        };
        
        const mockCardDefinitions = {
          type: MessageType.ALL_CARD_DEFINITIONS,
          cardDefinitions: [
            {
              id: 'card-1',
              name: 'Hack',
              cost: 2,
              type: 'Program',
              faction: 'RUNNER',
              description: 'Break one ice subroutine'
            },
            {
              id: 'card-2',
              name: 'Firewall',
              cost: 3,
              type: 'ICE',
              faction: 'CORPORATION',
              description: 'End the run unless the runner pays 2 credits'
            },
            {
              id: 'card-3',
              name: 'Icebreaker',
              cost: 4,
              type: 'Program',
              faction: 'RUNNER',
              description: 'Break ice subroutines at a cost of 1 credit each'
            }
          ]
        };
        
        handleGameMessage(mockCardDefinitions);
        handleGameMessage(mockInitMessage);
      }, 1000);
      
      return;
    }

    try {
      setIsConnecting(true);
      setConnectionError(null);
      
      const socket = new WebSocket(WS_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttemptsRef.current = 0;
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Received message:', message);
          handleGameMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error, please try again');
        setIsConnecting(false);
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setConnectionError('Failed to create connection');
      setIsConnecting(false);
    }
  }, [handleGameMessage]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Send message through WebSocket
  const sendMessage = useCallback((message: ClientToServerMessage) => {
    if (window.location.hostname.includes('lovableproject.com')) {
      // In Lovable sandbox, just log the message
      console.log('Mock sending message:', message);
      return true;
    }
    
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('Sending message:', message);
      socketRef.current.send(JSON.stringify(message));
      return true;
    } else {
      console.error('WebSocket not connected, cannot send message');
      return false;
    }
  }, []);

  // Auto-connect on component mount
  useEffect(() => {
    connect();
    
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Implement auto-reconnect logic
  useEffect(() => {
    if (!isConnected && !isConnecting && connectionError) {
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1;
        const reconnectTimer = setTimeout(() => {
          console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          connect();
        }, 3000);
        
        return () => clearTimeout(reconnectTimer);
      } else {
        console.log('Maximum reconnect attempts reached, giving up');
      }
    }
  }, [isConnected, isConnecting, connectionError, connect]);

  return {
    isConnected,
    isConnecting,
    connectionError,
    connect,
    disconnect,
    sendMessage
  };
};
