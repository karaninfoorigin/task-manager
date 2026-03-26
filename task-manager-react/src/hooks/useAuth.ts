import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { LoginPayload, RegisterPayload } from '@/types';

export function useAuth() {
   const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const storeLogout = useAuthStore((state) => state.logout);
const setInitialized = useAuthStore((s) => s.setInitialized);
  const navigate = useNavigate();

  
const fetchMe = useCallback(async () => {
  try {
    setLoading(true);
    const { data } = await authApi.me();
    console.log(data)
    setUser(data);
  } catch {
    setUser(null);
  } finally {
    console.log('set loading false')
    setLoading(false);
    setInitialized(true); 
  }
}, [setUser, setLoading, setInitialized]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      try{
        await authApi.login(payload);
      
      navigate('/dashboard');
      }catch{}
      
    },
    [fetchMe, navigate]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await authApi.register(payload);
      toast.success('Account created! Please log in.');
      navigate('/');
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    storeLogout();
    navigate('/auth');
  }, [storeLogout, navigate]);

  return { login, register, logout, fetchMe };
}
