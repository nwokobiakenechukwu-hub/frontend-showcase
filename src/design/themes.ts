import { tokens } from './tokens';

export const lightTheme = {
  ...tokens,
  color: {
    ...tokens.color,
    bg: { base: '#FFFFFF', elevated: '#F9FAFB', surface: '#FFFFFF' },
    text: { base: '#0B0D10', muted: '#5B6470', inverted: '#FFFFFF' },
  },
};

export const darkTheme = tokens;
export type Theme = typeof darkTheme;
