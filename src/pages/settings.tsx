import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { exportData, importData } from '@/lib/backup';
import { useTheme } from '@/components/layout/theme-provider';
import { Download, Upload, Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ElementType }[] = [
  { value: 'light',  label: 'Light',  icon: Sun },
  { value: 'dark',   label: 'Dark',   icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

function SectionHeader({ title }: { title: string }) {
  return (
    <p className="text-label mb-3 px-1" style={{ color: 'rgb(var(--text-3))' }}>
      {title}
    </p>
  );
}

function SettingsRow({
  label,
  description,
  action,
}: {
  label: string;
  description?: string;
  action: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3.5"
      style={{ borderBottom: '1px solid rgb(var(--border-soft))' }}
    >
      <div>
        <p className="text-[15px] font-medium" style={{ color: 'rgb(var(--text))' }}>
          {label}
        </p>
        {description && (
          <p className="text-[13px] mt-0.5 leading-snug" style={{ color: 'rgb(var(--text-2))' }}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [exportStatus, setExportStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [importStatus, setImportStatus] = useState<'idle' | 'ok' | 'err'>('idle');

  const handleExport = async () => {
    try {
      const blob = await exportData();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `privatetasks-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportStatus('ok');
      setTimeout(() => setExportStatus('idle'), 2500);
    } catch {
      setExportStatus('err');
      setTimeout(() => setExportStatus('idle'), 2500);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        await importData(ev.target?.result as string);
        setImportStatus('ok');
        setTimeout(() => window.location.reload(), 1200);
      } catch {
        setImportStatus('err');
        setTimeout(() => setImportStatus('idle'), 2500);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-10 max-w-xl">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-display"
        style={{ color: 'rgb(var(--text))' }}
      >
        Settings
      </motion.h1>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
      >
        <SectionHeader title="Appearance" />
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgb(var(--surface))', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="px-4 py-4">
            <p className="text-[15px] font-medium mb-3" style={{ color: 'rgb(var(--text))' }}>
              Theme
            </p>
            {/* Segmented control */}
            <div
              className="flex rounded-[12px] p-1 gap-1"
              style={{ background: 'rgb(var(--surface-2))' }}
            >
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-[9px] text-[13px] font-medium transition-all duration-200',
                    theme === value
                      ? 'bg-[rgb(var(--surface))] shadow-sm'
                      : 'text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))]'
                  )}
                  style={theme === value ? { color: 'rgb(var(--text))' } : {}}
                >
                  <Icon size={14} strokeWidth={2} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
      >
        <SectionHeader title="Data" />
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgb(var(--surface))', boxShadow: 'var(--shadow-sm)' }}
        >
          <SettingsRow
            label="Export Backup"
            description="Download all your tasks as a JSON file."
            action={
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-[9px] text-[13px] font-medium transition-all hover:opacity-80"
                style={{ background: 'rgb(var(--accent))', color: 'white' }}
              >
                <Download size={13} strokeWidth={2.5} />
                {exportStatus === 'ok' ? 'Saved!' : exportStatus === 'err' ? 'Failed' : 'Export'}
              </button>
            }
          />

          <div className="flex items-center justify-between gap-4 px-4 py-3.5">
            <div>
              <p className="text-[15px] font-medium" style={{ color: 'rgb(var(--red))' }}>
                Restore from Backup
              </p>
              <p className="text-[13px] mt-0.5 leading-snug" style={{ color: 'rgb(var(--text-2))' }}>
                Overwrites all current data.
              </p>
            </div>
            <div>
              <input
                type="file"
                accept=".json"
                id="import-file"
                className="hidden"
                onChange={handleImport}
              />
              <button
                onClick={() => document.getElementById('import-file')?.click()}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-[9px] text-[13px] font-medium transition-all hover:opacity-80"
                style={{ background: 'rgb(var(--red))/10', color: 'rgb(var(--red))' }}
              >
                <Upload size={13} strokeWidth={2.5} />
                {importStatus === 'ok' ? 'Imported!' : importStatus === 'err' ? 'Failed' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
      >
        <SectionHeader title="About" />
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgb(var(--surface))', boxShadow: 'var(--shadow-sm)' }}
        >
          <SettingsRow
            label="PrivateTasks"
            description="Version 1.0 · Local-first task management"
            action={
              <span className="text-[12px] px-2.5 py-1 rounded-full" style={{ background: 'rgb(var(--surface-2))', color: 'rgb(var(--text-3))' }}>
                v1.0
              </span>
            }
          />
          <div className="px-4 py-3">
            <p className="text-[13px]" style={{ color: 'rgb(var(--text-2))' }}>
              Your tasks never leave this device. No cloud, no accounts, no tracking.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
