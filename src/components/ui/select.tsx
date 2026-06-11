import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full appearance-none rounded-[10px] border border-[rgb(var(--border-soft))] bg-[rgb(var(--surface-2))]',
          'px-3 py-2 text-[15px] text-[rgb(var(--text))]',
          'transition-all duration-150 cursor-pointer',
          'focus:outline-none focus:border-[rgb(var(--accent))] focus:bg-[rgb(var(--surface))] focus:ring-3 focus:ring-[rgb(var(--accent))]/15',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';
