import type { Metadata } from 'next'

/**
 * Organization structured data for JSON-LD
 */
export interface OrganizationStructuredData {
  readonly '@context': 'https://schema.org'
  readonly '@type': 'Organization'
  readonly name: string
  readonly url: string
  readonly logo: string
  readonly description: string
  readonly contactPoint: {
    readonly '@type': 'ContactPoint'
    readonly telephone: string
    readonly contactType: 'customer service'
    readonly email: string
    readonly availableLanguage: readonly string[]
  }
  readonly sameAs: readonly string[]
  readonly address?: {
    readonly '@type': 'PostalAddress'
    readonly addressCountry: string
  }
}

/**
 * Service structured data for JSON-LD
 */
export interface ServiceStructuredData {
  readonly '@context': 'https://schema.org'
  readonly '@type': 'Service'
  readonly name: string
  readonly description: string
  readonly provider: {
    readonly '@type': 'Organization'
    readonly name: string
  }
  readonly serviceType: string
  readonly areaServed: string
}

/**
 * Website structured data for JSON-LD
 */
export interface WebsiteStructuredData {
  readonly '@context': 'https://schema.org'
  readonly '@type': 'WebSite'
  readonly name: string
  readonly url: string
  readonly description: string
  readonly potentialAction: {
    readonly '@type': 'SearchAction'
    readonly target: string
    readonly 'query-input': string
  }
}

/**
 * SEO metadata configuration
 */
export interface SEOMetadata {
  readonly title: string
  readonly description: string
  readonly keywords: readonly string[]
  readonly openGraph: {
    readonly title: string
    readonly description: string
    readonly type: 'website'
    readonly url: string
    readonly siteName: string
    readonly images: readonly {
      readonly url: string
      readonly width: number
      readonly height: number
      readonly alt: string
    }[]
    readonly locale: string
  }
  readonly twitter: {
    readonly card: 'summary_large_image'
    readonly title: string
    readonly description: string
    readonly images: readonly string[]
    readonly creator?: string
    readonly site?: string
  }
  readonly robots: {
    readonly index: boolean
    readonly follow: boolean
    readonly googleBot: {
      readonly index: boolean
      readonly follow: boolean
      readonly 'max-video-preview': number
      readonly 'max-image-preview': 'large'
      readonly 'max-snippet': number
    }
  }
  readonly alternates: {
    readonly canonical: string
  }
  readonly verification?: {
    readonly google?: string
    readonly yandex?: string
    readonly bing?: string
  }
}

/**
 * Base URL for the application
 */
const BASE_URL = 'https://manmadeconsulting.com'

/**
 * Default SEO metadata for the landing page
 */
export const defaultMetadata: SEOMetadata = {
  title: 'Man Made Consulting - AI That Works With People, Not Instead of Them',
  description:
    'Strategic AI consulting for modern businesses. We help organizations implement AI thoughtfully—building systems that enhance human capability rather than replace it. Expert guidance on making technology work for your team.',
  keywords: [
    'AI consulting',
    'artificial intelligence consulting',
    'AI implementation',
    'machine learning consulting',
    'AI strategy',
    'business AI solutions',
    'human-centered AI',
    'AI integration',
    'technology consulting',
    'AI transformation',
    'enterprise AI',
    'AI advisory',
    'strategic technology consulting',
    'AI for business',
    'responsible AI',
  ] as const,
  openGraph: {
    title:
      'Man Made Consulting - AI That Works With People, Not Instead of Them',
    description:
      'Strategic AI consulting for modern businesses. We help organizations implement AI thoughtfully—building systems that enhance human capability rather than replace it.',
    type: 'website',
    url: BASE_URL,
    siteName: 'Man Made Consulting',
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Man Made Consulting - Strategic AI Consulting',
      },
    ] as const,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Man Made Consulting - AI That Works With People, Not Instead of Them',
    description:
      'Strategic AI consulting for modern businesses. We help organizations implement AI thoughtfully—building systems that enhance human capability.',
    images: [`${BASE_URL}/twitter-image.jpg`] as const,
    creator: '@manmadeconsult',
    site: '@manmadeconsult',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: 'your-google-verification-code',
  },
} as const

/**
 * Organization structured data
 */
export const organizationStructuredData: OrganizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Man Made Consulting',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description:
    'Strategic AI consulting firm specializing in human-centered technology implementation. We help organizations use AI thoughtfully to enhance human capability.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'customer service',
    email: 'hello@manmadeconsulting.com',
    availableLanguage: ['English'] as const,
  },
  sameAs: [
    'https://linkedin.com/company/manmadeconsulting',
    'https://twitter.com/manmadeconsult',
  ] as const,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
  },
} as const

