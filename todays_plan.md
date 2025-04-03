# End of Line - Implementation Prompt Plan (Card-First, Supabase)

This plan outlines the iterative steps using LLM prompts to build the game, focusing on core card mechanics first. It assumes a Node.js/TypeScript backend with Supabase for the database, and a React/TypeScript/Vite/Zustand client with PixiJS for rendering.

**Assumptions:**

- Prompts 1-9 (Basic Setup, WS Connect, Echo) from the initial detailed plan were completed.
- Client uses Zustand (`useGameStore`) for state management.
- Client uses `shadcn/ui` for base component styling.
- Supabase project is set up, and the Supabase client is integrated on the server (`src/lib/supabase.ts`).
- Necessary initial TODOs from `todos.md` (like replacing mock WS hook) are addressed.

---

## Phase 1: Core Refactoring & Setup (Get Back on Track)

### Prompt P1: Client - Refactor Territory Rendering to PixiJS

**Objective:** Replace the direct Canvas API rendering in `TerritoryMap.tsx` with PixiJS within a central canvas component, using data from the Zustand store.
**Depends on:** Client Setup (Prompts 3, 4), Zustand Store Setup (`gameStore.ts`)
**Requirements:**

1.  Remove `src/components/TerritoryMap.tsx`.
2.  Create `src/pixi/OverworldRenderer.ts` (if not existing from previous attempts):
    - Methods: `initialize(app: PIXI.Application)`, `renderTerritories(territories: Territory[])`, `updateTerritoryVisual(territoryId: string, styleChanges: object)`.
    - `renderTerritories` should iterate the `territories` array (received from Zustand), create interactive (`interactive=true`) PixiJS Graphics/Sprites for each, store them (e.g., `Map<string, PIXI.Graphics>`), add labels, and add to a container on the stage. Attach territory ID to graphics.
    - Implement basic `updateTerritoryVisual` (e.g., changing tint or border).
    - Add `onTerritoryClick?: (territoryId: string) => void` callback property, triggered by `pointerdown` on territory graphics.
3.  Refactor/Rename `src/components/PixiCanvas.tsx` to `src/components/GameCanvas.tsx`.
    - It should manage the `PIXI.Application`.
    - Instantiate `OverworldRenderer` (and later `ScenarioRenderer`).
    - Accept props: `phase: GamePhase`, `territories: Territory[]`, `scenarioState: ScenarioState | null`, `onTerritoryClick`, `onScenarioCellClick`, etc.
    - Use `useEffect` hooks based on `phase` to call the appropriate renderer (`overworldRenderer.renderTerritories` or `scenarioRenderer.renderScenario`).
    - Pass click callbacks to the active renderer.
4.  Modify `src/components/GameBoard.tsx`:
    _ Remove the import and usage of `TerritoryMap`.
    _ Import and render `GameCanvas`. \* Pass the necessary props (`phase`, `territories` from Zustand state, `handleTerritoryClick` handler) to `GameCanvas`.
    **Testing:** Run client, verify territories (from initial mock state or later server state) are rendered using PixiJS. Verify clicking territories triggers `handleTerritoryClick` in `GameBoard`.

_(Provide content for `OverworldRenderer.ts`, updated `GameCanvas.tsx`, updated `GameBoard.tsx`)_

---

## Phase 2: Server State & Static Data (Card Focus)

_(These prompts adapt the "Revised - Supabase" plan from earlier, ensuring alignment)_

### Prompt P2: Server - Define Core Game State Types (Card Focus)

**(Equivalent to Prompt 10 Revised)**
**Objective:** Define `GameState`, `PlayerState` (with faction, resources, card zones), `FactionType`, `CardInstance`, `CardDefinition`, `CardEffect` types.
**Depends on:** Server Setup (Prompt 1)
**Requirements:** Define interfaces/types in `server/src/types/game.ts` and `server/src/types/definitions.ts` as detailed previously (including discriminated unions for `CardEffect`).
_(Provide content for `game.ts`, `definitions.ts`)_

### Prompt P3: Server - Implement In-Memory Game Store & Basic Player Init

