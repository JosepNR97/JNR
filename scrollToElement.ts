export const scrollToElementAfterLayout = (elementId: string) => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const prefersReducedMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      document.getElementById(elementId)?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  });
};
