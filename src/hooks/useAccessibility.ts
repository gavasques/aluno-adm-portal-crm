
import { useEffect, useRef, useState } from 'react';

export const useFocusManagement = () => {
  const focusRef = useRef<HTMLElement | null>(null);

  const setFocus = (element?: HTMLElement | null) => {
    if (element) {
      focusRef.current = element;
      element.focus();
    }
  };

  const restoreFocus = () => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  };

  return { setFocus, restoreFocus };
};

export const useKeyboardNavigation = (onEscape?: () => void, onEnter?: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        case 'Enter':
          if (onEnter && event.target instanceof HTMLButtonElement) {
            event.preventDefault();
            onEnter();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter]);
};

export const useScreenReaderAnnouncement = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
};

export const useColorContrast = () => {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: more)');
    setHighContrast(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setHighContrast(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return { highContrast };
};
