'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function MyCoursesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await api.get('/orders/my');
        const courseOrders = r.data.data.filter((o: any) => o.type === 'course' || o.type === 'mixed');
        setOrders(courseOrders);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const s: any = {
    page: { padding: 32 },
    h1: { color: '#f0f0ff', fontSize: 26, fontWeight: 700, marginBottom: 8 },
    sub: { color: '#8888aa', fontSize: 14, marginBottom: 32 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
    card: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden', transition: 'all 0.2s' },
    thumb: { height: 140, background: 'linear-gradient(135deg, #7c6dfa22, #fa6d8d22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 },
    body: { padding: 16 },
    title: { color: '#f0f0ff', fontSize: 15, fontWeight: 600, marginBottom: 8 },
    badge: { display: 'inline-block', background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 999, fontSize: 12, padding: '3px 10px' },
    empty: { textAlign: 'center', padding: '80px 24px', color: '#555570' },
    emptyIcon: { fontSize: 48, marginBottom: 16 },
    emptyText: { fontSize: 16, color: '#8888aa', marginBottom: 16 },
    btn: { display: 'inline-block', background: '#7c6dfa', color: 'white', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none' },
  };

  if (loading) return <div style={{ ...s.page, color: '#8888aa' }}>Loading...</div>;

  return (
    <div style={s.page}>
      <h1 style={s.h1}>📚 My Courses</h1>
      <p style={s.sub}>Courses you have purchased</p>

      {orders.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>📚</div>
          <p style={s.emptyText}>You haven't purchased any courses yet</p>
          <Link href="/courses" style={s.btn}>Browse Courses</Link>
        </div>
      ) : (
        <div style={s.grid}>
          {orders.map(o => (
            <div key={o.id} style={s.card}>
              <div style={s.thumb}>📹</div>
              <div style={s.body}>
                <p style={s.title}>Order #{o.id.slice(0, 8)}</p>
                <span style={s.badge}>✓ Purchased</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}