**(Equivalent to Prompt 11 Revised)**
**Objective:** Create `activeGames` map, `getOrCreateGame`, initialize basic `PlayerState` (empty zones, default resources/faction=null) on connection.
**Depends on:** P2, Server WS Setup (Prompt 2), Connection Mgmt (Prompt 6)
**Requirements:** Implement in `server.ts`. Initialize empty card zones, default resources. Defer faction/deck init. Add tests.
_(Provide updated `getOrCreateGame`, `connection` handler, tests)_

### Prompt P4: Server - Handle Player Disconnect State

**(Equivalent to Prompt 12 Revised)**
**Objective:** Update player `status` to 'disconnected' in `GameState` on WebSocket close.
**Depends on:** P3
**Requirements:** Implement logic in `close` handler in `server.ts`. Add tests.
_(Provide updated `close` handler logic, tests)_

### Prompt P5: Server - Load Card Definitions (JSON)

**(Equivalent to Prompt 13 Revised)**
**Objective:** Load static card definitions from `cards.json` into memory using `cardService`.
**Depends on:** P2
**Requirements:** Create `cards.json` matching `CardDefinition` type. Implement `cardService.ts` (`loadCardDefinitions`, `getCardDefinition`). Call load on startup. Add tests.
_(Provide `cards.json`, `cardService.ts`, startup call, tests)_

### Prompt P6: Server - Deck Initialization Logic

**(Equivalent to Prompt 14 Revised)**
**Objective:** Implement `initializePlayerDeck` function (shuffle def IDs, create instances).
**Depends on:** P2, P5
**Requirements:** Implement function in `server.ts` or `gameService.ts`. Use `lodash/shuffle`. Add tests.
_(Provide `initializePlayerDeck` function, tests)_

### Prompt P7: Server - Game Start Logic (Faction, Resources, Deck)

**(Equivalent to Prompt 15 Revised)**
**Objective:** Implement `checkAndStartGame` to assign factions, initial resources, call `initializePlayerDeck`, set phase/turn.
**Depends on:** P3, P6
**Requirements:** Implement function in `server.ts`. Call it after player joins. Add tests.
_(Provide `checkAndStartGame` function, call site, tests)_

### Prompt P8: Server - Supabase Client & Schema Setup

**(Equivalent to Prompt 16 Revised)**
**Objective:** Install Supabase client, setup `.env`, create Supabase client instance, define `PlayerProfile` schema in Supabase DB.
**Depends on:** Server Setup (Prompt 1)
**Requirements:** Install deps. Create `lib/supabase.ts`. Provide SQL for `PlayerProfile`. Configure `.env`.
_(Provide `lib/supabase.ts`, SQL `CREATE TABLE`)_

### Prompt P9: Server - Supabase Profile Service

**(Equivalent to Prompt 17 Revised)**
**Objective:** Implement `findOrCreateProfile` using Supabase client. Add integration tests.
**Depends on:** P8
**Requirements:** Create `services/profileService.ts`. Implement function using `supabase.from...`. Add integration tests with test DB setup/cleanup.
_(Provide `profileService.ts`, integration tests)_

### Prompt P10: Server - Integrate Profile Service

**(Equivalent to Prompt 18 Revised)**
**Objective:** Call `findOrCreateProfile` on connect, store `displayName` in `PlayerState`.
**Depends on:** P3, P7, P9
**Requirements:** Modify `connection` handler in `server.ts` (make async). Call service, update `PlayerState`. Update tests to mock service.
_(Provide updated `connection` handler, test updates)_

### Prompt P11: Server - Broadcast Initial State & Definitions

**(Equivalent to Prompt 19 Revised)**
**Objective:** Send `CLIENT_ID_ASSIGNED`, `ALL_CARD_DEFINITIONS`, and `GAME_STATE_INIT` upon connection/game start.
**Depends on:** P5, P7, P10
**Requirements:** Define messages in `protocol.ts`. Modify `connection` handler to send messages in correct sequence. Ensure `GAME_STATE_INIT` payload is complete. Add tests.
_(Provide `protocol.ts` updates, updated `connection` handler, test updates)_

### Prompt P12: Client - Handle Initial State & Definitions (Zustand)

