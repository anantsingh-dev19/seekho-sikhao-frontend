export const lightTheme = {
  colors: {
    bg: '#f8f9ff',
    bgCard: '#ffffff',
    bgInput: '#f1f3ff',
    border: '#e2e5f0',
    borderHover: '#c5cae8',
    primary: '#6c63ff',
    primaryHover: '#5a52e8',
    primaryGlow: 'rgba(108, 99, 255, 0.2)',
    accent: '#ff6b8a',
    text: '#1a1a2e',
    textMuted: '#5a5f7a',
    textDim: '#9499b5',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    navBg: 'rgba(248, 249, 255, 0.85)',
    sidebarBg: '#ffffff',
    shadow: '0 4px 24px rgba(108, 99, 255, 0.08)',
  },
  fonts: {
    heading: "'Plus Jakarta Sans', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radius: { sm: '8px', md: '12px', lg: '16px', xl: '24px' },
};

export const darkTheme = {
  colors: {
    bg: '#0d0d18',
    bgCard: '#13131f',
    bgInput: '#1a1a28',
    border: '#252535',
    borderHover: '#3a3a55',
    primary: '#7c6dfa',
    primaryHover: '#6a5ce8',
    primaryGlow: 'rgba(124, 109, 250, 0.25)',
    accent: '#fa6d8d',
    text: '#eeeeff',
    textMuted: '#8888aa',
    textDim: '#555570',
    success: '#4ade80',
    error: '#f87171',
    warning: '#fbbf24',
    navBg: 'rgba(13, 13, 24, 0.85)',
    sidebarBg: '#0f0f1a',
    shadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
  },
  fonts: {
    heading: "'Plus Jakarta Sans', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radius: { sm: '8px', md: '12px', lg: '16px', xl: '24px' },
};

export type Theme = typeof darkTheme;