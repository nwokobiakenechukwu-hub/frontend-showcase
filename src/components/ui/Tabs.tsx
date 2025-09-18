'use client';
import * as React from 'react';

export function Tabs({
  tabs,
}: {
  tabs: { id: string; label: string; content: React.ReactNode }[];
}) {
  const [active, setActive] = React.useState(tabs[0]?.id);
  return (
    <div>
      <div role="tablist" aria-label="Tabs" className="flex gap-2 mb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            className={`px-3 py-2 rounded-xl border border-white/10 ${
              active === t.id ? 'bg-white/10' : 'bg-transparent'
            }`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{tabs.find((t) => t.id === active)?.content}</div>
    </div>
  );
}
