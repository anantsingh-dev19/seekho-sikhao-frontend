'use client';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Link from 'next/link';

declare global { interface Window { Razorpay: any; } }

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, count } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });

  const hasPhysical = items.some(i => i.type === 'product');

  const loadRazorpay = () => new Promise(resolve => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleCheckout = async () => {
    if (hasPhysical && (!address.name || !address.phone || !address.street || !address.city || !address.pincode)) {
      toast.error('Please fill in shipping address');
      return;
    }
    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Payment gateway failed to load'); return; }

      const orderItems = items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, type: i.type }));
      const orderType = items.every(i => i.type === 'course') ? 'course' : items.every(i => i.type === 'product') ? 'product' : 'mixed';

      const { data } = await api.post('/orders', {
        items: orderItems,
        totalAmount: total(),
        type: orderType,
        shippingAddress: hasPhysical ? address : null,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.data.razorpayOrder.amount,
        currency: 'INR',
        name: 'MyApp',
        description: 'Purchase',
        order_id: data.data.razorpayOrder.id,
        handler: async (response: any) => {
          try {
            await api.post('/orders/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.data.order.id,
            });
            clearCart();
            toast.success('Payment successful! 🎉');
            router.push('/order-success');
          } catch { toast.error('Payment verification failed'); }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#7c6dfa' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Checkout failed');
    } finally { setLoading(false); }
  };

  const s: any = {
    page: { padding: 32 },
    h1: { color: '#f0f0ff', fontSize: 26, fontWeight: 700, marginBottom: 8 },
    sub: { color: '#8888aa', fontSize: 14, marginBottom: 32 },
    grid: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' },
    card: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
    item: { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderBottom: '1px solid #1a1a2a' },
    itemIcon: { width: 56, height: 56, borderRadius: 10, background: 'linear-gradient(135deg, #7c6dfa22, #fa6d8d22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 },
    itemInfo: { flex: 1 },
    itemName: { color: '#f0f0ff', fontSize: 14, fontWeight: 500, marginBottom: 4 },
    itemPrice: { color: '#7c6dfa', fontSize: 14, fontWeight: 600 },
    qtyBtns: { display: 'flex', alignItems: 'center', gap: 8 },
    qtyBtn: { width: 28, height: 28, borderRadius: 6, border: '1px solid #2a2a3a', background: '#16161f', color: '#f0f0ff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    qty: { color: '#f0f0ff', fontSize: 14, minWidth: 24, textAlign: 'center' },
    removeBtn: { background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 18 },
    summary: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, padding: 24, position: 'sticky', top: 24 },
    summaryTitle: { color: '#f0f0ff', fontSize: 16, fontWeight: 600, marginBottom: 20 },
    summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 12 },
    summaryLabel: { color: '#8888aa' },
    summaryValue: { color: '#f0f0ff', fontWeight: 500 },
    divider: { borderTop: '1px solid #2a2a3a', margin: '16px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700 },
    totalLabel: { color: '#f0f0ff' },
    totalValue: { color: '#7c6dfa' },
    checkoutBtn: { width: '100%', background: '#7c6dfa', color: 'white', border: 'none', borderRadius: 8, padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 20 },
    input: { width: '100%', background: '#16161f', border: '1px solid #2a2a3a', borderRadius: 8, color: '#f0f0ff', padding: '10px 14px', fontSize: 13, outline: 'none', marginBottom: 10, boxSizing: 'border-box' },
    label: { color: '#8888aa', fontSize: 12, display: 'block', marginBottom: 4 },
    addressSection: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, padding: 20, marginBottom: 12 },
    addressTitle: { color: '#f0f0ff', fontSize: 14, fontWeight: 600, marginBottom: 16 },
    empty: { textAlign: 'center', padding: '80px 24px' },
    emptyIcon: { fontSize: 56, marginBottom: 16 },
    emptyText: { color: '#8888aa', fontSize: 16, marginBottom: 24 },
    shopBtn: { display: 'inline-block', background: '#7c6dfa', color: 'white', padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none' },
  };

  if (items.length === 0) return (
    <div style={s.page}>
      <h1 style={s.h1}>🛒 Cart</h1>
      <div style={s.empty}>
        <div style={s.emptyIcon}>🛒</div>
        <p style={s.emptyText}>Your cart is empty</p>
        <Link href="/courses" style={s.shopBtn}>Browse Courses</Link>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <h1 style={s.h1}>🛒 Cart</h1>
      <p style={s.sub}>{count()} item{count() > 1 ? 's' : ''} in your cart</p>

      <div style={s.grid}>
        <div>
          <div style={s.card}>
            {items.map(item => (
              <div key={item.id} style={s.item}>
                <div style={s.itemIcon}>{item.type === 'course' ? '📹' : '📦'}</div>
                <div style={s.itemInfo}>
                  <div style={s.itemName}>{item.name}</div>
                  <div style={s.itemPrice}>₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
                {item.type === 'product' && (
                  <div style={s.qtyBtns}>
                    <button style={s.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span style={s.qty}>{item.quantity}</span>
                    <button style={s.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                )}
                <button style={s.removeBtn} onClick={() => removeItem(item.id)}>✕</button>
              </div>
            ))}
          </div>

          {hasPhysical && (
            <div style={s.addressSection}>
              <div style={s.addressTitle}>📍 Shipping Address</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label style={s.label}>Full Name</label><input style={s.input} placeholder="Anant Singh" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} /></div>
                <div><label style={s.label}>Phone</label><input style={s.input} placeholder="+91 9999999999" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} /></div>
              </div>
              <label style={s.label}>Street Address</label>
              <input style={s.input} placeholder="123, Main Street" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div><label style={s.label}>City</label><input style={s.input} placeholder="Delhi" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} /></div>
                <div><label style={s.label}>State</label><input style={s.input} placeholder="Delhi" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} /></div>
                <div><label style={s.label}>Pincode</label><input style={s.input} placeholder="110001" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} /></div>
              </div>
            </div>
          )}
        </div>

        <div style={s.summary}>
          <div style={s.summaryTitle}>Order Summary</div>
          {items.map(i => (
            <div key={i.id} style={s.summaryRow}>
              <span style={s.summaryLabel}>{i.name} × {i.quantity}</span>
              <span style={s.summaryValue}>₹{(i.price * i.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div style={s.divider} />
          <div style={s.totalRow}>
            <span style={s.totalLabel}>Total</span>
            <span style={s.totalValue}>₹{total().toLocaleString()}</span>
          </div>
          <button style={s.checkoutBtn} onClick={handleCheckout} disabled={loading}>
            {loading ? 'Processing...' : `Pay ₹${total().toLocaleString()} →`}
          </button>
          <p style={{ color: '#555570', fontSize: 12, textAlign: 'center', marginTop: 12 }}>🔒 Secured by Razorpay</p>
        </div>
      </div>
    </div>
  );
}