
import * as React from "react"
import { toast as sonnerToast } from "sonner"

interface ModernToastOptions {
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning" | "info"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useModernToast() {
  const toast = React.useCallback((options: ModernToastOptions) => {
    const { title, description, variant = "default", duration = 5000, action } = options

    const toastOptions = {
      duration,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined
    }

    switch (variant) {
      case "success":
        return sonnerToast.success(title, {
          description,
          ...toastOptions
        })
      case "error":
        return sonnerToast.error(title, {
          description,
          ...toastOptions
        })
      case "warning":
        return sonnerToast.warning(title, {
          description,
          ...toastOptions
        })
      case "info":
        return sonnerToast.info(title, {
          description,
          ...toastOptions
        })
      default:
        return sonnerToast(title, {
          description,
          ...toastOptions
        })
    }
  }, [])

  const success = React.useCallback((title: string, description?: string, options?: Omit<ModernToastOptions, 'title' | 'description' | 'variant'>) => {
    return toast({ title, description, variant: "success", ...options })
  }, [toast])

  const error = React.useCallback((title: string, description?: string, options?: Omit<ModernToastOptions, 'title' | 'description' | 'variant'>) => {
    return toast({ title, description, variant: "error", ...options })
  }, [toast])

  const warning = React.useCallback((title: string, description?: string, options?: Omit<ModernToastOptions, 'title' | 'description' | 'variant'>) => {
    return toast({ title, description, variant: "warning", ...options })
  }, [toast])

  const info = React.useCallback((title: string, description?: string, options?: Omit<ModernToastOptions, 'title' | 'description' | 'variant'>) => {
    return toast({ title, description, variant: "info", ...options })
  }, [toast])

  return {
    toast,
    success,
    error,
    warning,
    info
  }
}
