import { cn } from '@/utils/cn';
import type { TaskStatus } from '@/types';

const statusConfig: Record<
  TaskStatus,
  { label: string; container: string; dot: string }
> = {
  open: {
    label: 'To Do',
    container: 'bg-[var(--dimmed)]/20 text-[var(--muted)]',
    dot: 'bg-[var(--muted)]',
  },
  in_progress: {
    label: 'In Progress',
    container: 'bg-[var(--warn)]/15 text-[var(--warn)]',
    dot: 'bg-[var(--warn)]',
  },
  completed: {
    label: 'Done',
    container: 'bg-[var(--success)]/15 text-[var(--success)]',
    dot: 'bg-[var(--success)]',
  },
};

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cfg = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap',
        cfg.container,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
      {cfg.label}
    </span>
  );
}