import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { db } from '@/store/db';
import { TaskItem } from './task-item';
import type { Task } from '@/types';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { isOverdue } from '../../lib/utils';

interface TaskListProps {
  filterStatus?: 'pending' | 'completed' | 'all';
  searchQuery?: string;
  smartFilter?: string;
  onEdit: (task: Task) => void;
}

function EmptyState({ message, subtext }: { message: string; subtext: string }) {
  const displayMessage = message === "Nothing here yet" ? "All caught up" : message;
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center select-none">
      {/* Circular recess container with soft shadows */}
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          background: 'rgb(var(--surface-2))',
          boxShadow: 'inset 1.5px 1.5px 4px rgba(0,0,0,0.04), inset -1.5px -1.5px 4px rgba(255,255,255,0.5), 1.5px 1.5px 6px rgba(0,0,0,0.01)',
        }}
      >
        <CheckCircle2 size={24} strokeWidth={1.5} style={{ color: 'rgb(var(--accent))' }} />
      </div>
      <p className="text-[17px] font-semibold mb-1 tracking-tight" style={{ color: 'rgb(var(--text))' }}>
        {displayMessage}
      </p>
      <p className="text-[13.5px] max-w-[280px] leading-relaxed" style={{ color: 'rgb(var(--text-2))' }}>
        {subtext}
      </p>
    </div>
  );
}

export function TaskList({ filterStatus = 'all', searchQuery = '', smartFilter, onEdit }: TaskListProps) {
  const [showCompleted, setShowCompleted] = useState(false);

  const data = useLiveQuery(async () => {
    const tasks = await db.tasks.toArray();
    const categoriesArray = await db.categories.toArray();
    const categories = new Map(categoriesArray.map((c) => [c.id, c]));
    return { tasks, categories };
  });

  if (!data) {
    return (
      <div className="py-8 text-center text-[13px]" style={{ color: 'rgb(var(--text-3))' }}>
        Loading…
      </div>
    );
  }

  const { tasks, categories } = data;
  const now = new Date();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  // Apply smart filter + status filter + search
  const filtered = tasks.filter((task) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!task.title.toLowerCase().includes(q) && !task.description?.toLowerCase().includes(q)) {
        return false;
      }
    }

    if (smartFilter === 'today') {
      if (task.status === 'completed') return false;
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      return due <= todayEnd;
    }
    if (smartFilter === 'upcoming') {
      if (task.status === 'completed') return false;
      if (!task.dueDate) return false;
      return new Date(task.dueDate) > todayEnd;
    }
    if (smartFilter === 'completed') {
      return task.status === 'completed';
    }
    if (smartFilter === 'overdue') {
      if (task.status === 'completed') return false;
      if (!task.dueDate) return false;
      return isOverdue(task.dueDate);
    }

    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    return true;
  });

  const pending = filtered
    .filter((t) => t.status === 'pending')
    .sort((a, b) => {
      // Sort by: overdue → today → upcoming → no date
      const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return aDate - bDate;
    });

  const completed = filtered
    .filter((t) => t.status === 'completed')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    await db.tasks.update(id, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDelete = async (id: string) => {
    await db.tasks.delete(id);
  };

  if (filtered.length === 0) {
    if (searchQuery) {
      return (
        <EmptyState
          message="No results"
          subtext={`Nothing matched "${searchQuery}". Try a different search.`}
        />
      );
    }
    if (smartFilter === 'today') {
      return <EmptyState message="All clear today" subtext="No tasks are due today. Enjoy your day." />;
    }
    if (smartFilter === 'completed') {
      return <EmptyState message="Nothing completed yet" subtext="Complete your first task to see it here." />;
    }
    return (
      <EmptyState
        message="Nothing here yet"
        subtext="Create your first task to get started."
      />
    );
  }

  // If smart filter is 'completed' or status filter is 'completed', show only completed list directly
  if (smartFilter === 'completed' || filterStatus === 'completed') {
    return (
      <div>
        <AnimatePresence mode="popLayout">
          {completed.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              category={categories.get(task.categoryId)}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              onEdit={onEdit}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div>
      {/* Pending tasks */}
      <AnimatePresence mode="popLayout">
        {pending.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            category={categories.get(task.categoryId)}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
            onEdit={onEdit}
          />
        ))}
      </AnimatePresence>

      {/* Completed section */}
      {completed.length > 0 && filterStatus !== 'pending' && !smartFilter && (
        <div className="mt-6">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 mb-2 group"
            style={{ color: 'rgb(var(--text-2))' }}
          >
            <motion.div
              animate={{ rotate: showCompleted ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} strokeWidth={2.5} />
            </motion.div>
            <span className="text-[13px] font-semibold">
              Completed · {completed.length}
            </span>
          </button>

          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden' }}
              >
                <AnimatePresence mode="popLayout">
                  {completed.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      category={categories.get(task.categoryId)}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDelete}
                      onEdit={onEdit}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
