'use client';

import {
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
  Avatar,
} from 'antd';
import Link from 'next/link';
import type { Route } from 'next';
import {
  RocketOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  BulbOutlined,
  SafetyOutlined,
  ThunderboltTwoTone,
  GithubOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const demoTiles = [
  {
    href: '/showcase/dashboards' as Route,
    title: 'Dashboards',
    desc: 'KPIs, charts, and insights.',
  },
  {
    href: '/showcase/components' as Route,
    title: 'Components',
    desc: 'Reusable UI, themed & accessible.',
  },
  { href: '/showcase/forms' as Route, title: 'Forms', desc: 'Multi-step, validation, async UX.' },
  {
    href: '/showcase/theming' as Route,
    title: 'Theming',
    desc: 'Tokens + dark / light in one place.',
  },
];

const features = [
  {
    icon: <ThunderboltOutlined />,
    title: 'Speed',
    desc: 'Next.js App Router + React Query + MSW.',
  },
  { icon: <ApiOutlined />, title: 'Mocked Data', desc: 'Realistic flows with typed seed APIs.' },
  { icon: <BulbOutlined />, title: 'Design System', desc: 'Tokens → primitives → components.' },
  {
    icon: <SafetyOutlined />,
    title: 'A11y First',
    desc: 'Keyboardable, focus-visible, WCAG minded.',
  },
];

const faq = [
  {
    key: '1',
    label: 'Is this frontend-only?',
    children: 'Yes. All “data” is via MSW from typed seed JSON.',
  },
  {
    key: '2',
    label: 'Can I theme it quickly?',
    children: 'Change CSS vars --brand-primary/secondary/radius and you’re done.',
  },
  {
    key: '3',
    label: 'Storybook & tests?',
    children: 'Storybook v9 with a11y, Jest + RTL + Playwright in CI.',
  },
];

export default function Landing() {
  const showcaseHref = '/showcase' as Route;

  return (
    <div>
      {/* HERO */}
      <section
        style={{
          padding: '72px 24px 32px',
          textAlign: 'center',
          background:
            'radial-gradient(900px 380px at 50% -10%, rgba(71,197,251,.18), transparent), radial-gradient(700px 300px at 100% 0%, rgba(255,59,126,.12), transparent)',
        }}
      >
        <Title
          level={1}
          style={{
            marginBottom: 8,
            background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 800,
          }}
        >
          Design Systems. Dashboards. Delight.
        </Title>

        <Paragraph style={{ maxWidth: 760, margin: '0 auto', opacity: 0.9 }}>
          A senior-level frontend showcase: tokens → primitives → components, charts, complex forms,
          accessibility, and motion — built with Next.js & TypeScript.
        </Paragraph>

        <Space size="middle" style={{ marginTop: 20 }}>
          <Link href={showcaseHref}>
            <Button type="primary" size="large" icon={<RocketOutlined />}>
              Explore Showcase
            </Button>
          </Link>
          <a href="https://github.com/you/teams-hq" target="_blank" rel="noreferrer">
            <Button size="large" icon={<GithubOutlined />}>
              View Repo
            </Button>
          </a>
        </Space>

        <div style={{ marginTop: 18 }}>
          <Tag color="magenta">TypeScript</Tag>
          <Tag color="geekblue">Ant Design v5</Tag>
          <Tag color="cyan">React Query</Tag>
          <Tag color="purple">MSW</Tag>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[16, 16]}>
          {features.map((f) => (
            <Col xs={24} md={12} lg={6} key={f.title}>
              <Card
                hoverable
                style={{ borderRadius: 14 }}
                title={
                  <Space>
                    {f.icon}
                    <span>{f.title}</span>
                  </Space>
                }
              >
                <Text type="secondary">{f.desc}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* LIVE DEMOS */}
      <section style={{ padding: '8px 24px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 8,
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Live demos
          </Title>
          <Link href={showcaseHref}>
            <Button type="link" icon={<ArrowRightOutlined />}>
              See all
            </Button>
          </Link>
        </div>
        <Row gutter={[16, 16]}>
          {demoTiles.map((t) => (
            <Col xs={24} md={12} key={t.href}>
              <Link href={t.href}>
                <Card hoverable style={{ borderRadius: 14 }} title={t.title}>
                  <Text type="secondary">{t.desc}</Text>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </section>

      {/* STATS */}
      <section style={{ padding: '8px 24px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <Card style={{ borderRadius: 14 }}>
          <Row gutter={[16, 16]} justify="space-around">
            <Col xs={12} md={6}>
              <Statistic
                title="Components"
                value={35}
                prefix={<ThunderboltTwoTone twoToneColor="var(--brand-primary)" />}
              />
            </Col>
            <Col xs={12} md={6}>
              <Statistic title="Stories" value={50} suffix="+" />
            </Col>
            <Col xs={12} md={6}>
              <Statistic title="Tests" value={120} suffix="+" />
            </Col>
            <Col xs={12} md={6}>
              <Statistic title="Lighthouse" value={98} suffix="/100" />
            </Col>
          </Row>
        </Card>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '8px 24px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[16, 16]}>
          {[1, 2, 3].map((i) => (
            <Col xs={24} md={8} key={i}>
              <Card hoverable style={{ borderRadius: 14 }}>
                <Space style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <Avatar src={`https://api.dicebear.com/9.x/initials/svg?seed=User${i}`} />
                  <div>
                    <Text strong>Reviewer {i}</Text>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>Senior Engineer</div>
                  </div>
                </Space>
                <Text type="secondary">
                  “Clean architecture and pixel-tight UI. The mock data flows feel real—perfect for
                  interviews.”
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* FAQ */}
      <section style={{ padding: '8px 24px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 12 }}>
          FAQ
        </Title>
        <Collapse items={faq} bordered style={{ borderRadius: 14 }} />
      </section>

      <Divider />

      {/* CTA */}
      <section style={{ padding: '0 24px 48px', textAlign: 'center' }}>
        <Title level={3} style={{ marginBottom: 8 }}>
          Ready to dive into the code?
        </Title>
        <Paragraph type="secondary">
          Open the demos, explore Storybook, and skim the tests.
        </Paragraph>
        <Space size="middle" style={{ marginTop: 8 }}>
          <Link href={showcaseHref}>
            <Button type="primary" size="large" icon={<RocketOutlined />}>
              Open Showcase
            </Button>
          </Link>
          <a href="https://github.com/you/teams-hq" target="_blank" rel="noreferrer">
            <Button size="large" icon={<GithubOutlined />}>
              GitHub
            </Button>
          </a>
        </Space>
      </section>
    </div>
  );
}
