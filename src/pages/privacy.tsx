import { motion } from 'framer-motion';
import { ShieldCheck, HardDrive, UserX, EyeOff, WifiOff, User, Globe, Database } from 'lucide-react';

const features = [
  {
    icon: HardDrive,
    title: 'Local-Only Storage',
    description:
      "All tasks are stored exclusively in your browser's IndexedDB. Nothing is ever sent to any server — because there are no servers.",
  },
  {
    icon: UserX,
    title: 'No Accounts Required',
    description:
      'There is nothing to sign up for. No email, no password, no profile. Open the app and start using it immediately.',
  },
  {
    icon: EyeOff,
    title: 'Zero Tracking',
    description:
      'No analytics. No telemetry. No cookies. We have no idea who you are, and that\'s exactly how it should be.',
  },
  {
    icon: WifiOff,
    title: 'Offline First',
    description:
      'PrivateTasks works entirely without an internet connection. Turn on airplane mode and everything still works perfectly.',
  },
];

const ANIM = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0 },
};

export function PrivacyPage() {
  return (
    <div className="space-y-16">

      {/* Hero */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={ANIM}
        transition={{ duration: 0.4 }}
        className="text-center pt-4"
      >
        <div
          className="inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-6"
          style={{ background: 'rgb(var(--surface))', boxShadow: 'var(--shadow-md)' }}
        >
          <ShieldCheck size={32} strokeWidth={1.5} style={{ color: 'rgb(var(--accent))' }} />
        </div>
        <h1 className="text-title-1 mb-3" style={{ color: 'rgb(var(--text))' }}>
          Built for Privacy
        </h1>
        <p className="text-[16px] leading-relaxed max-w-lg mx-auto" style={{ color: 'rgb(var(--text-2))' }}>
          PrivateTasks was designed from the ground up with privacy as a first principle — not an afterthought.
        </p>
      </motion.div>

      {/* Data Flow Diagram */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={ANIM}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-3xl p-8 text-center"
        style={{ background: 'rgb(var(--surface))', boxShadow: 'var(--shadow-sm)' }}
      >
        <p className="text-label mb-8" style={{ color: 'rgb(var(--text-3))' }}>
          Where your data lives
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          {/* You */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgb(var(--surface-2))', color: 'rgb(var(--text-2))' }}
            >
              <User size={24} strokeWidth={1.5} />
            </div>
            <span className="text-[13px] font-semibold" style={{ color: 'rgb(var(--text))' }}>You</span>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.35 }}
            className="flex items-center gap-1"
            style={{ color: 'rgb(var(--text-3))' }}
          >
            <div className="hidden md:block h-px w-10 bg-current" />
            <svg width="10" height="10" viewBox="0 0 10 10" className="rotate-90 md:rotate-0">
              <path d="M0 5 L7 5 M5 2 L8 5 L5 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          {/* Browser */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgb(var(--surface-2))', color: 'rgb(var(--text-2))' }}
            >
              <Globe size={24} strokeWidth={1.5} />
            </div>
            <span className="text-[13px] font-semibold" style={{ color: 'rgb(var(--text))' }}>Browser</span>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-1"
            style={{ color: 'rgb(var(--text-3))' }}
          >
            <div className="hidden md:block h-px w-10 bg-current" />
            <svg width="10" height="10" viewBox="0 0 10 10" className="rotate-90 md:rotate-0">
              <path d="M0 5 L7 5 M5 2 L8 5 L5 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          {/* IndexedDB */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(var(--accent), 0.1)', color: 'rgb(var(--accent))' }}
            >
              <Database size={24} strokeWidth={1.5} />
            </div>
            <span className="text-[13px] font-semibold" style={{ color: 'rgb(var(--text))' }}>IndexedDB</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: 'rgb(var(--surface-2))' }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: 'rgb(var(--green))' }} />
          <span className="text-[13px] font-semibold" style={{ color: 'rgb(var(--text))' }}>
            No Cloud. No Servers. No Tracking.
          </span>
        </motion.div>
      </motion.div>

      {/* Feature tiles */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={ANIM}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid sm:grid-cols-2 gap-4"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.07 }}
            className="rounded-2xl p-5"
            style={{ background: 'rgb(var(--surface))', boxShadow: 'var(--shadow-sm)' }}
          >
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: 'rgba(var(--accent), 0.1)' }}
            >
              <f.icon size={20} strokeWidth={1.75} style={{ color: 'rgb(var(--accent))' }} />
            </div>
            <h3 className="text-title-3 mb-1.5" style={{ color: 'rgb(var(--text))' }}>
              {f.title}
            </h3>
            <p className="text-[14px] leading-relaxed" style={{ color: 'rgb(var(--text-2))' }}>
              {f.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
