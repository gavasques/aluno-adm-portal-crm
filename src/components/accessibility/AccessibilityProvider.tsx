
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useScreenReaderAnnouncement } from '@/hooks/useAccessibility';

interface AccessibilityContextType {
  isHighContrast: boolean;
  reducedMotion: boolean;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibilityContext = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibilityContext must be used within AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { announce } = useScreenReaderAnnouncement();

  useEffect(() => {
    // Check system preferences
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    setIsHighContrast(contrastQuery.matches);
    setReducedMotion(motionQuery.matches);

    const handleContrastChange = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);

    contrastQuery.addEventListener('change', handleContrastChange);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      contrastQuery.removeEventListener('change', handleContrastChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    // Apply high contrast class to body
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  useEffect(() => {
    // Apply reduced motion class to body
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  const setHighContrast = (enabled: boolean) => {
    setIsHighContrast(enabled);
    announce(enabled ? 'Alto contraste ativado' : 'Alto contraste desativado');
  };

  const setReducedMotionState = (enabled: boolean) => {
    setReducedMotion(enabled);
    announce(enabled ? 'Movimento reduzido ativado' : 'Movimento reduzido desativado');
  };

  return (
    <AccessibilityContext.Provider
      value={{
        isHighContrast,
        reducedMotion,
        announceToScreenReader: announce,
        setHighContrast,
        setReducedMotion: setReducedMotionState,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
