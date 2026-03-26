import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import TasksPage from '@/pages/TasksPage';

import { AppShell } from '@/components/layout/AppShell';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import ProtectedRoute from './components/routes/ProtectedRoute';
function AppInit() {
  const { fetchMe } = useAuth();
 function call(){
  console.log("heloooo")
 }
 call()
  //  useEffect(() => {
      
  //      fetchMe()

  //  }, [fetchMe]);
 
  

  return (
    <Routes>
      <Route path='/' element={<Navigate to="/auth"/>}/>
      <Route path="/auth" element={<AuthPage />} />

      <Route
        element={
            <AppShell />
          
        }
      >

        <Route path="/dashboard" element={
          <ProtectedRoute>
          <DashboardPage />
           </ProtectedRoute>
          } 
         
          />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
          
          } />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInit />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border2)',
            fontSize: '13px',
            fontFamily: 'var(--font-body)',
            borderRadius: '10px',
          },
          success: { iconTheme: { primary: '#34d399', secondary: 'var(--surface)' } },
          error:   { iconTheme: { primary: '#f87171', secondary: 'var(--surface)' } },
        }}
      />
    </BrowserRouter>
  );
}
