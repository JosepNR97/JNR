import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { CERTIFICATION_LOGOS } from '../constants';
import { useLanguage } from '../context/LanguageContext';

interface CertificationsProps {
  onSelectVendor: (vendorId: string) => void;
}

const AUTO_SCROLL_SPEED = 0.45;
const DRAG_THRESHOLD = 6;

export const Certifications = ({ onSelectVendor }: CertificationsProps) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef(0);
  const pauseRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const pointerRef = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => {
      reducedMotionRef.current = mediaQuery.matches;
    };

    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);

    const animate = () => {
      const container = containerRef.current;
      if (container && !pauseRef.current && !reducedMotionRef.current) {
        const midpoint = container.scrollWidth / 2;
        container.scrollLeft += AUTO_SCROLL_SPEED;
        if (container.scrollLeft >= midpoint) container.scrollLeft -= midpoint;
      }
      requestRef.current = window.requestAnimationFrame(animate);
    };

    requestRef.current = window.requestAnimationFrame(animate);
    return () => {
      mediaQuery.removeEventListener('change', updateMotionPreference);
      window.cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const container = containerRef.current;
    if (!container) return;

    pointerRef.current = {
      active: true,
      startX: event.clientX,
      startScroll: container.scrollLeft,
      moved: false,
    };
    pauseRef.current = true;
    setIsDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const pointer = pointerRef.current;
    if (!container || !pointer.active) return;

    const distance = event.clientX - pointer.startX;
    if (Math.abs(distance) > DRAG_THRESHOLD && !pointer.moved) {
      pointer.moved = true;
      container.setPointerCapture?.(event.pointerId);
    }
    container.scrollLeft = pointer.startScroll - distance;
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    pointerRef.current.active = false;
    setIsDragging(false);
    pauseRef.current = container?.matches(':hover, :focus-within') ?? false;
    if (container?.hasPointerCapture?.(event.pointerId)) {
      container.releasePointerCapture?.(event.pointerId);
    }
  };

  const handleLogoClick = (vendorId: string) => {
    if (pointerRef.current.moved) {
      pointerRef.current.moved = false;
      return;
    }
    onSelectVendor(vendorId);
  };

  return (
    <section className="w-full overflow-hidden border-y border-slate-200 bg-slate-50 py-12">
      <div className="mx-auto mb-8 max-w-7xl px-4 text-center">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {t.certifications.title}
        </h2>
      </div>

      <div
        ref={containerRef}
        className={`scrollbar-none w-full touch-pan-y select-none overflow-x-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onMouseEnter={() => {
          pauseRef.current = true;
        }}
        onMouseLeave={() => {
          if (!pointerRef.current.active) pauseRef.current = false;
        }}
        onFocus={() => {
          pauseRef.current = true;
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) pauseRef.current = false;
        }}
      >
        <div className="inline-flex min-w-max items-center py-4">
          {[0, 1].map((copyIndex) => (
            <div
              key={copyIndex}
              className="inline-flex items-center gap-16 px-8"
              aria-hidden={copyIndex === 1}
            >
              {CERTIFICATION_LOGOS.map((logo) => (
                <button
                  key={`${copyIndex}-${logo.name}`}
                  type="button"
                  tabIndex={copyIndex === 1 ? -1 : 0}
                  aria-label={`${t.certifications.openVendor} ${logo.name}`}
                  onClick={() => handleLogoClick(logo.educationId)}
                  className="group grid h-20 w-40 shrink-0 place-items-center p-2 transition-transform duration-300 hover:scale-110 focus-visible:scale-110"
                >
                  <img
                    src={logo.url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    className="max-h-14 max-w-full object-contain opacity-50 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0"
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
