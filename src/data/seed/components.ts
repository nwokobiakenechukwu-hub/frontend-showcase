import type { ComponentDemo } from '@/data/types';

export const componentDemos: ComponentDemo[] = [
  {
    id: 'comp-card',
    name: 'Card',
    category: 'Data Display',
    complexity: 'basic',
    tags: ['elevation', 'tokens'],
    cover: 'https://postimg.cc/Dm3cqnBQ',
    description: 'On-brand surface with gradient border.',
    status: 'Updated',
  },
  {
    id: 'comp-data-table',
    name: 'Data Table',
    category: 'Data Display',
    complexity: 'advanced',
    tags: ['virtualized', 'sortable', 'filterable'],
    cover: 'https://postimg.cc/Dm3cqnBQ',
    description: 'High-performance table with sorting and filtering.',
    status: 'New',
  },
  {
    id: 'comp-stepper',
    name: 'Form Stepper',
    category: 'Forms',
    complexity: 'intermediate',
    tags: ['async', 'validation'],
    cover: 'https://postimg.cc/Dm3cqnBQ',
    description: 'Multi-step form pattern with validation and async edges.',
    status: 'Updated',
  },
];
