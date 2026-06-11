import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { exportData, importData } from '@/lib/backup';
import { useTheme } from '@/components/layout/theme-provider';
import { Download, Upload, Sun, Moon, Monitor, Mail, CheckCircle2, X } from 'lucide-react';
import { getEmailConfig, setEmailConfig, clearEmailConfig, sendOverdueEmail, type EmailConfig } from '@/lib/emailService';
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

  const savedCfg = getEmailConfig();
  const [emailCfg, setEmailCfg] = useState<EmailConfig>(savedCfg || { serviceId: '', templateId: '', publicKey: '', userEmail: '' });
  const [emailSaved, setEmailSaved] = useState(!!savedCfg);
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  const handleSaveEmail = () => {
    setEmailConfig(emailCfg);
    setEmailSaved(true);
  };

  const handleClearEmail = () => {
    clearEmailConfig();
    setEmailCfg({ serviceId: '', templateId: '', publicKey: '', userEmail: '' });
    setEmailSaved(false);
  };

  const handleTestEmail = async () => {
    setTestStatus('sending');
    try {
      await sendOverdueEmail(emailCfg, [{ title: 'Test Urgent Task', dueDate: new Date().toISOString() }]);
      setTestStatus('ok');
    } catch {
      setTestStatus('err');
    } finally {
      setTimeout(() => setTestStatus('idle'), 3000);
    }
  };

  const emailValid = emailCfg.serviceId && emailCfg.templateId && emailCfg.publicKey && emailCfg.userEmail;

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

      {/* Email Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.09 }}
      >
        <SectionHeader title="Email Notifications" />
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgb(var(--surface))', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Mail size={14} style={{ color: 'rgb(var(--accent))' }} />
              <p className="text-[14px] font-medium" style={{ color: 'rgb(var(--text))' }}>
                Overdue Alert via EmailJS
              </p>
              {emailSaved && (
                <span className="ml-auto flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgb(var(--green))/15', color: 'rgb(var(--green))' }}>
                  <CheckCircle2 size={10} /> Connected
                </span>
              )}
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: 'rgb(var(--text-3))' }}>
              When an urgent task becomes overdue, an email is sent automatically. Powered by{' '}
              <a href="https://www.emailjs.com" target="_blank" rel="noreferrer" className="underline">EmailJS</a>{' '}
              (free tier). Create a template with variables: <code className="px-1 rounded" style={{ background: 'rgb(var(--surface-2))' }}>to_email</code>,{' '}
              <code className="px-1 rounded" style={{ background: 'rgb(var(--surface-2))' }}>task_list</code>,{' '}
              <code className="px-1 rounded" style={{ background: 'rgb(var(--surface-2))' }}>task_count</code>.
            </p>
            {[
              { key: 'userEmail', label: 'Your Email', placeholder: 'you@example.com', type: 'email' },
              { key: 'serviceId', label: 'Service ID', placeholder: 'service_xxxxxxx', type: 'text' },
              { key: 'templateId', label: 'Template ID', placeholder: 'template_xxxxxxx', type: 'text' },
              { key: 'publicKey', label: 'Public Key', placeholder: 'xxxxxxxxxxxxxxxxxxxxxx', type: 'text' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <p className="text-[11.5px] font-medium mb-1" style={{ color: 'rgb(var(--text-3))' }}>{label}</p>
                <input
                  type={type}
                  value={emailCfg[key as keyof EmailConfig]}
                  onChange={(e) => { setEmailCfg((p) => ({ ...p, [key]: e.target.value })); setEmailSaved(false); }}
                  placeholder={placeholder}
                  className="w-full rounded-[9px] px-3 py-2 text-[13px] focus:outline-none"
                  style={{ background: 'rgb(var(--surface-2))', border: '1.5px solid rgb(var(--border-soft))', color: 'rgb(var(--text))' }}
                />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSaveEmail}
                disabled={!emailValid}
                className="flex-1 py-2 rounded-[9px] text-[13px] font-medium transition-all disabled:opacity-40"
                style={{ background: 'rgb(var(--accent))', color: 'white' }}
              >
                Save
              </button>
              <button
                onClick={handleTestEmail}
                disabled={!emailValid || testStatus === 'sending'}
                className="px-4 py-2 rounded-[9px] text-[13px] font-medium transition-all disabled:opacity-40"
                style={{ background: 'rgb(var(--surface-2))', color: 'rgb(var(--text-2))' }}
              >
                {testStatus === 'sending' ? 'Sending…' : testStatus === 'ok' ? '✓ Sent!' : testStatus === 'err' ? '✗ Failed' : 'Test'}
              </button>
              {emailSaved && (
                <button
                  onClick={handleClearEmail}
                  className="p-2 rounded-[9px] transition-all hover:bg-[rgb(var(--red))]/10"
                  style={{ color: 'rgb(var(--red))' }}
                  title="Disconnect"
                >
                  <X size={14} />
                </button>
              )}
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
