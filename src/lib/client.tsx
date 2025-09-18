'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useEffect, useState } from 'react';
import { AntdProvider } from './AntdProvider';

export function Providers({ children }: { children: ReactNode }) {
  const [qc] = useState(() => new QueryClient());

  useEffect(() => {
    (async () => {
      if (process.env.NODE_ENV === 'development') {
        const { worker } = await import('@/mocks/browser');
        await worker.start({ onUnhandledRequest: 'bypass' });
      }
    })();
  }, []);

  return (
    <QueryClientProvider client={qc}>
      <AntdProvider mode="dark">{children}</AntdProvider>
    </QueryClientProvider>
  );
}
