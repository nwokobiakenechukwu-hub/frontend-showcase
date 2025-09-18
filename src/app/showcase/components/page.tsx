'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Badge,
  Button,
  Card,
  Col,
  Drawer,
  Empty,
  Flex,
  Input,
  List,
  Row,
  Segmented,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  AppstoreOutlined,
  BarsOutlined,
  CodeOutlined,
  EyeOutlined,
  HeartFilled,
  HeartOutlined,
  ReloadOutlined,
  TableOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import type { ComponentDemo } from '@/data/types';
import { fetchJSON } from '@/lib/fetcher';
import { useQueryParams } from '@/hooks/useQueryParams';

const { Title, Text, Paragraph } = Typography;

type ViewMode = 'grid' | 'list';
const categories = ['All', 'Navigation', 'Forms', 'Feedback', 'Data Display', 'Layout'] as const;
type Category = (typeof categories)[number];
type SortKey = 'a-z' | 'z-a' | 'category' | 'tags';

const gradientBorder: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(#111,#111) padding-box, linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)) border-box',
  border: '1px solid transparent',
  borderRadius: 14,
};

const iconForCategory: Record<Exclude<Category, 'All'>, React.ReactNode> = {
  Navigation: <AppstoreOutlined />,
  Forms: <ToolOutlined />,
  Feedback: <BarsOutlined />,
  'Data Display': <TableOutlined />,
  Layout: <AppstoreOutlined />,
};

