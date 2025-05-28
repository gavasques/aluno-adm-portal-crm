
import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "shimmer" | "pulse" | "wave"
  lines?: number
  avatar?: boolean
  card?: boolean
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "shimmer", lines = 1, avatar = false, card = false, ...props }, ref) => {
    const baseClasses = "bg-slate-200 dark:bg-slate-700 rounded-lg"
    
    const variantClasses = {
      default: "animate-pulse",
      shimmer: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
      pulse: "animate-pulse",
      wave: "animate-[wave_1.5s_ease-in-out_infinite]"
    }

    if (card) {
      return (
        <motion.div
          ref={ref}
          className={cn("space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700", className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          {...props}
        >
          {/* Header */}
          <div className="flex items-center space-x-3">
            {avatar && (
              <div className={cn(baseClasses, variantClasses[variant], "w-10 h-10 rounded-full")} />
            )}
            <div className="space-y-2 flex-1">
              <div className={cn(baseClasses, variantClasses[variant], "h-4 w-3/4")} />
              <div className={cn(baseClasses, variantClasses[variant], "h-3 w-1/2")} />
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  baseClasses,
                  variantClasses[variant],
                  "h-3",
                  i === lines - 1 ? "w-2/3" : "w-full"
                )}
              />
            ))}
          </div>
          
          {/* Footer */}
          <div className="flex justify-between items-center pt-2">
            <div className={cn(baseClasses, variantClasses[variant], "h-8 w-20 rounded-full")} />
            <div className={cn(baseClasses, variantClasses[variant], "h-8 w-16 rounded-full")} />
          </div>
        </motion.div>
      )
    }

    if (avatar) {
      return (
        <div className={cn("flex items-center space-x-3", className)} {...props}>
          <div className={cn(baseClasses, variantClasses[variant], "w-10 h-10 rounded-full")} />
          <div className="space-y-2 flex-1">
            <div className={cn(baseClasses, variantClasses[variant], "h-4 w-3/4")} />
            <div className={cn(baseClasses, variantClasses[variant], "h-3 w-1/2")} />
          </div>
        </div>
      )
    }

    return (
      <div className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? ref : undefined}
            className={cn(
              baseClasses,
              variantClasses[variant],
              "h-4",
              i === lines - 1 ? "w-4/5" : "w-full"
            )}
          />
        ))}
      </div>
    )
  }
)
Skeleton.displayName = "Skeleton"

// Specialized skeleton components
const SkeletonCard = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, 'card'>>(
  (props, ref) => <Skeleton ref={ref} card {...props} />
)
SkeletonCard.displayName = "SkeletonCard"

const SkeletonAvatar = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, 'avatar'>>(
  (props, ref) => <Skeleton ref={ref} avatar {...props} />
)
SkeletonAvatar.displayName = "SkeletonAvatar"

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ lines = 3, ...props }, ref) => <Skeleton ref={ref} lines={lines} {...props} />
)
SkeletonText.displayName = "SkeletonText"

export { Skeleton, SkeletonCard, SkeletonAvatar, SkeletonText }
