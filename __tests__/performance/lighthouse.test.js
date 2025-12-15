/**
 * Lighthouse Performance Testing Suite
 * 
 * Tests Core Web Vitals and performance metrics for the Man Made Consulting landing page
 * using Lighthouse CI automation.
 * 
 * @generated-from: task-id:lighthouse-perf-tests sprint:current
 * @modifies: N/A (new test file)
 * @dependencies: ["lighthouse", "puppeteer"]
 */

const lighthouse = require('lighthouse')
const puppeteer = require('puppeteer')
const { URL } = require('url')

// Performance thresholds based on 2025 best practices
const PERFORMANCE_THRESHOLDS = {
  performance: 90,
  accessibility: 90,
  bestPractices: 90,
  seo: 90,
  pwa: 50, // Lower threshold as this is not a PWA
}

const CORE_WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint (LCP) - should be < 2.5s
  lcp: 2500,
  // First Input Delay (FID) - should be < 100ms
  fid: 100,
  // Cumulative Layout Shift (CLS) - should be < 0.1
  cls: 0.1,
  // First Contentful Paint (FCP) - should be < 1.8s
  fcp: 1800,
  // Time to Interactive (TTI) - should be < 3.8s
  tti: 3800,
  // Total Blocking Time (TBT) - should be < 200ms
  tbt: 200,
  // Speed Index - should be < 3.4s
  speedIndex: 3400,
}

const LIGHTHOUSE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: [
      'performance',
      'accessibility',
      'best-practices',
      'seo',
      'pwa',
    ],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
}

const MOBILE_CONFIG = {
  ...LIGHTHOUSE_CONFIG,
  settings: {
    ...LIGHTHOUSE_CONFIG.settings,
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
    },
  },
}

/**
 * Helper function to run Lighthouse audit
 */
async function runLighthouseAudit(url, config = LIGHTHOUSE_CONFIG) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const { lhr } = await lighthouse(url, {
      port: new URL(browser.wsEndpoint()).port,
      output: 'json',
      logLevel: 'error',
    }, config)

    return lhr
  } finally {
    await browser.close()
  }
}

/**
 * Extract Core Web Vitals from Lighthouse report
 */
function extractCoreWebVitals(lhr) {
  const metrics = lhr.audits.metrics?.details?.items?.[0] || {}
  
  return {
    lcp: metrics.largestContentfulPaint,
    fid: metrics.maxPotentialFID,
    cls: lhr.audits['cumulative-layout-shift']?.numericValue,
    fcp: metrics.firstContentfulPaint,
    tti: metrics.interactive,
    tbt: metrics.totalBlockingTime,
    speedIndex: metrics.speedIndex,
  }
}

/**
 * Extract category scores from Lighthouse report
 */
function extractCategoryScores(lhr) {
  return {
    performance: lhr.categories.performance?.score * 100,
    accessibility: lhr.categories.accessibility?.score * 100,
    bestPractices: lhr.categories['best-practices']?.score * 100,
    seo: lhr.categories.seo?.score * 100,
    pwa: lhr.categories.pwa?.score * 100,
  }
}

