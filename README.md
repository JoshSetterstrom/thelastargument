# The Last Argument

A timed, scenario-based game where the player must persuade, investigate, or instruct an AI before the clock and available turns run out.

**Play it:** [thelastargument.joshsetterstrom.ca](https://thelastargument.joshsetterstrom.ca)

## About the game

Each scenario gives the player a different objective, an AI opponent with its own personality and priorities, a limited set of evidence, and hidden facts that can be uncovered through careful questioning.

The AI evaluates each transmission, responds in character, and updates the game state. Strong arguments, relevant evidence, and useful discoveries can improve trust and reduce suspicion. Contradictions, threats, unsupported claims, and manipulation can make the situation worse.

### Current scenarios

- **Airlock Protocol** — Convince a station intelligence to grant access before your oxygen expires.
- **Murder Protocol** — Challenge a forensic AI's reconstruction, establish your innocence, and identify the real killer.
- **Cat Retrieval Protocol** — Teach a highly literal maintenance AI how to safely relocate a cat from a critical control console.

## Features

- Timed scenarios with limited turns
- AI opponents with distinct personalities and priorities
- Evidence selection and attachment system
- Hidden intelligence discovered through investigation
- Trust and suspicion assessment meters
- Multiple success, partial-success, and failure outcomes
- Restorable sessions within the same browser
- Scenario-specific music and terminal sound effects
- Responsive terminal-inspired interface
- Server-side validation, signed visitor sessions, and API rate limiting

## Tech stack

### Client

- React
- Vite
- Axios
- CSS Modules

### Server

- Node.js
- Express
- OpenAI Responses API
- Zod structured outputs
- Signed HTTP-only cookies
- Express Rate Limit

### Hosting

- Render web service
- Squarespace-managed DNS
- Custom domain with HTTPS

## Project structure

```text
.
├── client/                 React and Vite frontend
│   ├── src/
│   │   ├── assets/
│   │   └── components/
│   └── vite.config.js
├── server/                 Express API and game engine
│   └── src/
│       ├── middleware/
│       ├── routes/
│       ├── scenarios/
│       ├── serializers/
│       ├── services/
│       ├── stores/
│       └── utils/
└── render.yaml             Render deployment blueprint
```

## Local development

### Requirements

- Node.js
- npm
- An OpenAI API key

### Install dependencies

```bash
npm ci --prefix server
npm ci --prefix client
```

### Configure the server

Create `server/.env`:

```env
OPENAI_API_KEY=your_openai_api_key
COOKIE_SECRET=replace_with_a_long_random_secret
OPENAI_MODEL=gpt-5.6
PORT=3000
NODE_ENV=development
```

`OPENAI_MODEL` and `PORT` are optional. The server defaults to `gpt-5.6` and port `3000`.

### Start the development servers

Run the API:

```bash
npm run dev --prefix server
```

Run the client in a second terminal:

```bash
npm run dev --prefix client
```

The Vite development server proxies `/api` requests to `http://localhost:3000`.

## Production build

Build the client:

```bash
npm ci --prefix client --include=dev
npm run build --prefix client
```

Start the production server:

```bash
NODE_ENV=production npm start --prefix server
```

In production, Express serves the generated files from `client/dist` and exposes the API under `/api`.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes | Server-side OpenAI API key. Never expose this to the client. |
| `COOKIE_SECRET` | Production | Secret used to sign anonymous visitor cookies. |
| `OPENAI_MODEL` | No | Model used for turn evaluation. Defaults to `gpt-5.6`. |
| `PORT` | No | Express listening port. Defaults to `3000`. |
| `NODE_ENV` | No | Set to `production` when serving the built frontend. |

## Deployment

The repository includes a Render Blueprint in `render.yaml`. It installs both applications, builds the Vite client, starts the Express server, and configures `/api/health` as the health-check endpoint.

Production deployments are made from the `main` branch and served at:

[https://thelastargument.joshsetterstrom.ca](https://thelastargument.joshsetterstrom.ca)

## Architecture notes

- The server is authoritative for timers, turns, evidence use, discoveries, state changes, and outcomes.
- The browser stores only the active game ID in `sessionStorage`.
- Game ownership is tied to a signed anonymous visitor cookie.
- OpenAI responses are parsed into a Zod schema before state changes are applied.
- Scenario definitions contain public content, private facts, evidence rules, personalities, and outcome thresholds.
- Game sessions are currently stored in memory and are lost when the server restarts or redeploys. A shared persistent store would be required for durable sessions or multiple server instances.

## Adding a scenario

A scenario module should define:

- Public title, briefing, objective, duration, and result text
- AI opponent personality and hidden traits
- Initial trust, suspicion, and pressure values
- Evidence pools and selection rules
- Hidden facts and discovery conditions
- Outcome thresholds

Add the scenario to `server/src/scenarios/index.js`, then add or update its outcome resolver in `server/src/services/game/gameState.js`.

## Security notes

- Keep `OPENAI_API_KEY` and `COOKIE_SECRET` out of source control.
- All OpenAI calls are made by the server.
- Message requests are validated and rate limited.
- Session ownership is checked before game data is returned or changed.
- This is a public repository, so scenario source files contain spoilers for hidden facts and outcome logic.
