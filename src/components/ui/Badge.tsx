export function Badge({ children }: { children: string }) {
  return <span className="px-2 py-1 rounded-lg text-xs bg-white/10">{children}</span>;
}
