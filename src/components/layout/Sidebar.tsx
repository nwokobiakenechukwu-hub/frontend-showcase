// src/components/layout/Sidebar.tsx
import Link from 'next/link';
import type { Route } from 'next';

type NavLink = { href: Route; label: string };

const links: NavLink[] = [
  { href: '/showcase', label: 'Showcase' },
  { href: '/showcase/dashboards', label: 'Dashboards' },
  { href: '/showcase/components', label: 'Components' },
  { href: '/showcase/forms', label: 'Forms' },
  { href: '/showcase/theming', label: 'Theming' },
  { href: '/showcase/accessibility', label: 'Accessibility' },
  { href: '/showcase/motion', label: 'Motion' },
];

export function Sidebar() {
  return (
    <aside className="border-r border-white/10 bg-[color:var(--bg-surface)] p-4 sticky top-0 h-screen">
      <nav className="space-y-1">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="block px-3 py-2 rounded-lg hover:bg-white/5">
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
