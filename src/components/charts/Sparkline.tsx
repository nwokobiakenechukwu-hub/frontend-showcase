'use client';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export type Point = { x: number | string; y: number };

export function Sparkline({
  data,
  height = 260,
  stroke = 'var(--brand-secondary)',
  fillFrom = 'var(--brand-secondary)',
  fillTo = 'rgba(71,197,251,0.05)',
}: {
  data: Point[];
  height?: number;
  stroke?: string;
  fillFrom?: string;
  fillTo?: string;
}) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillFrom} stopOpacity={0.45} />
              <stop offset="100%" stopColor={fillTo} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeOpacity={0.08} vertical={false} />
          <XAxis dataKey="x" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="y"
            stroke={stroke}
            strokeWidth={2}
            fill="url(#spark)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
