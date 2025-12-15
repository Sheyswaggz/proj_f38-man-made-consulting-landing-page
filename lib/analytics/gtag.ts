/**
 * Google Analytics (gtag.js) Integration
 * 
 * Privacy-compliant analytics tracking with consent management.
 * Implements event tracking, page views, and user consent handling.
 * 
 * @module lib/analytics/gtag
 */

// Type definitions for gtag.js
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'consent' | 'set',
      targetId: string | 'default',
      config?: Record<string, unknown>
    ) => void
    dataLayer?: unknown[]
  }
}

/**
 * Consent state for analytics tracking
 */
export type ConsentState = 'granted' | 'denied'

/**
 * Consent configuration for different tracking types
 */
export interface ConsentConfig {
  readonly analytics_storage: ConsentState
  readonly ad_storage: ConsentState
  readonly functionality_storage: ConsentState
  readonly personalization_storage: ConsentState
  readonly security_storage: ConsentState
}

/**
 * Google Analytics configuration options
 */
export interface GtagConfig {
  readonly page_path?: string
  readonly page_title?: string
  readonly page_location?: string
  readonly send_page_view?: boolean
  readonly anonymize_ip?: boolean
  readonly cookie_flags?: string
  readonly cookie_domain?: string
  readonly cookie_expires?: number
}

/**
 * Event parameters for custom event tracking
 */
export interface EventParams {
  readonly event_category?: string
  readonly event_label?: string
  readonly value?: number
  readonly [key: string]: string | number | boolean | undefined
}

/**
 * Analytics initialization options
 */
export interface AnalyticsOptions {
  readonly measurementId: string
  readonly config?: GtagConfig
  readonly defaultConsent?: Partial<ConsentConfig>
  readonly debug?: boolean
}

/**
 * Default consent configuration (privacy-first approach)
 */
const DEFAULT_CONSENT: ConsentConfig = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
} as const

/**
 * Default gtag configuration
 */
const DEFAULT_CONFIG: GtagConfig = {
  send_page_view: true,
  anonymize_ip: true,
  cookie_flags: 'SameSite=None;Secure',
} as const

/**
 * Check if analytics is enabled via environment variable
 */
export function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED
  return enabled === 'true' || enabled === '1'
}

/**
 * Get Google Analytics measurement ID from environment
 */
export function getMeasurementId(): string | undefined {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
}

/**
 * Check if gtag is loaded and available
 */
export function isGtagLoaded(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

/**
 * Initialize Google Analytics with consent management
 * 
 * @param options - Analytics initialization options
 * @throws {Error} If measurement ID is missing or invalid
 */
export function initializeAnalytics(options: AnalyticsOptions): void {
  if (typeof window === 'undefined') {
    console.warn('[Analytics] Cannot initialize on server side')
    return
  }

  if (!isAnalyticsEnabled()) {
    console.warn('[Analytics] Analytics is disabled via environment variable')
    return
  }

  const { measurementId, config = {}, defaultConsent = {}, debug = false } = options

  if (!measurementId || !measurementId.startsWith('G-')) {
    throw new Error('[Analytics] Invalid measurement ID format. Expected G-XXXXXXXXXX')
  }

  try {
    // Initialize dataLayer if not exists
    window.dataLayer = window.dataLayer ?? []

    // Define gtag function
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments)
    }

    // Set default consent state (privacy-first)
    const consentConfig: ConsentConfig = {
      ...DEFAULT_CONSENT,
      ...defaultConsent,
    }

    window.gtag('consent', 'default', consentConfig)

    // Configure analytics
    const gtagConfig: GtagConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }

    window.gtag('config', measurementId, gtagConfig)

    if (debug) {
      console.log('[Analytics] Initialized with config:', {
        measurementId,
        consent: consentConfig,
        config: gtagConfig,
      })
    }
  } catch (error) {
    console.error('[Analytics] Initialization failed:', error)
    throw error
  }
}

/**
 * Update user consent preferences
 * 
 * @param consent - Updated consent configuration
 */
export function updateConsent(consent: Partial<ConsentConfig>): void {
  if (!isGtagLoaded()) {
    console.warn('[Analytics] gtag not loaded, cannot update consent')
    return
  }

  try {
    window.gtag?.('consent', 'update', consent)
    console.log('[Analytics] Consent updated:', consent)
  } catch (error) {
    console.error('[Analytics] Failed to update consent:', error)
  }
}

/**
 * Grant all analytics consent (user accepts tracking)
 */
export function grantConsent(): void {
  updateConsent({
    analytics_storage: 'granted',
    ad_storage: 'granted',
    functionality_storage: 'granted',
    personalization_storage: 'granted',
  })
}

/**
 * Deny all analytics consent (user rejects tracking)
 */
export function denyConsent(): void {
  updateConsent({
    analytics_storage: 'denied',
    ad_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
  })
}

/**
 * Track a page view
 * 
 * @param url - Page URL to track
 * @param title - Page title (optional)
 */
