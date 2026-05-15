'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import SecureVideoPlayer from '@/components/SecureVideoPlayer';
import toast from 'react-hot-toast';

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const load = async () => {
      try {
        const r = await api.get(`/courses/${id}`);
        setCourse(r.data.data);
        setLessons(r.data.data.lessons || []);

        // Check if purchased
        const orders = await api.get('/orders/my');
        const bought = orders.data.data.some((o: any) =>
          o.status === 'paid' && JSON.stringify(o.items).includes(id as string)
        );
        setPurchased(bought);

        // Set first free lesson or first lesson if purchased
        const firstLesson = r.data.data.lessons?.[0];
        if (firstLesson) setActiveLesson(firstLesson);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, [id]);

  const canWatch = (lesson: any) => lesson.isFree || purchased;

  const s: any = {
    page: { padding: 32 },
    grid: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' },
    playerSection: { flex: 1 },
    sidebar: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden', position: 'sticky', top: 24 },
    sidebarTitle: { color: '#f0f0ff', fontSize: 14, fontWeight: 600, padding: '16px 20px', borderBottom: '1px solid #2a2a3a' },
    lessonItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', cursor: 'pointer', borderBottom: '1px solid #1a1a2a', transition: 'all 0.2s' },
    lessonNum: { width: 28, height: 28, borderRadius: '50%', background: '#16161f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#8888aa', flexShrink: 0 },
    lessonInfo: { flex: 1 },
    lessonTitle: { color: '#f0f0ff', fontSize: 13, fontWeight: 500, marginBottom: 2 },
    lessonDuration: { color: '#555570', fontSize: 12 },
    lockIcon: { color: '#555570', fontSize: 16 },
    courseInfo: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, padding: 20, marginTop: 20 },
    courseTitle: { color: '#f0f0ff', fontSize: 22, fontWeight: 700, marginBottom: 8 },
    courseDesc: { color: '#8888aa', fontSize: 14, lineHeight: 1.6, marginBottom: 16 },
    tags: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
    tag: { background: 'rgba(124,109,250,0.1)', color: '#7c6dfa', border: '1px solid rgba(124,109,250,0.2)', borderRadius: 999, fontSize: 12, padding: '3px 10px' },
    buyBox: { background: 'linear-gradient(135deg, rgba(124,109,250,0.1), rgba(250,109,141,0.1))', border: '1px solid rgba(124,109,250,0.2)', borderRadius: 12, padding: 20, marginTop: 16 },
    price: { color: '#f0f0ff', fontSize: 28, fontWeight: 800, marginBottom: 4 },
    buyBtn: { width: '100%', background: '#7c6dfa', color: 'white', border: 'none', borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 12 },
    lockedOverlay: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, padding: 40, textAlign: 'center', marginBottom: 20 },
    lockedIcon: { fontSize: 48, marginBottom: 16 },
    lockedText: { color: '#f0f0ff', fontSize: 18, fontWeight: 600, marginBottom: 8 },
    lockedSub: { color: '#8888aa', fontSize: 14 },
  };

  if (loading) return <div style={{ padding: 32, color: '#8888aa' }}>Loading course...</div>;
  if (!course) return <div style={{ padding: 32, color: '#f87171' }}>Course not found</div>;

  return (
    <div style={s.page}>
      <div style={s.grid}>
        <div style={s.playerSection}>
          {activeLesson && canWatch(activeLesson) ? (
            <SecureVideoPlayer videoUrl={activeLesson.videoUrl} title={activeLesson.title} />
          ) : activeLesson ? (
            <div style={s.lockedOverlay}>
              <div style={s.lockedIcon}>🔒</div>
              <div style={s.lockedText}>This lesson is locked</div>
              <div style={s.lockedSub}>Purchase the course to access all lessons</div>
            </div>
          ) : (
            <div style={s.lockedOverlay}>
              <div style={s.lockedIcon}>📹</div>
              <div style={s.lockedText}>No lessons yet</div>
              <div style={s.lockedSub}>Lessons will be added soon</div>
            </div>
          )}

          <div style={s.courseInfo}>
            <div style={s.courseTitle}>{course.title}</div>
            <div style={s.courseDesc}>{course.description}</div>
            <div style={s.tags}>
              <span style={s.tag}>{course.category}</span>
              <span style={s.tag}>{course.level}</span>
              <span style={s.tag}>{course.language}</span>
              <span style={s.tag}>{lessons.length} lessons</span>
            </div>

            {!purchased && (
              <div style={s.buyBox}>
                <div style={s.price}>₹{course.price}</div>
                <div style={{ color: '#8888aa', fontSize: 13 }}>One-time payment • Lifetime access</div>
                <button style={s.buyBtn} onClick={() => {
                  addItem({ id: course.id, name: course.title, price: Number(course.price), type: 'course' });
                  toast.success('Added to cart!');
                  router.push('/cart');
                }}>
                  Buy Now — ₹{course.price} 🛒
                </button>
              </div>
            )}

            {purchased && (
              <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 8, padding: '12px 16px', color: '#4ade80', fontSize: 14, fontWeight: 500 }}>
                ✅ You own this course — enjoy learning!
              </div>
            )}
          </div>
        </div>

        <div style={s.sidebar}>
          <div style={s.sidebarTitle}>📋 Course Content ({lessons.length} lessons)</div>
          {lessons.length === 0 && (
            <div style={{ padding: 20, color: '#555570', fontSize: 14, textAlign: 'center' }}>No lessons yet</div>
          )}
          {lessons.map((lesson, i) => (
            <div
              key={lesson.id}
              style={{ ...s.lessonItem, background: activeLesson?.id === lesson.id ? 'rgba(124,109,250,0.1)' : 'transparent' }}
              onClick={() => {
                if (canWatch(lesson)) {
                  setActiveLesson(lesson);
                } else {
                  toast.error('Purchase course to unlock this lesson');
                }
              }}
            >
              <div style={{ ...s.lessonNum, background: activeLesson?.id === lesson.id ? '#7c6dfa' : '#16161f', color: activeLesson?.id === lesson.id ? 'white' : '#8888aa' }}>
                {i + 1}
              </div>
              <div style={s.lessonInfo}>
                <div style={s.lessonTitle}>{lesson.title}</div>
                <div style={s.lessonDuration}>{lesson.duration ? `${lesson.duration} min` : 'Video lesson'}</div>
              </div>
              <span style={s.lockIcon}>{canWatch(lesson) ? '▶️' : '🔒'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}