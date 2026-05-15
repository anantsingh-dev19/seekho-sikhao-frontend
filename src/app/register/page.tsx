'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { register: reg, isLoading } = useAuthStore();
  const { register, handleSubmit } = useForm<any>();
  const onSubmit = async (data: any) => {
    try { await reg(data.name, data.email, data.password); toast.success('Account created!'); router.push('/dashboard'); }
    catch (err: any) { toast.error(err?.response?.data?.message || 'Registration failed'); }
  };
  const s: any = { page:{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0a0f'}, box:{background:'#111118',border:'1px solid #2a2a3a',borderRadius:16,padding:40,width:'100%',maxWidth:400}, h1:{color:'#f0f0ff',fontFamily:'sans-serif',marginBottom:8,fontSize:24}, sub:{color:'#8888aa',marginBottom:32,fontSize:14}, label:{color:'#8888aa',fontSize:13,display:'block',marginBottom:6}, input:{width:'100%',background:'#16161f',border:'1px solid #2a2a3a',borderRadius:8,color:'#f0f0ff',padding:'12px 16px',fontSize:14,outline:'none',boxSizing:'border-box',marginBottom:16}, btn:{width:'100%',background:'#7c6dfa',color:'white',border:'none',borderRadius:8,padding:'13px',fontSize:15,fontWeight:500,cursor:'pointer'}, footer:{textAlign:'center',color:'#8888aa',fontSize:14,marginTop:24} };
  return (
    <div style={s.page}><div style={s.box}>
      <h1 style={s.h1}>Create account</h1>
      <p style={s.sub}>Start your journey today</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label style={s.label}>Full Name</label>
        <input {...register('name')} type="text" placeholder="Anant Singh" style={s.input} />
        <label style={s.label}>Email</label>
        <input {...register('email')} type="email" placeholder="you@example.com" style={s.input} />
        <label style={s.label}>Password</label>
        <input {...register('password')} type="password" placeholder="Min. 6 characters" style={s.input} />
        <button type="submit" style={s.btn}>{isLoading ? 'Creating...' : 'Create Account'}</button>
      </form>
      <p style={s.footer}>Have an account? <Link href="/login" style={{color:'#7c6dfa'}}>Sign in</Link></p>
    </div></div>
  );
}
