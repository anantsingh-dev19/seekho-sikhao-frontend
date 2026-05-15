'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try { const r = await api.get('/orders/all'); setOrders(r.data.data); } catch {}
    };
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try { await api.put(`/orders/${id}`, { status }); toast.success('Status updated!'); } catch { toast.error('Failed'); }
  };

  const s: any = {
    h1: { color: '#f0f0ff', fontSize: 24, fontWeight: 700, marginBottom: 24 },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { color: '#8888aa', fontSize: 13, padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #2a2a3a' },
    td: { color: '#f0f0ff', fontSize: 14, padding: '14px 16px', borderBottom: '1px solid #1a1a2a' },
    card: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden' },
    select: { background: '#16161f', border: '1px solid #2a2a3a', borderRadius: 6, color: '#f0f0ff', padding: '6px 10px', fontSize: 13, cursor: 'pointer' },
  };

  const statusColor: any = { pending: '#fbbf24', paid: '#4ade80', shipped: '#7c6dfa', delivered: '#4ade80', cancelled: '#f87171' };

  return (
    <div>
      <h1 style={s.h1}>🛒 Orders</h1>
      <div style={s.card}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Order ID</th>
              <th style={s.th}>Amount</th>
              <th style={s.th}>Type</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Date</th>
              <th style={s.th}>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && <tr><td colSpan={6} style={{ ...s.td, textAlign: 'center', color: '#555570' }}>No orders yet</td></tr>}
            {orders.map(o => (
              <tr key={o.id}>
                <td style={s.td} title={o.id}>{o.id.slice(0, 8)}...</td>
                <td style={s.td}>₹{o.totalAmount}</td>
                <td style={s.td}>{o.type}</td>
                <td style={s.td}><span style={{ color: statusColor[o.status], fontWeight: 500 }}>{o.status}</span></td>
                <td style={s.td}>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td style={s.td}>
                  <select style={s.select} defaultValue={o.status} onChange={e => updateStatus(o.id, e.target.value)}>
                    {['pending','paid','shipped','delivered','cancelled'].map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}