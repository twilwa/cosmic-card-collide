// src/components/GameBoard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { MessageType, Territory, CardInstance, GamePhase, Player, EndTurnMessage, PlayCardMessage } from '@/types/gameTypes'; // Import needed types
import { useGameStore } from '@/store/gameStore';
import TerritoryMap from './TerritoryMap'; // Keep for now, refactor later
import CardComponent from './CardComponent';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const GameBoard: React.FC = () => {
	const { toast } = useToast();
	// Local component state for UI interaction tracking
	const [selectedCardInstanceId, setSelectedCardInstanceId] = useState<string | null>(null);
	const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | null>(null);

	// WebSocket connection hook
	const { sendMessage, connected } = useWebSocket();

	// Zustand store selectors
	const gameState = useGameStore(state => state.gameState);
	const cardDefinitions = useGameStore(state => state.cardDefinitions); // Ensure loaded via message
	const getCardDefinition = useGameStore(state => state.getCardDefinition);
	const myClientId = useGameStore(state => state.myClientId);
	const currentPlayer = useGameStore(state => state.getMyPlayer());
	const isPlayerTurn = useGameStore(state => state.isMyTurn());
	const phase = useGameStore(state => state.phase);

	// Derived state from store
	const myHand = currentPlayer?.hand ?? [];
	const selectedCardInstance = selectedCardInstanceId ? myHand.find(c => c.instanceId === selectedCardInstanceId) : null;
	const selectedCardDef = selectedCardInstance ? getCardDefinition(selectedCardInstance.definitionId) : null;
	const selectedTerritoryObject = selectedTerritoryId ? gameState?.territories.find(t => t.id === selectedTerritoryId) : null; // Find the object if needed
	const territories = gameState?.territories ?? [];
	const players = gameState?.players ?? []; // Assuming players is an array in store state based on original code

	// Effect for sending PLAY_CARD message
	useEffect(() => {
		if (selectedCardInstanceId && selectedCardDef) {
			const needsTarget = !!selectedCardDef.targetType; // Example logic
			const targetSelected = !!selectedTerritoryId;

			if (needsTarget && targetSelected) {
				console.log(`Attempting to play card ${selectedCardInstanceId} on target ${selectedTerritoryId}`);
				const playCardMsg: PlayCardMessage = { // Use correct type
					type: MessageType.PLAY_CARD,
					payload: {
						cardInstanceId: selectedCardInstanceId,
						targetId: selectedTerritoryId,
					},
					timestamp: Date.now() // Add timestamp if BaseMessage requires it
				};
				sendMessage(playCardMsg);
				// Reset selections after sending
				setSelectedCardInstanceId(null);
				setSelectedTerritoryId(null);
			}
		}
		// Only trigger when selections potentially complete an action
	}, [selectedCardInstanceId, selectedTerritoryId, selectedCardDef, sendMessage]);


	const handleEndTurn = () => {
		if (!isPlayerTurn || phase !== GamePhase.TURN_BASED) {
			toast({ title: "Cannot End Turn", description: "It's not your turn or game is not in the correct phase.", variant: "destructive" });
			return;
		};
		const endTurnMsg: EndTurnMessage = { // Use correct type
			type: MessageType.END_TURN,
			payload: {},
			timestamp: Date.now() // Add timestamp if BaseMessage requires it
		};
		sendMessage(endTurnMsg);
	};

	const handleCardClick = (card: CardInstance) => {
		if (!isPlayerTurn) {
			toast({ title: "Not your turn", variant: "destructive" });
			return;
		}
		const newSelectedId = selectedCardInstanceId === card.instanceId ? null : card.instanceId;
		setSelectedCardInstanceId(newSelectedId);
		setSelectedTerritoryId(null); // Clear target when selecting/deselecting card

		if (newSelectedId) {
			const def = getCardDefinition(card.definitionId);
			if (def?.targetType) {
				toast({ title: "Card Selected", description: `Select a ${def.targetType.toLowerCase()} target for ${def.name}` });
			} else if (def) {
				toast({ title: "Card Selected", description: `${def.name} (No target)` });
				// Consider adding a button/logic to play non-targeted cards here
			}
		} else {
			toast({ title: "Card Deselected" });
		}
	};

	const handleTerritoryClick = (territory: Territory) => {
		if (!isPlayerTurn) {
			toast({ title: "Not your turn", variant: "destructive" });
			return;
		}

		if (selectedCardInstanceId && selectedCardDef?.targetType === 'TERRITORY') {
			// Set this territory as the target for the selected card
			setSelectedTerritoryId(territory.id);
			toast({ title: "Target Selected", description: `${territory.name} targeted for ${selectedCardDef.name}. Playing card...` });
			// The useEffect will handle sending the message
		} else {
			// Normal territory selection (toggle)
			const newSelectedTerritoryId = selectedTerritoryId === territory.id ? null : territory.id;
			setSelectedTerritoryId(newSelectedTerritoryId);
			setSelectedCardInstanceId(null); // Deselect card
			if (newSelectedTerritoryId) {
				toast({ title: "Territory Selected", description: `${territory.name}` });
			} else {
				toast({ title: "Territory Deselected" });
			}
		}
	};

	// Loading State UI
	if (!connected || !gameState || players.length === 0) {
		return (
			<div className="flex justify-center items-center min-h-[80vh]">
				<div className="animate-pulse cyber-border p-6 rounded-md glow-corp">
					<h2 className="text-2xl font-bold text-center text-cyber-corp mb-4">
						{connected ? "Loading Game Data..." : "Connecting to Network..."}
					</h2>
					<Loader2 className="h-8 w-8 animate-spin text-cyber-corp mx-auto" />
				</div>
			</div>
		);
	}

	// Main Game Board Render
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
			{/* Game Status */}
			<div className="col-span-1 lg:col-span-3 cyber-border p-4 rounded-md">
				<div className="flex justify-between items-center">
					<div>
						<h2 className="text-xl font-bold">
							{phase === GamePhase.WAITING ? "Waiting..." :
								phase === GamePhase.TURN_BASED ? `Turn ${gameState.turnNumber}` :
									phase === GamePhase.GAME_OVER ? "Game Over" :
										"Loading..."}
						</h2>
						<p className="text-sm">Phase: <span className="font-semibold">{phase}</span></p>
						<p className="text-sm">
							Current Player: {gameState.currentPlayerId ?
								(players.find(p => p.id === gameState.currentPlayerId)?.displayName ?? gameState.currentPlayerId) :
								'None'}
							{gameState.currentPlayerId === myClientId && <span className="text-cyber-runner font-bold ml-2">(Your Turn!)</span>}
						</p>
					</div>
					<div>
						<Button
							onClick={handleEndTurn}
							disabled={!isPlayerTurn || phase !== GamePhase.TURN_BASED}
							className={`${isPlayerTurn ? "bg-cyber-runner hover:bg-pink-700" : "bg-gray-700"} text-white`} // Runner color for action button?
						>
							End Turn
						</Button>
					</div>
				</div>
			</div>

			{/* Territory map */}
			<div className="col-span-1 lg:col-span-2 cyber-border p-4 rounded-md h-[500px] overflow-hidden"> {/* Added overflow-hidden */}
				<h3 className="text-lg font-bold mb-2 text-left">Network Map</h3> {/* Align left */}
				{territories.length > 0 ? (
					// Important TODO: Replace TerritoryMap with PixiCanvas/OverworldRenderer integration
					<TerritoryMap
						territories={territories}
						onTerritoryClick={handleTerritoryClick}
						selectedTerritory={selectedTerritoryObject} // Pass the actual selected territory object
					/>
				) : (
					<div className="flex items-center justify-center h-full">
						<Loader2 className="h-8 w-8 animate-spin text-cyber-corp" />
						<span className="ml-2">Loading territories...</span>
					</div>
				)}
			</div>

			{/* Player Hand & Status */}
			<div className="col-span-1 cyber-border p-4 rounded-md flex flex-col"> {/* Use flex-col */}
				<h3 className="text-lg font-bold mb-2 text-left">Operator Console</h3> {/* Align left */}
				{currentPlayer ? (
					<div className="flex flex-col flex-grow"> {/* Make inner div flex-col and grow */}
						<div className="mb-4 border-b border-gray-700 pb-2"> {/* Section for stats */}
							<p className="text-sm">User: <span className="font-semibold text-primary">{currentPlayer.displayName ?? 'Guest'}</span></p>
							<p className="text-sm">Faction: <span className={`font-semibold ${currentPlayer.faction === 'CORPORATION' ? 'text-cyber-corp' : 'text-cyber-runner'}`}>{currentPlayer.faction ?? 'N/A'}</span></p>
							<p className="text-sm">Credits: <span className="font-semibold text-green-400">{currentPlayer.resources?.credits ?? 0}</span></p>
							{/* Add other resources if needed */}
							<p className="text-sm">Deck: {currentPlayer.deck?.length ?? 0} | Discard: {currentPlayer.discard?.length ?? 0}</p>
						</div>

						<div className="flex-grow overflow-y-auto space-y-2 pr-2"> {/* Scrollable hand area */}
							{Object.keys(cardDefinitions).length === 0 ? (
								<div className="text-center py-8">
									<Loader2 className="h-8 w-8 animate-spin mx-auto text-cyber-corp" />
									<p className="mt-2 text-gray-400">Loading card data...</p>
								</div>
							) : myHand.length > 0 ? (
								myHand.map(card => (
									<div key={card.instanceId} onClick={() => handleCardClick(card)}>
										<CardComponent
											card={card}
											isSelected={selectedCardInstanceId === card.instanceId}
											faction={currentPlayer.faction!} // Assert non-null as player exists
										/>
									</div>
								))
							) : (
								<p className="text-sm text-center text-gray-400 py-8">Hand is empty</p>
							)}
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center h-full">
						<Loader2 className="h-8 w-8 animate-spin text-cyber-corp" />
						<p className="mt-2 text-gray-400">Loading player data...</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default GameBoard;
