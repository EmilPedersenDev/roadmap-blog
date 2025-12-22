# Roadmap Blog

A fullstack monolith application with Nuxt 3 client and Express server, all in TypeScript.

## Project Structure

```
.
├── client/          # Nuxt 3 static rendered app
│   ├── app.vue      # Root component
│   ├── public/      # Static assets
│   └── tsconfig.json
├── server/          # Express API server
│   ├── index.ts     # Server entry point
│   └── tsconfig.json
├── nuxt.config.ts   # Nuxt configuration
├── package.json     # Shared dependencies
└── README.md
```

## Tech Stack

- **Client**: Nuxt 4 (Static Site Generation)
- **Server**: Express with TypeScript
- **Language**: TypeScript
- **Package Manager**: npm

## Setup

Install dependencies:

```bash
npm install
```

## Development

Start both client and server in development mode:

```bash
npm run dev
```

This will start:
- **Client**: Nuxt dev server on `http://localhost:3000`
- **Server**: Express API on `http://localhost:3001`

You can also run them separately:

```bash
# Client only
npm run dev:client

# Server only
npm run dev:server
```

## Building

Build both client and server for production:

```bash
# Build client (generates .output directory)
npm run build:client

# Build server (compiles TypeScript to dist-server/)
npm run build:server

# Or build both
npm run build:client && npm run build:server
```

### Client Build

The client build generates a `.output` directory with static files ready for deployment to any static hosting service.

### Server Build

The server build:
1. Compiles TypeScript to `dist-server/`
2. Copies `package.json` and `package-lock.json` to `dist-server/`

For deployment, copy the `dist-server/` folder to your server and run:
```bash
npm install --production
npm start
```

## Scripts

- `npm run dev` - Start both client and server
- `npm run dev:client` - Start Nuxt dev server only
- `npm run dev:server` - Start Express server only
- `npm run build:client` - Build Nuxt app for production
- `npm run build:server` - Build Express server for production
- `npm run generate:client` - Generate static site
- `npm run preview:client` - Preview production build
- `npm run start:server` - Start production server
