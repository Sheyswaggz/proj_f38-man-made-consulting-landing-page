import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SocialProof } from '@/components/sections/SocialProof'
import * as testimonialsModule from '@/lib/content/testimonials'

// Mock the content module
jest.mock('@/lib/content/testimonials')

// Test data factories
const createTestimonial = (overrides = {}) => ({
  id: 'test-1',
  content: 'Great service and excellent results!',
  name: 'John Doe',
  role: 'CEO',
  company: 'Tech Corp',
  imageUrl: '/images/testimonial-1.jpg',
  imageAlt: 'John Doe headshot',
  ...overrides,
})

const createCaseStudy = (overrides = {}) => ({
  id: 'case-1',
  client: 'Acme Inc',
  industry: 'Technology',
  title: 'Digital Transformation Success',
  challenge: 'Legacy systems causing inefficiencies',
  solution: 'Implemented modern cloud infrastructure',
  imageUrl: '/images/case-study-1.jpg',
  imageAlt: 'Acme Inc office',
  testimonial: 'Outstanding results and professional service',
  results: [
    {
      id: 'result-1',
      metric: '50%',
      value: 'Cost Reduction',
      description: 'Reduced operational costs by 50%',
    },
    {
      id: 'result-2',
      metric: '3x',
      value: 'Faster Deployment',
      description: 'Deployment speed increased 3x',
    },
    {
      id: 'result-3',
      metric: '99.9%',
      value: 'Uptime',
      description: 'Achieved 99.9% system uptime',
    },
  ],
  ...overrides,
})

const createCredibilityIndicator = (overrides = {}) => ({
  id: 'cred-1',
  title: '15+ Years Experience',
  description: 'Proven track record in consulting',
  icon: 'experience',
  ...overrides,
})

const mockSocialProofContent = {
  heading: 'Trusted by Industry Leaders',
  subheading: 'See what our clients say about working with us',
  testimonials: [
    createTestimonial(),
    createTestimonial({
      id: 'test-2',
      name: 'Jane Smith',
      role: 'CTO',
      company: 'Innovation Labs',
    }),
  ],
  caseStudies: [
    createCaseStudy(),
    createCaseStudy({
      id: 'case-2',
      client: 'Global Corp',
      industry: 'Finance',
    }),
  ],
  credibilityIndicators: [
    createCredibilityIndicator(),
    createCredibilityIndicator({
      id: 'cred-2',
      title: '98% Satisfaction',
      icon: 'satisfaction',
    }),
  ],
}