**(Equivalent to Prompt 20 Revised)**
**Objective:** Update Zustand store (`useGameStore`) based on initial server messages.
**Depends on:** Client Setup, Zustand Store (`gameStore.ts`), P11
**Requirements:** Implement handlers for `CLIENT_ID_ASSIGNED`, `ALL_CARD_DEFINITIONS`, `GAME_STATE_INIT` within `gameStore`'s `handleGameMessage` action. Store `myClientId`, `cardDefinitions` map, `gameState`.
_(Provide updated `handleGameMessage` logic within `gameStore.ts`)_

---

## Phase 3: Basic Turn, Resource & Draw Flow

_(Resuming the Card-First sequence, adapting prompts to use Zustand on client)_

### Prompt P13: Server - Add Turn Tracking State

**(Equivalent to Prompt 18 Revised)**
**Objective:** Add `turnNumber`, `currentPlayerId` to `GameState`. Update `checkAndStartGame`.
**Depends on:** P2, P7
**Requirements:** Update `game.ts`. Update `checkAndStartGame` in `server.ts` to set initial turn/player. Add tests.
_(Provide updated `game.ts`, `checkAndStartGame`, tests)_

### Prompt P14: Server - Implement Turn Advancement & END_TURN

**(Equivalent to Prompt 19 Revised)**
**Objective:** Implement `advanceTurn` logic. Handle `END_TURN` message.
**Depends on:** P13
**Requirements:** Implement `advanceTurn` in `server.ts`. Add `END_TURN` type to `protocol.ts`. Add handler to `message` switch in `server.ts`. Add tests.
_(Provide `protocol.ts` update, `advanceTurn`, `END_TURN` handler, tests)_

### Prompt P15: Server - Implement Draw Card Logic

**(Equivalent to Prompt 20 Revised)**
**Objective:** Implement `drawCards` function (deck->hand, reshuffle).
**Depends on:** P2, P6
**Requirements:** Implement `drawCards` in `server.ts` or `gameService.ts`. Add tests for draw, empty deck, reshuffle.
_(Provide `drawCards` function, tests)_

### Prompt P16: Server - Integrate Draw & Broadcast Turn/Card Updates

**(Equivalent to Prompt 21 Revised)**
**Objective:** Call `drawCards` on turn start. Broadcast `TURN_CHANGE`, `PLAYER_HAND_UPDATE`, `PLAYER_DECK_UPDATE`, `PLAYER_DISCARD_UPDATE`.
**Depends on:** P14, P15
**Requirements:** Call `drawCards` in `advanceTurn`/`checkAndStartGame`. Define new message types in `protocol.ts`. Add broadcast calls. Add tests.
_(Provide `protocol.ts` updates, updated `advanceTurn`/`checkAndStartGame`, broadcast logic, tests)_

### Prompt P17: Client - Handle Turn/Draw Updates (Zustand)

**(Equivalent to Prompt 22 Revised)**
**Objective:** Update Zustand store based on turn/card zone messages.
**Depends on:** P12, P16
**Requirements:** Add handlers for `TURN_CHANGE`, `PLAYER_HAND_UPDATE`, `PLAYER_DECK_UPDATE`, `PLAYER_DISCARD_UPDATE` to `gameStore`'s `handleGameMessage`. Ensure state updates immutably.
_(Provide updated `handleGameMessage` logic in `gameStore.ts`)_

### Prompt P18: Client - Display Turn/Resource/Deck UI

**(Equivalent to Prompt 23 Revised)**
**Objective:** Render current turn info, player resources, deck/discard counts using Zustand selectors. Implement End Turn button.
**Depends on:** P17, Client Component (`GameBoard.tsx`)
**Requirements:** Update `GameBoard.tsx` to use selectors from `useGameStore` for display. Add "End Turn" button logic calling `sendMessage`.
_(Provide updated rendering logic in `GameBoard.tsx`)_

### Prompt P19: Client - Render Card Hand (Verify)

**(Equivalent to Prompt 24 Revised)**
**Objective:** Ensure `CardHand`/`CardComponent` correctly renders the hand using data from Zustand.
**Depends on:** P12, P17, `CardComponent.tsx`
**Requirements:** Verify `GameBoard.tsx` passes the correct `myHand` (derived from store state) and `getCardDefinition` function to `CardHand`. Verify `CardComponent` uses the definition correctly.
_(This is mainly verification, potentially minor tweaks to `GameBoard.tsx` props)_

---