export default function ComponentsGallery() {
  const { get, set } = useQueryParams();

  // toolbar state synced to URL
  const q = get('q') ?? '';
  const cat = (get('cat') as Category) || 'All';
  const selectedTags = (get('tags') || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const sort = (get('sort') as SortKey) || 'a-z';
  const view = (get('view') as ViewMode) || 'grid';

  // favorites (persist locally)
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem('__teams_hq_favs');
    if (raw) setFavs(JSON.parse(raw));
  }, []);
  const toggleFav = (id: string) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('__teams_hq_favs', JSON.stringify(next));
      return next;
    });
  };

  // data
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['components', q, cat],
    queryFn: () => fetchJSON<ComponentDemo[]>(`/api/components?q=${encodeURIComponent(q)}`),
  });

  // all tags + category counts
  const { allTags, countsByCat } = useMemo(() => {
    const tagSet = new Set<string>();
    const counts = new Map<Category, number>();
    categories.forEach((c) => counts.set(c, 0));
    (data ?? []).forEach((c) => {
      c.tags.forEach((t) => tagSet.add(t));
      counts.set((c.category as Category) ?? 'All', (counts.get(c.category as Category) ?? 0) + 1);
      counts.set('All', (counts.get('All') ?? 0) + 1);
    });
    return {
      allTags: Array.from(tagSet).sort((a, b) => a.localeCompare(b)),
      countsByCat: counts,
    };
  }, [data]);

  // filtering + sorting
  const filtered = useMemo(() => {
    const byCat = (c: ComponentDemo) => cat === 'All' || c.category === cat;
    const byQ = (c: ComponentDemo) =>
      !q ||
      [c.name, c.category, c.tags.join(' ')].join(' ').toLowerCase().includes(q.toLowerCase());
    const byTags = (c: ComponentDemo) =>
      selectedTags.length === 0 || selectedTags.every((t) => c.tags.includes(t));

    const arr = (data ?? []).filter((c) => byCat(c) && byQ(c) && byTags(c));

    switch (sort) {
      case 'z-a':
        return arr.sort((a, b) => b.name.localeCompare(a.name));
      case 'category':
        return arr.sort((a, b) =>
          a.category === b.category
            ? a.name.localeCompare(b.name)
            : a.category.localeCompare(b.category)
        );
      case 'tags':
        return arr.sort((a, b) => b.tags.length - a.tags.length);
      default:
        return arr.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [data, q, cat, selectedTags, sort]);

  // preview drawer
  const [openId, setOpenId] = useState<string | null>(null);
  const openItem = (id: string) => setOpenId(id);
  const closeItem = () => setOpenId(null);

  // helpers
  const setTags = (tags: string[]) => set('tags', tags.length ? tags.join(',') : '');
  const highlight = (text: string, query: string) => {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + query.length);
    const after = text.slice(idx + query.length);
    return (
      <>
        {before}
        <mark
          style={{
            background: 'rgba(71,197,251,.20)',
            padding: '0 2px',
            borderRadius: 4,
            color: 'inherit',
          }}
        >
          {match}
        </mark>
        {after}
      </>
    );
  };

  const toolbar = (
    <Flex vertical gap={12} style={{ marginBottom: 12 }}>
      <Flex align="center" gap={12} wrap="wrap" justify="space-between">
        <Flex vertical>
          <Title level={3} style={{ marginBottom: 2 }}>
            Components
          </Title>
          <Text type="secondary">Reusable, themed, accessible building blocks.</Text>
        </Flex>

        <Space>
          <Input
            allowClear
            size="large"
            placeholder="Search components…"
            defaultValue={q}
            onChange={(e) => set('q', e.target.value)}
            style={{ width: 320 }}
          />
          <Button
            icon={<ReloadOutlined spin={isFetching} />}
            onClick={() => refetch()}
            aria-label="Refresh"
          />
        </Space>
      </Flex>

      <Flex align="center" gap={12} wrap="wrap">
        <Segmented
          options={categories.map((c) => ({
            label: (
              <Space>
                {c !== 'All' ? iconForCategory[c as Exclude<Category, 'All'>] : null}
                <span>{c}</span>
                <Badge
                  count={countsByCat.get(c) ?? 0}
                  style={{ background: 'var(--brand-secondary)' }}
                />
              </Space>
            ),
            value: c,
          }))}
          value={cat}
          onChange={(val) => set('cat', (val as Category) === 'All' ? '' : String(val))}
        />

        <Flex align="center" gap={8} wrap="wrap">
          <Text type="secondary">Tags:</Text>
          <Tag
            color={selectedTags.length === 0 ? 'processing' : 'default'}
            style={{ cursor: 'pointer' }}
            onClick={() => setTags([])}
          >
            All
          </Tag>
          {(allTags ?? []).map((t) => (
            <Tag.CheckableTag
              key={t}
              checked={selectedTags.includes(t)}
              onChange={(checked) =>
                setTags(checked ? [...selectedTags, t] : selectedTags.filter((x) => x !== t))
              }
            >
              {t}
            </Tag.CheckableTag>
          ))}
        </Flex>

        <Flex align="center" gap={12} style={{ marginLeft: 'auto' }}>
          <Select<SortKey>
            value={sort}
            onChange={(v) => set('sort', v)}
            options={[
              { value: 'a-z', label: 'Sort: A → Z' },
              { value: 'z-a', label: 'Sort: Z → A' },
              { value: 'category', label: 'Sort: Category' },
              { value: 'tags', label: 'Sort: Tag count' },
            ]}
            style={{ width: 170 }}
          />
          <Segmented
            value={view}
            onChange={(v) => set('view', String(v))}
            options={[
              { label: 'Grid', value: 'grid', icon: <AppstoreOutlined /> },
              { label: 'List', value: 'list', icon: <BarsOutlined /> },
            ]}
          />
        </Flex>
      </Flex>

      <Flex align="center" gap={10}>
        <Badge count={filtered.length} color="var(--brand-secondary)" />
        <Text type="secondary">
          {filtered.length} result{filtered.length === 1 ? '' : 's'}
          {selectedTags.length > 0 ? ` · filtered by ${selectedTags.join(', ')}` : ''}
        </Text>
      </Flex>
    </Flex>
  );

  return (
    <div>
      {toolbar}

      {isError && (
        <Empty
          description="Could not load components (mock)."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: 32 }}
        />
      )}

      {isLoading ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Col xs={24} md={12} lg={8} key={i}>
              <Card style={{ borderRadius: 14 }}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : filtered.length === 0 ? (
        <Empty
          description={<span>No matches. Try clearing filters or adjusting your search.</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: 32 }}
        />
      ) : view === 'grid' ? (
        <Row gutter={[16, 16]}>
          {filtered.map((c) => (
            <Col xs={24} md={12} lg={8} key={c.id}>
              <ComponentCard
                item={c}
                q={q}
                fav={favs.includes(String(c.id))}
                onFav={() => toggleFav(String(c.id))}
                onPreview={() => openItem(String(c.id))}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={filtered}
          renderItem={(c) => (
            <List.Item
              actions={[
                <Button key="p" icon={<EyeOutlined />} onClick={() => openItem(String(c.id))}>
                  Preview
                </Button>,
                <Button
                  key="f"
                  icon={favs.includes(String(c.id)) ? <HeartFilled /> : <HeartOutlined />}
                  onClick={() => toggleFav(String(c.id))}
                >
                  {favs.includes(String(c.id)) ? 'Favorited' : 'Favorite'}
                </Button>,
              ]}
              style={{ ...gradientBorder, marginBottom: 12 }}
            >
              <List.Item.Meta
                title={<span style={{ fontWeight: 600 }}>{highlight(c.name, q)}</span>}
                description={
                  <Space size={[8, 8]} wrap>
                    <Tag color="geekblue">{c.category}</Tag>
                    {c.tags.map((t) => (
                      <Tag key={t} color="processing">
                        {highlight(t, q)}
                      </Tag>
                    ))}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}

      {/* PREVIEW DRAWER */}
      <Drawer
        open={!!openId}
        onClose={closeItem}
        width={Math.min(920, typeof window !== 'undefined' ? window.innerWidth - 80 : 920)}
        styles={{ body: { paddingTop: 8 } }}
        title={
          <Space>
            <EyeOutlined />
            <span>Preview</span>
          </Space>
        }
      >
        {openId && (
          <PreviewBody
            item={
              (filtered.find((x) => String(x.id) === openId) ??
                (data ?? []).find((x) => String(x.id) === openId)) as ComponentDemo
            }
          />
        )}
      </Drawer>
    </div>
  );
}

/* -------------------------- Item Card --------------------------- */

function ComponentCard({
  item,
  q,
  fav,
  onFav,
  onPreview,
}: {
  item: ComponentDemo;
  q: string;
  fav: boolean;
  onFav: () => void;
  onPreview: () => void;
}) {
  return (
    <Badge.Ribbon text={item.category} color="geekblue">
      <Card
        hoverable
        style={{ ...gradientBorder }}
        title={<span style={{ fontWeight: 600 }}>{highlightMaybe(item.name, q)}</span>}
        extra={
          <Space>
            {item.status && (
              <Tag color={item.status === 'New' ? 'magenta' : 'geekblue'}>{item.status}</Tag>
            )}
            <Button
              type="text"
              aria-label="Favorite"
              icon={
                fav ? <HeartFilled style={{ color: 'var(--brand-primary)' }} /> : <HeartOutlined />
              }
              onClick={(e) => {
                e.stopPropagation();
                onFav();
              }}
            />
          </Space>
        }
        onClick={onPreview}
      >
        <Paragraph type="secondary" style={{ marginBottom: 8 }}>
          {item.description ?? 'Production-ready pattern with sensible defaults.'}
        </Paragraph>
        <Space size={[8, 8]} wrap>
          {item.tags.map((t) => (
            <Tag key={t} color="processing">
              {highlightMaybe(t, q)}
            </Tag>
          ))}
        </Space>

        <Flex justify="flex-end" style={{ marginTop: 12 }} gap={8}>
          <Button
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
          >
            Preview
          </Button>
          <a href="http://localhost:6006" target="_blank" rel="noreferrer">
            <Button icon={<CodeOutlined />}>Story</Button>
          </a>
        </Flex>
      </Card>
    </Badge.Ribbon>
  );
}

function highlightMaybe(text: string, q: string) {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);
  return (
    <>
      {before}
      <mark
        style={{
          background: 'rgba(71,197,251,.20)',
          padding: '0 2px',
          borderRadius: 4,
          color: 'inherit',
        }}
      >
        {match}
      </mark>
      {after}
    </>
  );
}

/* -------------------------- Preview Body --------------------------- */

function PreviewBody({ item }: { item: ComponentDemo }) {
  const [copied, setCopied] = useState(false);
  const usage = usageSnippet(item);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(usage);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      message.error('Copy failed');
    }
  };

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      <Title level={4} style={{ marginBottom: 0 }}>
        {item.name}
      </Title>
      <Text type="secondary">{item.category}</Text>

      <Card title="Live preview" style={{ ...gradientBorder }}>
        {renderPreview(item)}
      </Card>

      <Card
        title={
          <Space>
            <CodeOutlined />
            <span>Usage</span>
          </Space>
        }
        extra={<Button onClick={copy}>{copied ? 'Copied' : 'Copy'}</Button>}
        style={{ ...gradientBorder }}
      >
        <pre
          style={{
            margin: 0,
            overflowX: 'auto',
            padding: 12,
            borderRadius: 10,
            background: '#0f0f12',
          }}
        >
          {usage}
        </pre>
      </Card>
    </Space>
  );
}

