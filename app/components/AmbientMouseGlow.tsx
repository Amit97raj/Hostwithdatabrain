'use client';

import { useEffect, useRef, useState } from 'react';

export default function AmbientMouseGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const glowPos = useRef({ x: -1000, y: -1000 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Set CSS variables for spotlight shaders
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth floating physics for the ambient glow follower (Linear / Stripe style)
    const animate = () => {
      // Gentle spring lerp (0.12 speed creates a smooth luminous cloud following the cursor)
      glowPos.current.x += (mousePos.current.x - glowPos.current.x) * 0.12;
      glowPos.current.y += (mousePos.current.y - glowPos.current.y) * 0.12;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPos.current.x}px, ${glowPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  return (
    <>
      {/* Background Soft Glow Orb */}
      <div
        ref={glowRef}
        className="ambient-glow-follower"
        style={{ opacity: isVisible ? 0.95 : 0 }}
        aria-hidden="true"
      />

      {/* Global Ambient Spotlight Overlay */}
      <div
        className="ambient-spotlight-layer"
        style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s ease' }}
        aria-hidden="true"
      />
    </>
  );
}
