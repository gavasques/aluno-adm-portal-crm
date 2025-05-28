
import React from 'react'
import { cn } from '@/lib/utils'

interface SafeAreaProps {
  children: React.ReactNode
  className?: string
  top?: boolean
  bottom?: boolean
  left?: boolean
  right?: boolean
  inset?: boolean
}

export const SafeArea: React.FC<SafeAreaProps> = ({
  children,
  className,
  top = true,
  bottom = true,
  left = true,
  right = true,
  inset = false
}) => {
  const safeAreaClasses = cn(
    // Safe area insets
    top && (inset ? 'pt-[env(safe-area-inset-top)]' : 'mt-[env(safe-area-inset-top)]'),
    bottom && (inset ? 'pb-[env(safe-area-inset-bottom)]' : 'mb-[env(safe-area-inset-bottom)]'),
    left && (inset ? 'pl-[env(safe-area-inset-left)]' : 'ml-[env(safe-area-inset-left)]'),
    right && (inset ? 'pr-[env(safe-area-inset-right)]' : 'mr-[env(safe-area-inset-right)]'),
    
    // Fallbacks para dispositivos sem safe areas
    'supports-[padding:max(0px)]:pt-[max(env(safe-area-inset-top),0px)]',
    'supports-[padding:max(0px)]:pb-[max(env(safe-area-inset-bottom),0px)]',
    'supports-[padding:max(0px)]:pl-[max(env(safe-area-inset-left),0px)]',
    'supports-[padding:max(0px)]:pr-[max(env(safe-area-inset-right),0px)]',
    
    className
  )

  return (
    <div className={safeAreaClasses}>
      {children}
    </div>
  )
}

// Componente específico para header com safe area
export const SafeHeader: React.FC<SafeAreaProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <SafeArea
      {...props}
      bottom={false}
      className={cn(
        'sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b',
        'min-h-[calc(3.5rem+env(safe-area-inset-top))]',
        'flex items-center',
        className
      )}
    >
      {children}
    </SafeArea>
  )
}

// Componente específico para footer com safe area
export const SafeFooter: React.FC<SafeAreaProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <SafeArea
      {...props}
      top={false}
      className={cn(
        'sticky bottom-0 z-50 bg-background/80 backdrop-blur-md border-t',
        'min-h-[calc(3.5rem+env(safe-area-inset-bottom))]',
        'flex items-center',
        className
      )}
    >
      {children}
    </SafeArea>
  )
}
