import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { taskApi } from '@/api/tasks';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/authStore';
import type { TaskStatus } from '@/types';
import toast from 'react-hot-toast';

export function CreateTaskButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addTask } = useTaskStore();
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'open' as TaskStatus,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setLoading(true);
    try {
     
      const { data } = await taskApi.create({
        ...form,
        create_by_id: (user as unknown as { id: string })?.id ?? '',
      });

      // addTask(data);
      toast.success('Task created!');
      setOpen(false);
      setForm({ title: '', description: '', status: 'open' });
    } catch {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus size={14} />
        New Task
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Create New Task">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          
          <Input
            label="Title"
            placeholder="What needs to be done?"
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
              placeholder="Optional description..."
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
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end mt-1">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}