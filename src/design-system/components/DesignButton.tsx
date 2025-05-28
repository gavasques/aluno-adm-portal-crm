
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { designTokens } from '../tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'glass' | 'neumorphism' | 'gradient' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface DesignButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  gradient?: keyof typeof designTokens.gradients;
}

const sizeClasses = {
  sm: 'h-9 px-4 text-sm rounded-lg',
  md: 'h-11 px-6 text-base rounded-xl',
  lg: 'h-12 px-8 text-lg rounded-xl',
  xl: 'h-14 px-10 text-xl rounded-2xl'
};

const variantClasses = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700',
  glass: 'bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 text-slate-900 dark:text-white hover:bg-white/20 dark:hover:bg-black/20',
  neumorphism: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200/50 dark:border-slate-700/50 shadow-[5px_5px_20px_rgba(0,0,0,0.1),-5px_-5px_20px_rgba(255,255,255,0.8)] dark:shadow-[5px_5px_20px_rgba(0,0,0,0.3),-5px_-5px_20px_rgba(255,255,255,0.1)] hover:shadow-[inset_2px_2px_10px_rgba(0,0,0,0.1),inset_-2px_-2px_10px_rgba(255,255,255,0.8)] dark:hover:shadow-[inset_2px_2px_10px_rgba(0,0,0,0.3),inset_-2px_-2px_10px_rgba(255,255,255,0.1)]',
  gradient: 'text-white shadow-lg hover:shadow-xl border border-white/20',
  ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white',
  outline: 'border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white'
};

export const DesignButton: React.FC<DesignButtonProps> = ({
  variant = 'primary',
  size = 'md',
  asChild = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  gradient,
  children,
  className,
  style,
  ...props
}) => {
  const Comp = asChild ? Slot : motion.button;
  
  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden',
    sizeClasses[size],
    variantClasses[variant],
    fullWidth && 'w-full',
    className
  );

  const gradientStyle = gradient 
    ? { background: designTokens.gradients[gradient] }
    : {};

  const combinedStyle = { ...gradientStyle, ...style };

  const buttonContent = (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <span className={cn("flex items-center gap-2", loading && "opacity-0")}>
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </span>
    </>
  );

  if (asChild) {
    return (
      <Comp className={baseClasses} style={combinedStyle} {...props}>
        {buttonContent}
      </Comp>
    );
  }

  return (
    <Comp
      className={baseClasses}
      style={combinedStyle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {buttonContent}
    </Comp>
  );
};
