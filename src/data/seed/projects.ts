import type { Project } from '@/data/types';

export const projects: Project[] = [
  {
    id: 'teams-hq',
    title: 'Teams HQ — SaaS Analytics Admin',
    description: 'Token-driven theming, complex tables, async forms, charts, and a11y-first UX.',
    highlights: ['Design System', 'React Query + MSW', 'Virtualized Table', 'WCAG patterns'],
    badges: ['Next.js', 'TypeScript', 'Tailwind', 'Radix'],
    hero: '/mock-imgs/paws-hero.png',
    repo: 'https://github.com/you/teams-hq',
    components: ['comp-card', 'comp-data-table', 'comp-stepper'],
    kpis: [
      { id: 'k1', label: 'TTI (ms)', value: 1100, delta: -12 },
      { id: 'k2', label: 'CLS', value: 0.02 },
      { id: 'k3', label: 'Lighthouse UI', value: 98 },
    ],
  },
];
