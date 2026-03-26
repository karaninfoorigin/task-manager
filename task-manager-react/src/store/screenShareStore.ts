import { create } from 'zustand';
import type { Task } from '@/types';

interface ScreenShareState {
  sharedScreen: Task[];
  isLoading: boolean;
}

export const useTaskStore = create<ScreenShareState>((set) => ({
 sharedScreen:[],
 isLoading:false
}));
