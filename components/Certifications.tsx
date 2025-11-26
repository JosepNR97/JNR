import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CERTIFICATION_LOGOS } from '../constants';

const REPEATED_LOGOS = [...CERTIFICATION_LOGOS, ...CERTIFICATION_LOGOS, ...CERTIFICATION_LOGOS, ...CERTIFICATION_LOGOS, ...CERTIFICATION_LOGOS];

export const Certifications: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const requestRef = useRef<number>(0);
  const positionRef = useRef<number>(0);
  const speedRef = useRef<number>(0.5);

  const animate = useCallback(() => {
    if (!containerRef.current) return;
    
    if (!isDragging && !isHovering) {
      positionRef.current += speedRef.current;
    }

    const container = containerRef.current;
    const maxScroll = container.scrollWidth / 2;

    if (positionRef.current >= maxScroll) {
      positionRef.current = 0;
    } else if (positionRef.current < 0) {
      positionRef.current = maxScroll - 1;
    }

    container.scrollLeft = positionRef.current;
    requestRef.current = requestAnimationFrame(animate);
  }, [isDragging, isHovering]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(positionRef.current);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    positionRef.current = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(positionRef.current);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    positionRef.current = scrollLeft - walk;
  };

  return (
    <section className="py-12 bg-slate-50 border-y border-slate-200 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
          {t.certifications.title}
        </h3>
      </div>
      
      <div 
        className={`w-full overflow-x-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        <div className="inline-flex items-center gap-16 px-4 min-w-max py-4">
          {REPEATED_LOGOS.map((logo, index) => (
            <div 
              key={`${logo.name}-${index}`} 
              className="flex-shrink-0 group transition-transform duration-300 hover:scale-110 relative z-10"
            >
              <img 
                src={logo.url} 
                alt={logo.name} 
                className="h-12 md:h-14 w-auto object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none mix-blend-multiply"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};