
import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ModernProgressProps {
  value?: number
  max?: number
  size?: "sm" | "md" | "lg"
  variant?: "default" | "gradient" | "glass" | "success" | "warning" | "error"
  showValue?: boolean
  animated?: boolean
  className?: string
}

const ModernProgress = React.forwardRef<HTMLDivElement, ModernProgressProps>(
  ({
    value = 0,
    max = 100,
    size = "md",
    variant = "default",
    showValue = false,
    animated = true,
    className,
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizeClasses = {
      sm: "h-2",
      md: "h-3",
      lg: "h-4"
    }

    const variantClasses = {
      default: "bg-blue-500",
      gradient: "bg-gradient-to-r from-blue-500 to-purple-600",
      glass: "bg-white/30 backdrop-blur-sm",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500"
    }

    const trackClasses = {
      default: "bg-slate-200 dark:bg-slate-700",
      gradient: "bg-slate-200 dark:bg-slate-700",
      glass: "bg-white/10 backdrop-blur-sm border border-white/20",
      success: "bg-green-100 dark:bg-green-900/20",
      warning: "bg-yellow-100 dark:bg-yellow-900/20",
      error: "bg-red-100 dark:bg-red-900/20"
    }

    return (
      <div className={cn("w-full space-y-2", className)} {...props}>
        {showValue && (
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">{percentage.toFixed(1)}%</span>
            <span className="text-slate-500 dark:text-slate-400">{value}/{max}</span>
          </div>
        )}
        
        <div
          ref={ref}
          className={cn(
            "relative w-full rounded-full overflow-hidden",
            sizeClasses[size],
            trackClasses[variant]
          )}
        >
          <motion.div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              variantClasses[variant],
              animated && "shadow-lg"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{
              duration: animated ? 1 : 0,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
          />
          
          {/* Shimmer effect for animated variant */}
          {animated && percentage > 0 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>
      </div>
    )
  }
)
ModernProgress.displayName = "ModernProgress"

// Circular Progress Component
interface CircularProgressProps {
  value?: number
  max?: number
  size?: number
  strokeWidth?: number
  variant?: "default" | "gradient" | "success" | "warning" | "error"
  showValue?: boolean
  className?: string
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({
    value = 0,
    max = 100,
    size = 120,
    strokeWidth = 8,
    variant = "default",
    showValue = false,
    className,
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    const colors = {
      default: "#3b82f6",
      gradient: "url(#gradient)",
      success: "#22c55e",
      warning: "#eab308",
      error: "#ef4444"
    }

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="none"
            className="text-slate-200 dark:text-slate-700"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={colors[variant]}
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: 1,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
          />
        </svg>
        
        {/* Center content */}
        {showValue && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(percentage)}%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{value}/{max}</div>
            </div>
          </motion.div>
        )}
      </div>
    )
  }
)
CircularProgress.displayName = "CircularProgress"

export { ModernProgress, CircularProgress }
