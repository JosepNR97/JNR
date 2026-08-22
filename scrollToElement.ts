const LAYOUT_SETTLE_MS = 350;

let pendingAnimationFrame = 0;
let pendingTimeout = 0;

export const scrollToElementAfterLayout = (elementId: string) => {
  window.cancelAnimationFrame(pendingAnimationFrame);
  window.clearTimeout(pendingTimeout);

  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  pendingAnimationFrame = window.requestAnimationFrame(() => {
    pendingAnimationFrame = window.requestAnimationFrame(() => {
      const scrollToTarget = () => {
        pendingTimeout = 0;
        pendingAnimationFrame = 0;

        document.getElementById(elementId)?.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      };

      if (prefersReducedMotion) {
        scrollToTarget();
        return;
      }

      pendingTimeout = window.setTimeout(scrollToTarget, LAYOUT_SETTLE_MS);
    });
  });
};
