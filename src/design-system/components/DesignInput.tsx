
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type InputVariant = 'default' | 'glass' | 'neumorphism';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputStatus = 'default' | 'success' | 'warning' | 'error';

interface DesignInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  status?: InputStatus;
  label?: string;
  floatingLabel?: boolean;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  loading?: boolean;
}

const sizeClasses = {
  sm: 'h-10 px-3 text-sm',
  md: 'h-12 px-4 text-base',
  lg: 'h-14 px-5 text-lg'
};

const variantClasses = {
  default: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
  glass: 'bg-white/10 dark:bg-black/10 backdrop-blur-xl border-white/20 dark:border-white/10',
  neumorphism: 'bg-slate-100 dark:bg-slate-800 border-slate-200/50 dark:border-slate-700/50 shadow-[inset_2px_2px_10px_rgba(0,0,0,0.1),inset_-2px_-2px_10px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_10px_rgba(0,0,0,0.3),inset_-2px_-2px_10px_rgba(255,255,255,0.1)]'
};

const statusClasses = {
  default: 'focus:border-blue-500 focus:ring-blue-500/20',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
  warning: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
};

export const DesignInput: React.FC<DesignInputProps> = ({
  variant = 'default',
  size = 'md',
  status = 'default',
  label,
  floatingLabel = false,
  helperText,
  errorMessage,
  successMessage,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  loading = false,
  type = 'text',
  className,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const inputType = showPasswordToggle && showPassword ? 'text' : type;
  const inputId = React.useId();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  const StatusIcon = status === 'success' ? Check : status === 'error' ? AlertCircle : null;
  const statusMessage = errorMessage || successMessage || helperText;

  const inputClasses = cn(
    'w-full rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4',
    sizeClasses[size],
    variantClasses[variant],
    statusClasses[status],
    leftIcon && 'pl-10',
    (rightIcon || showPasswordToggle || StatusIcon || loading) && 'pr-10',
    props.disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  const labelAnimation = floatingLabel ? {
    top: focused || hasValue ? '0.5rem' : '50%',
    scale: focused || hasValue ? 0.85 : 1,
    color: focused 
      ? status === 'error' ? '#ef4444' : status === 'success' ? '#22c55e' : '#3b82f6'
      : '#64748b'
  } : undefined;

  return (
    <div className="w-full space-y-2">
      {/* Static Label */}
      {label && !floatingLabel && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          id={inputId}
          type={inputType}
          className={inputClasses}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleInputChange}
          {...props}
        />

        {/* Floating Label */}
        {label && floatingLabel && (
          <motion.label
            htmlFor={inputId}
            className="absolute left-4 pointer-events-none font-medium transition-all duration-200 origin-left bg-white dark:bg-slate-800 px-1"
            style={{ transform: "translateY(-50%)" }}
            animate={labelAnimation}
            initial={false}
          >
            {label}
          </motion.label>
        )}

        {/* Right Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
          
          {StatusIcon && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <StatusIcon className={cn(
                "w-4 h-4",
                status === 'error' && "text-red-500",
                status === 'success' && "text-green-500"
              )} />
            </motion.div>
          )}
          
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          
          {rightIcon && !StatusIcon && !loading && (
            <div className="text-slate-500">
              {rightIcon}
            </div>
          )}
        </div>
      </div>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-1"
          >
            <p className={cn(
              "text-sm flex items-center gap-1",
              status === 'error' && "text-red-600 dark:text-red-400",
              status === 'success' && "text-green-600 dark:text-green-400",
              status === 'warning' && "text-yellow-600 dark:text-yellow-400",
              status === 'default' && "text-slate-500 dark:text-slate-400"
            )}>
              {StatusIcon && <StatusIcon className="w-3 h-3" />}
              {statusMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
