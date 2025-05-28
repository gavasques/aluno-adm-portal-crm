
import React, { useState } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ModernCard } from './modern-card'

interface SwipeableCardProps {
  children: React.ReactNode
  className?: string
  leftAction?: {
    icon: React.ReactNode
    label: string
    color: string
    onAction: () => void
  }
  rightAction?: {
    icon: React.ReactNode
    label: string
    color: string
    onAction: () => void
  }
  threshold?: number
  disabled?: boolean
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  className,
  leftAction,
  rightAction,
  threshold = 100,
  disabled = false
}) => {
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = () => {
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDrag = (event: PointerEvent, info: PanInfo) => {
    if (disabled) return
    setDragX(info.offset.x)
  }

  const handleDragEnd = (event: PointerEvent, info: PanInfo) => {
    if (disabled) return
    
    setIsDragging(false)
    const shouldTriggerLeft = info.offset.x > threshold && leftAction
    const shouldTriggerRight = info.offset.x < -threshold && rightAction

    if (shouldTriggerLeft) {
      leftAction.onAction()
    } else if (shouldTriggerRight) {
      rightAction.onAction()
    }

    setDragX(0)
  }

  const leftVisible = dragX > 20
  const rightVisible = dragX < -20
  const leftProgress = Math.min(Math.max(dragX / threshold, 0), 1)
  const rightProgress = Math.min(Math.max(-dragX / threshold, 0), 1)

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Left action background */}
      {leftAction && (
        <motion.div
          className="absolute inset-y-0 left-0 flex items-center justify-start pl-6 z-10"
          style={{ backgroundColor: leftAction.color }}
          initial={{ x: '-100%' }}
          animate={{ 
            x: leftVisible ? 0 : '-100%',
            opacity: leftProgress
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center gap-2 text-white">
            {leftAction.icon}
            <span className="font-medium">{leftAction.label}</span>
          </div>
        </motion.div>
      )}

      {/* Right action background */}
      {rightAction && (
        <motion.div
          className="absolute inset-y-0 right-0 flex items-center justify-end pr-6 z-10"
          style={{ backgroundColor: rightAction.color }}
          initial={{ x: '100%' }}
          animate={{ 
            x: rightVisible ? 0 : '100%',
            opacity: rightProgress
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center gap-2 text-white">
            <span className="font-medium">{rightAction.label}</span>
            {rightAction.icon}
          </div>
        </motion.div>
      )}

      {/* Card content */}
      <motion.div
        drag={disabled ? false : 'x'}
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{
          x: isDragging ? dragX : 0,
          scale: isDragging ? 0.98 : 1
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-20"
      >
        <ModernCard className={cn('cursor-grab active:cursor-grabbing', className)}>
          {children}
        </ModernCard>
      </motion.div>
    </div>
  )
}
