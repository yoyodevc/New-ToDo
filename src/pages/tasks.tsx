import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskList } from '@/features/tasks/task-list';
import { TaskForm } from '@/features/tasks/task-form';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types';
import { cn } from '@/lib/utils';

const FILTER_LABELS: Record<string, string> = {
  today: 'Today',
  upcoming: 'Upcoming',
  completed: 'Completed',
  overdue: 'Overdue',
};

type StatusFilter = 'all' | 'pending' | 'completed';

export function TasksPage() {
  const [searchParams] = useSearchParams();
  const smartFilter = searchParams.get('filter') || undefined;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    setStatusFilter('all');
    setSearchQuery('');
  }, [smartFilter]);

  const pageTitle = smartFilter ? FILTER_LABELS[smartFilter] ?? 'Tasks' : 'All Tasks';

  const handleOpenNewTask = () => { setEditingTask(undefined); setIsModalOpen(true); };
  const handleEditTask    = (task: Task) => { setEditingTask(task); setIsModalOpen(true); };
  const handleCloseModal  = () => { setIsModalOpen(false); setTimeout(() => setEditingTask(undefined), 200); };

  const STATUS_CHIPS: { value: StatusFilter; label: string }[] = [
    { value: 'all',       label: 'All'       },
    { value: 'pending',   label: 'Pending'   },
    { value: 'completed', label: 'Done'      },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-between gap-4 mb-7"
      >
        <h1 className="text-display" style={{ color: 'rgb(var(--text))' }}>{pageTitle}</h1>
        <Button id="new-task-btn" onClick={handleOpenNewTask} variant="primary" size="sm">
          <Plus size={15} strokeWidth={2.5} />
          New Task
        </Button>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.04 }}
        className="space-y-2.5 mb-5"
      >
        {/* Search */}
        <div className="relative">
          <Search
            size={14}
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'rgb(var(--text-3))' }}
          />
          <input
            type="text"
            placeholder="Search tasks…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[11px] pl-9 pr-9 py-2.5 text-[13.5px] transition-all duration-150 focus:outline-none"
            style={{
              background: 'rgb(var(--surface))',
              border: '1px solid rgb(var(--border-soft))',
              color: 'rgb(var(--text))',
            }}
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-4.5 w-4.5 items-center justify-center rounded-full"
                style={{ background: 'rgb(var(--text-3))', color: 'white' }}
              >
                <X size={9} strokeWidth={3} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Status chips */}
        {!smartFilter && (
          <div className="flex gap-1.5">
            {STATUS_CHIPS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={cn(
                  'px-3 py-1 rounded-full text-[12.5px] font-medium transition-all duration-150',
                  statusFilter === value
                    ? 'bg-[rgb(var(--text))] text-[rgb(var(--bg))]'
                    : 'bg-[rgb(var(--surface-2))] hover:bg-[rgb(var(--surface-3))]'
                )}
                style={statusFilter !== value ? { color: 'rgb(var(--text-2))' } : {}}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: 0.08 }}
      >
        <TaskList
          filterStatus={statusFilter}
          searchQuery={searchQuery}
          smartFilter={smartFilter}
          onEdit={handleEditTask}
        />
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTask ? 'Edit Task' : 'New Task'}>
        <TaskForm initialData={editingTask} onSuccess={handleCloseModal} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
}
