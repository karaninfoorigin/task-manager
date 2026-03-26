# 🚀 Task Manager -- Full Stack (React + FastAPI)

A full-stack Task Management Application built with:

-   ⚡ Frontend: React + TypeScript + Vite + TailwindCSS\
-   🚀 Backend: FastAPI (Python)\
-   🔐 Authentication: JWT + OAuth (Google)\
-   🔄 Real-time updates: WebSockets\
-   🗄️ Database: SQLAlchemy ORM

------------------------------------------------------------------------

## 📌 Features

### 🔐 Authentication & Security

-   JWT-based authentication (access & refresh tokens)
-   Google OAuth login integration
-   Secure password hashing using bcrypt
-   Token validation & middleware protection

### 📋 Task Management

-   Create, update, delete tasks
-   Task status management
-   User-specific task ownership
-   Real-time updates via WebSockets

### ⚡ Real-Time System

-   Live task updates using WebSocket connections
-   Centralized WebSocket manager

### 🧠 Clean Architecture

-   Modular backend structure
-   State management in frontend
-   Reusable UI components

------------------------------------------------------------------------

## 🏗️ Project Structure

    Task-Manager-React-FastAPI/
    ├── task-manager-fast/
    ├── task-manager-react/
    └── README.md

------------------------------------------------------------------------

## ⚙️ Backend Setup

``` bash
cd task-manager-fast
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

------------------------------------------------------------------------

## 🎨 Frontend Setup

``` bash
cd task-manager-react
npm install
npm run dev
```

------------------------------------------------------------------------

## 🔌 API Overview

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

## 👨‍💻 Author

Karan Rawat

------------------------------------------------------------------------

## 📄 License

MIT License
