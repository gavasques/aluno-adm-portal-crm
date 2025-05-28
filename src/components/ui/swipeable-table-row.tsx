
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSwipeActions } from '@/hooks/useSwipeActions';

interface SwipeAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  onAction: () => void;
}

interface SwipeableTableRowProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  className?: string;
  disabled?: boolean;
}

export const SwipeableTableRow: React.FC<SwipeableTableRowProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  className,
  disabled = false
}) => {
  const {
    dragX,
    isDragging,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    getActionProgress,
    isActionVisible
  } = useSwipeActions({ leftActions, rightActions });

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Left Actions */}
      {leftActions.map((action, index) => (
        <motion.div
          key={action.id}
          className="absolute inset-y-0 left-0 flex items-center justify-start pl-4 z-10"
          style={{ backgroundColor: action.color }}
          initial={{ x: '-100%' }}
          animate={{ 
            x: isActionVisible('left') ? 0 : '-100%',
            opacity: getActionProgress('left')
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center gap-2 text-white">
            {action.icon}
            <span className="font-medium text-sm">{action.label}</span>
          </div>
        </motion.div>
      ))}

      {/* Right Actions */}
      {rightActions.map((action, index) => (
        <motion.div
          key={action.id}
          className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 z-10"
          style={{ backgroundColor: action.color }}
          initial={{ x: '100%' }}
          animate={{ 
            x: isActionVisible('right') ? 0 : '100%',
            opacity: getActionProgress('right')
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center gap-2 text-white">
            <span className="font-medium text-sm">{action.label}</span>
            {action.icon}
          </div>
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -150, right: 150 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{
          x: isDragging ? dragX : 0,
          scale: isDragging ? 0.98 : 1
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn('relative z-20 cursor-grab active:cursor-grabbing', className)}
      >
        {children}
      </motion.div>
    </div>
  );
};
