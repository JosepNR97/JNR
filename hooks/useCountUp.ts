import { useEffect, useState } from 'react';

const easeOutExpo = (progress: number) =>
  progress >= 1 ? 1 : 1 - Math.pow(2, -10 * progress);

export const useCountUp = (
  target: number,
  isVisible: boolean,
  duration = 1200,
) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return undefined;

    const safeTarget = Math.max(0, target);
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (safeTarget === 0 || duration <= 0 || prefersReducedMotion) {
      setCurrentValue(safeTarget);
      return undefined;
    }

    let animationFrame = 0;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      startTime ??= timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCurrentValue(Math.round(safeTarget * easeOutExpo(progress)));

      if (progress < 1) animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [duration, isVisible, target]);

  return currentValue;
};
