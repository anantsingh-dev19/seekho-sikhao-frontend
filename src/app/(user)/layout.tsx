'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Home, LayoutDashboard, BookOpen, ShoppingBag, User, LogOut, Menu, X ,ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, fetchMe, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    fetchMe();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    router.push('/login');
  };

 const links = [
  { href: '/', icon: <Home size={18} />, label: 'Home' },
  { href: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { href: '/courses', icon: <BookOpen size={18} />, label: 'Courses' },
  { href: '/shop', icon: <ShoppingBag size={18} />, label: 'Shop' },
  { href: '/my-courses', icon: <BookOpen size={18} />, label: 'My Courses' },
  { href: '/my-orders', icon: <ShoppingBag size={18} />, label: 'My Orders' },
  { href: '/profile', icon: <User size={18} />, label: 'Profile' },
  { href: '/cart', icon: <ShoppingCart size={18} />, label: 'Cart' },
];

  const s: any = {
    layout: { display: 'flex', minHeight: '100vh', background: '#0a0a0f' },
    sidebar: { width: collapsed ? 64 : 220, background: '#111118', borderRight: '1px solid #2a2a3a', display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease', overflow: 'hidden', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50 },
    logo: { display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: collapsed ? '20px 0' : '20px 16px', borderBottom: '1px solid #2a2a3a' },
    logoText: { color: '#7c6dfa', fontWeight: 800, fontSize: 18, whiteSpace: 'nowrap' },
    toggleBtn: { background: 'none', border: 'none', color: '#8888aa', cursor: 'pointer', padding: 4, display: 'flex' },
    nav: { flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 },
    link: { display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '10px 0' : '10px 12px', borderRadius: 8, color: '#8888aa', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'all 0.2s', justifyContent: collapsed ? 'center' : 'flex-start', whiteSpace: 'nowrap' },
    activeLink: { background: 'rgba(124,109,250,0.15)', color: '#7c6dfa' },
    footer: { padding: collapsed ? '16px 0' : '16px', borderTop: '1px solid #2a2a3a' },
    avatar: { width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c6dfa, #fa6d8d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0 },
    userInfo: { display: collapsed ? 'none' : 'block', marginLeft: 10, overflow: 'hidden' },
    userName: { color: '#f0f0ff', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    userRole: { color: '#555570', fontSize: 11 },
    logoutBtn: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: collapsed ? '8px 0' : '8px 4px', justifyContent: collapsed ? 'center' : 'flex-start', width: '100%' },
    main: { marginLeft: collapsed ? 64 : 220, flex: 1, transition: 'margin-left 0.3s ease', minHeight: '100vh' },
  };

  return (
    <div style={s.layout}>
      <aside style={s.sidebar}>
        <div style={s.logo}>
          {!collapsed && <span style={s.logoText}>📚 Seekho Sikhao</span>}
          <button style={s.toggleBtn} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        <nav style={s.nav}>
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{ ...s.link, ...(pathname === l.href ? s.activeLink : {}) }}>
              {l.icon}
              {!collapsed && l.label}
            </Link>
          ))}
        </nav>

        <div style={s.footer}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
            <div style={s.userInfo}>
              <div style={s.userName}>{user?.name}</div>
              <div style={s.userRole}>{user?.role}</div>
            </div>
          </div>
          <button style={s.logoutBtn} onClick={handleLogout}>
            <LogOut size={15} />
            {!collapsed && 'Sign out'}
          </button>
        </div>
      </aside>
      <main style={s.main}>{children}</main>
    </div>
  );
}