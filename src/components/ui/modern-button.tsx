
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const modernButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-modern-2 hover:shadow-modern-3",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-modern-2 hover:shadow-modern-3",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-modern-1 hover:shadow-modern-2",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-modern-1 hover:shadow-modern-2",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "glass text-slate-700 dark:text-slate-200 hover:bg-white/20 border-white/20",
        gradient: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-modern-2 hover:shadow-modern-3",
        neumorphism: "neumorphism text-slate-700 dark:text-slate-200 hover:neumorphism-inset border-slate-200 dark:border-slate-700",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8",
        icon: "h-11 w-11",
      },
      animation: {
        none: "",
        scale: "hover:scale-105 active:scale-95",
        lift: "hover:-translate-y-1",
        glow: "hover:shadow-glow-blue",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "scale",
    },
  }
)

export interface ModernButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof modernButtonVariants> {
  asChild?: boolean
  loading?: boolean
  ripple?: boolean
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, variant, size, animation, asChild = false, loading = false, ripple = true, children, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([])
    const Comp = asChild ? Slot : "button"

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !asChild) {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const id = Date.now()
        
        setRipples(prev => [...prev, { x, y, id }])
        
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== id))
        }, 600)
      }
      
      props.onClick?.(event)
    }

    if (animation === "none") {
      return (
        <Comp
          className={cn(modernButtonVariants({ variant, size, animation, className }))}
          ref={ref}
          disabled={loading}
          onClick={handleClick}
          {...props}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="spinner" />
            </div>
          )}
          <span className={loading ? "opacity-0" : ""}>{children}</span>
          
          {/* Ripple effect */}
          {ripples.map(ripple => (
            <span
              key={ripple.id}
              className="absolute rounded-full bg-white/30 animate-ping"
              style={{
                left: ripple.x - 10,
                top: ripple.y - 10,
                width: 20,
                height: 20,
              }}
            />
          ))}
        </Comp>
      )
    }

    return (
      <motion.div
        whileHover={animation === "scale" ? { scale: 1.05 } : animation === "lift" ? { y: -4 } : {}}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Comp
          className={cn(modernButtonVariants({ variant, size, animation: "none", className }))}
          ref={ref}
          disabled={loading}
          onClick={handleClick}
          {...props}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="spinner" />
            </div>
          )}
          <span className={loading ? "opacity-0" : ""}>{children}</span>
          
          {/* Ripple effect */}
          {ripples.map(ripple => (
            <span
              key={ripple.id}
              className="absolute rounded-full bg-white/30 animate-ping"
              style={{
                left: ripple.x - 10,
                top: ripple.y - 10,
                width: 20,
                height: 20,
              }}
            />
          ))}
        </Comp>
      </motion.div>
    )
  }
)
ModernButton.displayName = "ModernButton"

export { ModernButton, modernButtonVariants }
