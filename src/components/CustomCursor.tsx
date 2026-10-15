import { useEffect, useRef, useState } from 'react';

interface CursorPos { x: number; y: number }

const TRAIL_COUNT = 8;

export function CustomCursor() {
  const [pos, setPos] = useState<CursorPos>({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [trail, setTrail] = useState<CursorPos[]>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 })),
  );

  const posRef = useRef(pos);
  posRef.current = pos;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if hovering an interactive element
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const tag = (el as HTMLElement).tagName.toLowerCase();
        const role = el.getAttribute('role');
        const isClickable =
          ['a', 'button', 'input', 'textarea', 'select', 'label'].includes(tag) ||
          role === 'button' || role === 'radio' || role === 'checkbox' ||
          (el as HTMLElement).style.cursor === 'pointer' ||
          (el as HTMLElement).closest('button, a, [role="button"]') !== null;
        setHovering(isClickable);
      }
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    // Trail animation loop
    let raf: number;
    const trailPositions: CursorPos[] = Array.from(
      { length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }),
    );

    const animate = () => {
      const current = posRef.current;
      // Each trail segment lags behind the next
      trailPositions[0].x += (current.x - trailPositions[0].x) * 0.45;
      trailPositions[0].y += (current.y - trailPositions[0].y) * 0.45;
      for (let i = 1; i < TRAIL_COUNT; i++) {
        trailPositions[i].x += (trailPositions[i - 1].x - trailPositions[i].x) * 0.35;
        trailPositions[i].y += (trailPositions[i - 1].y - trailPositions[i].y) * 0.35;
      }
      setTrail(trailPositions.map((p) => ({ ...p })));
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Trail dots */}
      {trail.map((p, i) => {
        const progress = 1 - i / TRAIL_COUNT; // 1 at front, 0 at back
        const size = 6 + progress * 8; // 6–14px
        const opacity = progress * 0.35;
        return (
          <div
            key={i}
            aria-hidden="true"
            className="fixed pointer-events-none z-[9998] rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: size,
              height: size,
              opacity,
              transform: 'translate(-50%, -50%)',
              background: i % 2 === 0
                ? `rgba(20,184,166,${opacity * 2.5})`
                : `rgba(251,191,36,${opacity * 2})`,
              filter: 'blur(1px)',
              transition: 'opacity 0.1s',
            }}
          />
        );
      })}

      {/* Outer ring */}
      <div
        aria-hidden="true"
        className="fixed pointer-events-none z-[9999] rounded-full border-2 transition-all duration-150"
        style={{
          left: pos.x,
          top: pos.y,
          width: hovering ? 44 : clicking ? 28 : 36,
          height: hovering ? 44 : clicking ? 28 : 36,
          transform: 'translate(-50%, -50%)',
          borderColor: hovering ? '#f59e0b' : '#14b8a6',
          opacity: 0.7,
          boxShadow: hovering
            ? '0 0 12px rgba(251,191,36,0.4)'
            : '0 0 12px rgba(20,184,166,0.3)',
        }}
      />

      {/* Inner dot */}
      <div
        aria-hidden="true"
        className="fixed pointer-events-none z-[9999] rounded-full transition-all duration-100"
        style={{
          left: pos.x,
          top: pos.y,
          width: clicking ? 6 : 8,
          height: clicking ? 6 : 8,
          transform: 'translate(-50%, -50%)',
          background: hovering
            ? 'linear-gradient(135deg,#f59e0b,#fbbf24)'
            : 'linear-gradient(135deg,#14b8a6,#2dd4bf)',
          boxShadow: hovering
            ? '0 0 8px rgba(251,191,36,0.8)'
            : '0 0 8px rgba(20,184,166,0.8)',
        }}
      />
    </>
  );
}