/* -------------------------- Demos --------------------------- */

function renderPreview(item: ComponentDemo) {
  const key = item.name.toLowerCase();
  if (key.includes('card')) return <DemoCard />;
  if (key.includes('table')) return <DemoTable />;
  if (key.includes('stepper') || key.includes('form')) return <DemoFormStepper />;
  return (
    <Empty description="Interactive preview coming soon." image={Empty.PRESENTED_IMAGE_SIMPLE} />
  );
}

function DemoCard() {
  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} md={12}>
        <Card hoverable style={gradientBorder}>
          <Title level={5} style={{ margin: 0 }}>
            Token Card
          </Title>
          <Text type="secondary">On-brand surface with gradient border.</Text>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card hoverable style={gradientBorder}>
          <Title level={5} style={{ margin: 0 }}>
            Elevated
          </Title>
          <Text type="secondary">Hover to feel the motion affordance.</Text>
        </Card>
      </Col>
    </Row>
  );
}

function DemoTable() {
  const columns = [
    { title: 'Team', dataIndex: 'team' },
    { title: 'Active Users', dataIndex: 'users', sorter: (a: any, b: any) => a.users - b.users },
    { title: 'Conv %', dataIndex: 'conv', sorter: (a: any, b: any) => a.conv - b.conv },
  ];
  const data = [
    { key: 1, team: 'Growth', users: 3240, conv: 3.2 },
    { key: 2, team: 'Sales', users: 1280, conv: 4.1 },
    { key: 3, team: 'Success', users: 820, conv: 2.7 },
  ];
  return (
    <Table
      columns={columns}
      dataSource={data}
      size="small"
      pagination={false}
      style={{ borderRadius: 12, overflow: 'hidden' }}
    />
  );
}

