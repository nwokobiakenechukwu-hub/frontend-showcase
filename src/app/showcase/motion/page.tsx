'use client';

import { useMemo, useState } from 'react';
import { Button, Card, Col, Row, Segmented, Slider, Space, Switch, Tag, Typography } from 'antd';
import { AnimatePresence, Reorder, motion, type Transition } from 'framer-motion';

const { Title, Text } = Typography;

type DemoKey = 'Micro' | 'Reorder' | 'Stagger' | 'Presence';

// Brand variables (hooked to your CSS vars)
const BRAND_PRIMARY = 'var(--brand-primary)'; // #FF3B7E
const BRAND_SECONDARY = 'var(--brand-secondary)'; // #47C5FB

const SPRING: Transition = { type: 'spring', stiffness: 520, damping: 32, mass: 0.9 };

export default function MotionPage() {
  const [demo, setDemo] = useState<DemoKey>('Micro');
  const [reduced, setReduced] = useState(false);

  return (
    <div>
      {/* Header / Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          marginBottom: 16,
        }}
      >
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Motion
          </Title>
          <Text type="secondary">
            Micro-interactions, reordering, staggered lists, and presence.
          </Text>
        </div>

        <Space align="center" size="large">
          <Space>
            <Text type="secondary">Reduce motion</Text>
            <Switch checked={reduced} onChange={setReduced} />
          </Space>
          <Segmented
            options={['Micro', 'Reorder', 'Stagger', 'Presence']}
            value={demo}
            onChange={(v) => setDemo(v as DemoKey)}
          />
        </Space>
      </div>

      {demo === 'Micro' && <MicroGrid reduced={reduced} />}
      {demo === 'Reorder' && <ReorderDemo reduced={reduced} />}
      {demo === 'Stagger' && <StaggerDemo reduced={reduced} />}
      {demo === 'Presence' && <PresenceDemo reduced={reduced} />}
    </div>
  );
}

/* --------------------------- 1) Micro-interactions grid --------------------------- */

function MicroGrid({ reduced }: { reduced: boolean }) {
  const tiles = useMemo(() => Array.from({ length: 8 }, (_, i) => `Tile ${i + 1}`), []);
  return (
    <Row gutter={[16, 16]}>
      {tiles.map((label, i) => (
        <Col xs={24} sm={12} lg={6} key={label}>
          <HoverCard label={label} delay={i * 0.04} reduced={reduced} />
        </Col>
      ))}
    </Row>
  );
}

function HoverCard({
  label,
  delay = 0,
  reduced,
}: {
  label: string;
  delay?: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={reduced ? { duration: 0 } : { ...SPRING, delay }}
      whileHover={reduced ? undefined : { y: -6, scale: 1.02 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      style={{ borderRadius: 14 }}
    >
      <Card
        hoverable
        styles={{ body: { padding: 16 } }}
        style={{
          borderRadius: 14,
          position: 'relative',
          overflow: 'hidden',
          // subtle gradient border
          backgroundImage:
            'linear-gradient(#121212, #121212), linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          border: '1px solid transparent',
        }}
      >
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Tag color="geekblue" bordered={false} style={{ alignSelf: 'flex-start' }}>
            Micro
          </Tag>
          <Text strong>({label})</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Hover ↑, press ↓ — springy, brand-tinted elevation.
          </Text>
        </Space>

        {/* sheen on hover */}
        {!reduced && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.12 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute',
              inset: -2,
              background: `radial-gradient(600px 200px at 30% -10%, ${BRAND_SECONDARY}, transparent 60%),
                 radial-gradient(400px 160px at 110% 10%, ${BRAND_PRIMARY}, transparent 60%)`,
              pointerEvents: 'none',
            }}
          />
        )}
      </Card>
    </motion.div>
  );
}

/* --------------------------- 2) Reorder / drag demo --------------------------- */

function ReorderDemo({ reduced }: { reduced: boolean }) {
  const [items, setItems] = useState(() => ['Design', 'Docs', 'Forms', 'A11y', 'Charts', 'Motion']);
  return (
    <Card
      title="Reorder pills"
      extra={<Text type="secondary">drag to sort</Text>}
      style={{ borderRadius: 14, marginTop: 16 }}
    >
      <Reorder.Group
        axis="x"
        values={items}
        onReorder={setItems}
        as="div" // ✅ must be a string tag name
        style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}
      >
        {items.map((val) => (
          <Reorder.Item
            key={val}
            value={val}
            as="div" // ✅ string tag; Reorder.Item is already motion-enabled
            transition={reduced ? { duration: 0 } : SPRING}
            whileDrag={{ scale: 1.06 }}
            style={{ cursor: 'grab' }}
          >
            <Tag
              color="magenta"
              style={{
                borderRadius: 10,
                padding: '6px 10px',
                fontWeight: 600,
                background: 'rgba(255,59,126,0.12)',
                borderColor: 'rgba(255,59,126,0.35)',
              }}
            >
              {val}
            </Tag>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </Card>
  );
}

/* --------------------------- 3) Staggered list + shuffle --------------------------- */

function StaggerDemo({ reduced }: { reduced: boolean }) {
  const [seed, setSeed] = useState(1);
  const items = useMemo(
    () =>
      ['Buttons', 'Tables', 'Inputs', 'Cards', 'Charts', 'Modals', 'Toasts'].map(
        (s) => `${s} · ${seed}`
      ),
    [seed]
  );

  return (
    <Card
      title="Staggered entrance"
      extra={<Button onClick={() => setSeed((s) => s + 1)}>Shuffle</Button>}
      style={{ borderRadius: 14, marginTop: 16 }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 12,
        }}
      >
        <AnimatePresence initial={false}>
          {items.map((text, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={reduced ? { duration: 0 } : { ...SPRING, delay: i * 0.05 }}
            >
              <Card
                size="small"
                style={{
                  borderRadius: 12,
                  background:
                    'linear-gradient(#111,#111) padding-box, linear-gradient(135deg, var(--brand-secondary),rgba(71,197,251,0.15)) border-box',
                  border: '1px solid transparent',
                }}
              >
                <Text>{text}</Text>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}

/* --------------------------- 4) Presence (open/close with spring controls) --------------------------- */

function PresenceDemo({ reduced }: { reduced: boolean }) {
  const [open, setOpen] = useState(false);
  const [stiffness, setStiffness] = useState(480);
  const [damping, setDamping] = useState(34);

  const spring: Transition = reduced
    ? { duration: 0 }
    : { type: 'spring', stiffness, damping, mass: 0.9 };

  return (
    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      <Col xs={24} lg={16}>
        <Card title="Presence panel" style={{ borderRadius: 14 }}>
          <Button type="primary" onClick={() => setOpen(true)}>
            Open details
          </Button>

          <AnimatePresence>
            {open && (
              <motion.div
                key="sheet"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={spring}
                style={{
                  marginTop: 16,
                  borderRadius: 14,
                  padding: 16,
                  background:
                    'linear-gradient(#0f0f10,#0f0f10) padding-box, linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)) border-box',
                  border: '1px solid transparent',
                }}
              >
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Tag color="cyan">Presence</Tag>
                  <Text strong>Animated sheet</Text>
                  <Text type="secondary">
                    AnimatePresence mounts/unmounts this block with a spring. Tweak the spring on
                    the right.
                  </Text>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                  </div>
                </Space>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card title="Spring controls" style={{ borderRadius: 14 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text type="secondary">Stiffness</Text>
              <Slider
                min={100}
                max={900}
                step={10}
                value={stiffness}
                onChange={(v) => typeof v === 'number' && setStiffness(v)}
              />
            </div>
            <div>
              <Text type="secondary">Damping</Text>
              <Slider
                min={10}
                max={80}
                step={1}
                value={damping}
                onChange={(v) => typeof v === 'number' && setDamping(v)}
              />
            </div>
            <Text type="secondary">
              Tip: toggle “Reduce motion” to instantly disable animations.
            </Text>
          </Space>
        </Card>
      </Col>
    </Row>
  );
}
