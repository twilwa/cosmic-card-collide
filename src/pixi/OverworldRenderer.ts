
import * as PIXI from 'pixi.js';
import { Territory } from '@/types/gameTypes';

export class OverworldRenderer {
  private app: PIXI.Application | null = null;
  private territoriesContainer: PIXI.Container | null = null;
  private territoryGraphics: Map<string, PIXI.Graphics> = new Map();
  private territoryLabels: Map<string, PIXI.Text> = new Map();
  private onTerritoryClick?: (territoryId: string) => void;

  // Initialize the renderer with a PIXI application
  initialize(app: PIXI.Application) {
    this.app = app;
    this.territoriesContainer = new PIXI.Container();
    this.app.stage.addChild(this.territoriesContainer);
    
    return this;
  }

  // Clear all territory graphics and labels
  clear() {
    if (this.territoriesContainer) {
      this.territoriesContainer.removeChildren();
      this.territoryGraphics.clear();
      this.territoryLabels.clear();
    }
  }

  // Render territories on the map
  renderTerritories(territories: Territory[], onTerritoryClick?: (territoryId: string) => void) {
    if (!this.app || !this.territoriesContainer) {
      console.error('OverworldRenderer not initialized');
      return;
    }

    this.clear();
    this.onTerritoryClick = onTerritoryClick;

    territories.forEach(territory => {
      this.createTerritoryGraphic(territory);
    });

    return this;
  }

  // Create a graphic representation of a territory
  private createTerritoryGraphic(territory: Territory) {
    if (!this.territoriesContainer) return;

    // Create a new graphics object for the territory
    const graphic = new PIXI.Graphics();
    
    // Set base styling
    graphic.lineStyle(2, 0xFFFFFF, 1);
    graphic.beginFill(0x3366CC, 0.5);
    
    // Draw a hexagon or shape based on territory data
    const radius = 50;
    const centerX = territory.x || 100 + Math.random() * 500;
    const centerY = territory.y || 100 + Math.random() * 300;
    
    // Draw a hexagon
    this.drawHexagon(graphic, centerX, centerY, radius);
    graphic.endFill();
    
    // Make it interactive
    graphic.eventMode = 'static';
    graphic.cursor = 'pointer';
    
    // Store territory ID as a property on the graphic
    graphic.name = territory.id;
    
    // Add click handler
    graphic.on('pointerdown', () => {
      if (this.onTerritoryClick) {
        this.onTerritoryClick(territory.id);
      }
    });
    
    // Add hover effects
    graphic.on('pointerover', () => {
      graphic.tint = 0x77AAFF;
    });
    
    graphic.on('pointerout', () => {
      graphic.tint = 0xFFFFFF;
    });
    
    // Add to container and store reference
    this.territoriesContainer.addChild(graphic);
    this.territoryGraphics.set(territory.id, graphic);
    
    // Add territory label
    const label = new PIXI.Text(territory.name, {
      fontFamily: 'Arial',
      fontSize: 14,
      fill: 0xFFFFFF,
      align: 'center',
    });
    
    label.position.set(centerX - label.width / 2, centerY - label.height / 2);
    this.territoriesContainer.addChild(label);
    this.territoryLabels.set(territory.id, label);
  }
  
  // Helper to draw a hexagon
  private drawHexagon(graphics: PIXI.Graphics, x: number, y: number, radius: number) {
    const sides = 6;
    const startAngle = 0;
    
    graphics.moveTo(
      x + radius * Math.cos(startAngle),
      y + radius * Math.sin(startAngle)
    );
    
    for (let i = 1; i <= sides; i++) {
      const angle = startAngle + i * 2 * Math.PI / sides;
      graphics.lineTo(
        x + radius * Math.cos(angle),
        y + radius * Math.sin(angle)
      );
    }
  }
  
  // Update the visual appearance of a territory
  updateTerritoryVisual(territoryId: string, styleChanges: {
    fillColor?: number;
    fillAlpha?: number;
    lineColor?: number;
    lineWidth?: number;
    tint?: number;
  }) {
    const graphic = this.territoryGraphics.get(territoryId);
    
    if (!graphic) {
      console.warn(`Territory graphic for ID ${territoryId} not found`);
      return;
    }
    
    if (styleChanges.tint !== undefined) {
      graphic.tint = styleChanges.tint;
    }
    
    // For more complex styling changes, we would need to redraw the graphic
    // This simplified version just updates the tint
  }
  
  // Clean up resources when no longer needed
  destroy() {
    this.clear();
    this.app = null;
    this.territoriesContainer = null;
  }
}

export default OverworldRenderer;
