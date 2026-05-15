import styled, { css, keyframes } from 'styled-components';

const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;

export const Button = styled.button<{ variant?: 'primary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'; loading?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: ${({ loading }) => loading ? 'not-allowed' : 'pointer'};
  opacity: ${({ loading }) => loading ? 0.7 : 1};
  position: relative;

  ${({ size = 'md' }) => ({
    sm: css`padding: 8px 16px; font-size: 13px;`,
    md: css`padding: 12px 24px; font-size: 14px;`,
    lg: css`padding: 16px 32px; font-size: 16px;`,
  }[size])}

  ${({ variant = 'primary', theme }) => ({
    primary: css`
      background: ${theme.colors.primary};
      color: white;
      box-shadow: 0 0 20px ${theme.colors.primaryGlow};
      &:hover { background: ${theme.colors.primaryHover}; transform: translateY(-1px); box-shadow: 0 0 30px ${theme.colors.primaryGlow}; }
      &:active { transform: translateY(0); }
    `,
    ghost: css`
      background: transparent;
      color: ${theme.colors.textMuted};
      border: 1px solid ${theme.colors.border};
      &:hover { border-color: ${theme.colors.borderHover}; color: ${theme.colors.text}; }
    `,
    danger: css`
      background: rgba(248, 113, 113, 0.1);
      color: ${theme.colors.error};
      border: 1px solid rgba(248, 113, 113, 0.3);
      &:hover { background: rgba(248, 113, 113, 0.2); }
    `,
  }[variant])}

  width: ${({ style }) => style?.width === '100%' ? '100%' : 'auto'};
`;

export const Input = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.colors.bgInput};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  padding: 12px 16px;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder { color: ${({ theme }) => theme.colors.textDim}; }
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryGlow}; }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
`;

export const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 6px;
  letter-spacing: 0.03em;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
`;

export const ErrorText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
  margin-top: 4px;
`;

export const Badge = styled.span<{ color?: 'green' | 'purple' | 'red' | 'yellow' }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;

  ${({ color = 'purple', theme }) => ({
    green: css`background: rgba(74,222,128,0.1); color: ${theme.colors.success}; border: 1px solid rgba(74,222,128,0.2);`,
    purple: css`background: rgba(124,109,250,0.1); color: ${theme.colors.primary}; border: 1px solid rgba(124,109,250,0.2);`,
    red: css`background: rgba(248,113,113,0.1); color: ${theme.colors.error}; border: 1px solid rgba(248,113,113,0.2);`,
    yellow: css`background: rgba(251,191,36,0.1); color: ${theme.colors.warning}; border: 1px solid rgba(251,191,36,0.2);`,
  }[color])}
`;

export const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;
