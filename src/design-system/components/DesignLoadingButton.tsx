
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { DesignButton, ButtonVariant, ButtonSize } from './DesignButton';
import { cn } from '@/lib/utils';

interface DesignLoadingButtonProps {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export const DesignLoadingButton: React.FC<DesignLoadingButtonProps> = ({
  loading = false,
  loadingText = "Processando...",
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false
}) => {
  const [internalLoading, setInternalLoading] = React.useState(false);
  const isLoading = loading || internalLoading;

  const handleClick = async () => {
    if (!onClick || isLoading || disabled) return;

    try {
      setInternalLoading(true);
      await onClick();
    } catch (error) {
      console.error('Button action failed:', error);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <DesignButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      className={cn(
        "relative overflow-hidden",
        isLoading && "cursor-not-allowed",
        className
      )}
      onClick={handleClick}
      type={type}
    >
      {/* Loading Overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-inherit"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: isLoading ? 'auto' : 'none' }}
      >
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">{loadingText}</span>
        </div>
      </motion.div>

      {/* Button Content */}
      <motion.div
        className="flex items-center justify-center gap-2"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>

      {/* Progress Indicator */}
      {isLoading && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-white/30"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 2, 
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}
    </DesignButton>
  );
};
