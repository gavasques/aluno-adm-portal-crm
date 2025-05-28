
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, AlertCircle, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ModernInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  success?: string
  warning?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "glass" | "neumorphism"
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
  showPasswordToggle?: boolean
}

const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(
  ({
    className,
    type = "text",
    label,
    error,
    success,
    warning,
    size = "md",
    variant = "default",
    leftIcon,
    rightIcon,
    loading = false,
    showPasswordToggle = false,
    disabled,
    ...props
  }, ref) => {
    const [focused, setFocused] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue)
    const inputId = React.useId()

    const inputType = showPasswordToggle && showPassword ? "text" : type

    const sizeClasses = {
      sm: "h-10 px-3 text-sm",
      md: "h-12 px-4 text-base",
      lg: "h-14 px-5 text-lg"
    }

    const variantClasses = {
      default: "bg-background border-input",
      glass: "glass border-white/20 bg-white/10",
      neumorphism: "neumorphism border-slate-200 dark:border-slate-700"
    }

    const statusColor = error 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
      : success 
      ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
      : warning
      ? "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20"
      : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"

    const labelAnimation = {
      top: focused || hasValue ? "0.5rem" : "50%",
      scale: focused || hasValue ? 0.85 : 1,
      color: focused 
        ? error ? "#ef4444" : success ? "#22c55e" : warning ? "#eab308" : "#3b82f6"
        : "#64748b"
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value)
      props.onChange?.(e)
    }

    const StatusIcon = error ? AlertCircle : success ? Check : null

    return (
      <div className="relative w-full">
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              "peer w-full rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4",
              sizeClasses[size],
              variantClasses[variant],
              statusColor,
              leftIcon && "pl-10",
              (rightIcon || showPasswordToggle || StatusIcon) && "pr-10",
              loading && "opacity-50 cursor-not-allowed",
              disabled && "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800",
              className
            )}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={handleInputChange}
            disabled={disabled || loading}
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <motion.label
              htmlFor={inputId}
              className="absolute left-4 pointer-events-none font-medium transition-all duration-200 origin-left"
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
                  error && "text-red-500",
                  success && "text-green-500",
                  warning && "text-yellow-500"
                )} />
              </motion.div>
            )}
            
            {showPasswordToggle && type === "password" && (
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
          {(error || success || warning) && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 px-1"
            >
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {error}
                </p>
              )}
              {success && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {success}
                </p>
              )}
              {warning && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {warning}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)
ModernInput.displayName = "ModernInput"

export { ModernInput }
