'use client';
import { useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import { Card, Badge, Button } from '@/components/ui';
import { Mail, User, Shield, Calendar, Hash, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Page = styled.main`
  min-height: 100vh;
  padding: 88px 24px 48px;
  max-width: 700px;
  margin: 0 auto;
`;

const ProfileHeader = styled(Card)`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 20px;
  padding: 32px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 32px;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`flex: 1;`;

const ProfileName = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const ProfileEmail = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 10px;
`;

const DetailCard = styled(Card)`margin-bottom: 16px;`;

const DetailTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 12px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child { border-bottom: none; }
`;

const DetailIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.bgInput};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;
`;

const DetailContent = styled.div`flex: 1;`;
const DetailLabel = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.textDim}; margin-bottom: 2px;`;
const DetailValue = styled.p`font-size: 14px; color: ${({ theme }) => theme.colors.text}; font-weight: 500;`;

export default function ProfilePage() {
  const { user, isAuthenticated, fetchMe, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    fetchMe();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    router.push('/login');
  };

  if (!user) return null;

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <Page>
      <Navbar />
      <ProfileHeader>
        <Avatar>{user.name?.charAt(0).toUpperCase()}</Avatar>
        <ProfileInfo>
          <ProfileName>{user.name}</ProfileName>
          <ProfileEmail>{user.email}</ProfileEmail>
          <div style={{ display: 'flex', gap: 8 }}>
            <Badge color="purple">{user.role}</Badge>
            <Badge color={user.isActive ? 'green' : 'red'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
          </div>
        </ProfileInfo>
      </ProfileHeader>

      <DetailCard>
        <DetailTitle>Account Details</DetailTitle>
        {[
          { icon: <User size={16} />, label: 'Full Name', value: user.name },
          { icon: <Mail size={16} />, label: 'Email Address', value: user.email },
          { icon: <Shield size={16} />, label: 'Role', value: user.role === 'admin' ? 'Administrator' : 'Standard User' },
          { icon: <Calendar size={16} />, label: 'Member Since', value: joinDate },
          { icon: <Hash size={16} />, label: 'User ID', value: user.id },
        ].map((d) => (
          <DetailRow key={d.label}>
            <DetailIcon>{d.icon}</DetailIcon>
            <DetailContent>
              <DetailLabel>{d.label}</DetailLabel>
              <DetailValue style={{ fontFamily: d.label === 'User ID' ? 'monospace' : 'inherit', fontSize: d.label === 'User ID' ? 12 : 14 }}>
                {d.value}
              </DetailValue>
            </DetailContent>
          </DetailRow>
        ))}
      </DetailCard>

      <Button variant="danger" style={{ width: '100%' }} onClick={handleLogout}>
        <LogOut size={15} /> Sign out of account
      </Button>
    </Page>
  );
}
