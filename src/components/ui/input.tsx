import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'w-full rounded-[10px] border border-[rgb(var(--border-soft))] bg-[rgb(var(--surface-2))]',
          'px-3 py-2 text-[15px] text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-3))]',
          'transition-all duration-150',
          'focus:outline-none focus:border-[rgb(var(--accent))] focus:bg-[rgb(var(--surface))] focus:ring-3 focus:ring-[rgb(var(--accent))]/15',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'dark:border-[rgb(var(--border))]',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
