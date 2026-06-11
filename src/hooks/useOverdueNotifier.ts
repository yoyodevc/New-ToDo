import { useEffect, useRef } from 'react';
import { db } from '@/store/db';
import { getEmailConfig, sendOverdueEmail } from '@/lib/emailService';
import { isOverdue } from '../lib/utils';

const NOTIFIED_KEY = 'overdue_notified_ids';
const CHECK_INTERVAL = 60_000; // 1 min

const getNotified = (): Set<string> => {
  try { return new Set(JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]')); }
  catch { return new Set(); }
};

const addNotified = (ids: string[]) => {
  const set = getNotified();
  ids.forEach((id) => set.add(id));
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...set]));
};

type ToastFn = (opts: { type: 'success' | 'error' | 'info'; title: string; message?: string }) => void;

export function useOverdueNotifier(toast?: ToastFn) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastRef = useRef(toast);
  toastRef.current = toast;

  const check = async () => {
    const cfg = getEmailConfig();

    const tasks = await db.tasks
      .filter((t) => t.urgent === true && t.status === 'pending' && !!t.dueDate && isOverdue(t.dueDate))
      .toArray();

    if (tasks.length === 0) return;

    const notified = getNotified();
    const fresh = tasks.filter((t) => !notified.has(t.id));
    if (fresh.length === 0) return;

    // Always show in-app message
    const names = fresh.map((t) => t.title).join(', ');
    toastRef.current?.({
      type: 'error',
      title: `${fresh.length} urgent task${fresh.length > 1 ? 's' : ''} overdue`,
      message: names,
    });

    if (!cfg) return;

    try {
      await sendOverdueEmail(cfg, fresh.map((t) => ({ title: t.title, dueDate: t.dueDate! })));
      addNotified(fresh.map((t) => t.id));
      toastRef.current?.({
        type: 'success',
        title: 'Overdue alert sent',
        message: `Email sent to ${cfg.userEmail}`,
      });
    } catch {
      toastRef.current?.({
        type: 'error',
        title: 'Email failed to send',
        message: 'Check your EmailJS config in Settings.',
      });
    }
  };

  useEffect(() => {
    check();
    timerRef.current = setInterval(check, CHECK_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);
}
