import { NextResponse } from 'next/server';
import { kpis } from '@/data/seed/dashboards';
export function GET() {
  return NextResponse.json(kpis);
}
