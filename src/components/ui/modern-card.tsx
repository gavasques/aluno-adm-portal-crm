
import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "neumorphism" | "modern" | "gradient"
  hover?: boolean
  interactive?: boolean
  glow?: boolean
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, variant = "modern", hover = true, interactive = false, glow = false, children, ...props }, ref) => {
    const baseClasses = "rounded-2xl border transition-all duration-300"
    
    const variantClasses = {
      glass: "glass-card border-white/20 bg-white/10 backdrop-blur-md",
      neumorphism: "neumorphism border-slate-200 dark:neumorphism-dark dark:border-slate-700",
      modern: "modern-card",
      gradient: "bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700 shadow-modern-2"
    }
    
    const hoverClasses = hover ? {
      glass: "hover:bg-white/15 hover:border-white/30",
      neumorphism: "hover:shadow-neumorphism-inset",
      modern: "hover:shadow-modern-3 hover:-translate-y-1",
      gradient: "hover:shadow-modern-3 hover:from-slate-50 hover:to-white dark:hover:from-slate-700 dark:hover:to-slate-800"
    } : {}
    
    const interactiveClasses = interactive ? "cursor-pointer active:scale-[0.98]" : ""
    const glowClasses = glow ? "shadow-glow-blue" : ""

    const cardClasses = cn(
      baseClasses,
      variantClasses[variant],
      hoverClasses[variant],
      interactiveClasses,
      glowClasses,
      className
    )

    if (interactive) {
      return (
        <motion.div
          ref={ref}
          className={cardClasses}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          {...props}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div
        ref={ref}
        className={cardClasses}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ModernCard.displayName = "ModernCard"

const ModernCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-3", className)}
    {...props}
  />
))
ModernCardHeader.displayName = "ModernCardHeader"

const ModernCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight font-display",
      className
    )}
    {...props}
  />
))
ModernCardTitle.displayName = "ModernCardTitle"

const ModernCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
ModernCardDescription.displayName = "ModernCardDescription"

const ModernCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-3", className)} {...props} />
))
ModernCardContent.displayName = "ModernCardContent"

const ModernCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
ModernCardFooter.displayName = "ModernCardFooter"

export { 
  ModernCard, 
  ModernCardHeader, 
  ModernCardFooter, 
  ModernCardTitle, 
  ModernCardDescription, 
  ModernCardContent 
}
