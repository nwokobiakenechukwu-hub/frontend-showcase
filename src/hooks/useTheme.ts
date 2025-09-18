import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    // runs only in browser
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  return { mode, setMode };
}
