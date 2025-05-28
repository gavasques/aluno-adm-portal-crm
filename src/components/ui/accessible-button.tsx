
import React from 'react';
import { Button } from '@/components/ui/button';
import { TouchTarget } from '@/components/accessibility/TouchTarget';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  touchSize?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  variant = 'default',
  size = 'default',
  touchSize = 'sm',
  loading = false,
  loadingText = 'Carregando...',
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <TouchTarget minSize={touchSize} asChild>
      <Button
        variant={variant}
        size={size}
        disabled={disabled || loading}
        className={cn(
          // Enhanced focus styles
          'focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          'focus:outline-none',
          // High contrast support
          'border-2 border-transparent',
          'high-contrast:border-current',
          // Loading state
          loading && 'cursor-not-allowed opacity-75',
          className
        )}
        aria-busy={loading}
        aria-label={loading ? loadingText : undefined}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        <span className={loading ? 'sr-only' : undefined}>
          {children}
        </span>
        {loading && <span aria-hidden="true">{loadingText}</span>}
      </Button>
    </TouchTarget>
  );
};

// Icon button with proper accessibility
export const AccessibleIconButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}> = ({
  icon,
  label,
  onClick,
  className,
  variant = 'ghost',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <AccessibleButton
      variant={variant}
      size="icon"
      onClick={onClick}
      className={cn(sizeClasses[size], className)}
      aria-label={label}
      title={label}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </AccessibleButton>
  );
};
