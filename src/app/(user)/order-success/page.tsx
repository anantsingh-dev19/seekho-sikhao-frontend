'use client';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const s: any = {
    page: { padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' },
    box: { textAlign: 'center', maxWidth: 480 },
    icon: { fontSize: 72, marginBottom: 24 },
    h1: { color: '#f0f0ff', fontSize: 28, fontWeight: 700, marginBottom: 8 },
    sub: { color: '#8888aa', fontSize: 15, marginBottom: 32, lineHeight: 1.6 },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 },
    btn: { display: 'block', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none', textAlign: 'center' },
    primaryBtn: { background: '#7c6dfa', color: 'white' },
    ghostBtn: { background: 'transparent', color: '#8888aa', border: '1px solid #2a2a3a' },
    confetti: { fontSize: 24, marginBottom: 8 },
  };

  return (
    <div style={s.page}>
      <div style={s.box}>
        <div style={s.confetti}>🎊 🎉 🎊</div>
        <div style={s.icon}>✅</div>
        <h1 style={s.h1}>Payment Successful!</h1>
        <p style={s.sub}>Your order has been placed successfully. You can track your order in My Orders section.</p>
        <div style={s.grid}>
          <Link href="/my-orders" style={{ ...s.btn, ...s.primaryBtn }}>View My Orders</Link>
          <Link href="/my-courses" style={{ ...s.btn, ...s.ghostBtn }}>My Courses</Link>
        </div>
        <Link href="/dashboard" style={{ color: '#555570', fontSize: 13 }}>← Back to Dashboard</Link>
      </div>
    </div>
  );
}