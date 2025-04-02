
import React, { useRef, useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

const TerritoryMap: React.FC = () => {
  const { gameState, selectedTerritoryId, selectTerritory } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Render the territory map
  useEffect(() => {
    if (!canvasRef.current || !gameState) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the territories
    const territories = gameState.territories;
    const hexRadius = Math.min(canvas.width, canvas.height) * 0.1;
    
    // Draw connections first
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(100, 100, 150, 0.3)';
    
    territories.forEach(territory => {
      const { x, y } = territory.position;
      const startX = x * canvas.width / 100;
      const startY = y * canvas.height / 100;
      
      territory.connections.forEach(connId => {
        const connTerritory = territories.find(t => t.id === connId);
        if (connTerritory) {
          const { x: connX, y: connY } = connTerritory.position;
          const endX = connX * canvas.width / 100;
          const endY = connY * canvas.height / 100;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      });
    });
    
    // Helper function to draw a hexagon
    const drawHexagon = (x: number, y: number, radius: number, fill: string, stroke: string, name: string, selected: boolean) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = x + radius * Math.cos(angle);
        const py = y + radius * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      
      ctx.fillStyle = fill;
      ctx.fill();
      
      ctx.lineWidth = selected ? 4 : 2;
      ctx.strokeStyle = selected ? '#fff' : stroke;
      ctx.stroke();
      
      // Draw name in the center
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, x, y);
    };
    
    // Draw territories
    territories.forEach(territory => {
      const { x, y } = territory.position;
      const posX = x * canvas.width / 100;
      const posY = y * canvas.height / 100;
      
      // Determine colors based on control
      let fillColor = 'rgba(40, 40, 60, 0.7)';
      let strokeColor = 'rgba(80, 80, 100, 0.8)';
      
      if (territory.controlledBy) {
        const player = gameState.players.find(p => p.id === territory.controlledBy);
        if (player?.faction === 'CORPORATION') {
          fillColor = 'rgba(0, 195, 255, 0.3)';
          strokeColor = 'rgba(0, 195, 255, 0.8)';
        } else if (player?.faction === 'RUNNER') {
          fillColor = 'rgba(255, 0, 170, 0.3)';
          strokeColor = 'rgba(255, 0, 170, 0.8)';
        }
      }
      
      const isSelected = territory.id === selectedTerritoryId;
      
      drawHexagon(posX, posY, hexRadius, fillColor, strokeColor, territory.name, isSelected);
    });
    
  }, [gameState, dimensions, selectedTerritoryId]);
  
  // Handle territory click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !gameState) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to canvas coordinates
    const canvasX = x * canvas.width / rect.width;
    const canvasY = y * canvas.height / rect.height;
    
    // Find the clicked territory
    const hexRadius = Math.min(canvas.width, canvas.height) * 0.1;
    const territories = gameState.territories;
    
    for (const territory of territories) {
      const { x: terrX, y: terrY } = territory.position;
      const posX = terrX * canvas.width / 100;
      const posY = terrY * canvas.height / 100;
      
      // Simple distance check (this could be more precise with proper hexagon collision)
      const distance = Math.sqrt(Math.pow(posX - canvasX, 2) + Math.pow(posY - canvasY, 2));
      if (distance <= hexRadius) {
        // Toggle selection
        if (selectedTerritoryId === territory.id) {
          selectTerritory(null);
        } else {
          selectTerritory(territory.id);
        }
        break;
      }
    }
  };
  
  return (
    <div ref={containerRef} className="w-full h-[400px] relative">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleCanvasClick}
        className="w-full h-full bg-cyber/40 rounded-md"
      />
    </div>
  );
};

export default TerritoryMap;
