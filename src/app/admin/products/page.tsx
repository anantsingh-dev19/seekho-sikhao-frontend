'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' });
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    try { const r = await api.get('/products'); setProducts(r.data.data); } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    try {
      await api.post('/products', { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) });
      toast.success('Product created!');
      setForm({ name: '', description: '', price: '', category: '', stock: '' });
      setShowForm(false);
      load();
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Deleted!'); load(); } catch { toast.error('Failed'); }
  };

  const s: any = {
    h1: { color: '#f0f0ff', fontSize: 24, fontWeight: 700, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    btn: { background: '#7c6dfa', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 14, fontWeight: 500 },
    form: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, padding: 24, marginBottom: 24 },
    input: { width: '100%', background: '#16161f', border: '1px solid #2a2a3a', borderRadius: 8, color: '#f0f0ff', padding: '10px 14px', fontSize: 14, outline: 'none', marginBottom: 12, boxSizing: 'border-box' },
    label: { color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 4 },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { color: '#8888aa', fontSize: 13, padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #2a2a3a' },
    td: { color: '#f0f0ff', fontSize: 14, padding: '14px 16px', borderBottom: '1px solid #1a1a2a' },
    card: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden' },
    dangerBtn: { background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13 },
  };

  return (
    <div>
      <div style={s.h1}>
        <span>📦 Products</span>
        <button style={s.btn} onClick={() => setShowForm(!showForm)}>+ Add Product</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={s.form}>
          <h3 style={{ color: '#f0f0ff', marginBottom: 16 }}>New Product</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={s.label}>Name</label><input style={s.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            <div><label style={s.label}>Category</label><input style={s.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required /></div>
            <div><label style={s.label}>Price (₹)</label><input style={s.input} type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
            <div><label style={s.label}>Stock</label><input style={s.input} type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required /></div>
          </div>
          <label style={s.label}>Description</label>
          <textarea style={{ ...s.input, height: 80, resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          <button type="submit" style={s.btn}>Create Product</button>
        </form>
      )}

      <div style={s.card}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Name</th>
              <th style={s.th}>Category</th>
              <th style={s.th}>Price</th>
              <th style={s.th}>Stock</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && <tr><td colSpan={5} style={{ ...s.td, textAlign: 'center', color: '#555570' }}>No products yet</td></tr>}
            {products.map(p => (
              <tr key={p.id}>
                <td style={s.td}>{p.name}</td>
                <td style={s.td}>{p.category}</td>
                <td style={s.td}>₹{p.price}</td>
                <td style={s.td}>{p.stock}</td>
                <td style={s.td}><button style={s.dangerBtn} onClick={() => handleDelete(p.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}