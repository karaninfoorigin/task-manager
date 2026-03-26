# TaskFlow — React TypeScript Frontend

Production-grade frontend for the TaskFlow FastAPI backend.

## Stack
- **React 18** + **TypeScript**
- **Vite** (bundler, dev server with proxy)
- **React Router v6** (client-side routing)
- **Zustand** (global state — auth + tasks)
- **Axios** (HTTP client with auto token refresh interceptor)
- **react-hot-toast** (notifications)
- **lucide-react** (icons)

## Folder Structure
```
src/
├── api/               # Axios instance + per-resource API modules
│   ├── axiosInstance.ts   # Base instance + 401 refresh interceptor
│   ├── auth.ts
│   └── tasks.ts
├── components/
│   ├── layout/        # AppShell, Sidebar, ProtectedRoute
│   ├── ui/            # Button, Input, Badge, Modal (design system)
│   ├── auth/          # (slot for future auth-specific widgets)
│   ├── dashboard/     # (slot for future dashboard widgets)
│   └── tasks/         # TaskCard, CreateTaskButton
├── hooks/
│   ├── useAuth.ts     # login / register / logout actions
│   └── useTaskSocket.ts  # WebSocket connection + auto-reconnect
├── pages/
│   ├── AuthPage.tsx      # Login + Register (tab toggle) + Google OAuth
│   ├── DashboardPage.tsx # Profile view + edit modal
│   └── TasksPage.tsx     # Kanban board (todo / in_progress / done)
├── store/
│   ├── authStore.ts   # Zustand auth state
│   └── taskStore.ts   # Zustand task state
├── types/
│   └── index.ts       # All TypeScript interfaces
└── utils/
    └── cn.ts          # clsx helper
```

## Getting Started

```bash
npm install
npm run dev        # starts on http://localhost:4200
```

The Vite dev server proxies `/api/*` → `http://localhost:8000` so no CORS issues during development.

## Key Features

### Auth
- Login / Register with tab toggle
- Google OAuth (redirects to `/api/auth/google/login`)
- JWT stored in HttpOnly cookies (set by server)
- Silent token refresh on 401 via Axios interceptor

### Dashboard
- Shows logged-in user's name, email, provider (Google / Local)
- Edit profile modal (name, email, password for local accounts)

### Tasks
- Kanban board with three columns: **To Do**, **In Progress**, **Done**
- Live WebSocket connection (`ws://localhost:8000/user/ws/tasks`)
  - `TASK_CREATED` → adds task to store
  - `TASK_UPDATED` → updates task in store
  - Connection indicator (Live / Offline) + auto-reconnect after 3s
- Create new task via modal
- Edit any task inline

### Navigation
- Persistent sidebar with active route highlighting
- **Sign out** button clears cookies and redirects to `/`
- Protected routes redirect unauthenticated users to `/`
