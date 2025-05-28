
import React, { useEffect, useRef, useCallback } from 'react';
import { useKeyboardNavigation, useFocusManagement } from '@/hooks/useAccessibility';

interface KeyboardNavigationProps {
  children: React.ReactNode;
  onEscape?: () => void;
  onEnter?: () => void;
  trapFocus?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
}

export const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({
  children,
  onEscape,
  onEnter,
  trapFocus = false,
  autoFocus = false,
  restoreFocus = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setFocus, restoreFocus: restorePreviousFocus } = useFocusManagement();

  useKeyboardNavigation(onEscape, onEnter);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Auto focus first element
    if (autoFocus && firstElement) {
      setFocus(firstElement);
    }

    // Focus trap implementation
    const handleTabKey = (event: KeyboardEvent) => {
      if (!trapFocus || event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    if (trapFocus) {
      document.addEventListener('keydown', handleTabKey);
    }

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      if (restoreFocus) {
        restorePreviousFocus();
      }
    };
  }, [trapFocus, autoFocus, restoreFocus, setFocus, restorePreviousFocus]);

  return (
    <div ref={containerRef} className="focus-within:outline-none">
      {children}
    </div>
  );
};

// Skip to content enhanced
export const EnhancedSkipToContent: React.FC = () => {
  const skipLinks = [
    { href: '#main-content', label: 'Pular para conteúdo principal' },
    { href: '#navigation', label: 'Pular para navegação' },
    { href: '#sidebar', label: 'Pular para menu lateral' },
    { href: '#footer', label: 'Pular para rodapé' },
  ];

  return (
    <div className="sr-only focus-within:not-sr-only fixed top-0 left-0 z-50 bg-white border border-gray-300 rounded-b-md shadow-lg">
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="block px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:bg-blue-100 focus:outline-none"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};
