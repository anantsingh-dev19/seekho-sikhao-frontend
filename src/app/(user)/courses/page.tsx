'use client';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addItem } = useCartStore();
  useEffect(() => {
    const load = async () => {
      try { const r = await api.get('/courses'); setCourses(r.data.data); }
      catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const s: any = {
    page: { padding: 32 },
    h1: { color: '#f0f0ff', fontSize: 26, fontWeight: 700, marginBottom: 8 },
    sub: { color: '#8888aa', fontSize: 14, marginBottom: 32 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
    card: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' },
    thumb: { height: 160, background: 'linear-gradient(135deg, #7c6dfa22, #fa6d8d22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, position: 'relative' },
    body: { padding: 16 },
    title: { color: '#f0f0ff', fontSize: 15, fontWeight: 600, marginBottom: 6 },
    desc: { color: '#8888aa', fontSize: 13, marginBottom: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    price: { color: '#7c6dfa', fontSize: 18, fontWeight: 700 },
    badge: { background: 'rgba(124,109,250,0.1)', color: '#7c6dfa', border: '1px solid rgba(124,109,250,0.2)', borderRadius: 999, fontSize: 12, padding: '3px 10px' },
    btn: { width: '100%', background: '#7c6dfa', color: 'white', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 12 },
    empty: { textAlign: 'center', padding: '80px 24px', color: '#555570' },
    emptyIcon: { fontSize: 56, marginBottom: 16 },
    emptyText: { color: '#8888aa', fontSize: 16 },
    levelBadge: { position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#f0f0ff', fontSize: 11, padding: '3px 8px', borderRadius: 6 },
  };

  if (loading) return <div style={{ ...s.page, color: '#8888aa' }}>Loading courses...</div>;

  return (
    <div style={s.page}>
      <h1 style={s.h1}>📚 Courses</h1>
      <p style={s.sub}>Explore our educational courses and start learning today</p>

      {courses.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>📚</div>
          <p style={s.emptyText}>No courses available yet. Check back soon!</p>
        </div>
      ) : (
        <div style={s.grid}>
          {courses.map(c => (
            <div key={c.id} style={s.card} onClick={() => router.push(`/courses/${c.id}`)}>
              <div style={s.thumb}>
                📹
                <span style={s.levelBadge}>{c.level}</span>
              </div>
              <div style={s.body}>
                <p style={s.title}>{c.title}</p>
                <p style={s.desc}>{c.description}</p>
                <div style={s.footer}>
                  <span style={s.price}>₹{c.price}</span>
                  <span style={s.badge}>{c.category}</span>
                </div>
                <button style={s.btn} onClick={(e) => {
  e.stopPropagation();
  addItem({ id: c.id, name: c.title, price: Number(c.price), type: 'course' });
  toast.success('Added to cart!');
}}>
  Buy Now 🛒
</button>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}