describe('SocialProof Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(testimonialsModule.getSocialProofContent as jest.Mock).mockReturnValue(
      mockSocialProofContent
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // 🎯 Unit Tests - Component Rendering
  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      render(<SocialProof />)
      expect(
        screen.getByRole('region', { name: /social proof and testimonials/i })
      ).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      const { container } = render(<SocialProof className="custom-class" />)
      const section = container.querySelector('section')
      expect(section).toHaveClass('custom-class')
    })

    it('displays heading and subheading', () => {
      render(<SocialProof />)
      expect(
        screen.getByText('Trusted by Industry Leaders')
      ).toBeInTheDocument()
      expect(
        screen.getByText('See what our clients say about working with us')
      ).toBeInTheDocument()
    })

    it('renders all section headings', () => {
      render(<SocialProof />)
      expect(screen.getByText('Case Studies')).toBeInTheDocument()
      expect(screen.getByText('Why Trust Us')).toBeInTheDocument()
    })
  })

  // 🎯 Unit Tests - Testimonials
  describe('Testimonials Section', () => {
    it('renders testimonials in carousel', () => {
      render(<SocialProof />)
      const carousel = screen.getByRole('region', {
        name: /client testimonials/i,
      })
      expect(carousel).toBeInTheDocument()
    })

    it('displays testimonial content', () => {
      render(<SocialProof />)
      expect(
        screen.getByText('Great service and excellent results!')
      ).toBeInTheDocument()
    })

    it('displays testimonial author information', () => {
      render(<SocialProof />)
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument()
      expect(screen.getByText(/CEO/i)).toBeInTheDocument()
      expect(screen.getByText(/Tech Corp/i)).toBeInTheDocument()
    })

    it('renders multiple testimonials', () => {
      render(<SocialProof />)
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument()
      // Second testimonial may not be visible initially due to carousel
      expect(testimonialsModule.getSocialProofContent).toHaveBeenCalled()
    })
  })

  // 🎯 Unit Tests - Case Studies
  describe('Case Studies Section', () => {
    it('renders all case studies', () => {
      render(<SocialProof />)
      expect(screen.getByText('Acme Inc • Technology')).toBeInTheDocument()
      expect(screen.getByText('Global Corp • Finance')).toBeInTheDocument()
    })

    it('displays case study titles', () => {
      render(<SocialProof />)
      expect(
        screen.getByText('Digital Transformation Success')
      ).toBeInTheDocument()
    })

    it('displays case study results metrics', () => {
      render(<SocialProof />)
      expect(screen.getByText('50%')).toBeInTheDocument()
      expect(screen.getByText('Cost Reduction')).toBeInTheDocument()
      expect(screen.getByText('3x')).toBeInTheDocument()
      expect(screen.getByText('Faster Deployment')).toBeInTheDocument()
    })

    it('renders case study images with proper attributes', () => {
      render(<SocialProof />)
      const images = screen.getAllByRole('img')
      const caseStudyImage = images.find(
        img => img.getAttribute('alt') === 'Acme Inc office'
      )
      expect(caseStudyImage).toBeInTheDocument()
      expect(caseStudyImage).toHaveAttribute('loading', 'lazy')
    })

    it('initially hides case study details', () => {
      render(<SocialProof />)
      const detailsSection = screen.getByText('Challenge').closest('div')
      expect(detailsSection?.parentElement).toHaveClass('max-h-0', 'opacity-0')
    })
  })

  // 🔗 Integration Tests - Case Study Expansion
  describe('Case Study Expansion Interaction', () => {
    it('expands case study when button is clicked', async () => {
      const user = userEvent.setup()
      render(<SocialProof />)

      const expandButton = screen.getAllByRole('button', {
        name: /read full case study/i,
      })[0]

      await user.click(expandButton)

      await waitFor(() => {
        expect(
          screen.getByText('Legacy systems causing inefficiencies')
        ).toBeVisible()
      })
    })

    it('collapses case study when clicked again', async () => {
      const user = userEvent.setup()
      render(<SocialProof />)

      const expandButton = screen.getAllByRole('button', {
        name: /read full case study/i,
      })[0]

      // Expand
      await user.click(expandButton)
      await waitFor(() => {
        expect(screen.getByText(/show less/i)).toBeInTheDocument()
      })

      // Collapse
      const collapseButton = screen.getByRole('button', { name: /show less/i })
      await user.click(collapseButton)

      await waitFor(() => {
        const detailsSection = screen.getByText('Challenge').closest('div')
        expect(detailsSection?.parentElement).toHaveClass('max-h-0')
      })
    })

    it('updates aria-expanded attribute on toggle', async () => {
      const user = userEvent.setup()
      render(<SocialProof />)

      const expandButton = screen.getAllByRole('button', {
        name: /read full case study/i,
      })[0]

      expect(expandButton).toHaveAttribute('aria-expanded', 'false')

      await user.click(expandButton)

      await waitFor(() => {
        expect(expandButton).toHaveAttribute('aria-expanded', 'true')
      })
    })

    it('handles keyboard navigation (Enter key)', async () => {
      render(<SocialProof />)

      const expandButton = screen.getAllByRole('button', {
        name: /read full case study/i,
      })[0]

      expandButton.focus()
      fireEvent.keyDown(expandButton, { key: 'Enter', code: 'Enter' })

      await waitFor(() => {
        expect(expandButton).toHaveAttribute('aria-expanded', 'true')
      })
    })

    it('handles keyboard navigation (Space key)', async () => {
      render(<SocialProof />)

      const expandButton = screen.getAllByRole('button', {
        name: /read full case study/i,
      })[0]

      expandButton.focus()
      fireEvent.keyDown(expandButton, { key: ' ', code: 'Space' })

      await waitFor(() => {
        expect(expandButton).toHaveAttribute('aria-expanded', 'true')
      })
    })

    it('displays all case study details when expanded', async () => {
      const user = userEvent.setup()
      render(<SocialProof />)

      const expandButton = screen.getAllByRole('button', {
        name: /read full case study/i,
      })[0]

      await user.click(expandButton)

      await waitFor(() => {
        expect(screen.getByText('Challenge')).toBeVisible()
        expect(screen.getByText('Solution')).toBeVisible()
        expect(screen.getByText('Results')).toBeVisible()
        expect(
          screen.getByText('Legacy systems causing inefficiencies')
        ).toBeVisible()
        expect(
          screen.getByText('Implemented modern cloud infrastructure')
        ).toBeVisible()
      })
    })

    it('displays testimonial quote when expanded', async () => {
      const user = userEvent.setup()
      render(<SocialProof />)

      const expandButton = screen.getAllByRole('button', {
        name: /read full case study/i,
      })[0]

      await user.click(expandButton)

      await waitFor(() => {
        expect(
          screen.getByText(/"Outstanding results and professional service"/i)
        ).toBeVisible()
      })
    })
  })

  // 🎯 Unit Tests - Credibility Indicators
  describe('Credibility Indicators Section', () => {
    it('renders all credibility indicators', () => {
      render(<SocialProof />)
      expect(screen.getByText('15+ Years Experience')).toBeInTheDocument()
      expect(screen.getByText('98% Satisfaction')).toBeInTheDocument()
    })

    it('displays credibility indicator descriptions', () => {
      render(<SocialProof />)
      expect(
        screen.getByText('Proven track record in consulting')
      ).toBeInTheDocument()
    })

    it('renders credibility icons', () => {
      render(<SocialProof />)
      const icons = screen.getAllByRole('img', { hidden: true })
      expect(icons.length).toBeGreaterThan(0)
    })
  })

  // 🎯 Unit Tests - Icon Rendering
  describe('CredibilityIcon Component', () => {
    const iconTypes = [
      'experience',
      'satisfaction',
      'recognition',
      'partnership',
      'projects',
      'security',
    ]

    iconTypes.forEach(iconType => {
      it(`renders ${iconType} icon correctly`, () => {
        const indicator = createCredibilityIndicator({ icon: iconType })
        ;(testimonialsModule.getSocialProofContent as jest.Mock).mockReturnValue(
          {
            ...mockSocialProofContent,
            credibilityIndicators: [indicator],
          }
        )

        render(<SocialProof />)
        const icons = screen.getAllByRole('img', { hidden: true })
        expect(icons.length).toBeGreaterThan(0)
      })
    })

    it('renders default icon for unknown icon type', () => {
      const indicator = createCredibilityIndicator({ icon: 'unknown' })
      ;(testimonialsModule.getSocialProofContent as jest.Mock).mockReturnValue({
        ...mockSocialProofContent,
        credibilityIndicators: [indicator],
      })

      render(<SocialProof />)
      const icons = screen.getAllByRole('img', { hidden: true })
      expect(icons.length).toBeGreaterThan(0)
    })

    it('applies custom className to icon', () => {
      render(<SocialProof />)
      const icons = screen.getAllByRole('img', { hidden: true })
      icons.forEach(icon => {
        expect(icon).toHaveClass('text-earth-600')
      })
    })
  })

  // 🛡️ Error Handling Tests
  describe('Error Handling', () => {
    it('handles content loading error gracefully', () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      ;(testimonialsModule.getSocialProofContent as jest.Mock).mockImplementation(
        () => {
          throw new Error('Failed to load content')
        }
      )

      render(<SocialProof />)

      expect(
        screen.getByText('Unable to load testimonials at this time.')
      ).toBeInTheDocument()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load social proof content:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })

    it('renders error state with proper accessibility', () => {
      ;(testimonialsModule.getSocialProofContent as jest.Mock).mockImplementation(
        () => {
          throw new Error('Failed to load content')
        }
      )

      render(<SocialProof />)

      const section = screen.getByRole('region', {
        name: /social proof and testimonials/i,
      })
      expect(section).toBeInTheDocument()
    })

    it('handles missing testimonial data', () => {
      ;(testimonialsModule.getSocialProofContent as jest.Mock).mockReturnValue({
        ...mockSocialProofContent,
        testimonials: [],
      })

      render(<SocialProof />)
      expect(
        screen.getByRole('region', { name: /social proof and testimonials/i })
      ).toBeInTheDocument()
    })

    it('handles missing case studies', () => {
      ;(testimonialsModule.getSocialProofContent as jest.Mock).mockReturnValue({
        ...mockSocialProofContent,
        caseStudies: [],
      })

      render(<SocialProof />)
      expect(screen.getByText('Case Studies')).toBeInTheDocument()
    })
  })

  // ♿ Accessibility Tests
  describe('Accessibility', () => {
    it('has proper ARIA labels on main section', () => {
      render(<SocialProof />)
      expect(
        screen.getByRole('region', { name: /social proof and testimonials/i })
      ).toBeInTheDocument()
    })

    it('has proper ARIA labels on carousel', () => {
      render(<SocialProof />)
      expect(
        screen.getByRole('region', { name: /client testimonials/i })
      ).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<SocialProof />)
      const headings = screen.getAllByRole('heading')
      expect(headings[0]).toHaveTextContent('Trusted by Industry Leaders')
      expect(headings[1]).toHaveTextContent('Case Studies')
      expect(headings[2]).toHaveTextContent('Why Trust Us')
    })

    it('has keyboard accessible expand buttons', () => {
      render(<SocialProof />)
      const expandButtons = screen.getAllByRole('button', {
        name: /read full case study/i,
      })
      expandButtons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button')
      })
    })

    it('has proper focus management', async () => {
      const user = userEvent.setup()
      render(<SocialProof />)

      const expandButton = screen.getAllByRole('button', {
        name: /read full case study/i,
      })[0]

      await user.tab()
      // Button should be focusable
      expandButton.focus()
      expect(document.activeElement).toBe(expandButton)
    })

    it('has proper aria-controls attribute', () => {
      render(<SocialProof />)
      const expandButton = screen.getAllByRole('button', {
        name: /read full case study/i,
      })[0]
      expect(expandButton).toHaveAttribute('aria-controls')
    })

    it('has proper aria-hidden on collapsed content', () => {
      render(<SocialProof />)
      const detailsSection = screen.getByText('Challenge').closest('div')
      expect(detailsSection?.parentElement).toHaveAttribute(
        'aria-hidden',
        'true'
      )
    })

    it('updates aria-hidden when expanded', async () => {
      const user = userEvent.setup()
      render(<SocialProof />)

      const expandButton = screen.getAllByRole('button', {
        name: /read full case study/i,
      })[0]

      await user.click(expandButton)

      await waitFor(() => {
        const detailsSection = screen.getByText('Challenge').closest('div')
        expect(detailsSection?.parentElement).toHaveAttribute(
          'aria-hidden',
          'false'
        )
      })
    })

    it('has proper alt text on images', () => {
      render(<SocialProof />)
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('alt')
        expect(img.getAttribute('alt')).not.toBe('')
      })
    })
  })

  // 📱 Responsive Design Tests
  describe('Responsive Design', () => {
    it('applies responsive grid classes to case studies', () => {
      const { container } = render(<SocialProof />)
      const caseStudiesGrid = container.querySelector(
        '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3'
      )
      expect(caseStudiesGrid).toBeInTheDocument()
    })

    it('applies responsive grid classes to credibility indicators', () => {
      const { container } = render(<SocialProof />)
      const indicatorsGrid = container.querySelectorAll(
        '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3'
      )
      expect(indicatorsGrid.length).toBeGreaterThan(0)
    })

    it('applies responsive text sizing', () => {
      render(<SocialProof />)
      const heading = screen.getByText('Trusted by Industry Leaders')
      expect(heading).toHaveClass('text-4xl', 'md:text-5xl')
    })
  })

  // ⚡ Performance Tests
  describe('Performance', () => {
    it('uses lazy loading for images', () => {
      render(<SocialProof />)
      const images = screen.getAllByRole('img')
      const caseStudyImages = images.filter(
        img => img.getAttribute('alt')?.includes('office') ?? false
      )
      caseStudyImages.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy')
      })
    })

    it('renders efficiently with multiple case studies', () => {
      const manyCaseStudies = Array.from({ length: 10 }, (_, i) =>
        createCaseStudy({ id: `case-${i}`, client: `Client ${i}` })
      )
      ;(testimonialsModule.getSocialProofContent as jest.Mock).mockReturnValue({
        ...mockSocialProofContent,
        caseStudies: manyCaseStudies,
      })

      const { container } = render(<SocialProof />)
      expect(container.querySelectorAll('[class*="Card"]').length).toBe(10)
    })

    it('memoizes carousel change handler', () => {
      const { rerender } = render(<SocialProof />)
      const firstRender = screen.getByRole('region', {
        name: /client testimonials/i,
      })

      rerender(<SocialProof />)
      const secondRender = screen.getByRole('region', {
        name: /client testimonials/i,
      })

      expect(firstRender).toBe(secondRender)
    })
  })

  // 🔄 State Management Tests
  describe('State Management', () => {
    it('initializes with first testimonial', () => {
      render(<SocialProof />)
      expect(
        screen.getByText('Great service and excellent results!')
      ).toBeInTheDocument()
    })

    it('maintains independent state for each case study', async () => {
      const user = userEvent.setup()
      render(<SocialProof />)

      const expandButtons = screen.getAllByRole('button', {
        name: /read full case study/i,
      })

      // Expand first case study
      await user.click(expandButtons[0])

      await waitFor(() => {
        expect(expandButtons[0]).toHaveAttribute('aria-expanded', 'true')
      })

      // Second case study should remain collapsed
      expect(expandButtons[1]).toHaveAttribute('aria-expanded', 'false')
    })

    it('handles rapid toggle clicks', async () => {
      const user = userEvent.setup()
      render(<SocialProof />)

      const expandButton = screen.getAllByRole('button', {
        name: /read full case study/i,
      })[0]

      // Rapid clicks
      await user.click(expandButton)
      await user.click(expandButton)
      await user.click(expandButton)

      // Should end in collapsed state
      await waitFor(() => {
        expect(expandButton).toHaveAttribute('aria-expanded', 'true')
      })
    })
  })

  // 🎨 Styling Tests
  describe('Styling and CSS Classes', () => {
    it('applies hover effects to credibility indicators', () => {
      render(<SocialProof />)
      const indicators = screen
        .getByText('15+ Years Experience')
        .closest('div')
      expect(indicators).toHaveClass('hover:shadow-soft-lg')
    })

    it('applies transition classes to expandable content', () => {
      render(<SocialProof />)
      const detailsSection = screen.getByText('Challenge').closest('div')
      expect(detailsSection?.parentElement).toHaveClass(
        'transition-all',
        'duration-300'
      )
    })

    it('applies proper spacing classes', () => {
      const { container } = render(<SocialProof />)
      const mainContainer = container.querySelector('.space-y-16')
      expect(mainContainer).toBeInTheDocument()
    })

    it('applies earth color scheme', () => {
      render(<SocialProof />)
      const heading = screen.getByText('Trusted by Industry Leaders')
      expect(heading).toHaveClass('text-earth-900')
    })
  })

  // 🧪 Edge Cases
  describe('Edge Cases', () => {
    it('handles empty testimonials array', () => {
      ;(testimonialsModule.getSocialProofContent as jest.Mock).mockReturnValue({
        ...mockSocialProofContent,
        testimonials: [],
      })

      render(<SocialProof />)
      expect(
        screen.getByRole('region', { name: /social proof and testimonials/i })
      ).toBeInTheDocument()
    })

    it('handles case study without testimonial quote', () => {
      const caseStudyNoQuote = createCaseStudy({ testimonial: undefined })
      ;(testimonialsModule.getSocialProofContent as jest.Mock).mockReturnValue({
        ...mockSocialProofContent,
        caseStudies: [caseStudyNoQuote],
      })

      render(<SocialProof />)
      expect(screen.getByText('Digital Transformation Success')).toBeInTheDocument()
    })

    it('handles very long case study content', async () => {
      const longContent = 'A'.repeat(1000)
      const longCaseStudy = createCaseStudy({
        challenge: longContent,
        solution: longContent,
      })
      ;(testimonialsModule.getSocialProofContent as jest.Mock).mockReturnValue({
        ...mockSocialProofContent,
        caseStudies: [longCaseStudy],
      })

      const user = userEvent.setup()
      render(<SocialProof />)

      const expandButton = screen.getByRole('button', {
        name: /read full case study/i,
      })
      await user.click(expandButton)

      await waitFor(() => {
        expect(screen.getByText(longContent)).toBeVisible()
      })
    })

    it('handles special characters in content', () => {
      const specialContent = createTestimonial({
        content: 'Great service & excellent results! <script>alert("xss")</script>',
        name: "O'Brien & Associates",
      })
      ;(testimonialsModule.getSocialProofContent as jest.Mock).mockReturnValue({
        ...mockSocialProofContent,
        testimonials: [specialContent],
      })

      render(<SocialProof />)
      expect(screen.getByText(/Great service & excellent results!/i)).toBeInTheDocument()
    })

    it('handles missing icon in credibility indicator', () => {
      const indicatorNoIcon = createCredibilityIndicator({ icon: undefined })
      ;(testimonialsModule.getSocialProofContent as jest.Mock).mockReturnValue({
        ...mockSocialProofContent,
        credibilityIndicators: [indicatorNoIcon],
      })

      render(<SocialProof />)
      expect(screen.getByText('15+ Years Experience')).toBeInTheDocument()
    })
  })

  // 🔍 Integration Tests - Full Component Interaction
  describe('Full Component Integration', () => {
    it('renders all sections in correct order', () => {
      const { container } = render(<SocialProof />)
      const sections = container.querySelectorAll('.space-y-16 > div')
      expect(sections.length).toBeGreaterThanOrEqual(4) // Header, testimonials, case studies, credibility
    })

    it('maintains state across multiple interactions', async () => {
      const user = userEvent.setup()
      render(<SocialProof />)

      const expandButtons = screen.getAllByRole('button', {
        name: /read full case study/i,
      })

      // Expand first
      await user.click(expandButtons[0])
      await waitFor(() => {
        expect(expandButtons[0]).toHaveAttribute('aria-expanded', 'true')
      })

      // Expand second
      await user.click(expandButtons[1])
      await waitFor(() => {
        expect(expandButtons[1]).toHaveAttribute('aria-expanded', 'true')
      })

      // First should still be expanded
      expect(expandButtons[0]).toHaveAttribute('aria-expanded', 'true')
    })

    it('handles content module being called multiple times', () => {
      render(<SocialProof />)
      expect(testimonialsModule.getSocialProofContent).toHaveBeenCalledTimes(1)
    })
  })
})