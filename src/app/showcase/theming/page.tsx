'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  ColorPicker,
  Divider,
  Flex,
  Input,
  Row,
  Segmented,
  Slider,
  Space,
  Tabs,
  Tag,
  theme as antdTheme,
  Typography,
} from 'antd';
import { AntdProvider, type ThemeMode } from '@/lib/AntdProvider';

const { Title, Text, Paragraph } = Typography;

/* ---------------- helpers ---------------- */

const VAR_PRIMARY = '--brand-primary';
const VAR_SECONDARY = '--brand-secondary';
const VAR_RADIUS = '--brand-radius';
const STORAGE_KEY = '__teams_hq_theme_vars';

type ThemeVars = {
  primary: string;
  secondary: string;
  radius: number;
};

function getCssVar(name: string, fallback = '') {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function setCssVar(name: string, value: string) {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(name, value);
}

function toHex(input: string) {
  // handles hex, rgb, hsl; returns hex-ish string AntD ColorPicker can ingest
  const el = document.createElement('div');
  el.style.color = input;
  document.body.appendChild(el);
  const rgb = getComputedStyle(el).color; // e.g. rgb(255, 59, 126)
  document.body.removeChild(el);
  const m = rgb.match(/\d+/g)?.map(Number) || [255, 255, 255];
  const hex = `#${m
    .slice(0, 3)
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')}`;
  return hex.toUpperCase();
}

/* ---------------- page ---------------- */

export default function ThemingPage() {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const { token } = antdTheme.useToken();

  // local theme vars (bound to CSS vars)
  const [vars, setVars] = useState<ThemeVars>({
    primary: '#FF3B7E',
    secondary: '#47C5FB',
    radius: 14,
  });

  // init from CSS vars or localStorage
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      const parsed: ThemeVars = JSON.parse(saved);
      setVars(parsed);
      setCssVar(VAR_PRIMARY, parsed.primary);
      setCssVar(VAR_SECONDARY, parsed.secondary);
      setCssVar(VAR_RADIUS, `${parsed.radius}px`);
      return;
    }
    const initial: ThemeVars = {
      primary: toHex(getCssVar(VAR_PRIMARY, '#FF3B7E')),
      secondary: toHex(getCssVar(VAR_SECONDARY, '#47C5FB')),
      radius: Number(getCssVar(VAR_RADIUS, '14px').replace('px', '')) || 14,
    };
    setVars(initial);
  }, []);

  // persist on change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vars));
  }, [vars]);

  const gradientBorder: React.CSSProperties = useMemo(
    () => ({
      backgroundImage:
        'linear-gradient(#111,#111) padding-box, linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)) border-box',
      border: '1px solid transparent',
      borderRadius: 14,
    }),
    []
  );

  const cssBlock = useMemo(
    () =>
      `:root {
  ${VAR_PRIMARY}: ${vars.primary};
  ${VAR_SECONDARY}: ${vars.secondary};
  ${VAR_RADIUS}: ${vars.radius}px;
}`,
    [vars]
  );

  return (
    <AntdProvider mode={mode}>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {/* header */}
        <Flex align="center" justify="space-between">
          <div>
            <Title level={3} style={{ marginBottom: 2 }}>
              Theming
            </Title>
            <Text type="secondary">Ant Design tokens + your CSS variables (live).</Text>
          </div>
          <Segmented
            options={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
              { label: 'System', value: 'system' },
            ]}
            value={mode}
            onChange={(v) => setMode(v as ThemeMode)}
          />
        </Flex>

        {/* quick brand editor */}
        <Card title="Brand" style={gradientBorder} extra={<Badge color="var(--brand-secondary)" />}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Swatch
                label="Primary"
                value={vars.primary}
                onChange={(hex) => {
                  setVars((s) => ({ ...s, primary: hex }));
                  setCssVar(VAR_PRIMARY, hex);
                }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Swatch
                label="Secondary"
                value={vars.secondary}
                onChange={(hex) => {
                  setVars((s) => ({ ...s, secondary: hex }));
                  setCssVar(VAR_SECONDARY, hex);
                }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text type="secondary">Radius</Text>
                <Slider
                  value={vars.radius}
                  min={0}
                  max={24}
                  onChange={(v) => {
                    setVars((s) => ({ ...s, radius: Number(v) }));
                    setCssVar(VAR_RADIUS, `${v}px`);
                  }}
                />
                <div
                  style={{
                    height: 48,
                    borderRadius: `var(${VAR_RADIUS})`,
                    background: 'rgba(255,255,255,.06)',
                    border: '1px dashed rgba(255,255,255,.15)',
                  }}
                />
              </Space>
            </Col>
          </Row>

          <Divider style={{ margin: '16px 0' }} />

          <Space wrap>
            <Button
              onClick={() => {
                const def: ThemeVars = { primary: '#FF3B7E', secondary: '#47C5FB', radius: 14 };
                setVars(def);
                setCssVar(VAR_PRIMARY, def.primary);
                setCssVar(VAR_SECONDARY, def.secondary);
                setCssVar(VAR_RADIUS, `${def.radius}px`);
              }}
            >
              Reset to defaults
            </Button>
            <Button
              type="primary"
              onClick={async () => {
                await navigator.clipboard.writeText(cssBlock);
              }}
            >
              Copy CSS variables
            </Button>
          </Space>
        </Card>

        {/* token & preview desk */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Semantic Tokens" style={gradientBorder}>
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <TokenTile name="Primary" color={token.colorPrimary} />
                </Col>
                <Col span={12}>
                  <TokenTile name="Success" color={token.colorSuccess} />
                </Col>
                <Col span={12}>
                  <TokenTile name="Warning" color={token.colorWarning} />
                </Col>
                <Col span={12}>
                  <TokenTile name="Error" color={token.colorError} />
                </Col>
                <Col span={12}>
                  <TokenTile name="Text" color={token.colorText} />
                </Col>
                <Col span={12}>
                  <TokenTile name="Border" color={token.colorBorder} />
                </Col>
              </Row>
            </Card>

            <Card title="Shadows & Elevation" style={{ ...gradientBorder, marginTop: 16 }}>
              <Row gutter={[12, 12]}>
                {[token.boxShadowSecondary, token.boxShadow, token.boxShadowTertiary].map(
                  (s, i) => (
                    <Col span={8} key={i}>
                      <div
                        style={{
                          height: 70,
                          borderRadius: `var(${VAR_RADIUS})`,
                          background: token.colorBgContainer,
                          boxShadow: s,
                        }}
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {i === 0 ? 'Secondary' : i === 1 ? 'Primary' : 'Tertiary'}
                      </Text>
                    </Col>
                  )
                )}
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Component Preview" style={gradientBorder}>
              <Tabs
                items={[
                  {
                    key: 'buttons',
                    label: 'Buttons',
                    children: (
                      <Space wrap>
                        <Button type="primary">Primary</Button>
                        <Button>Default</Button>
                        <Button danger>Danger</Button>
                        <Button type="dashed">Dashed</Button>
                        <Button ghost>Ghost</Button>
                      </Space>
                    ),
                  },
                  {
                    key: 'inputs',
                    label: 'Inputs',
                    children: (
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Input placeholder="Text input" />
                        <Alert
                          type="info"
                          message="Info Alert"
                          description="Helpful context appears here."
                          showIcon
                        />
                        <Space wrap>
                          <Tag color="magenta">Primary</Tag>
                          <Tag color="geekblue">Secondary</Tag>
                          <Tag color="cyan">Pill</Tag>
                        </Space>
                      </Space>
                    ),
                  },
                  {
                    key: 'cards',
                    label: 'Cards',
                    children: (
                      <Row gutter={[12, 12]}>
                        <Col span={12}>
                          <Card
                            title="Gradient Surface"
                            style={{
                              backgroundImage:
                                'linear-gradient(#111,#111) padding-box, linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)) border-box',
                              border: '1px solid transparent',
                              borderRadius: `var(${VAR_RADIUS})`,
                            }}
                          >
                            <Paragraph type="secondary">
                              Uses your brand gradient border token.
                            </Paragraph>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Elevated">
                            <Paragraph type="secondary">
                              Matches AntD container colors & shadows.
                            </Paragraph>
                          </Card>
                        </Col>
                      </Row>
                    ),
                  },
                  {
                    key: 'typography',
                    label: 'Typography',
                    children: (
                      <Space direction="vertical">
                        <Title level={3} style={{ margin: 0 }}>
                          Heading 3 · {token.fontSizeHeading3}px
                        </Title>
                        <Title level={4} style={{ margin: 0 }}>
                          Heading 4 · {token.fontSizeHeading4}px
                        </Title>
                        <Paragraph>
                          Body text uses <b>{token.fontFamily}</b> at {token.fontSize}px with line
                          height {token.lineHeight}px.
                        </Paragraph>
                      </Space>
                    ),
                  },
                ]}
              />
            </Card>

            <Card title="Spacing Scale (4pt-based)" style={{ ...gradientBorder, marginTop: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {[4, 8, 12, 16, 20, 24, 28].map((n) => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 56, opacity: 0.6 }}>{n}px</div>
                    <div
                      style={{
                        height: 10,
                        width: n * 6,
                        borderRadius: 6,
                        background:
                          'linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))',
                      }}
                    />
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* export block */}
        <Card title="Export (copy & paste)" style={gradientBorder}>
          <pre
            style={{
              margin: 0,
              padding: 12,
              borderRadius: 10,
              background: '#0f0f12',
              overflowX: 'auto',
            }}
          >
            {cssBlock}
          </pre>
          <Divider />
          <Alert
            type="success"
            showIcon
            message="Tip"
            description="Drop this block into :root in your global CSS to bake your current brand into any environment (Storybook, marketing site, etc.)."
          />
        </Card>
      </Space>
    </AntdProvider>
  );
}

/* ---------------- small pieces ---------------- */

function Swatch({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Text type="secondary">{label}</Text>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            height: 48,
            borderRadius: 8,
            background: value,
            border: '1px solid rgba(255,255,255,.12)',
          }}
        />
        <ColorPicker
          value={value}
          onChange={(_, hex) => onChange(hex.toUpperCase())}
          presets={[
            { label: 'Brand', colors: ['#FF3B7E', '#47C5FB'] },
            { label: 'Brights', colors: ['#F59E0B', '#22C55E', '#6366F1', '#06B6D4'] },
          ]}
        />
      </div>
      <Input size="small" value={value} onChange={(e) => onChange(e.target.value)} />
    </Space>
  );
}

function TokenTile({ name, color }: { name: string; color: string }) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,.12)',
        padding: 10,
      }}
    >
      <div
        style={{
          height: 38,
          borderRadius: 8,
          background: color,
          marginBottom: 8,
          border: '1px solid rgba(0,0,0,.08)',
        }}
      />
      <Text style={{ fontSize: 12 }}>{name}</Text>
      <div style={{ fontSize: 11, opacity: 0.65 }}>{color}</div>
    </div>
  );
}
