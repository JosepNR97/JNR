import { useEffect, useRef, useState } from 'react';

const REVEAL_OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.15,
  rootMargin: '0px 0px -10% 0px',
};

export const useRevealOnScroll = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(
    () => typeof IntersectionObserver === 'undefined',
  );

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;

      setIsVisible(true);
      observer.disconnect();
    }, REVEAL_OBSERVER_OPTIONS);

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible } as const;
};