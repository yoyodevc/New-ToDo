import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Calendar,
  CalendarRange,
  List,
  CheckCircle,
  AlertCircle,
  Settings,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskCounts } from '@/store/use-task-counts';

interface SmartListItemProps {
  label: string;
  count: number;
  icon: React.ElementType;
  onClick: () => void;
  overdue?: boolean;
  color: string;
}

function SmartListItem({
  label,
  count,
  icon: Icon,
  onClick,
  overdue,
  color,
}: SmartListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left transition-all duration-150',
        'hover:bg-[rgb(var(--surface-2))]/60'
      )}
    >
      <span
        className="flex h-6 w-6 items-center justify-center rounded-lg flex-shrink-0"
        style={{
          backgroundColor: `${color}20`,
          color: color,
        }}
      >
        <Icon
          size={13}
          strokeWidth={2.2}
          className="flex-shrink-0"
        />
      </span>

      <span
        className="flex-1 text-[13px] font-medium"
        style={{ color: 'rgb(var(--text))' }}
      >
        {label}
      </span>

      {count > 0 && (
        <span
          className="text-[11px] font-normal tabular-nums opacity-70"
          style={{ color: 'rgb(var(--text-3))' }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  end?: boolean;
}

function NavItem({ href, label, icon: Icon, end }: NavItemProps) {
  return (
    <NavLink
      to={href}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-[13px] font-medium transition-all duration-150',
          isActive
            ? 'bg-[rgb(var(--surface-2))] text-[rgb(var(--text))] shadow-[inset_0_0_0_1px_rgb(var(--border-soft))]'
            : 'text-[rgb(var(--text-2))] hover:bg-[rgb(var(--surface-2))]/60 hover:text-[rgb(var(--text))]'
        )
      }
    >
      <Icon size={15} strokeWidth={2} />
      {label}
    </NavLink>
  );
}

export function Sidebar() {
  const navigate = useNavigate();
  const counts = useTaskCounts();

  return (
    <aside
      className="flex h-full flex-col py-5 px-3"
      style={{
        width: 'var(--sidebar-w)',
        borderRight: '1px solid rgb(var(--border-soft))',
        backgroundColor: 'rgb(var(--surface))',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2 px-2.5">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-[8px]"
          style={{ background: 'rgb(var(--accent))' }}
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L3 6v6c0 5.25 3.84 10.14 9 11 5.16-.86 9-5.75 9-11V6l-9-4z" />
            <path d="M9 11.5L11 13.5L15 9.5" />
          </svg>
        </div>

        <span
          className="text-[15px] font-bold tracking-tight"
          style={{ color: 'rgb(var(--text))' }}
        >
          PrivateTasks
        </span>
      </div>

      {/* Dashboard */}
      <div className="mb-1">
        <NavItem
          href="/"
          label="Dashboard"
          icon={LayoutDashboard}
          end
        />
      </div>

      {/* Divider */}
      <div
        className="my-3 h-px"
        style={{ background: 'rgb(var(--border-soft))' }}
      />

      {/* Smart Lists */}
      <div className="mb-2">
        <p
          className="mb-2 px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em]"
          style={{ color: 'rgb(var(--text-3))' }}
        >
          Smart Lists
        </p>

        <div className="space-y-0.5">
          <SmartListItem
            label="Today"
            count={counts.today}
            icon={Calendar}
            color="rgb(var(--accent))"
            onClick={() => navigate('/tasks?filter=today')}
          />

          <SmartListItem
            label="Upcoming"
            count={counts.upcoming}
            icon={CalendarRange}
            color="rgb(var(--purple))"
            onClick={() => navigate('/tasks?filter=upcoming')}
          />

          <SmartListItem
            label="All Tasks"
            count={counts.all}
            icon={List}
            color="rgb(var(--text-2))"
            onClick={() => navigate('/tasks')}
          />

          <SmartListItem
            label="Completed"
            count={counts.completed}
            icon={CheckCircle}
            color="rgb(var(--green))"
            onClick={() => navigate('/tasks?filter=completed')}
          />

          {counts.overdue > 0 && (
            <SmartListItem
              label="Overdue"
              count={counts.overdue}
              icon={AlertCircle}
              color="rgb(var(--red))"
              overdue
              onClick={() => navigate('/tasks?filter=overdue')}
            />
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom nav */}
      <div className="space-y-0.5">
        <div
          className="my-3 h-px"
          style={{ background: 'rgb(var(--border-soft))' }}
        />

        <NavItem
          href="/settings"
          label="Settings"
          icon={Settings}
        />

        <NavItem
          href="/privacy"
          label="Privacy"
          icon={Lock}
        />
      </div>

      {/* Offline badge */}
      <div
        className="mt-4 rounded-[12px] px-3 py-2.5"
        style={{ background: 'rgb(var(--surface-2))' }}
      >
        <div className="mb-0.5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--green))]" />

          <span
            className="text-[12px] font-semibold"
            style={{ color: 'rgb(var(--text))' }}
          >
            Offline Ready
          </span>
        </div>

        <p
          className="text-[11px] leading-relaxed"
          style={{ color: 'rgb(var(--text-3))' }}
        >
          Your data never leaves this device.
        </p>
      </div>
    </aside>
  );
}