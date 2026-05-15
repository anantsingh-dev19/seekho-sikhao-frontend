'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, fetchMe, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    fetchMe();
  }, []);

  useEffect(() => {
    if (user && user.role !== 'admin') router.push('/dashboard');
  }, [user]);

  const links = [
    { href: '/admin', label: '📊 Dashboard' },
    { href: '/admin/courses', label: '📹 Courses' },
    { href: '/admin/products', label: '📦 Products' },
    { href: '/admin/orders', label: '🛒 Orders' },
    { href: '/admin/users', label: '👥 Users' },
  ];

  const s: any = {
    layout: { display: 'flex', minHeight: '100vh', background: '#0a0a0f' },
    sidebar: { width: 220, background: '#111118', borderRight: '1px solid #2a2a3a', padding: '24px 0', display: 'flex', flexDirection: 'column' },
    logo: { color: '#7c6dfa', fontWeight: 800, fontSize: 20, padding: '0 20px 24px', borderBottom: '1px solid #2a2a3a', marginBottom: 16 },
    link: { display: 'block', padding: '10px 20px', fontSize: 14, color: '#8888aa', textDecoration: 'none', borderRadius: 8, margin: '2px 8px', transition: 'all 0.2s' },
    activeLink: { background: 'rgba(124,109,250,0.15)', color: '#7c6dfa', fontWeight: 500 },
    main: { flex: 1, padding: 32, overflowY: 'auto' },
    badge: { background: 'rgba(250,109,141,0.15)', color: '#fa6d8d', fontSize: 11, padding: '2px 8px', borderRadius: 999, marginLeft: 8 },
  };

  return (
    <div style={s.layout}>
      <aside style={s.sidebar}>
        <div style={s.logo}>⚡ Admin Panel</div>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{ ...s.link, ...(pathname === l.href ? s.activeLink : {}) }}>
            {l.label}
          </Link>
        ))}
        <div style={{ marginTop: 'auto', padding: '16px 20px', fontSize: 13, color: '#555570' }}>
          Logged in as<br />
          <span style={{ color: '#7c6dfa', fontWeight: 500 }}>{user?.name}</span>
          <span style={s.badge}>admin</span>
        </div>
      </aside>
      <main style={s.main}>{children}</main>
    </div>
  );
}