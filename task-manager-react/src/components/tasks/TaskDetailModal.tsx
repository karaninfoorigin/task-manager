import { Modal } from '@/components/ui/Modal';
import type { Task } from '@/types';

interface Props {
  task: Task | null;
  open: boolean;
  onClose: () => void;
}

export function TaskDetailsModal({ task, open, onClose }: Props) {
  if (!task) return null;

  const renderUsers = (users: any[]) => {
    if (users.length === 0) {
      return <p style={{ fontSize: 12, color: 'var(--dimmed)' }}>No users</p>;
    }

    return users.map((u) => (
      <div
        key={u.id}
        style={{
          padding: '6px 10px',
          border: '1px solid var(--border)',
          borderRadius: 8,
          fontSize: 12,
          background: 'var(--surface2)',
        }}
      >
        {u.name} ({u.email})
      </div>
    ));
  };

  return (
    <Modal open={open} onClose={onClose} title="Task Details">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        
        <div>
          <h3>{task.title}</h3>
          <p style={{ fontSize: 13 }}>{task.description}</p>
        </div>

        <div>
          <strong>Created By:</strong> {task.created_by?.name}
        </div>

        {/* Status groups */}
        <div>
          <strong>Open</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {renderUsers(task.open)}
          </div>
        </div>

        <div>
          <strong>In Progress</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {renderUsers(task.in_progress)}
          </div>
        </div>

        <div>
          <strong>Completed</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {renderUsers(task.completed)}
          </div>
        </div>
      </div>
    </Modal>
  );
}