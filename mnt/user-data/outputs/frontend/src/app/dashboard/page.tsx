'use client';
import { useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import { Card, Badge } from '@/components/ui';
import { User, Shield, Clock, Activity, ArrowUpRight } from 'lucide-react';

const Page = styled.main`
  min-height: 100vh;
  padding: 88px 24px 48px;
  max-width: 1100px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 40px;
`;

const Greeting = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 6px;
  span { background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
`;

const Sub = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled(Card)`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.2s;
  &:hover { border-color: ${({ theme }) => theme.colors.borderHover}; transform: translateY(-2px); }
`;

const StatIcon = styled.div<{ color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${({ color }) => color}18;
  border: 1px solid ${({ color }) => color}30;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
  flex-shrink: 0;
`;

const StatInfo = styled.div``;
const StatLabel = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.textMuted}; margin-bottom: 4px;`;
const StatValue = styled.p`font-size: 22px; font-weight: 700; font-family: ${({ theme }) => theme.fonts.heading};`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child { border-bottom: none; }
`;

const ActivityDot = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ color }) => color};
  flex-shrink: 0;
`;

const ActivityText = styled.div`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  span { color: ${({ theme }) => theme.colors.text}; font-weight: 500; }
`;

const ActivityTime = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textDim};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  &:last-child { border-bottom: none; }
`;

const InfoLabel = styled.span`color: ${({ theme }) => theme.colors.textMuted};`;
const InfoValue = styled.span`color: ${({ theme }) => theme.colors.text}; font-weight: 500;`;

export default function DashboardPage() {
  const { user, isAuthenticated, fetchMe } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    fetchMe();
  }, []);

  if (!isAuthenticated && !user) return null;

  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <Page>
      <Navbar />
      <PageHeader>
        <Greeting>Hello, <span>{user?.name?.split(' ')[0] || 'there'}</span> 👋</Greeting>
        <Sub>Here's what's happening with your account today.</Sub>
      </PageHeader>

      <StatsGrid>
        {[
          { icon: <User size={20} />, color: '#7c6dfa', label: 'Account Role', value: user?.role === 'admin' ? 'Admin' : 'User' },
          { icon: <Shield size={20} />, color: '#4ade80', label: 'Status', value: user?.isActive ? 'Active' : 'Inactive' },
          { icon: <Clock size={20} />, color: '#fa6d8d', label: 'Member Since', value: joinDate },
          { icon: <Activity size={20} />, color: '#fbbf24', label: 'API Calls', value: '128' },
        ].map((s) => (
          <StatCard key={s.label}>
            <StatIcon color={s.color}>{s.icon}</StatIcon>
            <StatInfo>
              <StatLabel>{s.label}</StatLabel>
              <StatValue>{s.value}</StatValue>
            </StatInfo>
          </StatCard>
        ))}
      </StatsGrid>

      <Grid>
        <Card>
          <SectionTitle>
            Recent Activity
            <ArrowUpRight size={15} style={{ color: '#555570' }} />
          </SectionTitle>
          {[
            { color: '#7c6dfa', text: <><span>Account created</span> — welcome aboard!</>, time: 'Just now' },
            { color: '#4ade80', text: <><span>Login successful</span> — JWT issued</>, time: '2m ago' },
            { color: '#fa6d8d', text: <><span>Profile fetched</span> — GET /auth/me</>, time: '2m ago' },
            { color: '#fbbf24', text: <><span>Session active</span> — token valid</>, time: 'Ongoing' },
          ].map((a, i) => (
            <ActivityItem key={i}>
              <ActivityDot color={a.color} />
              <ActivityText>{a.text}</ActivityText>
              <ActivityTime>{a.time}</ActivityTime>
            </ActivityItem>
          ))}
        </Card>

        <Card>
          <SectionTitle>Account Info</SectionTitle>
          <InfoRow><InfoLabel>Name</InfoLabel><InfoValue>{user?.name}</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Email</InfoLabel><InfoValue style={{ fontSize: 13 }}>{user?.email}</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Role</InfoLabel><Badge color="purple">{user?.role}</Badge></InfoRow>
          <InfoRow><InfoLabel>Status</InfoLabel><Badge color="green">{user?.isActive ? 'Active' : 'Inactive'}</Badge></InfoRow>
          <InfoRow><InfoLabel>ID</InfoLabel><InfoValue style={{ fontSize: 11, fontFamily: 'monospace' }}>{user?.id?.slice(0, 16)}...</InfoValue></InfoRow>
        </Card>
      </Grid>
    </Page>
  );
}
