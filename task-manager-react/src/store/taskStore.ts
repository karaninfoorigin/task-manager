import { create } from 'zustand';
import type { Task } from '@/types';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (updated: Task) => void;
  setLoading: (v: boolean) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
  updateTask: (updated) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === updated.id ? updated : t)),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
