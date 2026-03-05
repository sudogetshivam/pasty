# 📋 Pasty — Global Clipboard & AI Terminal Tool

> Share text instantly across any device or terminal. No accounts. No friction. Just a 4-digit code.

[![npm version](https://img.shields.io/npm/v/cli-pasty?color=blueviolet&style=flat-square)](https://www.npmjs.com/package/cli-pasty)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./cli/package.json)

---

## What is Pasty?

Pasty is a lightweight cross-device clipboard tool. You type a message, get a 4-digit code, and retrieve that message from any other device — terminal or browser. No sign-up, no complexity.

It has three parts:

- **CLI (`cli-pasty`)** — an npm package you install globally and use from any terminal
- **Server** — a REST API built with Express and MongoDB that stores and retrieves messages
- **Client** — a React web UI for users who prefer the browser

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│   ┌───────────────────┐       ┌──────────────────────┐      │
│   │  CLI (cli-pasty)  │       │ Web UI (React + Vite) │     │
│   └────────┬──────────┘       └──────────┬───────────┘      │
│            │  HTTP/HTTPS                 │  HTTP/HTTPS       │
└────────────┼─────────────────────────────┼──────────────────┘
             │                             │
             ▼                             ▼
┌─────────────────────────────────────────────────────────────┐
│                        Server Layer                         │
│              Express.js REST API (Node.js ≥18)              │
│                                                             │
│   POST /api/auth/send-message                               │
│   POST /api/auth/retrieve-message                           │
│   POST /api/auth/delete-message                             │
│                                                             │
│   Routes → Controllers → Models                             │
└───────────────────────────────────────────────┬─────────────┘
                                                │ Mongoose ODM
                                                ▼
                                     ┌──────────────────┐
                                     │   MongoDB Atlas   │
                                     └──────────────────┘

                 ┌─────────────────────────────────────┐
                 │   Built-in AI (CLI only)             │
                 │   Xenova/Qwen1.5-0.5B-Chat           │
                 │   Runs 100% locally (ONNX / q4)      │
                 └─────────────────────────────────────┘
```

A few design decisions worth noting:

- **No authentication.** The 4-digit code is the only access control. Keep it private and your message stays private.
- **One-time messages.** When saved with `saveonce`, a message is permanently deleted from the database the moment it's first retrieved.
- **Custom codes.** With `saveat`, you pick the code yourself — useful for persistent slots you reuse across devices.
- **Offline AI.** The `pasty ai` command runs a quantized LLM locally using ONNX. No API key, no internet needed for inference.

---

## Project Structure

```
pasty/
├── cli/                          # npm package (cli-pasty)
│   ├── index.js                  # Entry point — all CLI commands
│   ├── package.json
│   └── .npmignore
│
├── server/                       # Express REST API
│   ├── server.js                 # App bootstrap, CORS, routes
│   ├── config/
│   │   └── mongodb.config.js     # Mongoose connection
│   ├── route/
│   │   └── message.route.js
│   ├── controller/
│   │   └── message.controller.js # Business logic
│   ├── model/
│   │   └── message.model.js      # Mongoose schema
│   └── utils/
│       ├── asyncHandler.js
│       ├── apiError.js
│       └── apiResponse.js
│
├── client/                       # React + Vite web UI
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
└── package.json                  # Root-level convenience scripts
```

---

## Prerequisites

- **Node.js `≥ 18.0.0`** — required for ESM support and the CLI
- **npm `≥ 9.x`** — comes bundled with Node 18+
- **MongoDB** — Atlas (cloud) or a local instance

---

## Local Development Setup

### 1. Clone & Install

```bash
git clone https://github.com/sudogetshivam/pasty.git
cd pasty

# Install client and server dependencies in one go
npm run install-all
```

Or install them manually if you prefer:

```bash
cd server && npm install
cd ../client && npm install
cd ../cli && npm install
```

### 2. Environment Variables

Create `.env` files in the directories below. Never commit these to version control.

**`server/.env`**
```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pasty
CLIENT_URL=http://localhost:5173
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:8000
```

**`cli/.env`** *(optional)*
```env
BASE_URL=http://localhost:8000/api/auth
```

> The CLI defaults to `https://pasty-api.onrender.com/api/auth` if `BASE_URL` is not set, so it works out-of-the-box without running the server locally.

### 3. Run the Server

```bash
# From the project root
npm run server

# Or from inside /server
npm run dev    # uses nodemon, auto-restarts on file changes
npm start      # plain node, for production
```

The server starts at `http://localhost:8000`. You can verify it's running by visiting `http://localhost:8000/api/auth` — it should respond with `"API is Working"`.

### 4. Run the Client

```bash
# From the project root
npm run client

# Or from inside /client
npm run dev      # Vite dev server with hot module replacement
npm run build    # production bundle → /dist
npm run preview  # preview the production build locally
```

The client starts at `http://localhost:5173`.

---

## CLI — `cli-pasty`

### Installation

```bash
npm install -g cli-pasty
```

Verify it works:

```bash
pasty help
```

### Commands

**`pasty save <message>`**  
Saves a message and returns a 4-digit code you can use to retrieve it from anywhere.

**`pasty get <code>`**  
Retrieves the message stored at the given 4-digit code.

**`pasty saveat <code> <message>`**  
Saves a message at a code you choose. If that code already exists, it overwrites it. Good for reusable slots.

**`pasty saveonce <message>`**  
Saves a message that is permanently deleted after the first retrieval. Useful for sensitive one-off transfers.

**`pasty ai <prompt>`**  
Runs the built-in AI assistant locally. Powered by `Qwen1.5-0.5B-Chat` via ONNX runtime — no API key needed. The model (~300 MB) downloads and caches on first use.

**`pasty help`**  
Prints usage information.

### Examples

```bash
# Save a message and get a code
pasty save "Hello from my laptop!"
# → 4821

# Retrieve it on any other device
pasty get 4821
# → Hello from my laptop!

# Save at a memorable code you choose
pasty saveat 9999 "My persistent clipboard slot"
pasty get 9999
# → My persistent clipboard slot

# Self-destructing message
pasty saveonce "Read once, then gone"
# → 3307

pasty get 3307   # works
pasty get 3307   # error — already deleted

# Ask the local AI
pasty ai "What is the difference between TCP and UDP?"
```

---

## API Reference

**Production base URL:** `https://pasty-api.onrender.com/api/auth`  
**Local base URL:** `http://localhost:8000/api/auth`

All endpoints accept and return JSON.

---

### POST `/send-message`

Saves a message and returns it along with its code.

**Request body:**
```json
{
  "message": "your text here",
  "isOnce": false,
  "mycode": 9999
}
```

- `message` is required.
- `isOnce` is optional — set to `true` to create a burn-after-reading message.
- `mycode` is optional — provide a specific code to save at. If omitted, a code is auto-generated.

**Response:**
```json
{
  "statusCode": 201,
  "data": {
    "code": 4821,
    "message": "your text here",
    "isOnce": false
  },
  "message": "Your created Message code is:4821",
  "success": true
}
```

---

### POST `/retrieve-message`

Fetches the message stored at the given code. If the message was saved with `isOnce: true`, it is deleted immediately after this call.

**Request body:**
```json
{
  "code": 4821
}
```

**Response:**
```json
{
  "statusCode": 204,
  "data": null,
  "message": "your text here",
  "success": true
}
```

---

### POST `/delete-message`

Manually deletes a message by its code.

**Request body:**
```json
{
  "code": 4821
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

## Data Model

Messages are stored in a `messages` collection in MongoDB with the following schema:

- `code` — unique 4-digit number, auto-generated or user-supplied
- `message` — the stored text string
- `isOnce` — boolean, defaults to `false`; when `true` the document is deleted on first retrieval
- `expiresAt` — reserved for future TTL support, currently `null`
- `createdAt` / `updatedAt` — auto-managed by Mongoose

---

## Deployment

### Server

Set the following environment variables in your hosting dashboard (Render, Railway, Fly.io, etc.):

```
PORT=8000
MONGODB_URI=<your atlas connection string>
CLIENT_URL=<your frontend URL>
```

Start command: `node server.js`

### Client

Set `VITE_API_URL` to your deployed server URL, then:

```
Build command: npm run build
Output directory: dist
```

Works out of the box on Vercel and Netlify.

### CLI

```bash
cd cli
# bump the version in package.json, then:
npm publish
```

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push and open a Pull Request

---

## License

MIT — made with ❤️ by [sudogetshivam](https://github.com/sudogetshivam)
