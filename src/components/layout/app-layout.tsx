import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './theme-provider';
import { Sidebar } from './sidebar';
import { MobileNav } from './mobile-nav';

export function AppLayout() {
  return (
    <ThemeProvider>
      <div
        className="flex h-screen w-screen items-center justify-center p-0 md:p-6"
        style={{ backgroundColor: 'rgb(var(--bg))' }}
      >
        <div
          className="flex h-full w-full md:max-w-[1020px] md:max-h-[720px] overflow-hidden md:rounded-[20px] md:border md:shadow-lg relative"
          style={{
            backgroundColor: 'rgb(var(--surface))',
            borderColor: 'rgb(var(--border-soft))',
          }}
        >
          {/* Desktop sidebar — hidden on mobile */}
          <div className="hidden md:flex">
            <Sidebar />
          </div>

          {/* Main scrollable area */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mx-auto max-w-3xl px-6 py-10 md:px-8 pb-20 md:pb-10">
              <Outlet />
            </div>
          </main>

          {/* Mobile bottom nav — hidden on desktop */}
          <MobileNav />
        </div>
      </div>
    </ThemeProvider>
  );
}
