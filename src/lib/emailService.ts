import emailjs from '@emailjs/browser';

export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
  userEmail: string;
}

const STORAGE_KEY = 'emailjs_config';

export const getEmailConfig = (): EmailConfig | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

export const setEmailConfig = (cfg: EmailConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
};

export const clearEmailConfig = () => localStorage.removeItem(STORAGE_KEY);

export const sendOverdueEmail = async (
  cfg: EmailConfig,
  tasks: { title: string; dueDate: string }[]
) => {
  const taskList = tasks.map((t) => `• ${t.title} (due: ${new Date(t.dueDate).toLocaleString()})`).join('\n');
  return emailjs.send(
    cfg.serviceId,
    cfg.templateId,
    {
      to_email: cfg.userEmail,
      task_list: taskList,
      task_count: tasks.length,
    },
    cfg.publicKey
  );
};
