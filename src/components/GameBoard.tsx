
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GameCanvas from '@/components/GameCanvas';
import { useGameStore } from '@/store/gameStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { GamePhase } from '@/types/gameTypes';
import CardComponent from '@/components/CardComponent';

const GameBoard = () => {
  // Get game state from Zustand store using a memoized selector
  const { 
    territories,
    currentPlayer,
    cardDefinitions,
    myClientId,
    isPlayerTurn,
    phase,
    selectedCardId,
    myHand,
    selectCard
  } = useGameStore();

  // Get WebSocket functionality
  const { isConnected, sendMessage } = useWebSocket();

  // Local state for UI (can be moved to store later if needed)
  const [resources, setResources] = useState({ credits: 5, dataTokens: 3 });
  const [turnNumber, setTurnNumber] = useState(1);
  const [deckSize, setDeckSize] = useState(30);
  const [discardSize, setDiscardSize] = useState(0);

  // Territory click handler
  const handleTerritoryClick = (territoryId: string) => {
    console.log(`Territory clicked: ${territoryId}`);
    // Add territory selection logic using the store
    toast({
      title: `Selected Territory: ${territoryId}`,
      description: "Territory actions will be implemented soon"
    });
  };

  // Card click handler
  const handleCardClick = (instanceId: string) => {
    selectCard(instanceId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-secondary p-4 rounded-md shadow-md">
        <h2 className="text-xl font-semibold text-secondary-foreground">End of Line</h2>
        <p className="text-sm text-secondary-foreground">Turn: {turnNumber} | Phase: {phase} | Current Player: {currentPlayer}</p>
      </div>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* Left sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-background border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <p>Credits: {resources.credits}</p>
            <p>Data Tokens: {resources.dataTokens}</p>
          </div>
          
          <div className="bg-background border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold">Deck</h3>
            <p>Cards left: {deckSize}</p>
            <p>Discard pile: {discardSize}</p>
          </div>
        </div>
        
        {/* Main game area */}
        <div className="col-span-2 flex flex-col gap-4">
          {phase === GamePhase.OVERWORLD && (
            <GameCanvas 
              phase={phase}
              territories={territories}
              onTerritoryClick={handleTerritoryClick}
              width={800}
              height={500}
            />
          )}
          
          {phase === GamePhase.SCENARIO && (
            <div className="border border-gray-700 rounded-lg bg-black/50 h-[500px] flex items-center justify-center">
              <p className="text-center text-gray-400">Scenario mode - Coming soon</p>
            </div>
          )}
          
          <div className="flex justify-between">
            <Button variant="secondary" disabled={!isPlayerTurn}>End Turn</Button>
          </div>
        </div>
      </div>
      
      {/* Card Hand */}
      <div className="bg-muted p-4 rounded-md">
        <h3 className="text-lg font-semibold">Your Hand</h3>
        <div className="flex gap-2 overflow-x-auto">
          {myHand.map((cardInstanceId) => {
            const card = cardDefinitions[cardInstanceId];
            if (!card) return null;
            
            return (
              <CardComponent
                key={cardInstanceId}
                cardDefinition={card}
                isSelected={selectedCardId === cardInstanceId}
                onClick={() => handleCardClick(cardInstanceId)}
              />
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-secondary p-4 rounded-md shadow-md">
        <p className="text-sm text-secondary-foreground text-center">
          {isConnected ? 'Connected to server' : 'Disconnected from server'}
        </p>
      </div>
    </div>
  );
};

export default GameBoard;
