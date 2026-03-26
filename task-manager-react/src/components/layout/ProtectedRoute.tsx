import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
console.log(isLoading)
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-(--bg)">
        <div className="w-8 h-8 border-3 border-(--border2) border-t-(--accent) rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
}