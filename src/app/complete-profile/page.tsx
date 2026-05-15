
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CompleteProfilePage() {
  const { user, fetchMe } = useAuthStore();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    fetchMe();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name === 'Phone User' || user.name === 'Google User' ? '' : user.name);
      setEmail(user.email?.includes('@phone.app') || user.email?.includes('@gmail') ? '' : user.email);
    }
  }, [user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Name is required'); return; }
    setLoading(true);
    try {
      await api.put('/auth/update-profile', { name, email: email || undefined });
      await fetchMe();
      toast.success('Profile updated!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally { setLoading(false); }
  };

  const s: any = {
    page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', padding: 24 },
    box: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 16, padding: 40, width: '100%', maxWidth: 440 },
    logo: { color: '#7c6dfa', fontWeight: 800, fontSize: 24, marginBottom: 8 },
    h1: { color: '#f0f0ff', fontSize: 22, fontWeight: 700, marginBottom: 4 },
    sub: { color: '#8888aa', marginBottom: 32, fontSize: 14 },
    label: { color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 },
    input: { width: '100%', background: '#16161f', border: '1px solid #2a2a3a', borderRadius: 8, color: '#f0f0ff', padding: '12px 16px', fontSize: 14, outline: 'none', marginBottom: 16, boxSizing: 'border-box' },
    btn: { width: '100%', background: '#7c6dfa', color: 'white', border: 'none', borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 500, cursor: 'pointer' },
    skip: { width: '100%', background: 'transparent', color: '#555570', border: '1px solid #2a2a3a', borderRadius: 8, padding: '11px', fontSize: 14, cursor: 'pointer', marginTop: 10 },
    avatar: { width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #7c6dfa, #fa6d8d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 20 },
    steps: { display: 'flex', gap: 6, marginBottom: 28 },
    step: { height: 4, flex: 1, borderRadius: 2 },
  };

  return (
    <div style={s.page}>
      <div style={s.box}>
        <div style={s.avatar}>👤</div>
        <div style={s.logo}>MyApp</div>
        <h1 style={s.h1}>Complete your profile</h1>
        <p style={s.sub}>Just a few details to get you started</p>

        <div style={s.steps}>
          <div style={{ ...s.step, background: '#7c6dfa' }} />
          <div style={{ ...s.step, background: name ? '#7c6dfa' : '#2a2a3a' }} />
          <div style={{ ...s.step, background: email ? '#7c6dfa' : '#2a2a3a' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Full Name *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your full name"
            style={s.input}
            required
          />

          <label style={s.label}>Email Address <span style={{ color: '#555570' }}>(optional)</span></label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            style={s.input}
          />

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Saving...' : 'Complete Profile →'}
          </button>
          <button type="button" style={s.skip} onClick={() => router.push('/dashboard')}>
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}
