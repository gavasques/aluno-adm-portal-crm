
import React from 'react'
import { cn } from '@/lib/utils'

interface SafeAreaProps {
  children: React.ReactNode
  className?: string
  top?: boolean
  bottom?: boolean
  left?: boolean
  right?: boolean
}

export const SafeArea: React.FC<SafeAreaProps> = ({
  children,
  className,
  top = true,
  bottom = true,
  left = true,
  right = true
}) => {
  return (
    <div
      className={cn(
        'w-full h-full',
        top && 'pt-safe-top',
        bottom && 'pb-safe-bottom',
        left && 'pl-safe-left',
        right && 'pr-safe-right',
        className
      )}
      style={{
        paddingTop: top ? 'env(safe-area-inset-top)' : undefined,
        paddingBottom: bottom ? 'env(safe-area-inset-bottom)' : undefined,
        paddingLeft: left ? 'env(safe-area-inset-left)' : undefined,
        paddingRight: right ? 'env(safe-area-inset-right)' : undefined,
      }}
    >
      {children}
    </div>
  )
}

export const SafeHeader: React.FC<{
  children: React.ReactNode
  className?: string
  bottom?: boolean
}> = ({ children, className, bottom = true }) => {
  return (
    <header
      className={cn(
        'w-full',
        'pt-safe-top',
        bottom && 'pb-safe-bottom',
        className
      )}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: bottom ? 'env(safe-area-inset-bottom)' : undefined,
      }}
    >
      {children}
    </header>
  )
}

export const SafeFooter: React.FC<{
  children: React.ReactNode
  className?: string
  top?: boolean
}> = ({ children, className, top = true }) => {
  return (
    <footer
      className={cn(
        'w-full',
        'pb-safe-bottom',
        top && 'pt-safe-top',
        className
      )}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingTop: top ? 'env(safe-area-inset-top)' : undefined,
      }}
    >
      {children}
    </footer>
  )
}
