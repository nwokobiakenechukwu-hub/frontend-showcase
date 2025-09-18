'use client';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { App, ConfigProvider, theme as antdTheme } from 'antd';

export type ThemeMode = 'light' | 'dark';

export function AntdProvider({
  children,
  mode = 'dark',
}: {
  children: ReactNode;
  mode?: ThemeMode;
}) {
  const algorithm = mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  // read brand tokens from CSS variables (no custom CSS components)
  const tokens = useMemo(() => {
    if (typeof window === 'undefined') {
      return { colorPrimary: '#FF3B7E', borderRadius: 12 };
    }
    const cs = getComputedStyle(document.documentElement);
    const colorPrimary = cs.getPropertyValue('--brand-primary').trim() || '#FF3B7E';
    const borderRadius =
      parseInt((cs.getPropertyValue('--brand-radius').trim() || '12px').replace('px', ''), 10) ||
      12;
    return { colorPrimary, borderRadius };
  }, []);

  return (
    <ConfigProvider theme={{ algorithm, token: tokens }}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