function DemoFormStepper() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Text type="secondary">Mini “stepper” illustration (1 → 2 → 3)</Text>
      <Row gutter={[12, 12]}>
        {[1, 2, 3].map((i) => (
          <Col key={i}>
            <Tag color={i === 1 ? 'magenta' : i === 2 ? 'geekblue' : 'cyan'}>Step {i}</Tag>
          </Col>
        ))}
      </Row>
    </Space>
  );
}

/* -------------------------- Usage Snippets --------------------------- */

function usageSnippet(item: ComponentDemo) {
  const key = item.name.toLowerCase();
  if (key.includes('card')) {
    return `import { Card } from 'antd';

export function ExampleCard() {
  return (
    <Card
      hoverable
      style={{
        backgroundImage:
          'linear-gradient(#111,#111) padding-box, linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)) border-box',
        border: '1px solid transparent',
        borderRadius: 14,
      }}
      title="Token Card"
    >
      On-brand surface with gradient border.
    </Card>
  );
}
`;
  }
  if (key.includes('table')) {
    return `import { Table } from 'antd';

const columns = [
  { title: 'Team', dataIndex: 'team' },
  { title: 'Active Users', dataIndex: 'users', sorter: (a, b) => a.users - b.users },
  { title: 'Conv %', dataIndex: 'conv', sorter: (a, b) => a.conv - b.conv },
];

const data = [
  { key: 1, team: 'Growth', users: 3240, conv: 3.2 },
  { key: 2, team: 'Sales', users: 1280, conv: 4.1 },
  { key: 3, team: 'Success', users: 820, conv: 2.7 },
];

export function ExampleTable() {
  return <Table columns={columns} dataSource={data} size="small" pagination={false} />;
}
`;
  }
  if (key.includes('stepper') || key.includes('form')) {
    return `import { Steps } from 'antd';

export function ExampleStepper({ current = 1 }) {
  return (
    <Steps
      current={current}
      items={[{ title: 'Organization' }, { title: 'Billing' }, { title: 'Confirm' }]}
    />
  );
}
`;
  }
  return `// Usage coming soon for "${item.name}"`;
}
