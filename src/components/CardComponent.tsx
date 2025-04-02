// src/components/CardComponent.tsx
import React from 'react';
// Correctly import types from your single source
import { CardInstance, CardDefinition, FactionType, CardEffect } from '@/types/gameTypes';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CardComponentProps {
	card: CardInstance;
	isSelected: boolean;
	faction: FactionType | null; // Player's faction (can be null if not assigned)
}

// Helper to format effect (customize as needed)
const formatEffect = (effectDef: CardEffect | CardEffect[]): string => {
	if (Array.isArray(effectDef)) {
		// Show first effect summary if array
		return effectDef.length > 0 ? formatSingleEffect(effectDef[0]) + '...' : 'Complex Effects';
	} else {
		return formatSingleEffect(effectDef);
	}
};

const formatSingleEffect = (effect: CardEffect): string => {
	switch (effect.effect) {
		case 'ADD_INFLUENCE': return `Add ${effect.value} Influence`;
		case 'DRAW_CARD': return `Draw ${effect.count} Card(s)`;
		case 'GAIN_RESOURCES': return `Gain ${effect.amount} ${effect.resource}`;
		case 'DEAL_DAMAGE': return `Deal ${effect.amount} Damage`;
		case 'INCREASE_SECURITY': return `Increase Security by ${effect.value}`;
		case 'BREAK_ICE': return `Break ICE (Str ${effect.strength})`;
		// Add other cases...
		default: return effect.effect.replace(/_/g, ' '); // Default formatting
	}
};


const CardComponent: React.FC<CardComponentProps> = ({ card, isSelected, faction }) => {
	const cardDefinition = useGameStore(state => state.getCardDefinition(card.definitionId));

	// --- Loading Skeleton ---
	if (!cardDefinition) {
		return (
			<Card className={cn(
				"cyber-border bg-card/80 relative h-[180px] w-full animate-pulse",
				// Use a neutral glow if player faction isn't known yet
				faction === 'CORPORATION' ? 'glow-corp' : faction === 'RUNNER' ? 'glow-runner' : 'animate-pulse-glow-neutral'
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

	// --- Actual Card Render ---
	const isCorpCard = cardDefinition.faction === 'CORPORATION';
	const isRunnerCard = cardDefinition.faction === 'RUNNER';

	// Card faction determines primary theme/border/glow
	const cardFactionGlowClass = isCorpCard ? 'animate-pulse-glow-corp' : isRunnerCard ? 'animate-pulse-glow-runner' : ''; // Add glow animation
	const cardFactionBorderClass = isCorpCard ? 'border-cyber-corp' : isRunnerCard ? 'border-cyber-runner' : 'border-cyber-neutral'; // Use Tailwind colors

	// Cost badge styling
	const costColorClass = isCorpCard ? 'bg-cyber-corp' : isRunnerCard ? 'bg-cyber-runner' : 'bg-cyber-neutral';
	const costTextColorClass = isCorpCard ? 'text-cyber-corp-foreground' : isRunnerCard ? 'text-cyber-runner-foreground' : 'text-cyber-neutral-foreground';

	// Type text styling
	const typeColorClass = isCorpCard ? 'text-cyber-corp' : isRunnerCard ? 'text-cyber-runner' : 'text-cyber-neutral';


	return (
		<Card className={cn(
			"cyber-border game-card", // Use game-card class from index.css
			cardFactionBorderClass,
			isSelected ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : '',
			cardFactionGlowClass // Apply animated glow
		)}>
			{/* Cost Badge */}
			<div className={cn(
				"card-cost-badge", // Use class from index.css
				costColorClass,
				costTextColorClass
			)}>
				{cardDefinition.cost}
			</div>

			<CardHeader className="p-2 pb-1">
				{/* Type and SubType */}
				<p className={cn("text-[10px] uppercase font-bold tracking-wider", typeColorClass)}>
					{cardDefinition.subType}
					{/* Optionally show main type if needed: ({cardDefinition.type}) */}
				</p>
				{/* Title */}
				<CardTitle className="text-sm font-bold leading-tight mt-0.5">
					{cardDefinition.name}
				</CardTitle>
			</CardHeader>

			<CardContent className="p-2 pt-0 text-xs text-gray-300 overflow-hidden flex-grow">
				{/* Description or Flavor Text */}
				<p className="line-clamp-3 mb-1">
					{cardDefinition.description || cardDefinition.flavorText || ''}
				</p>
				{/* Formatted Effect Summary */}
				{cardDefinition.effectDefinition && (
					<div className="mt-1 pt-1 border-t border-border/50 text-[10px] text-gray-400 space-y-0.5">
						<div className="italic truncate">
							{formatEffect(cardDefinition.effectDefinition)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default CardComponent;
