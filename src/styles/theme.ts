export const colors = {
  primary: {
    deepBlue: '#1a365d',
    navy: '#0d1b2a',
    royal: '#1e3a5f',
  },
  accent: {
    gold: '#c9a227',
    goldLight: '#e6c55a',
    goldDark: '#8b6914',
  },
  neutral: {
    white: '#ffffff',
    cream: '#faf8f5',
    gray100: '#f7f7f7',
    gray200: '#e8e8e8',
    gray300: '#d4d4d4',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    black: '#111827',
  },
  semantic: {
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#2563eb',
  },
} as const;

export const typography = {
  fonts: {
    english: "'EB Garamond', Georgia, serif",
    arabic: "'Cairo', sans-serif",
  },
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  gold: '0 0 20px rgba(201, 162, 39, 0.3)',
} as const;

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '300ms ease-in-out',
  slow: '500ms ease-in-out',
} as const;

export const borderRadius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  full: '9999px',
} as const;

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  transitions,
  borderRadius,
} as const;

export type Theme = typeof theme;
export default theme;