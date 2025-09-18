export const tokens = {
  color: {
    primary: '#FF3B7E',
    secondary: '#47C5FB',
    accent: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    bg: { base: '#0B0D10', elevated: '#0F1318', surface: '#121720' },
    text: { base: '#E8EEF6', muted: '#97A3B0', inverted: '#0B0D10' },
  },
  radius: { sm: '8px', md: '14px', lg: '20px', xl: '28px', full: '999px' },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48 },
  shadow: {
    soft: '0 8px 28px rgba(0,0,0,0.25)',
    ring: '0 0 0 1px rgba(255,255,255,0.06) inset',
  },
  motion: { fast: '120ms', base: '200ms', slow: '320ms' },
} as const;

export const gradients = {
  brand: 'linear-gradient(135deg, #FF3B7E 0%, #47C5FB 100%)',
  hero: 'radial-gradient(800px 400px at 50% -20%, rgba(71,197,251,0.25), transparent), radial-gradient(600px 320px at 100% 0%, rgba(255,59,126,0.18), transparent)',
} as const;

export type Tokens = typeof tokens;
