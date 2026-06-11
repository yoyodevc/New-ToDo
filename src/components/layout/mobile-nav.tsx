import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Settings, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/privacy', label: 'Privacy', icon: Lock },
];

export function MobileNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 pb-safe md:hidden"
      style={{
        background: 'rgba(var(--surface) / 0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid rgb(var(--border-soft))',
        height: '60px',
      }}
    >
      {navItems.map(({ href, label, icon: Icon }) => (
        <NavLink
          key={href}
          to={href}
          end={href === '/'}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all duration-150',
              isActive
                ? 'text-[rgb(var(--accent))]'
                : 'text-[rgb(var(--text-3))]'
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
