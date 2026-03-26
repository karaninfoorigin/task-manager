import api from './axiosInstance';
import type { Task, TaskCreatePayload, TaskUpdatePayload } from '@/types';

export const taskApi = {
  getAll: () => api.get<Task[]>('/user/getAllTask'),

  create: (data: TaskCreatePayload) =>
   {
    console.log(api.prototype)
    return api.post<Task>('/user/createTask', data)
  },

  update: (taskId: string, data: TaskUpdatePayload) =>
    api.put<Task>(`/user/updateTask/${taskId}`, data),
};
