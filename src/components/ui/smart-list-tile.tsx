import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartListTileProps {
  label: string;
  count: number;
  icon: LucideIcon;
  colorClass: string;
  href: string;
  filter?: string;
}

export function SmartListTile({ label, count, icon: Icon, colorClass, href, filter }: SmartListTileProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (filter) {
      navigate(`${href}?filter=${filter}`);
    } else {
      navigate(href);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={cn(
        'relative flex flex-col gap-3 rounded-2xl p-4 text-left w-full',
        'transition-shadow duration-200 cursor-pointer',
        'bg-[rgb(var(--surface))] hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))]'
      )}
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          colorClass
        )}
      >
        <Icon size={20} strokeWidth={2.2} />
      </div>

      {/* Count */}
      <div className="flex flex-col gap-0.5">
        <span
          className="text-[28px] font-bold leading-none tracking-tight"
          style={{ color: 'rgb(var(--text))' }}
        >
          {count}
        </span>
        <span
          className="text-[13px] font-medium"
          style={{ color: 'rgb(var(--text-2))' }}
        >
          {label}
        </span>
      </div>
    </motion.button>
  );
}
