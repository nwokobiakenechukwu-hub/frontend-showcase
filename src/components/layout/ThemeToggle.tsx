'use client';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  return (
    <div className="flex gap-2 items-center text-sm">
      <span>Theme</span>
      <select
        aria-label="Theme mode"
        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1"
        value={mode}
        onChange={(e) => setMode(e.target.value as any)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}
