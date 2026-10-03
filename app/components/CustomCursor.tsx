'use client';

import { useEffect, useRef, useState } from 'react';

type TrailPoint = {
  x: number;
  y: number;
  alpha: number;
  radius: number;
};

type ClickEffect = {
  id: number;
  x: number;
  y: number;
  sparks: { tx: string; ty: string }[];
};

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);

  const orbRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const magneticTarget = useRef<{ x: number; y: number } | null>(null);
  const trailPoints = useRef<TrailPoint[]>([]);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Disable on touch-only / coarse pointer devices
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : null;

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (isHidden) setIsHidden(false);

      // Add trail point on movement
      trailPoints.current.push({
        x: e.clientX,
        y: e.clientY,
        alpha: 0.55,
        radius: 4
      });
      if (trailPoints.current.length > 25) {
        trailPoints.current.shift();
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const sparks = Array.from({ length: 7 }, (_, i) => {
        const angle = (i * (360 / 7) + Math.random() * 20) * (Math.PI / 180);
        const dist = 30 + Math.random() * 25;
        return {
          tx: `${Math.cos(angle) * dist}px`,
          ty: `${Math.sin(angle) * dist}px`
        };
      });

      const newEffect: ClickEffect = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        sparks
      };

      setClickEffects((prev) => [...prev.slice(-4), newEffect]);
      setTimeout(() => {
        setClickEffects((prev) => prev.filter((eff) => eff.id !== newEffect.id));
      }, 600);
    };

    const onMouseUp = () => {
      setIsClicking(false);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest<HTMLElement>(
        'a, button, input, select, textarea, [role="button"], .duration-pill-btn, .domain-tld-card, .plan-button, .category-card, .faq-category-pill, .footer-link-btn, .hero-primary, .hero-secondary, .pricing-btn-outline, .pricing-btn-primary'
      );

      if (interactive) {
        setIsHovering(true);
        const rect = interactive.getBoundingClientRect();
        // Magnetic snap towards center if element is compact
        if (rect.width <= 320 && rect.height <= 120) {
          magneticTarget.current = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          };
        } else {
          magneticTarget.current = null;
        }
      } else {
        setIsHovering(false);
        magneticTarget.current = null;
      }
    };

    const onMouseLeaveWindow = () => setIsHidden(true);
    const onMouseEnterWindow = () => setIsHidden(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveWindow);
    document.addEventListener('mouseenter', onMouseEnterWindow);

    // Smooth Animation Loop (RAF)
    const animate = () => {
      // Direct positioning for inner Glowing Orb
      if (orbRef.current) {
        orbRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Smooth Lerp Physics for Glass Ring (with magnetic attraction)
      const targetX = magneticTarget.current
        ? mousePos.current.x * 0.65 + magneticTarget.current.x * 0.35
        : mousePos.current.x;
      const targetY = magneticTarget.current
        ? mousePos.current.y * 0.65 + magneticTarget.current.y * 0.35
        : mousePos.current.y;

      const lerpSpeed = magneticTarget.current ? 0.22 : 0.16;
      ringPos.current.x += (targetX - ringPos.current.x) * lerpSpeed;
      ringPos.current.y += (targetY - ringPos.current.y) * lerpSpeed;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Render Smooth Stardust Trail on Canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = trailPoints.current.length - 1; i >= 0; i--) {
          const pt = trailPoints.current[i];
          pt.alpha -= 0.024;
          pt.radius = Math.max(1, pt.radius - 0.12);

          if (pt.alpha <= 0) {
            trailPoints.current.splice(i, 1);
            continue;
          }

          // Glowing Stardust particle
          const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.radius * 2.5);
          grad.addColorStop(0, `rgba(56, 189, 248, ${pt.alpha})`);
          grad.addColorStop(0.5, `rgba(14, 165, 233, ${pt.alpha * 0.6})`);
          grad.addColorStop(1, `rgba(2, 132, 199, 0)`);

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Connect smooth spline between adjacent points
          if (i > 0) {
            const prev = trailPoints.current[i - 1];
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(pt.x, pt.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${pt.alpha * 0.4})`;
            ctx.lineWidth = pt.radius;
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        }
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
      document.removeEventListener('mouseenter', onMouseEnterWindow);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isHidden]);

  return (
    <div
      className={`custom-cursor-container ${isHidden ? 'cursor-hidden' : ''} ${
        isHovering ? 'is-hovering' : ''
      } ${isClicking ? 'is-clicking' : ''}`}
      aria-hidden="true"
    >
      {/* Smooth Particle / Trail Canvas */}
      <canvas ref={canvasRef} className="cursor-trail-canvas" />

      {/* Outer Glass Ring (smooth trailing + magnetic hover) */}
      <div ref={ringRef} className="cursor-glass-ring" />

      {/* Inner Glowing Orb (zero lag) */}
      <div ref={orbRef} className="cursor-glowing-orb" />

      {/* Click Effects: Expanding Shockwave + Spark Burst */}
      {clickEffects.map((eff) => (
        <div key={eff.id} style={{ position: 'absolute', left: eff.x, top: eff.y, pointerEvents: 'none' }}>
          <div className="cursor-shockwave" />
          {eff.sparks.map((spark, idx) => (
            <div
              key={idx}
              className="cursor-spark"
              style={
                {
                  '--tx': spark.tx,
                  '--ty': spark.ty
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
