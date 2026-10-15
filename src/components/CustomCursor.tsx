import { useEffect, useRef } from 'react';

const TRAIL_COUNT = 6;

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Raw mouse position — updated synchronously on every mousemove
    let mouseX = -200;
    let mouseY = -200;
    let isHovering = false;
    let isClicking = false;

    // Trail positions — each lags behind the previous
    const trail = Array.from({ length: TRAIL_COUNT }, () => ({ x: -200, y: -200 }));

    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Hover detection — no setState, just a flag
      const el = e.target as HTMLElement;
      isHovering = !!(
        el.closest('button, a, input, textarea, select, label, [role="button"], [role="radio"]')
      );

      // Move the main dot immediately — zero lag
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
    };

    const onDown = () => {
      isClicking = true;
      if (dotRef.current) {
        dotRef.current.style.width = '6px';
        dotRef.current.style.height = '6px';
      }
    };

    const onUp = () => {
      isClicking = false;
      if (dotRef.current) {
        dotRef.current.style.width = '8px';
        dotRef.current.style.height = '8px';
      }
    };

    // RAF loop — only for the ring (slight lag) and trail dots
    const animate = () => {
      // Ring follows mouse with a tiny smooth lag for elegance
      const ring = ringRef.current;
      if (ring) {
        const prevX = parseFloat(ring.dataset.x ?? String(mouseX));
        const prevY = parseFloat(ring.dataset.y ?? String(mouseY));
        const nx = prevX + (mouseX - prevX) * 0.22;
        const ny = prevY + (mouseY - prevY) * 0.22;
        ring.dataset.x = String(nx);
        ring.dataset.y = String(ny);

        const size = isClicking ? 26 : isHovering ? 42 : 34;
        ring.style.transform = `translate(${nx - size / 2}px, ${ny - size / 2}px)`;
        ring.style.width = `${size}px`;
        ring.style.height = `${size}px`;
        ring.style.borderColor = isHovering ? '#f59e0b' : '#14b8a6';
        ring.style.boxShadow = isHovering
          ? '0 0 10px rgba(251,191,36,0.5)'
          : '0 0 10px rgba(20,184,166,0.4)';

        // Main dot colour
        if (dotRef.current) {
          dotRef.current.style.background = isHovering
            ? 'linear-gradient(135deg,#f59e0b,#fbbf24)'
            : 'linear-gradient(135deg,#14b8a6,#2dd4bf)';
          dotRef.current.style.boxShadow = isHovering
            ? '0 0 8px rgba(251,191,36,0.9)'
            : '0 0 8px rgba(20,184,166,0.9)';
        }
      }

      // Trail — each dot chases the one ahead of it
      trail[0].x += (mouseX - trail[0].x) * 0.28;
      trail[0].y += (mouseY - trail[0].y) * 0.28;
      for (let i = 1; i < TRAIL_COUNT; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.32;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.32;
      }

      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        const progress = 1 - i / TRAIL_COUNT;
        const size = 4 + progress * 7;
        el.style.transform = `translate(${trail[i].x - size / 2}px, ${trail[i].y - size / 2}px)`;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.opacity = String(progress * 0.3);
      });

      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Trail dots */}
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          aria-hidden="true"
          className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full will-change-transform"
          style={{
            background: i % 2 === 0
              ? 'rgba(20,184,166,0.6)'
              : 'rgba(251,191,36,0.5)',
            filter: 'blur(1.5px)',
          }}
        />
      ))}

      {/* Outer ring — slight lag for elegance */}
      <div
        ref={ringRef}
        data-x="-200"
        data-y="-200"
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border-2 will-change-transform"
        style={{
          width: 34,
          height: 34,
          borderColor: '#14b8a6',
          transition: 'width 0.15s ease, height 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
        }}
      />

      {/* Inner dot — zero lag, instant */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full will-change-transform"
        style={{
          width: 8,
          height: 8,
          background: 'linear-gradient(135deg,#14b8a6,#2dd4bf)',
          boxShadow: '0 0 8px rgba(20,184,166,0.9)',
          transition: 'width 0.1s, height 0.1s',
        }}
      />
    </>
  );
}
