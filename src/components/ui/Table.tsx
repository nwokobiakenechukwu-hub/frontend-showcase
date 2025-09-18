import { ReactNode } from 'react';

export function Table({ head, children }: { head: ReactNode; children: ReactNode }) {
  return (
    <div className="overflow-auto rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5">{head}</thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
