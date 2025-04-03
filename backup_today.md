# End of Line - Implementation Prompt Plan (Card-First, Supabase)

This plan outlines the iterative steps using LLM prompts to build the game, focusing on core card mechanics first. It assumes a Node.js/TypeScript backend with Supabase for the database, and a React/TypeScript/Vite/Zustand client with PixiJS for rendering.

**Prerequisites:**

- Basic Server/Client project structure exists.
- WebSocket connection is established via a _real_ `useWebSocket` hook.
- Client uses Zustand (`useGameStore`) for state.
- Client mock data generation is removed.
- Supabase project is set up, client library installed, `.env` configured.
- Shared types are reasonably consistent (will be verified).
- `PlayerProfile` and `persisted_games` tables exist in Supabase DB.
- Supabase types have been regenerated (`npx supabase gen types...`).

---

## Phase 1: Client Rendering Refactor

### Prompt P1: Client - Refactor Territory Rendering to PixiJS

**Objective:** Replace direct Canvas API rendering with PixiJS within a central canvas component, using data from the Zustand store.
**Task:** Remove `TerritoryMap.tsx`. Create/Implement `OverworldRenderer.ts` for PixiJS territory drawing (interactive, labelled, clickable). Refactor `PixiCanvas.tsx` to `GameCanvas.tsx`, manage `OverworldRenderer` (and later `ScenarioRenderer`), switch rendering based on `phase` prop. Update `GameBoard.tsx` to use `GameCanvas`, passing state (territories) and click handlers from Zustand/props.
**Testing:** Verify PixiJS rendering and click propagation.
_(Provide: `OverworldRenderer.ts`, `GameCanvas.tsx`, updated `GameBoard.tsx`)_

---

## Phase 2: Server State & Static Data (Card Focus)

### Prompt P2: Server - Define Core Game State Types (Card Focus)

**Objective:** Define refined TypeScript interfaces for game state, players, cards, effects, etc.
**Task:** Define `GameState`, `PlayerState` (with faction, resources, card zones), `FactionType`, `CardInstance`, `CardDefinition`, `CardEffect` (discriminated union), `CardSubType`, `CardTargetType` etc. in `server/src/types/`.
_(Provide: `game.ts`, `definitions.ts`)_

### Prompt P3: Server - Implement In-Memory Game Store & Basic Player Init

**Objective:** Create `activeGames` map, `getOrCreateGame`, initialize basic `PlayerState` on connection.
**Task:** Implement map and function in `server.ts`. Ensure player state has default/empty faction, resources, card zones. Add tests.
_(Provide: Updated `getOrCreateGame`, `connection` handler, tests)_

### Prompt P4: Server - Handle Player Disconnect State

**Objective:** Update player `status` on WebSocket close.
**Task:** Implement logic in `close` handler in `server.ts`. Add tests.
_(Provide: Updated `close` handler, tests)_

### Prompt P5: Server - Load Card Definitions (JSON)

**Objective:** Load static card definitions from `cards.json` into memory.
**Task:** Create `cards.json` (matching `CardDefinition` type). Implement `cardService.ts` (load/get defs). Call load on startup. Add tests.
_(Provide: `cards.json`, `cardService.ts`, startup call, tests)_

### Prompt P6: Server - Deck Initialization Logic

**Objective:** Implement `initializePlayerDeck` function (shuffle def IDs, create instances).
**Task:** Implement function using `lodash/shuffle`. Add tests.
_(Provide: `initializePlayerDeck` function, tests)_

### Prompt P7: Server - Game Start Logic (Faction, Resources, Deck)

**Objective:** Implement `checkAndStartGame` function.
**Task:** Implement function in `server.ts` to assign factions, initial resources, call `initializePlayerDeck`, set phase/turn. Call after player joins. Add tests.
_(Provide: `checkAndStartGame` function, call site, tests)_

### Prompt P8: Server - Supabase Client & Schema Setup (Verification)

**Objective:** Verify Supabase client setup and DB schema.
**Task:** Verify `lib/supabase.ts` exists and connects. Verify `PlayerProfile`, `persisted_games` tables exist in Supabase DB. Verify types generated (`npx supabase gen types...`).
_(No code needed, verification step)_

### Prompt P9: Server - Supabase Profile Service

**Objective:** Implement `findOrCreateProfile` using Supabase client.
**Task:** Create `services/profileService.ts`. Implement function using `supabase.from...`. Add integration tests.
_(Provide: `profileService.ts`, integration tests)_

### Prompt P10: Server - Integrate Profile Service

**Objective:** Call `findOrCreateProfile` on connect, store `displayName`.
**Task:** Modify `connection` handler (`server.ts`) to call service (async). Update `PlayerState`. Update unit tests (mock service).
_(Provide: Updated `connection` handler, test updates)_

### Prompt P11: Server - Broadcast Initial State & Definitions

**Objective:** Send initial messages sequence (`CLIENT_ID...`, `ALL_CARD_DEFS...`, `GAME_STATE_INIT...`, `PLAYER_JOINED...`).
**Task:** Define message types in `protocol.ts`. Modify `connection` handler (`server.ts`) to send messages. Ensure `GAME_STATE_INIT` payload is complete. Add tests.
_(Provide: `protocol.ts` updates, updated `connection` handler, test updates)_

### Prompt P12: Client - Handle Initial State & Definitions (Zustand)

**Objective:** Update Zustand store based on initial server messages.
**Task:** Implement handlers in `gameStore.ts`'s `handleGameMessage` for `CLIENT_ID_ASSIGNED`, `ALL_CARD_DEFINITIONS`, `GAME_STATE_INIT`. Store data in state.
_(Provide: Updated `handleGameMessage` logic in `gameStore.ts`)_

---

