import type { ComponentPropsWithoutRef } from 'react';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';

const revealClassName = (isVisible: boolean, className?: string) =>
  ['reveal', isVisible ? 'is-visible' : '', className ?? ''].filter(Boolean).join(' ');

export const Reveal = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>();

  return <div ref={ref} className={revealClassName(isVisible, className)} {...props} />;
};

export const RevealArticle = ({ className, ...props }: ComponentPropsWithoutRef<'article'>) => {
  const { ref, isVisible } = useRevealOnScroll<HTMLElement>();

  return <article ref={ref} className={revealClassName(isVisible, className)} {...props} />;
};
