import type { KPI } from '@/data/types';

export const kpis: KPI[] = [
  { id: 'users', label: 'Active Users', value: 12450, delta: 8.3 },
  { id: 'retention', label: '30d Retention %', value: 41.2, delta: 1.4 },
  { id: 'nps', label: 'NPS', value: 62, delta: 3.0 },
];
