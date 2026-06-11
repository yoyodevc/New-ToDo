import { motion } from 'framer-motion';
import { format, isSameDay } from 'date-fns';
import { Clock, Trash2, Pencil, Zap } from 'lucide-react';
import type { Task, Category } from '@/types';
import { cn, isOverdue } from '../../lib/utils';
import { CompletionCircle } from '@/components/ui/completion-circle';

const PRIORITY_DOT: Record<Task['priority'], string> = {
  low: 'rgb(var(--green))',
  medium: 'rgb(var(--amber))',
  high: 'rgb(200,80,10)',
  critical: 'rgb(var(--red))',
};

interface TaskItemProps {
  task: Task;
  category?: Category;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, category, onToggleStatus, onDelete, onEdit }: TaskItemProps) {
  const isCompleted = task.status === 'completed';
  const isOverdueTask = !isCompleted && task.dueDate && isOverdue(task.dueDate);

  const formatDueDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0;
    const today = new Date();
    const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);

    let base = format(d, 'MMM d');
    if (d.getFullYear() !== today.getFullYear()) base = format(d, 'MMM d, yyyy');
    if (isSameDay(d, today)) base = 'Today';
    if (isSameDay(d, tomorrow)) base = 'Tomorrow';
    if (hasTime) return `${base} · ${format(d, 'h:mm a')}`;
    return base;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: isCompleted ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, x: -10, transition: { duration: 0.15 } }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="group relative flex items-start gap-3 py-3 px-1"
      style={{ borderBottom: '1px solid rgb(var(--border-soft))' }}
    >
      {/* Priority indicator */}
      {task.priority !== 'low' && (
        <div
          className="absolute left-0 top-4 bottom-4 w-[2.5px] rounded-full"
          style={{ background: PRIORITY_DOT[task.priority] }}
        />
      )}

      <div className="mt-0.5 ml-2 flex-shrink-0">
        <CompletionCircle
          isCompleted={isCompleted}
          onToggle={() => onToggleStatus(task.id, task.status)}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn('text-[14.5px] font-medium leading-snug', isCompleted && 'line-through')}
          style={{ color: isCompleted ? 'rgb(var(--text-3))' : 'rgb(var(--text))' }}
        >
          {task.title}
        </p>

        {task.description && !isCompleted && (
          <p className="text-[12.5px] mt-0.5 line-clamp-1" style={{ color: 'rgb(var(--text-3))' }}>
            {task.description}
          </p>
        )}

        {/* Metadata */}
        {!isCompleted && (task.dueDate || category) && (
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {task.dueDate && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[11px] font-medium',
                  isOverdueTask ? 'text-[rgb(var(--red))]' : ''
                )}
                style={{ color: isOverdueTask ? undefined : 'rgb(var(--text-3))' }}
              >
                <Clock size={10} strokeWidth={2.5} />
                {formatDueDate(task.dueDate)}
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: 'rgb(var(--text-3))' }}>
                <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: category.color }} />
                {category.name}
              </span>
            )}
            {task.urgent && !isCompleted && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold"
                style={{ color: 'rgb(var(--amber))' }}
              >
                <Zap size={10} strokeWidth={2.5} />
                Urgent
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0 mt-0.5">
        <button
          onClick={() => onEdit(task)}
          className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-[rgb(var(--surface-2))]"
          style={{ color: 'rgb(var(--text-3))' }}
          aria-label="Edit task"
        >
          <Pencil size={12} strokeWidth={2} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-[rgb(var(--red))]/10 hover:text-[rgb(var(--red))]"
          style={{ color: 'rgb(var(--text-3))' }}
          aria-label="Delete task"
        >
          <Trash2 size={12} strokeWidth={2} />
        </button>
      </div>
    </motion.div>
  );
}
