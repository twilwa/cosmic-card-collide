## End of Line: Technical Specification Document (Alternative Stack)

**Version:** 1.0-Alt  
**Date:** 2024-08-16  
**Document Status:** Ready for Prototype Implementation

### 1. Overview

This document provides the technical specifications for "End of Line," using a standard web technology stack (HTML/CSS/JS, Node.js, WebSockets, Database) instead of GodotJS and SpacetimeDB. The core game concept remains the same: a browser-based, multiplayer PvPvE roguelike deckbuilder with asymmetric factions and dual-layer gameplay (Strategic Overworld and Tactical Scenario Missions).

### 2. Requirements

(Functional and Non-Functional Requirements FR-001 to NFR-007 remain largely the same as in the previous spec, with the understanding that implementation details change).

- **FR-001 (Client):** Must run in standard browsers using HTML/CSS/JavaScript and a rendering library.
    
- **NFR-001 (Performance):** State updates via WebSocket should aim for <200ms perceived latency. Server tick rate for simulations needs definition (e.g., 10-20 Hz for tactical?).
    
- **NFR-005 (Reliability):** Requires robust WebSocket connection handling and server-side state management to handle disconnects.
    

### 3. System Architecture

#### 3.1 Overall Architecture: Client-Server (Web Stack)

- **Client:** Single Page Application (SPA) built with standard web technologies. Responsible for rendering (using a JS rendering library), handling user input, sending actions to the server via WebSockets, and updating the view based on state updates received from the server.
    
- **Server:** Authoritative Node.js backend. Responsible for managing game logic, validating player actions, maintaining authoritative game state for active sessions (in memory, backed by DB), handling persistence, managing WebSocket connections, and broadcasting state updates.
    

#### 3.2 Technology Stack

- **Client Rendering:**
    
    - **Primary Choice: PixiJS:** High-performance 2D WebGL renderer suitable for hex grids, card interfaces, and potentially isometric views with 2D assets.
        
    - (Alternative: Phaser if more game framework features are desired, Three.js if true 3D is required for isometric view).
        
- **Client UI Framework (Optional but Recommended):** React, Vue, or Svelte for managing UI components (HUD, menus, card displays) outside the main game canvas.
    
- **Client Language:** TypeScript.
    
- **Server Runtime:** Node.js (LTS version).
    
- **Server Language:** TypeScript.
    
- **Server Framework (Optional):** Express.js (useful for potential REST APIs for login, profiles, etc., alongside WebSocket handling).
    
- **Real-time Communication:** WebSockets (using libraries like ws or Socket.IO on Node.js). A custom message protocol (JSON-based) needs to be defined.
    
- **Persistence / Database:**
    
    - **Primary Choice: PostgreSQL:** Relational database suitable for structured game data (Territories, Factions, Cards, Player Profiles). Use with an ORM like Prisma or TypeORM, or a query builder like Knex.js.
        
    - (Alternative: MongoDB if NoSQL flexibility is preferred).
        
    - **Caching/Session State (Optional):** Redis could be used for caching frequently accessed data or managing temporary session states.
        

#### 3.3 Key Modules (Conceptual - Web Stack)

1. **Game State Manager (Server - Node.js):** Holds authoritative state for active games in memory (e.g., maps of game IDs to game state objects). Responsible for loading state from DB on game start/resume and persisting changes.
    
2. **Overworld Manager (Server Logic / Client View):**
    
    - Server: Node.js module containing logic for turns, resources, influence, Overworld card effects, Scenario triggers. Modifies the in-memory game state.
        
    - Client: Renders map using PixiJS, displays UI info (React/Vue/HTML), sends Overworld actions via WebSocket.
        
3. **Scenario Manager (Server Logic / Client View):**
    
    - Server: Node.js module managing active Scenario instances within the main game state object. Handles tactical turns, Scenario card effects, objective resolution, calculating Overworld impact.
        
    - Client: Renders Scenario view using PixiJS, handles tactical input, displays cards/UI, sends Scenario actions via WebSocket.
        
4. **Card Manager (Server Logic / Client Data):**
    
    - Server: Holds card definitions (loaded from DB or files). Validates plays, manages deck/hand state within the in-memory game state object. Handles market logic.
        
    - Client: Stores local copy of card definitions for display. Renders cards in hand/market.
        
