
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { MessageType, CardInstance, GamePhase } from '@/types/gameTypes';
import TerritoryMap from './TerritoryMap';
import { Separator } from '@/components/ui/separator';
import { CircleX, Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const GameBoard: React.FC = () => {
  const { toast } = useToast();
  const { 
    gameState, 
    handleGameMessage, 
    isMyTurn,
    selectCard,
    selectTerritory,
    selectedCardId,
    selectedTerritoryId,
    getMyPlayer,
    getCardDefinition
  } = useGameStore();
  
  const [isInitializing, setIsInitializing] = useState(true);
  
  const { connected, connecting, sendMessage } = useWebSocket({
    url: 'ws://localhost:8080', // This won't be used since we're using mocks
    onMessage: (message) => {
      handleGameMessage(message);
    },
  });
  
  const handleEndTurn = () => {
    sendMessage({
      type: MessageType.END_TURN,
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
    toast({
      title: "Turn ended",
      description: "Waiting for opponent's turn"
    });
  };
  
  const handlePlayCard = () => {
    if (!selectedCardId) return;
    
    const targetId = selectedTerritoryId;
    const myPlayer = getMyPlayer();
    
    if (!myPlayer) return;
    
    const playedCard = myPlayer.hand.find(c => c.instanceId === selectedCardId);
    if (!playedCard) return;
    
    const cardDef = getCardDefinition(playedCard.definitionId);
    if (!cardDef) return;
    
    // Check if card requires a target and one isn't selected
    const requiresTarget = cardDef.effects.some(effect => effect.targetRequired);
    if (requiresTarget && !targetId) {
      toast({
        title: "Target required",
        description: "This card requires a territory target",
        variant: "destructive"
      });
      return;
    }
    
    sendMessage({
      type: MessageType.PLAY_CARD,
      cardInstanceId: selectedCardId,
      targetId,
    });
    
    // For mock functionality, simulate playing the card
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
      const updatedDiscard = [...(myPlayer.discard || []), playedCard];
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
          
          toast({
            title: "Card played",
            description: `Added influence to ${territory.name}`
          });
        }
      } else {
        toast({
          title: "Card played",
          description: cardDef.description
        });
      }
    }
    
    // Clear selections
    selectCard(null);
    selectTerritory(null);
  };
  
  // Initialize game on mount
  useEffect(() => {
    if (!gameState && !connecting && !connected) {
      setIsInitializing(true);
      // This will trigger the mock connection which will send initial game state
      sendMessage({
        type: MessageType.CONNECTION_ACK,
      });
    } else if (gameState && isInitializing) {
      setIsInitializing(false);
    }
  }, [gameState, connecting, connected, sendMessage, isInitializing]);
  
  // Loading state
  if (isInitializing || !gameState) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
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
  const myPlayer = getMyPlayer();
  const faction = myPlayer?.faction;
  
  return (
    <div className="min-h-[80vh] p-4">
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
              className={`border-none ${isMyTurn() ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
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
                  {(() => {
                    const card = myPlayer?.hand.find(c => c.instanceId === selectedCardId);
                    const def = card ? getCardDefinition(card.definitionId) : null;
                    return (
                      <span>
                        {def?.name || card?.instanceId || "Unknown Card"}
                      </span>
                    );
                  })()}
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
              disabled={!selectedCardId || !isMyTurn()}
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

// Extract CardComponent to its own component
const CardComponent: React.FC<{
  instance: CardInstance;
  definition: any;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ instance, definition, isSelected, onSelect }) => {
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

// Extract HandCards to its own component
const HandCards: React.FC = () => {
  const { getMyPlayer, cardDefinitions, selectedCardId, selectCard } = useGameStore();
  
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
