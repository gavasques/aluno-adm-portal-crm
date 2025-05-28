
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionOptions {
  duration?: number;
  onStart?: () => void;
  onComplete?: () => void;
}

export const usePageTransition = (options: PageTransitionOptions = {}) => {
  const location = useLocation();
  const { duration = 400, onStart, onComplete } = options;

  useEffect(() => {
    onStart?.();
    
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [location.pathname, duration, onStart, onComplete]);

  return {
    pathname: location.pathname,
    isTransitioning: false // Could be enhanced with state management
  };
};

export const useReducedMotion = () => {
  const prefersReducedMotion = 
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return prefersReducedMotion;
};

export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
};
