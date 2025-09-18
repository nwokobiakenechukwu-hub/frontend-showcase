import { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${className}`}
    >
      <div className="p-5">{children}</div>
    </div>
  );
}
