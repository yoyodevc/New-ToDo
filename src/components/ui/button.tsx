import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 select-none';

    const variants: Record<string, string> = {
      primary:
        'bg-[rgb(var(--accent))] text-white hover:opacity-90 active:opacity-80 rounded-[10px]',
      secondary:
        'bg-[rgb(var(--surface-2))] text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-3))] active:opacity-80 rounded-[10px]',
      ghost:
        'text-[rgb(var(--text-2))] hover:bg-[rgb(var(--surface-2))] hover:text-[rgb(var(--text))] active:opacity-80 rounded-[8px]',
      destructive:
        'bg-[rgb(var(--red))]/10 text-[rgb(var(--red))] hover:bg-[rgb(var(--red))]/20 active:opacity-80 rounded-[10px]',
      outline:
        'border border-[rgb(var(--border))] bg-transparent text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))] active:opacity-80 rounded-[10px]',
    };

    const sizes: Record<string, string> = {
      sm:   'h-8 px-3 text-[13px] gap-1.5',
      md:   'h-9 px-4 text-[14px] gap-2',
      lg:   'h-11 px-5 text-[15px] gap-2',
      icon: 'h-9 w-9',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
