import { NextResponse } from 'next/server';
import { componentDemos } from '@/data/seed/components';
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  const filtered = q
    ? componentDemos.filter((c) => c.name.toLowerCase().includes(q))
    : componentDemos;
  return NextResponse.json(filtered);
}
