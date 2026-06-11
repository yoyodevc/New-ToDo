import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void;
}

const ToastCtx = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}

const ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};

const COLORS: Record<ToastType, string> = {
  success: 'rgb(var(--green))',
  error: 'rgb(var(--red))',
  info: 'rgb(var(--accent))',
};

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const Icon = ICONS[t.type];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="relative flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-lg min-w-[280px] max-w-[360px]"
      style={{
        background: 'rgb(var(--surface))',
        border: '1px solid rgb(var(--border-soft))',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}
    >
      <Icon size={16} style={{ color: COLORS[t.type], flexShrink: 0, marginTop: 1 }} strokeWidth={2.2} />
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold leading-snug" style={{ color: 'rgb(var(--text))' }}>
          {t.title}
        </p>
        {t.message && (
          <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: 'rgb(var(--text-2))' }}>
            {t.message}
          </p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="p-1 rounded-lg transition-colors hover:bg-[rgb(var(--surface-2))] flex-shrink-0"
        style={{ color: 'rgb(var(--text-3))' }}
      >
        <X size={12} />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts((p) => [...p, { ...opts, id }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 5000);
  }, []);

  const dismiss = (id: string) => setToasts((p) => p.filter((t) => t.id !== id));

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem toast={t} onDismiss={() => dismiss(t.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}
