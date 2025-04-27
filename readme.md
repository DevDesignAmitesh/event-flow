# Event Flow

Event Flow is a full-stack event management platform featuring real-time updates and notifications.

The project is organized into three main parts:

- **Frontend** (`frontend`)
- **HTTP Backend** (`http-backend`)
- **WebSocket Backend** (`websockets-backend`)

---

## Frontend

The frontend is built using **Vite** and **React**, and is deployed on [Vercel](https://event-flow-sandy.vercel.app/).

### Structure

- `components/` — Reusable UI components
- `context/` — Context API setup
- `hooks/` — Reusable frontend functions for HTTP and WebSocket communication
- `pages/` — Authentication page and main dashboard page
- `App.tsx` — React routing setup
- `index.css` — TailwindCSS configuration

### Running Locally

```bash
git clone <repository-url>
cd frontend
npm install
npm run dev
```

---

## HTTP Backend

The HTTP backend is built using **Node.js**, **Express.js**, and **Prisma**, and is deployed on [Render](https://event-flow-1.onrender.com).

### Structure

- `src/` — Server entry point
- `hooks/` — Server-side reusable functions
- `middleware/` — Express middlewares (authentication, validation, etc.)
- `prisma/` — Prisma client and schema setup
- `routes/` — API routes:
  - `audit/` — Routes to get audit logs
  - `auth/` — Authentication routes
  - `events/` — CRUD operations for events
  - `notify/` — Notification-related routes
  - `user/` — User management routes (register/unregister for events)

### Running Locally

```bash
git clone <repository-url>
cd http-backend
npm install
npm run build
npm run start
```

---

## WebSocket Backend

The WebSocket backend is built using **Node.js** and the **ws** library, and is deployed on [Render](https://event-flow-4vsr.onrender.com).

### Structure

- `src/` — Entry point and WebSocket server logic

The WebSocket server handles incoming messages and sends real-time updates to event organizers.

### Running Locally

```bash
git clone <repository-url>
cd websockets-backend
npm install
npm run build
npm run start
```

---

# Summary

Event Flow is a modular and scalable application featuring:

- A modern frontend with Vite and React
- A robust REST API backend using Express and Prisma
- Real-time communication powered by WebSocket servers

---
