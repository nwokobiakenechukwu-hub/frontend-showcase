'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  Row,
  Col,
  Typography,
  Segmented,
  Button,
  Statistic,
  Space,
  Tag,
  Table,
  Tooltip,
} from 'antd';
import { UserOutlined, ReloadOutlined, LikeOutlined } from '@ant-design/icons';
import type { KPI } from '@/data/types';
import { fetchJSON } from '@/lib/fetcher';
import { Sparkline, type Point } from '@/components/charts/Sparkline';

const { Title, Text } = Typography;

const sessions: Point[] = Array.from({ length: 28 }, (_, i) => ({
  x: i + 1,
  y: 40 + Math.sin(i / 2) * 8 + i * 0.6,
}));
const conversions: Point[] = sessions.map((p) => ({ x: p.x, y: Math.max(30, p.y * 0.82) }));

type Range = 'Today' | '7d' | '30d';

export default function Dashboards() {
  const [range, setRange] = useState<Range>('7d');

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['kpis', range],
    queryFn: () => fetchJSON<KPI[]>('/api/kpis'),
    staleTime: 10_000,
  });

  const topTeams = [
    { key: 1, team: 'Growth', active: 3240, conv: 3.2, delta: +6 },
    { key: 2, team: 'Sales', active: 2801, conv: 4.5, delta: +2 },
    { key: 3, team: 'Support', active: 1950, conv: 2.2, delta: -1 },
    { key: 4, team: 'Ops', active: 1543, conv: 1.8, delta: +3 },
  ];

  return (
    <div>
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Dashboards
          </Title>
          <Text type="secondary">Overview metrics with crisp visuals.</Text>
        </div>
        <Space>
          <Segmented
            options={['Today', '7d', '30d']}
            value={range}
            onChange={(v) => setRange(v as Range)}
          />
          <Tooltip title="Refresh">
            <Button icon={<ReloadOutlined />} loading={isFetching} onClick={() => refetch()} />
          </Tooltip>
        </Space>
      </div>

      {/* KPI cards */}
      <Row gutter={[16, 16]}>
        {(isLoading ? Array.from({ length: 3 }) : data)?.map((k: any, idx: number) => (
          <Col xs={24} md={12} lg={8} key={k?.id ?? idx}>
            <Card
              hoverable
              loading={isLoading}
              styles={{ body: { padding: 16 } }}
              style={{ borderRadius: 14 }}
            >
              {!isLoading && (
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <Space align="center">
                    <span
                      style={{
                        display: 'inline-grid',
                        placeItems: 'center',
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background:
                          'linear-gradient(135deg, var(--brand-secondary), rgba(71,197,251,0.25))',
                        color: 'white',
                      }}
                    >
                      {k.label.includes('Users') ? (
                        <UserOutlined />
                      ) : k.label.includes('NPS') ? (
                        <LikeOutlined />
                      ) : (
                        <ReloadOutlined />
                      )}
                    </span>
                    <Text type="secondary">{k.label}</Text>
                  </Space>

                  <Statistic value={k.value} valueStyle={{ fontWeight: 700 }} />
                  {k.delta !== undefined && (
                    <Tag color={k.delta >= 0 ? 'green' : 'red'}>
                      {k.delta >= 0 ? '▲' : '▼'} {Math.abs(k.delta)}%
                    </Tag>
                  )}

                  {/* optional micro-sparkline (reuse main data just for visual punch) */}
                  <div style={{ marginTop: 6 }}>
                    <Sparkline data={sessions.slice(-12)} height={90} />
                  </div>
                </Space>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts row */}
      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} lg={12}>
          <Card title="Sessions" hoverable style={{ borderRadius: 14 }}>
            <Sparkline data={sessions} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Conversions" hoverable style={{ borderRadius: 14 }}>
            <Sparkline
              data={conversions}
              stroke="var(--brand-primary)"
              fillFrom="var(--brand-primary)"
              fillTo="rgba(255,59,126,0.06)"
            />
          </Card>
        </Col>
      </Row>

      {/* Top teams table */}
      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24}>
          <Card title="Top Teams" hoverable style={{ borderRadius: 14 }}>
            <Table
              size="small"
              pagination={false}
              columns={[
                { title: 'Team', dataIndex: 'team', key: 'team' },
                {
                  title: 'Active Users',
                  dataIndex: 'active',
                  key: 'active',
                  align: 'right' as const,
                },
                { title: 'Conversion %', dataIndex: 'conv', key: 'conv', align: 'right' as const },
                {
                  title: 'Δ',
                  dataIndex: 'delta',
                  key: 'delta',
                  align: 'right' as const,
                  render: (d: number) => (
                    <span style={{ color: d >= 0 ? '#22c55e' : '#ef4444' }}>
                      {d >= 0 ? '▲' : '▼'} {Math.abs(d)}%
                    </span>
                  ),
                },
              ]}
              dataSource={topTeams}
            />
          </Card>
        </Col>
      </Row>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <Button>Export CSV</Button>
      </div>
    </div>
  );
}
