
import { useEffect, useState } from 'react';

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

export const useMotionPreference = () => {
  const prefersReducedMotion = useReducedMotion();
  
  const getAnimationDuration = (defaultDuration: number) => {
    return prefersReducedMotion ? 0 : defaultDuration;
  };

  const getAnimationConfig = (config: any) => {
    if (prefersReducedMotion) {
      return { ...config, duration: 0, transition: { duration: 0 } };
    }
    return config;
  };

  return {
    prefersReducedMotion,
    getAnimationDuration,
    getAnimationConfig,
  };
};
