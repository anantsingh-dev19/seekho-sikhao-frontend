'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
  const { user, fetchMe, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    fetchMe();
  }, []);

  const s: any = {
    page: { padding: 32 },
    h1: { color: '#f0f0ff', fontSize: 26, fontWeight: 700, marginBottom: 8 },
    sub: { color: '#8888aa', fontSize: 14, marginBottom: 32 },
    card: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, padding: 24, maxWidth: 500 },
    row: { display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #2a2a3a', fontSize: 14 },
    label: { color: '#8888aa' },
    val: { color: '#f0f0ff', fontWeight: 500 },
    btn: { marginTop: 24, background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 14 },
    avatar: { width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #7c6dfa, #fa6d8d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 28, fontWeight: 800, marginBottom: 24 },
  };

  return (
    <div style={s.page}>
      <h1 style={s.h1}>👤 Profile</h1>
      <p style={s.sub}>Your account details</p>
      <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
      <div style={s.card}>
        <div style={s.row}><span style={s.label}>Full Name</span><span style={s.val}>{user?.name}</span></div>
        <div style={s.row}><span style={s.label}>Email</span><span style={s.val}>{user?.email}</span></div>
        <div style={s.row}><span style={s.label}>Role</span><span style={s.val}>{user?.role}</span></div>
        <div style={{ ...s.row, borderBottom: 'none' }}><span style={s.label}>Status</span><span style={{ color: '#4ade80', fontWeight: 500 }}>Active ✓</span></div>
      </div>
      <button style={s.btn} onClick={() => { logout(); router.push('/login'); }}>Sign Out</button>
    </div>
  );
}
