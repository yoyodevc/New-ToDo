import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60]"
            style={{
              background: 'rgba(0,0,0,0.28)',
              backdropFilter: 'blur(6px)',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              height: '100dvh',
            }}
            onClick={onClose}
          />

          {/* Panel */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className={cn(
                'w-full max-w-[480px] pointer-events-auto',
                'rounded-2xl bg-[rgb(var(--surface))]',
                'overflow-visible flex flex-col max-h-[90dvh]',
                className
              )}
              style={{ boxShadow: 'var(--shadow-lg)' }}
            >
              {/* Header */}
              {title && (
                <div
                  className="flex items-center justify-between px-5 pt-4 pb-3.5 flex-shrink-0"
                  style={{ borderBottom: '1px solid rgb(var(--border-soft))' }}
                >
                  <h2 className="text-[15px] font-semibold" style={{ color: 'rgb(var(--text))' }}>
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-[rgb(var(--surface-2))]"
                    style={{ color: 'rgb(var(--text-3))' }}
                    aria-label="Close"
                  >
                    <X size={13} strokeWidth={2.5} />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="px-5 py-4 overflow-y-auto overflow-x-visible flex-1">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
