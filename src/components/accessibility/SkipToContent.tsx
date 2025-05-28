
import React from 'react';
import { cn } from '@/lib/utils';

interface SkipToContentProps {
  targetId?: string;
  className?: string;
}

export const SkipToContent: React.FC<SkipToContentProps> = ({
  targetId = 'main-content',
  className
}) => {
  const handleSkip = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleSkip}
      className={cn(
        'sr-only focus:not-sr-only fixed top-4 left-4 z-50',
        'bg-blue-600 text-white px-4 py-2 rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'font-medium transition-all duration-200',
        className
      )}
    >
      Pular para o conteúdo principal
    </button>
  );
};

export const FocusTrap: React.FC<{ children: React.ReactNode; active: boolean }> = ({
  children,
  active
}) => {
  const trapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!active || !trapRef.current) return;

    const focusableElements = trapRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);

  return (
    <div ref={trapRef}>
      {children}
    </div>
  );
};
