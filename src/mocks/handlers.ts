import { http, HttpResponse } from 'msw';
import { projects } from '@/data/seed/projects';
import { componentDemos } from '@/data/seed/components';
import { kpis } from '@/data/seed/dashboards';

export const handlers = [
  http.get('/api/projects', () => HttpResponse.json(projects)),
  http.get('/api/components', ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').toLowerCase();
    const filtered = q
      ? componentDemos.filter((c) => c.name.toLowerCase().includes(q))
      : componentDemos;
    return HttpResponse.json(filtered);
  }),
  http.get('/api/kpis', () => HttpResponse.json(kpis)),
];
