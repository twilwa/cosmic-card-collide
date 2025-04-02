
import React, { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { MessageType, Territory, CardInstance, GamePhase } from '@/types/gameTypes';
import { useGameStore } from '@/store/gameStore';
import TerritoryMap from './TerritoryMap';
import CardComponent from './CardComponent';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const GameBoard: React.FC = () => {
  const { toast } = useToast();
  const [selectedCard, setSelectedCard] = useState<CardInstance | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const { sendMessage, lastMessage, connected } = useWebSocket();
  
  // Get values and actions from the game store
  const gameState = useGameStore(state => state.gameState);
  const handleGameMessage = useGameStore(state => state.handleGameMessage);
  const currentPlayer = useGameStore(state => state.currentPlayer);
  const isPlayerTurn = useGameStore(state => state.isPlayerTurn);
  const phase = useGameStore(state => state.phase);
  const cardDefinitions = useGameStore(state => state.cardDefinitions);

  useEffect(() => {
    if (connected) {
      // Send an acknowledgment when connected
      sendMessage({
        type: MessageType.CONNECTION_ACK,
        timestamp: Date.now()
      });
    }
  }, [connected, sendMessage]);

  const handleEndTurn = () => {
    sendMessage({
      type: MessageType.END_TURN,
      timestamp: Date.now()
    });
  };

  const handleCardClick = (card: CardInstance) => {
    setSelectedCard(card);
    toast({
      title: "Card Selected",
      description: "Choose a target if required"
    });
  };

  const handleTerritoryClick = (territory: Territory) => {
    if (selectedCard) {
      // If a card is selected, use it on the territory
      playCard(selectedCard, territory);
      setSelectedCard(null);
    } else {
      setSelectedTerritory(territory);
      toast({
        title: "Territory Selected",
        description: `${territory.name} - Control: ${territory.controlledBy || 'None'}`
      });
    }
  };

  const playCard = (card: CardInstance, targetTerritory?: Territory) => {
    if (!isPlayerTurn || phase !== GamePhase.TURN_BASED) {
      toast({
        title: "Cannot Play Card",
        description: "It's not your turn or game is not in turn phase",
        variant: "destructive"
      });
      return;
    }

    sendMessage({
      type: MessageType.PLAY_CARD,
      cardInstanceId: card.instanceId,
      targetId: targetTerritory?.id,
      timestamp: Date.now()
    });
  };

  // Process incoming messages
  useEffect(() => {
    if (!lastMessage) return;
    handleGameMessage(lastMessage);
  }, [lastMessage, handleGameMessage]);

  // Temp mock to generate card data for testing
  useEffect(() => {
    // If there are no card definitions loaded and the socket is connected
    if (connected && Object.keys(cardDefinitions).length === 0) {
      // Send a mock message to load card definitions
      const mockCardDefinitions = [
        {
          id: "card-def-0",
          name: "Network Firewall",
          cost: 2,
          type: "DEFENSE",
          faction: "CORPORATION",
          description: "Increase security on a server to prevent unauthorized access.",
          effects: [{ type: "INCREASE_SECURITY", value: 2 }]
        },
        {
          id: "card-def-1",
          name: "Data Mining",
          cost: 3,
          type: "OPERATION",
          faction: "CORPORATION",
          description: "Extract valuable information from data stores.",
          effects: [{ type: "GAIN_CREDITS", value: 3 }]
        },
        {
          id: "card-def-2",
          name: "Corporate Espionage",
          cost: 4,
          type: "OPERATION",
          faction: "CORPORATION",
          description: "Steal information from competitors.",
          effects: [{ type: "DRAW_CARDS", value: 2 }]
        },
        {
          id: "card-def-3",
          name: "System Upgrade",
          cost: 3,
          type: "UPGRADE",
          faction: "CORPORATION",
          description: "Improve infrastructure for better performance.",
          effects: [{ type: "INCREASE_MAX_HAND", value: 1 }]
        },
        {
          id: "card-def-4",
          name: "Neural Network",
          cost: 5,
          type: "ASSET",
          faction: "CORPORATION",
          description: "Deploy advanced AI to optimize operations.",
          effects: [{ type: "RECURRING_CREDITS", value: 2 }]
        },
        {
          id: "card-def-5",
          name: "Ice Breaker",
          cost: 2,
          type: "PROGRAM",
          faction: "RUNNER",
          description: "Break through corporation security systems.",
          effects: [{ type: "BREAK_ICE", value: 2 }]
        },
        {
          id: "card-def-6",
          name: "Virus Deployment",
          cost: 3,
          type: "PROGRAM",
          faction: "RUNNER",
          description: "Insert malicious code to disrupt operations.",
          effects: [{ type: "VIRUS_COUNTERS", value: 3 }]
        },
        {
          id: "card-def-7",
          name: "Hardware Upgrade",
          cost: 4,
          type: "HARDWARE",
          faction: "RUNNER",
          description: "Upgrade your rig for better performance.",
          effects: [{ type: "MEMORY_UNITS", value: 2 }]
        },
        {
          id: "card-def-8",
          name: "Identity Spoofing",
          cost: 3,
          type: "EVENT",
          faction: "RUNNER",
          description: "Mask your digital footprint to avoid detection.",
          effects: [{ type: "AVOID_TAGS", value: 2 }]
        },
        {
          id: "card-def-9",
          name: "Deep Dive",
          cost: 5,
          type: "EVENT",
          faction: "RUNNER",
          description: "Perform a high-risk, high-reward server breach.",
          effects: [{ type: "ACCESS_CARDS", value: 3 }]
        }
      ];

      // Send mock card definitions to the store as if they came from the server
      handleGameMessage({
        type: MessageType.ALL_CARD_DEFINITIONS,
        cardDefinitions: mockCardDefinitions,
        timestamp: Date.now()
      });

      // If we also don't have a player hand, send a mock hand update
      if (!currentPlayer?.hand?.length) {
        // Send a mock hand update
        handleGameMessage({
          type: MessageType.PLAYER_HAND_UPDATE,
          playerId: "player-1",
          hand: [
            { instanceId: "card-instance-0", definitionId: "card-def-0" },
            { instanceId: "card-instance-1", definitionId: "card-def-1" },
            { instanceId: "card-instance-2", definitionId: "card-def-2" },
            { instanceId: "card-instance-5", definitionId: "card-def-5" },
            { instanceId: "card-instance-7", definitionId: "card-def-7" }
          ],
          timestamp: Date.now()
        });
      }
    }
  }, [connected, cardDefinitions, currentPlayer, handleGameMessage]);

  // Temporary placeholder content if game state is not yet loaded
  if (!gameState) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-pulse cyber-border p-6 rounded-md glow-corp">
          <h2 className="text-2xl font-bold text-center text-cyber-corp mb-4">Connecting to the Network...</h2>
          <div className="w-full h-2 bg-gray-700 rounded-full">
            <div className="h-full bg-cyber-corp w-1/2 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Render the game board
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      {/* Game status */}
      <div className="col-span-1 lg:col-span-3 cyber-border p-4 rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              {phase === GamePhase.WAITING ? "Waiting for players..." : 
               phase === GamePhase.TURN_BASED ? `Turn ${gameState.turnNumber}` : 
               "Game Over"}
            </h2>
            <p>Current player: {gameState.currentPlayerId ? 
              gameState.players.find(p => p.id === gameState.currentPlayerId)?.name || "Unknown" : 
              "None"}
            </p>
          </div>
          <div>
            <Button 
              onClick={handleEndTurn} 
              disabled={!isPlayerTurn || phase !== GamePhase.TURN_BASED}
              className={`${isPlayerTurn ? "bg-cyber-corp hover:bg-blue-600" : "bg-gray-700"} text-white`}
            >
              End Turn
            </Button>
          </div>
        </div>
      </div>

      {/* Territory map */}
      <div className="col-span-1 lg:col-span-2 cyber-border p-4 rounded-md h-[500px]">
        <h3 className="text-lg font-bold mb-2">Network Map</h3>
        {gameState.territories.length > 0 ? (
          <TerritoryMap 
            territories={gameState.territories} 
            onTerritoryClick={handleTerritoryClick}
            selectedTerritory={selectedTerritory}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-cyber-corp" />
            <span className="ml-2">Loading territories...</span>
          </div>
        )}
      </div>

      {/* Player hand and status */}
      <div className="col-span-1 cyber-border p-4 rounded-md">
        <h3 className="text-lg font-bold mb-2">Your Cards</h3>
        {currentPlayer ? (
          <div>
            <div className="mb-4">
              <p className="text-sm">Credits: {currentPlayer.resources.credits}</p>
              <p className="text-sm">Data tokens: {currentPlayer.resources.dataTokens}</p>
              <p className="text-sm">Faction: {currentPlayer.faction}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[350px]">
              {Object.keys(cardDefinitions).length === 0 ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-cyber-corp" />
                  <p className="mt-2 text-gray-400">Loading card data...</p>
                </div>
              ) : currentPlayer.hand && currentPlayer.hand.length > 0 ? (
                currentPlayer.hand.map(card => (
                  <div key={card.instanceId} onClick={() => handleCardClick(card)}>
                    <CardComponent 
                      card={card} 
                      isSelected={selectedCard?.instanceId === card.instanceId}
                      faction={currentPlayer.faction}
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">Your hand is empty</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-cyber-corp" />
            <p className="mt-2 text-gray-400">Loading player data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