export function trackPageView(url: string, title?: string): void {
  if (!isGtagLoaded()) {
    console.warn('[Analytics] gtag not loaded, cannot track page view')
    return
  }

  if (!isAnalyticsEnabled()) {
    return
  }

  try {
    const config: GtagConfig = {
      page_path: url,
      page_title: title,
      page_location: typeof window !== 'undefined' ? window.location.href : url,
    }

    const measurementId = getMeasurementId()
    if (!measurementId) {
      console.warn('[Analytics] Measurement ID not configured')
      return
    }

    window.gtag?.('config', measurementId, config)
    console.log('[Analytics] Page view tracked:', url)
  } catch (error) {
    console.error('[Analytics] Failed to track page view:', error)
  }
}

/**
 * Track a custom event
 * 
 * @param eventName - Name of the event
 * @param params - Event parameters
 */
export function trackEvent(eventName: string, params?: EventParams): void {
  if (!isGtagLoaded()) {
    console.warn('[Analytics] gtag not loaded, cannot track event')
    return
  }

  if (!isAnalyticsEnabled()) {
    return
  }

  try {
    window.gtag?.('event', eventName, params)
    console.log('[Analytics] Event tracked:', eventName, params)
  } catch (error) {
    console.error('[Analytics] Failed to track event:', error)
  }
}

/**
 * Track form submission
 * 
 * @param formName - Name of the form
 * @param success - Whether submission was successful
 */
export function trackFormSubmission(formName: string, success: boolean): void {
  trackEvent('form_submission', {
    event_category: 'engagement',
    event_label: formName,
    value: success ? 1 : 0,
    success,
  })
}

/**
 * Track button click
 * 
 * @param buttonName - Name or label of the button
 * @param location - Location/context of the button
 */
export function trackButtonClick(buttonName: string, location?: string): void {
  trackEvent('button_click', {
    event_category: 'engagement',
    event_label: buttonName,
    location,
  })
}

/**
 * Track section view (intersection observer)
 * 
 * @param sectionName - Name of the section
 * @param visibilityPercentage - Percentage of section visible
 */
export function trackSectionView(
  sectionName: string,
  visibilityPercentage?: number
): void {
  trackEvent('section_view', {
    event_category: 'engagement',
    event_label: sectionName,
    value: visibilityPercentage,
  })
}

/**
 * Track external link click
 * 
 * @param url - External URL clicked
 * @param linkText - Text of the link
 */
export function trackExternalLink(url: string, linkText?: string): void {
  trackEvent('external_link_click', {
    event_category: 'navigation',
    event_label: linkText ?? url,
    url,
  })
}

/**
 * Track scroll depth
 * 
 * @param percentage - Scroll depth percentage (0-100)
 */
export function trackScrollDepth(percentage: number): void {
  const roundedPercentage = Math.round(percentage / 25) * 25
  
  trackEvent('scroll_depth', {
    event_category: 'engagement',
    value: roundedPercentage,
    percentage: roundedPercentage,
  })
}

/**
 * Track time on page
 * 
 * @param seconds - Time spent on page in seconds
 * @param pagePath - Page path
 */
export function trackTimeOnPage(seconds: number, pagePath: string): void {
  trackEvent('time_on_page', {
    event_category: 'engagement',
    event_label: pagePath,
    value: Math.round(seconds),
  })
}

/**
 * Track error occurrence
 * 
 * @param errorMessage - Error message
 * @param errorLocation - Where the error occurred
 * @param fatal - Whether error is fatal
 */
export function trackError(
  errorMessage: string,
  errorLocation?: string,
  fatal = false
): void {
  trackEvent('error', {
    event_category: 'error',
    event_label: errorMessage,
    location: errorLocation,
    fatal,
  })
}

/**
 * Load Google Analytics script dynamically
 * 
 * @param measurementId - Google Analytics measurement ID
 * @returns Promise that resolves when script is loaded
 */
export async function loadGtagScript(measurementId: string): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('[Analytics] Cannot load script on server side')
  }

  if (isGtagLoaded()) {
    console.log('[Analytics] gtag already loaded')
    return
  }

  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      
      script.onload = () => {
        console.log('[Analytics] gtag script loaded successfully')
        resolve()
      }
      
      script.onerror = () => {
        const error = new Error('[Analytics] Failed to load gtag script')
        console.error(error)
        reject(error)
      }

      document.head.appendChild(script)
    } catch (error) {
      console.error('[Analytics] Error loading gtag script:', error)
      reject(error)
    }
  })
}

/**
 * Initialize analytics with script loading
 * 
 * @param options - Analytics initialization options
 * @returns Promise that resolves when analytics is ready
 */
export async function setupAnalytics(
  options: AnalyticsOptions
): Promise<void> {
  if (!isAnalyticsEnabled()) {
    console.warn('[Analytics] Analytics disabled, skipping setup')
    return
  }

  try {
    await loadGtagScript(options.measurementId)
    initializeAnalytics(options)
    console.log('[Analytics] Setup complete')
  } catch (error) {
    console.error('[Analytics] Setup failed:', error)
    throw error
  }
}