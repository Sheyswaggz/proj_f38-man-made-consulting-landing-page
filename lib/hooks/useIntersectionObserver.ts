import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Options for configuring the Intersection Observer
 */
export interface UseIntersectionObserverOptions {
  /**
   * The element that is used as the viewport for checking visibility
   * @default null (browser viewport)
   */
  root?: Element | null

  /**
   * Margin around the root element
   * @default '0px'
   */
  rootMargin?: string

  /**
   * Threshold(s) at which to trigger the callback
   * @default 0
   */
  threshold?: number | number[]

  /**
   * Whether to trigger only once when element enters viewport
   * @default false
   */
  triggerOnce?: boolean

  /**
   * Whether to start observing immediately
   * @default true
   */
  enabled?: boolean

  /**
   * Callback function when intersection state changes
   */
  onChange?: (entry: IntersectionObserverEntry) => void
}

/**
 * Return type for the useIntersectionObserver hook
 */
export interface UseIntersectionObserverResult {
  /**
   * Ref to attach to the element to observe
   */
  ref: (node: Element | null) => void

  /**
   * Current intersection entry
   */
  entry: IntersectionObserverEntry | null

  /**
   * Whether the element is currently intersecting
   */
  isIntersecting: boolean

  /**
   * Whether the element has ever intersected (useful with triggerOnce)
   */
  hasIntersected: boolean
}

/**
 * Custom hook for detecting when components enter viewport using Intersection Observer API
 *
 * @example
 * ```tsx
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.5,
 *   triggerOnce: true,
 * });
 *
 * return (
 *   <div ref={ref} className={isIntersecting ? 'animate-in' : ''}>
 *     Content
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverResult {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    triggerOnce = false,
    enabled = true,
    onChange,
  } = options

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const [hasIntersected, setHasIntersected] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementRef = useRef<Element | null>(null)
  const onChangeRef = useRef(onChange)

  // Keep onChange callback ref up to date
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Cleanup observer on unmount or when options change
  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
  }, [])

  // Create and manage observer
  useEffect(() => {
    if (!enabled) {
      cleanup()
      return
    }

    // Check if IntersectionObserver is supported
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      console.warn(
        'IntersectionObserver is not supported in this environment'
      )
      return
    }

    // Don't create observer if triggerOnce and already intersected
    if (triggerOnce && hasIntersected) {
      return
    }

    cleanup()

    try {
      observerRef.current = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          const latestEntry = entries[0]
          if (!latestEntry) {
            return
          }

          setEntry(latestEntry)

          if (latestEntry.isIntersecting) {
            setHasIntersected(true)

            if (triggerOnce && observerRef.current && elementRef.current) {
              observerRef.current.unobserve(elementRef.current)
            }
          }

          if (onChangeRef.current) {
            try {
              onChangeRef.current(latestEntry)
            } catch (error) {
              console.error('Error in intersection observer onChange callback:', error)
            }
          }
        },
        {
          root,
          rootMargin,
          threshold,
        }
      )

      // Observe current element if it exists
      if (elementRef.current) {
        observerRef.current.observe(elementRef.current)
      }
    } catch (error) {
      console.error('Error creating IntersectionObserver:', error)
    }

    return cleanup
  }, [root, rootMargin, threshold, triggerOnce, hasIntersected, enabled, cleanup])

  // Ref callback to handle element changes
  const ref = useCallback(
    (node: Element | null) => {
      // Unobserve previous element
      if (elementRef.current && observerRef.current) {
        observerRef.current.unobserve(elementRef.current)
      }

      elementRef.current = node

      // Observe new element
      if (node && observerRef.current) {
        try {
          observerRef.current.observe(node)
        } catch (error) {
          console.error('Error observing element:', error)
        }
      }
    },
    []
  )

  return {
    ref,
    entry,
    isIntersecting: entry?.isIntersecting ?? false,
    hasIntersected,
  }
}

export default useIntersectionObserver