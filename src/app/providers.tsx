'use client';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';
import StyledComponentsRegistry from '@/lib/registry';
import { GlobalStyle } from '@/styles/globalStyle';
import { darkTheme, lightTheme } from '@/styles/theme';
import { useThemeStore } from '@/store/themeStore';

function ThemedApp({ children }: { children: React.ReactNode }) {
  const { isDark } = useThemeStore();
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#13131f' : '#ffffff',
            color: isDark ? '#eeeeff' : '#1a1a2e',
            border: `1px solid ${isDark ? '#252535' : '#e2e5f0'}`,
            fontFamily: "'Inter', sans-serif",
            borderRadius: '12px',
            boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(108,99,255,0.08)',
          },
        }}
      />
    </ThemeProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemedApp>{children}</ThemedApp>
    </StyledComponentsRegistry>
  );
}