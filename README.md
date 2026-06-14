# Weather Dashboard

Dockerized Full-stack weather dashboard :

- React frontend
- Node.js backend API
- Docker Compose with two containers
- City search
- Current weather display
- Recent searches saved in the browser

## Architecture

Browser -> React frontend -> Node API -> Open-Meteo APIs

## Features

- Search by city name
- Show current weather and basic details
- Keep recent searches in local storage

## Run locally

Dependencies are already installed in `backend/node_modules` and `frontend/node_modules`.
Run each app directly:

1. Backend:

```bash
cd backend
npm run dev
```

2. Frontend:

```bash
cd frontend
npm run dev
```

By default, the frontend expects the backend at `http://localhost:4000`.

## Run with Docker

```bash
docker compose up --build
```

The images reuse the manually installed dependencies from the workspace, so no package install runs during build.



