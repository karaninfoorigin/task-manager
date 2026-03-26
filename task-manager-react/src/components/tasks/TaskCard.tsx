import { useState } from 'react';
import { Pencil } from 'lucide-react';
import type { Task, TaskStatus } from '@/types';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { taskApi } from '@/api/tasks';
import { useTaskStore } from '@/store/taskStore';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateTask } = useTaskStore();

  const [form, setForm] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await taskApi.update(task.id, form);
      updateTask(data);
      toast.success('Task updated');
      setEditOpen(false);
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col gap-2.5 transition-all duration-150 hover:border-[var(--border2)] hover:-translate-y-[1px]">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm text-[var(--text)] tracking-tight flex-1">
            {task.title}
          </h3>

          <button
            onClick={() => {
              setForm({
                title: task.title,
                description: task.description,
                status: task.status,
              });
              setEditOpen(true);
            }}
            className="p-1 rounded-md text-[var(--dimmed)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors flex-shrink-0"
          >
            <Pencil size={12} />
          </button>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-[13px] text-[var(--muted)] leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-1">
          <StatusBadge status={task.status} />
          <span className="text-[11px] text-[var(--dimmed)]">
            {task.created_by?.name ?? 'Unknown'}
          </span>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Task">
        <form onSubmit={handleUpdate} className="flex flex-col gap-3.5">
          
          <Input
            label="Title"
            value={form.title}
            onChange={(e) =>
              setForm((f) => ({ ...f, title: e.target.value }))
            }
          />

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[var(--muted)] uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] text-sm px-3 py-2.5 resize-y outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[var(--muted)] uppercase tracking-wider">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as TaskStatus,
                }))
              }
              className="rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] text-sm px-3 py-2.5 outline-none cursor-pointer focus:border-[var(--accent)] transition-colors"
            >
              <option value="open">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Done</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end mt-1">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Update Task
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}