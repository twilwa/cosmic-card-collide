**Master Prompt List / Flowchart Concept**

(A flowchart would visually show dependencies, e.g., Prompt 2 depends on 1, Prompt 4 depends on 3, Prompt 5 depends on 2 & 4, etc.)

**Phase 1: Foundation & Connectivity**

- **Prompt 1:** Server: Project Init (Node, TS, Jest, Folder Structure)
- **Prompt 2:** Server: Basic WebSocket Server (ws, Listen, Log Connect/Disconnect)
- **Prompt 3:** Client: Project Init (Vite, React, TS, Folder Structure)
- **Prompt 4:** Client: Basic PixiJS Canvas Setup (React Component, Basic Shape)
- **Prompt 5:** Client: WebSocket Connection Hook/Service (Connect, Log Events, Send Function)
- **Prompt 6:** Server: Connection Management (UUIDs, clients Map, Handle Close/Error) + Tests
- **Prompt 7:** Shared: Define Basic Message Types (protocol.ts, Base Interfaces, ECHO type)
- **Prompt 8:** Server: Implement Echo Handler (Parse Message, Validate, Route ECHO, Send Response) + Tests
- **Prompt 9:** Client: Implement Echo UI & Logic (Input, Button, sendMessage, Handle Response via Callback/State)

**Phase 2: Basic Game State & Rendering**

- **Prompt 10:** Server: Define Core Game State Interfaces (game.ts, GameState, PlayerState, Phase)
- **Prompt 11:** Server: Implement In-Memory Game Store (Map, getOrCreateGame, Add Player on Connect) + Tests
- **Prompt 12:** Server: Handle Player Disconnect in Game State (Update Status/Remove) + Tests
- **Prompt 13:** Server: Broadcast Initial Game State (GAME_STATE_INIT, Convert Map, Send to New Client) + Tests
- **Prompt 14:** Server: Broadcast Player Join/Leave (PLAYER_JOINED/PLAYER_LEFT, Broadcast Helper) + Tests
- **Prompt 15:** Client: Handle Game State Updates (Store State, Handle INIT/JOIN/LEFT, Display Basic Info)
- **Prompt 16:** Server: Define Static Territory Data (Territory interface, Load JSON/Static Array)
- **Prompt 17:** Server: Integrate Territories into Game State & Broadcast (Add to GameState, Include in GAME_STATE_INIT)
- **Prompt 18:** Client: Render Static Territories (Receive Data, PixiJS Renderer, Draw Shapes/Sprites/Text)

**Phase 3: Basic Interaction & Database Setup**

- **Prompt 19:** Client: Implement Territory Interaction (PixiJS interactive, pointerdown, Send SELECT_TERRITORY)
- **Prompt 20:** Server: Handle SELECT_TERRITORY (Validate, Update Server State) + Tests
- **Prompt 21:** Server: Broadcast Territory Update (TERRITORY_UPDATE/Similar)
- **Prompt 22:** Client: Handle Territory Update (Update Local State, Update PixiJS Visuals - e.g., highlight)
- **Prompt 23:** Server: Database Setup (Install Prisma, dotenv, Connect, .env)
- **Prompt 24:** Server: Define PlayerProfile Schema (Prisma Schema File) & Migrate
- **Prompt 25:** Server: Implement Basic Profile Service (findOrCreateProfile using Prisma Client) + Integration Tests (Test DB)
- **Prompt 26:** Server: Integrate Profile Service (Call findOrCreateProfile on connect - minimal linkage for now)

**Phase 4: Scenario Toggle & Basic Linkage**

- **Prompt 27:** Server: Add gamePhase to GameState, Implement START_SCENARIO Handler (Validate, Update Phase, Init Basic ScenarioState) + Tests
- **Prompt 28:** Server: Broadcast Phase Change (PHASE_CHANGE message)
- **Prompt 29:** Client: Handle PHASE_CHANGE (Update State, Conditional Rendering Logic - Show Placeholder ScenarioView)
- **Prompt 30:** Client: Scenario Placeholder Interaction (Button/Click sends SCENARIO_ACTION - e.g., 'MOVE')
- **Prompt 31:** Server: Handle Basic SCENARIO_ACTION (Validate vs ScenarioState, Update Placeholder State) + Tests
- **Prompt 32:** Server: Implement Scenario End Logic (Manual Trigger/Simple Action -> Calculate Outcome, Update Overworld Placeholder, Change Phase Back) + Tests
- **Prompt 33:** Server: Broadcast Scenario Outcome & Overworld Updates
- **Prompt 34:** Client: Handle Scenario End Updates (Switch View Back, Update Overworld Display)

(Further phases would cover Cards, Factions, Full Persistence, AI, etc., following the same pattern)

---

**Generated Master Prompts (Following the Flowchart)**

