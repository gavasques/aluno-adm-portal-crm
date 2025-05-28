
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useContainerQuery } from '@/hooks/use-container-query'

interface AdaptiveGridProps {
  children: React.ReactNode
  className?: string
  minItemWidth?: number
  gap?: number
  responsive?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  autoFit?: boolean
  autoFill?: boolean
}

export const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({
  children,
  className,
  minItemWidth = 280,
  gap = 16,
  responsive,
  autoFit = true,
  autoFill = false
}) => {
  const { ref, size } = useContainerQuery()

  const getColumns = () => {
    if (responsive) {
      const breakpoint = size.breakpoint
      return responsive[breakpoint] || 1
    }

    if (autoFit || autoFill) {
      const availableWidth = size.width - gap
      const itemsPerRow = Math.floor(availableWidth / (minItemWidth + gap))
      return Math.max(1, itemsPerRow)
    }

    return 1
  }

  const columns = getColumns()

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: responsive 
      ? `repeat(${columns}, 1fr)`
      : autoFit 
        ? `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`
        : `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`,
    gap: `${gap}px`
  }

  return (
    <motion.div
      ref={ref}
      className={cn('w-full', className)}
      style={gridStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// Container com queries CSS nativas
export const ResponsiveContainer: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <div 
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8',
        // Container queries CSS
        '@container',
        '[&>*]:@xs:text-sm',
        '[&>*]:@sm:text-base', 
        '[&>*]:@md:text-lg',
        '[&>*]:@lg:text-xl',
        className
      )}
    >
      {children}
    </div>
  )
}
