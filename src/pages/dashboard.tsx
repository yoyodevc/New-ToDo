import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/store/db';
import { useTaskCounts } from '@/store/use-task-counts';
import { CompletionCircle } from '@/components/ui/completion-circle';
import { Modal } from '@/components/ui/modal';
import { TaskForm } from '@/features/tasks/task-form';
import { CalendarDays, CalendarClock, CheckCircle2, AlertCircle, Plus, ArrowRight, Clock } from 'lucide-react';
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
  'smart-list-today': { accent: '#3B82F6', iconBg: 'bg-blue-50 dark:bg-blue-950', iconColor: 'text-blue-600 dark:text-blue-300', sub: 'Due now', subColor: 'text-blue-500 dark:text-blue-400' },
  'smart-list-upcoming': { accent: '#8B5CF6', iconBg: 'bg-violet-50 dark:bg-violet-950', iconColor: 'text-violet-600 dark:text-violet-300', sub: 'Next 7 days', subColor: 'text-violet-500 dark:text-violet-400' },
  'smart-list-completed': { accent: '#10B981', iconBg: 'bg-emerald-50 dark:bg-emerald-950', iconColor: 'text-emerald-600 dark:text-emerald-300', sub: 'All time', subColor: 'text-emerald-500 dark:text-emerald-400' },
  'smart-list-overdue': { accent: '#EF4444', iconBg: 'bg-red-50 dark:bg-red-950', iconColor: 'text-red-600 dark:text-red-300', sub: 'Needs attention', subColor: 'text-red-500 dark:text-red-400' },
}

function StatCard({ label, count, icon: Icon, colorClass, filter }: StatCardProps) {
  const navigate = useNavigate();
  const cfg = cardConfig[colorClass as keyof typeof cardConfig];

  return (
    <button
      onClick={() => navigate(`/tasks?filter=${filter}`)}
      className="group relative flex flex-col gap-2.5 overflow-hidden rounded-xl
                 border border-black/[0.06] dark:border-white/[0.08]
                 bg-white dark:bg-white/[0.04]
                 px-4 py-3.5 text-left
                 transition-all duration-150
                 hover:-translate-y-px hover:border-black/10 dark:hover:border-white/12
                 active:scale-[0.98] w-full"
    >
      {/* Left accent bar */}
      <span
        className="absolute inset-y-0 left-0 w-[3px] rounded-l-xl"
        style={{ backgroundColor: cfg.accent }}
      />

      {/* Icon */}
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${cfg.iconBg}`}>
        <Icon className={`h-[17px] w-[17px] ${cfg.iconColor}`} strokeWidth={1.8} />
      </span>

      {/* Text */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-[28px] font-medium leading-none tabular-nums text-foreground">
          {count}
        </p>
      </div>

      {/* Sublabel */}
      <p className={`text-xs ${cfg.subColor}`}>{cfg.sub}</p>
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
        return d >= todayStart && d <= todayEnd;
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
        <StatCard label="Today" count={counts.today} icon={CalendarDays} colorClass="smart-list-today" filter="today" />
        <StatCard label="Upcoming" count={counts.upcoming} icon={CalendarClock} colorClass="smart-list-upcoming" filter="upcoming" />
        <StatCard label="Completed" count={counts.completed} icon={CheckCircle2} colorClass="smart-list-completed" filter="completed" />
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
            className="rounded-2xl px-6 py-10 text-center"
            style={{ background: 'rgb(var(--surface))', boxShadow: 'var(--shadow-sm)' }}
          >
            <p className="text-[15px] font-medium mb-1" style={{ color: 'rgb(var(--text))' }}>
              Nothing due today
            </p>
            <p className="text-[13px]" style={{ color: 'rgb(var(--text-2))' }}>
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
