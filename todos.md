# End of Line - TODO List

## Phase 0: Critical Fixes & Alignment

- [ ] **Verify Supabase Types:** Confirm `npx supabase gen types typescript ...` ran successfully and errors in `src/contexts/AuthContext.tsx` related to table types are resolved. If not, re-run the command ensuring the DB schema is correct first.
- [ ] **Implement Real WebSocket Hook:** Replace the entire content of `src/hooks/useWebSocket.ts` with the real implementation provided (connecting to `ws://localhost:8080` or your server URL, calling `handleGameMessage` from Zustand store).
- [ ] **Remove Client Mock Data Generation:** Delete the `useEffect` block in `src/components/GameBoard.tsx` (approx. lines 89-211 in the provided snippet) that creates `mockCardDefinitions` and sends mock `PLAYER_HAND_UPDATE`.
- [ ] **Refactor `GameBoard.tsx` State Usage:** Ensure `GameBoard.tsx` reads _all_ its game data (`gameState`, `currentPlayer`, `myHand`, `cardDefinitions`, `myClientId`, `isPlayerTurn`, `phase`, etc.) purely from `useGameStore()` selectors. Remove any local `useState` hooks for managing data that should come from the store. Ensure it uses the `sendMessage` function from the _real_ `useWebSocket` hook. (Use the provided refactored code as a base).
- [ ] **Verify Type Consistency:** Perform a manual check comparing types (esp. `CardDefinition`, `PlayerState`, `MessageType`, message payloads) between `client/src/types/gameTypes.ts` and the server-side type files (`server/src/types/...`). Adjust as needed for consistency. Ensure server `cards.json` aligns with the `CardDefinition` type (esp. `effectDefinition` structure).

## Phase 1: Client Rendering Refactor

_(Corresponds to Prompt P1)_

- [ ] **Remove `TerritoryMap.tsx`:** Delete the file `src/components/TerritoryMap.tsx`.
- [ ] **Create/Update `OverworldRenderer.ts`:** Implement `src/pixi/OverworldRenderer.ts` with methods `initialize`, `renderTerritories`, `updateTerritoryVisual`.
- [ ] **Implement `renderTerritories`:** Use PixiJS Graphics/Sprites, make interactive, store graphics map, add labels, add to stage container. Attach territory ID to graphics.
- [ ] **Implement `updateTerritoryVisual`:** Basic logic to change tint/border based on ID and style params.
- [ ] **Implement Click Callback:** Add `onTerritoryClick` callback property and trigger it from `pointerdown`.
- [ ] **Refactor `PixiCanvas.tsx` -> `GameCanvas.tsx`:** Rename/refactor the main PixiJS canvas component.
- [ ] **Manage Renderers:** Instantiate `OverworldRenderer` (and later `ScenarioRenderer`) within `GameCanvas.tsx`.
- [ ] **Implement Phase Switching:** Use `useEffect` based on `phase` prop to call correct renderer (`renderTerritories` or `renderScenario`).
- [ ] **Wire Callbacks:** Pass click callbacks (e.g., `onTerritoryClick`) from props to the active renderer.
- [ ] **Update `GameBoard.tsx`:** Remove `TerritoryMap` usage, render `GameCanvas` instead, pass necessary props (phase, territories, `handleTerritoryClick`).
- [ ] **Test:** Verify PixiJS territory rendering and click propagation to `GameBoard`.

## Phase 2: Server State & Static Data (Card Focus)

_(Corresponds to Prompts P2-P12)_

