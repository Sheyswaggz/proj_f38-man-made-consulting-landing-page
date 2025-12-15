/**
 * Performance optimization utilities and lazy loading helpers
 * Provides utilities for image optimization, lazy loading, and performance monitoring
 */

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  readonly lcp: number | null
  readonly fid: number | null
  readonly cls: number | null
  readonly fcp: number | null
  readonly ttfb: number | null
}

/**
 * Performance observer callback type
 */
export type PerformanceCallback = (metrics: PerformanceMetrics) => void

/**
 * Lazy load options
 */
export interface LazyLoadOptions {
  readonly rootMargin?: string
  readonly threshold?: number | number[]
  readonly onLoad?: () => void
  readonly onError?: (error: Error) => void
}

/**
 * Image optimization options
 */
export interface ImageOptimizationOptions {
  readonly quality?: number
  readonly format?: 'webp' | 'avif' | 'jpeg' | 'png'
  readonly sizes?: string
  readonly priority?: boolean
}

/**
 * Core Web Vitals thresholds
 */
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
} as const

/**
 * Performance metric rating
 */
export type MetricRating = 'good' | 'needs-improvement' | 'poor'

/**
 * Get rating for a performance metric
 */
export function getMetricRating(
  metric: keyof typeof WEB_VITALS_THRESHOLDS,
  value: number
): MetricRating {
  const thresholds = WEB_VITALS_THRESHOLDS[metric]
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.needsImprovement) return 'needs-improvement'
  return 'poor'
}

/**
 * Monitor Core Web Vitals
 */
export function monitorWebVitals(callback: PerformanceCallback): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const metrics: PerformanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  }

  const observers: PerformanceObserver[] = []

  try {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver(list => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
        renderTime?: number
        loadTime?: number
      }
      if (lastEntry) {
        metrics.lcp = lastEntry.renderTime || lastEntry.loadTime || 0
        callback({ ...metrics })
      }
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    observers.push(lcpObserver)

    // First Input Delay
    const fidObserver = new PerformanceObserver(list => {
      const entries = list.getEntries()
      const firstEntry = entries[0] as PerformanceEntry & {
        processingStart?: number
        startTime?: number
      }
      if (firstEntry) {
        metrics.fid =
          (firstEntry.processingStart || 0) - (firstEntry.startTime || 0)
        callback({ ...metrics })
      }
    })
    fidObserver.observe({ type: 'first-input', buffered: true })
    observers.push(fidObserver)

    // Cumulative Layout Shift
    let clsValue = 0
    const clsObserver = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as PerformanceEntry & {
          hadRecentInput?: boolean
          value?: number
        }
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value || 0
          metrics.cls = clsValue
          callback({ ...metrics })
        }
      }
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })
    observers.push(clsObserver)

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver(list => {
      const entries = list.getEntries()
      const firstEntry = entries[0]
      if (firstEntry) {
        metrics.fcp = firstEntry.startTime
        callback({ ...metrics })
      }
    })
    fcpObserver.observe({ type: 'paint', buffered: true })
    observers.push(fcpObserver)

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      metrics.ttfb = navigationEntry.responseStart
      callback({ ...metrics })
    }
  } catch (error) {
    console.error('Error monitoring web vitals:', error)
  }

  return () => {
    observers.forEach(observer => observer.disconnect())
  }
}

/**
 * Create lazy load observer
 */
export function createLazyLoadObserver(
  options: LazyLoadOptions = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  const { rootMargin = '50px', threshold = 0.01, onLoad, onError } = options

  return new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLImageElement

          if (target.dataset.src) {
            const img = new Image()

            img.onload = () => {
              target.src = target.dataset.src || ''
              target.removeAttribute('data-src')
              target.classList.add('loaded')
              onLoad?.()
            }

            img.onerror = () => {
              const error = new Error(
                `Failed to load image: ${target.dataset.src}`
              )
              console.error(error)
              onError?.(error)
            }

            img.src = target.dataset.src
          }
        }
      })
    },
    { rootMargin, threshold }
  )
}

/**
 * Preload critical resources
 */
