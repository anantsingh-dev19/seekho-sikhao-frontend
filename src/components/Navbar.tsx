'use client';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from './ui';
import { LogOut, LayoutDashboard, User, Home } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';


const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const NavLink = styled(Link)<{ active?: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 14px;
  font-weight: 500;
  color: ${({ active, theme }) => active === 'true' ? theme.colors.text : theme.colors.textMuted};
  background: ${({ active, theme }) => active === 'true' ? theme.colors.bgInput : 'transparent'};
  transition: all 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; background: ${({ theme }) => theme.colors.bgInput}; }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: white;
`;

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const { isDark, toggle } = useThemeStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <Nav>
      <Logo href="/">Seekho Sikhao</Logo>
      <NavLinks>
        <NavLink href="/" active={(pathname === '/').toString()}>
          <Home size={15} /> Home
        </NavLink>
        {isAuthenticated && (
          <NavLink href="/dashboard" active={(pathname === '/dashboard').toString()}>
            <LayoutDashboard size={15} /> Dashboard
          </NavLink>
        )}
        {isAuthenticated && (
          <NavLink href="/profile" active={(pathname === '/profile').toString()}>
            <User size={15} /> Profile
          </NavLink>
        )}
        {isAuthenticated && user?.role === 'admin' && (
          <NavLink href="/admin" active={(pathname.startsWith('/admin')).toString()}>
            ⚡ Admin
          </NavLink>
        )}
      </NavLinks>
      <UserInfo>
        {isAuthenticated ? (
          <>
            <Avatar>{user?.name?.charAt(0).toUpperCase()}</Avatar>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={14} /> Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>Login</Button>
            <Button variant="primary" size="sm" onClick={() => router.push('/register')}>Sign Up</Button>
            <button onClick={toggle} style={{ background: 'none', border: `1px solid ${isDark ? '#252535' : '#e2e5f0'}`, borderRadius: '8px', padding: '7px', cursor: 'pointer', color: isDark ? '#8888aa' : '#5a5f7a', display: 'flex', alignItems: 'center' }}>
  {isDark ? <Sun size={16} /> : <Moon size={16} />}
</button>
          </>
        )}
      </UserInfo>
    </Nav>
  );
}