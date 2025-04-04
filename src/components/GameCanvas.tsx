
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import OverworldRenderer from '@/pixi/OverworldRenderer';
import { GamePhase, Territory } from '@/types/gameTypes';

interface GameCanvasProps {
  phase: GamePhase;
  territories: Territory[];
  onTerritoryClick?: (territoryId: string) => void;
  width?: number;
  height?: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  phase,
  territories,
  onTerritoryClick,
  width = 800,
  height = 600
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const overworldRendererRef = useRef<OverworldRenderer | null>(null);

  // Initialize PIXI application
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Check if we already have an app
    if (appRef.current) {
      return;
    }

    // Create PIXI Application
    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x000000,
      antialias: true,
    });
    
    // Add to DOM
    canvasRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;
    
    // Initialize renderers
    overworldRendererRef.current = new OverworldRenderer().initialize(app);

    // Cleanup on unmount
    return () => {
      if (overworldRendererRef.current) {
        overworldRendererRef.current.destroy();
      }
      
      if (appRef.current) {
        appRef.current.destroy(true, true);
        appRef.current = null;
      }
    };
  }, [width, height]);

  // Handle phase changes and territory updates
  useEffect(() => {
    if (!appRef.current || !overworldRendererRef.current) return;

    if (phase === 'OVERWORLD' && territories.length > 0) {
      // Render territories in overworld phase
      overworldRendererRef.current.renderTerritories(territories, onTerritoryClick);
    } else if (phase === 'SCENARIO') {
      // In the future, we'll implement scenario rendering here
      // For now, clear the overworld renderer
      overworldRendererRef.current.clear();
    }
  }, [phase, territories, onTerritoryClick]);

  return (
    <div 
      ref={canvasRef} 
      className="w-full h-full border border-gray-700 rounded-lg overflow-hidden"
      aria-label="Game Canvas"
    />
  );
};

export default GameCanvas;
