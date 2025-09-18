'use client';

import { useMemo, useState } from 'react';
import {
  Affix,
  Badge,
  Button,
  Card,
  Checkbox,
  Descriptions,
  Divider,
  Form,
  Input,
  Result,
  Radio,
  Row,
  Col,
  Select,
  Steps,
  Typography,
  message,
} from 'antd';
import {
  BankOutlined,
  CheckCircleTwoTone,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

type StepKey = 0 | 1 | 2;
type Values = {
  org?: string;
  slug?: string;
  size?: string;
  industry?: string;
  email?: string;
  plan?: 'starter' | 'pro' | 'enterprise';
  cardName?: string;
  cardNumber?: string;
  exp?: string;
  cvc?: string;
  accept?: boolean;
  coupon?: string;
};

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Other'];

const SIZE_OPTIONS = ['1–10', '11–50', '51–200', '200+'];

const PLAN_COPY: Record<
  NonNullable<Values['plan']>,
  { title: string; price: string; perks: string[]; color: string }
> = {
  starter: {
    title: 'Starter',
    price: '$0',
    perks: ['1 project', 'Community support'],
    color: 'default',
  },
  pro: {
    title: 'Pro',
    price: '$24',
    perks: ['Unlimited projects', 'Email support', 'Analytics'],
    color: 'magenta',
  },
  enterprise: {
    title: 'Enterprise',
    price: 'Contact us',
    perks: ['SAML SSO', 'Audit logs', 'Uptime SLA'],
    color: 'geekblue',
  },
};

const gradientBorder = {
  backgroundImage:
    'linear-gradient(#111,#111) padding-box, linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)) border-box',
  border: '1px solid transparent',
  borderRadius: 14,
};

function slugify(s?: string) {
  return (s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 32);
}

export default function FormsPage() {
  const [form] = Form.useForm<Values>();
  const [current, setCurrent] = useState<StepKey>(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // live values for summary
  const org = Form.useWatch('org', form);
  const slug = Form.useWatch('slug', form);
  const size = Form.useWatch('size', form);
  const industry = Form.useWatch('industry', form);
  const plan = Form.useWatch('plan', form) ?? 'pro';
  const email = Form.useWatch('email', form);
  const coupon = Form.useWatch('coupon', form);

  // auto-generate slug from org (editable)
  const onOrgChange = (v: string) => {
    form.setFieldsValue({ org: v, slug: slug?.length ? slug : slugify(v) });
  };

  const steps = [
    {
      title: 'Organization',
      icon: <TeamOutlined />,
    },
    {
      title: 'Billing',
      icon: <BankOutlined />,
    },
    {
      title: 'Confirm',
      icon: <SolutionOutlined />,
    },
  ];

  const stepFields: Record<StepKey, (keyof Values)[]> = {
    0: ['org', 'slug', 'size', 'industry'],
    1: ['email', 'plan', 'cardName', 'cardNumber', 'exp', 'cvc'],
    2: ['accept'],
  };

  type StepKey = 0 | 1 | 2;

  const clampStep = (n: number): StepKey => (n <= 0 ? 0 : n >= 2 ? 2 : (n as StepKey));

  const next = async () => {
    const fields = stepFields[current];
    await form.validateFields(fields as any);
    setCurrent((c) => clampStep(c + 1));
  };

  const prev = () => setCurrent((c) => clampStep(c - 1));

  const submit = async () => {
    try {
      await form.validateFields(stepFields[2] as any);
      setSubmitting(true);
      // simulate API
      await new Promise((r) => setTimeout(r, 900));
      message.success('Submitted! (mock)');
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <Result
        icon={<CheckCircleTwoTone twoToneColor="var(--brand-secondary)" />}
        title="You’re all set!"
        subTitle="Your workspace has been created and billing is configured."
        extra={
          <Button type="primary" onClick={() => setDone(false)}>
            Create another
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <Title level={3} style={{ marginBottom: 4 }}>
        Forms
      </Title>
      <Text type="secondary">Multi-step flow with validation affordances.</Text>

      <Steps current={current} items={steps} style={{ margin: '16px 0' }} />

      <Row gutter={[16, 16]}>
        {/* Main form */}
        <Col xs={24} lg={16}>
          <Card style={{ ...gradientBorder }}>
            <Form
              layout="vertical"
              form={form}
              initialValues={{
                plan: 'pro',
              }}
              requiredMark="optional"
            >
              {current === 0 && (
                <>
                  <Badge.Ribbon text="Step 1" color="blue">
                    <Card size="small" style={{ borderRadius: 12, marginBottom: 12 }}>
                      <Form.Item
                        label="Organization"
                        name="org"
                        rules={[
                          { required: true, message: 'Please enter your org name' },
                          { min: 2, message: 'Name is too short' },
                        ]}
                      >
                        <Input
                          placeholder="Acme Inc."
                          onChange={(e) => onOrgChange(e.target.value)}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Workspace URL"
                        name="slug"
                        tooltip="This becomes your workspace subdomain."
                        rules={[
                          { required: true, message: 'Please enter a workspace URL' },
                          {
                            pattern: /^[a-z0-9-]{2,32}$/,
                            message: 'Only letters, numbers and dashes (2–32 chars)',
                          },
                        ]}
                      >
                        <Input addonBefore="teams-hq.io/" placeholder="acme" />
                      </Form.Item>

                      <Row gutter={12}>
                        <Col xs={24} md={12}>
                          <Form.Item label="Team size" name="size" rules={[{ required: true }]}>
                            <Select
                              placeholder="Choose size"
                              options={SIZE_OPTIONS.map((s) => ({ value: s, label: s }))}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item label="Industry" name="industry" rules={[{ required: true }]}>
                            <Select
                              placeholder="Choose industry"
                              options={INDUSTRIES.map((s) => ({ value: s, label: s }))}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  </Badge.Ribbon>
                </>
              )}

              {current === 1 && (
                <>
                  <Badge.Ribbon text="Step 2" color="purple">
                    <Card size="small" style={{ borderRadius: 12, marginBottom: 12 }}>
                      <Form.Item
                        label="Billing email"
                        name="email"
                        rules={[{ required: true }, { type: 'email' }]}
                      >
                        <Input placeholder="you@company.com" />
                      </Form.Item>

                      <Form.Item label="Plan" name="plan" rules={[{ required: true }]}>
                        <Radio.Group style={{ width: '100%' }}>
                          <Row gutter={[12, 12]}>
                            {(['starter', 'pro', 'enterprise'] as const).map((p) => (
                              <Col xs={24} md={8} key={p}>
                                <Card
                                  hoverable
                                  onClick={() => form.setFieldsValue({ plan: p })}
                                  style={{
                                    borderRadius: 12,
                                    ...(form.getFieldValue('plan') === p
                                      ? {
                                          borderColor: 'transparent',
                                          background:
                                            'linear-gradient(#141414,#141414) padding-box, linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)) border-box',
                                          border: '1px solid transparent',
                                        }
                                      : {}),
                                  }}
                                >
                                  <Radio checked={form.getFieldValue('plan') === p}>
                                    {PLAN_COPY[p].title}
                                  </Radio>
                                  <Divider style={{ margin: '8px 0' }} />
                                  <Text strong>{PLAN_COPY[p].price}</Text>
                                  <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                                    {PLAN_COPY[p].perks.map((k) => (
                                      <li key={k} style={{ opacity: 0.8 }}>
                                        {k}
                                      </li>
                                    ))}
                                  </ul>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        </Radio.Group>
                      </Form.Item>

                      <Row gutter={12}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Cardholder name"
                            name="cardName"
                            rules={[{ required: true }]}
                          >
                            <Input placeholder="Jane Doe" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Card number"
                            name="cardNumber"
                            rules={[
                              { required: true },
                              { pattern: /^[0-9 ]{12,19}$/, message: 'Enter a valid card number' },
                            ]}
                          >
                            <Input placeholder="4242 4242 4242 4242" inputMode="numeric" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={12}>
                        <Col xs={12} md={8}>
                          <Form.Item label="Expiry" name="exp" rules={[{ required: true }]}>
                            <Input placeholder="MM/YY" />
                          </Form.Item>
                        </Col>
                        <Col xs={12} md={8}>
                          <Form.Item
                            label="CVC"
                            name="cvc"
                            rules={[{ required: true }, { len: 3, message: '3 digits' }]}
                          >
                            <Input placeholder="123" inputMode="numeric" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item label="Coupon (optional)" name="coupon">
                            <Input placeholder="SAVE20" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  </Badge.Ribbon>
                </>
              )}

              {current === 2 && (
                <>
                  <Badge.Ribbon text="Step 3" color="cyan">
                    <Card size="small" style={{ borderRadius: 12, marginBottom: 12 }}>
                      <Text>Review your details and submit.</Text>
                      <Divider />
                      <Descriptions
                        column={1}
                        size="small"
                        items={[
                          { key: 'org', label: 'Organization', children: org || '-' },
                          {
                            key: 'slug',
                            label: 'Workspace URL',
                            children: slug ? `teams-hq.io/${slug}` : '-',
                          },
                          { key: 'size', label: 'Team size', children: size || '-' },
                          { key: 'industry', label: 'Industry', children: industry || '-' },
                          { key: 'plan', label: 'Plan', children: PLAN_COPY[plan].title },
                          { key: 'email', label: 'Billing email', children: email || '-' },
                          ...(coupon ? [{ key: 'coupon', label: 'Coupon', children: coupon }] : []),
                        ]}
                      />
                      <Divider />
                      <Form.Item
                        name="accept"
                        valuePropName="checked"
                        rules={[
                          {
                            validator: (_, v) =>
                              v ? Promise.resolve() : Promise.reject('You must accept the terms'),
                          },
                        ]}
                      >
                        <Checkbox>
                          I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
                        </Checkbox>
                      </Form.Item>
                    </Card>
                  </Badge.Ribbon>
                </>
              )}
            </Form>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <Button disabled={current === 0} onClick={prev}>
                Back
              </Button>
              {current < 2 ? (
                <Button type="primary" onClick={next}>
                  Continue
                </Button>
              ) : (
                <Button type="primary" loading={submitting} onClick={submit}>
                  Submit
                </Button>
              )}
            </div>
          </Card>
        </Col>

        {/* Live summary / right rail */}
        <Col xs={24} lg={8}>
          <Affix offsetTop={16}>
            <Card
              title="Summary"
              style={{
                ...gradientBorder,
              }}
              extra={
                <Badge
                  status={current < 2 ? 'processing' : 'success'}
                  text={current < 2 ? 'In progress' : 'Ready'}
                />
              }
            >
              <Descriptions size="small" column={1} colon>
                <Descriptions.Item label="Organization">{org || <em>—</em>}</Descriptions.Item>
                <Descriptions.Item label="Workspace URL">
                  {slug ? `teams-hq.io/${slug}` : <em>—</em>}
                </Descriptions.Item>
                <Descriptions.Item label="Team size">{size || <em>—</em>}</Descriptions.Item>
                <Descriptions.Item label="Industry">{industry || <em>—</em>}</Descriptions.Item>
                <Descriptions.Item label="Plan">
                  <Badge color={PLAN_COPY[plan].color} text={PLAN_COPY[plan].title} />
                </Descriptions.Item>
                <Descriptions.Item label="Billing email">{email || <em>—</em>}</Descriptions.Item>
                {coupon && <Descriptions.Item label="Coupon">{coupon}</Descriptions.Item>}
              </Descriptions>

              <Divider />
              <div style={{ display: 'grid', gap: 6 }}>
                <Text type="secondary">What you get</Text>
                <ul style={{ margin: 0, paddingInlineStart: 18 }}>
                  {PLAN_COPY[plan].perks.map((p) => (
                    <li key={p} style={{ opacity: 0.85 }}>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Affix>
        </Col>
      </Row>
    </div>
  );
}
