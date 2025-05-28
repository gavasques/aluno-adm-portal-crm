
import { useEffect, useRef, useState, useCallback } from 'react';

export const useFocusManagement = () => {
  const focusRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const setFocus = useCallback((element?: HTMLElement | null) => {
    // Store previous focus
    if (document.activeElement && document.activeElement !== document.body) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
    
    if (element) {
      focusRef.current = element;
      element.focus();
    }
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    } else if (focusRef.current) {
      focusRef.current.focus();
    }
  }, []);

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
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }, []);

  return { announce };
};

export const useColorContrast = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    setHighContrast(contrastQuery.matches);
    setReducedMotion(motionQuery.matches);

    const handleContrastChange = (event: MediaQueryListEvent) => {
      setHighContrast(event.matches);
    };
    
    const handleMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    contrastQuery.addEventListener('change', handleContrastChange);
    motionQuery.addEventListener('change', handleMotionChange);
    
    return () => {
      contrastQuery.removeEventListener('change', handleContrastChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return { highContrast, reducedMotion };
};

// Keyboard shortcuts hook
export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const modifiers = {
        ctrl: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
        meta: event.metaKey
      };

      // Build shortcut string (e.g., "ctrl+s", "alt+shift+n")
      let shortcut = '';
      if (modifiers.ctrl) shortcut += 'ctrl+';
      if (modifiers.alt) shortcut += 'alt+';
      if (modifiers.shift) shortcut += 'shift+';
      if (modifiers.meta) shortcut += 'meta+';
      shortcut += key;

      if (shortcuts[shortcut]) {
        event.preventDefault();
        shortcuts[shortcut]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// ARIA live region hook
export const useAriaLiveRegion = () => {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'aria-live-region';
    
    document.body.appendChild(liveRegion);
    liveRegionRef.current = liveRegion;

    return () => {
      if (document.body.contains(liveRegion)) {
        document.body.removeChild(liveRegion);
      }
    };
  }, []);

  const announce = useCallback((message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
    }
  }, []);

  return { announce };
};
