#  Task Manager -- Full Stack (React + FastAPI)

A full-stack Task Management Application enabling users to create, manage, and collaborate on tasks in real-time with secure authentication and live updates.

**Tech Stack:**
-    Frontend: React + TypeScript + Vite + TailwindCSS
-    Backend: FastAPI (Python)
-    Authentication: JWT + OAuth (Google)
-    Real-time updates: WebSockets
-    Database: SQLAlchemy ORM

------------------------------------------------------------------------

## Features

###  Authentication & Security

-   JWT-based authentication (access & refresh tokens)
-   Google OAuth login integration
-   Secure password hashing using bcrypt
-   Token validation & middleware protection

###  Task Management

-   Create, update, delete tasks
-   Task status management
-   User-specific task ownership
-   Real-time updates via WebSockets

###  Real-Time System

-   Live task updates using WebSocket connections
-   Centralized WebSocket manager

###  Clean Architecture

-   Modular backend structure with separation of concerns
-   State management in frontend (Zustand)
-   Reusable UI components

------------------------------------------------------------------------

##  Project Structure

```
Task-Manager-React-FastAPI/
├── task-manager-fast/              # FastAPI backend
│   ├── app/
│   │   ├── config/                 # Configuration & environment
│   │   ├── core/                   # Security, auth, middleware
│   │   ├── models/                 # Database models
│   │   ├── routes/                 # API endpoints
│   │   ├── schema/                 # Pydantic schemas
│   │   ├── services/               # Business logic
│   │   ├── tests/                  # Unit & integration tests
│   │   └── main.py                 # FastAPI application entry
│   └── requirements.txt
├── task-manager-react/             # React frontend
│   ├── src/
│   │   ├── api/                    # API client & axios
│   │   ├── components/             # React components
│   │   ├── hooks/                  # Custom hooks
│   │   ├── pages/                  # Page components
│   │   ├── store/                  # Zustand stores
│   │   ├── types/                  # TypeScript types
│   │   └── utils/                  # Utility functions
│   └── package.json
└── README.md

```

------------------------------------------------------------------------

##  Getting Started

### Backend Setup

```bash
cd task-manager-fast
pip install -r requirements.txt
```

Create a `.env` file:
```env
DATABASE_URL=postgresql://user:password@localhost/taskdb
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_SECRET=access-secret
REFRESH_TOKEN_SECRET=refresh-secret
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
CLIENT_ID=google-client-id
CLIENT_SECRET=google-client-secret
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

Run the server:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd task-manager-react
npm install
npm run dev
```

------------------------------------------------------------------------

## API Endpoints (Pseudo Code)

### Authentication

```pseudocode
POST /api/auth/register
  Input: { email, password, name }
  Process:
    1. Validate email format
    2. Check if user already exists
    3. Hash password using bcrypt
    4. Create user in database
    5. Generate access token & refresh token
  Output: { access_token, refresh_token, user_id }

POST /api/auth/login
  Input: { email, password }
  Process:
    1. Find user by email
    2. Verify password hash
    3. If valid:
        - Generate access token (expires in 30 min)
        - Generate refresh token (expires in 7 days)
        - Return tokens
    4. If invalid: Return 401 Unauthorized
  Output: { access_token, refresh_token, user_id }

POST /api/auth/refresh
  Input: { refresh_token }
  Process:
    1. Verify refresh token signature
    2. Check token expiration
    3. If valid: Generate new access token
    4. If invalid: Return 401 Unauthorized
  Output: { access_token }

POST /api/auth/google
  Input: { google_token }
  Process:
    1. Verify Google token with Google API
    2. Extract user info (email, name, profile_pic)
    3. Check if user exists in database
    4. If exists: Get user | If not: Create new user
    5. Generate access & refresh tokens
  Output: { access_token, refresh_token, user_id }

POST /api/auth/logout
  Input: Current user
  Process:
    1. Invalidate refresh token (add to blacklist)
    2. Clear authentication cookie
  Output: { message: "Logged out successfully" }
```