- [ ] **Server(P2):** Define core types (`GameState`, `PlayerState` [w/ faction, resources, zones], `CardInstance`, `CardDefinition`, `CardEffect`, etc.) in `server/src/types/...`.
- [ ] **Server(P3):** Implement `activeGames` map, `getOrCreateGame`, basic `PlayerState` init (empty zones) in `server.ts`. Add tests.
- [ ] **Server(P4):** Implement disconnect logic (`status='disconnected'`) in `server.ts`. Add tests.
- [ ] **Server(P5):** Create `server/src/data/cards.json` matching `CardDefinition`. Implement `cardService.ts` (load/get defs). Call load on startup. Add tests.
- [ ] **Server(P6):** Implement `initializePlayerDeck` function (shuffle, create instances) in `server.ts`/`gameService.ts`. Add tests.
- [ ] **Server(P7):** Implement `checkAndStartGame` (assign faction/resources, call deck init, set phase/turn) in `server.ts`. Call from `connection`. Add tests.
- [ ] **Server(P8):** Install Supabase client (`@supabase/supabase-js`). Setup `.env`. Create `lib/supabase.ts`. Create `PlayerProfile` table in Supabase DB (SQL provided).
- [ ] **DB Schema:** Create `persisted_games` table in Supabase DB (SQL provided).
- [ ] **DB Schema:** Regenerate Supabase types (`npx supabase gen types...`) after creating tables.
- [ ] **Server(P9):** Implement `profileService.ts` (`findOrCreateProfile` using Supabase client). Add integration tests.
- [ ] **Server(P10):** Integrate `findOrCreateProfile` call into `connection` handler (`server.ts`). Update unit tests (mock service).
- [ ] **Server(P11):** Define initial broadcast messages (`CLIENT_ID_ASSIGNED`, `ALL_CARD_DEFINITIONS`, `GAME_STATE_INIT`) in `server/protocol.ts`. Send messages sequentially from `connection` handler. Add tests.
- [ ] **Client(P12):** Implement handlers for initial messages in `gameStore.ts` (`handleGameMessage`). Store `myClientId`, `cardDefinitions`, `gameState`.

## Phase 3: Basic Turn, Resource & Draw Flow

_(Corresponds to Prompts P13-P19)_

- [ ] **Server(P13):** Add `turnNumber`, `currentPlayerId` to `GameState` type. Update `checkAndStartGame` to set initial values. Add tests.
- [ ] **Server(P14):** Implement `advanceTurn` function. Define `END_TURN` message type. Implement `END_TURN` handler. Add tests.
- [ ] **Server(P15):** Implement `drawCards` function (deck->hand, reshuffle). Add tests.
- [ ] **Server(P16):** Call `drawCards` on turn start. Define `TURN_CHANGE`/card zone update message types. Add broadcast calls. Add tests.
- [ ] **Client(P17):** Implement handlers for turn/card zone updates in `gameStore.ts`.
- [ ] **Client(P18):** Update `GameBoard.tsx` UI to display turn/resource/deck/discard info from store. Implement "End Turn" button.
- [ ] **Client(P19):** Verify `CardHand`/`CardComponent` render correctly using store data.

## Phase 4: Core Card Play Loop (No Targeting)

_(Corresponds to Prompts P20-P27)_

- [ ] **Client(P20):** Implement card selection state/action in `gameStore.ts`. Update `handleCardClick` in `GameBoard`. Update `CardComponent` visual state.
- [ ] **Client(P21):** Add "Play Card" button/logic to `GameBoard` (for non-targeted). Send `PLAY_CARD` message.
- [ ] **Server(P22):** Define `PLAY_CARD` message type. Implement `PLAY_CARD` handler validation (turn, faction, cost, hand). Add tests.
- [ ] **Server(P23):** Implement cost deduction in `PLAY_CARD` handler. Define/Broadcast `PLAYER_RESOURCE_UPDATE`. Add tests.
- [ ] **Server(P24):** Implement card zone update (hand->discard) in `PLAY_CARD` handler. Broadcast hand/discard updates. Add tests.
- [ ] **Server(P25):** Implement/Refactor `effectService.ts` for non-targeted effects (DRAW_CARD, GAIN_RESOURCES). Add tests.
- [ ] **Server(P26):** Integrate `executeEffect` call into `PLAY_CARD` handler. Ensure context/broadcasts work. Update tests.
- [ ] **Client(P27):** Verify/update handlers in `gameStore.ts` for broadcasts resulting from card play effects (resources, hand, deck, discard).

## Future Phases

- [ ] Implement Targeting (Client UX, Server Validation)
- [ ] Implement Overworld State & Rendering (Territories, Influence)
- [ ] Implement Scenario State & Gameplay (Grid, Entities, Actions, Objectives)
- [ ] Implement Game State Persistence (Save/Load using Supabase)
- [ ] Implement AI Opponent
- [ ] Implement Authentication Flow (Using Supabase Auth)
- [ ] UI Polish & Theming (Augmented UI, Arwes, etc.)
- [ ] Refactor Client State Management (If needed beyond Zustand)
- [ ] Add Robust Error Handling & Reconnection
