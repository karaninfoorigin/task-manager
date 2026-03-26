import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppShell() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-55 p-10 overflow-y-auto bg-(--bg) ">
        <Outlet />
      </main>
    </div>
  );
}