### Task Management

```pseudocode
GET /api/tasks
  Input: Current authenticated user
  Process:
    1. Verify JWT token from Authorization header
    2. Extract user_id from token
    3. Query database: SELECT * FROM tasks WHERE user_id = current_user_id
    4. Return all tasks with status, created_date, updated_date
  Output: { tasks: [{ id, title, description, status, created_at, ... }] }

POST /api/tasks
  Input: { title, description, status, due_date }, Current user
  Process:
    1. Validate JWT token
    2. Validate input (title required, max_length=255)
    3. Create task object:
        - Assign user_id = current_user_id
        - Set created_timestamp = now()
        - Set status = "todo" (default)
    4. Insert into database
    5. Broadcast task creation via WebSocket to user
  Output: { id, title, description, status, created_at }

GET /api/tasks/{task_id}
  Input: task_id, Current user
  Process:
    1. Verify JWT token
    2. Query task by id
    3. Check if task belongs to current_user
    4. If yes: Return task | If no: Return 403 Forbidden
  Output: { id, title, description, status, created_at, updated_at, ... }

PUT /api/tasks/{task_id}
  Input: { title, description, status, due_date }, task_id, Current user
  Process:
    1. Verify JWT token
    2. Find task by id
    3. Verify ownership (task.user_id == current_user_id)
    4. If authorized:
        - Update task fields
        - Set updated_timestamp = now()
        - Save to database
        - Notify user via WebSocket
    5. If not authorized: Return 403 Forbidden
  Output: { id, title, description, status, updated_at }

DELETE /api/tasks/{task_id}
  Input: task_id, Current user
  Process:
    1. Verify JWT token
    2. Find task by id
    3. Check ownership
    4. If authorized:
        - Delete task from database
        - Broadcast deletion via WebSocket
    5. If not authorized: Return 403 Forbidden
  Output: { message: "Task deleted successfully" }
```

### User Management

```pseudocode
GET /api/users/me
  Input: Current user JWT token
  Process:
    1. Extract user_id from token
    2. Query user from database by id
    3. Return user profile (exclude password)
  Output: { id, email, name, profile_picture, created_at }

PUT /api/users/me
  Input: { name, profile_picture, email }, Current user
  Process:
    1. Verify JWT token
    2. Validate input data
    3. Update user record in database
    4. Return updated profile
  Output: { id, email, name, profile_picture, updated_at }

POST /api/users/change-password
  Input: { old_password, new_password }, Current user
  Process:
    1. Verify JWT token
    2. Find user by id
    3. Verify old_password hash matches
    4. If valid:
        - Hash new_password
        - Update password in database
        - Invalidate all existing refresh tokens
    5. If invalid: Return 401 Unauthorized
  Output: { message: "Password changed successfully" }
```

------------------------------------------------------------------------

## WebSocket Events (Pseudo Code)

```pseudocode
WebSocket Connection Manager:
  - Maintains active connections: Map<user_id, [connections]>
  - Handles connection lifecycle (connect, disconnect)
  - Broadcasts messages to specific users or all users

EVENT: task_created
  Payload: { task_id, title, description, status, created_at, user_id }
  Broadcast to: Specific user
  Process:
    1. Task created in database
    2. Serialize task data to JSON
    3. Send to user's WebSocket connection
    4. Frontend updates task store

EVENT: task_updated
  Payload: { task_id, updated_fields, updated_at }
  Broadcast to: Specific user
  Process:
    1. Task updated in database
    2. Send updated task data
    3. Frontend merges changes in store

EVENT: task_deleted
  Payload: { task_id, deleted_at }
  Broadcast to: Specific user
  Process:
    1. Task deleted from database
    2. Send deletion notification
    3. Frontend removes task from store

EVENT: connection_opened
  Process:
    1. User connects WebSocket
    2. Associate connection with user_id
    3. Send "connected" confirmation
    4. Load and send pending tasks

EVENT: connection_closed
  Process:
    1. User disconnects WebSocket
    2. Remove connection from active list
    3. Mark user as offline
```

