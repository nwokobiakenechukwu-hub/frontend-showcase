'use client';
import { Layout, Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';

const { Header, Sider, Content } = Layout;

const items = [
  { key: '/showcase', label: 'Showcase' },
  { key: '/showcase/dashboards', label: 'Dashboards' },
  { key: '/showcase/components', label: 'Components' },
  { key: '/showcase/forms', label: 'Forms' },
  { key: '/showcase/theming', label: 'Theming' },
  { key: '/showcase/accessibility', label: 'Accessibility' },
  { key: '/showcase/motion', label: 'Motion' },
] as const satisfies ReadonlyArray<{ key: Route; label: string }>;

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ pick the longest matching key so nested routes highlight correctly
  const selected =
    items
      .map((i) => i.key)
      .sort((a, b) => b.length - a.length)
      .find((k) => pathname?.startsWith(k)) ?? '/showcase';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          color: 'white',
          background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))',
        }}
      >
        <Link href="/" style={{ color: 'white', fontWeight: 700 }}>
          Teams HQ
        </Link>
        <span style={{ opacity: 0.85 }}>Showcase</span>
      </Header>

      <Layout>
        <Sider theme="dark" width={220} breakpoint="lg" collapsedWidth={0}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selected]}
            items={items.map((i) => ({
              key: i.key,
              label: <Link href={i.key}>{i.label}</Link>,
            }))}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>

        <Layout style={{ background: 'transparent' }}>
          <Content style={{ padding: 24 }}>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
