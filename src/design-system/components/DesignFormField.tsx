
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FormFieldStatus = 'default' | 'success' | 'warning' | 'error' | 'info';

interface DesignFormFieldProps {
  children: React.ReactNode;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  status?: FormFieldStatus;
  required?: boolean;
  className?: string;
}

const statusIcons = {
  success: Check,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
  default: null
};

const statusColors = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  info: 'text-blue-600 dark:text-blue-400',
  default: 'text-slate-500 dark:text-slate-400'
};

export const DesignFormField: React.FC<DesignFormFieldProps> = ({
  children,
  label,
  helperText,
  errorMessage,
  successMessage,
  status = 'default',
  required = false,
  className
}) => {
  const StatusIcon = statusIcons[status];
  const statusMessage = errorMessage || successMessage || helperText;
  
  // Determine actual status based on messages
  const actualStatus = errorMessage ? 'error' : successMessage ? 'success' : status;

  return (
    <motion.div 
      className={cn("space-y-2", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {children}
      </div>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className={cn(
              "flex items-start gap-2 text-sm px-1",
              statusColors[actualStatus]
            )}>
              {StatusIcon && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="flex-shrink-0 mt-0.5"
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                </motion.div>
              )}
              <span className="leading-relaxed">{statusMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
