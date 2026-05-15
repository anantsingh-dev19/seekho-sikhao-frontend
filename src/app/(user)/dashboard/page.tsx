
'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, fetchMe } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({ courses: 0, orders: 0 });

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    fetchMe();
    const load = async () => {
      try {
        const r = await api.get('/orders/my');
        const orders = r.data.data;
        setStats({ orders: orders.length, courses: orders.filter((o: any) => o.type === 'course' || o.type === 'mixed').length });
      } catch {}
    };
    load();
  }, []);

  const s: any = {
    page: { padding: 32 },
    h1: { color: '#f0f0ff', fontSize: 28, fontWeight: 700, marginBottom: 6 },
    sub: { color: '#8888aa', fontSize: 14, marginBottom: 32 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 },
    card: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, padding: 24 },
    cardLabel: { color: '#8888aa', fontSize: 13, marginBottom: 8 },
    cardValue: { fontSize: 32, fontWeight: 700 },
    section: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, padding: 24, marginBottom: 16 },
    sectionTitle: { color: '#f0f0ff', fontSize: 16, fontWeight: 600, marginBottom: 16 },
    quickLink: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #2a2a3a', textDecoration: 'none' },
    linkLabel: { color: '#f0f0ff', fontSize: 14 },
    linkArrow: { color: '#555570', fontSize: 18 },
    welcome: { background: 'linear-gradient(135deg, rgba(124,109,250,0.15), rgba(250,109,141,0.1))', border: '1px solid rgba(124,109,250,0.2)', borderRadius: 12, padding: 24, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    welcomeText: { color: '#f0f0ff', fontSize: 20, fontWeight: 600 },
    welcomeSub: { color: '#8888aa', fontSize: 14, marginTop: 4 },
    avatar: { width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #7c6dfa, #fa6d8d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 22, fontWeight: 800 },
  };

  return (
    <div style={s.page}>
      <div style={s.welcome}>
        <div>
          <div style={s.welcomeText}>Hello, {user?.name?.split(' ')[0]} 👋</div>
          <div style={s.welcomeSub}>Welcome to your learning dashboard</div>
        </div>
        <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
      </div>

      <div style={s.grid}>
        {[
          { label: '📚 My Courses', value: stats.courses, color: '#7c6dfa' },
          { label: '🛒 My Orders', value: stats.orders, color: '#fa6d8d' },
          { label: '✅ Account Status', value: 'Active', color: '#4ade80' },
          { label: '👤 Role', value: user?.role || '—', color: '#fbbf24' },
        ].map(c => (
          <div key={c.label} style={s.card}>
            <div style={s.cardLabel}>{c.label}</div>
            <div style={{ ...s.cardValue, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Quick Links</div>
        {[
          { href: '/my-courses', label: '📚 Browse My Courses', desc: 'Continue learning' },
          { href: '/my-orders', label: '🛒 My Orders', desc: 'Track your purchases' },
          { href: '/courses', label: '🔍 Explore Courses', desc: 'Find new courses' },
          { href: '/profile', label: '👤 Edit Profile', desc: 'Manage your account' },
        ].map(l => (
          <Link key={l.href} href={l.href} style={s.quickLink}>
            <div>
              <div style={s.linkLabel}>{l.label}</div>
              <div style={{ color: '#555570', fontSize: 12 }}>{l.desc}</div>
            </div>
            <span style={s.linkArrow}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
