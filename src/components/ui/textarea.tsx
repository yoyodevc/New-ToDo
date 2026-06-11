import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={3}
        className={cn(
          'w-full rounded-[10px] border border-[rgb(var(--border-soft))] bg-[rgb(var(--surface-2))]',
          'px-3 py-2 text-[15px] text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-3))]',
          'resize-none transition-all duration-150',
          'focus:outline-none focus:border-[rgb(var(--accent))] focus:bg-[rgb(var(--surface))] focus:ring-3 focus:ring-[rgb(var(--accent))]/15',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
