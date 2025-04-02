
import React from 'react';
import { CardInstance } from '@/types/gameTypes';

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

export default CardComponent;
