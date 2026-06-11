import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  CalendarDays,
  CalendarClock,
  CheckCircle2,
  List,
  Settings,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskCounts } from '@/store/use-task-counts';

interface SmartListItemProps {
  label: string;
  count: number;
  iconClass: string;
  colorClass: string;
  onClick: () => void;
  isActive?: boolean;
}

function SmartListItem({ label, count, iconClass, colorClass, onClick, isActive }: SmartListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] transition-all duration-150 text-left',
        isActive
          ? 'bg-[rgb(var(--surface-2))]'
          : 'hover:bg-[rgb(var(--surface-2))]/70'
      )}
    >
      <span className={cn('flex h-6 w-6 items-center justify-center rounded-lg flex-shrink-0', colorClass)}>
        {iconClass === 'today'     && <CalendarDays  size={13} strokeWidth={2.2} />}
        {iconClass === 'upcoming'  && <CalendarClock size={13} strokeWidth={2.2} />}
        {iconClass === 'completed' && <CheckCircle2  size={13} strokeWidth={2.2} />}
        {iconClass === 'all'       && <List          size={13} strokeWidth={2.2} />}
        {iconClass === 'overdue'   && <AlertCircle   size={13} strokeWidth={2.2} />}
      </span>

      <span className="flex-1 text-[13.5px] font-medium" style={{ color: 'rgb(var(--text))' }}>
        {label}
      </span>

      {count > 0 && (
        <span className="text-[11.5px] font-medium tabular-nums" style={{ color: 'rgb(var(--text-3))' }}>
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
          'flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-[13.5px] font-medium transition-all duration-150',
          isActive
            ? 'bg-[rgb(var(--surface-2))] text-[rgb(var(--text))]'
            : 'text-[rgb(var(--text-2))] hover:bg-[rgb(var(--surface-2))]/70 hover:text-[rgb(var(--text))]'
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
      <div className="flex items-center gap-2 px-2.5 mb-6">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-[8px]"
          style={{ background: 'rgb(var(--accent))' }}
        >
          <ShieldCheck size={14} strokeWidth={2.5} color="white" />
        </div>
        <span className="text-[15px] font-bold tracking-tight" style={{ color: 'rgb(var(--text))' }}>
          PrivateTasks
        </span>
      </div>

      {/* Dashboard */}
      <div className="mb-1">
        <NavItem href="/" label="Dashboard" icon={LayoutDashboard} end />
      </div>

      {/* Divider */}
      <div className="my-3 h-px" style={{ background: 'rgb(var(--border-soft))' }} />

      {/* Smart Lists */}
      <div className="mb-2">
        <p className="text-label px-2.5 mb-2" style={{ color: 'rgb(var(--text-3))' }}>
          Smart Lists
        </p>
        <div className="space-y-0.5">
          <SmartListItem
            label="Today"
            count={counts.today}
            iconClass="today"
            colorClass="smart-list-today"
            onClick={() => navigate('/tasks?filter=today')}
          />
          <SmartListItem
            label="Upcoming"
            count={counts.upcoming}
            iconClass="upcoming"
            colorClass="smart-list-upcoming"
            onClick={() => navigate('/tasks?filter=upcoming')}
          />
          <SmartListItem
            label="All Tasks"
            count={counts.all}
            iconClass="all"
            colorClass="smart-list-all"
            onClick={() => navigate('/tasks')}
          />
          <SmartListItem
            label="Completed"
            count={counts.completed}
            iconClass="completed"
            colorClass="smart-list-completed"
            onClick={() => navigate('/tasks?filter=completed')}
          />
          {counts.overdue > 0 && (
            <SmartListItem
              label="Overdue"
              count={counts.overdue}
              iconClass="overdue"
              colorClass="smart-list-overdue"
              onClick={() => navigate('/tasks?filter=overdue')}
            />
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom nav */}
      <div className="space-y-0.5">
        <div className="my-3 h-px" style={{ background: 'rgb(var(--border-soft))' }} />
        <NavItem href="/settings" label="Settings" icon={Settings} />
        <NavItem href="/privacy" label="Privacy" icon={Lock} />
      </div>

      {/* Offline badge */}
      <div
        className="mt-4 rounded-[12px] px-3 py-2.5"
        style={{ background: 'rgb(var(--surface-2))' }}
      >
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--green))]" />
          <span className="text-[12px] font-semibold" style={{ color: 'rgb(var(--text))' }}>
            Offline Ready
          </span>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: 'rgb(var(--text-3))' }}>
          Your data never leaves this device.
        </p>
      </div>
    </aside>
  );
}
