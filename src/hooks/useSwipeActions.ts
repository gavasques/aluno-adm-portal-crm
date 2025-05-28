
import { useState, useCallback } from 'react';
import { PanInfo } from 'framer-motion';

interface SwipeAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  onAction: () => void;
}

interface UseSwipeActionsProps {
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  threshold?: number;
}

export const useSwipeActions = ({
  leftActions = [],
  rightActions = [],
  threshold = 100
}: UseSwipeActionsProps) => {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDrag = useCallback((event: PointerEvent, info: PanInfo) => {
    const newDragX = info.offset.x;
    
    // Limit drag distance
    const maxLeft = leftActions.length > 0 ? threshold * 1.5 : 0;
    const maxRight = rightActions.length > 0 ? threshold * 1.5 : 0;
    
    setDragX(Math.max(-maxRight, Math.min(maxLeft, newDragX)));
  }, [leftActions.length, rightActions.length, threshold]);

  const handleDragEnd = useCallback((event: PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    const shouldTriggerLeft = info.offset.x > threshold && leftActions.length > 0;
    const shouldTriggerRight = info.offset.x < -threshold && rightActions.length > 0;

    if (shouldTriggerLeft && leftActions[0]) {
      leftActions[0].onAction();
    } else if (shouldTriggerRight && rightActions[0]) {
      rightActions[0].onAction();
    }

    // Reset position
    setDragX(0);
  }, [leftActions, rightActions, threshold]);

  const getActionProgress = useCallback((side: 'left' | 'right') => {
    if (side === 'left') {
      return Math.min(Math.max(dragX / threshold, 0), 1);
    } else {
      return Math.min(Math.max(-dragX / threshold, 0), 1);
    }
  }, [dragX, threshold]);

  const isActionVisible = useCallback((side: 'left' | 'right') => {
    return side === 'left' ? dragX > 20 : dragX < -20;
  }, [dragX]);

  return {
    dragX,
    isDragging,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    getActionProgress,
    isActionVisible
  };
};
