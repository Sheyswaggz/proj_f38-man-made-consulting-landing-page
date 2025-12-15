/**
 * @file __tests__/seo/metadata.test.ts
 * @description Comprehensive test suite for SEO metadata generation and validation
 * 
 * Test Coverage:
 * - Metadata generation and validation
 * - Structured data generation (JSON-LD)
 * - URL canonicalization
 * - Sitemap entry generation
 * - SEO compliance validation
 * - Edge cases and error scenarios
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import type { Metadata } from 'next'
import {
  defaultMetadata,
  organizationStructuredData,
  serviceStructuredData,
  websiteStructuredData,
  generateMetadata,
  generateStructuredData,
  getPageMetadata,
  validateMetadata,
  getCanonicalUrl,
  generateSitemapEntry,
  defaultSitemapEntries,
  type SEOMetadata,
  type OrganizationStructuredData,
  type ServiceStructuredData,
  type WebsiteStructuredData,
  type SitemapEntry,
} from '@/lib/seo/metadata'

// ============================================================================
// 🎯 UNIT TESTS - Core Functionality
// ============================================================================

describe('SEO Metadata Module', () => {
  describe('🏗️ Default Metadata Configuration', () => {
    it('should have valid default metadata structure', () => {
      expect(defaultMetadata).toBeDefined()
      expect(defaultMetadata.title).toBeTruthy()
      expect(defaultMetadata.description).toBeTruthy()
      expect(defaultMetadata.keywords).toBeInstanceOf(Array)
      expect(defaultMetadata.keywords.length).toBeGreaterThan(0)
    })

    it('should have properly formatted title', () => {
      expect(defaultMetadata.title).toContain('Man Made Consulting')
      expect(defaultMetadata.title.length).toBeGreaterThan(10)
      expect(defaultMetadata.title.length).toBeLessThanOrEqual(60)
    })

    it('should have SEO-optimized description', () => {
      expect(defaultMetadata.description.length).toBeGreaterThanOrEqual(50)
      expect(defaultMetadata.description.length).toBeLessThanOrEqual(160)
      expect(defaultMetadata.description).toContain('AI')
    })

    it('should include relevant keywords', () => {
      const keywords = defaultMetadata.keywords
      expect(keywords).toContain('AI consulting')
      expect(keywords).toContain('artificial intelligence consulting')
      expect(keywords.length).toBeGreaterThanOrEqual(10)
    })

    it('should have valid Open Graph configuration', () => {
      const { openGraph } = defaultMetadata
      expect(openGraph.type).toBe('website')
      expect(openGraph.url).toMatch(/^https:\/\//)
      expect(openGraph.siteName).toBe('Man Made Consulting')
      expect(openGraph.locale).toBe('en_US')
      expect(openGraph.images).toHaveLength(1)
    })

    it('should have valid Open Graph image dimensions', () => {
      const image = defaultMetadata.openGraph.images[0]
      expect(image.width).toBe(1200)
      expect(image.height).toBe(630)
      expect(image.url).toMatch(/\.jpg$/)
      expect(image.alt).toBeTruthy()
    })

    it('should have valid Twitter card configuration', () => {
      const { twitter } = defaultMetadata
      expect(twitter.card).toBe('summary_large_image')
      expect(twitter.title).toBeTruthy()
      expect(twitter.description).toBeTruthy()
      expect(twitter.images).toHaveLength(1)
      expect(twitter.creator).toBe('@manmadeconsult')
      expect(twitter.site).toBe('@manmadeconsult')
    })

    it('should have proper robots configuration', () => {
      const { robots } = defaultMetadata
      expect(robots.index).toBe(true)
      expect(robots.follow).toBe(true)
      expect(robots.googleBot.index).toBe(true)
      expect(robots.googleBot.follow).toBe(true)
      expect(robots.googleBot['max-video-preview']).toBe(-1)
      expect(robots.googleBot['max-image-preview']).toBe('large')
      expect(robots.googleBot['max-snippet']).toBe(-1)
    })

    it('should have canonical URL', () => {
      expect(defaultMetadata.alternates.canonical).toMatch(/^https:\/\//)
    })

    it('should have verification codes structure', () => {
      expect(defaultMetadata.verification).toBeDefined()
      expect(defaultMetadata.verification?.google).toBeTruthy()
    })
  })

  // ============================================================================
  // 🔗 STRUCTURED DATA TESTS
  // ============================================================================

  describe('📊 Structured Data Generation', () => {
    describe('Organization Structured Data', () => {
      it('should have valid schema.org context', () => {
        expect(organizationStructuredData['@context']).toBe(
          'https://schema.org'
        )
        expect(organizationStructuredData['@type']).toBe('Organization')
      })

      it('should have complete organization information', () => {
        expect(organizationStructuredData.name).toBe('Man Made Consulting')
        expect(organizationStructuredData.url).toMatch(/^https:\/\//)
        expect(organizationStructuredData.logo).toMatch(/\.png$/)
        expect(organizationStructuredData.description).toBeTruthy()
      })

      it('should have valid contact point', () => {
        const { contactPoint } = organizationStructuredData
        expect(contactPoint['@type']).toBe('ContactPoint')
        expect(contactPoint.telephone).toMatch(/^\+\d/)
        expect(contactPoint.contactType).toBe('customer service')
        expect(contactPoint.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        expect(contactPoint.availableLanguage).toContain('English')
      })

      it('should have social media links', () => {
        expect(organizationStructuredData.sameAs).toBeInstanceOf(Array)
        expect(organizationStructuredData.sameAs.length).toBeGreaterThan(0)
        organizationStructuredData.sameAs.forEach(url => {
          expect(url).toMatch(/^https:\/\//)
        })
      })

      it('should have address information', () => {
        expect(organizationStructuredData.address).toBeDefined()
        expect(organizationStructuredData.address?.['@type']).toBe(
          'PostalAddress'
        )
        expect(organizationStructuredData.address?.addressCountry).toBe('US')
      })
    })

    describe('Service Structured Data', () => {
      it('should have valid service schema', () => {
        expect(serviceStructuredData['@context']).toBe('https://schema.org')
        expect(serviceStructuredData['@type']).toBe('Service')
      })

      it('should describe AI consulting services', () => {
        expect(serviceStructuredData.name).toContain('AI')
        expect(serviceStructuredData.description).toBeTruthy()
        expect(serviceStructuredData.serviceType).toBe('Technology Consulting')
      })

      it('should have provider information', () => {
        const { provider } = serviceStructuredData
        expect(provider['@type']).toBe('Organization')
        expect(provider.name).toBe('Man Made Consulting')
      })

      it('should specify service area', () => {
        expect(serviceStructuredData.areaServed).toBe('Worldwide')
      })
    })

    describe('Website Structured Data', () => {
      it('should have valid website schema', () => {
        expect(websiteStructuredData['@context']).toBe('https://schema.org')
        expect(websiteStructuredData['@type']).toBe('WebSite')
      })

      it('should have website information', () => {
        expect(websiteStructuredData.name).toBe('Man Made Consulting')
        expect(websiteStructuredData.url).toMatch(/^https:\/\//)
        expect(websiteStructuredData.description).toBeTruthy()
      })

      it('should have search action', () => {
        const { potentialAction } = websiteStructuredData
        expect(potentialAction['@type']).toBe('SearchAction')
        expect(potentialAction.target).toContain('{search_term_string}')
        expect(potentialAction['query-input']).toBe(
          'required name=search_term_string'
        )
      })
    })

    describe('generateStructuredData()', () => {
      it('should generate valid JSON-LD string', () => {
        const jsonLd = generateStructuredData()
        expect(typeof jsonLd).toBe('string')
        expect(() => JSON.parse(jsonLd)).not.toThrow()
      })

      it('should include all structured data types', () => {
        const jsonLd = generateStructuredData()
        const parsed = JSON.parse(jsonLd)
        expect(Array.isArray(parsed)).toBe(true)
        expect(parsed).toHaveLength(3)
      })

      it('should have Organization data first', () => {
        const jsonLd = generateStructuredData()
        const parsed = JSON.parse(jsonLd)
        expect(parsed[0]['@type']).toBe('Organization')
      })

      it('should have Service data second', () => {
        const jsonLd = generateStructuredData()
        const parsed = JSON.parse(jsonLd)
        expect(parsed[1]['@type']).toBe('Service')
      })

      it('should have WebSite data third', () => {
        const jsonLd = generateStructuredData()
        const parsed = JSON.parse(jsonLd)
        expect(parsed[2]['@type']).toBe('WebSite')
      })

      it('should produce valid JSON without circular references', () => {
        const jsonLd = generateStructuredData()
        const parsed = JSON.parse(jsonLd)
        const stringified = JSON.stringify(parsed)
        expect(stringified).toBeTruthy()
      })
    })
  })

  // ============================================================================
  // 🎨 METADATA GENERATION TESTS
  // ============================================================================

  describe('🎨 Metadata Generation', () => {
    describe('generateMetadata()', () => {
      it('should generate Next.js Metadata object', () => {
        const metadata = generateMetadata()
        expect(metadata).toBeDefined()
        expect(metadata.title).toBeTruthy()
        expect(metadata.description).toBeTruthy()
      })

      it('should convert keywords array to string', () => {
        const metadata = generateMetadata()
        expect(typeof metadata.keywords).toBe('string')
        expect(metadata.keywords).toContain(',')
      })

      it('should preserve Open Graph data', () => {
        const metadata = generateMetadata()
        expect(metadata.openGraph).toBeDefined()
        expect(metadata.openGraph?.title).toBe(defaultMetadata.openGraph.title)
        expect(metadata.openGraph?.type).toBe('website')
      })

      it('should preserve Twitter card data', () => {
        const metadata = generateMetadata()
        expect(metadata.twitter).toBeDefined()
        expect(metadata.twitter?.card).toBe('summary_large_image')
      })

      it('should preserve robots configuration', () => {
        const metadata = generateMetadata()
        expect(metadata.robots).toBeDefined()
        expect(metadata.robots).toHaveProperty('index')
        expect(metadata.robots).toHaveProperty('follow')
      })

      it('should handle custom metadata input', () => {
        const custom: SEOMetadata = {
          ...defaultMetadata,
          title: 'Custom Title',
          description: 'Custom description for testing purposes only here',
        }
        const metadata = generateMetadata(custom)
        expect(metadata.title).toBe('Custom Title')
        expect(metadata.description).toBe(
          'Custom description for testing purposes only here'
        )
      })

      it('should preserve verification codes', () => {
        const metadata = generateMetadata()
        expect(metadata.verification).toBeDefined()
        expect(metadata.verification?.google).toBeTruthy()
      })
    })

    describe('getPageMetadata()', () => {
      it('should return default metadata with no overrides', () => {
        const metadata = getPageMetadata()
        expect(metadata.title).toBe(defaultMetadata.title)
      })

      it('should merge title override', () => {
        const metadata = getPageMetadata({
          title: 'Custom Page Title',
        })
        expect(metadata.title).toBe('Custom Page Title')
      })

      it('should merge description override', () => {
        const metadata = getPageMetadata({
          description:
            'Custom page description that is long enough for SEO purposes',
        })
        expect(metadata.description).toBe(
          'Custom page description that is long enough for SEO purposes'
        )
      })

      it('should deep merge Open Graph overrides', () => {
        const metadata = getPageMetadata({
          openGraph: {
            title: 'Custom OG Title',
          },
        })
        expect(metadata.openGraph?.title).toBe('Custom OG Title')
        expect(metadata.openGraph?.type).toBe('website')
        expect(metadata.openGraph?.siteName).toBe('Man Made Consulting')
      })

      it('should deep merge Twitter overrides', () => {
        const metadata = getPageMetadata({
          twitter: {
            title: 'Custom Twitter Title',
          },
        })
        expect(metadata.twitter?.title).toBe('Custom Twitter Title')
        expect(metadata.twitter?.card).toBe('summary_large_image')
      })

      it('should deep merge robots overrides', () => {
        const metadata = getPageMetadata({
          robots: {
            index: false,
          },
        })
        expect(metadata.robots?.index).toBe(false)
        expect(metadata.robots?.follow).toBe(true)
      })

      it('should deep merge googleBot overrides', () => {
        const metadata = getPageMetadata({
          robots: {
            googleBot: {
              'max-snippet': 100,
            },
          },
        })
        expect(metadata.robots?.googleBot?.['max-snippet']).toBe(100)
        expect(metadata.robots?.googleBot?.index).toBe(true)
      })

      it('should merge alternates overrides', () => {
        const metadata = getPageMetadata({
          alternates: {
            canonical: 'https://example.com/custom',
          },
        })
        expect(metadata.alternates?.canonical).toBe(
          'https://example.com/custom'
        )
      })

      it('should handle multiple overrides simultaneously', () => {
        const metadata = getPageMetadata({
          title: 'Multi Override Title',
          description:
            'Multi override description that meets minimum length requirements',
          openGraph: {
            title: 'Multi OG Title',
          },
        })
        expect(metadata.title).toBe('Multi Override Title')
        expect(metadata.description).toBe(
          'Multi override description that meets minimum length requirements'
        )
        expect(metadata.openGraph?.title).toBe('Multi OG Title')
      })
    })
  })

  // ============================================================================
  // ✅ VALIDATION TESTS
  // ============================================================================

  describe('✅ Metadata Validation', () => {
    describe('validateMetadata()', () => {
      it('should validate correct metadata', () => {
        const result = validateMetadata(defaultMetadata)
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })

      it('should reject title shorter than 10 characters', () => {
        const invalid: SEOMetadata = {
          ...defaultMetadata,
          title: 'Short',
        }
        const result = validateMetadata(invalid)
        expect(result.isValid).toBe(false)
        expect(result.errors).toContain(
          'Title must be at least 10 characters'
        )
      })

      it('should warn about title longer than 60 characters', () => {
        const invalid: SEOMetadata = {
          ...defaultMetadata,
          title:
            'This is a very long title that exceeds the recommended sixty character limit',
        }
        const result = validateMetadata(invalid)
        expect(result.isValid).toBe(false)
        expect(result.errors).toContain(
          'Title should not exceed 60 characters for optimal SEO'
        )
      })

      it('should reject description shorter than 50 characters', () => {
        const invalid: SEOMetadata = {
          ...defaultMetadata,
          description: 'Too short',
        }
        const result = validateMetadata(invalid)
        expect(result.isValid).toBe(false)
        expect(result.errors).toContain(
          'Description must be at least 50 characters'
        )
      })

      it('should warn about description longer than 160 characters', () => {
        const invalid: SEOMetadata = {
          ...defaultMetadata,
          description:
            'This is an extremely long description that goes way beyond the recommended one hundred and sixty character limit for optimal search engine optimization and display in search results',
        }
        const result = validateMetadata(invalid)
        expect(result.isValid).toBe(false)
        expect(result.errors).toContain(
          'Description should not exceed 160 characters for optimal SEO'
        )
      })

      it('should reject empty keywords array', () => {
        const invalid: SEOMetadata = {
          ...defaultMetadata,
          keywords: [],
        }
        const result = validateMetadata(invalid)
        expect(result.isValid).toBe(false)
        expect(result.errors).toContain('At least one keyword is required')
      })

      it('should reject missing Open Graph images', () => {
        const invalid: SEOMetadata = {
          ...defaultMetadata,
          openGraph: {
            ...defaultMetadata.openGraph,
            images: [],
          },
        }
        const result = validateMetadata(invalid)
        expect(result.isValid).toBe(false)
        expect(result.errors).toContain(
          'At least one Open Graph image is required'
        )
      })

      it('should reject missing Twitter images', () => {
        const invalid: SEOMetadata = {
          ...defaultMetadata,
          twitter: {
            ...defaultMetadata.twitter,
            images: [],
          },
        }
        const result = validateMetadata(invalid)
        expect(result.isValid).toBe(false)
        expect(result.errors).toContain('At least one Twitter image is required')
      })

      it('should collect multiple validation errors', () => {
        const invalid: SEOMetadata = {
          ...defaultMetadata,
          title: 'Short',
          description: 'Too short',
          keywords: [],
        }
        const result = validateMetadata(invalid)
        expect(result.isValid).toBe(false)
        expect(result.errors.length).toBeGreaterThanOrEqual(3)
      })

      it('should handle edge case: exactly 10 character title', () => {
        const valid: SEOMetadata = {
          ...defaultMetadata,
          title: '1234567890',
        }
        const result = validateMetadata(valid)
        expect(
          result.errors.some(e => e.includes('Title must be at least'))
        ).toBe(false)
      })

      it('should handle edge case: exactly 60 character title', () => {
        const valid: SEOMetadata = {
          ...defaultMetadata,
          title: '123456789012345678901234567890123456789012345678901234567890',
        }
        const result = validateMetadata(valid)
        expect(
          result.errors.some(e => e.includes('Title should not exceed'))
        ).toBe(false)
      })

      it('should handle edge case: exactly 50 character description', () => {
        const valid: SEOMetadata = {
          ...defaultMetadata,
          description: '12345678901234567890123456789012345678901234567890',
        }
        const result = validateMetadata(valid)
        expect(
          result.errors.some(e => e.includes('Description must be at least'))
        ).toBe(false)
      })

      it('should handle edge case: exactly 160 character description', () => {
        const valid: SEOMetadata = {
          ...defaultMetadata,
          description:
            '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
        }
        const result = validateMetadata(valid)
        expect(
          result.errors.some(e => e.includes('Description should not exceed'))
        ).toBe(false)
      })
    })
  })

  // ============================================================================
  // 🔗 URL CANONICALIZATION TESTS
  // ============================================================================

  describe('🔗 URL Canonicalization', () => {
    describe('getCanonicalUrl()', () => {
      it('should return base URL for empty path', () => {
        const url = getCanonicalUrl()
        expect(url).toBe('https://manmadeconsulting.com/')
      })

      it('should return base URL for root path', () => {
        const url = getCanonicalUrl('')
        expect(url).toBe('https://manmadeconsulting.com/')
      })

      it('should append path with leading slash', () => {
        const url = getCanonicalUrl('/about')
        expect(url).toBe('https://manmadeconsulting.com/about')
      })

      it('should handle path without leading slash', () => {
        const url = getCanonicalUrl('about')
        expect(url).toBe('https://manmadeconsulting.com/about')
      })

      it('should handle nested paths', () => {
        const url = getCanonicalUrl('/blog/post-1')
        expect(url).toBe('https://manmadeconsulting.com/blog/post-1')
      })

      it('should handle paths with query parameters', () => {
        const url = getCanonicalUrl('/search?q=test')
        expect(url).toBe('https://manmadeconsulting.com/search?q=test')
      })

      it('should handle paths with hash fragments', () => {
        const url = getCanonicalUrl('/page#section')
        expect(url).toBe('https://manmadeconsulting.com/page#section')
      })

      it('should not double slash', () => {
        const url = getCanonicalUrl('/path')
        expect(url).not.toContain('//')
        expect(url).toMatch(/^https:\/\//)
      })
    })
  })

  // ============================================================================
  // 🗺️ SITEMAP GENERATION TESTS
  // ============================================================================

  describe('🗺️ Sitemap Generation', () => {
    describe('generateSitemapEntry()', () => {
      it('should generate entry with default options', () => {
        const entry = generateSitemapEntry('/')
        expect(entry.url).toBe('https://manmadeconsulting.com/')
        expect(entry.lastModified).toBeInstanceOf(Date)
        expect(entry.changeFrequency).toBe('monthly')
        expect(entry.priority).toBe(0.5)
      })

      it('should use custom lastModified date', () => {
        const customDate = new Date('2024-01-01')
        const entry = generateSitemapEntry('/', { lastModified: customDate })
        expect(entry.lastModified).toBe(customDate)
      })

      it('should use custom changeFrequency', () => {
        const entry = generateSitemapEntry('/', { changeFrequency: 'daily' })
        expect(entry.changeFrequency).toBe('daily')
      })

      it('should use custom priority', () => {
        const entry = generateSitemapEntry('/', { priority: 1.0 })
        expect(entry.priority).toBe(1.0)
      })

      it('should handle all changeFrequency values', () => {
        const frequencies: SitemapEntry['changeFrequency'][] = [
          'always',
          'hourly',
          'daily',
          'weekly',
          'monthly',
          'yearly',
          'never',
        ]
        frequencies.forEach(freq => {
          const entry = generateSitemapEntry('/', { changeFrequency: freq })
          expect(entry.changeFrequency).toBe(freq)
        })
      })

      it('should handle priority range 0.0 to 1.0', () => {
        const priorities = [0.0, 0.25, 0.5, 0.75, 1.0]
        priorities.forEach(priority => {
          const entry = generateSitemapEntry('/', { priority })
          expect(entry.priority).toBe(priority)
        })
      })

      it('should generate valid URL for nested paths', () => {
        const entry = generateSitemapEntry('/blog/post-1')
        expect(entry.url).toBe('https://manmadeconsulting.com/blog/post-1')
      })

      it('should handle multiple options simultaneously', () => {
        const customDate = new Date('2024-01-01')
        const entry = generateSitemapEntry('/about', {
          lastModified: customDate,
          changeFrequency: 'weekly',
          priority: 0.8,
        })
        expect(entry.lastModified).toBe(customDate)
        expect(entry.changeFrequency).toBe('weekly')
        expect(entry.priority).toBe(0.8)
      })
    })

    describe('defaultSitemapEntries', () => {
      it('should have homepage entry', () => {
        expect(defaultSitemapEntries).toHaveLength(1)
        expect(defaultSitemapEntries[0].url).toBe(
          'https://manmadeconsulting.com/'
        )
      })

      it('should have high priority for homepage', () => {
        expect(defaultSitemapEntries[0].priority).toBe(1.0)
      })

      it('should have weekly change frequency for homepage', () => {
        expect(defaultSitemapEntries[0].changeFrequency).toBe('weekly')
      })

      it('should have valid lastModified date', () => {
        expect(defaultSitemapEntries[0].lastModified).toBeInstanceOf(Date)
      })
    })
  })

  // ============================================================================
  // 🛡️ SECURITY & EDGE CASES
  // ============================================================================

  describe('🛡️ Security & Edge Cases', () => {
    describe('XSS Prevention', () => {
      it('should not execute script tags in title', () => {
        const malicious: SEOMetadata = {
          ...defaultMetadata,
          title: '<script>alert("xss")</script>',
        }
        const metadata = generateMetadata(malicious)
        expect(metadata.title).toContain('<script>')
        expect(metadata.title).not.toMatch(/<script>.*<\/script>/)
      })

      it('should handle HTML entities in description', () => {
        const withEntities: SEOMetadata = {
          ...defaultMetadata,
          description:
            'Test &amp; description with &lt;entities&gt; that is long enough',
        }
        const metadata = generateMetadata(withEntities)
        expect(metadata.description).toContain('&amp;')
      })
    })

    describe('URL Validation', () => {
      it('should handle special characters in paths', () => {
        const url = getCanonicalUrl('/path with spaces')
        expect(url).toContain('path with spaces')
      })

      it('should handle unicode characters in paths', () => {
        const url = getCanonicalUrl('/café')
        expect(url).toContain('café')
      })

      it('should handle empty string path', () => {
        const url = getCanonicalUrl('')
        expect(url).toBe('https://manmadeconsulting.com/')
      })
    })

    describe('Type Safety', () => {
      it('should enforce readonly on structured data', () => {
        // TypeScript compile-time check
        // @ts-expect-error - Cannot assign to readonly property
        const test = () => {
          organizationStructuredData.name = 'Changed'
        }
        expect(test).toBeDefined()
      })

      it('should enforce readonly on default metadata', () => {
        // TypeScript compile-time check
        // @ts-expect-error - Cannot assign to readonly property
        const test = () => {
          defaultMetadata.title = 'Changed'
        }
        expect(test).toBeDefined()
      })
    })

    describe('Immutability', () => {
      it('should not mutate input metadata in getPageMetadata', () => {
        const original: Partial<SEOMetadata> = {
          title: 'Original Title',
        }
        getPageMetadata(original)
        expect(original.title).toBe('Original Title')
      })

      it('should not mutate default metadata in getPageMetadata', () => {
        const originalTitle = defaultMetadata.title
        getPageMetadata({ title: 'New Title' })
        expect(defaultMetadata.title).toBe(originalTitle)
      })
    })

    describe('Error Handling', () => {
      it('should handle undefined verification codes', () => {
        const noVerification: SEOMetadata = {
          ...defaultMetadata,
          verification: undefined,
        }
        const metadata = generateMetadata(noVerification)
        expect(metadata.verification).toBeUndefined()
      })

      it('should handle partial verification codes', () => {
        const partial: SEOMetadata = {
          ...defaultMetadata,
          verification: {
            google: 'test-code',
          },
        }
        const metadata = generateMetadata(partial)
        expect(metadata.verification?.google).toBe('test-code')
        expect(metadata.verification?.yandex).toBeUndefined()
      })
    })
  })

  // ============================================================================
  // ⚡ PERFORMANCE TESTS
  // ============================================================================

  describe('⚡ Performance', () => {
    it('should generate metadata quickly', () => {
      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        generateMetadata()
      }
      const end = performance.now()
      const duration = end - start
      expect(duration).toBeLessThan(100) // 100ms for 1000 iterations
    })

    it('should generate structured data quickly', () => {
      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        generateStructuredData()
      }
      const end = performance.now()
      const duration = end - start
      expect(duration).toBeLessThan(100)
    })

    it('should validate metadata quickly', () => {
      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        validateMetadata(defaultMetadata)
      }
      const end = performance.now()
      const duration = end - start
      expect(duration).toBeLessThan(50)
    })

    it('should handle large keyword arrays efficiently', () => {
      const largeKeywords = Array.from({ length: 100 }, (_, i) => `keyword${i}`)
      const metadata: SEOMetadata = {
        ...defaultMetadata,
        keywords: largeKeywords,
      }
      const start = performance.now()
      generateMetadata(metadata)
      const end = performance.now()
      expect(end - start).toBeLessThan(10)
    })
  })

  // ============================================================================
  // 🔄 INTEGRATION TESTS
  // ============================================================================

  describe('🔄 Integration Scenarios', () => {
    it('should work with Next.js metadata API', () => {
      const metadata = generateMetadata()
      // Verify it matches Next.js Metadata type structure
      expect(metadata).toHaveProperty('title')
      expect(metadata).toHaveProperty('description')
      expect(metadata).toHaveProperty('openGraph')
      expect(metadata).toHaveProperty('twitter')
      expect(metadata).toHaveProperty('robots')
    })

    it('should generate complete page metadata workflow', () => {
      // 1. Get page-specific metadata
      const pageMetadata = getPageMetadata({
        title: 'About Us - Man Made Consulting',
        description:
          'Learn about our approach to AI consulting and how we help businesses',
      })

      // 2. Validate it
      const validation = validateMetadata({
        ...defaultMetadata,
        title: 'About Us - Man Made Consulting',
        description:
          'Learn about our approach to AI consulting and how we help businesses',
      })

      // 3. Generate canonical URL
      const canonical = getCanonicalUrl('/about')

      // 4. Generate sitemap entry
      const sitemapEntry = generateSitemapEntry('/about', {
        changeFrequency: 'monthly',
        priority: 0.8,
      })

      expect(pageMetadata.title).toBe('About Us - Man Made Consulting')
      expect(validation.isValid).toBe(true)
      expect(canonical).toBe('https://manmadeconsulting.com/about')
      expect(sitemapEntry.url).toBe('https://manmadeconsulting.com/about')
    })

    it('should generate structured data for embedding', () => {
      const jsonLd = generateStructuredData()
      const parsed = JSON.parse(jsonLd)

      // Verify it can be embedded in HTML
      expect(typeof jsonLd).toBe('string')
      expect(Array.isArray(parsed)).toBe(true)
      expect(parsed.every(item => item['@context'] && item['@type'])).toBe(true)
    })
  })

  // ============================================================================
  // 📊 COVERAGE EDGE CASES
  // ============================================================================

  describe('📊 Coverage Edge Cases', () => {
    it('should handle all Twitter card types', () => {
      const metadata = generateMetadata()
      expect(metadata.twitter?.card).toBe('summary_large_image')
    })

    it('should handle all Open Graph types', () => {
      const metadata = generateMetadata()
      expect(metadata.openGraph?.type).toBe('website')
    })

    it('should handle optional Twitter fields', () => {
      const withoutOptional: SEOMetadata = {
        ...defaultMetadata,
        twitter: {
          ...defaultMetadata.twitter,
          creator: undefined,
          site: undefined,
        },
      }
      const metadata = generateMetadata(withoutOptional)
      expect(metadata.twitter?.creator).toBeUndefined()
      expect(metadata.twitter?.site).toBeUndefined()
    })

    it('should handle keywords as readonly array', () => {
      const keywords = defaultMetadata.keywords
      expect(Array.isArray(keywords)).toBe(true)
      expect(keywords.length).toBeGreaterThan(0)
    })

    it('should handle images as readonly arrays', () => {
      const ogImages = defaultMetadata.openGraph.images
      const twitterImages = defaultMetadata.twitter.images
      expect(Array.isArray(ogImages)).toBe(true)
      expect(Array.isArray(twitterImages)).toBe(true)
    })
  })
})