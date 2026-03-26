import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed rounded-[10px]';

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--accent)] text-white hover:bg-[var(--accent2)] shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent-glow)] active:scale-[0.98]',
  secondary:
    'bg-[var(--surface2)] text-[var(--text)] border border-[var(--border2)] hover:border-[var(--accent)] hover:bg-[var(--surface)] active:scale-[0.98]',
  ghost:
    'bg-transparent text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)] active:scale-[0.98]',
  danger:
    'bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/30 hover:bg-[var(--danger)]/20 active:scale-[0.98]',
};

const sizes: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5 h-7',
  md: 'text-sm px-4 py-2 h-9',
  lg: 'text-sm px-6 py-3 h-11',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', loading, fullWidth, className, children, disabled, ...rest },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      disabled={disabled || loading}
      style={{ fontFamily: 'var(--font-body)' }}
      {...rest}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
);

Button.displayName = 'Button';
