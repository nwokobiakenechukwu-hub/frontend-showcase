'use client';
import {
  LineChart as RLineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Props = { data: { x: string | number; y: number }[] };
export function LineChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RLineChart data={data} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
        <XAxis dataKey="x" hide />
        <YAxis hide />
        <Tooltip />
        <Line type="monotone" dataKey="y" dot={false} strokeWidth={2} />
      </RLineChart>
    </ResponsiveContainer>
  );
}
