'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { auth, googleProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';
import api from '@/lib/api';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const { register, handleSubmit } = useForm<any>();
  const [tab, setTab] = useState<'email' | 'phone'>('email');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const recaptchaRef = useRef<any>(null);

  const s: any = {
    page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', padding: 24, position: 'relative' },
    back: { position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 8, color: '#8888aa', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 },
    box: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 16, padding: 40, width: '100%', maxWidth: 420 },
    logo: { color: '#7c6dfa', fontWeight: 800, fontSize: 24, marginBottom: 8 },
    h1: { color: '#f0f0ff', fontSize: 22, fontWeight: 700, marginBottom: 4 },
    sub: { color: '#8888aa', marginBottom: 24, fontSize: 14 },
    tabs: { display: 'flex', gap: 8, marginBottom: 24, background: '#16161f', borderRadius: 8, padding: 4 },
    tab: { flex: 1, padding: '8px 0', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 500, transition: 'all 0.2s' },
    activeTab: { background: '#7c6dfa', color: 'white' },
    inactiveTab: { background: 'transparent', color: '#8888aa' },
    label: { color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 },
    input: { width: '100%', background: '#16161f', border: '1px solid #2a2a3a', borderRadius: 8, color: '#f0f0ff', padding: '12px 16px', fontSize: 14, outline: 'none', marginBottom: 16, boxSizing: 'border-box' },
    btn: { width: '100%', background: '#7c6dfa', color: 'white', border: 'none', borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 500, cursor: 'pointer', marginBottom: 12 },
    googleBtn: { width: '100%', background: 'transparent', color: '#f0f0ff', border: '1px solid #2a2a3a', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 },
    divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' },
    line: { flex: 1, height: 1, background: '#2a2a3a' },
    divText: { color: '#555570', fontSize: 13 },
    footer: { textAlign: 'center', color: '#8888aa', fontSize: 14, marginTop: 16 },
  };

  const onEmailSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Login failed'); }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const { data } = await api.post('/auth/google', { idToken });
      localStorage.setItem('token', data.token);
      window.location.href = '/complete-profile';
    } catch (err: any) { toast.error('Google login failed'); }
  };

  const setupRecaptcha = () => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
    }
  };

  const sendOtp = async () => {
    if (!phone || phone.length < 10) { toast.error('Enter a valid phone number'); return; }
    try {
      setupRecaptcha();
      const fullPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      const confirmation = await signInWithPhoneNumber(auth, fullPhone, recaptchaRef.current);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      toast.success('OTP sent!');
    } catch (err: any) { toast.error('Failed to send OTP'); }
  };

  const verifyOtp = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      const { data } = await api.post('/auth/phone', { idToken });
      localStorage.setItem('token', data.token);
      window.location.href = '/complete-profile';
    } catch { toast.error('Invalid OTP'); }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => router.back()}><ArrowLeft size={16} /> Back</button>
      <div id="recaptcha-container"></div>
      <div style={s.box}>
        <div style={s.logo}>MyApp</div>
        <h1 style={s.h1}>Welcome back</h1>
        <p style={s.sub}>Sign in to continue</p>

        <div style={s.tabs}>
          <button style={{ ...s.tab, ...(tab === 'email' ? s.activeTab : s.inactiveTab) }} onClick={() => setTab('email')}>Email</button>
          <button style={{ ...s.tab, ...(tab === 'phone' ? s.activeTab : s.inactiveTab) }} onClick={() => setTab('phone')}>📱 Phone</button>
        </div>

        {tab === 'email' && (
          <form onSubmit={handleSubmit(onEmailSubmit)}>
            <label style={s.label}>Email</label>
            <input {...register('email')} type="email" placeholder="you@example.com" style={s.input} />
            <label style={s.label}>Password</label>
            <input {...register('password')} type="password" placeholder="••••••••" style={s.input} />
            <button type="submit" style={s.btn}>{isLoading ? 'Signing in...' : 'Sign In'}</button>
          </form>
        )}

        {tab === 'phone' && (
          <div>
            {!otpSent ? (
              <>
                <label style={s.label}>Phone Number</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9999999999" style={s.input} />
                <button onClick={sendOtp} style={s.btn}>Send OTP</button>
              </>
            ) : (
              <>
                <label style={s.label}>Enter OTP</label>
                <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit OTP" style={s.input} />
                <button onClick={verifyOtp} style={s.btn}>Verify OTP</button>
                <button onClick={() => setOtpSent(false)} style={{ ...s.btn, background: 'transparent', border: '1px solid #2a2a3a', color: '#8888aa' }}>Resend OTP</button>
              </>
            )}
          </div>
        )}

        <div style={s.divider}><div style={s.line} /><span style={s.divText}>or</span><div style={s.line} /></div>

        <button onClick={handleGoogleLogin} style={s.googleBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <p style={s.footer}>No account? <Link href="/register" style={{ color: '#7c6dfa' }}>Sign up</Link></p>
      </div>
    </div>
  );
}