------------------------------------------------------------------------

## Frontend Components (Pseudo Code)

### Authentication Flow

```pseudocode
Component: AuthPage
  State: { email, password, isLoading, error }
  
  handleLogin():
    1. Call API.login(email, password)
    2. If success:
        - Store access_token in localStorage
        - Store user in authStore
        - Redirect to /dashboard
    3. If error:
        - Display error message
        - Clear password field

  handleGoogleLogin(googleToken):
    1. Call API.loginWithGoogle(googleToken)
    2. Store tokens if successful
    3. Update auth store
    4. Redirect to dashboard

  render():
    - Email input
    - Password input
    - Login button
    - Google OAuth button
    - Link to register
```

### Task Management

```pseudocode
Component: TasksPage
  State: tasks[], isLoading, filter (all/active/completed)
  Store: taskStore, authStore
  Hook: useTaskSocket (for real-time updates)
  
  useEffect():
    1. On component mount:
        - Fetch all tasks for current user
        - Connect WebSocket
        - Subscribe to task_created, task_updated, task_deleted events
    2. On unmount:
        - Disconnect WebSocket
        - Clear listeners

  handleCreateTask(taskData):
    1. Call API.createTask(taskData)
    2. On success:
        - Store receives task_created event
        - UI updates automatically

  handleUpdateTask(taskId, updates):
    1. Call API.updateTask(taskId, updates)
    2. On success:
        - Store receives task_updated event
        - UI re-renders with changes

  handleDeleteTask(taskId):
    1. Call API.deleteTask(taskId)
    2. On success:
        - Store receives task_deleted event
        - Remove task from UI

  filterTasks():
    1. If filter == "active": Show tasks where status != "completed"
    2. If filter == "completed": Show tasks where status == "completed"
    3. If filter == "all": Show all tasks

  render():
    - Filter buttons (All, Active, Completed)
    - Create task button
    - Task list (TaskCard components)
    - Task detail modal on click
```

### State Management (Zustand)

```pseudocode
Store: taskStore
  State: {
    tasks: [],
    selectedTask: null,
    isLoading: false,
    error: null
  }

  Actions:
    setTasks(tasks): Update all tasks
    addTask(task): Add new task to array
    updateTask(taskId, updates): Merge updates into existing task
    removeTask(taskId): Remove task from array
    selectTask(taskId): Set selected task for detail view
    clearError(): Reset error state

Store: authStore
  State: {
    user: null,
    access_token: null,
    refresh_token: null,
    isAuthenticated: false,
    isLoading: false
  }

  Actions:
    login(user, tokens): Set user and tokens
    logout(): Clear user and tokens, remove from localStorage
    updateUser(userUpdates): Merge user updates
    setTokens(accessToken, refreshToken): Update tokens
    refreshAccessToken(): Call API to get new token
```

------------------------------------------------------------------------

## Testing (Pseudo Code)

```pseudocode
Test Suite: test_auth.py
  Test: test_user_registration
    1. Send POST /api/auth/register with valid data
    2. Assert: Status 201
    3. Assert: User created in database
    4. Assert: Tokens returned

  Test: test_login_success
    1. Create user in database
    2. Send POST /api/auth/login with correct credentials
    3. Assert: Status 200
    4. Assert: Tokens returned

  Test: test_login_failure
    1. Send POST /api/auth/login with wrong password
    2. Assert: Status 401

  Test: test_token_refresh
    1. Send refresh token to /api/auth/refresh
    2. Assert: New access token returned
    3. Assert: Old token not valid anymore

Test Suite: task_test.py
  Test: test_create_task
    1. Authenticate user
    2. Send POST /api/tasks with task data
    3. Assert: Task created with correct data
    4. Assert: User_id matches current user

  Test: test_list_tasks_unauthorized
    1. Send GET /api/tasks without token
    2. Assert: Status 401

  Test: test_delete_other_user_task
    1. User A tries to delete User B's task
    2. Assert: Status 403 Forbidden

  Test: test_websocket_task_creation
    1. Connect WebSocket
    2. Create task via API
    3. Assert: WebSocket event received with task data
```

