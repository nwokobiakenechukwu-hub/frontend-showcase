import { Card } from '@/components/ui/Card';
export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <div className="mb-2 text-sm opacity-80">{title}</div>
      <div className="h-64">{children}</div>
    </Card>
  );
}