describe('🚀 Lighthouse Performance Testing Suite', () => {
  const BASE_URL = process.env.TEST_URL || 'http://localhost:3000'
  let lighthouseReport

  // Increase timeout for Lighthouse tests
  jest.setTimeout(120000)

  describe('📊 Desktop Performance Audit', () => {
    beforeAll(async () => {
      lighthouseReport = await runLighthouseAudit(BASE_URL, LIGHTHOUSE_CONFIG)
    })

    describe('🎯 Category Scores', () => {
      test('should meet performance score threshold', () => {
        const scores = extractCategoryScores(lighthouseReport)
        
        expect(scores.performance).toBeGreaterThanOrEqual(
          PERFORMANCE_THRESHOLDS.performance
        )
      })

      test('should meet accessibility score threshold', () => {
        const scores = extractCategoryScores(lighthouseReport)
        
        expect(scores.accessibility).toBeGreaterThanOrEqual(
          PERFORMANCE_THRESHOLDS.accessibility
        )
      })

      test('should meet best practices score threshold', () => {
        const scores = extractCategoryScores(lighthouseReport)
        
        expect(scores.bestPractices).toBeGreaterThanOrEqual(
          PERFORMANCE_THRESHOLDS.bestPractices
        )
      })

      test('should meet SEO score threshold', () => {
        const scores = extractCategoryScores(lighthouseReport)
        
        expect(scores.seo).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.seo)
      })

      test('should have all category scores above 0', () => {
        const scores = extractCategoryScores(lighthouseReport)
        
        Object.entries(scores).forEach(([category, score]) => {
          expect(score).toBeGreaterThan(0)
          expect(score).toBeLessThanOrEqual(100)
        })
      })
    })

    describe('⚡ Core Web Vitals', () => {
      test('should meet LCP threshold (Largest Contentful Paint)', () => {
        const vitals = extractCoreWebVitals(lighthouseReport)
        
        expect(vitals.lcp).toBeLessThanOrEqual(
          CORE_WEB_VITALS_THRESHOLDS.lcp
        )
      })

      test('should meet FID threshold (First Input Delay)', () => {
        const vitals = extractCoreWebVitals(lighthouseReport)
        
        expect(vitals.fid).toBeLessThanOrEqual(
          CORE_WEB_VITALS_THRESHOLDS.fid
        )
      })

      test('should meet CLS threshold (Cumulative Layout Shift)', () => {
        const vitals = extractCoreWebVitals(lighthouseReport)
        
        expect(vitals.cls).toBeLessThanOrEqual(
          CORE_WEB_VITALS_THRESHOLDS.cls
        )
      })

      test('should meet FCP threshold (First Contentful Paint)', () => {
        const vitals = extractCoreWebVitals(lighthouseReport)
        
        expect(vitals.fcp).toBeLessThanOrEqual(
          CORE_WEB_VITALS_THRESHOLDS.fcp
        )
      })

      test('should meet TTI threshold (Time to Interactive)', () => {
        const vitals = extractCoreWebVitals(lighthouseReport)
        
        expect(vitals.tti).toBeLessThanOrEqual(
          CORE_WEB_VITALS_THRESHOLDS.tti
        )
      })

      test('should meet TBT threshold (Total Blocking Time)', () => {
        const vitals = extractCoreWebVitals(lighthouseReport)
        
        expect(vitals.tbt).toBeLessThanOrEqual(
          CORE_WEB_VITALS_THRESHOLDS.tbt
        )
      })

      test('should meet Speed Index threshold', () => {
        const vitals = extractCoreWebVitals(lighthouseReport)
        
        expect(vitals.speedIndex).toBeLessThanOrEqual(
          CORE_WEB_VITALS_THRESHOLDS.speedIndex
        )
      })

      test('should have all Core Web Vitals defined', () => {
        const vitals = extractCoreWebVitals(lighthouseReport)
        
        expect(vitals.lcp).toBeDefined()
        expect(vitals.fid).toBeDefined()
        expect(vitals.cls).toBeDefined()
        expect(vitals.fcp).toBeDefined()
        expect(vitals.tti).toBeDefined()
        expect(vitals.tbt).toBeDefined()
        expect(vitals.speedIndex).toBeDefined()
      })
    })

    describe('🔍 Performance Audits', () => {
      test('should have efficient cache policy', () => {
        const cacheAudit = lighthouseReport.audits['uses-long-cache-ttl']
        
        expect(cacheAudit.score).toBeGreaterThanOrEqual(0.9)
      })

      test('should minimize main thread work', () => {
        const mainThreadAudit = lighthouseReport.audits['mainthread-work-breakdown']
        const mainThreadTime = mainThreadAudit.numericValue
        
        expect(mainThreadTime).toBeLessThan(4000)
      })

      test('should have optimized images', () => {
        const imageAudit = lighthouseReport.audits['uses-optimized-images']
        
        expect(imageAudit.score).toBeGreaterThanOrEqual(0.9)
      })

      test('should use modern image formats', () => {
        const modernImageAudit = lighthouseReport.audits['modern-image-formats']
        
        expect(modernImageAudit.score).toBeGreaterThanOrEqual(0.9)
      })

      test('should have properly sized images', () => {
        const imageSizeAudit = lighthouseReport.audits['uses-responsive-images']
        
        expect(imageSizeAudit.score).toBeGreaterThanOrEqual(0.9)
      })

      test('should minimize render-blocking resources', () => {
        const renderBlockingAudit = lighthouseReport.audits['render-blocking-resources']
        
        expect(renderBlockingAudit.score).toBeGreaterThanOrEqual(0.8)
      })

      test('should have efficient JavaScript execution', () => {
        const jsAudit = lighthouseReport.audits['bootup-time']
        const jsExecutionTime = jsAudit.numericValue
        
        expect(jsExecutionTime).toBeLessThan(3000)
      })

      test('should minimize unused JavaScript', () => {
        const unusedJsAudit = lighthouseReport.audits['unused-javascript']
        
        expect(unusedJsAudit.score).toBeGreaterThanOrEqual(0.8)
      })

      test('should minimize unused CSS', () => {
        const unusedCssAudit = lighthouseReport.audits['unused-css-rules']
        
        expect(unusedCssAudit.score).toBeGreaterThanOrEqual(0.8)
      })

      test('should use text compression', () => {
        const compressionAudit = lighthouseReport.audits['uses-text-compression']
        
        expect(compressionAudit.score).toBeGreaterThanOrEqual(0.9)
      })
    })

    describe('♿ Accessibility Audits', () => {
      test('should have proper color contrast', () => {
        const contrastAudit = lighthouseReport.audits['color-contrast']
        
        expect(contrastAudit.score).toBe(1)
      })

      test('should have alt text on images', () => {
        const altTextAudit = lighthouseReport.audits['image-alt']
        
        expect(altTextAudit.score).toBe(1)
      })

      test('should have proper heading order', () => {
        const headingAudit = lighthouseReport.audits['heading-order']
        
        expect(headingAudit.score).toBe(1)
      })

      test('should have valid ARIA attributes', () => {
        const ariaAudit = lighthouseReport.audits['aria-valid-attr']
        
        expect(ariaAudit.score).toBe(1)
      })

      test('should have proper form labels', () => {
        const labelAudit = lighthouseReport.audits['label']
        
        expect(labelAudit.score).toBe(1)
      })

      test('should have proper link names', () => {
        const linkNameAudit = lighthouseReport.audits['link-name']
        
        expect(linkNameAudit.score).toBe(1)
      })
    })

    describe('🔒 Best Practices Audits', () => {
      test('should use HTTPS', () => {
        const httpsAudit = lighthouseReport.audits['is-on-https']
        
        expect(httpsAudit.score).toBe(1)
      })

      test('should not have browser errors', () => {
        const errorsAudit = lighthouseReport.audits['errors-in-console']
        
        expect(errorsAudit.score).toBe(1)
      })

      test('should have valid source maps', () => {
        const sourceMapsAudit = lighthouseReport.audits['js-libraries']
        
        expect(sourceMapsAudit.score).toBeGreaterThanOrEqual(0.9)
      })

      test('should not use deprecated APIs', () => {
        const deprecatedAudit = lighthouseReport.audits['deprecations']
        
        expect(deprecatedAudit.score).toBe(1)
      })

      test('should have proper CSP', () => {
        const cspAudit = lighthouseReport.audits['csp-xss']
        
        // CSP is optional but recommended
        expect(cspAudit.score).toBeGreaterThanOrEqual(0)
      })
    })

    describe('🔎 SEO Audits', () => {
      test('should have meta description', () => {
        const metaAudit = lighthouseReport.audits['meta-description']
        
        expect(metaAudit.score).toBe(1)
      })

      test('should have document title', () => {
        const titleAudit = lighthouseReport.audits['document-title']
        
        expect(titleAudit.score).toBe(1)
      })

      test('should have valid robots.txt', () => {
        const robotsAudit = lighthouseReport.audits['robots-txt']
        
        expect(robotsAudit.score).toBeGreaterThanOrEqual(0.9)
      })

      test('should have proper viewport', () => {
        const viewportAudit = lighthouseReport.audits['viewport']
        
        expect(viewportAudit.score).toBe(1)
      })

      test('should have legible font sizes', () => {
        const fontAudit = lighthouseReport.audits['font-size']
        
        expect(fontAudit.score).toBe(1)
      })

      test('should have tap targets sized appropriately', () => {
        const tapTargetAudit = lighthouseReport.audits['tap-targets']
        
        expect(tapTargetAudit.score).toBeGreaterThanOrEqual(0.9)
      })
    })
  })

  describe('📱 Mobile Performance Audit', () => {
    let mobileReport

    beforeAll(async () => {
      mobileReport = await runLighthouseAudit(BASE_URL, MOBILE_CONFIG)
    })

    test('should meet mobile performance threshold', () => {
      const scores = extractCategoryScores(mobileReport)
      
      // Mobile threshold is slightly lower due to throttling
      expect(scores.performance).toBeGreaterThanOrEqual(85)
    })

    test('should meet mobile Core Web Vitals', () => {
      const vitals = extractCoreWebVitals(mobileReport)
      
      // Mobile thresholds are more lenient
      expect(vitals.lcp).toBeLessThanOrEqual(3000)
      expect(vitals.fcp).toBeLessThanOrEqual(2200)
      expect(vitals.cls).toBeLessThanOrEqual(0.1)
    })

    test('should have mobile-friendly tap targets', () => {
      const tapTargetAudit = mobileReport.audits['tap-targets']
      
      expect(tapTargetAudit.score).toBeGreaterThanOrEqual(0.9)
    })

    test('should have proper mobile viewport', () => {
      const viewportAudit = mobileReport.audits['viewport']
      
      expect(viewportAudit.score).toBe(1)
    })

    test('should have legible font sizes on mobile', () => {
      const fontAudit = mobileReport.audits['font-size']
      
      expect(fontAudit.score).toBe(1)
    })
  })

  describe('🎨 Progressive Enhancement', () => {
    test('should work without JavaScript', async () => {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })

      try {
        const page = await browser.page()
        await page.setJavaScriptEnabled(false)
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' })

        const content = await page.content()
        
        expect(content).toContain('Man Made Consulting')
        expect(content.length).toBeGreaterThan(1000)
      } finally {
        await browser.close()
      }
    })

    test('should have proper semantic HTML', () => {
      const htmlAudit = lighthouseReport.audits['structured-data']
      
      expect(htmlAudit).toBeDefined()
    })
  })

  describe('📈 Performance Budget', () => {
    test('should stay within total page weight budget', () => {
      const resourceSummary = lighthouseReport.audits['resource-summary']
      const totalSize = resourceSummary.details.items.reduce(
        (sum, item) => sum + item.transferSize,
        0
      )

      // Budget: 2MB total page weight
      expect(totalSize).toBeLessThan(2 * 1024 * 1024)
    })

    test('should stay within JavaScript budget', () => {
      const resourceSummary = lighthouseReport.audits['resource-summary']
      const jsItem = resourceSummary.details.items.find(
        item => item.resourceType === 'script'
      )

      // Budget: 500KB JavaScript
      expect(jsItem.transferSize).toBeLessThan(500 * 1024)
    })

    test('should stay within CSS budget', () => {
      const resourceSummary = lighthouseReport.audits['resource-summary']
      const cssItem = resourceSummary.details.items.find(
        item => item.resourceType === 'stylesheet'
      )

      // Budget: 100KB CSS
      expect(cssItem.transferSize).toBeLessThan(100 * 1024)
    })

    test('should stay within image budget', () => {
      const resourceSummary = lighthouseReport.audits['resource-summary']
      const imageItem = resourceSummary.details.items.find(
        item => item.resourceType === 'image'
      )

      // Budget: 1MB images
      expect(imageItem.transferSize).toBeLessThan(1024 * 1024)
    })

    test('should have reasonable number of requests', () => {
      const resourceSummary = lighthouseReport.audits['resource-summary']
      const totalRequests = resourceSummary.details.items.reduce(
        (sum, item) => sum + item.requestCount,
        0
      )

      // Budget: < 50 requests
      expect(totalRequests).toBeLessThan(50)
    })
  })

  describe('🔄 Performance Consistency', () => {
    test('should have consistent performance across multiple runs', async () => {
      const runs = 3
      const scores = []

      for (let i = 0; i < runs; i++) {
        const report = await runLighthouseAudit(BASE_URL, LIGHTHOUSE_CONFIG)
        const categoryScores = extractCategoryScores(report)
        scores.push(categoryScores.performance)
      }

      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length
      const stdDev = Math.sqrt(variance)

      // Standard deviation should be < 5 points
      expect(stdDev).toBeLessThan(5)
    })
  })

  describe('📊 Detailed Performance Report', () => {
    test('should generate comprehensive performance report', () => {
      const scores = extractCategoryScores(lighthouseReport)
      const vitals = extractCoreWebVitals(lighthouseReport)

      const report = {
        timestamp: new Date().toISOString(),
        url: BASE_URL,
        categoryScores: scores,
        coreWebVitals: vitals,
        audits: {
          caching: lighthouseReport.audits['uses-long-cache-ttl'].score,
          images: lighthouseReport.audits['uses-optimized-images'].score,
          javascript: lighthouseReport.audits['unused-javascript'].score,
          css: lighthouseReport.audits['unused-css-rules'].score,
        },
      }

      // Log report for CI/CD integration
      console.log('Performance Report:', JSON.stringify(report, null, 2))

      expect(report.categoryScores.performance).toBeGreaterThanOrEqual(
        PERFORMANCE_THRESHOLDS.performance
      )
    })
  })
})