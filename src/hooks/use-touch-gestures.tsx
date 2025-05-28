
import { useEffect, useRef, useState, useCallback } from 'react'

interface TouchPoint {
  x: number
  y: number
  timestamp: number
}

interface SwipeGesture {
  direction: 'up' | 'down' | 'left' | 'right'
  distance: number
  velocity: number
  duration: number
}

interface PinchGesture {
  scale: number
  center: { x: number; y: number }
}

interface TouchGestureOptions {
  swipeThreshold?: number
  swipeVelocityThreshold?: number
  pinchThreshold?: number
  onSwipe?: (gesture: SwipeGesture) => void
  onPinch?: (gesture: PinchGesture) => void
  onTap?: (point: TouchPoint) => void
  onDoubleTap?: (point: TouchPoint) => void
  onLongPress?: (point: TouchPoint) => void
  longPressDelay?: number
  disabled?: boolean
}

export const useTouchGestures = (options: TouchGestureOptions = {}) => {
  const {
    swipeThreshold = 50,
    swipeVelocityThreshold = 0.3,
    pinchThreshold = 0.1,
    longPressDelay = 500,
    disabled = false,
    onSwipe,
    onPinch,
    onTap,
    onDoubleTap,
    onLongPress
  } = options

  const ref = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null)
  const [lastTap, setLastTap] = useState<TouchPoint | null>(null)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null)

  const getTouchPoint = useCallback((touch: Touch): TouchPoint => ({
    x: touch.clientX,
    y: touch.clientY,
    timestamp: Date.now()
  }), [])

  const getDistance = useCallback((point1: TouchPoint, point2: TouchPoint): number => {
    const dx = point2.x - point1.x
    const dy = point2.y - point1.y
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  const getPinchDistance = useCallback((touches: TouchList): number => {
    if (touches.length < 2) return 0
    const touch1 = touches[0]
    const touch2 = touches[1]
    const dx = touch2.clientX - touch1.clientX
    const dy = touch2.clientY - touch1.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  const getPinchCenter = useCallback((touches: TouchList): { x: number; y: number } => {
    if (touches.length < 2) return { x: 0, y: 0 }
    const touch1 = touches[0]
    const touch2 = touches[1]
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    }
  }, [])

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }, [longPressTimer])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled) return
    
    const touches = e.touches
    
    if (touches.length === 1) {
      const point = getTouchPoint(touches[0])
      setTouchStart(point)
      
      // Setup long press timer
      if (onLongPress) {
        const timer = setTimeout(() => {
          onLongPress(point)
          clearLongPressTimer()
        }, longPressDelay)
        setLongPressTimer(timer)
      }
    } else if (touches.length === 2) {
      // Pinch start
      clearLongPressTimer()
      setInitialPinchDistance(getPinchDistance(touches))
    }
  }, [disabled, getTouchPoint, onLongPress, longPressDelay, clearLongPressTimer, getPinchDistance])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled) return
    
    const touches = e.touches
    
    if (touches.length === 2 && initialPinchDistance && onPinch) {
      // Pinch gesture
      const currentDistance = getPinchDistance(touches)
      const scale = currentDistance / initialPinchDistance
      const center = getPinchCenter(touches)
      
      if (Math.abs(scale - 1) > pinchThreshold) {
        onPinch({ scale, center })
      }
    } else {
      // Clear long press on movement
      clearLongPressTimer()
    }
  }, [disabled, initialPinchDistance, onPinch, getPinchDistance, getPinchCenter, pinchThreshold, clearLongPressTimer])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (disabled) return
    
    clearLongPressTimer()
    
    const touches = e.changedTouches
    if (touches.length === 1 && touchStart) {
      const touchEnd = getTouchPoint(touches[0])
      const distance = getDistance(touchStart, touchEnd)
      const duration = touchEnd.timestamp - touchStart.timestamp
      const velocity = distance / duration

      if (distance > swipeThreshold && velocity > swipeVelocityThreshold && onSwipe) {
        // Swipe gesture
        const dx = touchEnd.x - touchStart.x
        const dy = touchEnd.y - touchStart.y
        
        let direction: SwipeGesture['direction']
        if (Math.abs(dx) > Math.abs(dy)) {
          direction = dx > 0 ? 'right' : 'left'
        } else {
          direction = dy > 0 ? 'down' : 'up'
        }
        
        onSwipe({
          direction,
          distance,
          velocity,
          duration
        })
      } else if (distance < 10) {
        // Tap gesture
        const now = Date.now()
        if (lastTap && now - lastTap.timestamp < 300 && getDistance(lastTap, touchEnd) < 20) {
          // Double tap
          if (onDoubleTap) {
            onDoubleTap(touchEnd)
          }
          setLastTap(null)
        } else {
          // Single tap
          if (onTap) {
            onTap(touchEnd)
          }
          setLastTap(touchEnd)
        }
      }
    }
    
    setTouchStart(null)
    setInitialPinchDistance(null)
  }, [disabled, touchStart, lastTap, swipeThreshold, swipeVelocityThreshold, onSwipe, onTap, onDoubleTap, clearLongPressTimer, getTouchPoint, getDistance])

  useEffect(() => {
    const element = ref.current
    if (!element || disabled) return

    const options = { passive: false }
    
    element.addEventListener('touchstart', handleTouchStart, options)
    element.addEventListener('touchmove', handleTouchMove, options)
    element.addEventListener('touchend', handleTouchEnd, options)

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      clearLongPressTimer()
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, clearLongPressTimer, disabled])

  return { ref }
}

// Hook otimizado para pull-to-refresh
export const usePullToRefresh = (onRefresh: () => void | Promise<void>) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  
  const { ref } = useTouchGestures({
    swipeThreshold: 100,
    disabled: isRefreshing,
    onSwipe: async (gesture) => {
      if (gesture.direction === 'down' && gesture.distance > 120 && !isRefreshing) {
        setIsRefreshing(true)
        setPullDistance(gesture.distance)
        
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
          setPullDistance(0)
        }
      }
    }
  })

  return {
    ref,
    isRefreshing,
    pullDistance
  }
}
