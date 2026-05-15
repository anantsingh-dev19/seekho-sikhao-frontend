'use client';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { Button, Input, Card, Label, FormGroup, ErrorText, Spinner } from '@/components/ui';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';

const Page = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(124,109,250,0.1) 0%, transparent 60%);
    pointer-events: none;
  }
`;

const Box = styled(Card)`
  width: 100%;
  max-width: 420px;
  padding: 40px;
`;

const Logo = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 32px;
`;

const InputWrapper = styled.div`
  position: relative;
  svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: ${({ theme }) => theme.colors.textDim}; }
  input { padding-left: 42px; }
`;

const Footer = styled.p`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 24px;
  a { color: ${({ theme }) => theme.colors.primary}; font-weight: 500; }
  a:hover { text-decoration: underline; }
`;

interface FormData { email: string; password: string; }

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Page>
      <Box>
        <Logo>MyApp</Logo>
        <Title>Welcome back</Title>
        <Subtitle>Sign in to your account to continue</Subtitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Email address</Label>
            <InputWrapper>
              <Mail size={16} />
              <Input
                type="email"
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })}
              />
            </InputWrapper>
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <InputWrapper>
              <Lock size={16} />
              <Input
                type="password"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
              />
            </InputWrapper>
            {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          </FormGroup>

          <Button variant="primary" style={{ width: '100%' }} type="submit" disabled={isLoading}>
            {isLoading ? <Spinner /> : 'Sign In'}
          </Button>
        </form>

        <Footer>
          Don't have an account? <Link href="/register">Sign up</Link>
        </Footer>
      </Box>
    </Page>
  );
}
