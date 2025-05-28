
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePullToRefresh } from '@/hooks/use-touch-gestures'

interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => void | Promise<void>
  className?: string
  threshold?: number
  disabled?: boolean
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  className,
  threshold = 80,
  disabled = false
}) => {
  const [pullY, setPullY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  
  const { ref, isRefreshing } = usePullToRefresh(async () => {
    if (disabled) return
    await onRefresh()
  })

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || isRefreshing || !isDragging) return
    
    const touch = e.touches[0]
    const scrollTop = (e.currentTarget as HTMLElement).scrollTop
    
    if (scrollTop === 0) {
      const pullDistance = Math.max(0, touch.clientY - (e.currentTarget as HTMLElement).getBoundingClientRect().top)
      setPullY(Math.min(pullDistance * 0.5, threshold * 1.5))
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setPullY(0)
  }

  const pullProgress = Math.min(pullY / threshold, 1)
  const shouldTrigger = pullY >= threshold

  return (
    <div
      ref={ref}
      className={cn('relative overflow-auto', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <AnimatePresence>
        {(isDragging && pullY > 10) || isRefreshing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 bg-background/90 backdrop-blur-sm rounded-full p-3 border shadow-lg"
            style={{
              transform: `translateX(-50%) translateY(${Math.max(pullY - 30, 10)}px)`
            }}
          >
            {isRefreshing ? (
              <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
            ) : (
              <motion.div
                animate={{
                  rotate: shouldTrigger ? 180 : 0,
                  scale: pullProgress
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <ArrowDown 
                  className={cn(
                    'w-5 h-5 transition-colors',
                    shouldTrigger ? 'text-green-500' : 'text-gray-400'
                  )} 
                />
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        animate={{
          y: isRefreshing ? 60 : isDragging ? pullY * 0.3 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
