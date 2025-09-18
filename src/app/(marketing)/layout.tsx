import { ReactNode } from 'react';
import '../globals.css';
import { Providers } from '@/lib/client';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
