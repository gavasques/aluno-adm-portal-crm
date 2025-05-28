
import { useEffect, useRef, useState } from 'react'

interface ContainerSize {
  width: number
  height: number
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

interface ContainerQueryOptions {
  breakpoints?: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    '2xl': number
  }
}

const defaultBreakpoints = {
  xs: 0,
  sm: 384,
  md: 512,
  lg: 768,
  xl: 1024,
  '2xl': 1280
}

export const useContainerQuery = (options: ContainerQueryOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<ContainerSize>({
    width: 0,
    height: 0,
    breakpoint: 'xs'
  })

  const breakpoints = { ...defaultBreakpoints, ...options.breakpoints }

  const getBreakpoint = (width: number): ContainerSize['breakpoint'] => {
    if (width >= breakpoints['2xl']) return '2xl'
    if (width >= breakpoints.xl) return 'xl'
    if (width >= breakpoints.lg) return 'lg'
    if (width >= breakpoints.md) return 'md'
    if (width >= breakpoints.sm) return 'sm'
    return 'xs'
  }

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setSize({
          width,
          height,
          breakpoint: getBreakpoint(width)
        })
      }
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return { ref, size }
}

// Hook para queries específicas
export const useContainerBreakpoint = (breakpoint: ContainerSize['breakpoint']) => {
  const { ref, size } = useContainerQuery()
  
  const breakpointMap = {
    xs: size.width >= 0,
    sm: size.width >= 384,
    md: size.width >= 512,
    lg: size.width >= 768,
    xl: size.width >= 1024,
    '2xl': size.width >= 1280
  }

  return {
    ref,
    isActive: breakpointMap[breakpoint],
    size
  }
}
