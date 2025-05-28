
import React from 'react';
import { cn } from '@/lib/utils';

interface TouchTargetProps {
  children: React.ReactNode;
  className?: string;
  minSize?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

// WCAG 2.2 compliant touch target sizes
const touchSizes = {
  sm: 'min-h-[44px] min-w-[44px]', // 44px minimum
  md: 'min-h-[48px] min-w-[48px]', // Comfortable
  lg: 'min-h-[56px] min-w-[56px]', // Large
};

export const TouchTarget: React.FC<TouchTargetProps> = ({
  children,
  className,
  minSize = 'sm',
  asChild = false
}) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    'transition-all duration-200',
    touchSizes[minSize],
    className
  );

  if (asChild) {
    return React.cloneElement(
      children as React.ReactElement,
      {
        className: cn((children as React.ReactElement).props.className, baseClasses)
      }
    );
  }

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

// Hook para validar touch targets
export const useTouchTargetValidation = () => {
  const validateTouchTarget = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return rect.width >= 44 && rect.height >= 44;
  };

  const validateAllTouchTargets = (): void => {
    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    interactiveElements.forEach((element) => {
      if (!validateTouchTarget(element as HTMLElement)) {
        console.warn('Touch target too small:', element);
      }
    });
  };

  return { validateTouchTarget, validateAllTouchTargets };
};
