'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';

const { Title, Paragraph, Text } = Typography;

/** Visually-hidden utility */
const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export default function A11yPage() {
  const mainId = 'a11y-main';
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    document.documentElement.toggleAttribute('data-reduce-motion', reduceMotion);
    return () => document.documentElement.removeAttribute('data-reduce-motion');
  }, [reduceMotion]);

  return (
    <div>
      <SkipLink href={`#${mainId}`} />
      <Flex align="center" justify="space-between">
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Accessibility
          </Title>
          <Text type="secondary">
            Keyboard navigation, focus rings, landmarks, and live regions.
          </Text>
        </div>
        <Space>
          <Text type="secondary">Reduce motion</Text>
          <Switch
            checked={reduceMotion}
            onChange={setReduceMotion}
            aria-label="Toggle reduced motion"
          />
        </Space>
      </Flex>

      <Divider style={{ margin: '12px 0 16px' }} />

      <main id={mainId} role="main">
        <Row gutter={[16, 16]}>
          {/* Focus & keyboard basics */}
          <Col xs={24} lg={12}>
            <Card
              title="Focus & Keyboard (Basics)"
              extra={<Badge color="var(--brand-secondary)" />}
            >
              <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                Use <code>Tab</code> / <code>Shift+Tab</code> to traverse, and notice focus-visible
                rings.
              </Paragraph>
              <Space wrap>
                <Button type="primary">Primary action</Button>
                <Button>Secondary</Button>
                <Button danger>Destructive</Button>
                <a href="#keyboard-demo" className="focusable-link">
                  Focusable Link
                </a>
                <Input placeholder="Focusable input" style={{ width: 220 }} />
              </Space>
            </Card>
          </Col>

          {/* Roving tabindex demo */}
          <Col xs={24} lg={12}>
            <Card id="keyboard-demo" title="Roving Tabindex (Arrow Key Grid)">
              <Paragraph type="secondary" style={{ marginBottom: 8 }}>
                One tab stop; use <kbd>←</kbd>/<kbd>→</kbd> (and <kbd>Home</kbd>/<kbd>End</kbd>) to
                move selection.
              </Paragraph>
              <RovingPills
                ariaLabel="Filter components"
                items={['All', 'Navigation', 'Forms', 'Feedback', 'Data Display', 'Layout']}
              />
            </Card>
          </Col>

          {/* Modal dialog / focus trap */}
          <Col xs={24} lg={12}>
            <A11yModalDemo />
          </Col>

          {/* Live region / status updates */}
          <Col xs={24} lg={12}>
            <LiveRegionDemo />
          </Col>

          {/* Form semantics */}
          <Col xs={24} lg={12}>
            <AccessibleForm />
          </Col>

          {/* Table with caption & scopes */}
          <Col xs={24} lg={12}>
            <AccessibleTable />
          </Col>
        </Row>
      </main>

      {/* Small global helpers */}
      <style jsx global>{`
        :root[data-reduce-motion] * {
          animation: none !important;
          transition: none !important;
          scroll-behavior: auto !important;
        }
        .focusable-link:focus-visible {
          outline: 2px solid var(--brand-secondary);
          outline-offset: 2px;
          border-radius: 6px;
        }
        .skip {
          position: fixed;
          left: 12px;
          top: -40px;
          z-index: 1000;
          padding: 6px 10px;
          border-radius: 8px;
          background: #111;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: top 120ms ease;
        }
        .skip:focus {
          top: 12px;
        }
      `}</style>
    </div>
  );
}

/* -------------------- Pieces -------------------- */

function SkipLink({ href }: { href: string }) {
  return (
    <a className="skip" href={href}>
      Skip to content
    </a>
  );
}

/** Roving tabindex pattern for a set of “pills” */
function RovingPills({ items, ariaLabel }: { items: string[]; ariaLabel: string }) {
  const [index, setIndex] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function focus(i: number) {
    setIndex(i);
    refs.current[i]?.focus();
  }

  return (
    <div role="listbox" aria-label={ariaLabel} aria-activedescendant={`pill-${index}`}>
      <Space wrap>
        {items.map((label, i) => (
          <button
            key={label}
            id={`pill-${i}`}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="option"
            aria-selected={i === index}
            tabIndex={i === index ? 0 : -1}
            onClick={() => focus(i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                focus((i + 1) % items.length);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                focus((i - 1 + items.length) % items.length);
              } else if (e.key === 'Home') {
                e.preventDefault();
                focus(0);
              } else if (e.key === 'End') {
                e.preventDefault();
                focus(items.length - 1);
              }
            }}
            style={{
              borderRadius: 999,
              padding: '6px 12px',
              background: i === index ? 'var(--brand-secondary)' : 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.15)',
              color: i === index ? '#0b1220' : 'inherit',
            }}
          >
            {label}
          </button>
        ))}
      </Space>
    </div>
  );
}

