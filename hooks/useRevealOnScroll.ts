import { useEffect, useRef, useState } from 'react';

const REVEAL_OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.15,
  rootMargin: '0px 0px -10% 0px',
};

export const useRevealOnScroll = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

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