/**
 * Service structured data
 */
export const serviceStructuredData: ServiceStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Consulting and Implementation Services',
  description:
    'Comprehensive AI consulting services including strategy development, implementation, training, and ongoing support. We specialize in human-centered AI solutions that enhance team productivity.',
  provider: {
    '@type': 'Organization',
    name: 'Man Made Consulting',
  },
  serviceType: 'Technology Consulting',
  areaServed: 'Worldwide',
} as const

/**
 * Website structured data
 */
export const websiteStructuredData: WebsiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Man Made Consulting',
  url: BASE_URL,
  description:
    'Strategic AI consulting for modern businesses. Expert guidance on implementing AI that works with people.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
} as const

/**
 * Generate Next.js metadata object from SEO configuration
 */
export function generateMetadata(config: SEOMetadata = defaultMetadata): Metadata {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(', '),
    openGraph: {
      title: config.openGraph.title,
      description: config.openGraph.description,
      type: config.openGraph.type,
      url: config.openGraph.url,
      siteName: config.openGraph.siteName,
      images: config.openGraph.images,
      locale: config.openGraph.locale,
    },
    twitter: {
      card: config.twitter.card,
      title: config.twitter.title,
      description: config.twitter.description,
      images: config.twitter.images,
      creator: config.twitter.creator,
      site: config.twitter.site,
    },
    robots: {
      index: config.robots.index,
      follow: config.robots.follow,
      googleBot: config.robots.googleBot,
    },
    alternates: {
      canonical: config.alternates.canonical,
    },
    verification: config.verification,
  }
}

/**
 * Generate JSON-LD structured data script content
 */
export function generateStructuredData(): string {
  const structuredData = [
    organizationStructuredData,
    serviceStructuredData,
    websiteStructuredData,
  ]

  return JSON.stringify(structuredData)
}

/**
 * Get page-specific metadata with overrides
 */
export function getPageMetadata(overrides: Partial<SEOMetadata> = {}): Metadata {
  const merged: SEOMetadata = {
    ...defaultMetadata,
    ...overrides,
    openGraph: {
      ...defaultMetadata.openGraph,
      ...(overrides.openGraph ?? {}),
    },
    twitter: {
      ...defaultMetadata.twitter,
      ...(overrides.twitter ?? {}),
    },
    robots: {
      ...defaultMetadata.robots,
      ...(overrides.robots ?? {}),
      googleBot: {
        ...defaultMetadata.robots.googleBot,
        ...(overrides.robots?.googleBot ?? {}),
      },
    },
    alternates: {
      ...defaultMetadata.alternates,
      ...(overrides.alternates ?? {}),
    },
  }

  return generateMetadata(merged)
}

/**
 * Validate metadata configuration
 */
export function validateMetadata(metadata: SEOMetadata): {
  readonly isValid: boolean
  readonly errors: readonly string[]
} {
  const errors: string[] = []

  if (!metadata.title || metadata.title.length < 10) {
    errors.push('Title must be at least 10 characters')
  }

  if (metadata.title.length > 60) {
    errors.push('Title should not exceed 60 characters for optimal SEO')
  }

  if (!metadata.description || metadata.description.length < 50) {
    errors.push('Description must be at least 50 characters')
  }

  if (metadata.description.length > 160) {
    errors.push('Description should not exceed 160 characters for optimal SEO')
  }

  if (metadata.keywords.length === 0) {
    errors.push('At least one keyword is required')
  }

  if (!metadata.openGraph.images || metadata.openGraph.images.length === 0) {
    errors.push('At least one Open Graph image is required')
  }

  if (!metadata.twitter.images || metadata.twitter.images.length === 0) {
    errors.push('At least one Twitter image is required')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Get canonical URL for a given path
 */
export function getCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${BASE_URL}${cleanPath}`
}

/**
 * Generate sitemap entry for a page
 */
export interface SitemapEntry {
  readonly url: string
  readonly lastModified: Date
  readonly changeFrequency:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  readonly priority: number
}

export function generateSitemapEntry(
  path: string,
  options: {
    readonly lastModified?: Date
    readonly changeFrequency?: SitemapEntry['changeFrequency']
    readonly priority?: number
  } = {}
): SitemapEntry {
  return {
    url: getCanonicalUrl(path),
    lastModified: options.lastModified ?? new Date(),
    changeFrequency: options.changeFrequency ?? 'monthly',
    priority: options.priority ?? 0.5,
  }
}

/**
 * Default sitemap entries for the landing page
 */
export const defaultSitemapEntries: readonly SitemapEntry[] = [
  generateSitemapEntry('/', {
    changeFrequency: 'weekly',
    priority: 1.0,
  }),
] as const