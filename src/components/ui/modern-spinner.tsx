
import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ModernSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "dots" | "pulse" | "orbit" | "gradient"
  className?: string
}

const ModernSpinner = React.forwardRef<HTMLDivElement, ModernSpinnerProps>(
  ({ size = "md", variant = "default", className, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12",
      xl: "w-16 h-16"
    }

    const sizePx = {
      sm: 16,
      md: 32,
      lg: 48,
      xl: 64
    }

    if (variant === "dots") {
      return (
        <div ref={ref} className={cn("flex space-x-1", className)} {...props}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                "rounded-full bg-blue-500",
                size === "sm" ? "w-2 h-2" : 
                size === "md" ? "w-3 h-3" :
                size === "lg" ? "w-4 h-4" : "w-5 h-5"
              )}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      )
    }

    if (variant === "pulse") {
      return (
        <motion.div
          ref={ref}
          className={cn(
            "rounded-full bg-blue-500/20 border-2 border-blue-500",
            sizeClasses[size],
            className
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          {...props}
        />
      )
    }

    if (variant === "orbit") {
      return (
        <div
          ref={ref}
          className={cn("relative", sizeClasses[size], className)}
          {...props}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                linear: true,
                delay: i * 0.2
              }}
              style={{
                transform: `scale(${1 - i * 0.2})`,
                opacity: 1 - i * 0.3
              }}
            />
          ))}
        </div>
      )
    }

    if (variant === "gradient") {
      return (
        <motion.div
          ref={ref}
          className={cn(
            "rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500",
            sizeClasses[size],
            className
          )}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            background: `conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)`
          }}
          {...props}
        >
          <div className="absolute inset-1 bg-background rounded-full" />
        </motion.div>
      )
    }

    // Default spinner
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-blue-500",
          sizeClasses[size],
          className
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        {...props}
      />
    )
  }
)
ModernSpinner.displayName = "ModernSpinner"

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  spinnerVariant?: ModernSpinnerProps["variant"]
  spinnerSize?: ModernSpinnerProps["size"]
  message?: string
  className?: string
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({
    isLoading,
    children,
    spinnerVariant = "default",
    spinnerSize = "lg",
    message = "Carregando...",
    className,
    ...props
  }, ref) => {
    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {children}
        
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-center space-y-4">
              <ModernSpinner variant={spinnerVariant} size={spinnerSize} />
              {message && (
                <motion.p
                  className="text-sm text-slate-600 dark:text-slate-400 font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {message}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    )
  }
)
LoadingOverlay.displayName = "LoadingOverlay"

export { ModernSpinner, LoadingOverlay }
