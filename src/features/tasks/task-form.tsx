import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/store/db';
import type { Task, Priority } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DateTimePicker } from '@/components/ui/date-time-picker';

interface TaskFormProps {
  initialData?: Task;
  onSuccess: () => void;
  onCancel: () => void;
}

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'rgb(var(--green))' },
  { value: 'medium', label: 'Medium', color: 'rgb(var(--amber))' },
  { value: 'high', label: 'High', color: 'rgb(200,80,10)' },
  { value: 'critical', label: 'Critical', color: 'rgb(var(--red))' },
];

export function TaskForm({ initialData, onSuccess, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'medium');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [urgent, setUrgent] = useState(initialData?.urgent || false);

  const categories = useLiveQuery(() => db.categories.toArray());

  useEffect(() => {
    if (categories && categories.length > 0 && !categoryId && !initialData) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId, initialData]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && title.trim() && categoryId) {
        handleSubmit(new Event('submit') as any);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  });

  const handleSubmit = async (e: React.FormEvent | Event) => {
    if ('preventDefault' in e) e.preventDefault();
    if (!title.trim() || !categoryId) return;

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      categoryId,
      dueDate: dueDate || undefined,
      urgent: urgent || undefined,
      updatedAt: new Date().toISOString(),
    };

    if (initialData) {
      await db.tasks.update(initialData.id, taskData);
    } else {
      await db.tasks.add({
        ...taskData,
        id: crypto.randomUUID(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      } as Task);
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <input
        id="task-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        autoFocus
        required
        className="w-full rounded-[10px] px-3 py-2.5 text-[15px] font-medium focus:outline-none transition-colors"
        style={{
          background: 'rgb(var(--surface-2))',
          border: '1.5px solid transparent',
          color: 'rgb(var(--text))',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'rgb(var(--accent))')}
        onBlur={(e) => (e.target.style.borderColor = 'transparent')}
      />

      {/* Notes */}
      <textarea
        id="task-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add notes (optional)"
        rows={2}
        className="w-full rounded-[10px] px-3 py-2.5 text-[13.5px] resize-none focus:outline-none transition-colors"
        style={{
          background: 'rgb(var(--surface-2))',
          border: '1.5px solid transparent',
          color: 'rgb(var(--text))',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'rgb(var(--accent))')}
        onBlur={(e) => (e.target.style.borderColor = 'transparent')}
      />

      {/* Priority */}
      <div>
        <p className="text-label mb-2" style={{ color: 'rgb(var(--text-3))' }}>Priority</p>
        <div className="flex gap-1.5">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={cn(
                'flex-1 py-1.5 rounded-[8px] text-[12.5px] font-medium transition-all duration-150',
                priority === p.value ? 'text-white' : 'bg-[rgb(var(--surface-2))] hover:bg-[rgb(var(--surface-3))]'
              )}
              style={
                priority === p.value
                  ? { background: p.color }
                  : { color: 'rgb(var(--text-2))' }
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      {categories && categories.length > 0 && (
        <div>
          <p className="text-label mb-2" style={{ color: 'rgb(var(--text-3))' }}>Category</p>
          <div className="flex gap-1.5">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryId(c.id)}
                className={cn(
                  'flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-[8px] text-[12.5px] font-medium transition-all duration-150',
                  categoryId === c.id ? 'text-white' : 'bg-[rgb(var(--surface-2))] hover:bg-[rgb(var(--surface-3))]'
                )}
                style={
                  categoryId === c.id
                    ? { background: c.color }
                    : { color: 'rgb(var(--text-2))' }
                }
              >
                <span
                  className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{ background: categoryId === c.id ? 'rgba(255,255,255,0.6)' : c.color }}
                />
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Due Date */}
      <div>
        <p className="text-label mb-2" style={{ color: 'rgb(var(--text-3))' }}>Due Date</p>
        <DateTimePicker value={dueDate} onChange={setDueDate} urgent={urgent} onUrgentChange={setUrgent} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px]" style={{ color: 'rgb(var(--text-3))' }}>⌘ Enter to submit</span>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary" size="sm" disabled={!title.trim() || !categoryId}>
            {initialData ? 'Save' : 'Create'}
          </Button>
        </div>
      </div>
    </form>
  );
}
