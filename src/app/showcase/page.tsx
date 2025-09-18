'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import {
  Button,
  Card,
  Col,
  Input,
  Progress,
  Row,
  Segmented,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import {
  AppstoreOutlined,
  DashboardOutlined,
  FormOutlined,
  BgColorsOutlined,
  SafetyOutlined, // ✅ replace the missing icon
  ThunderboltOutlined,
  RocketOutlined,
  GithubOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

// ---- Tiles (typed for Next typedRoutes)
type Tile = {
  href: Route;
  title: string;
  desc: string;
  icon: ReactNode;
  tags: string[];
  category: 'Product' | 'Data Viz' | 'Forms' | 'Theming' | 'A11y' | 'Motion';
  status?: 'New' | 'Updated';
};

// ✅ Widen to ReadonlyArray<Tile> to avoid “status does not exist” union issue
const TILES: ReadonlyArray<Tile> = [
  {
    href: '/showcase/dashboards' as Route,
    title: 'Dashboards',
    desc: 'KPIs, charts, and insights.',
    icon: <DashboardOutlined />,
    tags: ['Charts', 'KPIs', 'Cards'],
    category: 'Data Viz',
    status: 'Updated',
  },
  {
    href: '/showcase/components' as Route,
    title: 'Components',
    desc: 'Reusable UI, themed & accessible.',
    icon: <AppstoreOutlined />,
    tags: ['Buttons', 'Tables', 'Patterns'],
    category: 'Product',
  },
  {
    href: '/showcase/forms' as Route,
    title: 'Forms',
    desc: 'Multi-step, validation, async UX.',
    icon: <FormOutlined />,
    tags: ['Validation', 'Steps', 'Async'],
    category: 'Forms',
    status: 'New',
  },
  {
    href: '/showcase/theming' as Route,
    title: 'Theming',
    desc: 'Tokens + dark / light in one place.',
    icon: <BgColorsOutlined />,
    tags: ['Tokens', 'Dark/Light'],
    category: 'Theming',
  },
  {
    href: '/showcase/accessibility' as Route,
    title: 'Accessibility',
    desc: 'WCAG-friendly patterns.',
    icon: <SafetyOutlined />, // ✅ valid icon
    tags: ['Focus', 'Landmarks'],
    category: 'A11y',
  },
  {
    href: '/showcase/motion' as Route,
    title: 'Motion',
    desc: 'Micro-interactions and presence.',
    icon: <ThunderboltOutlined />,
    tags: ['Transitions', 'Presence'],
    category: 'Motion',
  },
];

const CATEGORIES = ['All', 'Product', 'Data Viz', 'Forms', 'Theming', 'A11y', 'Motion'] as const;
type Cat = (typeof CATEGORIES)[number];

export default function ShowcaseHome() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Cat>('All');

  const filtered = useMemo(() => {
    const byCat = (t: Tile) => cat === 'All' || t.category === cat;
    const byQ =
      q.trim().length === 0
        ? () => true
        : (t: Tile) =>
            [t.title, t.desc, t.tags.join(' ')].join(' ').toLowerCase().includes(q.toLowerCase());
    return TILES.filter((t) => byCat(t) && byQ(t));
  }, [q, cat]);

  return (
    <div>
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Showcase
          </Title>
          <Text type="secondary">A tour of production-ready UI surfaces.</Text>
        </div>
        <Space>
          <a href="https://github.com/you/teams-hq" target="_blank" rel="noreferrer">
            <Button icon={<GithubOutlined />}>View Repo</Button>
          </a>
          <Link href="/showcase">
            <Button type="primary" icon={<RocketOutlined />}>
              Open All
            </Button>
          </Link>
        </Space>
      </div>

      {/* Controls */}
      <Row gutter={[16, 16]} style={{ marginBottom: 8 }}>
        <Col xs={24} md={16} lg={18}>
          <Space wrap>
            <Input
              allowClear
              placeholder="Search demos…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ width: 320 }}
            />
            <Segmented
              options={CATEGORIES.map((c) => ({ label: c, value: c }))}
              value={cat}
              onChange={(v) => setCat(v as Cat)}
            />
          </Space>
        </Col>
        <Col xs={24} md={8} lg={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space split={<span style={{ opacity: 0.5 }}>|</span>} wrap>
            <Text type="secondary">TypeScript</Text>
            <Text type="secondary">Ant Design v5</Text>
            <Text type="secondary">React Query</Text>
          </Space>
        </Col>
      </Row>

      {/* Grid + Right rail */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16} xl={17}>
          <Row gutter={[16, 16]}>
            {filtered.map((t) => (
              <Col xs={24} md={12} key={t.href}>
                <Link href={t.href}>
                  <Card
                    hoverable
                    style={{ borderRadius: 14 }}
                    title={
                      <Space>
                        <span
                          style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background:
                              t.category === 'Data Viz'
                                ? 'linear-gradient(135deg, var(--brand-secondary), rgba(71,197,251,0.25))'
                                : 'linear-gradient(135deg, var(--brand-primary), rgba(255,59,126,0.25))',
                            color: 'white',
                            fontSize: 16,
                          }}
                        >
                          {t.icon}
                        </span>
                        <span style={{ fontWeight: 600 }}>{t.title}</span>
                        {!!t.status && (
                          <Tag color={t.status === 'New' ? 'magenta' : 'geekblue'}>{t.status}</Tag>
                        )}
                      </Space>
                    }
                    extra={<Text type="secondary">{t.category}</Text>}
                  >
                    <Paragraph type="secondary" style={{ marginBottom: 8 }}>
                      {t.desc}
                    </Paragraph>
                    <Space size={[8, 8]} wrap>
                      {t.tags.map((tag) => (
                        <Tag key={tag} bordered>
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Col>

        <Col xs={24} lg={8} xl={7}>
          <Card
            style={{ borderRadius: 14, marginBottom: 16 }}
            title="Project Health"
            extra={<Tag color="success">Green</Tag>}
            hoverable
          >
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Statistic title="Stories" value={50} suffix="+" />
              </Col>
              <Col span={12}>
                <Statistic title="Tests" value={120} suffix="+" />
              </Col>
              <Col span={24}>
                <Text type="secondary">Coverage</Text>
                <Progress percent={88} strokeColor="var(--brand-secondary)" />
              </Col>
              <Col span={24}>
                <Text type="secondary">Accessibility</Text>
                <Progress percent={95} strokeColor="var(--brand-primary)" />
              </Col>
            </Row>
          </Card>

          <Card style={{ borderRadius: 14, marginBottom: 16 }} title="Shortcuts" hoverable>
            <Space direction="vertical" style={{ width: '100%' }}>
              <a href="http://localhost:6006" target="_blank" rel="noreferrer">
                <Button block icon={<AppstoreOutlined />}>
                  Open Storybook
                </Button>
              </a>
              <a href="https://github.com/you/teams-hq/actions" target="_blank" rel="noreferrer">
                <Button block icon={<GithubOutlined />}>
                  View CI
                </Button>
              </a>
            </Space>
          </Card>

          <Card style={{ borderRadius: 14 }} title="Tech Stack" hoverable>
            <Space size={[8, 8]} wrap>
              <Tag color="magenta">Next.js App Router</Tag>
              <Tag color="geekblue">Ant Design v5</Tag>
              <Tag color="purple">TypeScript</Tag>
              <Tag color="cyan">MSW</Tag>
              <Tag color="blue">React Query</Tag>
              <Tag color="gold">Playwright</Tag>
              <Tag color="orange">Storybook</Tag>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
