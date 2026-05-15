'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const r = await api.get('/orders/my'); setOrders(r.data.data); }
      catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const statusColor: any = { pending: '#fbbf24', paid: '#4ade80', shipped: '#7c6dfa', delivered: '#4ade80', cancelled: '#f87171' };

  const s: any = {
    page: { padding: 32 },
    h1: { color: '#f0f0ff', fontSize: 26, fontWeight: 700, marginBottom: 8 },
    sub: { color: '#8888aa', fontSize: 14, marginBottom: 32 },
    card: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #2a2a3a' },
    orderId: { color: '#f0f0ff', fontWeight: 600, fontSize: 14 },
    date: { color: '#555570', fontSize: 13 },
    body: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    amount: { color: '#f0f0ff', fontSize: 20, fontWeight: 700 },
    type: { color: '#8888aa', fontSize: 13, marginTop: 4 },
    empty: { textAlign: 'center', padding: '80px 24px' },
    emptyIcon: { fontSize: 48, marginBottom: 16 },
    emptyText: { fontSize: 16, color: '#8888aa' },
  };

  if (loading) return <div style={{ ...s.page, color: '#8888aa' }}>Loading...</div>;

  return (
    <div style={s.page}>
      <h1 style={s.h1}>🛒 My Orders</h1>
      <p style={s.sub}>Track all your purchases</p>

      {orders.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>🛒</div>
          <p style={s.emptyText}>No orders yet</p>
        </div>
      ) : (
        orders.map(o => (
          <div key={o.id} style={s.card}>
            <div style={s.header}>
              <span style={s.orderId}>Order #{o.id.slice(0, 8)}...</span>
              <span style={s.date}>{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div style={s.body}>
              <div>
                <div style={s.amount}>₹{o.totalAmount}</div>
                <div style={s.type}>{o.type} order</div>
              </div>
              <span style={{ background: `${statusColor[o.status]}18`, color: statusColor[o.status], border: `1px solid ${statusColor[o.status]}33`, borderRadius: 999, padding: '4px 14px', fontSize: 13, fontWeight: 500 }}>
                {o.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}