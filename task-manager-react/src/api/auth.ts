import api from './axiosInstance';
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  RegisterResponse,
  User,
  UpdateProfilePayload,
} from '@/types';

export const authApi = {

  register: (data: RegisterPayload) =>
    api.post<RegisterResponse>('/auth/register', data),

  login: (data: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', data),

  me: () => api.get<User>('/auth/me'),


  logout: () => api.get('/auth/logout'),

  googleLogin: () => {
    window.location.href = 'http://localhost:8000/auth/google/login';
  },

  updateProfile: (id: string, data: UpdateProfilePayload) => api.patch(`/auth/update_profile?id=${id}`, data)
  
};