```
Prompt 1: Server - Project Initialization (Node, TS, Jest)

Objective: Set up the foundational structure and configuration for the Node.js server using TypeScript and Jest.

Requirements:
1.  Create a root project directory (e.g., `end-of-line`). Inside it, create a `server` directory.
2.  Navigate into the `server` directory and initialize a Node.js project (`npm init -y`).
3.  Install necessary dev dependencies: `typescript`, `@types/node`, `ts-node`, `nodemon`, `jest`, `ts-jest`, `@types/jest`.
4.  Create a `tsconfig.json` file configured for Node.js (e.g., `module: CommonJS`, `outDir: ./dist`, `rootDir: ./src`, `target: ES2016` or later, `strict: true`, `esModuleInterop: true`, `skipLibCheck: true`, `forceConsistentCasingInFileNames: true`).
5.  Create directories: `src/` and `tests/`.
6.  Create `src/server.ts` with a simple log: `console.log("Server starting...");`.
7.  Create `jest.config.js` using `ts-jest` preset and `node` environment.
8.  Add scripts to `package.json`:
    - `"build": "tsc"`
    - `"start": "node dist/server.js"`
    - `"dev": "nodemon src/server.ts"`
    - `"test": "jest"`
9.  Create `tests/dummy.test.ts` with a basic passing test: `test('should pass', () => { expect(true).toBe(true); });`.
10. Verify `npm run build`, `npm run dev`, and `npm run test` execute correctly.

Provide the full content for `server/package.json`, `server/tsconfig.json`, `server/jest.config.js`, `server/src/server.ts`, and `server/tests/dummy.test.ts`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 2: Server - Basic WebSocket Server Setup

Objective: Integrate the `ws` library to create a basic WebSocket server that logs connection events. Builds on Prompt 1.

Requirements:
1.  Inside the `server` directory, install the `ws` library and its types: `npm install ws @types/ws`.
2.  Modify `src/server.ts`.
3.  Import `WebSocketServer` and `WebSocket` from `ws`.
4.  Define a port (e.g., 8080) - consider using environment variables later, but hardcode for now.
5.  Create a `WebSocketServer` instance listening on the defined port.
6.  Log a message indicating the WebSocket server is listening (e.g., `WebSocket server started on port ${port}`).
7.  Add a listener for the `connection` event on the `WebSocketServer`.
8.  Inside the `connection` handler:
    - Accept the incoming `WebSocket` instance (`ws`).
    - Log a message: `"Client connected"`.
    - Add a listener for the `close` event on the `ws` instance. Log `"Client disconnected"` inside it.
    - Add a listener for the `error` event on the `ws` instance. Log `"WebSocket error: "` followed by the error object inside it.
9.  Ensure the server still runs correctly via `npm run dev`.

Provide the updated content for `server/src/server.ts`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 3: Client - Project Initialization (Vite, React, TS)

Objective: Set up the foundational structure for the React client using Vite and TypeScript.

Requirements:
1.  In the root project directory (`end-of-line`), create a `client` directory alongside the `server` directory.
2.  Navigate into the `client` directory.
3.  Initialize a new Vite project using the React TypeScript template: `npm create vite@latest . -- --template react-ts` (use `.` for current directory).
4.  Install dependencies: `npm install`.
5.  Clean up default boilerplate in `src/App.tsx` and `src/App.css` (remove logos, counters, etc.), leaving a minimal functional component.
6.  Create project directories: `src/components/`, `src/hooks/`, `src/services/`, `src/pixi/`, `src/types/`.
7.  Verify the client runs using `npm run dev`.

Provide the cleaned-up content for `client/src/App.tsx` and `client/src/App.css`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 4: Client - Basic PixiJS Canvas Setup

Objective: Integrate PixiJS into the React client to render a basic canvas with a shape. Builds on Prompt 3.

Requirements:
1.  Inside the `client` directory, install PixiJS: `npm install pixi.js`.
2.  Create a new React component `src/components/PixiCanvas.tsx`.
3.  In `PixiCanvas.tsx`:
    - Import `React`, `useRef`, `useEffect` from 'react'.
    - Import `Application`, `Graphics` from 'pixi.js'.
    - Use `useRef<HTMLDivElement>(null)` to reference a container div.
    - Use `useEffect` to run *only once* on mount:
        - Create a PixiJS `Application` instance (e.g., with background color).
        - Append `app.view` (the canvas) to the `containerRef.current` if it exists.
        - Create a simple `Graphics` object (e.g., a red square) and add it to `app.stage`.
        - Return a cleanup function that calls `app.destroy(true, { children: true, texture: true, baseTexture: true })` to prevent memory leaks on unmount.
    - Render a `div` element with the `ref={containerRef}`.
4.  Modify `src/App.tsx` to import and render the `PixiCanvas` component.
5.  Verify using `npm run dev` that the React app displays the PixiJS canvas containing the red square.

Provide the full content for `client/src/components/PixiCanvas.tsx` and the updated `client/src/App.tsx`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 5: Client - WebSocket Connection Hook/Service

Objective: Implement a reusable React hook to manage the WebSocket connection to the server. Builds on Prompts 2 & 4.

Requirements:
1.  Create a new file `src/hooks/useWebSocket.ts`.
2.  Implement a custom hook `useWebSocket(url: string)`.
3.  Inside the hook:
    - Use `useState<WebSocket | null>(null)` to store the WebSocket instance.
    - Use `useEffect` to establish the connection when the `url` changes or component mounts:
        - Create a `new WebSocket(url)`.
        - Set up event listeners (`onopen`, `onclose`, `onerror`, `onmessage`) on the WebSocket instance.
        - `onopen`: Log "WebSocket connected", set the state with the `ws` instance.
        - `onclose`: Log "WebSocket disconnected", set the state back to `null`.
        - `onerror`: Log the error event.
        - `onmessage`: Log the received message data (e.g., `event.data`).
        - Return a cleanup function that closes the connection (`ws.close()`) if it's open and sets state to `null`.
    - Define a `sendMessage(data: object)` function within the hook. This function should check if the `webSocket` state is not null and its `readyState` is `WebSocket.OPEN`. If so, `JSON.stringify` the data and call `webSocket.send()`. Include basic error handling (e.g., console log if not connected).
    - Return the connection status (e.g., a boolean `isConnected`) and the `sendMessage` function from the hook.
4.  Modify `src/App.tsx`:
    - Import `useWebSocket`.
    - Call the hook: `const { isConnected, sendMessage } = useWebSocket('ws://localhost:8080');` (replace 8080 if different).
    - Display the `isConnected` status somewhere in the UI.
5.  Run both server (Prompt 2) and client. Verify connection logs appear on both sides and the client UI shows the connected status.

Provide the full content for `client/src/hooks/useWebSocket.ts` and the updated `client/src/App.tsx`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 6: Server - Connection Management & Unique IDs

Objective: Assign unique IDs to clients, track active connections, and handle cleanup on disconnect. Builds on Prompt 2. Add tests.

Requirements:
1.  Inside the `server` directory, install `uuid` and its types: `npm install uuid @types/uuid`.
2.  Modify `src/server.ts`.
3.  Import `v4 as uuidv4` from `uuid`.
4.  Import `WebSocket` type from `ws`.
5.  Create a global `Map` to store active clients: `const clients = new Map<string, WebSocket>();`.
6.  Modify the `connection` event handler:
    - Generate a unique `clientId` using `uuidv4()`.
    - Store the client: `clients.set(clientId, ws);`.
    - Log the connection: `console.log(`Client connected: ${clientId}`);`.
    - **Important:** Inside the `close` event handler for `ws`:
        - Remove the client from the map: `clients.delete(clientId);`.
        - Log the disconnection: `console.log(`Client disconnected: ${clientId}`);`.
    - Inside the `error` event handler for `ws`:
        - Log the error with the client ID: `console.error(`WebSocket error on client ${clientId}:`, error);`.
        - Consider also removing the client here if an error implies disconnection: `clients.delete(clientId);`.
7.  Create a test file `tests/serverConnection.test.ts` (or similar).
8.  Write Jest tests to verify:
    - A client connecting adds an entry to the `clients` map.
    - A client disconnecting removes the entry from the `clients` map.
    - (These tests will likely require mocking the `ws` server and client objects).

Provide the updated content for `server/src/server.ts` and the new test file `server/tests/serverConnection.test.ts`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 7: Shared - Define Basic Message Types

Objective: Create shared TypeScript types for WebSocket message protocols.

Requirements:
1.  Create a shared types directory accessible by both client and server, OR duplicate this file in both `client/src/types/` and `server/src/types/`. Let's start with duplication: create `protocol.ts` in both locations.
2.  In `protocol.ts`, define:
    - An enum for message types: `export enum MessageType { ECHO = 'ECHO', ERROR = 'ERROR', // Add more later }`
    - A base message interface: `export interface BaseMessage { type: MessageType | string; }`
    - Generic client-to-server message: `export interface ClientToServerMessage<T = any> extends BaseMessage { payload: T; }`
    - Generic server-to-client message: `export interface ServerToClientMessage<T = any> extends BaseMessage { payload: T; }`
    - Specific type for Echo: `export interface EchoMessage extends ClientToServerMessage<{ message: string }> {}`
    - Specific type for Echo Response: `export interface EchoResponseMessage extends ServerToClientMessage<{ response: string }> {}`
    - Specific type for Error Response: `export interface ErrorResponseMessage extends ServerToClientMessage<{ message: string; originalAction?: BaseMessage }> {}`

Provide the content for `protocol.ts`. Indicate it should be placed in both `client/src/types/` and `server/src/types/`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 8: Server - Implement Echo Handler

Objective: Handle incoming messages on the server, parse them, and implement an echo handler using the defined types. Builds on Prompts 6 & 7. Add tests.

Requirements:
1.  Modify `src/server.ts`.
2.  Import types from `./types/protocol`.
3.  Inside the `connection` handler, add a listener for the `message` event on the `ws` instance.
4.  In the `message` handler:
    - Receive the raw data (`message`). Assume it's a UTF-8 string.
    - Use a `try-catch` block for parsing: `const parsedMessage: BaseMessage = JSON.parse(message.toString());`.
    - Inside `catch`, log the parsing error and potentially send an `ERROR` message back to the client (using the `ErrorResponseMessage` type).
    - Validate if `parsedMessage` has a `type` property. If not, log an error/send an `ERROR` message.
    - Implement message routing (e.g., `switch (parsedMessage.type)`).
    - **Case `MessageType.ECHO`**:
        - Cast the message: `const echoPayload = (parsedMessage as EchoMessage).payload;`. Add basic validation if `payload` or `payload.message` is missing.
        - Log: `console.log(`Received ECHO from ${clientId}: ${echoPayload.message}`);`.
        - Construct the response: `const response: EchoResponseMessage = { type: MessageType.ECHO, payload: { response: echoPayload.message } };`.
        - Send the response back to the *originating* client: `ws.send(JSON.stringify(response));`. Add error handling around `ws.send`.
    - Add a `default` case in the switch to handle unknown message types (log a warning).
5.  Create/Update a test file (e.g., `tests/serverMessages.test.ts`).
6.  Write Jest tests for the message handler logic:
    - Test successful ECHO request leads to correct ECHO response.
    - Test invalid JSON input results in an ERROR message (or appropriate handling).
    - Test messages with missing 'type' are handled.
    - Test unknown message types are handled. (Requires mocking `ws.send`).

Provide the updated `server/src/server.ts` content focusing on the `message` handler, and the content for `server/tests/serverMessages.test.ts`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 9: Client - Implement Echo UI & Logic

Objective: Allow the user to send an ECHO message from the client and display the response. Builds on Prompts 5 & 7.

Requirements:
1.  Modify `src/hooks/useWebSocket.ts`.
    - Accept an optional callback prop for handling messages: `onMessage?: (message: ServerToClientMessage) => void`.
    - Inside the `onmessage` event handler, after parsing the message (`JSON.parse(event.data)`), call `onMessage(parsedMessage)` if the callback exists. Add type safety and error handling around parsing.
2.  Modify `src/App.tsx`.
    - Import necessary types from `../types/protocol`.
    - Add state for an input field: `const [inputValue, setInputValue] = useState('');`.
    - Add state to display the echo response: `const [echoResponse, setEchoResponse] = useState<string | null>(null);`.
    - Define the `handleMessage` callback function:
        - It takes `message: ServerToClientMessage`.
        - Use a switch on `message.type`.
        - Case `MessageType.ECHO`: Cast message to `EchoResponseMessage`, update `setEchoResponse(message.payload.response)`.
        - Handle other message types (e.g., `ERROR`) appropriately (log for now).
    - Pass this `handleMessage` callback to `useWebSocket`: `useWebSocket('ws://localhost:8080', { onMessage: handleMessage });`.
    - Add an `<input>` element controlled by `inputValue`.
    - Add a `<button>` element. On click:
        - Construct the `EchoMessage`: `const message: EchoMessage = { type: MessageType.ECHO, payload: { message: inputValue } };`.
        - Call `sendMessage(message)` from the `useWebSocket` hook.
        - Optionally clear the input: `setInputValue('');`.
    - Display the `echoResponse` state somewhere in the UI (e.g., `<p>Server response: {echoResponse}</p>`).
3.  Run server (Prompt 8) and client. Test sending text via the input/button and verify the server's echo appears in the client UI.

Provide the updated `client/src/hooks/useWebSocket.ts` and `client/src/App.tsx`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

**(Continue with Prompts 10-34+ following the flowchart and the established pattern, ensuring each builds logically, integrates correctly, includes specific requirements, and demands tests for new logic.)**

177.8s

edit

more_vert

Go ahead and continue from there, I think you didnt have enough output tokens to finish

more_vert

Thoughts

\*The thoughts produced by the model are experimental

experiment

Expand to view model thoughts

13.8s

edit

more_vert

Okay, continuing from Prompt 9.

---

```
Prompt 10: Server - Define Core Game State Interfaces

Objective: Define the basic TypeScript interfaces for managing game state on the server. Builds on Prompt 7 (shared types).

Requirements:
1.  Create a new file `server/src/types/game.ts`.
2.  In `game.ts`, define and export the following interfaces:
    - `export interface PlayerState { id: string; // Corresponds to clientId status: 'connected' | 'disconnected'; displayName?: string; // Will be added later from profile // Add other player-specific state later (faction, resources, etc.) }`
    - `export type GamePhase = 'WAITING' | 'OVERWORLD' | 'SCENARIO';`
    - `export interface GameState { gameId: string; players: Map<string, PlayerState>; // Keyed by PlayerState.id (clientId) phase: GamePhase; // Add more game-wide state later (turn, territories, etc.) }`

Provide the full content for `server/src/types/game.ts`. No new tests needed as this only defines types.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 11: Server - Implement In-Memory Game Store

Objective: Create an in-memory store to hold active game states and add new players to a game upon connection. Builds on Prompts 6 & 10. Add tests.

Requirements:
1.  Modify `server/src/server.ts`.
2.  Import `GameState`, `PlayerState` from `./types/game`.
3.  Create a global Map to store active games: `const activeGames = new Map<string, GameState>();`.
4.  Define a constant for a single game instance for now: `const LOBBY_GAME_ID = 'lobby_01';`.
5.  Create a function `getOrCreateGame(gameId: string): GameState`:
    - Check if `activeGames.has(gameId)`.
    - If yes, return `activeGames.get(gameId)!`.
    - If no, create `const newGame: GameState = { gameId, players: new Map<string, PlayerState>(), phase: 'WAITING' };`.
    - Store it: `activeGames.set(gameId, newGame);`.
    - Return `newGame`.
6.  Modify the `connection` event handler:
    - After generating `clientId` and adding to `clients` map (from Prompt 6):
    - Get the game instance: `const game = getOrCreateGame(LOBBY_GAME_ID);`.
    - Create the player state: `const newPlayer: PlayerState = { id: clientId, status: 'connected' };`.
    - Add the player to the game: `game.players.set(clientId, newPlayer);`.
    - **Crucially:** Attach the `gameId` and `clientId` to the `ws` object for later retrieval (use `any` cast for now, or define a custom WebSocket type):
        - `(ws as any).clientId = clientId;`
        - `(ws as any).gameId = gameId;`
    - Log player addition: `console.log(`Player ${clientId} added to game ${game.gameId}`);`.
7.  Create/Update `tests/serverGameState.test.ts`.
8.  Write Jest tests for `getOrCreateGame`:
    - Test that it returns an existing game if found.
    - Test that it creates and returns a new game if not found.
    - Test that adding a player via the connection logic correctly modifies the `GameState.players` map (may require mocking parts of the connection handler or extracting player addition logic).

Provide the updated content for `server/src/server.ts` (showing the new map, function, and connection handler changes) and the new test file `server/tests/serverGameState.test.ts`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 12: Server - Handle Player Disconnect in Game State

Objective: Update the player's status in the game state when their WebSocket connection closes. Builds on Prompt 11. Add tests.

Requirements:
1.  Modify `src/server.ts`.
2.  Inside the `close` event handler for the `ws` instance (within the main `connection` handler):
    - Retrieve the `clientId` and `gameId` from the `ws` object:
        - `const clientId = (ws as any).clientId;`
        - `const gameId = (ws as any).gameId;`
    - Check if `clientId` and `gameId` exist (they should).
    - Find the game: `const game = activeGames.get(gameId);`.
    - If the game exists:
        - Find the player in the game: `const player = game.players.get(clientId);`.
        - If the player exists, update their status: `player.status = 'disconnected';`. Log this change.
        - **(Optional future step): Consider logic here to remove the game if it becomes empty.**
    - Ensure the client is still removed from the main `clients` map (from Prompt 6 logic).
3.  Update `tests/serverGameState.test.ts`.
4.  Add Jest tests to verify:
    - When a client disconnects, the corresponding `PlayerState` in the `GameState.players` map has its `status` updated to `'disconnected'`. (This will require simulating a connection, adding the player, and then triggering the `close` event on the mocked `ws` object).

Provide the updated `close` handler logic within `server/src/server.ts` and the new tests in `server/tests/serverGameState.test.ts`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 13: Server - Broadcast Initial Game State

Objective: Send the current game state to a newly connecting client. Builds on Prompts 7, 11. Add tests.

Requirements:
1.  Modify `server/src/types/protocol.ts`:
    - Add `GAME_STATE_INIT = 'GAME_STATE_INIT'` to `MessageType` enum.
    - Define the payload structure. Since `Map` doesn't serialize well, convert `players` to an array:
        `import { GameState, PlayerState } from './game';`
        `export type GameStateInitPayload = Omit<GameState, 'players'> & { players: PlayerState[] };`
        `export interface GameStateInitMessage extends ServerToClientMessage<GameStateInitPayload> {}`
2.  Modify `server/src/server.ts`.
3.  Import the new types from `./types/protocol`.
4.  Import `PlayerState` from `./types/game`.
5.  Inside the `connection` handler, *after* the new player has been added to the `game.players` map:
    - Prepare the payload: Convert `game.players` map to an array: `const playersArray = Array.from(game.players.values());`.
    - Construct the payload object: `const gameStatePayload: GameStateInitPayload = { ...game, players: playersArray };`.
    - Construct the message: `const initMessage: GameStateInitMessage = { type: MessageType.GAME_STATE_INIT, payload: gameStatePayload };`.
    - Send the message **only to the newly connected client (`ws`)**: `ws.send(JSON.stringify(initMessage));`. Handle potential send errors.
6.  Update `tests/serverMessages.test.ts` or `tests/serverGameState.test.ts`.
7.  Add Jest tests to verify:
    - When a client connects, a message with `type: MessageType.GAME_STATE_INIT` is sent to that client.
    - Verify the payload structure, specifically that `players` is an array of `PlayerState`. (Requires mocking `ws.send`).

Provide the updated `server/src/types/protocol.ts` and the relevant section of the `connection` handler in `server/src/server.ts`. Also provide the new tests. Remember to update the client's `protocol.ts` too (mention this, no need to provide the file again unless changed beyond adding types).
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 14: Server - Broadcast Player Join/Leave Notifications

Objective: Notify existing clients when a player joins or leaves the game. Builds on Prompts 12 & 13. Add tests.

Requirements:
1.  Modify `server/src/types/protocol.ts`:
    - Add `PLAYER_JOINED = 'PLAYER_JOINED'` and `PLAYER_LEFT = 'PLAYER_LEFT'` to `MessageType` enum.
    - `import { PlayerState } from './game';`
    - `export interface PlayerJoinedMessage extends ServerToClientMessage<{ player: PlayerState }> {}`
    - `export interface PlayerLeftMessage extends ServerToClientMessage<{ playerId: string }> {}`
2.  Modify `server/src/server.ts`.
3.  Import the new types.
4.  Create a helper function `broadcastToGame(gameId: string, message: ServerToClientMessage<any>, senderClientId?: string)`:
    - Find the game: `const game = activeGames.get(gameId);`. If no game, return.
    - Iterate through `game.players.keys()` (which are client IDs).
    - For each `clientId`:
        - If `clientId === senderClientId`, skip.
        - Find the corresponding WebSocket in the main `clients` map: `const targetWs = clients.get(clientId);`.
        - If `targetWs` exists and `targetWs.readyState === WebSocket.OPEN`:
            - `targetWs.send(JSON.stringify(message));` (add error handling).
5.  In the `connection` handler, after adding the `newPlayer` and sending `GAME_STATE_INIT` to them:
    - Construct the join message: `const joinedMessage: PlayerJoinedMessage = { type: MessageType.PLAYER_JOINED, payload: { player: newPlayer } };`.
    - Call `broadcastToGame(game.gameId, joinedMessage, clientId);` (where `clientId` is the ID of the newly connected player).
6.  In the `close` handler, after updating the player status to `'disconnected'`:
    - Construct the left message: `const leftMessage: PlayerLeftMessage = { type: MessageType.PLAYER_LEFT, payload: { playerId: clientId } };` (where `clientId` is the ID of the disconnected player).
    - Call `broadcastToGame(gameId, leftMessage);` (no need to exclude sender here as they are disconnected).
7.  Update relevant test files (e.g., `serverMessages.test.ts`).
8.  Add Jest tests:
    - Verify `PLAYER_JOINED` is broadcast to other clients when a new client connects. Check the payload.
    - Verify `PLAYER_LEFT` is broadcast to other clients when a client disconnects. Check the payload. (Requires mocking `clients` map and `ws.send`).

Provide the updated `server/src/types/protocol.ts`, the new `broadcastToGame` function, the modifications to the `connection` and `close` handlers in `server/src/server.ts`, and the associated tests. Remind to update client types.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 15: Client - Handle Game State Updates

Objective: Receive game state messages from the server and store/update the local state representation. Builds on Prompts 9, 13, 14.

Requirements:
1.  Ensure `client/src/types/protocol.ts` and `client/src/types/game.ts` (create if needed) are updated with the latest server types (`GameStateInitMessage`, `PlayerJoinedMessage`, `PlayerLeftMessage`, `GameState`, `PlayerState`, `GamePhase`).
2.  Create a state management setup in `src/App.tsx` (or ideally, extract to a context/store later). For now, use `useState` in `App.tsx`:
    - `const [gameState, setGameState] = useState<GameState | null>(null);`
3.  Modify the `handleMessage` callback function provided to `useWebSocket` in `src/App.tsx`:
    - **Case `MessageType.GAME_STATE_INIT`**:
        - Cast `message` to `GameStateInitMessage`.
        - Convert the received `players` array back into a Map: `const playersMap = new Map(message.payload.players.map(p => [p.id, p]));`.
        - Update the local state: `setGameState({ ...message.payload, players: playersMap });`.
    - **Case `MessageType.PLAYER_JOINED`**:
        - Cast `message` to `PlayerJoinedMessage`.
        - Update state immutably: Check if `gameState` exists. If yes, create a new `players` map, add the new player, and `setGameState` with the updated map.
        - `setGameState(prevState => { if (!prevState) return null; const newPlayers = new Map(prevState.players); newPlayers.set(message.payload.player.id, message.payload.player); return { ...prevState, players: newPlayers }; });`
    - **Case `MessageType.PLAYER_LEFT`**:
        - Cast `message` to `PlayerLeftMessage`.
        - Update state immutably: Check if `gameState` exists. If yes, find the player by `message.payload.playerId`. If found, update their status to `'disconnected'` in a *new* `players` map, and `setGameState`. (Alternatively, remove them, but updating status might be better for UI).
        - `setGameState(prevState => { /* ... immutable update logic ... */ });`
4.  Display basic game state information in the `App.tsx` render:
    - If `gameState` is null, show "Connecting...".
    - If `gameState` exists:
        - Show `Game ID: {gameState.gameId}`.
        - Show `Phase: {gameState.phase}`.
        - List players: `<ul>{Array.from(gameState.players.values()).map(p => <li key={p.id}>{p.id} ({p.status})</li>)}</ul>`.
5.  Test by opening multiple client tabs. Verify:
    - Each client receives the initial state.
    - Player list updates correctly when others join/leave (status changes).

Provide the updated `client/src/App.tsx` incorporating state management and message handling logic. Create `client/src/types/game.ts` if it doesn't exist.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 16: Server - Define Static Territory Data

Objective: Define the structure for territory data and load some static examples.

Requirements:
1.  Modify `server/src/types/game.ts`:
    - Define the `TerritoryType`: `export type TerritoryType = 'CORPORATE' | 'FRINGE' | 'UNDERGROUND';`.
    - Define the `Territory` interface:
        `export interface Territory { id: string; name: string; type: TerritoryType; // Placeholder for rendering position x: number; y: number; // Add other properties later: security_level, resource_value, stability_index, corporate_influence, adjacent_territory_ids, etc. }`
2.  Create a static data file, e.g., `server/src/data/territories.json`.
3.  Populate `territories.json` with a few sample `Territory` objects in an array format. Include unique `id`, `name`, `type`, and placeholder `x`, `y` coordinates.

Provide the additions to `server/src/types/game.ts` and the content for `server/src/data/territories.json`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 17: Server - Integrate Territories into Game State & Broadcast

Objective: Load static territory data into the game state upon creation and include it in the initial broadcast. Builds on Prompts 11, 13, 16.

Requirements:
1.  Modify `server/src/types/game.ts`:
    - Add `territories: Map<string, Territory>; // Keyed by Territory.id` to the `GameState` interface.
2.  Modify `server/src/server.ts`:
    - Import `Territory` from `./types/game`.
    - Import the static data: `import territoriesData from './data/territories.json';`.
    - Modify the `getOrCreateGame` function:
        - When creating a `newGame`, initialize the `territories` map:
            - `const territoriesMap = new Map<string, Territory>();`
            - `territoriesData.forEach(t => territoriesMap.set(t.id, t as Territory));`
            - Assign this map to `newGame.territories`.
    - Modify the preparation of the `GameStateInitMessage` payload (in the `connection` handler):
        - Convert the `game.territories` map to an array for serialization: `const territoriesArray = Array.from(game.territories.values());`.
        - Add this array to the `gameStatePayload` object.
3.  Modify `server/src/types/protocol.ts`:
    - Update the `GameStateInitPayload` type definition to include `territories: Territory[];`.
4.  Update relevant tests (`serverGameState.test.ts`, `serverMessages.test.ts`) to account for the new `territories` field in `GameState` and the `GAME_STATE_INIT` message payload.

Provide the updated `server/src/types/game.ts` (`GameState` interface), the modified `getOrCreateGame` function and `connection` handler section in `server/src/server.ts`, the updated `GameStateInitPayload` in `server/src/types/protocol.ts`, and adjustments to related tests. Remind to update client types.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 18: Client - Render Static Territories

Objective: Receive territory data and render a basic representation using PixiJS. Builds on Prompts 4, 15, 17.

Requirements:
1.  Ensure client types (`protocol.ts`, `game.ts`) are updated to include `Territory` and the `territories` array in the `GAME_STATE_INIT` payload.
2.  Update the client state management (`App.tsx` or context/store) to store the `territories` (likely as a `Map<string, Territory>` for easy lookup) when handling `GAME_STATE_INIT`.
3.  Create a dedicated PixiJS rendering module/class, e.g., `src/pixi/OverworldRenderer.ts`.
    - It should have methods like `initialize(app: PIXI.Application)`, `renderTerritories(territories: Map<string, Territory>)`, and potentially `updateTerritory(territory: Territory)`.
    - The `renderTerritories` method should:
        - Clear previous territory graphics/sprites if necessary.
        - Iterate over the `territories` map.
        - For each territory, create a `PIXI.Graphics` object (e.g., a hexagon shape using its `x`, `y` coordinates) or a simple `PIXI.Sprite`. Store these display objects (e.g., in a `Map<string, PIXI.DisplayObject>`).
        - Add a `PIXI.Text` label showing the territory `name` near its graphic.
        - Add the graphics and text to a container (e.g., `territoryLayer = new PIXI.Container()`) which is added to the main PixiJS stage.
4.  Modify `src/components/PixiCanvas.tsx`:
    - Instantiate the `OverworldRenderer`.
    - Call `overworldRenderer.initialize(app)` in the initial `useEffect`.
    - Use another `useEffect` hook that triggers when the `gameState.territories` changes. Inside this effect, call `overworldRenderer.renderTerritories(gameState.territories)`.
5.  Modify `src/App.tsx` to pass the `gameState.territories` down to `PixiCanvas` (or use context).
6.  Run server and client. Verify that after connecting, the territories loaded on the server are rendered on the client's PixiJS canvas.

Provide the content for `client/src/pixi/OverworldRenderer.ts`, the updated `client/src/components/PixiCanvas.tsx`, and necessary changes in `client/src/App.tsx` to handle and pass territory data.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 19: Client - Implement Territory Interaction

Objective: Make the rendered territories clickable and send a message to the server upon click. Builds on Prompt 18.

Requirements:
1.  Modify `client/src/pixi/OverworldRenderer.ts`:
    - When creating territory graphics/sprites in `renderTerritories`:
        - Set `interactive = true` and `buttonMode = true`.
        - Store the territory `id` on the display object (e.g., `graphic.territoryId = territory.id;` using `any` or extending the type).
        - Add a `pointerdown` event listener to each territory graphic/sprite.
    - Define a callback property for the renderer, e.g., `onTerritoryClick?: (territoryId: string) => void;`.
    - In the `pointerdown` listener, call this callback with the territory ID: `this.onTerritoryClick?.(graphic.territoryId);`.
2.  Modify `client/src/components/PixiCanvas.tsx`:
    - Accept a prop `onTerritorySelect: (territoryId: string) => void`.
    - Pass this prop to the `OverworldRenderer` instance (e.g., `overworldRenderer.onTerritoryClick = onTerritorySelect;`).
3.  Modify `client/src/App.tsx`:
    - Import `ClientToServerMessage`, `MessageType`, define `SelectTerritoryMessage` type in `protocol.ts` (Payload: `{ territoryId: string }`). Update server `protocol.ts` too.
    - Define a function `handleTerritorySelect(territoryId: string)`:
        - Construct the message: `const message: SelectTerritoryMessage = { type: MessageType.SELECT_TERRITORY, payload: { territoryId } };` (Add `SELECT_TERRITORY` to enum).
        - Call `sendMessage(message)` from the `useWebSocket` hook.
        - Log the action: `console.log("Selected territory:", territoryId);`.
    - Pass `handleTerritorySelect` as the `onTerritorySelect` prop to `PixiCanvas`.
4.  Run server and client. Verify clicking on a territory logs the selection on the client and sends a `SELECT_TERRITORY` message (check server logs for received messages, though it won't handle it yet).

Provide the updated `client/src/pixi/OverworldRenderer.ts`, `client/src/components/PixiCanvas.tsx`, relevant parts of `client/src/App.tsx`, and the additions to `protocol.ts` (both client and server).
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 20: Server - Handle SELECT_TERRITORY Message

Objective: Process the `SELECT_TERRITORY` message, validate it, and update the server's game state. Builds on Prompts 11, 17, 19. Add tests.

Requirements:
1.  Ensure server `protocol.ts` has `SELECT_TERRITORY` enum member and `SelectTerritoryMessage` type (Payload: `{ territoryId: string }`).
2.  Modify `src/server.ts`.
3.  Import `SelectTerritoryMessage`, `MessageType`.
4.  Modify the `message` handler (within the `connection` handler):
    - Add a `case MessageType.SELECT_TERRITORY:` to the switch statement.
    - Retrieve `clientId` and `gameId` from the `ws` object.
    - Find the game state: `const game = activeGames.get(gameId);`. Handle if game not found.
    - Cast the message: `const payload = (parsedMessage as SelectTerritoryMessage).payload;`.
    - **Validation:**
        - Check if `payload` and `payload.territoryId` exist.
        - Check if the territory exists in the game state: `game.territories.has(payload.territoryId)`.
        - **(Future): Add turn validation, phase validation, etc.**
        - If validation fails, send an `ERROR` message back to the client (`ws.send(...)`).
    - **State Update:**
        - If valid, update the game state. For now, let's just log it and store the selector:
            - `console.log(`Player ${clientId} selected territory ${payload.territoryId} in game ${gameId}`);`
            - Add a temporary field to `GameState` like `selectedTerritories: Map<string, string>` (mapping territoryId to clientId) or update the `Territory` object itself (requires making `Territory` mutable or replacing it in the map). Let's add a simple top-level map for now: `if (!game.selectedTerritories) game.selectedTerritories = new Map(); game.selectedTerritories.set(payload.territoryId, clientId);` (Ensure `GameState` interface in `game.ts` is updated).
        - **(Action): Trigger broadcast (Prompt 21).**
5.  Update `tests/serverMessages.test.ts`.
6.  Add Jest tests:
    - Test valid `SELECT_TERRITORY` message updates the (temporary) `selectedTerritories` map in the game state.
    - Test `SELECT_TERRITORY` for a non-existent territory sends an ERROR message.
    - Test `SELECT_TERRITORY` with invalid payload sends an ERROR message.

Provide the updated `message` handler logic in `server/src/server.ts`, the required changes to the `GameState` interface in `server/src/types/game.ts`, and the new tests in `server/tests/serverMessages.test.ts`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 21: Server - Broadcast Territory Update

Objective: Notify all clients in a game when a territory's state changes (e.g., selection). Builds on Prompts 14 & 20.

Requirements:
1.  Modify `server/src/types/protocol.ts`:
    - Add `TERRITORY_UPDATE = 'TERRITORY_UPDATE'` to `MessageType`.
    - Define the message: `export interface TerritoryUpdateMessage extends ServerToClientMessage<{ territoryId: string; selectedBy?: string; /* Add other update fields later */ }> {}`
2.  Modify `src/server.ts`.
3.  Import `TerritoryUpdateMessage`, `MessageType`.
4.  In the `message` handler, within the `case MessageType.SELECT_TERRITORY:`, after successfully validating and updating the server state:
    - Construct the update message: `const updateMessage: TerritoryUpdateMessage = { type: MessageType.TERRITORY_UPDATE, payload: { territoryId: payload.territoryId, selectedBy: clientId } };`.
    - Use the `broadcastToGame` helper function (from Prompt 14) to send this message to all clients in the game: `broadcastToGame(gameId, updateMessage);`.
5.  Update tests in `server/tests/serverMessages.test.ts` to verify that a valid `SELECT_TERRITORY` message triggers the broadcast of a `TERRITORY_UPDATE` message to all clients (mocking required). Check the payload.

Provide the updated `server/src/types/protocol.ts`, the modifications within the `SELECT_TERRITORY` case in `server/src/server.ts`, and the updated tests. Remind to update client types.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 22: Client - Handle Territory Update

Objective: Receive territory update messages and update the local state and PixiJS visualization. Builds on Prompts 15, 18, 21.

Requirements:
1.  Ensure client `protocol.ts` is updated with `TERRITORY_UPDATE` and `TerritoryUpdateMessage`.
2.  Modify the client state management (`App.tsx` or context/store). Add state to track selected territories, e.g., `selectedTerritoryMap = new Map<string, string>()` mapping territoryId to clientId.
3.  Modify the `handleMessage` callback function provided to `useWebSocket` in `src/App.tsx`:
    - Add `case MessageType.TERRITORY_UPDATE:`.
    - Cast `message` to `TerritoryUpdateMessage`.
    - Update the local selection state immutably. For simplicity, maybe just track the *last* selected territory: `setLastSelectedTerritory({ id: message.payload.territoryId, selectedBy: message.payload.selectedBy });`. Clear previous selections if needed.
4.  Modify `client/src/pixi/OverworldRenderer.ts`:
    - Add a method `updateTerritoryVisual(territoryId: string, isSelected: boolean, selectedBy?: string)` (or similar).
    - This method should find the corresponding PixiJS display object for `territoryId`.
    - Update its appearance (e.g., change fill color, add a border/tint based on `isSelected` and potentially `selectedBy`). Reset others to default appearance.
5.  Modify `client/src/components/PixiCanvas.tsx`:
    - Use a `useEffect` hook that depends on the selection state managed in `App.tsx` (e.g., `lastSelectedTerritory`).
    - Inside the effect, call the `overworldRenderer.updateTerritoryVisual` method to update the visuals based on the current selection state.
6.  Modify `src/App.tsx` to pass the selection state down to `PixiCanvas` or use context.
7.  Run server and client. Verify clicking a territory updates its visual state (e.g., highlights it) for all connected clients.

Provide the necessary state additions and updated `handleMessage` logic in `client/src/App.tsx`, the new `updateTerritoryVisual` method and necessary adjustments in `client/src/pixi/OverworldRenderer.ts`, and the new `useEffect` in `client/src/components/PixiCanvas.tsx`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

(This seems like a good point to pause before diving into database setup, which is a larger conceptual block). I can continue with Prompt 23 onwards if needed.

80.2s

edit

more_vert

ya, continue

more_vert

Thoughts

\*The thoughts produced by the model are experimental

experiment

Expand to view model thoughts

4.6s

edit

more_vert

Okay, let's proceed with integrating the database.

---

```
Prompt 23: Server - Database Setup (Prisma, Dotenv, Connection)

Objective: Install Prisma and related dependencies, set up environment variables for the database connection, and initialize Prisma client. Builds on Prompt 1 server setup.

Requirements:
1.  Inside the `server` directory, install Prisma CLI as a dev dependency: `npm install prisma --save-dev`.
2.  Install Prisma Client: `npm install @prisma/client`.
3.  Install PostgreSQL driver: `npm install pg`.
4.  Install `dotenv` for environment variables: `npm install dotenv`.
5.  Initialize Prisma: `npx prisma init --datasource-provider postgresql`. This creates:
    - A `prisma` directory with `schema.prisma`.
    - A `.env` file (if not existing) with a `DATABASE_URL` placeholder.
6.  Update `.gitignore` (in the `server` directory) to include `.env`.
7.  Configure the `DATABASE_URL` in the `.env` file with your actual PostgreSQL connection string (e.g., `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`). **Important:** Use a development database, not production.
8.  Create a utility file for the Prisma client instance, e.g., `server/src/lib/prisma.ts`:
    - Import `PrismaClient` from `@prisma/client`.
    - Export a singleton instance: `export const prisma = new PrismaClient();`
9.  Modify `src/server.ts` (or a startup script) to load environment variables early:
    - `import dotenv from 'dotenv';`
    - `dotenv.config();` (call this before accessing `process.env`).
10. Add a basic check to ensure the `DATABASE_URL` is loaded (e.g., log a warning if missing). No specific tests for this step, relies on Prisma CLI and `.env` setup.

Provide the content for `server/src/lib/prisma.ts` and the necessary import/config lines added to `server/src/server.ts`. Also show the updated `.gitignore`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

````
Prompt 24: Server - Define Prisma Schema & Migrate

Objective: Define the initial database schema using Prisma for `PlayerProfile` and run the first migration. Builds on Prompt 23.

Requirements:
1.  Edit the `server/prisma/schema.prisma` file.
2.  Ensure the `datasource db` block correctly points to `provider = "postgresql"` and `url = env("DATABASE_URL")`.
3.  Ensure the `generator client` block has `provider = "prisma-client-js"`.
4.  Define the `PlayerProfile` model based on the spec (Section 4.1):
    ```prisma
    model PlayerProfile {
      id        String   @id @default(uuid()) // Use UUID for primary key
      displayName String @unique
      // Add auth fields later (e.g., passwordHash, externalProviderId)
      unlockedCardDefinitionIds String[] @default([])
      factionProgression        Json     @default("{}") // Store faction progress as JSON
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt

      // Relation to Faction state in a specific game (handled differently, not directly here)
    }
    ```
5.  **(Optional but recommended):** Define `Territory` and `CardDefinition` models based on the spec, even if only partially used initially. This sets up the structure.
    ```prisma
     model Territory {
       id                   String  @id // Use spec ID format if needed, else UUID
       // game_instance_id String? // Maybe not stored directly, depends on persistence strategy
       name                 String
       type                 String // Consider enum later if Prisma supports DB enums well
       securityLevel        Int     @default(1)
       resourceValue        Int     @default(1)
       stabilityIndex       Int     @default(100)
       corporateInfluence   Int     @default(50)
       adjacentTerritoryIds String[]
       // Add relations or other fields as needed
     }

     model CardDefinition {
       id               String @id // Card ID from spec
       name             String
       type             String // OVERWORLD / SCENARIO
       subType          String
       faction          String?
       cost             Int
       effectDefinition Json // Store effect logic/data as JSON
       flavorText       String?
       artUrl           String?
       // Add relations if needed
     }
    ```
6.  From the `server` directory, run the first migration: `npx prisma migrate dev --name init`.
    - This will create the SQL migration file in `prisma/migrations/`.
    - It will apply the migration to your development database.
    - It will generate/update the Prisma Client based on the schema.
7.  Verify the tables (`PlayerProfile`, etc.) are created in your PostgreSQL database using a tool like `psql`, DBeaver, or pgAdmin.

Provide the final content for `server/prisma/schema.prisma`.
````

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 25: Server - Implement Basic Profile Service & Integration Tests

Objective: Create a service function to find or create player profiles using Prisma Client and add integration tests. Builds on Prompts 11, 24.

Requirements:
1.  Create a service file, e.g., `server/src/services/profileService.ts`.
2.  Import the Prisma client instance from `../lib/prisma`.
3.  Import `PlayerProfile` type from `@prisma/client`.
4.  Create an async function `findOrCreateProfile(clientId: string, requestedDisplayName?: string): Promise<PlayerProfile>`:
    - Generate a default display name if none provided (e.g., `User_${clientId.substring(0, 6)}`). Use the provided name if available.
    - Use `prisma.playerProfile.upsert()`:
        - `where`: Check based on a unique identifier. For now, since we don't have login, let's *assume* we want to create a *new* profile each time for simplicity, or potentially use `displayName` if provided and unique. Let's refine: Use `clientId` temporarily as a unique constraint or create a new profile each time for testing. **Decision:** For this step, let's use `findUnique` on `displayName` if provided, otherwise just `create`. This isn't robust long-term but lets us test creation.
        - If `requestedDisplayName` is provided, try `prisma.playerProfile.findUnique({ where: { displayName: requestedDisplayName } })`. If found, return it.
        - If not found or no name provided, use `prisma.playerProfile.create()`:
            - `data`: Provide `displayName` (generated or requested, handle potential uniqueness conflicts with try-catch or refine logic). Include default values for other fields like `unlockedCardDefinitionIds: []`, `factionProgression: {}`.
    - Return the created or found profile. Handle potential database errors (e.g., unique constraint violation on `displayName`).
5.  Create an integration test file `server/tests/profileService.integration.test.ts`.
6.  **Test Setup:** Configure Jest to run integration tests separately or handle test database setup/teardown. This often involves:
    - Using a separate test database configured via environment variables.
    - Clearing relevant tables (`PlayerProfile`) before/after each test using `prisma.$executeRawUnsafe` or similar.
7.  Write integration tests for `findOrCreateProfile`:
    - Test creating a new profile with a unique display name. Verify the returned object and check the database.
    - Test creating a profile with a generated display name.
    - Test attempting to create a profile with a display name that already exists (expect error or specific handling based on implementation).
    - Test finding an existing profile by display name (if implemented that way).

Provide the content for `server/src/services/profileService.ts` and `server/tests/profileService.integration.test.ts`, including basic test database setup/cleanup logic within the test file.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 26: Server - Integrate Profile Service on Connect

Objective: Call the profile service when a player connects and store their display name in the in-memory `PlayerState`. Builds on Prompts 11, 12, 25.

Requirements:
1.  Modify `server/src/server.ts`.
2.  Import the `findOrCreateProfile` function from `./services/profileService`.
3.  Modify the `connection` event handler:
    - Make the handler `async`.
    - After creating the initial `PlayerState` (which only has `id` and `status`), call the profile service:
        - `try { const profile = await findOrCreateProfile(clientId); // Pass a display name later if available newPlayer.displayName = profile.displayName; console.log(`Associated profile ${profile.displayName} for player ${clientId}`); } catch (error) { console.error(`Failed to find or create profile for ${clientId}:`, error); // Handle error appropriately - maybe disconnect client or use default name }`
    - Ensure the `PlayerState` (now potentially with `displayName`) is added to `game.players`.
    - Ensure the subsequent messages (`GAME_STATE_INIT`, `PLAYER_JOINED`) include the updated `PlayerState` with the `displayName`.
4.  Modify `server/src/types/game.ts`: Ensure `displayName` is an optional property (`displayName?: string;`) on `PlayerState`.
5.  Update relevant tests (`serverGameState.test.ts`, `serverMessages.test.ts`) to:
    - Mock the `findOrCreateProfile` service function to avoid hitting the DB in unit tests.
    - Verify that the `displayName` from the mocked profile service is correctly added to the `PlayerState`.
    - Verify that `GAME_STATE_INIT` and `PLAYER_JOINED` messages include the `displayName` in their payloads.

Provide the updated `connection` handler logic in `server/src/server.ts`, the change to `server/src/types/game.ts`, and the necessary updates/mocks in the relevant test files.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

These prompts cover the basic database integration for player profiles. The next logical phase (Phase 4 in the flowchart) would start implementing the Scenario toggle and the basic interaction loop between Overworld and Scenario states, building upon the established state management and communication.

28.2s

edit

more_vert

continue

edit

more_vert

Okay, let's move into Phase 4: Scenario Toggle & Basic Linkage.

---

```
Prompt 27: Server - Implement Game Phase Switching Logic

Objective: Modify the server game state to include a distinct scenario state and handle switching between Overworld and Scenario phases. Builds on Prompts 11, 20. Add tests.

Requirements:
1.  Modify `server/src/types/game.ts`:
    - Define a basic `ScenarioState` interface (can be very simple initially):
        `export interface ScenarioState { scenarioId: string; // ID for this specific scenario instance type: string; // Type of scenario triggered (e.g., 'STANDARD_SECURITY_SWEEP') objective: string; // Simple description for now status: 'ACTIVE' | 'RESOLVED'; // Add more details later: entities, grid, turn, etc. }`
    - Add an optional `currentScenario: ScenarioState | null;` property to the `GameState` interface.
2.  Modify `server/src/types/protocol.ts`:
    - Add `START_SCENARIO = 'START_SCENARIO'` to `MessageType`.
    - Define `StartScenarioMessage extends ClientToServerMessage<{ territoryId: string; /* other context later */ }> {}`.
3.  Modify `server/src/server.ts`:
    - Import `START_SCENARIO`, `StartScenarioMessage`, `GamePhase`, `ScenarioState`.
    - Modify the `message` handler:
        - Add `case MessageType.START_SCENARIO:`.
        - Retrieve `clientId`, `gameId`, find `game`. Check if player/game exist.
        - Cast message payload.
        - **Validation:**
            - Check if `game.phase` is currently `OVERWORLD`. If not, send error ("Not in Overworld phase").
            - Check if `payload.territoryId` is valid (exists in `game.territories`). If not, send error.
            - **(Future): Add checks like 'Is player allowed to start scenario here?', 'Does cooldown exist?', etc.**
        - **State Update:**
            - If valid:
                - Set `game.phase = 'SCENARIO';`.
                - Create a basic scenario state: `const newScenario: ScenarioState = { scenarioId: `scn_${Date.now()}`, // Simple unique ID type: 'STANDARD_SECURITY_SWEEP', // Placeholder objective: 'Survive 3 turns', // Placeholder status: 'ACTIVE' };`
                - Assign it: `game.currentScenario = newScenario;`.
                - Log: `console.log(`Game ${gameId} phase changed to SCENARIO. Scenario ${newScenario.scenarioId} started.`);`.
                - **(Action): Trigger broadcast (Prompt 28).**
4.  Update `tests/serverMessages.test.ts`.
5.  Add Jest tests:
    - Test valid `START_SCENARIO` message changes `game.phase` to `SCENARIO` and sets `game.currentScenario`.
    - Test sending `START_SCENARIO` when not in `OVERWORLD` phase returns an error.
    - Test sending `START_SCENARIO` with invalid `territoryId` returns an error.

Provide the updated `server/src/types/game.ts`, `server/src/types/protocol.ts`, the `START_SCENARIO` case logic in `server/src/server.ts`, and relevant tests. Remind to update client types.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 28: Server - Broadcast Phase Change Notification

Objective: Notify all clients when the game phase changes (e.g., to Scenario). Builds on Prompts 14, 27.

Requirements:
1.  Modify `server/src/types/protocol.ts`:
    - Add `PHASE_CHANGE = 'PHASE_CHANGE'` to `MessageType`.
    - `import { GamePhase, ScenarioState } from './game';`
    - Define `PhaseChangeMessage extends ServerToClientMessage<{ newPhase: GamePhase; scenarioState?: ScenarioState | null; /* include other phase-specific context if needed */ }> {}`
2.  Modify `server/src/server.ts`.
3.  Import `PhaseChangeMessage`, `MessageType`.
4.  In the `message` handler, within the `case MessageType.START_SCENARIO:`, *after* successfully updating the game state (`game.phase`, `game.currentScenario`):
    - Construct the phase change message: `const phaseMessage: PhaseChangeMessage = { type: MessageType.PHASE_CHANGE, payload: { newPhase: game.phase, scenarioState: game.currentScenario } };`.
    - Use the `broadcastToGame` helper function to send this message: `broadcastToGame(gameId, phaseMessage);`.
5.  **(Self-Correction):** We also need to broadcast when the phase changes *back* from Scenario to Overworld later (Prompt 32). Ensure the `PhaseChangeMessage` structure supports this (e.g., `scenarioState` would be `null` when switching back).
6.  Update `tests/serverMessages.test.ts` to verify that a successful `START_SCENARIO` action triggers the broadcast of a `PHASE_CHANGE` message with the correct payload (`newPhase: 'SCENARIO'`, `scenarioState`).

Provide the updated `server/src/types/protocol.ts`, the broadcast call addition within the `START_SCENARIO` case in `server/src/server.ts`, and the updated tests. Remind to update client types.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 29: Client - Handle Phase Change & Conditional Rendering

Objective: Update the client's state based on phase change messages and conditionally render different views (Overworld vs. Scenario placeholder). Builds on Prompts 15, 18, 28.

Requirements:
1.  Ensure client types (`protocol.ts`, `game.ts`) are updated with `PHASE_CHANGE`, `PhaseChangeMessage`, `ScenarioState`. Update `GameState` type locally to include `currentScenario`.
2.  Modify the client state management (`App.tsx` or context/store) to store the current `phase` and `currentScenario` from the main `gameState`.
3.  Modify the `handleMessage` callback function in `src/App.tsx`:
    - Add `case MessageType.PHASE_CHANGE:`.
    - Cast `message` to `PhaseChangeMessage`.
    - Update the local `gameState` immutably with the `newPhase` and `scenarioState` from the payload.
        - `setGameState(prevState => { if (!prevState) return null; return { ...prevState, phase: message.payload.newPhase, currentScenario: message.payload.scenarioState }; });`
4.  Create a placeholder Scenario view component, e.g., `src/components/ScenarioView.tsx`. It can just render a simple div with text like "Scenario Active: [Scenario Objective]" based on props.
5.  Modify `src/App.tsx` rendering logic:
    - Conditionally render components based on `gameState?.phase`:
        - If `'OVERWORLD'`, render the `PixiCanvas` component (which handles Overworld rendering).
        - If `'SCENARIO'`, render the `ScenarioView` component, passing `gameState.currentScenario` as a prop.
        - Handle `'WAITING'` or `null` states appropriately (e.g., "Waiting for game..." or loading indicator).
6.  **(Self-Correction):** The `PixiCanvas` currently holds the `OverworldRenderer`. We might need to refactor later so `PixiCanvas` can host different renderers (Overworld, Scenario) or have separate canvas components. For now, just switching the *React* component is sufficient.
7.  Run server and client. Trigger the `START_SCENARIO` action (manually sending the message via browser devtools or adding a temporary button). Verify the client UI switches from the Overworld map to the Scenario placeholder view.

Provide the updated `handleMessage` logic and conditional rendering logic in `client/src/App.tsx`, and the content for the new `client/src/components/ScenarioView.tsx`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 30: Client - Scenario Placeholder Interaction

Objective: Add a basic interaction in the placeholder Scenario view to send an action message. Builds on Prompt 29.

Requirements:
1.  Modify `client/src/types/protocol.ts`:
    - Add `SCENARIO_ACTION = 'SCENARIO_ACTION'` to `MessageType`.
    - Define `ScenarioActionMessage extends ClientToServerMessage<{ actionType: string; // e.g., 'MOVE', 'ATTACK' details: any; // Action-specific payload }> {}`. Example: `MoveActionPayload { targetX: number; targetY: number; }`.
2.  Modify `client/src/components/ScenarioView.tsx`:
    - Accept the `sendMessage` function (from `useWebSocket`) as a prop.
    - Add a simple button (e.g., "Perform Basic Action").
    - On button click, construct a placeholder `ScenarioActionMessage`:
        - `const message: ScenarioActionMessage = { type: MessageType.SCENARIO_ACTION, payload: { actionType: 'BASIC_MOVE', details: { x: 1, y: 1 } } };`
        - Call `props.sendMessage(message);`.
        - Log the action locally.
3.  Modify `client/src/App.tsx` to pass the `sendMessage` function as a prop to `ScenarioView` when it's rendered.
4.  Run server and client, trigger scenario mode. Click the button in the scenario view. Verify the `SCENARIO_ACTION` message is sent (check server logs).

Provide the updated `client/src/types/protocol.ts`, the updated `client/src/components/ScenarioView.tsx`, and the necessary prop drilling change in `client/src/App.tsx`. Remind to update server types.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 31: Server - Handle Basic Scenario Action

Objective: Process a basic scenario action message, validate it against the scenario state, and update the placeholder state. Builds on Prompts 27, 30. Add tests.

Requirements:
1.  Ensure server `protocol.ts` has `SCENARIO_ACTION` and `ScenarioActionMessage`.
2.  Modify `src/server.ts`. Import necessary types.
3.  Modify the `message` handler:
    - Add `case MessageType.SCENARIO_ACTION:`.
    - Retrieve `clientId`, `gameId`, find `game`. Check if player/game exist.
    - Cast message payload.
    - **Validation:**
        - Check if `game.phase` is `SCENARIO` and `game.currentScenario` exists. If not, send error ("Not in active scenario").
        - Check if `game.currentScenario.status` is `ACTIVE`. If not, send error ("Scenario already resolved").
        - **(Future): Validate player turn, action points, action legality based on `payload.actionType` and `payload.details` against the detailed `ScenarioState`.**
        - For now, just check if `payload.actionType` is recognized (e.g., `'BASIC_MOVE'`).
    - **State Update (Placeholder):**
        - If valid:
            - Log the received action: `console.log(`Player ${clientId} performed scenario action: ${payload.actionType}`);`.
            - Modify the `game.currentScenario` state in a minimal way (e.g., append action type to objective string for testing, or add a turn counter property and increment it).
            - `game.currentScenario.objective += ` - ${payload.actionType}`; // Simple visual change for testing`
            - **(Action): Trigger scenario state update broadcast (separate prompt).**
4.  Update `tests/serverMessages.test.ts`.
5.  Add Jest tests:
    - Test valid `SCENARIO_ACTION` message when in correct phase modifies the `game.currentScenario` state.
    - Test sending `SCENARIO_ACTION` when not in `SCENARIO` phase returns an error.
    - Test sending `SCENARIO_ACTION` when scenario is not `ACTIVE` returns an error.

Provide the `SCENARIO_ACTION` case logic in `server/src/server.ts` and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 32: Server - Implement Scenario End Logic & Transition Back

Objective: Add logic (manual trigger or based on simple action count for now) to end the scenario, calculate a result, update the Overworld state (placeholder), and transition phase back. Builds on Prompts 28, 31. Add tests.

Requirements:
1.  Modify `server/src/types/game.ts`:
    - Add placeholder result property to `ScenarioState`, e.g., `resolution?: 'SUCCESS' | 'FAILURE';`.
2.  Modify `src/server.ts`:
    - Create a function `resolveScenario(game: GameState, resolution: 'SUCCESS' | 'FAILURE')`:
        - Check if `game.phase === 'SCENARIO'` and `game.currentScenario` exists and `game.currentScenario.status === 'ACTIVE'`. If not, return early/log error.
        - Set scenario status and resolution: `game.currentScenario.status = 'RESOLVED'; game.currentScenario.resolution = resolution;`.
        - **Apply Overworld Impact (Placeholder):**
            - Find the territory that triggered the scenario (need to store this context in `ScenarioState` when created in Prompt 27, e.g., `triggeringTerritoryId`).
            - Modify the relevant `Territory` object in `game.territories`. E.g., if SUCCESS, increase influence slightly; if FAILURE, decrease stability slightly. (Make `GameState.territories` mutable or replace the Territory object immutably).
            - Log the Overworld change.
        - Change game phase back: `game.phase = 'OVERWORLD';`.
        - Log the phase change.
        - **Broadcast Updates:**
            - Send a `TERRITORY_UPDATE` message (from Prompt 21) for the affected territory.
            - Send a `PHASE_CHANGE` message (from Prompt 28) indicating the phase is now `OVERWORLD` and `scenarioState` is the (now resolved) `game.currentScenario`. (Client can use this to show results).
        - **(Cleanup):** Consider setting `game.currentScenario = null;` after broadcasting, or keep it for showing results client-side. Let's keep it for now.
    - Modify the `SCENARIO_ACTION` handler: Add a simple condition to trigger resolution for testing. E.g., if a simple counter in `ScenarioState` reaches 3, call `resolveScenario(game, 'SUCCESS');`.
    - **(Alternative Trigger):** Add a new message type `DEBUG_RESOLVE_SCENARIO` that directly calls `resolveScenario` for easier testing.
3.  Update `tests/serverMessages.test.ts` or `tests/serverGameState.test.ts`.
4.  Add Jest tests for `resolveScenario`:
    - Test that it correctly updates `ScenarioState` status/resolution.
    - Test that it updates `game.phase` back to `OVERWORLD`.
    - Test that it modifies the placeholder Overworld state (mocked territory map).
    - Test that it triggers the correct `TERRITORY_UPDATE` and `PHASE_CHANGE` broadcasts (mocking `broadcastToGame`).

Provide the `resolveScenario` function, modifications to `SCENARIO_ACTION` handler (or the new debug handler), required updates to `server/src/types/game.ts`, and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 33: Server - Broadcast Scenario Outcome & Overworld Updates

Objective: Ensure the necessary messages (`TERRITORY_UPDATE`, `PHASE_CHANGE`) are broadcast correctly when a scenario resolves. Builds on Prompt 32.

Requirements:
1.  This prompt is largely integrated into Prompt 32 (`resolveScenario` function). The key is ensuring the broadcast calls are made correctly within that function.
2.  **Verification Step:** Review the `resolveScenario` function implemented in Prompt 32.
    - Confirm it broadcasts a `TERRITORY_UPDATE` message for the territory whose state was modified based on the scenario outcome. The payload should reflect the change (e.g., updated influence/stability).
    - Confirm it broadcasts a `PHASE_CHANGE` message. The payload should include `newPhase: 'OVERWORLD'` and the `scenarioState` object (which now includes the `resolution` field).
3.  Review the tests written for `resolveScenario` in Prompt 32. Ensure they specifically check that `broadcastToGame` is called with the correctly structured `TERRITORY_UPDATE` and `PHASE_CHANGE` messages and payloads.

No new code needed if Prompt 32 was implemented correctly, this is primarily a verification and testing reinforcement step. Adjust Prompt 32 implementation/tests if needed based on this review.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 34: Client - Handle Scenario End Updates

Objective: Process scenario resolution messages, switch the view back to Overworld, and display updated territory/result information. Builds on Prompts 22, 29, 32.

Requirements:
1.  Ensure client types (`protocol.ts`, `game.ts`) are updated to reflect potential `resolution` field in `ScenarioState`, and any changes to `Territory` state used for scenario impact.
2.  Modify the `handleMessage` callback function in `src/App.tsx`:
    - In `case MessageType.PHASE_CHANGE:`, if the `message.payload.newPhase` is `'OVERWORLD'` and `message.payload.scenarioState` (the resolved scenario) exists:
        - Store the resolved scenario result temporarily (e.g., in React state `lastScenarioResult`) to potentially display a summary message.
        - Update the main `gameState` phase.
        - **(Important):** The view switching logic in `App.tsx` (from Prompt 29) should automatically switch back to rendering the Overworld view (`PixiCanvas`) because the `gameState.phase` is now `OVERWORLD`.
    - In `case MessageType.TERRITORY_UPDATE:`, ensure this handler correctly updates the local territory state (which might now include influence/stability changes from the scenario result). This might require expanding the `TerritoryUpdateMessage` payload and handler logic if not already done.
3.  Modify `client/src/pixi/OverworldRenderer.ts`: Ensure the `updateTerritoryVisual` (or similar method) correctly reflects changes received via `TERRITORY_UPDATE` messages (e.g., update color based on influence changes).
4.  Modify `src/App.tsx` rendering:
    - Display a temporary message based on `lastScenarioResult` if it exists (e.g., "Scenario Resolved: SUCCESS!"). Clear this message after a few seconds or on the next action.
    - Ensure the Overworld view (`PixiCanvas`) now reflects any territory changes applied by the server due to scenario resolution.
5.  Run server and client. Trigger a scenario, perform the action(s) needed to resolve it (or use the debug trigger). Verify:
    - The client view switches back to the Overworld map.
    - A result message appears briefly.
    - The territory involved in the scenario shows visual changes corresponding to the server-side update (e.g., changed highlight/color).

Provide the updated `handleMessage` logic in `client/src/App.tsx`, any necessary updates to the `TERRITORY_UPDATE` handling logic/types, required visual update logic in `client/src/pixi/OverworldRenderer.ts`, and the result display logic in `client/src/App.tsx`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

This concludes Phase 4, establishing the basic loop between Overworld and a placeholder Scenario. The next phase would involve fleshing out the Card System.

45.4s

edit

more_vert

continue

more_vert

Thoughts

\*The thoughts produced by the model are experimental

experiment

Expand to view model thoughts

6.3s

edit

more_vert

Okay, let's dive into Phase 5: Card System Implementation.

---

```
Prompt 35: Server - Define Card Data Structures & Load Definitions

Objective: Define the structure for card definitions using Prisma, create static JSON definitions, and load them on server startup. Builds on Prompt 24.

Requirements:
1.  Modify `server/prisma/schema.prisma`:
    - Ensure the `CardDefinition` model exists and matches the spec (Prompt 24 review): `id String @id`, `name String`, `type String`, `subType String`, `faction String?`, `cost Int`, `effectDefinition Json`, `flavorText String?`, `artUrl String?`.
2.  Create a data directory if it doesn't exist: `server/src/data/`.
3.  Create a JSON file for card definitions: `server/src/data/cards.json`.
4.  Define 2-3 sample card definitions in `cards.json` following the `CardDefinition` structure. Ensure `effectDefinition` is valid JSON (can be simple placeholders like `{"effect": "ADD_INFLUENCE", "value": 1}` or `{"effect": "DRAW_CARD", "count": 1}`). Include at least one 'OVERWORLD' type card.
5.  Create a card management service, e.g., `server/src/services/cardService.ts`.
    - Import `CardDefinition` type from `@prisma/client`.
    - Import the JSON data: `import cardDefinitionsData from '../data/cards.json';`.
    - Create a Map to hold definitions in memory: `const cardDefinitionMap = new Map<string, CardDefinition>();`.
    - Implement an initialization function `loadCardDefinitions()`:
        - Clear the `cardDefinitionMap`.
        - Iterate through `cardDefinitionsData`. Validate each entry against the expected structure (add basic checks).
        - Add valid definitions to the `cardDefinitionMap`, keyed by `card.id`.
        - Log the number of loaded definitions or any errors.
    - Implement a function `getCardDefinition(cardId: string): CardDefinition | undefined`: Returns a card definition from the map.
    - Export the functions and potentially the map (or just the getter).
6.  Modify `server/src/server.ts` (or a startup module):
    - Import `loadCardDefinitions` from the card service.
    - Call `loadCardDefinitions()` *after* the server starts listening or during initialization.
7.  Write unit tests for `cardService.ts` (`tests/cardService.test.ts`):
    - Test `loadCardDefinitions` correctly populates the map from mocked JSON data.
    - Test validation within `loadCardDefinitions` catches invalid card data (if implemented).
    - Test `getCardDefinition` retrieves the correct definition.

Provide the content for `server/src/data/cards.json`, `server/src/services/cardService.ts`, the call location in `server/src/server.ts`, and the test file `server/tests/cardService.test.ts`. Ensure Prisma schema (`CardDefinition` model) is included for reference if not previously provided fully.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 36: Server - Add Card State to GameState

Objective: Define structures for player-specific card states (deck, hand, discard) within the main `GameState`. Builds on Prompts 10, 35.

Requirements:
1.  Modify `server/src/types/game.ts`:
    - Define an interface for a card instance (distinct from definition):
        `export interface CardInstance { instanceId: string; // Unique ID for this specific card in this game definitionId: string; // Links to CardDefinition // Add state later if needed (e.g., counters, damage) }`
    - Add card zones to the `PlayerState` interface:
        `deck: CardInstance[]; hand: CardInstance[]; discard: CardInstance[];`
2.  Modify `server/src/server.ts`:
    - Import `CardInstance`.
    - Modify the player creation logic within the `connection` handler (or `getOrCreateGame` if player state is initialized there):
        - When creating a `newPlayer`, initialize the card zones as empty arrays: `deck: [], hand: [], discard: []`.
    - **(Placeholder Logic):** Add simple logic to populate the initial deck and draw a starting hand when the game *actually* starts (e.g., when phase transitions from 'WAITING'). For now, let's add a placeholder:
        - Inside `getOrCreateGame`, when `newGame` is created, add placeholder logic:
            - Get a list of available card definition IDs (e.g., filter `cardDefinitionMap.keys()`).
            - Create a few `CardInstance` objects (using `uuidv4` for `instanceId`) based on the first few available definitions.
            - Assign these directly to the `hand` of the *first* player added to the game for testing purposes. This is temporary logic.
            - `if (newGame.players.size === 0) { // Only for the first player for now const cardDefIds = Array.from(cardDefinitionMap.keys()).slice(0, 3); newPlayer.hand = cardDefIds.map(defId => ({ instanceId: uuidv4(), definitionId: defId })); }`
3.  Update tests (`serverGameState.test.ts`) to verify that new `PlayerState` objects have empty `deck`, `hand`, `discard` arrays initialized, and that the temporary hand-dealing logic adds cards to the first player's hand state.

Provide the updated `server/src/types/game.ts` (CardInstance, PlayerState), the modified player state initialization logic in `server/src/server.ts`, and relevant test updates.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 37: Server - Include Hand State in Initial Broadcast

Objective: Send the player's initial hand information to the client upon connection. Builds on Prompts 13, 17, 36.

Requirements:
1.  Modify `server/src/types/game.ts`: Update `PlayerState` definition if needed (already done in Prompt 36).
2.  Modify `server/src/types/protocol.ts`:
    - Update the `GameStateInitPayload` type definition to reflect that the included `PlayerState[]` now contains `deck`, `hand`, and `discard` arrays (potentially just sending hand/counts initially for optimization, but let's send full arrays for now). Ensure `CardInstance` is imported/defined here or in `game.ts`.
    - *(Self-correction):* The `GameStateInitPayload` takes the full `GameState`. The `players` array within it should already include the hand data added in Prompt 36. We just need to ensure the *type definition* for `GameStateInitPayload` correctly reflects that `PlayerState` now includes card zones. No structural change needed if `PlayerState` type is shared correctly.
3.  Modify `server/src/server.ts`:
    - The logic preparing the `GameStateInitMessage` payload (Prompt 13/17) converts the `game.players` Map to an array. This array's elements (`PlayerState`) should now naturally include the `hand` data populated in Prompt 36. No code change needed here assuming previous steps were correct.
4.  Update tests (`serverMessages.test.ts`) for `GAME_STATE_INIT`:
    - Verify the payload sent to the client includes the `players` array.
    - Verify that player objects within that array contain a `hand` property which is an array of `CardInstance` objects (using the mocked hand data from Prompt 36 tests).

This prompt mostly involves verifying type definitions and tests. Provide updated type definitions in `protocol.ts` (specifically `GameStateInitPayload` referencing the updated `PlayerState`) and the updated tests for `GAME_STATE_INIT` message payload verification.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 38: Client - Handle and Store Card State

Objective: Receive and store the player's hand information from the initial game state message. Builds on Prompts 15, 37.

Requirements:
1.  Ensure client types (`protocol.ts`, `game.ts`) are updated:
    - Define `CardInstance` interface.
    - Update `PlayerState` interface to include `deck: CardInstance[]`, `hand: CardInstance[]`, `discard: CardInstance[]`.
    - Update `GameState` interface locally.
2.  Modify the client state management (`App.tsx` or context/store):
    - Ensure the local `gameState` correctly stores the full `PlayerState` including card zones when handling `GAME_STATE_INIT`. The immutable update logic from Prompt 15 should handle this if the types match.
3.  **(Important):** Add logic to identify the *current player's* state. The server sends the *full* game state including all players. The client needs to know its own `clientId`.
    - Modify `useWebSocket` hook (Prompt 5): When the connection opens (`onopen`), store the `WebSocket` instance. We need a way to get the `clientId` assigned by the server. **Decision:** Add a new server message `CLIENT_ID_ASSIGNED` sent immediately after connection containing the assigned ID.
    - **Server Change (Retrofit Prompt 6/11):** Server sends `{ type: 'CLIENT_ID_ASSIGNED', payload: { clientId: clientId } }` immediately upon connection *before* `GAME_STATE_INIT`.
    - **Client Change:** Client `handleMessage` handles `CLIENT_ID_ASSIGNED` and stores the ID (e.g., in `App.tsx` state: `myClientId`). `useWebSocket` hook needs modification to handle this early message.
    - Store this `myClientId` in `App.tsx` state.
4.  In `App.tsx`, derive the current player's hand:
    - `const currentPlayerState = gameState?.players.get(myClientId);`
    - `const myHand = currentPlayerState?.hand ?? [];`
5.  Pass `myHand` array as a prop to a new component responsible for rendering the hand.

Provide the necessary modifications to the server (`connection` handler to send `CLIENT_ID_ASSIGNED`), the client's `useWebSocket` hook and `App.tsx` to handle `CLIENT_ID_ASSIGNED`, store `myClientId`, and derive `myHand`. Include the new message type definition in `protocol.ts`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

Self-correction note: Introducing CLIENT_ID_ASSIGNED slightly modifies the flow but is necessary for the client to identify its own data within the broadcast game state.

---

```
Prompt 39: Client - Render Card Hand UI

Objective: Create a React component to display the cards in the player's hand. Builds on Prompt 38.

Requirements:
1.  Create a new React component `src/components/CardHand.tsx`.
    - It accepts `hand: CardInstance[]` as a prop.
    - It also needs access to card definitions to display names/costs. **Decision:** Pass a map or getter function for card definitions as a prop: `getCardDef: (defId: string) => CardDefinition | undefined`.
2.  Create a basic `src/components/CardDisplay.tsx` component.
    - Accepts `cardDef: CardDefinition` and optionally `cardInstance: CardInstance` as props.
    - Renders basic card info (name, cost, type). Use simple HTML/CSS for now (no PixiJS yet). Style it to look vaguely like a card.
3.  In `CardHand.tsx`:
    - Map over the `hand` prop.
    - For each `cardInstance`, call `props.getCardDef(cardInstance.definitionId)`.
    - If the definition exists, render a `CardDisplay` component, passing the definition and instance.
    - Apply basic layout CSS to arrange the cards horizontally at the bottom of the screen (e.g., using Flexbox).
4.  Modify `App.tsx`:
    - We need card definitions on the client. **Decision:** Add a new message `ALL_CARD_DEFINITIONS` sent from the server after `CLIENT_ID_ASSIGNED`.
    - **Server Change:** Server loads definitions (Prompt 35) and sends them via a new message `{ type: 'ALL_CARD_DEFINITIONS', payload: { definitions: Array.from(cardDefinitionMap.values()) } }` after assigning client ID.
    - **Client Change:** Client `handleMessage` handles `ALL_CARD_DEFINITIONS`, stores them in state (e.g., `useState<Map<string, CardDefinition>>(new Map())`), and provides a getter function `getCardDefinition` based on this state.
    - Render the `CardHand` component, passing the derived `myHand` and the `getCardDefinition` getter function. Position it appropriately using CSS (e.g., fixed at the bottom).
5.  Run server and client. Verify the initial hand dealt by the server (placeholder logic) is displayed as basic card elements at the bottom of the client UI.

Provide the content for `client/src/components/CardHand.tsx`, `client/src/components/CardDisplay.tsx`, the necessary server changes to send definitions, and the client changes in `App.tsx` to handle/store definitions and render the hand. Include relevant type additions in `protocol.ts`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 40: Client - Basic Card Interaction (Click)

Objective: Make cards in the hand clickable, logging the selected card instance. Builds on Prompt 39.

Requirements:
1.  Modify `client/src/components/CardDisplay.tsx`:
    - Accept an optional `onClick?: (instanceId: string) => void` prop.
    - Wrap the card rendering in a clickable element (e.g., `div` or `button`).
    - Add an `onClick` handler to this element. Inside the handler, if `props.onClick` and `props.cardInstance` exist, call `props.onClick(props.cardInstance.instanceId)`.
2.  Modify `client/src/components/CardHand.tsx`:
    - Accept an optional `onCardClick?: (instanceId: string) => void` prop.
    - Pass this prop down to each `CardDisplay` component as the `onClick` prop.
3.  Modify `client/src/App.tsx`:
    - Define a function `handleCardClick(instanceId: string)`:
        - Find the card instance and its definition using the `instanceId` and stored game/definition state.
        - Log the details: `console.log("Clicked card:", instanceId, cardDef?.name);`.
        - Add state to track the selected card: `const [selectedCardInstanceId, setSelectedCardInstanceId] = useState<string | null>(null);`. Update this state in `handleCardClick`.
    - Pass `handleCardClick` as the `onCardClick` prop to the `CardHand` component.
4.  **(Optional Styling):** Modify `CardDisplay.tsx` CSS to visually indicate when a card is selected (e.g., add a border or raise it slightly based on whether its `instanceId` matches the `selectedCardInstanceId` state from `App.tsx` - requires passing selection state down).
5.  Run server and client. Verify clicking on a card in the hand logs its details and potentially updates its visual state.

Provide the updated `client/src/components/CardDisplay.tsx`, `client/src/components/CardHand.tsx`, and the relevant additions (state, handler) in `client/src/App.tsx`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 41: Client - Send Play Card Message

Objective: Send a WebSocket message to the server when a valid play condition is met (e.g., card selected and target clicked). Builds on Prompts 19, 40.

Requirements:
1.  Modify `client/src/types/protocol.ts`:
    - Add `PLAY_CARD = 'PLAY_CARD'` to `MessageType`.
    - Define `PlayCardMessage extends ClientToServerMessage<{ cardInstanceId: string; targetId?: string; // Optional target (e.g., territory ID) }> {}`.
2.  Modify `client/src/App.tsx`:
    - Refine the interaction logic. We need both a selected card and a selected target (if applicable for the card type). Let's assume Overworld cards target territories.
    - Add state for the selected target (territory): `const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);`.
    - Modify `handleTerritorySelect` (from Prompt 19): In addition to logging/sending `SELECT_TERRITORY`, also update `setSelectedTargetId(territoryId)`.
    - Modify `handleCardClick` (from Prompt 40): Update `setSelectedCardInstanceId(instanceId)`.
    - Add a `useEffect` hook that depends on `selectedCardInstanceId` and `selectedTargetId`.
        - Inside the effect:
            - Check if both `selectedCardInstanceId` and `selectedTargetId` are set.
            - **(Client-side Validation - Basic):** Find the card definition. If it's an 'OVERWORLD' card requiring a territory target, proceed. (Add more checks later: can afford cost?).
            - If conditions are met:
                - Construct the message: `const message: PlayCardMessage = { type: MessageType.PLAY_CARD, payload: { cardInstanceId: selectedCardInstanceId, targetId: selectedTargetId } };`.
                - Call `sendMessage(message)`.
                - Log the play attempt: `console.log("Attempting to play card", selectedCardInstanceId, "on target", selectedTargetId);`.
                - **Crucially:** Reset the selection state *after* sending: `setSelectedCardInstanceId(null); setSelectedTargetId(null);`.
3.  Run server and client. Select a card, then select a territory. Verify a `PLAY_CARD` message is sent to the server (check server logs). Verify selection state resets on the client.

Provide the updated `client/src/types/protocol.ts`, and the refined interaction logic (state, handlers, useEffect) within `client/src/App.tsx`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

This sets up the client-side mechanics for initiating a card play. The next steps involve the server handling this message.

46.9s

edit

more_vert

proceed through the prompt creation process until you run out of tokens, presume i told you to continue until all prompts are completed

more_vert

Thoughts

\*The thoughts produced by the model are experimental

experiment

Expand to view model thoughts

10.4s

edit

more_vert

Okay, let's continue with the server handling the card play.

---

```
Prompt 42: Server - Handle PLAY_CARD Message - Basic Validation

Objective: Implement the server-side handler for the `PLAY_CARD` message with initial validation steps. Builds on Prompts 20, 35, 36, 41. Add tests.

Requirements:
1.  Ensure server `protocol.ts` has `PLAY_CARD` enum member and `PlayCardMessage` type.
2.  Modify `server/src/server.ts`. Import necessary types (`PLAY_CARD`, `PlayCardMessage`, `GameState`, `PlayerState`, `CardInstance`). Import `cardService` functions (`getCardDefinition`).
3.  Modify the `message` handler:
    - Add `case MessageType.PLAY_CARD:`.
    - Retrieve `clientId`, `gameId`, find `game` and `player`. Check existence.
    - Cast message payload: `const payload = (parsedMessage as PlayCardMessage).payload;`. Validate payload structure (`cardInstanceId`).
    - **Validation:**
        - Get card instance: Find the `cardInstance` in the `player.hand` array matching `payload.cardInstanceId`. If not found, send error ("Card not in hand").
        - Get card definition: Use `getCardDefinition(cardInstance.definitionId)` from `cardService`. If not found, send error ("Card definition not found").
        - Phase Check: Verify `game.phase` matches the card's intended phase (e.g., if `cardDef.type === 'OVERWORLD'`, check `game.phase === 'OVERWORLD'`). If mismatch, send error ("Cannot play this card type in current phase").
        - Target Check (Basic): If `payload.targetId` exists, check if the target is valid for the card type. E.g., for Overworld cards targeting territories, check `game.territories.has(payload.targetId)`. If invalid target, send error ("Invalid target for card").
        - **(Future): Add cost validation (Prompt 48), turn validation (Prompt 54).**
    - **State Update (Placeholder):**
        - If valid so far:
            - Log the play attempt: `console.log(`Player ${clientId} attempts to play card ${cardDef.name} (${payload.cardInstanceId}) on target ${payload.targetId}`);`.
            - **(Action): Execute card effect (Prompt 43).**
            - **(Action): Update card zones (Prompt 44).**
            - **(Action): Broadcast updates (Prompt 45).**
4.  Update `tests/serverMessages.test.ts`.
5.  Add Jest tests:
    - Test playing a card not in the player's hand returns an error.
    - Test playing a card with a missing definition returns an error.
    - Test playing an 'OVERWORLD' card during 'SCENARIO' phase returns an error.
    - Test playing a card with an invalid `targetId` returns an error.
    - Test a valid play attempt reaches the logging step (mock subsequent actions). (Requires setting up mock game state with player hand, territories, etc.).

Provide the `PLAY_CARD` case logic (up to validation) in `server/src/server.ts` and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 43: Server - Implement Placeholder Card Effect Logic

Objective: Add a basic system to interpret and execute placeholder effects defined in card definitions. Builds on Prompt 42. Add tests.

Requirements:
1.  Create a new service file, e.g., `server/src/services/effectService.ts`.
    - Import `GameState`, `PlayerState`, `Territory`, `CardDefinition` types.
    - Define an `EffectContext` interface: `{ game: GameState; player: PlayerState; cardDef: CardDefinition; targetId?: string; }`.
    - Create an async function `executeEffect(context: EffectContext): Promise<boolean>` (returns success/failure).
    - Inside `executeEffect`:
        - Parse `context.cardDef.effectDefinition` (which is JSON). Add try-catch.
        - Implement a switch or if/else based on the parsed effect structure (e.g., `effectDefinition.effect`).
        - **Case 'ADD_INFLUENCE' (Placeholder):**
            - Check if `context.targetId` exists and corresponds to a valid territory in `context.game.territories`.
            - If valid, find the `Territory` object. Modify its `corporateInfluence` (or similar property - requires adding it to the `Territory` interface/model if not present) by `effectDefinition.value`. Handle immutability if necessary (replace territory in map). Log the change. Return `true`.
        - **Case 'DRAW_CARD' (Placeholder):**
            - **(Future):** Requires deck logic. For now, just log "Attempted to draw card". Return `true`.
        - Add a default case for unknown effects (log error, return `false`).
        - Return `false` if validation within an effect fails.
2.  Modify `server/src/server.ts`:
    - Import `executeEffect` and `EffectContext`.
    - In the `PLAY_CARD` message handler, after successful validation (from Prompt 42):
        - Create the `effectContext` object using the current `game`, `player`, retrieved `cardDef`, and `payload.targetId`.
        - Call `const effectSuccess = await executeEffect(effectContext);`.
        - If `!effectSuccess`, potentially send an error message or revert any partial state changes if applicable. Log the failure. Only proceed to next steps (updating zones, broadcasting) if successful.
3.  Modify `server/src/types/game.ts`: Add `corporateInfluence: number;` (or similar) to the `Territory` interface if not already present.
4.  Create/Update `tests/effectService.test.ts`.
5.  Add Jest tests for `executeEffect`:
    - Test the placeholder 'ADD_INFLUENCE' effect correctly modifies a mocked `Territory` object within a mocked `GameState`. Check return value.
    - Test 'ADD_INFLUENCE' with an invalid target ID returns `false`.
    - Test the placeholder 'DRAW_CARD' effect logs and returns `true`.
    - Test an unknown effect type returns `false`.

Provide the content for `server/src/services/effectService.ts`, the integration call within the `PLAY_CARD` handler in `server/src/server.ts`, required changes to `server/src/types/game.ts`, and the new tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 44: Server - Update Game State After Card Play (Zones)

Objective: Move the played card from the player's hand to their discard pile in the game state. Builds on Prompts 36, 43. Add tests.

Requirements:
1.  Modify `server/src/server.ts`.
2.  In the `PLAY_CARD` message handler, *after* the `executeEffect` call returns successfully:
    - Find the index of the played card (`cardInstance`) in the `player.hand` array using `payload.cardInstanceId`.
    - If found (it should be, due to earlier validation):
        - Remove the card from the hand array (e.g., using `splice`). Handle immutability if state management requires it (create new hand array).
        - Add the `cardInstance` to the `player.discard` array. Handle immutability (create new discard array).
        - Log the card movement: `console.log(`Card ${payload.cardInstanceId} moved from hand to discard for player ${clientId}`);`.
3.  Update `tests/serverMessages.test.ts` or `tests/serverGameState.test.ts`.
4.  Add/modify Jest tests for the `PLAY_CARD` handler:
    - Verify that after a successful card play (mocking `executeEffect` to return `true`), the played card is removed from the player's `hand` state.
    - Verify that the played card is added to the player's `discard` state.

Provide the card zone update logic within the `PLAY_CARD` handler in `server/src/server.ts` and the relevant test updates.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 45: Server - Broadcast Game State Updates After Card Play

Objective: Notify clients about the changes resulting from a card play (hand, discard, target state). Builds on Prompts 14, 21, 44.

Requirements:
1.  Modify `server/src/types/protocol.ts`:
    - Define messages for granular player state updates (more efficient than sending full state):
        - `PLAYER_HAND_UPDATE = 'PLAYER_HAND_UPDATE'`, `PlayerHandUpdateMessage extends ServerToClientMessage<{ playerId: string; hand: CardInstance[]; // Send full hand for simplicity now }> {}`
        - `PLAYER_DISCARD_UPDATE = 'PLAYER_DISCARD_UPDATE'`, `PlayerDiscardUpdateMessage extends ServerToClientMessage<{ playerId: string; discard: CardInstance[]; // Or just count? Send array for now }> {}`
    - Ensure `TERRITORY_UPDATE` (Prompt 21) payload can convey changes made by card effects (e.g., updated `corporateInfluence`). Update its payload definition if necessary.
2.  Modify `server/src/server.ts`. Import new types.
3.  In the `PLAY_CARD` message handler, *after* card zones are updated (Prompt 44) and *after* effects potentially modified targets (Prompt 43):
    - Construct and broadcast `PlayerHandUpdateMessage` for the player who played the card:
        - `const handUpdate: PlayerHandUpdateMessage = { type: MessageType.PLAYER_HAND_UPDATE, payload: { playerId: clientId, hand: player.hand } };`
        - `broadcastToGame(gameId, handUpdate);`
    - Construct and broadcast `PlayerDiscardUpdateMessage`:
        - `const discardUpdate: PlayerDiscardUpdateMessage = { type: MessageType.PLAYER_DISCARD_UPDATE, payload: { playerId: clientId, discard: player.discard } };`
        - `broadcastToGame(gameId, discardUpdate);`
    - If the card effect modified a target (e.g., a territory via 'ADD_INFLUENCE'):
        - Retrieve the updated target state (e.g., the modified `Territory` object).
        - Construct an appropriate `TERRITORY_UPDATE` message containing the updated territory data.
        - `broadcastToGame(gameId, territoryUpdateMessage);`.
4.  Update tests (`serverMessages.test.ts`) for the `PLAY_CARD` handler:
    - Verify that after a successful play, `PLAYER_HAND_UPDATE`, `PLAYER_DISCARD_UPDATE`, and relevant target update messages (e.g., `TERRITORY_UPDATE`) are broadcast correctly using `broadcastToGame`. Check payloads.

Provide the additions to `server/src/types/protocol.ts`, the broadcast logic within the `PLAY_CARD` handler in `server/src/server.ts`, and relevant test updates. Remind to update client types.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 46: Client - Handle Card Play Game State Updates

Objective: Process server messages related to card plays to update the client's local state and UI (hand, discard, target visuals). Builds on Prompts 15, 22, 39, 45.

Requirements:
1.  Ensure client types (`protocol.ts`, `game.ts`) are updated with `PLAYER_HAND_UPDATE`, `PLAYER_DISCARD_UPDATE`, etc.
2.  Modify the client state management (`App.tsx` or context/store):
    - Ensure the local `gameState` accurately reflects `PlayerState` including `hand`, `discard`, etc.
3.  Modify the `handleMessage` callback function in `src/App.tsx`:
    - Add `case MessageType.PLAYER_HAND_UPDATE:`:
        - Cast message payload. Find the player in the local `gameState.players` map using `payload.playerId`.
        - Update that player's `hand` immutably within the local `gameState`.
        - `setGameState(prevState => { /* ... immutable update for specific player's hand ... */ });`
    - Add `case MessageType.PLAYER_DISCARD_UPDATE:`:
        - Similar logic: find the player, update their `discard` array immutably.
    - Ensure `case MessageType.TERRITORY_UPDATE:` (from Prompt 22) correctly handles updates triggered by card effects (e.g., updating influence).
4.  Verify UI updates:
    - The `CardHand` component (Prompt 39) should automatically re-render with the updated `myHand` prop derived from the changed `gameState`, showing the card removed.
    - Add a simple display for discard pile count (e.g., in `App.tsx`): `Discard: {currentPlayerState?.discard.length ?? 0}`. Verify this count increases.
    - The `PixiCanvas`/`OverworldRenderer` should reflect territory changes via `TERRITORY_UPDATE` (Prompt 22 logic).
5.  Run server and client. Play a card (that targets a territory, like the placeholder 'ADD_INFLUENCE'). Verify:
    - Card disappears from the client's hand UI.
    - Discard count increases.
    - Territory visual updates (e.g., highlight/color change reflecting influence).

Provide the updated `handleMessage` logic in `client/src/App.tsx` and any necessary UI elements for discard count.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 47: Server - Implement Basic Resource Tracking

Objective: Add a resource property to the server-side `PlayerState` to track player resources like credits. Builds on Prompt 36.

Requirements:
1.  Modify `server/src/types/game.ts`:
    - Add a `resources` property to the `PlayerState` interface. Use a simple object for now:
        `resources: { credits: number; /* Add other resources later */ };`
2.  Modify `server/src/server.ts`:
    - In the player creation logic (within `connection` handler or extracted function), initialize `resources` with starting values when creating `newPlayer`:
        `resources: { credits: 5 } // Default starting credits`
3.  Modify `server/src/types/protocol.ts`:
    - Ensure `PlayerState` definitions used in messages (`GAME_STATE_INIT`, `PLAYER_JOINED`) reflect the new `resources` property.
4.  Update tests (`serverGameState.test.ts`, `serverMessages.test.ts`):
    - Verify new players are initialized with default resources.
    - Verify relevant message payloads (`GAME_STATE_INIT`, `PLAYER_JOINED`) include the `resources` object.

Provide the updated `PlayerState` interface in `server/src/types/game.ts`, the initialization logic update in `server/src/server.ts`, and relevant test updates. Remind to update client types.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 48: Server - Implement Card Cost Validation

Objective: Check if the player has enough resources (credits) before allowing a card play. Builds on Prompts 42, 47. Add tests.

Requirements:
1.  Modify `server/src/server.ts`.
2.  In the `PLAY_CARD` message handler, add a validation step *before* executing the effect:
    - Retrieve the `cardDef` (already done in Prompt 42).
    - Retrieve the `player.resources.credits`.
    - Check if `player.resources.credits >= cardDef.cost`.
    - If insufficient credits, send an `ERROR` message back to the client (e.g., `{ type: MessageType.ERROR, payload: { message: "Insufficient credits" } }`) and **do not proceed** with effect execution or state updates.
3.  Update `tests/serverMessages.test.ts`.
4.  Add/modify Jest tests for the `PLAY_CARD` handler:
    - Test playing a card the player cannot afford returns an appropriate ERROR message and does *not* proceed to effect execution/state changes.
    - Test playing a card the player *can* afford passes this validation step. (Requires setting up mock player state with specific resource amounts).

Provide the cost validation logic within the `PLAY_CARD` handler in `server/src/server.ts` and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 49: Server - Deduct Resources on Card Play

Objective: Subtract the card's cost from the player's resources after successful validation and effect execution. Builds on Prompts 44, 48. Add tests.

Requirements:
1.  Modify `server/src/server.ts`.
2.  In the `PLAY_CARD` message handler, *after* successful validation (including cost check) and *after* successful effect execution (`executeEffect` returns true), but *before* broadcasting updates:
    - Retrieve the `cardDef` (already available).
    - Subtract the cost: `player.resources.credits -= cardDef.cost;`. Handle potential edge cases (shouldn't happen if validation is correct, but ensure credits don't go negative).
    - Log the resource change: `console.log(`Player ${clientId} spent ${cardDef.cost} credits. Remaining: ${player.resources.credits}`);`.
3.  Update tests (`serverMessages.test.ts` or `serverGameState.test.ts`).
4.  Add/modify Jest tests for the `PLAY_CARD` handler:
    - Verify that after a successful card play, the player's `resources.credits` are correctly reduced by the card's cost.

Provide the resource deduction logic within the `PLAY_CARD` handler in `server/src/server.ts` and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 50: Server/Client - Broadcast & Display Resource Updates

Objective: Notify clients about resource changes and display the current player's resources. Builds on Prompts 45, 46, 49.

Requirements:
1.  **Server:** Modify `server/src/types/protocol.ts`:
    - Add `PLAYER_RESOURCE_UPDATE = 'PLAYER_RESOURCE_UPDATE'` to `MessageType`.
    - Define `PlayerResourceUpdateMessage extends ServerToClientMessage<{ playerId: string; resources: { credits: number; /* include others later */ }; }> {}`.
2.  **Server:** Modify `server/src/server.ts`:
    - In the `PLAY_CARD` handler, after deducting resources (Prompt 49), construct and broadcast a `PlayerResourceUpdateMessage`:
        - `const resourceUpdate: PlayerResourceUpdateMessage = { type: MessageType.PLAYER_RESOURCE_UPDATE, payload: { playerId: clientId, resources: player.resources } };`
        - `broadcastToGame(gameId, resourceUpdate);`
    - Also ensure `GAME_STATE_INIT` includes initial resources (already covered by Prompt 47 test verification).
3.  **Client:** Ensure client types (`protocol.ts`, `game.ts`) are updated.
4.  **Client:** Modify `handleMessage` in `src/App.tsx`:
    - Add `case MessageType.PLAYER_RESOURCE_UPDATE:`.
    - Find the relevant player in local `gameState` and update their `resources` immutably.
5.  **Client:** Modify UI in `src/App.tsx` (or a HUD component):
    - Display the current player's credits: Find `currentPlayerState` using `myClientId` and render `Credits: {currentPlayerState?.resources.credits ?? 0}`.
6.  Update server tests (`serverMessages.test.ts`) to verify `PLAYER_RESOURCE_UPDATE` is broadcast after successful card play.
7.  Run server and client. Play an affordable card. Verify the player's credit display updates correctly on the client.

Provide the relevant type additions (`protocol.ts`), server broadcast logic (`server.ts`), client message handling and UI display logic (`App.tsx`), and test updates.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

I'm nearing the conceptual limit of what can be reasonably prompted without significant refactoring or introducing more complex state management patterns (like reducers/context on the client, or more structured state machines on the server). The next steps involve turns and deck mechanics, which add more complexity.

41.2s

edit

more_vert

Alright. Are you able to provide salient prompts on turns and deck mechanics, or do you feel the rest of the scaffolding needs to be built out before providing further guidance?

more_vert

Thoughts

\*The thoughts produced by the model are experimental

experiment

Expand to view model thoughts

10.7s

edit

more_vert

Yes, I believe we can provide salient prompts for adding basic Turn System logic and Deck Mechanics (specifically shuffling and drawing) onto the current scaffolding.

While the complexity is increasing and refactoring (especially on the client state management side) would be beneficial soon, the core elements needed to implement these features are present:

- We have a server-side GameState object where turn information can be stored.
- We have PlayerState where deck/hand/discard arrays exist.
- We have the WebSocket communication channel to broadcast turn changes and state updates (like drawing cards).
- We have the basic card definition and instance structures.

Let's proceed with these prompts.

---

```
Prompt 51: Server - Add Turn Tracking to GameState

Objective: Modify the server game state to include turn number and the ID of the player whose turn it currently is. Builds on Prompt 11.

Requirements:
1.  Modify `server/src/types/game.ts`:
    - Add properties to the `GameState` interface:
        `turnNumber: number;`
        `currentPlayerId: string | null; // ID of the player whose turn it is, null if game not started/between turns`
2.  Modify `server/src/server.ts`:
    - In the `getOrCreateGame` function, when creating a `newGame`:
        - Initialize `turnNumber: 0` (or 1 if starting immediately).
        - Initialize `currentPlayerId: null`.
    - **(Decision):** Add logic for starting the first turn. When does the game officially start? Let's assume for now it starts when 2 players are connected and in 'OVERWORLD' phase. Add a check function `checkAndStartGame(game: GameState)`:
        - If `game.players.size >= 2` (adjust target player count as needed) AND `game.phase === 'WAITING'`:
            - Set `game.phase = 'OVERWORLD'`.
            - Set `game.turnNumber = 1`.
            - Set `game.currentPlayerId` to the ID of the first player (e.g., `Array.from(game.players.keys())[0]`).
            - Log game start.
            - **(Action):** Broadcast `PHASE_CHANGE` and a new `TURN_CHANGE` message (Prompt 53).
    - Call `checkAndStartGame(game)` within the `connection` handler after a player is added.
3.  Update tests (`serverGameState.test.ts`) to:
    - Verify new games are initialized with `turnNumber: 0` and `currentPlayerId: null`.
    - Test the `checkAndStartGame` logic: verify phase, turn number, and current player ID are set correctly when conditions are met (mocking player connections).

Provide the updated `GameState` interface in `server/src/types/game.ts`, the updated initialization logic and the new `checkAndStartGame` function in `server/src/server.ts`, and relevant test updates.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 52: Server - Implement Basic Turn Advancement Logic

Objective: Create a mechanism to advance the turn to the next player. Builds on Prompt 51. Add tests.

Requirements:
1.  Modify `server/src/types/protocol.ts`:
    - Add `END_TURN = 'END_TURN'` to `MessageType`.
    - Define `EndTurnMessage extends ClientToServerMessage<{}> {}` (no payload needed for basic end turn).
2.  Modify `server/src/server.ts`:
    - Import `EndTurnMessage`, `MessageType`.
    - Create a function `advanceTurn(game: GameState)`:
        - Get the list of *connected* player IDs from `game.players` (filter by `status === 'connected'`). Store them in an array.
        - Find the index of the `game.currentPlayerId` in this array.
        - Calculate the next index: `(currentIndex + 1) % connectedPlayers.length`.
        - Get the `nextPlayerId` from the array using the next index.
        - Update the game state:
            - `game.currentPlayerId = nextPlayerId;`
            - If the `nextIndex` is 0 (wrapped around), increment `game.turnNumber`.
        - Log the turn advancement: `console.log(`Game ${game.gameId}: Turn advanced to player ${nextPlayerId} (Turn ${game.turnNumber})`);`.
        - **(Future):** Add start-of-turn effects here (e.g., draw card - Prompt 56).
        - **(Action):** Broadcast `TURN_CHANGE` message (Prompt 53).
    - Modify the `message` handler:
        - Add `case MessageType.END_TURN:`.
        - Retrieve `clientId`, `gameId`, find `game`. Check existence.
        - **Validation:**
            - Check if `game.phase` is `OVERWORLD` or `SCENARIO` (phases where turns happen).
            - Check if `clientId === game.currentPlayerId`. If not, send error ("Not your turn").
        - If valid, call `advanceTurn(game);`.
3.  Update relevant test files (`serverMessages.test.ts`, `serverGameState.test.ts`).
4.  Add Jest tests for `advanceTurn`:
    - Test advancing the turn correctly updates `currentPlayerId`.
    - Test advancing the turn correctly increments `turnNumber` when wrapping around.
    - Test that it skips disconnected players.
5.  Add Jest tests for the `END_TURN` message handler:
    - Test valid `END_TURN` message calls `advanceTurn`.
    - Test `END_TURN` message from the wrong player returns an error.
    - Test `END_TURN` message during the wrong phase returns an error.

Provide the additions to `server/src/types/protocol.ts`, the `advanceTurn` function, the `END_TURN` message handler logic in `server/src/server.ts`, and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 53: Server/Client - Broadcast and Handle Turn Changes

Objective: Notify clients when the turn changes and update the client UI accordingly. Builds on Prompts 51, 52.

Requirements:
1.  **Server:** Modify `server/src/types/protocol.ts`:
    - Add `TURN_CHANGE = 'TURN_CHANGE'` to `MessageType`.
    - Define `TurnChangeMessage extends ServerToClientMessage<{ currentPlayerId: string | null; turnNumber: number; }> {}`.
2.  **Server:** Modify `server/src/server.ts`:
    - Import `TurnChangeMessage`, `MessageType`.
    - In the `checkAndStartGame` function (Prompt 51), after setting the initial turn:
        - Construct `TurnChangeMessage` with `game.currentPlayerId` and `game.turnNumber`.
        - Call `broadcastToGame(game.gameId, turnChangeMessage);`.
    - In the `advanceTurn` function (Prompt 52), after updating `currentPlayerId` and `turnNumber`:
        - Construct `TurnChangeMessage`.
        - Call `broadcastToGame(game.gameId, turnChangeMessage);`.
3.  **Client:** Ensure client types (`protocol.ts`, `game.ts`) are updated.
4.  **Client:** Modify `handleMessage` in `src/App.tsx`:
    - Add `case MessageType.TURN_CHANGE:`.
    - Update local `gameState` immutably with the new `currentPlayerId` and `turnNumber` from the payload.
5.  **Client:** Modify UI in `src/App.tsx`:
    - Display the current turn number: `Turn: {gameState?.turnNumber ?? 0}`.
    - Indicate whose turn it is: `Current Player: {gameState?.currentPlayerId ?? 'None'}`.
    - Highlight if it's the current user's turn: `const isMyTurn = gameState?.currentPlayerId === myClientId;`. Display "Your Turn!" or add styling based on `isMyTurn`.
    - Add an "End Turn" button that is only visible/enabled if `isMyTurn` is true. Attach an `onClick` handler:
        - `handleEndTurn = () => { const message: EndTurnMessage = { type: MessageType.END_TURN, payload: {} }; sendMessage(message); }`
6.  Update server tests (`serverGameState.test.ts`, `serverMessages.test.ts`) to verify `TURN_CHANGE` is broadcast by `checkAndStartGame` and `advanceTurn`.
7.  Run server and clients (at least 2). Verify:
    - Game starts, turn indicator updates.
    - Only the current player sees the enabled "End Turn" button.
    - Clicking "End Turn" advances the turn, updates indicators for all clients, and enables the button for the next player.

Provide the relevant type additions (`protocol.ts`), server broadcast logic (`server.ts`), client message handling/UI logic/button (`App.tsx`), and test updates.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 54: Server - Add Turn Validation to Actions

Objective: Prevent players from performing actions (like playing cards) when it's not their turn. Builds on Prompts 42, 52.

Requirements:
1.  Modify `server/src/server.ts`.
2.  In the validation section of handlers for actions that should be turn-limited:
    - **`PLAY_CARD` handler (Prompt 42):** Add a check: `if (clientId !== game.currentPlayerId) { /* Send error: Not your turn */ return; }`.
    - **`SCENARIO_ACTION` handler (Prompt 31):** Add a similar check: `if (clientId !== game.currentPlayerId) { /* Send error: Not your turn */ return; }`. (Note: Scenario turns might have different rules later, but use game `currentPlayerId` for now).
    - **`SELECT_TERRITORY` handler (Prompt 20):** Decide if this should be turn-limited. Often, selecting/viewing is allowed, but actions based on selection are limited. Let's assume selection is okay off-turn for now.
3.  Update tests (`serverMessages.test.ts`) for `PLAY_CARD` and `SCENARIO_ACTION`:
    - Add tests verifying that sending these actions when it is *not* the sender's turn results in an appropriate ERROR message and no state change. (Requires setting `game.currentPlayerId` appropriately in test setup).

Provide the updated validation logic within the relevant message handlers in `server/src/server.ts` and the corresponding new tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 55: Server - Implement Deck Initialization and Shuffling

Objective: Create initial player decks by shuffling card definition IDs and creating corresponding card instances. Builds on Prompt 36. Add tests.

Requirements:
1.  Modify `server/src/server.ts`.
    - Import `CardInstance`, `PlayerState`. Import `cardDefinitionMap` (or getter) from `cardService`. Import `uuidv4`.
    - Install a shuffle utility if needed (or implement Fisher-Yates): `npm install lodash @types/lodash` (provides `_.shuffle`). Import `shuffle from 'lodash/shuffle'`.
    - Create a function `initializePlayerDeck(player: PlayerState, availableCardDefIds: string[])`:
        - Filter `availableCardDefIds` based on faction or other rules if applicable (not yet implemented, use all for now).
        - Define deck size (e.g., `const DECK_SIZE = 20;`).
        - Create a pool of definition IDs to draw from (repeat definitions if needed to reach deck size, or use all available). For simplicity, let's just use the available IDs and shuffle them. `let deckDefIds = [...availableCardDefIds]; // Expand this later based on deckbuilding rules`
        - Shuffle the definition IDs: `deckDefIds = shuffle(deckDefIds);`. Limit to `DECK_SIZE` if necessary.
        - Create `CardInstance` objects for the deck: `player.deck = deckDefIds.map(defId => ({ instanceId: uuidv4(), definitionId: defId }));`.
        - Clear player's hand and discard: `player.hand = []; player.discard = [];`.
        - Log deck initialization: `console.log(`Initialized deck for player ${player.id} with ${player.deck.length} cards.`);`.
    - Modify the `checkAndStartGame` function (Prompt 51):
        - *Before* setting the first turn/player, iterate through all `game.players`.
        - For each player, call `initializePlayerDeck(player, Array.from(cardDefinitionMap.keys()));`.
    - Remove the temporary hand-dealing logic from `getOrCreateGame` or the connection handler (added in Prompt 36).
2.  Update tests (`serverGameState.test.ts`).
3.  Add Jest tests for `initializePlayerDeck`:
    - Verify it correctly populates the `player.deck` with `CardInstance` objects.
    - Verify the number of cards matches expectations.
    - Verify hand/discard are cleared.
    - Verify shuffling occurs (harder to test deterministically, but check that multiple calls with same input produce different deck order). Mock `shuffle` if needed for predictable testing.
    - Update tests for `checkAndStartGame` to verify decks are initialized for all players.

Provide the `initializePlayerDeck` function, its integration into `checkAndStartGame` in `server/src/server.ts`, removal of old temporary logic, and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 56: Server - Implement Basic Draw Card Logic

Objective: Create logic to move a card from a player's deck to their hand, handling empty deck reshuffling. Builds on Prompts 44, 55. Add tests.

Requirements:
1.  Modify `server/src/server.ts`. Import types.
2.  Create a function `drawCards(player: PlayerState, gameId: string, count: number = 1)`:
    - Loop `count` times:
        - Check if `player.deck.length === 0`:
            - If `player.discard.length === 0`, log "Cannot draw, deck and discard empty" and break the loop/return early.
            - Reshuffle:
                - Log "Reshuffling discard into deck".
                - Move all cards from `player.discard` to `player.deck`: `player.deck = shuffle([...player.discard]);`.
                - Clear the discard: `player.discard = [];`.
                - **(Action):** Broadcast `PLAYER_DISCARD_UPDATE` (empty discard) and potentially `PLAYER_DECK_UPDATE` (new deck count - requires new message type).
        - If deck is still empty after potential reshuffle, break/return.
        - Draw the card: `const drawnCard = player.deck.pop();` (assuming deck top is end of array).
        - If `drawnCard` exists:
            - Add it to the hand: `player.hand.push(drawnCard);`.
            - Log the draw.
        - Handle immutability for arrays if necessary.
    - **(Action):** After the loop, broadcast `PLAYER_HAND_UPDATE` and `PLAYER_DECK_UPDATE` (or count) for the player.
3.  **(Integration):** Modify `advanceTurn` function (Prompt 52): After setting the new `currentPlayerId`, call `drawCards(game.players.get(newCurrentPlayerId)!, game.gameId, 1);` to implement automatic start-of-turn draw. Make `advanceTurn` async if `drawCards` needs to be.
4.  **(Optional):** Modify `effectService` (Prompt 43): Implement the 'DRAW_CARD' effect case to call this `drawCards` function.
5.  Define `PLAYER_DECK_UPDATE` message type in `protocol.ts` (Payload: `{ playerId: string; deckCount: number; }`).
6.  Update tests (`serverGameState.test.ts`). Add new tests for `drawCards`:
    - Test drawing from a non-empty deck moves card to hand, updates deck.
    - Test drawing the last card from the deck.
    - Test drawing when deck is empty but discard is not triggers reshuffle and then draws. Check discard becomes empty, deck has correct cards.
    - Test drawing when deck and discard are empty does nothing.
    - Test drawing multiple cards.
7.  Update tests for `advanceTurn` to verify `drawCards` is called. Mock `drawCards` in these tests.

Provide the `drawCards` function, its integration into `advanceTurn`, the 'DRAW_CARD' effect implementation, the new message type, and relevant tests. Remind to update client types.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 57: Client - Handle Deck/Draw Updates

Objective: Process server messages about deck changes (reshuffles, draws) and update the UI. Builds on Prompts 46, 56.

Requirements:
1.  Ensure client types (`protocol.ts`, `game.ts`) are updated (`PLAYER_DECK_UPDATE`, ensure `PlayerState` includes deck).
2.  Modify the client state management (`App.tsx` or context/store) and `handleMessage` callback:
    - Ensure `PLAYER_HAND_UPDATE` handler correctly updates the hand when cards are drawn.
    - Add `case MessageType.PLAYER_DECK_UPDATE:`: Update the deck count for the relevant player in local state (may need to add `deckCount` property to local `PlayerState` or just store counts separately). If deck array is stored, update it based on count/other info if provided.
    - Ensure `PLAYER_DISCARD_UPDATE` handles the case where discard becomes empty after reshuffle.
3.  Modify UI in `src/App.tsx` (or HUD component):
    - Display the current player's deck count: `Deck: {calculateDeckCountFromState() ?? 0}`.
    - The `CardHand` should automatically update when the `myHand` prop changes due to draws.
4.  Run server and clients. Verify:
    - Deck count decreases when turn starts (due to draw).
    - Hand UI updates with the drawn card.
    - Simulate emptying the deck and discard pile to test reshuffle logic (might require specific card effects or debug commands later).

Provide the updated client `handleMessage` logic for deck/discard updates, and the UI display for deck count in `client/src/App.tsx`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

This completes the basic Turn and Deck mechanics (shuffle/draw). The next logical steps would be implementing Factions or more detailed Card Effects and Targeting.

51.2s

edit

more_vert

Proceed as far as you can providing coherent prompts, those mechanics sound necessary to me.

more_vert

Thoughts

\*The thoughts produced by the model are experimental

experiment

Expand to view model thoughts

6.7s

edit

more_vert

Okay, let's proceed with Factions and refining Card Effects/Targeting.

---

**Phase 6: Factions & Core Gameplay**

```
Prompt 58: Server - Add Faction Information to State

Objective: Define faction types and associate players with factions within the game state. Builds on Prompts 10, 26, 47.

Requirements:
1.  Modify `server/src/types/game.ts`:
    - Define `FactionType`: `export type FactionType = 'CORPORATION' | 'RUNNER' | 'NEUTRAL';` (or specific factions like 'WEYLAND', 'ANARCH'). Let's use CORPORATE/RUNNER for asymmetry.
    - Add `faction: FactionType;` to the `PlayerState` interface.
2.  Modify `server/src/server.ts`:
    - **(Decision):** How are factions assigned? Let's assign alternatingly for now upon game start for simplicity.
    - Modify the `checkAndStartGame` function (Prompt 51 & 55):
        - When iterating through players to initialize decks, assign factions:
            - `const faction = index % 2 === 0 ? 'CORPORATION' : 'RUNNER'; // Simple alternating assignment`
            - `player.faction = faction;`
            - Log the assignment: `console.log(`Assigned faction ${faction} to player ${player.id}`);`.
        - Also, adjust starting resources based on faction if desired:
            - `player.resources = { credits: faction === 'CORPORATION' ? 10 : 5 }; // Example: Corps start with more credits`
    - Ensure the updated `PlayerState` (with faction and potentially adjusted resources) is used in subsequent broadcasts (`GAME_STATE_INIT`, `PLAYER_JOINED`, `PLAYER_RESOURCE_UPDATE`).
3.  Update tests (`serverGameState.test.ts`, `serverMessages.test.ts`):
    - Verify players are assigned alternating factions in `checkAndStartGame`.
    - Verify starting resources differ based on assigned faction (if implemented).
    - Verify message payloads reflect the `faction` property in `PlayerState`.

Provide the updated `server/src/types/game.ts` (FactionType, PlayerState), the faction assignment logic within `checkAndStartGame` in `server/src/server.ts`, and relevant test updates. Remind to update client types.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 59: Client - Display Faction Information

Objective: Display the player's faction and potentially other players' factions in the UI. Builds on Prompts 15, 58.

Requirements:
1.  Ensure client types (`game.ts`) are updated with `FactionType` and the `faction` property on `PlayerState`.
2.  Modify the UI (`App.tsx` or HUD component):
    - Find the `currentPlayerState` using `myClientId`.
    - Display the current player's faction: `Faction: {currentPlayerState?.faction ?? 'N/A'}`.
    - In the player list display (from Prompt 15), include the faction for each player:
        - `<li>{p.displayName ?? p.id} ({p.faction} - {p.status})</li>`
3.  Run server and clients. Verify:
    - The current player's faction is displayed.
    - The player list shows the correct faction for each connected player.

Provide the updated UI rendering logic in `client/src/App.tsx` to display faction information.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 60: Server - Basic Faction Validation (Card Play)

Objective: Add validation to card play based on the card's faction requirements and the player's faction. Builds on Prompts 42, 58. Add tests.

Requirements:
1.  Modify `server/src/server.ts`.
2.  In the `PLAY_CARD` message handler, add a validation step (after retrieving `player` and `cardDef`):
    - Check `cardDef.faction`:
        - If `cardDef.faction` is defined (not null/undefined) AND `cardDef.faction !== 'NEUTRAL'` (assuming NEUTRAL is a possible value):
            - Check if `player.faction === cardDef.faction`.
            - If not a match, send an `ERROR` message back to the client (e.g., "Cannot play card: Faction mismatch") and return.
3.  Modify `server/src/data/cards.json` (Prompt 35): Ensure at least one card definition has a specific `faction` (e.g., "CORPORATION" or "RUNNER") for testing. Add a "NEUTRAL" card too.
4.  Update `tests/serverMessages.test.ts`.
5.  Add Jest tests for the `PLAY_CARD` handler:
    - Test playing a faction-specific card by a player of the matching faction passes validation.
    - Test playing a faction-specific card by a player of a different faction returns a "Faction mismatch" error.
    - Test playing a "NEUTRAL" card by any faction passes validation.

Provide the faction validation logic within the `PLAY_CARD` handler in `server/src/server.ts`, an example update to `server/src/data/cards.json`, and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 61: Server - Simple Faction Ability (Start-of-Turn Bonus)

Objective: Implement a basic passive faction ability, such as a resource bonus at the start of the turn. Builds on Prompts 52, 58. Add tests.

Requirements:
1.  Modify `server/src/server.ts`.
2.  Modify the `advanceTurn` function (Prompt 52):
    - After determining the `nextPlayerId` and before broadcasting `TURN_CHANGE`:
    - Get the `nextPlayer = game.players.get(nextPlayerId);`.
    - If `nextPlayer` exists:
        - Implement faction-specific start-of-turn logic:
            - `if (nextPlayer.faction === 'CORPORATION') { nextPlayer.resources.credits += 1; console.log(`Corp player ${nextPlayerId} gained 1 credit (start of turn). Total: ${nextPlayer.resources.credits}`); }`
            - `else if (nextPlayer.faction === 'RUNNER') { // Maybe draw an extra card later? For now, maybe just log. console.log(`Runner player ${nextPlayerId} starts turn.`); }`
        - **(Action):** Broadcast the resource update if resources changed. Use the `PLAYER_RESOURCE_UPDATE` message (from Prompt 50). Send it *before* or *along with* the `TURN_CHANGE` message.
3.  Update tests (`serverGameState.test.ts` or `serverMessages.test.ts`).
4.  Add Jest tests for `advanceTurn`:
    - Verify that when the turn advances to a 'CORPORATION' player, their credits increase by 1 and a `PLAYER_RESOURCE_UPDATE` message is broadcast.
    - Verify that when the turn advances to a 'RUNNER' player, their credits do *not* increase (based on current logic).
    - Ensure the `TURN_CHANGE` message is still broadcast correctly.

Provide the updated `advanceTurn` function logic in `server/src/server.ts` and relevant test updates.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 62: Client - Handle Faction Ability Update (Resource Display)

Objective: Ensure the client correctly processes resource updates triggered by faction abilities. Builds on Prompts 50, 61.

Requirements:
1.  This prompt primarily involves verifying existing client logic handles the server changes.
2.  Ensure the client's `handleMessage` function for `PLAYER_RESOURCE_UPDATE` (Prompt 50) correctly updates the local state for *any* player, not just the current client's player.
3.  Ensure the UI displaying resources (Prompt 50) correctly reflects the updated state when the start-of-turn bonus occurs for the current player.
4.  **(Optional UI):** Consider adding resource displays for opponents (maybe simplified) if desired, which would then reflect these updates too.
5.  Run server and clients (1 Corp, 1 Runner). Play until the start of the Corporation player's turn. Verify their credit display increases by 1 automatically. Verify the Runner's does not when their turn starts.

No new code generation is explicitly required if Prompt 50 was implemented correctly to handle updates for any player. This is a verification step. If Prompt 50 only updated the *current* client's resources, provide the updated `handleMessage` logic for `PLAYER_RESOURCE_UPDATE` in `client/src/App.tsx` to handle updates for any `playerId`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

**Phase 7: Card Effects & Targeting Refinement**

```
Prompt 63: Server - Refine Effect Service Structure

Objective: Enhance the `effectService` to better handle different effect types and contexts. Builds on Prompt 43.

Requirements:
1.  Modify `server/src/services/effectService.ts`.
2.  Refine the `EffectContext`. Consider adding more optional fields that *might* be needed by various effects: `sourceCardInstanceId?: string`, `triggeringEvent?: string`.
3.  Refactor `executeEffect` to be more modular. Instead of one large switch, consider a map or registry:
    - `type EffectExecutor = (context: EffectContext, effectData: any) => Promise<boolean>;`
    - `const effectRegistry = new Map<string, EffectExecutor>();`
    - Create separate functions for each effect type (e.g., `executeAddInfluence`, `executeDrawCard`, `executeDealDamage`). These functions take `(context: EffectContext, effectData: any)` and contain the specific logic and validation for that effect.
    - Register these functions: `effectRegistry.set('ADD_INFLUENCE', executeAddInfluence); effectRegistry.set('DRAW_CARD', executeDrawCard);`
    - The main `executeEffect` function now:
        - Parses `context.cardDef.effectDefinition`. This might be an object `{"effect": "...", "value": ...}` or an array of such objects `[{"effect": "..."}, {"effect": "..."}]`. Handle both cases.
        - For each effect object:
            - Look up the executor in `effectRegistry` using `effectObject.effect`.
            - If found, call `await executor(context, effectObject);`. If it returns `false`, maybe stop processing further effects from that card? (Depends on design).
            - If not found, log warning/error.
        - Return overall success/failure.
4.  Implement placeholder logic for a new effect type, e.g., `DAMAGE_ENTITY`:
    - Add `'DAMAGE_ENTITY'` to the registry.
    - Create `executeDamageEntity(context, effectData)` function.
    - It should log "Attempted to deal damage" (requires entity system later). Return `true` for now.
5.  Update tests (`tests/effectService.test.ts`) to reflect the new structure:
    - Test the registry lookup.
    - Test individual effect executor functions directly.
    - Test `executeEffect` handling an array of effects.

Provide the refactored content for `server/src/services/effectService.ts` and updated tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 64: Server - Implement Targeting Validation Refinement

Objective: Improve the validation logic in `PLAY_CARD` to check if the provided target is appropriate for the card's effect requirements. Builds on Prompts 42, 63. Add tests.

Requirements:
1.  Modify `server/src/data/cards.json`: Add a `targetType` property to card definitions that require targets (e.g., `"targetType": "TERRITORY"` for 'ADD_INFLUENCE', `"targetType": "ENTITY"` for 'DAMAGE_ENTITY'). Cards without targets omit this.
2.  Modify `server/prisma/schema.prisma`: Add `targetType String?` to the `CardDefinition` model. Run `npx prisma migrate dev --name add_card_target_type` and regenerate client `npx prisma generate`.
3.  Modify `server/src/services/cardService.ts`: Ensure `loadCardDefinitions` handles the new optional `targetType` property. Update `CardDefinition` type import/usage.
4.  Modify `server/src/server.ts`:
    - Import `CardDefinition` type correctly.
    - In the `PLAY_CARD` message handler, refine the target validation step (after getting `cardDef`):
        - Check `cardDef.targetType`:
            - If `cardDef.targetType` exists (e.g., 'TERRITORY'):
                - Check if `payload.targetId` was provided. If not, send error ("Target required for this card").
                - Validate the target ID based on the type. If `targetType` is 'TERRITORY', check `game.territories.has(payload.targetId)`. If `targetType` is 'ENTITY', check against scenario entities (later). If invalid for type, send error ("Invalid target type").
            - If `cardDef.targetType` does *not* exist:
                - Check if `payload.targetId` *was* provided. If yes, send error ("Card does not take a target").
5.  Update `tests/serverMessages.test.ts` for `PLAY_CARD`:
    - Test playing a card requiring a 'TERRITORY' target without a `targetId` fails.
    - Test playing a card requiring a 'TERRITORY' target with an invalid `targetId` fails.
    - Test playing a card requiring a 'TERRITORY' target with a valid `targetId` passes validation.
    - Test playing a card that *doesn't* require a target with a `targetId` fails.
    - Test playing a card that doesn't require a target without a `targetId` passes validation.

Provide the updated `server/prisma/schema.prisma`, an example update for `server/src/data/cards.json`, updates to `server/src/services/cardService.ts`, the refined target validation logic in `server/src/server.ts`, and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 65: Client - Refine Targeting UI/UX

Objective: Improve the client-side user experience for playing targeted cards (e.g., highlight valid targets when card selected). Builds on Prompts 19, 22, 40, 41, 64.

Requirements:
1.  Modify client state management (`App.tsx`):
    - When a card is selected (`handleCardClick`), store the full `selectedCardInstance` and its `selectedCardDef`.
    - Based on `selectedCardDef?.targetType`, determine if a target is needed and what kind. Store this requirement state (e.g., `targetingState: 'NONE' | 'NEED_TERRITORY' | 'NEED_ENTITY'`).
2.  Modify `client/src/pixi/OverworldRenderer.ts`:
    - Add a method `highlightValidTargets(targetType: 'TERRITORY' | 'ENTITY' | null)`:
        - If `targetType` is 'TERRITORY', add a distinct visual state (e.g., glowing border) to all territory graphics. Reset visuals if `targetType` is null or different.
        - If `targetType` is 'ENTITY', do the same for entity sprites (when implemented).
        - Reset non-target elements to default visuals.
3.  Modify `client/src/components/PixiCanvas.tsx`:
    - Use a `useEffect` hook that depends on the `targetingState` from `App.tsx`.
    - Call `overworldRenderer.highlightValidTargets(mapTargetingStateToType(targetingState))` inside the effect.
4.  Modify `client/src/App.tsx`:
    - Update `handleTerritorySelect`: Only process the territory selection as a *target* if `targetingState` indicates a territory is needed. If a territory is selected as a target, proceed with the `PLAY_CARD` logic (effect from Prompt 41).
    - Update `handleCardClick`: Reset `targetingState` and clear target highlights if a card is clicked while targeting is active (i.e., deselecting target). Set `targetingState` based on the newly selected card.
    - Modify the `useEffect` that sends `PLAY_CARD` (Prompt 41): It should now trigger based on having both `selectedCardInstance` and a *valid* `selectedTargetId` confirmed via the interaction flow driven by `targetingState`.
5.  Run server and client. Select a card that requires a territory target. Verify territories highlight. Clicking a highlighted territory should trigger the `PLAY_CARD` message. Clicking empty space or another card should cancel targeting. Selecting a non-targeted card should not highlight territories.

Provide the state management additions (`targetingState`) and refined handler logic (`handleCardClick`, `handleTerritorySelect`, `PLAY_CARD` useEffect) in `client/src/App.tsx`, the new method in `client/src/pixi/OverworldRenderer.ts`, and its integration in `client/src/components/PixiCanvas.tsx`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

(Token limit likely approaching soon). The next steps would focus on broadcasting and handling more specific results from card effects (like damage dealt, stats modified, etc.) which requires defining those states and corresponding message types.

46.9s

edit

more_vert

oh, sorry -- i meant that your output tokens on any given single message may be limited, but your context window is arbitrarily large. You can just go until it cuts off your output and i'll give you a continue message once that happens, no need to anticipate the breakpoint.

edit

more_vert

Understood! I'll continue generating prompts without worrying about the output token limit until it actually cuts me off.

---

```
Prompt 66: Server - Implement More Specific Card Effects

Objective: Implement the logic for additional, more concrete card effects within the `effectService`. Builds on Prompt 63. Add tests.

Requirements:
1.  Modify `server/src/services/effectService.ts`.
2.  Implement the `executeDrawCard` function (previously placeholder):
    - Import the `drawCards` function (from Prompt 56, may need to export it from `server.ts` or move it to a shared service like `gameService`).
    - Get the `count` from the `effectData` (e.g., `effectData.count ?? 1`).
    - Call `await drawCards(context.player, context.game.gameId, count);` (make `executeDrawCard` async).
    - Return `true`.
3.  Implement `executeDealDamage` function (previously placeholder):
    - **(Requires Entity System - Placeholder):**
    - Check if `context.targetId` exists.
    - Get `damageAmount` from `effectData`.
    - Log: `console.log(`Effect: Dealing ${damageAmount} damage to target ${context.targetId} (Not implemented yet)`);`.
    - Return `true` for now.
4.  Implement a new effect, e.g., `GAIN_RESOURCES`:
    - Register `'GAIN_RESOURCES'` with `executeGainResources`.
    - Create `executeGainResources(context, effectData)`:
        - Get resource type (e.g., `effectData.resource = 'credits'`) and `amount` from `effectData`.
        - Validate amount.
        - Update `context.player.resources[effectData.resource] += effectData.amount;`. Handle invalid resource types.
        - Log the gain.
        - Return `true`.
        - **(Action):** Trigger `PLAYER_RESOURCE_UPDATE` broadcast (Prompt 67).
5.  Modify `server/src/data/cards.json`: Add cards that use the 'DRAW_CARD' and 'GAIN_RESOURCES' effects with appropriate `effectDefinition` structures (e.g., `{"effect": "DRAW_CARD", "count": 2}`, `{"effect": "GAIN_RESOURCES", "resource": "credits", "amount": 3}`).
6.  Update tests (`tests/effectService.test.ts`):
    - Add tests for `executeDrawCard` (mocking the actual `drawCards` function).
    - Add tests for `executeGainResources` correctly modifying player resources. Check return value. Test invalid resource types.
    - Ensure tests for `executeEffect` (the main entry point) correctly route to these new executors.

Provide the updated `server/src/services/effectService.ts` (implementing draw/gain, placeholder damage), an example update to `server/src/data/cards.json`, and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 67: Server - Broadcast Updates for New Effects

Objective: Ensure appropriate state update messages are broadcast after new effect types (like resource gain) are executed. Builds on Prompts 45, 50, 66.

Requirements:
1.  Modify `server/src/services/effectService.ts`.
    - Import `broadcastToGame` helper function and relevant message types (`PlayerResourceUpdateMessage`, etc.).
    - Modify effect executors that change broadcastable state:
        - In `executeGainResources`, *after* successfully updating `player.resources`:
            - Construct `PlayerResourceUpdateMessage`.
            - Call `broadcastToGame(context.game.gameId, resourceUpdateMessage);`.
        - **(Self-correction):** The `drawCards` function (Prompt 56) should already handle broadcasting hand/deck updates internally. No extra broadcast needed in `executeDrawCard`.
        - When `executeDealDamage` is fully implemented, it would trigger broadcasts related to entity health changes.
2.  Modify `server/src/server.ts`: Ensure `broadcastToGame` is exported or accessible to `effectService`. May require moving `broadcastToGame` to a shared `networkService` or `gameService`. **Decision:** For now, pass `broadcastToGame` function into the `EffectContext` or directly into `executeEffect`. Let's modify `EffectContext`.
3.  Modify `server/src/types/game.ts`: Add `broadcast: (message: ServerToClientMessage<any>, senderClientId?: string) => void` to `EffectContext`.
4.  Modify `server/src/server.ts`: When creating `effectContext` in the `PLAY_CARD` handler, provide the broadcast function:
    - `const boundBroadcast = (message: ServerToClientMessage<any>, senderId?: string) => broadcastToGame(gameId, message, senderId);`
    - `const effectContext: EffectContext = { ..., broadcast: boundBroadcast };`
5.  Update tests (`tests/effectService.test.ts`):
    - Mock the `broadcast` function passed in the `EffectContext`.
    - Verify `executeGainResources` calls the mocked `broadcast` function with the correct `PLAYER_RESOURCE_UPDATE` message.
    - Ensure other effect tests still pass.

Provide the updated `EffectContext` type definition (`game.ts`), the modified `executeGainResources` (`effectService.ts`), the `effectContext` creation in `PLAY_CARD` handler (`server.ts`), and relevant test updates.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 68: Client - Handle Updates from New Effects

Objective: Process server messages resulting from new card effects (resource gain, draw confirmation) and update the UI. Builds on Prompts 46, 50, 57, 67.

Requirements:
1.  This prompt mostly involves verifying existing client handlers work correctly with the broadcasts triggered by new server-side effects.
2.  Ensure `handleMessage` in `src/App.tsx` correctly processes:
    - `PLAYER_RESOURCE_UPDATE`: Updates resource display (Prompt 50 logic should handle gains).
    - `PLAYER_HAND_UPDATE`: Updates hand UI (Prompt 46 logic handles draws triggered by `drawCards`).
    - `PLAYER_DECK_UPDATE`: Updates deck count display (Prompt 57 logic handles draws).
    - `PLAYER_DISCARD_UPDATE`: Updates discard display (Prompt 46/57 logic handles reshuffles).
3.  Run server and client. Use cards defined in Prompt 66 (Gain Resources, Draw Card):
    - Play "Gain Resources" card: Verify credits display increases immediately.
    - Play "Draw Card" card: Verify hand UI updates with new card(s) and deck count decreases.
    - Test drawing last card / reshuffle if possible.

No new code generation needed if previous handlers are correct. This is a verification step. If handlers need adjustment (e.g., resource update only handled the current player), provide the necessary updates to `handleMessage` in `client/src/App.tsx`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

**Phase 8: Persistence & Refinement**

````
Prompt 69: Server - Basic Game State Persistence Strategy

Objective: Define the strategy and implement basic functions for saving/loading game state snapshots to PostgreSQL using Prisma. Builds on Prompts 25, 51.

Requirements:
1.  **Strategy:** Periodically snapshot the entire `GameState` object (from the `activeGames` map) and store it as JSON in a dedicated table. Load it back on server restart or when a player reconnects to a persisted game.
2.  Modify `server/prisma/schema.prisma`:
    - Add a new model:
      ```prisma
      model PersistedGame {
        gameId     String   @id // Corresponds to GameState.gameId
        gameState  Json     // Store the serialized GameState
        lastSavedAt DateTime @updatedAt
      }
      ```
    - Run `npx prisma migrate dev --name add_persisted_game` and `npx prisma generate`.
3.  Create a new service file, e.g., `server/src/services/persistenceService.ts`.
    - Import Prisma client, `GameState`.
    - Implement `saveGameState(game: GameState): Promise<void>`:
        - Serialize the `GameState`. **Challenge:** `Map` objects don't serialize directly to JSON. Convert `game.players` and `game.territories` Maps to serializable structures (e.g., arrays of key-value pairs or plain objects) before stringifying.
        - `const serializableState = { ...game, players: Array.from(game.players.entries()), territories: Array.from(game.territories.entries()) };`
        - Use `prisma.persistedGame.upsert()`:
            - `where: { gameId: game.gameId }`
            - `create: { gameId: game.gameId, gameState: JSON.stringify(serializableState) }` // Use JSON type if Prisma supports it well, else store as String
            - `update: { gameState: JSON.stringify(serializableState) }`
        - Add error handling. Log success/failure.
    - Implement `loadGameState(gameId: string): Promise<GameState | null>`:
        - Use `prisma.persistedGame.findUnique({ where: { gameId } })`.
        - If found, parse the `gameState` JSON string.
        - **Challenge:** Rehydrate the state. Convert the arrays for players/territories back into `Map` objects.
        - `const loadedData = JSON.parse(persisted.gameState as string);`
        - `const rehydratedState: GameState = { ...loadedData, players: new Map(loadedData.players), territories: new Map(loadedData.territories) };`
        - Return the rehydrated `GameState`. Handle parsing errors.
        - Return `null` if not found.
    - Implement `deleteGameState(gameId: string): Promise<void>`: Use `prisma.persistedGame.delete({ where: { gameId } })`.
4.  Create integration tests (`tests/persistenceService.integration.test.ts`):
    - Requires test DB setup (like Prompt 25).
    - Test `saveGameState`: Save a complex mock `GameState` (with players, territories, cards), then use Prisma directly or `loadGameState` to verify the saved JSON structure is correct. Check that maps were serialized.
    - Test `loadGameState`: Save a known state, call `loadGameState`, verify the returned object is a valid `GameState` with Maps correctly rehydrated.
    - Test loading a non-existent game returns `null`.
    - Test `deleteGameState`.

Provide the Prisma schema addition, the content for `server/src/services/persistenceService.ts`, and the integration tests `server/tests/persistenceService.integration.test.ts`.
````

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 70: Server - Integrate Periodic Saving & Loading

Objective: Call the persistence service to save game state periodically and load existing states on server startup. Builds on Prompts 11, 69.

Requirements:
1.  Modify `server/src/server.ts`.
    - Import `saveGameState`, `loadGameState`, `activeGames`.
2.  **Periodic Saving:**
    - Implement a simple interval timer after the server starts:
        - `const SAVE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes`
        - `setInterval(async () => { console.log('Periodic save starting...'); for (const game of activeGames.values()) { try { await saveGameState(game); } catch (error) { console.error(`Failed to save game ${game.gameId}:`, error); } } console.log('Periodic save finished.'); }, SAVE_INTERVAL_MS);`
3.  **Loading on Startup:**
    - Add an async function `loadAllGames()` to be called *before* the server starts accepting connections.
    - Use `prisma.persistedGame.findMany()` to get all saved games.
    - For each `persistedGame`, attempt to parse and rehydrate using the logic similar to `loadGameState` (consider moving rehydration logic to a shared utility).
    - Populate the `activeGames` map with the loaded and rehydrated games.
    - Log success/failure for each loaded game. Handle potential errors gracefully.
    - Call `await loadAllGames()` before `server.listen()` or `wss.listen()`.
4.  **(Refinement):** The `getOrCreateGame` function (Prompt 11) should now prioritize checking `activeGames` (which might contain loaded games) before trying to create a new one. The current logic already does this.
5.  **(Consideration):** How are players reconnected to loaded games? The current logic assigns players to `LOBBY_GAME_ID`. A proper lobby/game joining system is needed later. For now, loading games primarily serves crash recovery. Disconnected players in loaded games should retain their `'disconnected'` status.
6.  Testing this is complex. Unit tests can mock `setInterval` and DB calls. Manual testing involves: starting server, connecting clients, stopping server (simulating crash), restarting server, checking logs for loaded games, possibly inspecting `activeGames` map via debug endpoint if added.

Provide the periodic saving interval logic, the `loadAllGames` function, and their integration points in `server/src/server.ts`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 71: Server - Saving on Graceful Shutdown

Objective: Ensure game state is saved when the server shuts down cleanly. Builds on Prompt 69.

Requirements:
1.  Modify `server/src/server.ts`.
    - Import `saveGameState`, `activeGames`.
    - Implement signal handling for graceful shutdown (SIGINT, SIGTERM).
    - `process.on('SIGINT', async () => { await shutdown('SIGINT'); });`
    - `process.on('SIGTERM', async () => { await shutdown('SIGTERM'); });`
    - Create an `async function shutdown(signal: string)`:
        - Log `Received ${signal}. Saving games before shutdown...`.
        - Set a flag `isShuttingDown = true;` to prevent new connections/actions.
        - Stop the periodic save interval timer (`clearInterval`).
        - Iterate through `activeGames` and call `await saveGameState(game)` for each. Use `Promise.allSettled` for concurrent saving with error handling.
        - Log completion: "All games saved."
        - Close the WebSocket server (`wss.close()`).
        - Close the HTTP server (`httpServer.close()`).
        - Close the Prisma client connection (`await prisma.$disconnect();`).
        - `process.exit(0);`
    - Need to handle the HTTP server reference correctly if using Express.
2.  Manual Testing: Run server, connect clients, send SIGINT (Ctrl+C). Check logs to verify saving occurs before shutdown. Restart server and check if state was persisted.

Provide the signal handling and `shutdown` function logic for `server/src/server.ts`.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

This covers the basic persistence layer. The next major block would likely be implementing the Scenario gameplay in more detail (entities, tactical grid, resolution based on objectives) or adding more Overworld features (Installations, detailed Faction mechanics). AI would follow after Scenario mechanics are more solid. Let's assume we want to flesh out the Scenario next.

---

**Phase 9: Detailed Scenario Implementation**

````
Prompt 72: Server - Define Scenario Grid & Entity Structures

Objective: Define more detailed data structures for the tactical grid and entities within the Scenario state. Builds on Prompts 27, 66.

Requirements:
1.  Modify `server/src/types/game.ts`:
    - Define `TacticalGridCell`: `interface TacticalGridCell { x: number; y: number; type: 'FLOOR' | 'WALL' | 'OBSTACLE'; // Add terrain properties later }`
    - Define `ScenarioEntity`:
      ```typescript
      interface ScenarioEntity {
        entityId: string; // Unique within scenario
        ownerPlayerId: string; // Which player controls it (or 'AI')
        definitionId: string; // Link to CardDefinition (for ICE/Programs) or Faction Unit Definition
        type: 'RUNNER' | 'ICE' | 'PROGRAM' | 'OBSTACLE_ENTITY'; // etc.
        x: number;
        y: number;
        stats: {
          hp: number;
          maxHp: number;
          attack?: number;
          defense?: number;
          movePoints: number;
          maxMovePoints: number;
          // other stats
        };
        // statusEffects: StatusEffect[]; // Later
      }
      ```
    - Update the `ScenarioState` interface (Prompt 27):
        - Replace simple `objective` string with structured type if needed.
        - Add `grid: TacticalGridCell[][];` (or a Map representation).
        - Add `entities: Map<string, ScenarioEntity>; // Keyed by entityId`.
        - Add `scenarioTurn: number;`.
        - Add `currentScenarioPlayerId: string | null;` (Who has initiative within the scenario).
        - Store `triggeringTerritoryId: string;` (Needed for outcome application).
2.  No code execution changes yet, just type definitions. Update associated types in client `game.ts`.

Provide the updated content for `server/src/types/game.ts` defining these structures. Remind to update client types.
````

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 73: Server - Scenario Initialization Logic (Grid & Entities)

Objective: Implement logic to generate the grid and place initial entities when a scenario starts. Builds on Prompts 27, 72. Add tests.

Requirements:
1.  Create a new service file `server/src/services/scenarioService.ts`.
    - Import relevant types (`GameState`, `ScenarioState`, `ScenarioEntity`, `TacticalGridCell`, etc.). Import `uuidv4`.
    - Create `initializeScenario(game: GameState, triggeringTerritoryId: string): ScenarioState`:
        - **(Grid Generation - Basic):** Create a simple fixed-size grid (e.g., 10x10). Initialize all cells as 'FLOOR'. Add some 'WALL' boundaries. Maybe place a few random 'OBSTACLE' cells.
        - **(Entity Placement - Basic):**
            - Determine participants (e.g., assume first player is Runner, second is Corp/AI for now).
            - Create the Runner entity: `const runnerEntity: ScenarioEntity = { ... fill stats, position (e.g., x:1, y:1) ... };`. Assign `ownerPlayerId` correctly.
            - Create basic ICE entity(ies) for Corp/AI: `const iceEntity: ScenarioEntity = { ... fill stats, position (e.g., x:8, y:8) ... };`. Assign `ownerPlayerId` correctly (or 'AI').
            - Add entities to an `entities` Map.
        - Determine starting player for the scenario: `currentScenarioPlayerId = runnerPlayerId;`.
        - Set initial `scenarioTurn = 1`.
        - Return the fully initialized `ScenarioState` object (including `scenarioId`, `type`, `objective`, `status: 'ACTIVE'`, `grid`, `entities`, `scenarioTurn`, `currentScenarioPlayerId`, `triggeringTerritoryId`).
2.  Modify `server/src/server.ts`:
    - Import `initializeScenario`.
    - In the `START_SCENARIO` message handler, instead of creating a basic placeholder `ScenarioState`, call `initializeScenario`:
        - `const newScenario = initializeScenario(game, payload.territoryId);`
        - `game.currentScenario = newScenario;`
        - Ensure the subsequent `PHASE_CHANGE` broadcast includes this detailed `newScenario` state.
3.  Update tests (`tests/serverMessages.test.ts`, potentially new `tests/scenarioService.test.ts`).
4.  Add Jest tests for `initializeScenario`:
    - Verify the returned `ScenarioState` has the correct structure (grid dimensions, entities map).
    - Verify runner and ICE entities are created with basic stats and placed on the grid.
    - Verify turn/player/status are initialized correctly.
    - Update `START_SCENARIO` message tests to check the broadcast payload includes the detailed scenario state.

Provide the content for `server/src/services/scenarioService.ts` (the `initializeScenario` function), the modification to the `START_SCENARIO` handler in `server/src/server.ts`, and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

(Continuing with scenario mechanics).

49.1s

edit

more_vert

continue

more_vert

Thoughts

\*The thoughts produced by the model are experimental

experiment

Expand to view model thoughts

5.2s

edit

more_vert

Okay, let's continue fleshing out the Scenario implementation.

---

```
Prompt 74: Client - Render Scenario Grid and Entities

Objective: Display the tactical grid and entities when the client enters the Scenario phase. Builds on Prompts 29, 72, 73.

Requirements:
1.  Ensure client types (`game.ts`) are updated with detailed `ScenarioState`, `TacticalGridCell`, `ScenarioEntity`.
2.  Create a dedicated PixiJS renderer for scenarios, e.g., `src/pixi/ScenarioRenderer.ts`.
    - Needs methods: `initialize(app: PIXI.Application)`, `renderScenario(scenarioState: ScenarioState)`, `updateEntity(entity: ScenarioEntity)`.
    - `renderScenario`:
        - Clear previous scenario graphics.
        - Render the grid based on `scenarioState.grid`. Use different colors/textures for 'FLOOR', 'WALL', 'OBSTACLE'. Store cell graphics if needed for interaction.
        - Render entities based on `scenarioState.entities`. Create sprites (`PIXI.Sprite`) for different entity types (Runner, ICE). Position them according to their `x`, `y`. Store entity sprites in a `Map<string, PIXI.Sprite>` keyed by `entityId`. Add simple text labels or health bars (placeholders).
        - Add sprites/graphics to appropriate layers in the PixiJS stage.
    - `updateEntity`: Find the entity's sprite by `entityId` and update its position (`sprite.x`, `sprite.y`) or other visuals (e.g., health bar).
3.  Modify `src/components/PixiCanvas.tsx`:
    - Instantiate both `OverworldRenderer` and `ScenarioRenderer`.
    - In the initial `useEffect`, initialize both renderers with the `app`.
    - Add a prop to `PixiCanvas` indicating the current phase (`phase: GamePhase`).
    - Add another `useEffect` that depends on the `phase` and relevant state (`gameState.currentScenario` or `gameState.territories`).
        - If `phase === 'OVERWORLD'`, call `overworldRenderer.renderTerritories(...)` and potentially hide/clear scenario elements.
        - If `phase === 'SCENARIO'` and `scenarioState` exists, call `scenarioRenderer.renderScenario(scenarioState)` and potentially hide/clear overworld elements.
4.  Modify `src/App.tsx`:
    - Pass the current `gameState.phase` and the relevant state (`currentScenario` or `territories` map) down to `PixiCanvas`. (The conditional rendering between `PixiCanvas` and `ScenarioView` from Prompt 29 might be removed if `PixiCanvas` now handles both views). **Decision:** Let's keep `PixiCanvas` as the single rendering component and remove `ScenarioView`. The React UI overlays (HUD, cards) will change based on phase.
5.  Run server and client. Trigger a scenario. Verify the client view clears the Overworld map and renders the tactical grid with the initial Runner and ICE entities.

Provide the content for `client/src/pixi/ScenarioRenderer.ts`, the updated `client/src/components/PixiCanvas.tsx` handling both renderers based on phase, and the necessary changes in `client/src/App.tsx` to manage state and remove the old `ScenarioView` component.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 75: Server - Implement Scenario Turn Advancement

Objective: Add logic to advance turns *within* a scenario, separate from the Overworld turn. Builds on Prompts 52, 72, 73. Add tests.

Requirements:
1.  Modify `server/src/types/protocol.ts`:
    - **(Decision):** Reuse `END_TURN` message or create `END_SCENARIO_TURN`? Let's reuse `END_TURN` for simplicity, but the handler logic will depend on the game phase.
2.  Modify `server/src/server.ts`:
    - Create a function `advanceScenarioTurn(game: GameState)`:
        - Check if `game.phase === 'SCENARIO'` and `game.currentScenario` exists. If not, return.
        - Get the list of participants involved in the scenario (e.g., based on `ownerPlayerId` of entities, need a robust way to determine this). For now, assume the two players in the game are the participants.
        - Find the index of `game.currentScenario.currentScenarioPlayerId` among participants.
        - Calculate the next participant's index/ID similar to `advanceTurn` (Prompt 52).
        - Update scenario state:
            - `game.currentScenario.currentScenarioPlayerId = nextScenarioPlayerId;`
            - If wrapped around, increment `game.currentScenario.scenarioTurn`.
        - Log the scenario turn advance.
        - **(Future):** Reset entity move points/action points. Trigger start-of-scenario-turn effects.
        - **(Action):** Broadcast scenario turn change (Prompt 76).
        - **(Check Objective/End Condition):** Call a function `checkScenarioEndCondition(game)` here (Prompt 77).
    - Modify the `END_TURN` message handler (`case MessageType.END_TURN:` from Prompt 52):
        - Check `game.phase`.
        - If `'OVERWORLD'`, call `advanceTurn(game);`.
        - If `'SCENARIO'`, call `advanceScenarioTurn(game);`.
        - If other phase, handle appropriately (e.g., error).
        - Ensure the validation `clientId === game.currentPlayerId` (Overworld) or `clientId === game.currentScenario.currentScenarioPlayerId` (Scenario) is correctly applied based on the phase.
3.  Update tests (`serverMessages.test.ts`, `serverGameState.test.ts`).
4.  Add Jest tests for `advanceScenarioTurn`:
    - Test it correctly updates `currentScenarioPlayerId`.
    - Test it increments `scenarioTurn` when wrapping.
    - Test scenario turn validation in the `END_TURN` handler (correct player, correct phase).

Provide the `advanceScenarioTurn` function, the modifications to the `END_TURN` message handler in `server/src/server.ts`, and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 76: Server/Client - Broadcast and Handle Scenario Turn Changes

Objective: Notify clients about scenario turn changes and update UI. Builds on Prompts 53, 75.

Requirements:
1.  **Server:** Modify `server/src/types/protocol.ts`:
    - Add `SCENARIO_TURN_CHANGE = 'SCENARIO_TURN_CHANGE'` to `MessageType`.
    - Define `ScenarioTurnChangeMessage extends ServerToClientMessage<{ currentScenarioPlayerId: string | null; scenarioTurn: number; }> {}`.
2.  **Server:** Modify `server/src/server.ts`:
    - Import `ScenarioTurnChangeMessage`, `MessageType`.
    - In the `advanceScenarioTurn` function, *after* updating the state:
        - Construct `ScenarioTurnChangeMessage` with `game.currentScenario.currentScenarioPlayerId` and `game.currentScenario.scenarioTurn`.
        - Call `broadcastToGame(game.gameId, scenarioTurnMessage);`.
    - **(Self-correction):** Also need to broadcast the *initial* scenario turn player when the scenario starts. In `initializeScenario` (Prompt 73) or immediately after calling it in `START_SCENARIO` handler, broadcast the initial `SCENARIO_TURN_CHANGE`.
3.  **Client:** Ensure client types (`protocol.ts`, `game.ts`) are updated.
4.  **Client:** Modify `handleMessage` in `src/App.tsx`:
    - Add `case MessageType.SCENARIO_TURN_CHANGE:`.
    - Update local `gameState.currentScenario` immutably with the new `currentScenarioPlayerId` and `scenarioTurn` from the payload.
5.  **Client:** Modify UI (`App.tsx` or Scenario HUD component):
    - When in `SCENARIO` phase, display the scenario turn number: `Scenario Turn: {gameState?.currentScenario?.scenarioTurn ?? 0}`.
    - Indicate the current scenario player: `Scenario Player: {gameState?.currentScenario?.currentScenarioPlayerId ?? 'None'}`.
    - Determine if it's the client's turn within the scenario: `const isMyScenarioTurn = gameState?.currentScenario?.currentScenarioPlayerId === myClientId;`.
    - Modify the "End Turn" button (from Prompt 53): Ensure its `onClick` handler sends `END_TURN`, and its enabled/disabled state depends on `isMyTurn` (Overworld) OR `isMyScenarioTurn` (Scenario) based on the current `gameState.phase`.
6.  Update server tests to verify `SCENARIO_TURN_CHANGE` broadcast.
7.  Run server and clients in a scenario. Verify scenario turn indicator updates, and the "End Turn" button enables/disables correctly for the scenario player.

Provide the relevant type additions (`protocol.ts`), server broadcast logic (`server.ts`), client message handling and UI logic (`App.tsx`), and test updates.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 77: Server - Check Scenario End Condition

Objective: Add basic logic check within scenario turn advancement to see if objectives are met or failure conditions occurred. Builds on Prompt 75.

Requirements:
1.  Modify `server/src/server.ts`.
2.  Create a function `checkScenarioEndCondition(game: GameState): void`:
    - Check if `game.phase !== 'SCENARIO'` or `!game.currentScenario`, return if so.
    - Implement placeholder win/loss logic based on the simple objective from Prompt 27/73 (e.g., "Survive 3 turns").
    - `if (game.currentScenario.scenarioTurn > 3) { resolveScenario(game, 'SUCCESS'); // Call function from Prompt 32 return; // Important to stop further turn processing }`
    - **(Future):** Add checks based on entity health (e.g., Runner HP <= 0 -> FAILURE), objective completion flags, etc.
3.  Modify the `advanceScenarioTurn` function: Call `checkScenarioEndCondition(game)` *after* potentially incrementing the turn number but *before* broadcasting the turn change (or maybe after? Decision: Call it *before* broadcasting the turn change, so if the game ends, we broadcast the final resolution messages instead of another turn). If `resolveScenario` is called, it handles broadcasting the phase change back to Overworld, so `advanceScenarioTurn` should potentially return early.
    - Revised flow in `advanceScenarioTurn`: Update turn/player -> Call `checkScenarioEndCondition`. If game phase changed back to OVERWORLD (because `resolveScenario` was called), return early. Otherwise -> Broadcast `SCENARIO_TURN_CHANGE`.
4.  Update tests (`serverGameState.test.ts`). Add tests for `checkScenarioEndCondition`:
    - Test condition not met: phase remains SCENARIO.
    - Test condition met (e.g., turn > 3): `resolveScenario` is called (mock it) and phase changes back to OVERWORLD.
    - Update `advanceScenarioTurn` tests to account for the early return if the scenario ends.

Provide the `checkScenarioEndCondition` function, its integration into `advanceScenarioTurn` in `server/src/server.ts`, and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 78: Client - Scenario Movement Interaction (Grid Click)

Objective: Allow the player to click tactical grid cells, potentially initiating a move action. Builds on Prompts 74, 76.

Requirements:
1.  Modify `client/src/pixi/ScenarioRenderer.ts`:
    - When rendering grid cells (`TacticalGridCell`) in `renderScenario`:
        - Make floor/walkable cell graphics interactive (`interactive = true`, `buttonMode = true`).
        - Store cell coordinates (`x`, `y`) on the graphic object.
        - Add a `pointerdown` listener to each interactive cell graphic.
    - Add a callback property `onCellClick?: (x: number, y: number) => void;`.
    - In the `pointerdown` listener, call the callback with the cell's coordinates.
2.  Modify `client/src/components/PixiCanvas.tsx`:
    - Accept a prop `onScenarioCellClick?: (x: number, y: number) => void`.
    - Pass this prop to the `ScenarioRenderer` instance.
3.  Modify `client/src/App.tsx`:
    - Add state to track the currently selected *own* entity: `const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);`. (Need interaction to select entities first - add later or assume one entity selected for now). **Decision:** Assume the player controls one entity (Runner) and it's implicitly selected when it's their turn.
    - Define `handleScenarioCellClick(x: number, y: number)`:
        - Check if it's currently the player's scenario turn (`isMyScenarioTurn`) and if the phase is `SCENARIO`.
        - Find the implicitly selected entity ID (e.g., find entity where `ownerPlayerId === myClientId`).
        - If conditions met:
            - Construct `ScenarioActionMessage` for movement:
                - `const message: ScenarioActionMessage = { type: MessageType.SCENARIO_ACTION, payload: { actionType: 'MOVE', details: { entityId: myEntityId, targetX: x, targetY: y } } };`
            - Call `sendMessage(message)`.
            - Log the move attempt.
    - Pass `handleScenarioCellClick` as the `onScenarioCellClick` prop to `PixiCanvas`.
4.  Run server and client, enter scenario. Verify clicking on floor cells during the player's turn triggers a `SCENARIO_ACTION` message with 'MOVE' type and target coordinates.

Provide the updated `client/src/pixi/ScenarioRenderer.ts`, `client/src/components/PixiCanvas.tsx`, and `client/src/App.tsx` logic. Update `protocol.ts` for the 'MOVE' action payload details if not done in Prompt 30.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 79: Server - Handle Scenario 'MOVE' Action

Objective: Process the 'MOVE' scenario action, validate it (basic pathfinding/move points), and update entity position. Builds on Prompts 31, 72, 73, 78. Add tests.

Requirements:
1.  Modify `server/src/server.ts`. Import `ScenarioActionMessage`.
2.  In the `message` handler, within `case MessageType.SCENARIO_ACTION:`:
    - Check if `payload.actionType === 'MOVE'`.
    - Cast `payload.details` to the expected move structure (`{ entityId: string; targetX: number; targetY: number; }`). Validate properties exist.
    - **Validation:**
        - Verify `details.entityId` exists in `game.currentScenario.entities`. Get the `entity` object.
        - Verify the acting player owns the entity: `entity.ownerPlayerId === clientId`. If not, send error ("Cannot control this entity").
        - Verify target coordinates (`targetX`, `targetY`) are within grid bounds.
        - Verify target cell type is walkable (e.g., 'FLOOR') in `game.currentScenario.grid`. If not, send error ("Cannot move to target cell type").
        - **(Pathfinding/Move Points - Basic):** Calculate distance (e.g., Manhattan distance for now: `Math.abs(targetX - entity.x) + Math.abs(targetY - entity.y)`). Check if `distance <= entity.stats.movePoints`. If not, send error ("Not enough move points"). (Requires adding `movePoints` to `ScenarioEntity` stats).
        - **(Future):** Implement A* pathfinding. Check if path is blocked.
    - **State Update:**
        - If valid:
            - Subtract move cost: `entity.stats.movePoints -= distance;`.
            - Update entity position: `entity.x = details.targetX; entity.y = details.targetY;`.
            - Log the move.
            - **(Action):** Broadcast entity position update (Prompt 80).
3.  Modify `server/src/types/game.ts`: Add `movePoints: number; maxMovePoints: number;` to `ScenarioEntity.stats`. Initialize `maxMovePoints` (e.g., 5) and `movePoints` to `maxMovePoints` in `initializeScenario` (Prompt 73).
4.  Update tests (`serverMessages.test.ts`). Add tests for 'MOVE' action:
    - Test valid move updates entity position and reduces move points.
    - Test moving without enough move points returns an error.
    - Test moving to invalid coordinates/cell type returns an error.
    - Test moving an entity not owned by the player returns an error.

Provide the updated 'MOVE' action logic in `server/src/server.ts`, the updates to `server/src/types/game.ts` and `initializeScenario`, and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 80: Server/Client - Broadcast and Handle Entity Position Updates

Objective: Notify clients about entity movements within a scenario and update the client rendering. Builds on Prompts 74, 79.

Requirements:
1.  **Server:** Modify `server/src/types/protocol.ts`:
    - Add `SCENARIO_ENTITY_UPDATE = 'SCENARIO_ENTITY_UPDATE'` to `MessageType`.
    - Define `ScenarioEntityUpdateMessage extends ServerToClientMessage<{ entity: ScenarioEntity; // Send the whole updated entity state for now }> {}`. (Could optimize later to send only changed fields like position/hp).
2.  **Server:** Modify `server/src/server.ts`:
    - Import `ScenarioEntityUpdateMessage`, `MessageType`.
    - In the `SCENARIO_ACTION` handler, case 'MOVE', *after* successfully updating the entity's state (position, move points):
        - Construct the message: `const updateMessage: ScenarioEntityUpdateMessage = { type: MessageType.SCENARIO_ENTITY_UPDATE, payload: { entity: entity } };` (where `entity` is the updated entity object).
        - Call `broadcastToGame(gameId, updateMessage);`.
3.  **Client:** Ensure client types (`protocol.ts`, `game.ts`) are updated.
4.  **Client:** Modify `handleMessage` in `src/App.tsx`:
    - Add `case MessageType.SCENARIO_ENTITY_UPDATE:`.
    - Cast message payload.
    - Update the local `gameState.currentScenario.entities` map immutably with the updated `entity` data from the payload.
        - `setGameState(prevState => { /* ... immutable update for specific entity in scenario.entities map ... */ });`
5.  **Client:** Modify `client/src/pixi/ScenarioRenderer.ts`:
    - The `updateEntity` method should already exist (Prompt 74). Ensure it correctly updates the sprite's `x` and `y` position based on the grid coordinates from the updated `entity` data. (May need conversion from grid coords to pixel coords).
6.  **Client:** Modify `client/src/components/PixiCanvas.tsx`:
    - Add a `useEffect` hook that depends on `gameState.currentScenario.entities`.
    - Inside the effect, iterate through the entities. If an entity's state has changed compared to the last render (requires tracking previous state or checking if the object reference changed due to immutable updates), call `scenarioRenderer.updateEntity(entity)`. **Optimization:** Alternatively, the `handleMessage` could directly trigger a re-render or call a specific update function if the renderer instance is accessible. Let's stick with the effect for now.
7.  Update server tests to verify `SCENARIO_ENTITY_UPDATE` is broadcast after a valid move.
8.  Run server and client in scenario. Perform a valid move action. Verify the entity sprite moves smoothly to the new position on the grid for all connected clients.

Provide the relevant type additions (`protocol.ts`), server broadcast logic (`server.ts`), client message handling (`App.tsx`), renderer update logic (`ScenarioRenderer.ts`, `PixiCanvas.tsx`), and test updates.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

This establishes the basic movement loop within the scenario. The next steps would involve implementing other scenario actions (like attacks), handling health/damage, refining entity selection, and potentially implementing the AI's turn logic.

36.9s

edit

more_vert

continue

edit

more_vert

Okay, let's continue with implementing basic attacks and health in the scenario.

---

```
Prompt 81: Server - Add Health/Attack Stats and Damage Logic

Objective: Add HP and Attack stats to entities, implement basic damage calculation in the `effectService`. Builds on Prompts 66, 72. Add tests.

Requirements:
1.  Modify `server/src/types/game.ts`:
    - Ensure `ScenarioEntity.stats` includes `hp: number`, `maxHp: number`, and optional `attack: number`.
2.  Modify `server/src/services/scenarioService.ts` (`initializeScenario` function):
    - When creating entities (Runner, ICE), initialize `maxHp` (e.g., Runner: 10, ICE: 5) and set current `hp` to `maxHp`.
    - Initialize `attack` stat where applicable (e.g., ICE: 2, Runner might attack via programs later).
3.  Modify `server/src/services/effectService.ts`:
    - Implement the `executeDealDamage` function (previously placeholder, Prompt 66):
        - Make it `async`.
        - Check context: Ensure `context.game.phase === 'SCENARIO'`, `context.game.currentScenario` exists.
        - Validate target: Check if `context.targetId` (the entity being damaged) exists in `context.game.currentScenario.entities`. Get the `targetEntity`. If not found, return `false`.
        - Get damage amount: `const damageAmount = effectData.amount ?? 0;`. (Could also come from attacker's stats in context later).
        - Apply damage: `targetEntity.stats.hp -= damageAmount;`. Ensure HP doesn't go below 0.
        - Log the damage: `console.log(`Entity ${targetEntity.entityId} took ${damageAmount} damage. HP: ${targetEntity.stats.hp}/${targetEntity.stats.maxHp}`);`.
        - **(Check for Death):** If `targetEntity.stats.hp <= 0`, call a new function `handleEntityDeath(context.game, targetEntity);` (Prompt 83).
        - **(Action):** Broadcast entity update (including new HP) using the `broadcast` function from the context. Construct `SCENARIO_ENTITY_UPDATE` message.
        - Return `true`.
4.  Update tests (`tests/scenarioService.test.ts`, `tests/effectService.test.ts`):
    - Verify entities are initialized with HP/Attack stats.
    - Test `executeDealDamage`:
        - Test applying valid damage reduces target HP correctly.
        - Test HP doesn't go below 0.
        - Test dealing damage to non-existent target returns `false`.
        - Verify `SCENARIO_ENTITY_UPDATE` is broadcast with updated HP (mock broadcast).
        - Verify `handleEntityDeath` is called when HP <= 0 (mock `handleEntityDeath`).

Provide the updated type additions (`game.ts`), initialization logic (`scenarioService.ts`), the implemented `executeDealDamage` function (`effectService.ts`), and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 82: Server - Implement Basic 'ATTACK' Scenario Action

Objective: Allow entities to perform an 'ATTACK' action targeting another entity, triggering the 'DEAL_DAMAGE' effect. Builds on Prompts 79, 81. Add tests.

Requirements:
1.  Modify `server/src/types/protocol.ts`: Update `ScenarioActionMessage` payload possibilities to include attack details: `AttackActionPayload { attackerEntityId: string; targetEntityId: string; }`.
2.  Modify `server/src/server.ts`:
    - Import `executeEffect` from `effectService`.
    - In the `message` handler, within `case MessageType.SCENARIO_ACTION:`, add logic for `payload.actionType === 'ATTACK'`:
        - Cast `payload.details` to `AttackActionPayload`. Validate properties exist.
        - **Validation:**
            - Verify `attackerEntityId` and `targetEntityId` exist in `game.currentScenario.entities`. Get both `attackerEntity` and `targetEntity`.
            - Verify player owns the attacker: `attackerEntity.ownerPlayerId === clientId`.
            - **(Range Check - Basic):** Calculate distance between attacker and target (e.g., Manhattan). Define attack range (e.g., `const ATTACK_RANGE = 1;`). Check if `distance <= ATTACK_RANGE`. If not, send error ("Target out of range").
            - **(Action Point Check - Basic):** Assume attack costs 1 AP. Check if `attackerEntity` has action points (need to add `ap`, `maxAp` to `ScenarioEntity.stats`). If not, send error ("Not enough action points").
            - **(Future):** Line of sight checks.
        - **State Update:**
            - If valid:
                - Deduct action point: `attackerEntity.stats.ap -= 1;`.
                - Log the attack attempt.
                - Create the `EffectContext` for the damage effect: `{ game, player, /* No cardDef here? Source is entity */ targetId: details.targetEntityId, broadcast: boundBroadcast }`.
                - Create the `effectData` for damage: `{ effect: 'DEAL_DAMAGE', amount: attackerEntity.stats.attack ?? 1 }`. (Use attacker's stat).
                - Call `await executeEffect(effectContext, effectData);` (Modify `executeEffect` slightly if needed to handle non-card sources, or pass attacker stats in context). **Decision:** Let `effectService` handle resolving damage amount based on context (attacker stats vs effect value). Pass attacker entity in context.
                - **(Action):** Broadcast attacker's state update (AP change) via `SCENARIO_ENTITY_UPDATE`. Damage effect handles broadcasting target's update.
3.  Modify `server/src/types/game.ts`: Add `ap: number; maxAp: number;` to `ScenarioEntity.stats`. Add `attackerEntity?: ScenarioEntity` to `EffectContext`. Initialize AP in `initializeScenario`. Reset AP at start of scenario turn (Prompt 84).
4.  Modify `server/src/services/effectService.ts` (`executeDealDamage`): Use `context.attackerEntity?.stats.attack` if `effectData.amount` is not provided.
5.  Update tests (`serverMessages.test.ts`, `effectService.test.ts`):
    - Test valid 'ATTACK' action deducts AP, calls `executeEffect` with correct context/damage data.
    - Test attacking out of range returns error.
    - Test attacking without AP returns error.
    - Test attacking with entity not owned returns error.
    - Update `executeDealDamage` tests.

Provide updates for `protocol.ts`, `game.ts`, `server.ts` (ATTACK handler), `effectService.ts`, `scenarioService.ts` (AP init), and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 83: Server - Handle Entity Death

Objective: Implement logic to remove entities from the scenario when their HP reaches 0 or less. Builds on Prompt 81. Add tests.

Requirements:
1.  Modify `server/src/server.ts` or `server/src/services/scenarioService.ts`. **Decision:** Add to `scenarioService`.
    - Import `GameState`, `ScenarioEntity`. Import `broadcastToGame` or expect it via context/params.
    - Create function `handleEntityDeath(game: GameState, deadEntity: ScenarioEntity)`:
        - Check if scenario exists and entity is actually dead (`deadEntity.stats.hp <= 0`).
        - Log entity death: `console.log(`Entity ${deadEntity.entityId} (${deadEntity.definitionId}) destroyed.`);`.
        - Remove the entity from the state: `game.currentScenario!.entities.delete(deadEntity.entityId);`.
        - **(Action):** Broadcast entity removal (Prompt 85).
        - **(Check Objective/End Condition):** Call `checkScenarioEndCondition(game)` (Prompt 77) again, as entity death might trigger win/loss (e.g., Runner defeated -> FAILURE).
2.  Modify `server/src/services/effectService.ts`: Ensure `executeDealDamage` calls `handleEntityDeath(context.game, targetEntity)` correctly when HP drops <= 0.
3.  Create/Update tests (`tests/scenarioService.test.ts`, `tests/effectService.test.ts`).
4.  Add tests for `handleEntityDeath`:
    - Verify it removes the entity from the `entities` map in a mock game state.
    - Verify it calls `checkScenarioEndCondition` (mock it).
    - Verify it triggers the broadcast for entity removal (mock broadcast).
    - Update `executeDealDamage` tests to ensure `handleEntityDeath` is called correctly.

Provide the `handleEntityDeath` function (`scenarioService.ts`), its call within `executeDealDamage` (`effectService.ts`), and relevant tests.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 84: Server - Reset Turn-Based Stats (Move Points, Action Points)

Objective: Reset entity stats like move points and action points at the start of their turn within a scenario. Builds on Prompts 75, 82. Add tests.

Requirements:
1.  Modify `server/src/server.ts`.
2.  Modify the `advanceScenarioTurn` function (Prompt 75):
    - After determining the `nextPlayerId` and getting the `nextPlayer`, *before* broadcasting the turn change:
    - Iterate through all entities owned by the `nextPlayerId` (`entity.ownerPlayerId === nextPlayerId`) in `game.currentScenario.entities`.
    - For each entity:
        - Reset `entity.stats.movePoints = entity.stats.maxMovePoints;`.
        - Reset `entity.stats.ap = entity.stats.maxAp;`.
        - Log the reset for the entity.
        - **(Action):** Broadcast `SCENARIO_ENTITY_UPDATE` for each entity whose stats were reset. **Optimization:** Could bundle updates or create a specific "TURN_START_STATS_RESET" message listing affected entities and their new stats. Let's broadcast individual updates for now.
3.  Update tests (`serverGameState.test.ts` or `serverMessages.test.ts`):
4.  Add/modify tests for `advanceScenarioTurn`:
    - Verify that move points and AP are reset for entities owned by the player whose turn is starting.
    - Verify stats are *not* reset for entities owned by other players.
    - Verify `SCENARIO_ENTITY_UPDATE` messages are broadcast for the reset entities (mock broadcast).

Provide the updated `advanceScenarioTurn` function logic in `server/src/server.ts` and relevant test updates.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 85: Server/Client - Broadcast and Handle Entity Removal

Objective: Notify clients when an entity is removed (dies) and update the client rendering. Builds on Prompts 74, 83.

Requirements:
1.  **Server:** Modify `server/src/types/protocol.ts`:
    - Add `SCENARIO_ENTITY_REMOVE = 'SCENARIO_ENTITY_REMOVE'` to `MessageType`.
    - Define `ScenarioEntityRemoveMessage extends ServerToClientMessage<{ entityId: string; }> {}`.
2.  **Server:** Modify `server/src/services/scenarioService.ts`:
    - Import `ScenarioEntityRemoveMessage`, `MessageType`, `broadcastToGame`.
    - In the `handleEntityDeath` function, *after* removing the entity from the state map:
        - Construct the message: `const removeMessage: ScenarioEntityRemoveMessage = { type: MessageType.SCENARIO_ENTITY_REMOVE, payload: { entityId: deadEntity.entityId } };`.
        - Call `broadcastToGame(game.gameId, removeMessage);`.
3.  **Client:** Ensure client types (`protocol.ts`) are updated.
4.  **Client:** Modify `handleMessage` in `src/App.tsx`:
    - Add `case MessageType.SCENARIO_ENTITY_REMOVE:`.
    - Cast payload.
    - Update the local `gameState.currentScenario.entities` map immutably by *deleting* the entity with the matching `entityId`.
        - `setGameState(prevState => { /* ... immutable delete from scenario.entities map ... */ });`
5.  **Client:** Modify `client/src/pixi/ScenarioRenderer.ts`:
    - Add a method `removeEntity(entityId: string)`:
        - Find the sprite associated with `entityId` in the stored sprites map.
        - If found, remove it from the PixiJS stage (`sprite.destroy()` or `stage.removeChild(sprite)`).
        - Remove the entry from the sprites map.
6.  **Client:** Modify `client/src/components/PixiCanvas.tsx`:
    - The `useEffect` hook depending on `gameState.currentScenario.entities` (Prompt 80) needs to handle removals. When iterating, it should compare the current entities map keys with the previously rendered ones. If an entity ID is missing now, call `scenarioRenderer.removeEntity(missingEntityId)`. (This requires tracking previously rendered entity IDs). **Alternative:** The `handleMessage` could trigger the removal directly if the renderer instance is accessible. Let's refine the effect hook approach.
7.  Update server tests (`scenarioService.test.ts`) to verify `SCENARIO_ENTITY_REMOVE` is broadcast by `handleEntityDeath`.
8.  Run server and client. Trigger entity death (e.g., via repeated attacks). Verify the entity's sprite disappears from the grid on all clients.

Provide the relevant type additions (`protocol.ts`), server broadcast logic (`scenarioService.ts`), client message handling (`App.tsx`), renderer removal logic (`ScenarioRenderer.ts`, `PixiCanvas.tsx`), and test updates.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

```
Prompt 86: Client - Display Entity Stats (HP, AP, MP)

Objective: Show key entity stats like HP, Action Points, and Move Points in the client UI, updating when they change. Builds on Prompts 74, 80, 84.

Requirements:
1.  Modify `client/src/pixi/ScenarioRenderer.ts`:
    - When creating or updating entity sprites (`renderScenario`, `updateEntity`), add/update visual elements to show stats:
        - **HP Bar:** Create a simple bar (e.g., two `PIXI.Graphics` rectangles, one red background, one green foreground scaled by `hp/maxHp`) positioned above or below the sprite. Update the green bar's width in `updateEntity`.
        - **AP/MP Text:** Add `PIXI.Text` objects near the sprite displaying `AP: ${entity.stats.ap}/${entity.stats.maxAp}` and `MP: ${entity.stats.movePoints}/${entity.stats.maxMovePoints}`. Update the text content in `updateEntity`.
    - Ensure these stat displays are added to the same container as the entity sprite so they move together.
2.  Verify Client Updates: The existing `SCENARIO_ENTITY_UPDATE` message handler (Prompt 80) and the `useEffect` in `PixiCanvas` (Prompt 80/85) should already trigger `scenarioRenderer.updateEntity(entity)` when an entity's state (including stats like HP, AP, MP) changes due to server broadcasts. This prompt focuses on making the renderer *display* those stats.
3.  Run server and client in scenario. Verify:
    - Initial HP/AP/MP are displayed correctly.
    - When an entity moves, its MP display updates.
    - When an entity attacks, its AP display updates.
    - When an entity takes damage, its HP bar updates.
    - When a new turn starts, AP/MP displays reset for the active player's entities.

Provide the updated rendering logic within `client/src/pixi/ScenarioRenderer.ts` to display HP bars and AP/MP text.
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).Text

---

This completes the basic scenario loop including movement, simple attacks, health, death, and turn/stat resets. The core mechanics are roughed in. Next steps could involve more sophisticated AI, more diverse card effects, scenario objectives, or UI polish.