5. **Faction Manager (Server Logic / Client Data):**
    
    - Server: Defines faction logic/abilities within Node.js modules. Tracks resources/state within the in-memory game state object.
        
    - Client: Displays faction-specific UI/info.
        
6. **Network Manager (Client/Server - WebSocket Implementation):**
    
    - Server: Manages WebSocket connections (using ws or Socket.IO), handles message routing to appropriate game instances/logic, serializes and broadcasts state updates/diffs.
        
    - Client: Establishes/maintains WebSocket connection, sends formatted action messages, receives and applies state updates to the local rendering state. Implements client prediction for tactical actions.
        
7. **Persistence Manager (Server - Node.js):** Module responsible for interacting with the Database (PostgreSQL via ORM/driver) to load/save game states and player profiles.
    
8. **AI Manager (Server Logic):** Node.js module controlling PvE elements within the server-side game simulation.
    

### 4. Data Management

#### 4.1 Data Models (Mapping to PostgreSQL Tables)

(Conceptual schema using pseudo-SQL/ORM decorators. Specific ORM syntax will vary).

```
-- GameState (Likely managed in memory per active game, maybe snapshot to DB)
-- Use Redis or similar if many concurrent games need resumable state persistence.

CREATE TABLE Territories (
    id VARCHAR(255) PRIMARY KEY,
    game_instance_id VARCHAR(255) NOT NULL, -- If state is persisted per game
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('CORPORATE', 'FRINGE', 'UNDERGROUND')),
    security_level INTEGER NOT NULL DEFAULT 1 CHECK (security_level BETWEEN 1 AND 5),
    resource_value INTEGER NOT NULL DEFAULT 1 CHECK (resource_value BETWEEN 1 AND 5),
    stability_index INTEGER NOT NULL DEFAULT 100 CHECK (stability_index BETWEEN 0 AND 100),
    corporate_influence INTEGER NOT NULL DEFAULT 50 CHECK (corporate_influence BETWEEN 0 AND 100),
    adjacent_territory_ids TEXT[] -- Array of territory IDs
);

CREATE TABLE Installations (
    id VARCHAR(255) PRIMARY KEY,
    territory_id VARCHAR(255) NOT NULL REFERENCES Territories(id) ON DELETE CASCADE,
    owning_faction_id VARCHAR(255) NOT NULL, -- Can reference a Factions table or just store ID
    card_source_id VARCHAR(255) NOT NULL, -- References CardDefinitions
    type VARCHAR(50) NOT NULL CHECK (type IN ('INFRASTRUCTURE', 'ASSET', 'NETWORK', 'ICE', 'TRAP')),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DAMAGED', 'DISABLED')),
    -- Effects might be stored as JSONB or derived from card_source_id
    effects JSONB
);

CREATE TABLE Factions ( -- Represents state within a specific game instance
    id VARCHAR(255) PRIMARY KEY, -- e.g., game1_weyland
    game_instance_id VARCHAR(255) NOT NULL,
    faction_definition_id VARCHAR(255) NOT NULL, -- e.g. 'weyland'
    player_id VARCHAR(255) NOT NULL REFERENCES PlayerProfiles(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('CORPORATION', 'RUNNER')),
    resources JSONB NOT NULL DEFAULT '{}', -- Store resources like { "credits": 10 }
    victory_points INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE CardDefinitions ( -- Static data, potentially loaded from files at server start
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('OVERWORLD', 'SCENARIO')),
    sub_type VARCHAR(100) NOT NULL,
    faction VARCHAR(255), -- Nullable for neutral
    cost INTEGER NOT NULL,
    effect_definition JSONB NOT NULL,
    flavor_text TEXT,
    art_url VARCHAR(255)
);

CREATE TABLE PlayerCards ( -- Tracks cards within a specific game instance
    instance_id VARCHAR(255) PRIMARY KEY,
    card_definition_id VARCHAR(255) NOT NULL REFERENCES CardDefinitions(id),
    owner_faction_id VARCHAR(255) NOT NULL, -- References the Factions table ID for this game
    location VARCHAR(100) NOT NULL CHECK (location IN ('DECK_OVERWORLD', 'HAND_OVERWORLD', ...)),
    card_state JSONB -- For counters, damage, etc.
);

CREATE TABLE PlayerProfiles ( -- Persistent player data
    id VARCHAR(255) PRIMARY KEY, -- User ID from auth system or generated UUID
    display_name VARCHAR(255) UNIQUE NOT NULL,
    -- Hashed password or link to external auth provider
    unlocked_card_definition_ids TEXT[] NOT NULL DEFAULT '{}',
    faction_progression JSONB NOT NULL DEFAULT '{}' -- { "weyland_xp": 120, "anarch_level": 3 }
);

-- ScenarioInstance data would likely be managed entirely in the server's memory
-- for the duration of the scenario, possibly snapshotting key results.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).SQL

#### 4.2 Persistence

- **Active Game State:** Primarily held in Node.js server memory for performance. Loaded from PostgreSQL when a game session starts or resumes. Periodically snapshot or save critical changes (e.g., end of turn, major events) back to the database to prevent total loss on server crash. Player disconnects might trigger a save.
    
- **Player Meta-Progression:** Stored directly in the PlayerProfiles table in PostgreSQL. Updated after games conclude or milestones are reached.
    

#### 4.3 Data Synchronization (Manual WebSocket Implementation)

- **Protocol:** Define a clear JSON message structure for Client -> Server actions and Server -> Client state updates.
    
    - Example Client Action: { type: "PLAY_OVERWORLD_CARD", payload: { cardInstanceId: "...", targetTerritoryId: "..." } }
        
    - Example Server Update: { type: "GAME_STATE_UPDATE", payload: { updatedTerritories: [...], updatedFactions: [...], cardsDrawn: [...] } }
        
- **Server Logic:**
    
    1. Receive action message via WebSocket.
        
    2. Identify target game instance based on connection/session.
        
    3. Validate action against the authoritative in-memory state for that game.
        
    4. If valid, execute logic, update in-memory state.
        
    5. Determine necessary state changes to broadcast. Optimization: Send only diffs/deltas instead of the full state where feasible.
        
    6. Serialize the update message(s).
        
    7. Broadcast updates to all relevant clients connected to that game instance.
        
- **Client Logic:**
    
    1. Receive state update message via WebSocket.
        
    2. Deserialize message.
        
    3. Update local state representation used by the rendering engine (PixiJS stage, React state).
        
    4. Re-render affected parts of the UI/game view.
        
    5. Reconcile predicted state if client prediction was used.
        

### 5. Core Module Specifications (Implementation Details - Web Stack)

#### 5.1 Overworld Manager (Node.js / PixiJS+React)

- **Turn/Resource/Influence Logic:** Resides entirely on the Node.js server, manipulating in-memory state objects.
    
- **Card Play Logic (Server):** Node.js function validates WebSocket action message, checks game rules, updates state, triggers state broadcasts.
    
- **Card Play Logic (Client):** React component handles card click/drag, performs basic validation (can afford?), sends WebSocket message. PixiJS handles rendering card visuals.
    
- **Map Rendering (Client):** PixiJS stage renders hex grid, territory highlights, installations/assets as sprites/graphics based on data received from server. React/HTML handles informational overlays.
    
- **Scenario Triggering (Server):** Server logic detects trigger action, updates game phase, creates in-memory Scenario state, notifies clients via WebSocket to switch views.
    

#### 5.2 Scenario Manager (Node.js / PixiJS+React)

- **Instance Management (Server):** Node.js manages scenario lifecycle within the main game state object.
    
- **Turn/Card Logic (Server):** Node.js handles tactical turns, validates Scenario card plays received via WebSocket, resolves effects within the scenario state, checks objectives.
    
- **Rendering (Client):** PixiJS renders the isometric/top-down view, runner/obstacle sprites/graphics, card play animations. React/HTML handles HUD, card hand display.
    
- **Client Prediction (Client):** For actions like Runner movement or playing instant effects, the client updates its local state/rendering immediately and sends the action to the server. It must be prepared to revert/correct if the server rejects the action or sends a different authoritative state.
    
- **Outcome Application (Server):** Node.js function calculates Overworld impact based on scenario result, updates the main in-memory game state, broadcasts Overworld changes, and triggers cleanup of scenario state.
    

#### 5.3 Card System (Node.js / Client)

- **Effect Execution (Server):** Node.js functions interpret CardDefinition.effectDefinition JSON and apply changes to the authoritative in-memory game state.
    
- **Market Logic (Server - Post-MVP):** Node.js logic populates available cards (potentially querying DB or using static lists filtered by game state), handles purchase requests via WebSocket, updates player state, broadcasts market changes.
    
- **Deckbuilding (Client/Server - Post-MVP):** Client UI (React/HTML) allows deck construction. Sends decklist to server via REST or WebSocket on game start. Server validates deck against rules and PlayerProfile.unlockedCardDefinitionIds.
    

### 6. Error Handling Strategy

- **WebSocket Connection Errors:** Implement robust reconnect logic on the client. Server needs to handle abrupt disconnects (clean up session, notify other players, potentially save state). Use heartbeat messages to detect dead connections.
    
- **Invalid Actions:** Server must validate all actions received via WebSocket. If invalid, send an explicit error message back to the originating client via WebSocket (e.g., { type: "ACTION_REJECTED", payload: { reason: "Insufficient Credits", action: {...} } }). Client UI should display this error.
    
- **Database Errors:** Wrap DB interactions in try/catch blocks on the server. Log errors. Implement retry logic for transient errors. For critical failures, may need to gracefully end the game session and notify players.
    
- **Server Errors/Crashes:** Use Node.js process managers (like PM2) for automatic restarts. Implement comprehensive logging. If possible, design state saving to minimize data loss on crash.
    

### 7. Testing Plan

(Testing levels remain similar: Unit, Integration, E2E, Manual Playtesting. TDD approach is still recommended).

- **Unit Tests (Jest):** Test Node.js game logic functions (pure functions where possible), client-side UI components (React Testing Library), utility functions.
    
- **Server-Side Logic Tests:** Use test runners like Jest to test Node.js modules responsible for game rules, state updates, action validation without needing live WebSockets or DB (mock dependencies).
    
- **Integration Tests:**
    
    - Test WebSocket message handling (client sending, server receiving/validating/responding, client receiving updates). Requires setting up mock WebSocket clients/servers.
        
    - Test interactions with the database (data loading, saving, querying via ORM/driver). Requires a test database instance.
        
- **E2E Tests (Playwright/Cypress):** Automate browser interaction with the client SPA, driving actions and verifying UI/state changes after WebSocket communication with a test server instance.
    
- **Focus Areas:** WebSocket communication reliability, state synchronization accuracy (especially diffing if implemented), client prediction reconciliation, database persistence correctness.
    

### 8. Initial Prototyping Scope (MVP - Alt Stack)

- **Client Setup:** Basic HTML page, PixiJS canvas setup, simple React components for HUD/hand display. Basic WebSocket client connection.
    
- **Server Setup:** Node.js server with ws library. Basic in-memory store for 1 game instance. PostgreSQL connection setup (even if only saving player names initially). Define basic WebSocket message formats.
    
- **Overworld:** Render static hex grid in PixiJS. Click on hex sends message. Implement 1 server-side Overworld action handler (e.g., "Place Influence") that updates in-memory state and broadcasts the change. Client updates PixiJS display on message receipt. Minimal resource tracking.
    
- **Scenario:** Implement server logic to switch game state to "Scenario". Client switches view (can be simple placeholder). Implement 1 Runner action via WebSocket (e.g., "Move"). Server updates in-memory scenario state and broadcasts. Basic Success/Fail triggered manually on server for testing.
    
- **Interplay:**
    
    - Server reads a placeholder "Security Level" when starting scenario.
        
    - Server updates placeholder "Influence" on Overworld state based on scenario Success/Fail message broadcast.
        
- **Networking:** Establish basic Client <-> Server communication via WebSockets for actions and state updates.
    
- **Factions:** Minimal representation (just IDs) on server/client.
    

This MVP focuses on establishing the client-server communication loop via WebSockets and demonstrating the basic state transition between Overworld and a placeholder Scenario, rendered using standard web tech.