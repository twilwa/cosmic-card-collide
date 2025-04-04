
import React from 'react';
import { CardDefinition, CardEffect, FactionType } from '@/types/gameTypes';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CardComponentProps {
  cardDefinition: CardDefinition;
  isSelected: boolean;
  onClick?: () => void;
}

// Helper to format effect
const formatEffect = (effectDef: CardEffect | CardEffect[]): string => {
  if (Array.isArray(effectDef)) {
    // Show first effect summary if array
    return effectDef.length > 0 ? formatSingleEffect(effectDef[0]) + '...' : 'Complex Effects';
  } else {
    return formatSingleEffect(effectDef);
  }
};

const formatSingleEffect = (effect: CardEffect): string => {
  switch (effect.effectType) {
    case 'ADD_INFLUENCE': return `Add ${effect.effectValue} Influence`;
    case 'DRAW_CARD': return `Draw ${effect.count || 1} Card(s)`;
    case 'GAIN_RESOURCES': return `Gain ${effect.amount || effect.effectValue} ${effect.resource || 'Resources'}`;
    case 'DEAL_DAMAGE': return `Deal ${effect.amount || effect.effectValue} Damage`;
    case 'INCREASE_SECURITY': return `Increase Security by ${effect.value || effect.effectValue}`;
    case 'BREAK_ICE': return `Break ICE (Str ${effect.strength || effect.effectValue})`;
    // Add other cases...
    default: return effect.effectType.replace(/_/g, ' '); // Default formatting
  }
};

const CardComponent: React.FC<CardComponentProps> = ({ cardDefinition, isSelected, onClick }) => {
  if (!cardDefinition) {
    return (
      <Card className={cn(
        "relative h-[180px] w-[120px] animate-pulse",
        isSelected ? "ring-2 ring-primary" : ""
      )}>
        <CardContent className="p-2 h-full flex flex-col justify-between">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted rounded"></div>
            <div className="h-3 bg-muted rounded w-5/6"></div>
          </div>
          <div className="h-4 bg-muted rounded w-1/3 mt-2"></div>
        </CardContent>
      </Card>
    );
  }

  const isCorpCard = cardDefinition.faction === 'CORPORATION';
  const isRunnerCard = cardDefinition.faction === 'RUNNER';

  return (
    <Card 
      className={cn(
        "relative h-[180px] w-[120px] cursor-pointer transition-all",
        isSelected ? "ring-2 ring-primary" : "",
        isCorpCard ? "border-blue-400" : isRunnerCard ? "border-red-400" : "border-gray-400"
      )}
      onClick={onClick}
    >
      {/* Cost Badge */}
      <div className={cn(
        "absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
        isCorpCard ? "bg-blue-600 text-white" : isRunnerCard ? "bg-red-600 text-white" : "bg-gray-600 text-white"
      )}>
        {cardDefinition.cost}
      </div>

      <CardHeader className="p-2 pb-1">
        {/* Type */}
        <p className={cn(
          "text-xs uppercase font-bold",
          isCorpCard ? "text-blue-400" : isRunnerCard ? "text-red-400" : "text-gray-400"
        )}>
          {cardDefinition.type}
        </p>
        {/* Name */}
        <h3 className="text-sm font-bold leading-tight mt-0.5">
          {cardDefinition.name}
        </h3>
      </CardHeader>

      <CardContent className="p-2 pt-0 text-xs text-gray-300">
        {/* Description */}
        <p className="line-clamp-3 mb-1">
          {cardDefinition.description || cardDefinition.flavorText || ''}
        </p>
        {/* Effects */}
        {cardDefinition.effectDefinition && (
          <div className="mt-1 pt-1 border-t border-gray-700 text-xs text-gray-400">
            <p className="italic">
              {formatEffect(cardDefinition.effectDefinition)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardComponent;