## Phase 4: Core Card Play Loop (No Targeting)

_(Continuing Card-First plan)_

### Prompt P20: Client - Card Selection (Zustand)

**(Equivalent to Prompt 25 Revised)**
**Objective:** Update Zustand store when a card in hand is clicked.
**Depends on:** P19
**Requirements:** Modify `handleCardClick` in `GameBoard.tsx` to call an action in `useGameStore` (e.g., `selectCard(instanceId)`) which updates the `selectedCardInstanceId` in the store state. Update `CardComponent` visual state based on selection state from store.
_(Provide updated `handleCardClick` in `GameBoard`, new action/state in `gameStore.ts`)_

### Prompt P21: Client - Send Play Card (No Target)

**(Equivalent to Prompt 26 Revised)**
**Objective:** Add button/logic to send `PLAY_CARD` for selected non-targeted cards.
**Depends on:** P20
**Requirements:** Add a "Play Card" button to `GameBoard` (enabled if non-targeted card selected & isMyTurn). On click, read `selectedCardInstanceId` from store, construct `PLAY_CARD` message (no `targetId`), call `sendMessage`, call store action to deselect card.
_(Provide UI button and handler logic in `GameBoard.tsx`)_

### Prompt P22: Server - Handle PLAY_CARD (Validation)

**(Equivalent to Prompt 27 Revised)**
**Objective:** Implement server handler for `PLAY_CARD` including Turn, Faction, Cost, Hand validation.
**Depends on:** P14, P18(Server Profile), Server Card Service, Server Game State
**Requirements:** Add `PLAY_CARD` type/message to `protocol.ts`. Implement handler in `server.ts`. Use `getCardDefinition`, check player state (turn, faction, resources, hand). Add tests.
_(Provide `protocol.ts` updates, `PLAY_CARD` handler validation logic, tests)_

### Prompt P23: Server - Deduct Cost & Update Resources

**(Equivalent to Prompt 28 Revised)**
**Objective:** Deduct card cost from player resources if play is valid. Broadcast update.
**Depends on:** P22
**Requirements:** Add logic to `PLAY_CARD` handler. Broadcast `PLAYER_RESOURCE_UPDATE`. Add tests.
_(Provide resource deduction logic, broadcast call, tests)_

### Prompt P24: Server - Update Card Zones

**(Equivalent to Prompt 29 Revised)**
**Objective:** Move played card from hand to discard. Broadcast updates.
**Depends on:** P22
**Requirements:** Add logic to `PLAY_CARD` handler. Broadcast `PLAYER_HAND_UPDATE`, `PLAYER_DISCARD_UPDATE`. Add tests.
_(Provide zone update logic, broadcast calls, tests)_

### Prompt P25: Server - Basic Effect Service (No Target)

**(Equivalent to Prompt 30 Revised)**
**Objective:** Create/refactor `effectService.ts` to handle non-targeted effects ('DRAW_CARD', 'GAIN_RESOURCES').
**Depends on:** Server Card Defs (P5), Server Game State (P2), Draw Logic (P15)
**Requirements:** Implement `effectService.ts` with `executeEffect` and specific executors. Ensure it can trigger broadcasts (pass `broadcastToGame` in context). Add tests.
_(Provide `effectService.ts`, context definition updates, tests)_

### Prompt P26: Server - Execute Effects & Broadcast Results

**(Equivalent to Prompt 31 Revised)**
**Objective:** Call `executeEffect` from `PLAY_CARD` handler. Ensure effects trigger needed broadcasts.
**Depends on:** P22, P25
**Requirements:** Integrate `executeEffect` call into `PLAY_CARD`. Ensure context includes broadcast function. Update tests.
_(Provide integration call in `server.ts`, test updates)_

### Prompt P27: Client - Handle Card Play Result Updates (Zustand)

**Objective:** Update Zustand store based on broadcasts resulting from card play (`PLAYER_RESOURCE_UPDATE`, `PLAYER_HAND_UPDATE`, etc.).
**Depends on:** P12, P17
**Requirements:** Ensure `handleGameMessage` in `gameStore.ts` correctly processes all relevant update messages triggered by card play effects. Verify UI updates reactively.
_(Verify/update `handleGameMessage` logic in `gameStore.ts`)_
