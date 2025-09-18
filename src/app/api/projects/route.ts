import { NextResponse } from 'next/server';
import { projects } from '@/data/seed/projects';
export function GET() {
  return NextResponse.json(projects);
}
