'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', level: 'beginner', language: 'Hindi' });
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [lessonForm, setLessonForm] = useState({ title: '', videoUrl: '', duration: '', isFree: false });
  const [addingLesson, setAddingLesson] = useState(false);

  const load = async () => {
    try { const r = await api.get('/courses/admin/all'); setCourses(r.data.data); } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    try {
      await api.post('/courses', { ...form, price: parseFloat(form.price) });
      toast.success('Course created!');
      setForm({ title: '', description: '', price: '', category: '', level: 'beginner', language: 'Hindi' });
      setShowForm(false);
      load();
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    try { await api.delete(`/courses/${id}`); toast.success('Deleted!'); load(); } catch { toast.error('Failed'); }
  };

  const handlePublish = async (id: string, current: boolean) => {
    try { await api.put(`/courses/${id}`, { isPublished: !current }); toast.success('Updated!'); load(); } catch { toast.error('Failed'); }
  };

  const handleAddLesson = async () => {
    if (!lessonForm.title || !lessonForm.videoUrl) { toast.error('Title and video URL required'); return; }
    setAddingLesson(true);
    try {
      await api.post(`/courses/${selectedCourse.id}/lessons`, {
        title: lessonForm.title,
        videoUrl: lessonForm.videoUrl,
        duration: parseInt(lessonForm.duration) || 0,
        isFree: lessonForm.isFree,
        order: 0,
      });
      toast.success('Lesson added!');
      setLessonForm({ title: '', videoUrl: '', duration: '', isFree: false });
      setSelectedCourse(null);
    } catch { toast.error('Failed to add lesson'); }
    finally { setAddingLesson(false); }
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
    ghostBtn: { background: 'transparent', color: '#8888aa', border: '1px solid #2a2a3a', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13, marginRight: 8 },
    lessonBtn: { background: 'rgba(124,109,250,0.1)', color: '#7c6dfa', border: '1px solid rgba(124,109,250,0.3)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13, marginRight: 8 },
  };

  return (
    <div>
      <div style={s.h1}>
        <span>📹 Courses</span>
        <button style={s.btn} onClick={() => setShowForm(!showForm)}>+ Add Course</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={s.form}>
          <h3 style={{ color: '#f0f0ff', marginBottom: 16 }}>New Course</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={s.label}>Title</label><input style={s.input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
            <div><label style={s.label}>Category</label><input style={s.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required /></div>
            <div><label style={s.label}>Price (₹)</label><input style={s.input} type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
            <div><label style={s.label}>Level</label>
              <select style={s.input} value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <label style={s.label}>Description</label>
          <textarea style={{ ...s.input, height: 80, resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          <button type="submit" style={s.btn}>Create Course</button>
        </form>
      )}

      {/* Add Lesson Form */}
      {selectedCourse && (
        <div style={{ ...s.form, marginBottom: 24, borderColor: 'rgba(124,109,250,0.3)' }}>
          <h3 style={{ color: '#f0f0ff', marginBottom: 4 }}>➕ Add Lesson</h3>
          <p style={{ color: '#7c6dfa', fontSize: 13, marginBottom: 16 }}>Course: {selectedCourse.title}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={s.label}>Lesson Title</label><input style={s.input} value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} placeholder="Introduction to..." /></div>
            <div><label style={s.label}>Duration (minutes)</label><input style={s.input} type="number" value={lessonForm.duration} onChange={e => setLessonForm({ ...lessonForm, duration: e.target.value })} placeholder="10" /></div>
          </div>
          <label style={s.label}>Cloudinary Video URL</label>
          <input style={s.input} value={lessonForm.videoUrl} onChange={e => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} placeholder="https://res.cloudinary.com/..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <input type="checkbox" id="isFree" checked={lessonForm.isFree} onChange={e => setLessonForm({ ...lessonForm, isFree: e.target.checked })} />
            <label htmlFor="isFree" style={{ color: '#8888aa', fontSize: 13, cursor: 'pointer' }}>Free preview (visible without purchase)</label>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={s.btn} onClick={handleAddLesson} disabled={addingLesson}>{addingLesson ? 'Adding...' : 'Add Lesson ✅'}</button>
            <button style={s.ghostBtn} onClick={() => setSelectedCourse(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={s.card}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Title</th>
              <th style={s.th}>Category</th>
              <th style={s.th}>Price</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 && <tr><td colSpan={5} style={{ ...s.td, textAlign: 'center', color: '#555570' }}>No courses yet</td></tr>}
            {courses.map(c => (
              <tr key={c.id}>
                <td style={s.td}>{c.title}</td>
                <td style={s.td}>{c.category}</td>
                <td style={s.td}>₹{c.price}</td>
                <td style={s.td}>
                  <span style={{ background: c.isPublished ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)', color: c.isPublished ? '#4ade80' : '#fbbf24', padding: '3px 10px', borderRadius: 999, fontSize: 12 }}>
                    {c.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={s.td}>
                  <button style={s.lessonBtn} onClick={() => { setSelectedCourse(c); setShowForm(false); }}>+ Lesson</button>
                  <button style={s.ghostBtn} onClick={() => handlePublish(c.id, c.isPublished)}>{c.isPublished ? 'Unpublish' : 'Publish'}</button>
                  <button style={s.dangerBtn} onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}