import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/store/db';
import { useTaskCounts } from '@/store/use-task-counts';
import { CompletionCircle } from '@/components/ui/completion-circle';
import { Modal } from '@/components/ui/modal';
import { TaskForm } from '@/features/tasks/task-form';
import {
  Calendar,
  CalendarRange,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

interface StatCardProps {
  label: string;
  count: number;
  icon: React.ElementType;
  colorClass: string;
  filter: string;
}

const cardConfig = {
  'smart-list-today': { accent: 'rgb(var(--accent))', sub: 'Due now' },
  'smart-list-upcoming': { accent: 'rgb(var(--purple))', sub: '7 days' },
  'smart-list-completed': { accent: 'rgb(var(--green))', sub: 'All time' },
  'smart-list-overdue': { accent: 'rgb(var(--red))', sub: 'Attention' },
};

function StatCard({ label, count, icon: Icon, colorClass, filter }: StatCardProps) {
  const navigate = useNavigate();
  const cfg = cardConfig[colorClass as keyof typeof cardConfig];

  return (
    <button
      onClick={() => navigate(`/tasks?filter=${filter}`)}
      className="group relative flex flex-col justify-between rounded-[16px]
                 border border-[rgb(var(--border-soft))]
                 bg-[rgb(var(--surface))]
                 p-4 text-left h-[105px]
                 transition-all duration-200 ease-out
                 hover:border-[rgb(var(--accent))] hover:shadow-[0_4px_12px_rgba(0,102,204,0.06)]
                 dark:hover:shadow-[0_4px_12px_rgba(0,102,204,0.15)]
                 active:scale-[0.98] w-full cursor-pointer"
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-[12px] font-semibold text-[rgb(var(--text-2))]" style={{ letterSpacing: '-0.01em' }}>
          {label}
        </span>
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-200"
          style={{
            backgroundColor: `${cfg.accent.replace(')', ', 0.12)')}`,
            color: cfg.accent,
          }}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
        </span>
      </div>

      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className="text-[26px] font-semibold leading-none tracking-tight tabular-nums text-[rgb(var(--text))]">
          {count}
        </span>
        <span className="text-[10px] font-medium text-[rgb(var(--text-3))]" style={{ color: cfg.accent }}>
          {cfg.sub}
        </span>
      </div>
    </button>
  );
}

export function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const counts = useTaskCounts();

  const todayTasks = useLiveQuery(async () => {
    const tasks = await db.tasks.toArray();
    const cats = await db.categories.toArray();
    const catMap = new Map(cats.map((c) => [c.id, c]));
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    return tasks
      .filter((t) => {
        if (t.status === 'completed') return false;
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        return d <= todayEnd;
      })
      .slice(0, 6)
      .map((t) => ({ task: t, category: catMap.get(t.categoryId) }));
  });

  const handleToggle = async (id: string, status: string) => {
    await db.tasks.update(id, {
      status: status === 'pending' ? 'completed' : 'pending',
      updatedAt: new Date().toISOString(),
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0;
    if (isSameDay(d, new Date())) return hasTime ? format(d, 'h:mm a') : 'Today';
    return format(d, 'MMM d');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <p className="text-[13px] font-medium mb-1" style={{ color: 'rgb(var(--text-3))' }}>
          {format(new Date(), 'EEEE, MMMM d')}
        </p>
        <h1 className="text-display" style={{ color: 'rgb(var(--text))' }}>
          {getGreeting()}
        </h1>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.06, ease: 'easeOut' }}
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
      >
        <StatCard label="Today" count={counts.today} icon={Calendar} colorClass="smart-list-today" filter="today" />
        <StatCard label="Upcoming" count={counts.upcoming} icon={CalendarRange} colorClass="smart-list-upcoming" filter="upcoming" />
        <StatCard label="Completed" count={counts.completed} icon={CheckCircle} colorClass="smart-list-completed" filter="completed" />
        <StatCard label="Overdue" count={counts.overdue} icon={AlertCircle} colorClass="smart-list-overdue" filter="overdue" />
      </motion.div>

      {/* Today's Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.12, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-title-3" style={{ color: 'rgb(var(--text))' }}>Today's Tasks</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 text-[13px] font-medium transition-opacity hover:opacity-70"
            style={{ color: 'rgb(var(--accent))' }}
          >
            <Plus size={14} strokeWidth={2.5} />
            Add Task
          </button>
        </div>

        {todayTasks && todayTasks.length > 0 ? (
          <div
            className="rounded-2xl overflow-hidden divide-y divide-[rgb(var(--border-soft))]"
            style={{
              background: 'rgb(var(--surface))',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <AnimatePresence mode="popLayout">
              {todayTasks.map(({ task, category }) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: '1px solid rgb(var(--border-soft))' }}
                >
                  <CompletionCircle
                    isCompleted={task.status === 'completed'}
                    onToggle={() => handleToggle(task.id, task.status)}
                    size={20}
                  />
                  <span
                    className={cn('flex-1 text-[14px] font-medium', task.status === 'completed' && 'line-through opacity-40')}
                    style={{ color: 'rgb(var(--text))' }}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2">
                    {task.dueDate && (
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: 'rgb(var(--text-3))' }}>
                        <Clock size={10} strokeWidth={2} />
                        {formatTime(task.dueDate)}
                      </span>
                    )}
                    {category && (
                      <span
                        className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                        style={{ background: category.color }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* View all link */}
            <button
              onClick={() => window.location.assign('/tasks?filter=today')}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-medium transition-opacity hover:opacity-70"
              style={{ color: 'rgb(var(--text-3))' }}
            >
              View all <ArrowRight size={13} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <div
            className="rounded-2xl px-6 py-12 text-center border border-[rgb(var(--border-soft))] flex flex-col items-center justify-center"
            style={{ background: 'rgb(var(--surface))', boxShadow: 'var(--shadow-sm)' }}
          >
            {/* Circular recess container with soft shadows */}
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                background: 'rgb(var(--surface-2))',
                boxShadow: 'inset 1.5px 1.5px 4px rgba(0,0,0,0.04), inset -1.5px -1.5px 4px rgba(255,255,255,0.5), 1.5px 1.5px 6px rgba(0,0,0,0.01)',
              }}
            >
              <CheckCircle size={20} strokeWidth={1.5} style={{ color: 'rgb(var(--accent))' }} />
            </div>
            <p className="text-[15px] font-semibold mb-1" style={{ color: 'rgb(var(--text))' }}>
              All caught up
            </p>
            <p className="text-[13px] max-w-[240px] leading-relaxed" style={{ color: 'rgb(var(--text-2))' }}>
              Tasks with today's due date will appear here.
            </p>
          </div>
        )}
      </motion.div>

      {/* New Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Task">
        <TaskForm onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
