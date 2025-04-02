
import { useState, useEffect, useCallback } from 'react';
import { ClientToServerMessage, ServerToClientMessage, MessageType, GamePhase } from '@/types/gameTypes';

// This is a mock implementation for local development
export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<ServerToClientMessage | null>(null);

  // Mock function to simulate sending messages to a server
  const sendMessage = useCallback((message: ClientToServerMessage) => {
    console.log('Sending message:', message);
    
    // Mock responses based on message type
    setTimeout(() => {
      switch (message.type) {
        case MessageType.CONNECTION_ACK:
          // Mock initialization of game state
          setLastMessage({
            type: MessageType.GAME_STATE_INIT,
            gameState: {
              gameId: 'mock-game-1',
              phase: GamePhase.TURN_BASED,
              players: [
                {
                  id: 'player-1',
                  name: 'You',
                  status: 'CONNECTED',
                  faction: 'CORPORATION',
                  resources: {
                    credits: 5,
                    dataTokens: 3,
                  },
                  hand: [],
                  discard: [],
                  deck: Array(20).fill(0).map((_, i) => ({
                    instanceId: `card-instance-${i}`,
                    definitionId: `card-def-${i % 10}`,
                  })),
                },
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
                  type: 'facility',
                  controlledBy: null,
                  influence: {},
                  connections: ['territory-1'],
                  position: { x: 100, y: 30 },
                },
                {
                  id: 'territory-3',
                  name: 'HQ Servers',
                  type: 'server',
                  controlledBy: null,
                  influence: {},
                  connections: ['territory-1'],
                  position: { x: 80, y: 80 },
                },
              ],
              turnNumber: 1,
              currentPlayerId: 'player-1',
            },
            timestamp: Date.now(),
          });
          
          // Then after a short delay, send initial player hand
          setTimeout(() => {
            setLastMessage({
              type: MessageType.PLAYER_HAND_UPDATE,
              playerId: 'player-1',
              hand: [
                { instanceId: 'card-instance-15', definitionId: 'card-def-5' },
                { instanceId: 'card-instance-0', definitionId: 'card-def-0' },
                { instanceId: 'card-instance-4', definitionId: 'card-def-4' },
                { instanceId: 'card-instance-11', definitionId: 'card-def-1' },
                { instanceId: 'card-instance-14', definitionId: 'card-def-4' },
              ],
              timestamp: Date.now(),
            });
          }, 100);
          break;
        
        case MessageType.PLAY_CARD:
          // Mock response to playing a card
          setLastMessage({
            type: MessageType.TERRITORY_UPDATE,
            territory: {
              id: message.targetId || 'territory-1',
              name: message.targetId === 'territory-2' ? 'R&D Facility' : 
                    message.targetId === 'territory-3' ? 'HQ Servers' : 'Central Server',
              type: 'server',
              controlledBy: 'player-1',
              influence: { 'player-1': 2 },
              connections: message.targetId === 'territory-2' ? ['territory-1'] :
                         message.targetId === 'territory-3' ? ['territory-1'] : 
                         ['territory-2', 'territory-3'],
              position: { 
                x: message.targetId === 'territory-2' ? 100 : 
                   message.targetId === 'territory-3' ? 80 : 50,
                y: message.targetId === 'territory-2' ? 30 : 
                   message.targetId === 'territory-3' ? 80 : 50,
              }
            },
            timestamp: Date.now(),
          });
          
          // Also update the player's hand (remove the played card)
          setTimeout(() => {
            setLastMessage({
              type: MessageType.PLAYER_HAND_UPDATE,
              playerId: 'player-1',
              hand: [
                { instanceId: 'card-instance-15', definitionId: 'card-def-5' },
                { instanceId: 'card-instance-0', definitionId: 'card-def-0' },
                { instanceId: 'card-instance-11', definitionId: 'card-def-1' },
                { instanceId: 'card-instance-14', definitionId: 'card-def-4' },
              ],
              timestamp: Date.now(),
            });
          }, 300);
          break;
          
        case MessageType.END_TURN:
          // Mock turn change
          setLastMessage({
            type: MessageType.TURN_CHANGE,
            currentPlayerId: 'player-1',  // For mock, just keep it as player-1
            turnNumber: 2,  // Increment turn number
            timestamp: Date.now(),
          });
          
          // Also draw a card
          setTimeout(() => {
            setLastMessage({
              type: MessageType.PLAYER_HAND_UPDATE,
              playerId: 'player-1',
              hand: [
                { instanceId: 'card-instance-15', definitionId: 'card-def-5' },
                { instanceId: 'card-instance-0', definitionId: 'card-def-0' },
                { instanceId: 'card-instance-11', definitionId: 'card-def-1' },
                { instanceId: 'card-instance-14', definitionId: 'card-def-4' },
                { instanceId: 'card-instance-7', definitionId: 'card-def-7' },
              ],
              timestamp: Date.now(),
            });
          }, 300);
          break;
          
        default:
          console.log('Unhandled message type in mock:', message.type);
      }
    }, 300);
  }, []);

  // Simulate connecting to a WebSocket
  useEffect(() => {
    const connectTimeout = setTimeout(() => {
      setConnected(true);
      console.log('Mock WebSocket connected');
    }, 1000);
    
    return () => {
      clearTimeout(connectTimeout);
    };
  }, []);

  return {
    connected,
    sendMessage,
    lastMessage,
  };
};
