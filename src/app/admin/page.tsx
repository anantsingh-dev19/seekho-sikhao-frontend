'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, courses: 0, products: 0, orders: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [courses, products, orders] = await Promise.all([
          api.get('/courses'), api.get('/products'), api.get('/orders/all')
        ]);
        setStats({ courses: courses.data.data.length, products: products.data.data.length, orders: orders.data.data.length, users: 0 });
      } catch {}
    };
    load();
  }, []);

  const s: any = {
    h1: { color: '#f0f0ff', fontSize: 28, fontWeight: 700, marginBottom: 8 },
    sub: { color: '#8888aa', marginBottom: 32, fontSize: 14 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 },
    card: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, padding: 24 },
    label: { color: '#8888aa', fontSize: 13, marginBottom: 8 },
    value: { color: '#f0f0ff', fontSize: 32, fontWeight: 700 },
  };

  const cards = [
    { label: '📹 Total Courses', value: stats.courses, color: '#7c6dfa' },
    { label: '📦 Total Products', value: stats.products, color: '#4ade80' },
    { label: '🛒 Total Orders', value: stats.orders, color: '#fa6d8d' },
    { label: '👥 Total Users', value: stats.users, color: '#fbbf24' },
  ];

  return (
    <div>
      <h1 style={s.h1}>Dashboard</h1>
      <p style={s.sub}>Welcome to your admin panel</p>
      <div style={s.grid}>
        {cards.map(c => (
          <div key={c.label} style={s.card}>
            <p style={s.label}>{c.label}</p>
            <p style={{ ...s.value, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}