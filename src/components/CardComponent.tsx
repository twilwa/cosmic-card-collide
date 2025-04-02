
import React from 'react';
import { CardInstance } from '@/types/gameTypes';
import { useGameStore } from '@/store/gameStore';

interface CardProps {
  card: CardInstance;
  isSelected: boolean;
  faction: 'CORPORATION' | 'RUNNER';
}

const CardComponent: React.FC<CardProps> = ({ card, isSelected, faction }) => {
  const cardDefinition = useGameStore(state => state.getCardDefinition(card.definitionId));
  
  if (!cardDefinition) {
    return (
      <div className="cyber-border p-4 rounded-md bg-gray-800 opacity-80 relative h-[180px] w-full">
        <div className="animate-pulse flex flex-col h-full">
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="flex-1 bg-gray-700 rounded mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const factionClass = faction === 'CORPORATION' ? 'corp' : 'runner';
  const costColorClass = faction === 'CORPORATION' ? 'bg-cyber-corp' : 'bg-cyber-runner';
  
  return (
    <div className={`cyber-border p-4 rounded-md ${isSelected ? 'ring-2 ring-primary' : ''} relative h-[180px] transition-all hover:shadow-lg`}>
      <div className={`absolute top-2 right-2 ${costColorClass} text-white font-bold text-sm rounded-full w-6 h-6 flex items-center justify-center`}>
        {cardDefinition.cost}
      </div>
      
      <div className={`text-xs uppercase font-bold mb-1 ${
        faction === 'CORPORATION' ? 'text-cyber-corp' : 'text-cyber-runner'
      }`}>
        {cardDefinition.type}
      </div>
      
      <h3 className="text-base font-bold mb-2 text-white leading-tight">{cardDefinition.name}</h3>
      
      <p className="text-xs text-gray-300 mb-2 overflow-hidden text-ellipsis" style={{maxHeight: "60px"}}>
        {cardDefinition.description}
      </p>
      
      <div className="absolute bottom-2 left-4 right-4">
        <div className="border-t border-gray-600 pt-1 text-xs text-gray-400">
          {cardDefinition.effects && cardDefinition.effects.map((effect: any, i: number) => (
            <div key={i} className="italic">
              {effect.type?.replace('_', ' ')}: {effect.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