function A11yModalDemo() {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const descId = useId();

  return (
    <Card
      title="Accessible Modal"
      extra={<Tag color="geekblue">Focus trap</Tag>}
      actions={[<Button onClick={() => setOpen(true)}>Open dialog</Button>]}
    >
      <Paragraph type="secondary">
        Uses AntD <code>Modal</code> which traps focus and restores it on close. We also set{' '}
        <code>aria-labelledby</code> and <code>aria-describedby</code>.
      </Paragraph>

      <Modal
        title={<span id={titleId}>Invite team member</span>}
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        okText="Send invite"
        cancelText="Cancel"
        aria-labelledby={titleId}
        aria-describedby={descId}
        destroyOnClose
      >
        <Paragraph id={descId} style={{ marginTop: -8 }} type="secondary">
          Enter an email and choose a role.
        </Paragraph>
        <Form layout="vertical">
          <Form.Item label="Email" required>
            <Input placeholder="name@company.com" inputMode="email" />
          </Form.Item>
          <Form.Item label="Role">
            <Input placeholder="e.g. Admin" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

function LiveRegionDemo() {
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState('');
  const liveRef = useRef<HTMLDivElement | null>(null);

  function add() {
    const next = count + 1;
    setCount(next);
    // update polite live region
    setMsg(`Added to cart. ${next} ${next === 1 ? 'item' : 'items'} total.`);
  }

  return (
    <Card title="Live Region (aria-live='polite')" extra={<Tag color="cyan">Announcements</Tag>}>
      <Paragraph type="secondary" style={{ marginBottom: 8 }}>
        Screen readers hear updates when state changes. Click “Add to cart”.
      </Paragraph>
      <Space align="center">
        <Button type="primary" onClick={add}>
          Add to cart
        </Button>
        <Text>
          Cart: <b>{count}</b>
        </Text>
      </Space>
      <div ref={liveRef} role="status" aria-live="polite" aria-atomic="true" style={srOnly}>
        {msg}
      </div>
      <Alert
        style={{ marginTop: 12 }}
        type="info"
        showIcon
        message="Note"
        description="We use role='status' + aria-live='polite' so announcements don’t interrupt the user."
      />
    </Card>
  );
}

function AccessibleForm() {
  const [form] = Form.useForm();
  const helpId = useId();

  return (
    <Card title="Accessible Form" extra={<Tag color="magenta">Validation</Tag>}>
      <Form
        form={form}
        layout="vertical"
        onFinish={() => {}}
        aria-describedby={helpId}
        requiredMark="optional"
      >
        <Form.Item
          label="Organization"
          name="org"
          rules={[{ required: true, message: 'Organization is required' }]}
          tooltip="This will be visible to your team"
        >
          <Input aria-required="true" placeholder="Org name" />
        </Form.Item>
        <Form.Item
          label="Contact Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Provide a valid email' },
          ]}
        >
          <Input inputMode="email" placeholder="you@company.com" />
        </Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={() => form.resetFields()}>
            Reset
          </Button>
        </Space>
        <div id={helpId} style={{ marginTop: 8 }}>
          <Text type="secondary">
            Errors are announced by screen readers when fields are invalid.
          </Text>
        </div>
      </Form>
    </Card>
  );
}

function AccessibleTable() {
  const data = [
    { key: '1', team: 'Growth', users: 3240, conv: '3.2%' },
    { key: '2', team: 'Core', users: 2890, conv: '2.5%' },
    { key: '3', team: 'Data', users: 1540, conv: '4.1%' },
  ];

  const columns = [
    { title: <span aria-hidden>Team</span>, dataIndex: 'team', key: 'team' },
    { title: <span aria-hidden>Active Users</span>, dataIndex: 'users', key: 'users' },
    { title: <span aria-hidden>Conversion %</span>, dataIndex: 'conv', key: 'conv' },
  ];

  return (
    <Card title="Table with Caption & Scopes" extra={<Tag color="gold">Data</Tag>}>
      <Text style={srOnly} id="teams-caption">
        Top teams by active users and conversion.
      </Text>
      <Table
        aria-labelledby="teams-caption"
        size="small"
        pagination={false}
        dataSource={data}
        columns={columns}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>7,670</Table.Summary.Cell>
              <Table.Summary.Cell index={2}>—</Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
}
