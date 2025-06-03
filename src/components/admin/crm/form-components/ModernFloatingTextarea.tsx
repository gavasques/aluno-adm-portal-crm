
import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernFloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const ModernFloatingTextarea = forwardRef<HTMLTextAreaElement, ModernFloatingTextareaProps>(
  ({ label, error, className, rows = 3, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    const isFloating = isFocused || hasValue;

    return (
      <div className="relative">
        <div className="relative">
          <textarea
            ref={ref}
            {...props}
            rows={rows}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={cn(
              "w-full px-4 pt-6 pb-2 text-sm transition-all duration-200 resize-none",
              "bg-gray-100",
              "border border-gray-300 rounded-xl",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
              "placeholder-transparent",
              error && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50",
              className
            )}
            placeholder={label}
            style={{ minHeight: `${rows * 1.5 + 3}rem` }}
          />
          
          <motion.label
            animate={{
              top: isFloating ? 8 : 16,
              fontSize: isFloating ? 12 : 14,
              fontWeight: isFloating ? 500 : 400,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute left-4 pointer-events-none transition-colors duration-200",
              isFocused 
                ? "text-blue-600" 
                : error 
                  ? "text-red-600"
                  : "text-slate-600"
            )}
          >
            {label}
          </motion.label>
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-600 mt-1 ml-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

ModernFloatingTextarea.displayName = 'ModernFloatingTextarea';

export default ModernFloatingTextarea;