## Phase 3: Basic Turn, Resource & Draw Flow

### Prompt P13: Server - Add Turn Tracking State

**Objective:** Add `turnNumber`, `currentPlayerId` to `GameState`.
**Task:** Update `game.ts`. Update `checkAndStartGame` in `server.ts` to set initial turn/player. Add tests.
_(Provide: Updated `game.ts`, `checkAndStartGame`, tests)_

### Prompt P14: Server - Implement Turn Advancement & END_TURN

**Objective:** Implement `advanceTurn` logic and `END_TURN` message handler.
**Task:** Implement `advanceTurn` (`server.ts`). Add `END_TURN` type (`protocol.ts`). Add handler (`server.ts`). Add tests.
_(Provide: `protocol.ts` update, `advanceTurn`, `END_TURN` handler, tests)_

### Prompt P15: Server - Implement Draw Card Logic

**Objective:** Implement `drawCards` function (deck->hand, reshuffle).
**Task:** Implement `drawCards`. Add tests.
_(Provide: `drawCards` function, tests)_

### Prompt P16: Server - Integrate Draw & Broadcast Turn/Card Updates

**Objective:** Call `drawCards` on turn start. Broadcast updates.
**Task:** Call `drawCards` in `advanceTurn`/`checkAndStartGame`. Define `TURN_CHANGE`/card zone update messages (`protocol.ts`). Add broadcast calls. Add tests.
_(Provide: `protocol.ts` updates, updated `advanceTurn`/`checkAndStartGame`, broadcast logic, tests)_

### Prompt P17: Client - Handle Turn/Draw Updates (Zustand)

**Objective:** Update Zustand store based on turn/card zone messages.
**Task:** Add handlers for `TURN_CHANGE`, `PLAYER_HAND_UPDATE`, `PLAYER_DECK_UPDATE`, `PLAYER_DISCARD_UPDATE` to `gameStore.ts`.
_(Provide: Updated `handleGameMessage` logic in `gameStore.ts`)_

### Prompt P18: Client - Display Turn/Resource/Deck UI

**Objective:** Render turn info, resources, deck/discard counts. Implement End Turn button.
**Task:** Update `GameBoard.tsx` to use Zustand selectors for display. Add "End Turn" button connected to `sendMessage`.
_(Provide: Updated rendering logic in `GameBoard.tsx`)_

### Prompt P19: Client - Render Card Hand (Verify)

**Objective:** Verify `CardHand`/`CardComponent` render correctly using Zustand data.
**Task:** Check `GameBoard.tsx` props passed to `CardHand`. Check `CardComponent` uses definition.
_(Verification step, maybe minor prop adjustments)_

---

## Phase 4: Core Card Play Loop (No Targeting)

### Prompt P20: Client - Card Selection (Zustand)

**Objective:** Update Zustand store on card click.
**Task:** Modify `handleCardClick` in `GameBoard.tsx` to call Zustand action `selectCard(instanceId)`. Update `CardComponent` visual state from store.
_(Provide: Updated `handleCardClick`, Zustand action/state)_

### Prompt P21: Client - Send Play Card (No Target)

**Objective:** Add button/logic to send `PLAY_CARD` for selected non-targeted cards.
**Task:** Add "Play Card" button to `GameBoard.tsx`. Read selection from store, construct `PLAY_CARD` message, call `sendMessage`, call store action to deselect.
_(Provide: UI button and handler logic in `GameBoard.tsx`)_

### Prompt P22: Server - Handle PLAY_CARD (Validation)

**Objective:** Implement server handler validation (Turn, Faction, Cost, Hand).
**Task:** Add `PLAY_CARD` type/message (`protocol.ts`). Implement handler in `server.ts`. Add tests.
_(Provide: `protocol.ts` updates, `PLAY_CARD` handler validation, tests)_

### Prompt P23: Server - Deduct Cost & Update Resources

**Objective:** Deduct cost. Broadcast `PLAYER_RESOURCE_UPDATE`.
**Task:** Add logic to `PLAY_CARD` handler. Broadcast update. Add tests.
_(Provide: Resource deduction, broadcast call, tests)_

### Prompt P24: Server - Update Card Zones

**Objective:** Move card hand->discard. Broadcast hand/discard updates.
**Task:** Add logic to `PLAY_CARD` handler. Broadcast updates. Add tests.
_(Provide: Zone update logic, broadcast calls, tests)_

### Prompt P25: Server - Basic Effect Service (No Target)

**Objective:** Implement/Refactor `effectService.ts` for non-targeted effects.
**Task:** Implement service with `executeEffect` and executors (DRAW_CARD, GAIN_RESOURCES). Pass broadcast func in context. Add tests.
_(Provide: `effectService.ts`, context updates, tests)_

### Prompt P26: Server - Execute Effects & Broadcast Results

**Objective:** Call `executeEffect` from `PLAY_CARD` handler.
**Task:** Integrate call in `server.ts`. Ensure context passed correctly. Update tests.
_(Provide: Integration call in `server.ts`, test updates)_

### Prompt P27: Client - Handle Card Play Result Updates (Zustand)

**Objective:** Update Zustand store based on card play result broadcasts.
**Task:** Verify/update `handleGameMessage` in `gameStore.ts` for `PLAYER_RESOURCE_UPDATE`, `PLAYER_HAND_UPDATE`, etc.
_(Verify/update `handleGameMessage` logic)_

---

## Future Phases

- Targeting Implementation (Client UX, Server Validation)
- Overworld State & Rendering (Territories, Influence) - _Requires PixiJS refactor first_
- Scenario State & Gameplay (Grid, Entities, Actions, Objectives)
- Game State Persistence (Save/Load using Supabase `persisted_games`)
- AI Opponent
- Authentication Flow Refinement
- UI Polish & Theming
