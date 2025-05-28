
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { designTokens } from '../tokens';

export type CardVariant = 'glass' | 'neumorphism' | 'modern' | 'gradient';
export type CardSize = 'sm' | 'md' | 'lg' | 'xl';

interface DesignCardProps extends Omit<HTMLMotionProps<'div'>, 'style'> {
  variant?: CardVariant;
  size?: CardSize;
  hover?: boolean;
  interactive?: boolean;
  glow?: boolean;
  gradient?: keyof typeof designTokens.gradients;
  children: React.ReactNode;
}

const sizeClasses = {
  sm: 'p-4 rounded-xl',
  md: 'p-6 rounded-2xl',
  lg: 'p-8 rounded-3xl',
  xl: 'p-10 rounded-3xl'
};

const variantClasses = {
  glass: 'bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10',
  neumorphism: 'bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50',
  modern: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg',
  gradient: 'border border-white/20 dark:border-white/10'
};

const hoverEffects = {
  glass: 'hover:bg-white/15 dark:hover:bg-black/15 hover:border-white/30 dark:hover:border-white/20',
  neumorphism: 'hover:shadow-[inset_5px_5px_20px_rgba(0,0,0,0.1),inset_-5px_-5px_20px_rgba(255,255,255,0.8)] dark:hover:shadow-[inset_5px_5px_20px_rgba(0,0,0,0.3),inset_-5px_-5px_20px_rgba(255,255,255,0.1)]',
  modern: 'hover:shadow-xl hover:-translate-y-1',
  gradient: 'hover:shadow-2xl hover:scale-[1.02]'
};

export const DesignCard: React.FC<DesignCardProps> = ({
  variant = 'glass',
  size = 'md',
  hover = true,
  interactive = false,
  glow = false,
  gradient,
  children,
  className,
  ...props
}) => {
  const baseClasses = cn(
    'transition-all duration-300 ease-out',
    sizeClasses[size],
    variantClasses[variant],
    hover && hoverEffects[variant],
    interactive && 'cursor-pointer active:scale-[0.98]',
    glow && 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    className
  );

  const gradientStyle = gradient 
    ? { background: designTokens.gradients[gradient] }
    : undefined;

  if (interactive) {
    return (
      <motion.div
        className={baseClasses}
        style={gradientStyle}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      style={gradientStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Card Header Component
export const DesignCardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-1.5 pb-4", className)}>
    {children}
  </div>
);

// Card Title Component
export const DesignCardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <h3 className={cn(
    "text-2xl font-semibold leading-none tracking-tight font-display bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent",
    className
  )}>
    {children}
  </h3>
);

// Card Description Component
export const DesignCardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <p className={cn("text-sm text-slate-600 dark:text-slate-400", className)}>
    {children}
  </p>
);

// Card Content Component
export const DesignCardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("pt-0", className)}>
    {children}
  </div>
);

// Card Footer Component
export const DesignCardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("flex items-center pt-4", className)}>
    {children}
  </div>
);
