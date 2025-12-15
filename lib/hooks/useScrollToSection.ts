import { useCallback, useEffect, useRef } from 'react'

/**
 * Options for configuring scroll behavior
 */
export interface UseScrollToSectionOptions {
  /**
   * Offset from the top of the viewport in pixels
   * @default 80
   */
  readonly offset?: number

  /**
   * Scroll behavior type
   * @default 'smooth'
   */
  readonly behavior?: ScrollBehavior

  /**
   * Whether to update the URL hash
   * @default true
   */
  readonly updateHash?: boolean

  /**
   * Whether to focus the target element for accessibility
   * @default true
   */
  readonly focusTarget?: boolean

  /**
   * Callback fired when scroll starts
   */
  readonly onScrollStart?: (targetId: string) => void

  /**
   * Callback fired when scroll completes
   */
  readonly onScrollComplete?: (targetId: string) => void

  /**
   * Callback fired when scroll fails
   */
  readonly onScrollError?: (error: Error, targetId: string) => void
}

/**
 * Return type for useScrollToSection hook
 */
export interface UseScrollToSectionReturn {
  /**
   * Scroll to a section by ID
   */
  readonly scrollToSection: (sectionId: string) => void

  /**
   * Whether a scroll operation is currently in progress
   */
  readonly isScrolling: boolean
}

/**
 * Custom hook for smooth scrolling to page sections with accessibility support
 *
 * Features:
 * - Smooth scrolling with configurable offset
 * - Focus management for accessibility
 * - URL hash updates
 * - Error handling and recovery
 * - Scroll state tracking
 *
 * @param options - Configuration options for scroll behavior
 * @returns Object containing scrollToSection function and scroll state
 *
 * @example
 * ```tsx
 * const { scrollToSection, isScrolling } = useScrollToSection({
 *   offset: 100,
 *   behavior: 'smooth',
 *   onScrollComplete: (id) => console.log(`Scrolled to ${id}`)
 * });
 *
 * <button onClick={() => scrollToSection('contact')}>
 *   Contact Us
 * </button>
 * ```
 */
export function useScrollToSection(
  options: UseScrollToSectionOptions = {}
): UseScrollToSectionReturn {
  const {
    offset = 80,
    behavior = 'smooth',
    updateHash = true,
    focusTarget = true,
    onScrollStart,
    onScrollComplete,
    onScrollError,
  } = options

  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (!sectionId) {
        const error = new Error('Section ID is required')
        console.error('[useScrollToSection] Invalid section ID:', error)
        onScrollError?.(error, sectionId)
        return
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const cleanId = sectionId.replace(/^#/, '')

      try {
        const targetElement = document.getElementById(cleanId)

        if (!targetElement) {
          const error = new Error(`Element with id "${cleanId}" not found`)
          console.error('[useScrollToSection] Target element not found:', error)
          onScrollError?.(error, cleanId)
          return
        }

        isScrollingRef.current = true
        onScrollStart?.(cleanId)

        const elementPosition = targetElement.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.scrollY - offset

        const scrollOptions: ScrollToOptions = {
          top: Math.max(0, offsetPosition),
          behavior,
        }

        window.scrollTo(scrollOptions)

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }

        const scrollDuration = behavior === 'smooth' ? 1000 : 0

        scrollTimeoutRef.current = setTimeout(
          () => {
            if (abortControllerRef.current?.signal.aborted) {
              return
            }

            if (focusTarget) {
              const originalTabIndex = targetElement.getAttribute('tabindex')
              const hadTabIndex = originalTabIndex !== null

              if (!hadTabIndex) {
                targetElement.setAttribute('tabindex', '-1')
              }

              targetElement.focus({ preventScroll: true })

              if (!hadTabIndex) {
                targetElement.addEventListener(
                  'blur',
                  () => {
                    targetElement.removeAttribute('tabindex')
                  },
                  { once: true }
                )
              }
            }

            if (updateHash && window.history.pushState) {
              const newUrl = `${window.location.pathname}${window.location.search}#${cleanId}`
              window.history.pushState(null, '', newUrl)
            }

            isScrollingRef.current = false
            onScrollComplete?.(cleanId)
          },
          scrollDuration + 100
        )
      } catch (error) {
        isScrollingRef.current = false
        const scrollError =
          error instanceof Error
            ? error
            : new Error('Unknown error during scroll')
        console.error('[useScrollToSection] Scroll error:', scrollError)
        onScrollError?.(scrollError, cleanId)
      }
    },
    [
      offset,
      behavior,
      updateHash,
      focusTarget,
      onScrollStart,
      onScrollComplete,
      onScrollError,
    ]
  )

  return {
    scrollToSection,
    isScrolling: isScrollingRef.current,
  }
}

export default useScrollToSection