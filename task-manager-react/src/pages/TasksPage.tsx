import { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { taskApi } from '@/api/tasks';
import { useTaskSocket } from '@/hooks/useTaskSocket';
import { TaskCard } from '@/components/tasks/TaskCard';
import { CreateTaskButton } from '@/components/tasks/CreateTaskButton';
import type { Task, TaskStatus } from '@/types';
import toast from 'react-hot-toast';

const columns: { status: TaskStatus; label: string; accent: string }[] = [
  { status: 'open', label: 'To Do', accent: 'text-gray-400' },
  { status: 'in_progress', label: 'In Progress', accent: 'text-yellow-500' },
  { status: 'completed', label: 'Done', accent: 'text-green-500' },
];

export default function TasksPage() {
  const { tasks, setTasks, isLoading, setLoading } = useTaskStore();
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useTaskSocket();

  useEffect(() => {
    const check = setInterval(() => {
      setWsConnected(wsRef.current?.readyState === WebSocket.OPEN);
    }, 1500);
    return () => clearInterval(check);
  }, [wsRef]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await taskApi.getAll();
      setTasks(data);
    } catch (err: unknown) {
  if (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    (err as any).status !== 401
  ) {
    toast.error("Something went wrong");
  }
} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const byStatus = (s: TaskStatus): Task[] =>
    tasks.filter((t) => t.status === s);

  return (
    <div className="flex flex-col h-full gap-7">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-1">
            Project board
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Task Manager
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* WS Status */}
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border
              ${
                wsConnected
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}
          >
            {wsConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
            {wsConnected ? 'Live' : 'Offline'}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchTasks}
            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-800"
          >
            <RefreshCw
              size={16}
              className={isLoading ? 'animate-spin' : ''}
            />
          </button>

          <CreateTaskButton />
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        {columns.map(({ status, label, accent }) => (
          <div
            key={status}
            className="flex-1 min-w-[140px] bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col"
          >
            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">
              {label}
            </span>
            <span className={`text-2xl font-extrabold ${accent}`}>
              {byStatus(status).length}
            </span>
          </div>
        ))}

        <div className="flex-1 min-w-[140px] bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col">
          <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">
            Total
          </span>
          <span className="text-2xl font-extrabold text-white">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Loader */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        /* Kanban Board */
        <div className="grid grid-cols-3 gap-4 flex-1 items-start">
          {columns.map(({ status, label, accent }) => {
            const col = byStatus(status);

            return (
              <div
                key={status}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${accent}`}
                    />
                    <span className="text-sm font-bold text-white">
                      {label}
                    </span>
                  </div>

                  <span className="min-w-[22px] h-5 px-1 rounded bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400">
                    {col.length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="p-2 flex flex-col gap-2 min-h-[80px]">
                  {col.length === 0 ? (
                    <div className="text-center text-gray-500 text-xs py-6">
                      No tasks
                    </div>
                  ) : (
                    col.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}