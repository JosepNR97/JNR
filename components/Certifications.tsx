import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { CERTIFICATION_LOGOS } from '../constants';
import { useLanguage } from '../context/LanguageContext';

interface CertificationsProps {
  onSelectVendor: (vendorId: string) => void;
}

const AUTO_SCROLL_PX_PER_SECOND = 52;
const DRAG_THRESHOLD = 6;
const CAROUSEL_COPIES = 3;
const INTERACTIVE_COPY_INDEX = 1;

const normalizeOffset = (offset: number, segmentWidth: number) => {
  if (segmentWidth <= 0) return offset;

  let normalizedOffset = offset;

  while (normalizedOffset <= -2 * segmentWidth) {
    normalizedOffset += segmentWidth;
  }

  while (normalizedOffset > -segmentWidth) {
    normalizedOffset -= segmentWidth;
  }

  return normalizedOffset;
};

const applyTrackOffset = (
  track: HTMLDivElement,
  offset: number,
) => {
  track.style.transform = `translate3d(${offset}px, 0, 0)`;
};

export const Certifications = ({
  onSelectVendor,
}: CertificationsProps) => {
  const { t } = useLanguage();

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLDivElement>(null);

  const animationFrameRef = useRef(0);
  const previousFrameTimeRef = useRef<number | null>(null);

  const segmentWidthRef = useRef(0);
  const offsetRef = useRef(0);

  const hoverPausedRef = useRef(false);
  const keyboardFocusPausedRef = useRef(false);
  const draggingRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const dragResetTimeoutRef = useRef<number | null>(null);

  const pointerRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    lastX: 0,
    moved: false,
  });

  const [isDragging, setIsDragging] = useState(false);

  useLayoutEffect(() => {
    const segment = segmentRef.current;
    const track = trackRef.current;

    if (!segment || !track) return undefined;

    const measureSegment = () => {
      const nextSegmentWidth =
        segment.getBoundingClientRect().width;

      if (
        !Number.isFinite(nextSegmentWidth) ||
        nextSegmentWidth <= 0
      ) {
        return;
      }

      const previousSegmentWidth =
        segmentWidthRef.current;

      let progress = 0;

      if (previousSegmentWidth > 0) {
        const previousOffset = normalizeOffset(
          offsetRef.current,
          previousSegmentWidth,
        );

        progress =
          (-previousOffset - previousSegmentWidth) /
          previousSegmentWidth;

        progress = Math.max(
          0,
          Math.min(progress, 0.999999),
        );
      }

      segmentWidthRef.current = nextSegmentWidth;

      offsetRef.current =
        -nextSegmentWidth * (1 + progress);

      applyTrackOffset(
        track,
        offsetRef.current,
      );
    };

    measureSegment();

    let resizeObserver: ResizeObserver | undefined;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(
        measureSegment,
      );

      resizeObserver.observe(segment);
    }

    window.addEventListener(
      'resize',
      measureSegment,
      { passive: true },
    );

    return () => {
      resizeObserver?.disconnect();

      window.removeEventListener(
        'resize',
        measureSegment,
      );
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    const updateMotionPreference = () => {
      reducedMotionRef.current =
        mediaQuery.matches;
    };

    updateMotionPreference();

    mediaQuery.addEventListener(
      'change',
      updateMotionPreference,
    );

    previousFrameTimeRef.current = null;

    const animate = (frameTime: number) => {
      const track = trackRef.current;
      const segmentWidth =
        segmentWidthRef.current;

      if (
        previousFrameTimeRef.current === null
      ) {
        previousFrameTimeRef.current =
          frameTime;
      }

      const elapsedSeconds = Math.min(
        Math.max(
          frameTime -
            previousFrameTimeRef.current,
          0,
        ) / 1000,
        0.05,
      );

      previousFrameTimeRef.current =
        frameTime;

      const isPaused =
        hoverPausedRef.current ||
        keyboardFocusPausedRef.current ||
        draggingRef.current ||
        reducedMotionRef.current;

      if (
        track &&
        segmentWidth > 0 &&
        !isPaused
      ) {
        offsetRef.current =
          normalizeOffset(
            offsetRef.current -
              AUTO_SCROLL_PX_PER_SECOND *
                elapsedSeconds,
            segmentWidth,
          );

        applyTrackOffset(
          track,
          offsetRef.current,
        );
      }

      animationFrameRef.current =
        window.requestAnimationFrame(
          animate,
        );
    };

    animationFrameRef.current =
      window.requestAnimationFrame(
        animate,
      );

    return () => {
      mediaQuery.removeEventListener(
        'change',
        updateMotionPreference,
      );

      window.cancelAnimationFrame(
        animationFrameRef.current,
      );

      if (
        dragResetTimeoutRef.current !== null
      ) {
        window.clearTimeout(
          dragResetTimeoutRef.current,
        );
      }
    };
  }, []);

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (event.button !== 0) return;

    if (
      dragResetTimeoutRef.current !== null
    ) {
      window.clearTimeout(
        dragResetTimeoutRef.current,
      );

      dragResetTimeoutRef.current = null;
    }

    /*
     * A mouse click may leave the clicked button focused.
     * That focus must not permanently pause autoplay once
     * the pointer leaves the carousel. Keyboard focus is
     * handled separately with :focus-visible.
     */
    keyboardFocusPausedRef.current = false;

    pointerRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      lastX: event.clientX,
      moved: false,
    };

    draggingRef.current = true;
    setIsDragging(true);
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const pointer = pointerRef.current;
    const track = trackRef.current;
    const segmentWidth =
      segmentWidthRef.current;

    if (
      !pointer.active ||
      pointer.pointerId !== event.pointerId ||
      !track ||
      segmentWidth <= 0
    ) {
      return;
    }

    const distanceFromStart =
      event.clientX - pointer.startX;

    let deltaX =
      event.clientX - pointer.lastX;

    if (!pointer.moved) {
      if (
        Math.abs(distanceFromStart) <=
        DRAG_THRESHOLD
      ) {
        return;
      }

      pointer.moved = true;

      /*
       * Include the first few pixels consumed by the
       * drag threshold so the movement feels immediate.
       */
      deltaX = distanceFromStart;

      event.currentTarget.setPointerCapture?.(
        event.pointerId,
      );
    }

    pointer.lastX = event.clientX;

    event.preventDefault();

    offsetRef.current = normalizeOffset(
      offsetRef.current + deltaX,
      segmentWidth,
    );

    applyTrackOffset(
      track,
      offsetRef.current,
    );
  };

  const handlePointerEnd = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const pointer = pointerRef.current;

    if (
      !pointer.active ||
      pointer.pointerId !== event.pointerId
    ) {
      return;
    }

    const moved = pointer.moved;

    pointer.active = false;

    draggingRef.current = false;
    setIsDragging(false);

    if (
      event.currentTarget.hasPointerCapture?.(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture?.(
        event.pointerId,
      );
    }

    /*
     * A real click is emitted immediately after pointerup.
     * Keep "moved" alive until that click has had a chance
     * to be suppressed, then reset it for future clicks.
     */
    if (moved) {
      dragResetTimeoutRef.current =
        window.setTimeout(() => {
          pointerRef.current.moved = false;
          dragResetTimeoutRef.current = null;
        }, 0);
    } else {
      pointerRef.current.moved = false;
    }
  };

  const handleLogoClick = (
    vendorId: string,
  ) => {
    if (pointerRef.current.moved) {
      pointerRef.current.moved = false;
      return;
    }

    onSelectVendor(vendorId);
  };

  const handleFocusCapture = (
    event: React.FocusEvent<HTMLDivElement>,
  ) => {
    const target = event.target as HTMLElement;

    let isFocusVisible = false;

    try {
      isFocusVisible =
        target.matches(':focus-visible');
    } catch {
      isFocusVisible = false;
    }

    /*
     * Mouse clicks also create focus, but they should
     * only pause the carousel while the mouse is hovering.
     * Keyboard focus, on the other hand, should keep the
     * carousel still while the user navigates its buttons.
     */
    if (!isFocusVisible) return;

    keyboardFocusPausedRef.current = true;

    const track = trackRef.current;
    const segmentWidth =
      segmentWidthRef.current;

    /*
     * Bring the accessible middle copy back into view
     * before keyboard navigation starts.
     */
    if (track && segmentWidth > 0) {
      offsetRef.current = -segmentWidth;

      applyTrackOffset(
        track,
        offsetRef.current,
      );
    }
  };

  const handleBlurCapture = (
    event: React.FocusEvent<HTMLDivElement>,
  ) => {
    if (
      !event.currentTarget.contains(
        event.relatedTarget,
      )
    ) {
      keyboardFocusPausedRef.current =
        false;
    }
  };

  return (
    <section className="w-full overflow-hidden border-y border-slate-200 bg-slate-50 py-12">
      <div className="mx-auto mb-8 max-w-7xl px-4 text-center">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {t.certifications.title}
        </h2>
      </div>

      <div
        ref={viewportRef}
        data-testid="certifications-viewport"
        className={`w-full touch-pan-y select-none overflow-hidden ${
          isDragging
            ? 'cursor-grabbing'
            : 'cursor-grab'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onMouseEnter={() => {
          hoverPausedRef.current = true;
        }}
        onMouseLeave={() => {
          hoverPausedRef.current = false;
        }}
        onFocusCapture={handleFocusCapture}
        onBlurCapture={handleBlurCapture}
      >
        <div
          ref={trackRef}
          data-testid="certifications-track"
          className="flex w-max items-center py-4 will-change-transform"
        >
          {Array.from(
            { length: CAROUSEL_COPIES },
            (_, copyIndex) => (
              <div
                key={copyIndex}
                ref={
                  copyIndex ===
                  INTERACTIVE_COPY_INDEX
                    ? segmentRef
                    : undefined
                }
                data-carousel-segment={
                  copyIndex ===
                  INTERACTIVE_COPY_INDEX
                    ? 'true'
                    : undefined
                }
                className="flex shrink-0 items-center gap-12 pr-12"
                aria-hidden={
                  copyIndex !==
                  INTERACTIVE_COPY_INDEX
                }
              >
                {CERTIFICATION_LOGOS.map(
                  (logo) => (
                    <button
                      key={`${copyIndex}-${logo.name}`}
                      type="button"
                      tabIndex={
                        copyIndex ===
                        INTERACTIVE_COPY_INDEX
                          ? 0
                          : -1
                      }
                      aria-label={`${t.certifications.openVendor} ${logo.name}`}
                      onClick={() =>
                        handleLogoClick(
                          logo.educationId,
                        )
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
                  ),
                )}
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};
