import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, LogOut, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
];

export function Sidebar() {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  return (
    <aside className="w-[220px] min-h-screen bg-[var(--surface)] border-r border-[var(--border)] flex flex-col px-3 py-6 fixed top-0">
      
      {/* Logo */}
      <div className="px-2 pb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center shadow-[0_0_16px_var(--accent-glow)]">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="font-extrabold text-[18px] tracking-tight text-[var(--text)]">
            TaskFlow
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-[var(--accent)]/15 text-[var(--accent2)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-[var(--border)] pt-4 flex flex-col gap-2">
        
        <div className="px-1">
          <p className="text-[13px] font-medium text-[var(--text)] truncate">
            {user?.name}
          </p>
          <p className="text-[11px] text-[var(--muted)] truncate">
            {user?.email}
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] font-medium text-[var(--danger)] transition-colors hover:bg-red-500/10"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}