------------------------------------------------------------------------

## Security Features

1. **JWT Authentication**
   - Access tokens expire in 30 minutes
   - Refresh tokens expire in 7 days
   - Tokens signed with SECRET_KEY using HS256 algorithm

2. **Password Security**
   - Passwords hashed using bcrypt
   - Minimum 8 characters recommended
   - Never stored or transmitted in plain text

3. **Authorization**
   - Middleware validates JWT on protected routes
   - Users can only access their own tasks
   - Owner verification on update/delete operations

4. **CORS Protection**
   - Only allowed origins can access API
   - Configured in `ALLOWED_ORIGINS`

5. **Input Validation**
   - Pydantic schemas validate all inputs
   - SQL injection prevention via ORM
   - File upload size limits (5MB max)

------------------------------------------------------------------------

##  Database Schema (Pseudo Code)

```pseudocode
Table: user
  Columns:
    - id (UUID, Primary Key)
    - email (String, Unique)
    - password_hash (String)
    - name (String)
    - profile_picture (String, nullable)
    - created_at (DateTime)
    - updated_at (DateTime)
    - is_active (Boolean, default: True)

Table: task
  Columns:
    - id (UUID, Primary Key)
    - user_id (UUID, Foreign Key -> user.id)
    - title (String, max 255)
    - description (Text, nullable)
    - status (Enum: todo, in_progress, completed)
    - due_date (DateTime, nullable)
    - created_at (DateTime)
    - updated_at (DateTime)

Relationships:
  - User has many Tasks (1:N)
  - When user deleted: cascade delete tasks
  - Query efficiency: Index on user_id, created_at
```

------------------------------------------------------------------------

##  Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost/db` |
| `SECRET_KEY` | JWT signing key | `your-secret-key-here` |
| `ALGORITHM` | Token algorithm | `HS256` |
| `ACCESS_TOKEN_SECRET` | Access token secret | `access-secret` |
| `REFRESH_TOKEN_SECRET` | Refresh token secret | `refresh-secret` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token TTL | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token TTL | `7` |
| `CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |
| `CLIENT_SECRET` | Google OAuth Client Secret | `secret-key` |
| `DEBUG` | Debug mode | `True` |
| `ALLOWED_ORIGINS` | CORS whitelist | `http://localhost:3000` |

------------------------------------------------------------------------

##  Deployment

### Backend (FastAPI)
- Use Gunicorn or Uvicorn in production
- Set `DEBUG=False`
- Configure database with managed PostgreSQL service
- Use environment-based secrets management

### Frontend (React)
- Build: `npm run build`
- Deploy to Vercel, Netlify, or AWS S3
- Update API endpoint to production server

------------------------------------------------------------------------

##  License

MIT License - Feel free to use this project for personal and commercial purposes.

##  Backend Setup

``` bash
cd task-manager-fast
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

------------------------------------------------------------------------

##  Frontend Setup

``` bash
cd task-manager-react
npm install
npm run dev
```

------------------------------------------------------------------------

## API Overview

### Auth

-   POST /login
-   POST /register
-   POST /refresh-token
-   GET /google/login

### Tasks

-   GET /tasks
-   POST /tasks
-   PUT /tasks/{id}
-   DELETE /tasks/{id}

### WebSocket

-   /ws/tasks

------------------------------------------------------------------------

## Author

Karan Rawat

------------------------------------------------------------------------

## License

MIT License
