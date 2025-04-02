
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { MessageType, CardInstance } from '@/types/gameTypes';
import TerritoryMap from './TerritoryMap';
import { Separator } from '@/components/ui/separator';
import { CircleX, Star } from 'lucide-react';

const GameBoard: React.FC = () => {
  const { 
    gameState, 
    handleGameMessage, 
    isMyTurn,
    selectCard,
    selectTerritory,
    selectedCardId,
    selectedTerritoryId
  } = useGameStore();
  
  const { connected, connecting, sendMessage } = useWebSocket({
    url: 'ws://localhost:8080', // This won't be used since we're using mocks
    onMessage: (message) => {
      handleGameMessage(message);
    },
  });
  
  const handleEndTurn = () => {
    sendMessage({
      type: MessageType.END_TURN,
      timestamp: Date.now(),
    });
    
    // For mock functionality, simulate a turn change
    handleGameMessage({
      type: MessageType.TURN_CHANGE,
      timestamp: Date.now(),
      currentPlayerId: 'player-2',
      turnNumber: gameState?.turnNumber ? gameState.turnNumber + 1 : 1
    });
    
    // Clear selections
    selectCard(null);
    selectTerritory(null);
  };
  
  const handlePlayCard = () => {
    if (!selectedCardId) return;
    
    const targetId = selectedTerritoryId;
    
    sendMessage({
      type: MessageType.PLAY_CARD,
      timestamp: Date.now(),
      cardInstanceId: selectedCardId,
      targetId,
    });
    
    // For mock functionality, simulate discarding the card
    const myPlayer = gameState?.players.find(p => p.id === 'player-1');
    if (myPlayer) {
      const playedCard = myPlayer.hand.find(c => c.instanceId === selectedCardId);
      if (playedCard) {
        // Update hand
        const updatedHand = myPlayer.hand.filter(c => c.instanceId !== selectedCardId);
        handleGameMessage({
          type: MessageType.PLAYER_HAND_UPDATE,
          timestamp: Date.now(),
          playerId: 'player-1',
          hand: updatedHand
        });
        
        // Update discard
        const updatedDiscard = [...myPlayer.discard, playedCard];
        handleGameMessage({
          type: MessageType.PLAYER_DISCARD_UPDATE,
          timestamp: Date.now(),
          playerId: 'player-1',
          discard: updatedDiscard
        });
        
        // If there was a target territory, update its influence
        if (targetId) {
          const territory = gameState?.territories.find(t => t.id === targetId);
          if (territory) {
            const updatedTerritory = {
              ...territory,
              influence: {
                ...territory.influence,
                'player-1': (territory.influence['player-1'] || 0) + 1
              }
            };
            
            // Update territory control if player has majority influence
            const totalInfluence = Object.values(updatedTerritory.influence).reduce((sum, val) => sum + val, 0);
            const playerInfluence = updatedTerritory.influence['player-1'] || 0;
            
            if (playerInfluence > totalInfluence / 2) {
              updatedTerritory.controlledBy = 'player-1';
            }
            
            handleGameMessage({
              type: MessageType.TERRITORY_UPDATE,
              timestamp: Date.now(),
              territory: updatedTerritory
            });
          }
        }
      }
    }
    
    // Clear selections
    selectCard(null);
    selectTerritory(null);
  };
  
  // Initialize game on first render if not connected
  useEffect(() => {
    if (!gameState && !connecting && !connected) {
      // This will trigger the mock connection which will send initial game state
      sendMessage({
        type: MessageType.CONNECTION_ACK,
        timestamp: Date.now()
      });
    }
  }, [gameState, connecting, connected, sendMessage]);
  
  // Loading state
  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="cyber-border p-6 rounded-md glow-corp">
          <h2 className="text-2xl text-center text-primary">Initializing Neural NetLink...</h2>
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Get my player
  const myPlayer = gameState.players.find(p => p.id === 'player-1');
  const faction = myPlayer?.faction;
  
  return (
    <div className="min-h-screen p-4">
      <div className="cyber-border p-2 mb-4 rounded-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className={`cyber-border p-2 rounded-md ${faction === 'CORPORATION' ? 'glow-corp' : 'glow-runner'}`}>
              <span className="text-sm">Faction: {faction}</span>
            </div>
            <div className="cyber-border p-2 rounded-md">
              <span className="text-sm">Credits: {myPlayer?.resources.credits}</span>
            </div>
            <div className="cyber-border p-2 rounded-md">
              <span className="text-sm">Data: {myPlayer?.resources.dataTokens}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="cyber-border p-2 rounded-md">
              <span className="text-sm">Turn: {gameState.turnNumber || 'Waiting'}</span>
            </div>
            <div className="cyber-border p-2 rounded-md">
              <span className="text-sm">Phase: {gameState.phase}</span>
            </div>
            <Button 
              variant="outline" 
              className={`border-none ${isMyTurn() ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
              disabled={!isMyTurn()}
              onClick={handleEndTurn}
            >
              End Turn
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="cyber-border p-2 rounded-md min-h-[400px]">
            <h2 className="text-xl mb-2">Territory Map</h2>
            <TerritoryMap />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="cyber-border p-2 rounded-md min-h-[400px]">
            <h2 className="text-xl mb-2">Game Status</h2>
            
            <div className="mb-4">
              <h3 className="text-lg mb-1">Selected Card</h3>
              {selectedCardId ? (
                <div className="flex items-center justify-between bg-card p-2 rounded-md">
                  <span>
                    {myPlayer?.hand.find(c => c.instanceId === selectedCardId)?.instanceId}
                  </span>
                  <button 
                    className="text-destructive hover:text-destructive/80"
                    onClick={() => selectCard(null)}
                  >
                    <CircleX size={16} />
                  </button>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">No card selected</div>
              )}
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg mb-1">Selected Territory</h3>
              {selectedTerritoryId ? (
                <div className="flex items-center justify-between bg-card p-2 rounded-md">
                  <span>
                    {gameState.territories.find(t => t.id === selectedTerritoryId)?.name}
                  </span>
                  <button 
                    className="text-destructive hover:text-destructive/80"
                    onClick={() => selectTerritory(null)}
                  >
                    <CircleX size={16} />
                  </button>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">No territory selected</div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <Button
              disabled={!selectedCardId}
              className={`w-full ${faction === 'CORPORATION' ? 'bg-cyber-corp hover:bg-cyber-corp/80' : 'bg-cyber-runner hover:bg-cyber-runner/80'}`}
              onClick={handlePlayCard}
            >
              Play Selected Card
            </Button>
          </div>
          
          <div className="mt-4 cyber-border p-2 rounded-md">
            <h2 className="text-xl mb-2">Controlled Territories</h2>
            <div className="space-y-2">
              {gameState.territories
                .filter(t => t.controlledBy === 'player-1')
                .map(territory => (
                  <div key={territory.id} className="flex items-center justify-between bg-card p-2 rounded-md">
                    <span>{territory.name}</span>
                    <Star size={16} className="text-yellow-500" />
                  </div>
                ))}
              
              {gameState.territories.filter(t => t.controlledBy === 'player-1').length === 0 && (
                <div className="text-muted-foreground text-sm">No territories controlled</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 cyber-border p-2 rounded-md">
        <h2 className="text-xl mb-2">Your Hand</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <HandCards />
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  instance: CardInstance;
  definition: any;
  isSelected: boolean;
  onSelect: () => void;
}

const CardComponent: React.FC<CardProps> = ({ instance, definition, isSelected, onSelect }) => {
  const factionClass = definition.faction === 'CORPORATION' ? 'corp' : 'runner';
  const costColorClass = definition.faction === 'CORPORATION' ? 'bg-cyber-corp' : 'bg-cyber-runner';
  
  return (
    <div className="card-container">
      <div 
        className={`card ${factionClass} ${isSelected ? 'ring-2 ring-primary' : ''}`}
        onClick={onSelect}
      >
        <div className={`card-cost ${costColorClass}`}>{definition.cost}</div>
        <div className={`card-type bg-${factionClass === 'corp' ? 'cyber-corp/20' : 'cyber-runner/20'}`}>
          {definition.type}
        </div>
        <h3 className="text-center font-bold mt-4 mb-2">{definition.name}</h3>
        <p className="text-xs text-muted-foreground mb-2">{definition.description}</p>
        <div className="text-xs border-t border-border pt-1">
          {definition.effects.map((effect: any, i: number) => (
            <div key={i} className="italic">
              {effect.type.replace('_', ' ')}: {effect.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HandCards: React.FC = () => {
  const { gameState, cardDefinitions, getMyPlayer, selectedCardId, selectCard } = useGameStore();
  
  const myPlayer = getMyPlayer();
  
  if (!myPlayer || !myPlayer.hand.length) {
    return <div className="col-span-full text-muted-foreground text-center py-4">Your hand is empty</div>;
  }
  
  return (
    <>
      {myPlayer.hand.map(card => {
        const definition = cardDefinitions[card.definitionId];
        if (!definition) return null;
        
        return (
          <CardComponent 
            key={card.instanceId}
            instance={card}
            definition={definition}
            isSelected={selectedCardId === card.instanceId}
            onSelect={() => selectCard(card.instanceId)}
          />
        );
      })}
    </>
  );
};

export default GameBoard;
