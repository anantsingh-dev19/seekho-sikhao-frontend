'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { addItem } = useCartStore();
  

  useEffect(() => {
    const load = async () => {
      try { const r = await api.get('/products'); setProducts(r.data.data); }
      catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const categories = ['all', ...Array.from(new Set(products.map((p: any) => p.category)))];
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  const s: any = {
    page: { padding: 32 },
    h1: { color: '#f0f0ff', fontSize: 26, fontWeight: 700, marginBottom: 8 },
    sub: { color: '#8888aa', fontSize: 14, marginBottom: 24 },
    filters: { display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' },
    filterBtn: { padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '1px solid #2a2a3a', transition: 'all 0.2s' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 },
    card: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden', transition: 'all 0.2s' },
    thumb: { height: 180, background: 'linear-gradient(135deg, #4ade8022, #7c6dfa22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 },
    body: { padding: 16 },
    name: { color: '#f0f0ff', fontSize: 15, fontWeight: 600, marginBottom: 6 },
    desc: { color: '#8888aa', fontSize: 13, marginBottom: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    price: { color: '#4ade80', fontSize: 18, fontWeight: 700 },
    stock: { color: '#555570', fontSize: 13 },
    btn: { width: '100%', background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#0a0a0f', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
    empty: { textAlign: 'center', padding: '80px 24px' },
    emptyIcon: { fontSize: 56, marginBottom: 16 },
    emptyText: { color: '#8888aa', fontSize: 16 },
  };

  if (loading) return <div style={{ ...s.page, color: '#8888aa' }}>Loading products...</div>;

  return (
    <div style={s.page}>
      <h1 style={s.h1}>🛍️ Shop</h1>
      <p style={s.sub}>Browse and buy our physical products</p>

      <div style={s.filters}>
  {categories.map(cat => (
    <button key={cat} style={{ ...s.filterBtn, background: filter === cat ? '#7c6dfa' : 'transparent', color: filter === cat ? 'white' : '#8888aa', borderColor: filter === cat ? '#7c6dfa' : '#2a2a3a' }} onClick={() => setFilter(cat)}>
      {cat}
    </button>
  ))}
</div>

      {filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>🛍️</div>
          <p style={s.emptyText}>No products available yet!</p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map(p => (
            <div key={p.id} style={s.card}>
              <div style={s.thumb}>📦</div>
              <div style={s.body}>
                <p style={s.name}>{p.name}</p>
                <p style={s.desc}>{p.description}</p>
                <div style={s.footer}>
                  <span style={s.price}>₹{p.price}</span>
                  <span style={s.stock}>{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</span>
                </div>
                <button style={{ ...s.btn, opacity: p.stock > 0 ? 1 : 0.5 }} disabled={p.stock === 0}
                onClick={() => {if (p.stock > 0) {addItem({ id: p.id, name: p.name, price: p.price, type: 'product' });toast.success(`${p.name} added to cart!`);
                }}}>
                  {p.stock > 0 ? 'Add to Cart 🛒' : 'Out of Stock'}
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}