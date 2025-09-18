import { ReactNode } from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <Sidebar />
      <div>
        <Topbar />
        <main className="p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}
