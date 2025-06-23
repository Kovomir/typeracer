# TypeRacer Game

A real-time multiplayer typing game built with Next.js, React, TypeScript, and WebSockets.

## Project Structure

This project consists of two main parts:

- **Frontend**: A Next.js application located in the `frontend` directory
- **Backend**: A Node.js WebSocket server located in the `backend` directory

## Local Development

### Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment variables example file and modify if needed:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm run dev
```

The backend server will start on http://localhost:3001.

### Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment variables example file and modify if needed:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

The frontend app will start on http://localhost:3000.