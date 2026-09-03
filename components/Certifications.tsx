import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { CERTIFICATION_LOGOS } from '../constants';
import { useLanguage } from '../context/LanguageContext';

interface CertificationsProps {
  onSelectVendor: (vendorId: string) => void;
}

const AUTO_SCROLL_SPEED = 28;
const DRAG_THRESHOLD = 6;
const CAROUSEL_COPIES = 5;
const MIDDLE_COPY_INDEX = Math.floor(CAROUSEL_COPIES / 2);

const getSegmentWidth = (container: HTMLDivElement) =>
  container.scrollWidth / CAROUSEL_COPIES;

const normalizeScrollPosition = (
  container: HTMLDivElement,
  pointer?: { startScroll: number },
) => {
  const segmentWidth = getSegmentWidth(container);
  if (!segmentWidth) return;

  const lowerBoundary = segmentWidth * (MIDDLE_COPY_INDEX - 1);
  const upperBoundary = segmentWidth * (MIDDLE_COPY_INDEX + 1);

  if (container.scrollLeft >= upperBoundary) {
    container.scrollLeft -= segmentWidth;

    if (pointer) {
      pointer.startScroll -= segmentWidth;
    }
  } else if (container.scrollLeft <= lowerBoundary) {
    container.scrollLeft += segmentWidth;

    if (pointer) {
      pointer.startScroll += segmentWidth;
    }
  }
};

export const Certifications = ({
  onSelectVendor,
}: CertificationsProps) => {
  const { t } = useLanguage();

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef(0);
  const pauseRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const dragResetTimeoutRef = useRef<number | null>(null);

  const pointerRef = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    const updateMotionPreference = () => {
      reducedMotionRef.current = mediaQuery.matches;
    };

    updateMotionPreference();

    const container = containerRef.current;

    if (container) {
      container.scrollLeft =
        getSegmentWidth(container) * MIDDLE_COPY_INDEX;
    }

    mediaQuery.addEventListener('change', updateMotionPreference);

    let previousFrameTime: number | null = null;

    const animate = (frameTime: number) => {
      const currentContainer = containerRef.current;

      if (previousFrameTime === null) {
        previousFrameTime = frameTime;
      }

      const elapsedSeconds = Math.min(
        Math.max(frameTime - previousFrameTime, 0) / 1000,
        0.05,
      );

      previousFrameTime = frameTime;

      if (
        currentContainer &&
        !pauseRef.current &&
        !reducedMotionRef.current
      ) {
        currentContainer.scrollLeft +=
          AUTO_SCROLL_SPEED * elapsedSeconds;

        normalizeScrollPosition(currentContainer);
      }

      requestRef.current =
        window.requestAnimationFrame(animate);
    };

    requestRef.current =
      window.requestAnimationFrame(animate);

    return () => {
      mediaQuery.removeEventListener(
        'change',
        updateMotionPreference,
      );

      window.cancelAnimationFrame(requestRef.current);

      if (dragResetTimeoutRef.current !== null) {
        window.clearTimeout(dragResetTimeoutRef.current);
      }
    };
  }, []);

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (event.button !== 0) return;

    const container = containerRef.current;
    if (!container) return;

    if (dragResetTimeoutRef.current !== null) {
      window.clearTimeout(dragResetTimeoutRef.current);
      dragResetTimeoutRef.current = null;
    }

    pointerRef.current = {
      active: true,
      startX: event.clientX,
      startScroll: container.scrollLeft,
      moved: false,
    };

    pauseRef.current = true;
    setIsDragging(true);
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const container = containerRef.current;
    const pointer = pointerRef.current;

    if (!container || !pointer.active) return;

    const distance = event.clientX - pointer.startX;

    if (
      Math.abs(distance) > DRAG_THRESHOLD &&
      !pointer.moved
    ) {
      pointer.moved = true;
      container.setPointerCapture?.(event.pointerId);
    }

    container.scrollLeft =
      pointer.startScroll - distance;

    normalizeScrollPosition(container, pointer);
  };

  const handlePointerEnd = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const container = containerRef.current;
    const moved = pointerRef.current.moved;

    pointerRef.current.active = false;
    setIsDragging(false);

    // Mouse/touch interaction should resume automatic movement.
    // Keyboard focus still pauses it through onFocus/onBlur.
    pauseRef.current = false;

    if (
      container?.hasPointerCapture?.(event.pointerId)
    ) {
      container.releasePointerCapture?.(event.pointerId);
    }

    if (moved) {
      dragResetTimeoutRef.current = window.setTimeout(() => {
        pointerRef.current.moved = false;
        dragResetTimeoutRef.current = null;
      }, 0);
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
        className={`scrollbar-none w-full touch-pan-y select-none overflow-x-auto ${
          isDragging
            ? 'cursor-grabbing'
            : 'cursor-grab'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onFocus={() => {
          pauseRef.current = true;
        }}
        onBlur={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget)
          ) {
            pauseRef.current = false;
          }
        }}
      >
        <div className="inline-flex min-w-max items-center py-4">
          {Array.from(
            { length: CAROUSEL_COPIES },
            (_, copyIndex) => (
              <div
                key={copyIndex}
                className="inline-flex items-center gap-16 px-8"
                aria-hidden={
                  copyIndex !== MIDDLE_COPY_INDEX
                }
              >
                {CERTIFICATION_LOGOS.map((logo) => (
                  <button
                    key={`${copyIndex}-${logo.name}`}
                    type="button"
                    tabIndex={
                      copyIndex === MIDDLE_COPY_INDEX
                        ? 0
                        : -1
                    }
                    aria-label={`${t.certifications.openVendor} ${logo.name}`}
                    onClick={() =>
                      handleLogoClick(logo.educationId)
                    }
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
            ),
          )}
        </div>
      </div>
    </section>
  );
};
