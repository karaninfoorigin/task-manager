import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className, id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-medium text-[var(--muted)] uppercase tracking-wider font-[var(--font-display)]"
          >
            {label}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dimmed)] pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-[10px] border text-sm transition-all duration-200',
              'bg-[var(--surface2)] text-[var(--text)] placeholder:text-[var(--dimmed)]',
              'border-[var(--border)] focus:border-[var(--accent)] focus:outline-none',
              'focus:shadow-[0_0_0_3px_var(--accent-glow)]',
              leftIcon ? 'pl-9 pr-3 py-2.5' : 'px-3 py-2.5',
              error &&
                'border-[var(--danger)] focus:border-[var(--danger)] focus:shadow-[0_0_0_3px_rgba(248,113,113,0.25)]',
              className
            )}
            {...rest}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-[12px] text-[var(--danger)]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';