export function preloadResource(
  href: string,
  as: 'image' | 'script' | 'style' | 'font',
  options: {
    readonly type?: string
    readonly crossOrigin?: 'anonymous' | 'use-credentials'
  } = {}
): void {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as

  if (options.type) {
    link.type = options.type
  }

  if (options.crossOrigin) {
    link.crossOrigin = options.crossOrigin
  }

  document.head.appendChild(link)
}

/**
 * Prefetch resources for next navigation
 */
export function prefetchResource(href: string): void {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href

  document.head.appendChild(link)
}

/**
 * Measure function execution time
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T
): { result: T; duration: number } {
  const startTime = performance.now()
  const result = fn()
  const duration = performance.now() - startTime

  if (typeof window !== 'undefined' && window.performance?.mark) {
    performance.mark(`${name}-start`)
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
  }

  return { result, duration }
}

/**
 * Measure async function execution time
 */
export async function measurePerformanceAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const startTime = performance.now()
  const result = await fn()
  const duration = performance.now() - startTime

  if (typeof window !== 'undefined' && window.performance?.mark) {
    performance.mark(`${name}-start`)
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
  }

  return { result, duration }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Request idle callback wrapper with fallback
 */
export function requestIdleCallback(
  callback: () => void,
  options?: { timeout?: number }
): number {
  if (typeof window === 'undefined') {
    return 0
  }

  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options)
  }

  return window.setTimeout(callback, 1) as unknown as number
}

/**
 * Cancel idle callback wrapper with fallback
 */
export function cancelIdleCallback(id: number): void {
  if (typeof window === 'undefined') return

  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id)
  } else {
    window.clearTimeout(id)
  }
}

/**
 * Get optimized image URL for Next.js Image component
 */
export function getOptimizedImageUrl(
  src: string,
  options: ImageOptimizationOptions = {}
): string {
  const { quality = 75, format = 'webp' } = options

  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }

  const params = new URLSearchParams({
    url: src,
    w: '1920',
    q: quality.toString(),
    f: format,
  })

  return `/_next/image?${params.toString()}`
}

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): boolean {
  if (typeof document === 'undefined') return false

  const canvas = document.createElement('canvas')
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }

  return false
}

/**
 * Check if browser supports AVIF
 */
export function supportsAVIF(): boolean {
  if (typeof document === 'undefined') return false

  const canvas = document.createElement('canvas')
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
  }

  return false
}

/**
 * Get connection speed
 */
export function getConnectionSpeed(): 'slow' | 'medium' | 'fast' | 'unknown' {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'unknown'
  }

  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection

  if (!connection?.effectiveType) {
    return 'unknown'
  }

  const effectiveType = connection.effectiveType

  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    return 'slow'
  }

  if (effectiveType === '3g') {
    return 'medium'
  }

  return 'fast'
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Log performance metrics to console in development
 */
export function logPerformanceMetrics(metrics: PerformanceMetrics): void {
  if (process.env.NODE_ENV !== 'development') return

  console.group('Performance Metrics')

  if (metrics.lcp !== null) {
    const rating = getMetricRating('LCP', metrics.lcp)
    console.log(`LCP: ${metrics.lcp.toFixed(2)}ms (${rating})`)
  }

  if (metrics.fid !== null) {
    const rating = getMetricRating('FID', metrics.fid)
    console.log(`FID: ${metrics.fid.toFixed(2)}ms (${rating})`)
  }

  if (metrics.cls !== null) {
    const rating = getMetricRating('CLS', metrics.cls)
    console.log(`CLS: ${metrics.cls.toFixed(4)} (${rating})`)
  }

  if (metrics.fcp !== null) {
    const rating = getMetricRating('FCP', metrics.fcp)
    console.log(`FCP: ${metrics.fcp.toFixed(2)}ms (${rating})`)
  }

  if (metrics.ttfb !== null) {
    const rating = getMetricRating('TTFB', metrics.ttfb)
    console.log(`TTFB: ${metrics.ttfb.toFixed(2)}ms (${rating})`)
  }

  console.groupEnd()
}