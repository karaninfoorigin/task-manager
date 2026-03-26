// ─── User Types ───────────────────────────────────────────────────────────────

export interface User {
  name: string;
  email: string;
  provider: 'local' | 'google';
}



export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
}

// ─── Task Types ───────────────────────────────────────────────────────────────

export type TaskStatus = 'open' | 'in_progress' | 'completed';

export interface TaskUser {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;

  created_by?: User;

  open: User[];
  in_progress: User[];
  completed: User[];
}

export interface TaskCreatePayload {
  title: string;
  description: string;
  status: TaskStatus;
  create_by_id: string;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

// ─── Auth Response Types ──────────────────────────────────────────────────────

export interface AuthResponse {
  message: string;
  status: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: { id: string; name: string; email: string };
}

// ─── WebSocket Event Types ────────────────────────────────────────────────────

export type WsEventType = 'TASK_CREATED' | 'TASK_UPDATED' | 'TASK_DELETED';

export interface WsMessage {
  event: WsEventType;
  task: Partial<Task>;
}
