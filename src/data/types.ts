export type KPI = { id: string; label: string; value: number; delta?: number };

export type Project = {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  badges: string[];
  hero: string;
  url?: string;
  repo?: string;
  components: ComponentDemo['id'][];
  kpis: KPI[];
};
export type ComponentCategory = 'Navigation' | 'Forms' | 'Feedback' | 'Data Display' | 'Layout';

export interface ComponentDemo {
  id: string;
  name: string;
  category: ComponentCategory;
  complexity: 'basic' | 'intermediate' | 'advanced';
  tags: string[];
  cover: string;
  // NEW (optional)
  status?: 'New' | 'Updated';
  description?: string;
}
