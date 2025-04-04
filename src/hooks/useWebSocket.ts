
import { useCallback, useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ClientToServerMessage, MessageType } from '@/types/gameTypes';

// Using the development server URL for WebSocket connection
const WS_URL = 'ws://localhost:8080';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const handleGameMessage = useGameStore(state => state.handleGameMessage);

  // Initialize WebSocket connection
  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
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
      const reconnectTimer = setTimeout(() => {
        console.log('Attempting to reconnect...');
        connect();
      }, 3000);
      
      return () => clearTimeout(reconnectTimer);
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
