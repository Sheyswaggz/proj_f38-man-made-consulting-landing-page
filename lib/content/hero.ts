/**
 * Hero Section Content Configuration
 *
 * Defines the content structure and copy for the hero section with
 * conversational, human-centered messaging that avoids corporate buzzwords.
 */

/**
 * Call-to-action button configuration
 */
export interface HeroCallToAction {
  readonly text: string
  readonly href: string
  readonly ariaLabel: string
}

/**
 * Hero section content structure
 */
export interface HeroContent {
  readonly headline: string
  readonly subheadline: string
  readonly description: string
  readonly callToAction: HeroCallToAction
}

/**
 * Hero section content with conversational tone
 *
 * Messaging focuses on human-centered AI consulting, avoiding
 * automation-focused language and corporate buzzwords.
 */
export const heroContent: HeroContent = {
  headline: "AI that works with people, not instead of them",
  subheadline: "Strategic technology consulting for humans",
  description:
    "We help organizations use AI thoughtfully—building systems that enhance human capability rather than replace it. No buzzwords, no hype, just honest guidance on making technology work for your team.",
  callToAction: {
    text: "Let's talk",
    href: "#contact",
    ariaLabel: "Contact Man Made Consulting to discuss your project",
  },
} as const

/**
 * Type guard to validate hero content structure
 */
export function isValidHeroContent(content: unknown): content is HeroContent {
  if (typeof content !== 'object' || content === null) {
    return false
  }

  const c = content as Record<string, unknown>

  return (
    typeof c.headline === 'string' &&
    c.headline.length > 0 &&
    typeof c.subheadline === 'string' &&
    c.subheadline.length > 0 &&
    typeof c.description === 'string' &&
    c.description.length > 0 &&
    typeof c.callToAction === 'object' &&
    c.callToAction !== null &&
    typeof (c.callToAction as Record<string, unknown>).text === 'string' &&
    typeof (c.callToAction as Record<string, unknown>).href === 'string' &&
    typeof (c.callToAction as Record<string, unknown>).ariaLabel === 'string'
  )
}

/**
 * Get hero content with validation
 *
 * @returns Validated hero content
 * @throws Error if content validation fails
 */
export function getHeroContent(): HeroContent {
  if (!isValidHeroContent(heroContent)) {
    throw new Error('Invalid hero content configuration')
  }

  return heroContent
}