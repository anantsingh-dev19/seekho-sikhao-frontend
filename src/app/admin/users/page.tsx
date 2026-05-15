'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await api.get('/auth/users');
        setUsers(r.data.data);
      } catch { toast.error('Failed to load users'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const toggleRole = async (id: string, currentRole: string) => {
    try {
      await api.put(`/auth/users/${id}/role`, { role: currentRole === 'admin' ? 'user' : 'admin' });
      toast.success('Role updated!');
      setUsers(users.map(u => u.id === id ? { ...u, role: currentRole === 'admin' ? 'user' : 'admin' } : u));
    } catch { toast.error('Failed'); }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await api.put(`/auth/users/${id}/status`, { isActive: !isActive });
      toast.success('Status updated!');
      setUsers(users.map(u => u.id === id ? { ...u, isActive: !isActive } : u));
    } catch { toast.error('Failed'); }
  };

  const s: any = {
    h1: { color: '#f0f0ff', fontSize: 24, fontWeight: 700, marginBottom: 24 },
    card: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { color: '#8888aa', fontSize: 13, padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #2a2a3a' },
    td: { color: '#f0f0ff', fontSize: 14, padding: '14px 16px', borderBottom: '1px solid #1a1a2a' },
    badge: (color: string) => ({ background: `${color}18`, color, border: `1px solid ${color}33`, borderRadius: 999, fontSize: 12, padding: '3px 10px', display: 'inline-block' }),
    btn: { background: 'transparent', border: '1px solid #2a2a3a', borderRadius: 6, color: '#8888aa', padding: '5px 12px', cursor: 'pointer', fontSize: 12, marginRight: 8 },
    avatar: { width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c6dfa, #fa6d8d)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13, marginRight: 10 },
  };

  return (
    <div>
      <h1 style={s.h1}>👥 Users ({users.length})</h1>
      <div style={s.card}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>User</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Role</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Joined</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} style={{ ...s.td, textAlign: 'center', color: '#555570' }}>Loading...</td></tr>}
            {!loading && users.length === 0 && <tr><td colSpan={6} style={{ ...s.td, textAlign: 'center', color: '#555570' }}>No users found</td></tr>}
            {users.map(u => (
              <tr key={u.id}>
                <td style={s.td}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={s.avatar}>{u.name?.charAt(0).toUpperCase()}</div>
                    {u.name}
                  </div>
                </td>
                <td style={{ ...s.td, fontSize: 13, color: '#8888aa' }}>{u.email}</td>
                <td style={s.td}>
                  <span style={s.badge(u.role === 'admin' ? '#7c6dfa' : '#8888aa')}>{u.role}</span>
                </td>
                <td style={s.td}>
                  <span style={s.badge(u.isActive ? '#4ade80' : '#f87171')}>{u.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td style={{ ...s.td, color: '#555570', fontSize: 13 }}>
                  {new Date(u.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td style={s.td}>
                  <button style={s.btn} onClick={() => toggleRole(u.id, u.role)}>
                    {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                  </button>
                  <button style={{ ...s.btn, color: u.isActive ? '#f87171' : '#4ade80', borderColor: u.isActive ? 'rgba(248,113,113,0.3)' : 'rgba(74,222,128,0.3)' }} onClick={() => toggleActive(u.id, u.isActive)}>
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}