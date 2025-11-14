import { useRef, useCallback, useEffect, useMemo, useState } from 'react'

// ============================================================================
// DEBOUNCING & THROTTLING
// ============================================================================

/**
 * Debounce a value - delays updating until after delay has elapsed since last change
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 500)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Debounce a callback function
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * @example
 * const debouncedSearch = useDebouncedCallback((term) => search(term), 500)
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<number | null>(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  )
}

/**
 * Throttle a callback function
 * @param callback - Function to throttle
 * @param limit - Minimum time between calls in milliseconds
 * @returns Throttled function
 * @example
 * const throttledScroll = useThrottledCallback(() => handleScroll(), 100)
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  limit: number
): (...args: Parameters<T>) => void {
  const inThrottle = useRef(false)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callbackRef.current(...args)
        inThrottle.current = true
        setTimeout(() => {
          inThrottle.current = false
        }, limit)
      }
    },
    [limit]
  )
}

// ============================================================================
// MEMOIZATION & OPTIMIZATION
// ============================================================================

/**
 * Memoize a computation based on dependencies
 * Useful for expensive computations that don't change often
 * @param factory - Function that returns the value
 * @param deps - Dependencies array
 * @returns Memoized value
 */
export function useMemoized<T>(factory: () => T, deps: React.DependencyList): T {
  return useMemo(factory, deps)
}

/**
 * Check if component is mounted
 * Useful for preventing state updates on unmounted components
 * @returns Function to check if mounted
 * @example
 * const isMounted = useIsMounted()
 * if (isMounted()) setData(result)
 */
export function useIsMounted(): () => boolean {
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return useCallback(() => mountedRef.current, [])
}

// ============================================================================
// LAZY LOADING HELPERS
// ============================================================================

/**
 * Intersection Observer hook for lazy loading
 * @param options - IntersectionObserver options
 * @returns Ref to attach to element and isIntersecting boolean
 * @example
 * const { ref, isIntersecting } = useIntersectionObserver()
 * <div ref={ref}>{isIntersecting && <ExpensiveComponent />}</div>
 */
export function useIntersectionObserver(options: IntersectionObserverInit = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [node, setNode] = useState<Element | null>(null)

  useEffect(() => {
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [node, options])

  return { ref: setNode, isIntersecting }
}

/**
 * Load image lazily
 * @param src - Image source URL
 * @returns Object with source and loading state
 * @example
 * const { src, isLoading } = useLazyImage('/large-image.jpg')
 * <img src={src} alt="..." />
 */
export function useLazyImage(src: string) {
  const [imageSrc, setImageSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const img = new Image()
    img.src = src

    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
    }

    img.onerror = () => {
      setIsLoading(false)
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return { src: imageSrc, isLoading }
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Measure render performance of a component
 * @param componentName - Name of the component for logging
 */
export function useRenderPerformance(componentName: string) {
  const renderCount = useRef(0)
  const startTime = useRef(performance.now())

  useEffect(() => {
    renderCount.current += 1
    const endTime = performance.now()
    const renderTime = endTime - startTime.current

    if (import.meta.env.DEV) {
      console.log(
        `[Performance] ${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`
      )
    }

    startTime.current = performance.now()
  })
}

/**
 * Track which props changed causing a re-render
 * @param props - Component props
 * @param componentName - Name of the component
 */
export function useWhyDidYouUpdate(componentName: string, props: Record<string, unknown>) {
  const previousProps = useRef<Record<string, unknown>>()

  useEffect(() => {
    if (previousProps.current && import.meta.env.DEV) {
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      const changedProps: Record<string, { from: unknown; to: unknown }> = {}

      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          }
        }
      })

      if (Object.keys(changedProps).length > 0) {
        console.log(`[WhyDidYouUpdate] ${componentName}:`, changedProps)
      }
    }

    previousProps.current = props
  })
}

// ============================================================================
// LIST VIRTUALIZATION HELPERS
// ============================================================================

/**
 * Calculate visible items in a virtualized list
 * @param totalItems - Total number of items
 * @param itemHeight - Height of each item
 * @param containerHeight - Height of the container
 * @param scrollTop - Current scroll position
 * @param overscan - Number of items to render outside viewport
 * @returns Visible range and offset
 */
export function calculateVisibleRange(
  totalItems: number,
  itemHeight: number,
  containerHeight: number,
  scrollTop: number,
  overscan = 3
): { startIndex: number; endIndex: number; offsetY: number } {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )
  const offsetY = startIndex * itemHeight

  return { startIndex, endIndex, offsetY }
}

/**
 * Simple virtualized list hook
 * @param itemCount - Total number of items
 * @param itemHeight - Height of each item in pixels
 * @param containerHeight - Height of the container in pixels
 * @returns Visible range, scroll handler, and total height
 */
export function useVirtualList(itemCount: number, itemHeight: number, containerHeight: number) {
  const [scrollTop, setScrollTop] = useState(0)

  const { startIndex, endIndex, offsetY } = useMemo(() => {
    return calculateVisibleRange(itemCount, itemHeight, containerHeight, scrollTop)
  }, [itemCount, itemHeight, containerHeight, scrollTop])

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  const totalHeight = itemCount * itemHeight

  return {
    startIndex,
    endIndex,
    offsetY,
    totalHeight,
    handleScroll,
  }
}

// ============================================================================
// CACHE UTILITIES
// ============================================================================

/**
 * Simple memoization cache for expensive computations
 */
export class MemoCache<K, V> {
  private cache = new Map<K, V>()
  private maxSize: number

  constructor(maxSize = 100) {
    this.maxSize = maxSize
  }

  get(key: K): V | undefined {
    return this.cache.get(key)
  }

  set(key: K, value: V): void {
    // If cache is full, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }
    this.cache.set(key, value)
  }

  has(key: K): boolean {
    return this.cache.has(key)
  }

  clear(): void {
    this.cache.clear()
  }
}

/**
 * Hook to use memoization cache
 * @param maxSize - Maximum cache size
 * @returns MemoCache instance
 */
export function useMemoCache<K, V>(maxSize = 100): MemoCache<K, V> {
  return useMemo(() => new MemoCache<K, V>(maxSize), [maxSize])
}
