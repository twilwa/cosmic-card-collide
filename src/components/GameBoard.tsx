
import React, { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { MessageType, GameState, Territory, CardDefinition, CardInstance, Player, FactionType, ClientToServerMessage, GamePhase } from '@/types/gameTypes';
import { useGameStore } from '@/store/gameStore';
import TerritoryMap from './TerritoryMap';
import CardComponent from './CardComponent';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const GameBoard: React.FC = () => {
  const { toast } = useToast();
  const [selectedCard, setSelectedCard] = useState<CardInstance | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const { sendMessage, lastMessage, connected } = useWebSocket();
  const {
    gameState,
    setGameState,
    setCardDefinitions,
    currentPlayer,
    isPlayerTurn,
    phase,
  } = useGameStore();

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

    try {
      switch (lastMessage.type) {
        case MessageType.GAME_STATE_INIT:
          setGameState(lastMessage.gameState);
          break;
        case MessageType.ALL_CARD_DEFINITIONS:
          setCardDefinitions(lastMessage.cardDefinitions);
          break;
        case MessageType.PLAYER_HAND_UPDATE:
          if (currentPlayer && lastMessage.playerId === currentPlayer.id) {
            const updatedPlayer = { ...currentPlayer, hand: lastMessage.hand };
            const updatedGameState = {
              ...gameState,
              players: gameState.players.map(p => 
                p.id === updatedPlayer.id ? updatedPlayer : p
              )
            };
            setGameState(updatedGameState);
          }
          break;
        case MessageType.TERRITORY_UPDATE:
          if (gameState) {
            const updatedGameState = {
              ...gameState,
              territories: gameState.territories.map(t => 
                t.id === lastMessage.territory.id ? lastMessage.territory : t
              )
            };
            setGameState(updatedGameState);
          }
          break;
        case MessageType.CONNECTION_ACK:
          toast({
            title: "Connected",
            description: "Connected to game server"
          });
          break;
        case MessageType.ERROR:
          toast({
            title: "Error",
            description: lastMessage.message || "An error occurred",
            variant: "destructive"
          });
          break;
        default:
          console.log('Unhandled message type:', lastMessage.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }, [lastMessage, setGameState, setCardDefinitions, gameState, currentPlayer, toast]);

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
        <TerritoryMap 
          territories={gameState.territories} 
          onTerritoryClick={handleTerritoryClick}
          selectedTerritory={selectedTerritory}
        />
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
              {currentPlayer.hand.map(card => (
                <div key={card.instanceId} onClick={() => handleCardClick(card)}>
                  <CardComponent 
                    card={card} 
                    isSelected={selectedCard?.instanceId === card.instanceId}
                    faction={currentPlayer.faction}
                  />
                </div>
              ))}
              {currentPlayer.hand.length === 0 && (
                <p className="text-sm text-gray-400">Your hand is empty</p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading player data...</p>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
