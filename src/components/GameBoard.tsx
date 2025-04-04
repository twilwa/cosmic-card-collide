
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GameCanvas from '@/components/GameCanvas';
import { useGameStore } from '@/store/gameStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { GamePhase, MessageType } from '@/types/gameTypes';

interface CardProps {
	id: string;
	name: string;
	cost: number;
	type: string;
	faction: string;
	description: string;
	onClick?: () => void;
	isSelected?: boolean;
}

const GameCard: React.FC<CardProps> = ({
	id, name, cost, type, faction, description, onClick, isSelected
}) => {
	return (
		<Card
			className={`w-32 h-48 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
			onClick={onClick}
		>
			<CardContent className="p-2">
				<div className="text-xs font-bold">{name}</div>
				<div className="text-xs">Cost: {cost}</div>
				<div className="text-xs">Type: {type}</div>
				<div className="text-xs">Faction: {faction}</div>
				<div className="text-xs mt-2 text-gray-400 line-clamp-3">{description}</div>
			</CardContent>
		</Card>
	);
};

const GameBoard = () => {
	// Get game state from Zustand store - Fixed the selector to avoid creating functions inside it
	const gameState = useGameStore(state => state.gameState);
	const currentPlayer = useGameStore(state => state.currentPlayer);
	const cardDefinitions = useGameStore(state => state.cardDefinitions);
	const myClientId = useGameStore(state => state.myClientId);
	const isPlayerTurn = useGameStore(state => state.isPlayerTurn);
	const phase = useGameStore(state => state.phase);
	const selectedCardInstanceId = useGameStore(state => state.selectedCardId);
	const setSelectedCard = useGameStore(state => state.selectCard);

	// Get territories from game state
	const territories = gameState?.territories || [];

	// Get player hand from game state
	const myHand = gameState?.playerHand || [];

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
			description: `Selected Territory: ${territoryId}. Territory actions will be implemented soon`
		});
	};

	// Card click handler
	const handleCardClick = (cardId: string) => {
		setSelectedCard(cardId);
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

				{/* Main game area - Replace TerritoryMap with GameCanvas */}
				<div className="col-span-2 flex flex-col gap-4">
					{phase === 'OVERWORLD' && (
						<GameCanvas
							phase={phase as GamePhase}
							territories={territories}
							onTerritoryClick={handleTerritoryClick}
							width={800}
							height={500}
						/>
					)}

					{phase === 'SCENARIO' && (
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
							<GameCard
								key={card.id}
								id={card.id}
								name={card.name}
								cost={card.cost}
								type={card.type}
								faction={card.faction}
								description={card.description}
								onClick={() => handleCardClick(card.id)}
								isSelected={selectedCardInstanceId === card.id}
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
