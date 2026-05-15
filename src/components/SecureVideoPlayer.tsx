'use client';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

interface Props {
  videoUrl: string;
  title?: string;
}

export default function SecureVideoPlayer({ videoUrl, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const [isBlocked, setIsBlocked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Disable picture in picture
    video.disablePictureInPicture = true;

    // Disable right click on entire container
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    containerRef.current?.addEventListener('contextmenu', preventContextMenu);

    // Disable keyboard shortcuts
    const preventKeys = (e: KeyboardEvent) => {
      // Block PrintScreen, F12, Ctrl+Shift+I, Ctrl+U
      if (
        e.key === 'PrintScreen' ||
        e.keyCode === 44 ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u') ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        triggerWarning();
      }
    };
    document.addEventListener('keydown', preventKeys);

    // Detect screen recording via visibility change
    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Detect dev tools
    const devToolsDetect = setInterval(() => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        setIsBlocked(true);
        video.pause();
      } else {
        setIsBlocked(false);
      }
    }, 1000);

    // Block drag
    const preventDrag = (e: DragEvent) => e.preventDefault();
    video.addEventListener('dragstart', preventDrag);

    return () => {
      containerRef.current?.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventKeys);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(devToolsDetect);
      video.removeEventListener('dragstart', preventDrag);
    };
  }, []);

  const triggerWarning = () => {
    setShowWarning(true);
    videoRef.current?.pause();
    setTimeout(() => setShowWarning(false), 3000);
  };

  const watermarkText = user?.email || user?.name || 'Protected Content';

  const s: any = {
    container: { position: 'relative', width: '100%', background: '#000', borderRadius: 12, overflow: 'hidden', userSelect: 'none' },
    video: { width: '100%', display: 'block', maxHeight: '70vh' },
    watermark: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    watermarkText: { color: 'rgba(255,255,255,0.12)', fontSize: 18, fontWeight: 600, transform: 'rotate(-35deg)', userSelect: 'none', whiteSpace: 'nowrap', letterSpacing: 2 },
    watermarkGrid: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 10, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', padding: 20 },
    blocked: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20 },
    blockedText: { color: '#f87171', fontSize: 18, fontWeight: 600, marginBottom: 8 },
    blockedSub: { color: '#8888aa', fontSize: 14 },
    warning: { position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(248,113,113,0.9)', color: 'white', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, zIndex: 30, whiteSpace: 'nowrap' },
    title: { color: '#f0f0ff', fontSize: 16, fontWeight: 600, padding: '12px 0 8px' },
    shield: { position: 'absolute', bottom: 60, right: 12, color: 'rgba(255,255,255,0.4)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, zIndex: 10, pointerEvents: 'none' },
  };

  return (
    <div>
      {title && <div style={s.title}>{title}</div>}
      <div ref={containerRef} style={s.container}>
        {isBlocked ? (
          <div style={s.blocked}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
            <div style={s.blockedText}>Developer Tools Detected</div>
            <div style={s.blockedSub}>Please close dev tools to continue watching</div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              style={s.video}
              controls
              controlsList="nodownload noremoteplayback nofullscreen"
              playsInline
              onContextMenu={e => e.preventDefault()}
            >
              <source src={videoUrl} />
              Your browser does not support video playback.
            </video>

            {/* Watermark Grid */}
            <div style={s.watermarkGrid}>
              {Array(9).fill(null).map((_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ ...s.watermarkText, fontSize: i === 4 ? 16 : 12, opacity: i === 4 ? 0.15 : 0.08 }}>
                    {watermarkText}
                  </span>
                </div>
              ))}
            </div>

            {/* Shield badge */}
            <div style={s.shield}>🔒 Protected</div>
          </>
        )}

        {showWarning && (
          <div style={s.warning}>⚠️ Screen capture is not allowed</div>
        )}
      </div>
    </div>
  );
}