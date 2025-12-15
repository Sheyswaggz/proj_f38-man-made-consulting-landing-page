import React from 'react'
import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Approach, ApproachProps } from '@/components/sections/Approach'
import { getApproachContent } from '@/lib/content/approach'

// Mock dependencies
jest.mock('@/lib/content/approach')
jest.mock('@/components/ui/Section', () => ({
  Section: ({
    children,
    id,
    variant,
    padding,
    className,
    ariaLabel,
  }: {
    children: React.ReactNode
    id: string
    variant: string
    padding: string
    className?: string
    ariaLabel: string
  }) => (
    <section
      id={id}
      data-variant={variant}
      data-padding={padding}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  ),
}))

jest.mock('@/components/ui/ProcessStep', () => ({
  ProcessStep: ({
    number,
    title,
    description,
    icon,
    isLast,
    className,
  }: {
    number: number
    title: string
    description: string
    icon: string
    isLast: boolean
    className?: string
  }) => (
    <div
      data-testid={`process-step-${number}`}
      data-is-last={isLast}
      className={className}
      role="listitem"
    >
      <span data-testid="step-number">{number}</span>
      <span data-testid="step-icon">{icon}</span>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  ),
}))

// Mock content data
const mockContent = {
  heading: 'Human-Centered AI Consulting',
  subheading: 'Collaboration Over Automation',
  introduction:
    'We believe AI should augment human capabilities, not replace them. Our approach focuses on empowering your team.',
  methodologySteps: [
    {
      id: 'step-1',
      number: 1,
      title: 'Discovery & Assessment',
      description: 'Understanding your unique challenges and opportunities',
      icon: '🔍',
    },
    {
      id: 'step-2',
      number: 2,
      title: 'Strategy Development',
      description: 'Creating a tailored AI roadmap for your organization',
      icon: '📋',
    },
    {
      id: 'step-3',
      number: 3,
      title: 'Implementation & Training',
      description: 'Hands-on support and team enablement',
      icon: '🚀',
    },
  ],
  corePrinciples: [
    {
      id: 'principle-1',
      title: 'Human-First Design',
      description:
        'AI solutions designed to enhance human decision-making and creativity',
    },
    {
      id: 'principle-2',
      title: 'Transparent Processes',
      description:
        'Clear explanations of how AI systems work and make decisions',
    },
    {
      id: 'principle-3',
      title: 'Ethical Implementation',
      description: 'Responsible AI deployment with consideration for impact',
    },
    {
      id: 'principle-4',
      title: 'Continuous Learning',
      description: 'Ongoing support and adaptation as your needs evolve',
    },
  ],
  differentiators: [
    {
      id: 'diff-1',
      title: 'Approach to AI Integration',
      traditional: 'Replace human workers with automation',
      ourApproach: 'Augment human capabilities and decision-making',
      impact:
        'Teams feel empowered rather than threatened, leading to better adoption',
    },
    {
      id: 'diff-2',
      title: 'Implementation Strategy',
      traditional: 'One-size-fits-all solutions',
      ourApproach: 'Customized strategies aligned with your culture',
      impact: 'Higher success rates and sustainable transformation',
    },
  ],
  closingStatement:
    'Our approach ensures AI becomes a tool for human flourishing, not replacement.',
}

describe('Approach Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getApproachContent as jest.Mock).mockReturnValue(mockContent)
  })

  // ============================================
  // 🎯 UNIT TESTS - Component Rendering
  // ============================================

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      render(<Approach />)
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      const customClass = 'custom-approach-class'
      render(<Approach className={customClass} />)
      const section = screen.getByRole('region')
      expect(section).toHaveClass(customClass)
    })

    it('should have correct section id', () => {
      render(<Approach />)
      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('id', 'approach')
    })

    it('should apply correct variant and padding', () => {
      render(<Approach />)
      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('data-variant', 'earth')
      expect(section).toHaveAttribute('data-padding', 'xl')
    })

    it('should have proper aria-label', () => {
      render(<Approach />)
      expect(
        screen.getByLabelText('Our Approach and Methodology')
      ).toBeInTheDocument()
    })
  })

  // ============================================
  // 🎯 UNIT TESTS - Content Display
  // ============================================

  describe('Header Section', () => {
    it('should display main heading', () => {
      render(<Approach />)
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: mockContent.heading,
        })
      ).toBeInTheDocument()
    })

    it('should display subheading', () => {
      render(<Approach />)
      expect(screen.getByText(mockContent.subheading)).toBeInTheDocument()
    })

    it('should display introduction text', () => {
      render(<Approach />)
      expect(screen.getByText(mockContent.introduction)).toBeInTheDocument()
    })

    it('should apply correct heading styles', () => {
      render(<Approach />)
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveClass('text-4xl', 'sm:text-5xl', 'font-serif')
    })
  })

  // ============================================
  // 🎯 UNIT TESTS - Methodology Steps
  // ============================================

  describe('Methodology Steps', () => {
    it('should render methodology section heading', () => {
      render(<Approach />)
      expect(
        screen.getByRole('heading', {
          level: 3,
          name: 'Our Methodology',
        })
      ).toBeInTheDocument()
    })

    it('should render all methodology steps', () => {
      render(<Approach />)
      mockContent.methodologySteps.forEach(step => {
        expect(screen.getByTestId(`process-step-${step.number}`)).toBeInTheDocument()
      })
    })

    it('should pass correct props to ProcessStep components', () => {
      render(<Approach />)
      const firstStep = screen.getByTestId('process-step-1')
      expect(within(firstStep).getByText('Discovery & Assessment')).toBeInTheDocument()
      expect(within(firstStep).getByTestId('step-icon')).toHaveTextContent('🔍')
    })

    it('should mark last step correctly', () => {
      render(<Approach />)
      const lastStep = screen.getByTestId('process-step-3')
      expect(lastStep).toHaveAttribute('data-is-last', 'true')
    })

    it('should have proper list semantics', () => {
      render(<Approach />)
      const list = screen.getByRole('list', { name: 'Methodology steps' })
      expect(list).toBeInTheDocument()
    })

    it('should apply transition classes to steps', () => {
      render(<Approach />)
      const step = screen.getByTestId('process-step-1')
      expect(step).toHaveClass('transition-opacity', 'duration-500')
    })
  })

  // ============================================
  // 🎯 UNIT TESTS - Core Principles
  // ============================================

  describe('Core Principles', () => {
    it('should render core principles section heading', () => {
      render(<Approach />)
      expect(
        screen.getByRole('heading', {
          level: 3,
          name: 'Core Principles',
        })
      ).toBeInTheDocument()
    })

    it('should render all core principles', () => {
      render(<Approach />)
      mockContent.corePrinciples.forEach(principle => {
        expect(screen.getByText(principle.title)).toBeInTheDocument()
        expect(screen.getByText(principle.description)).toBeInTheDocument()
      })
    })

    it('should have proper article semantics for principles', () => {
      render(<Approach />)
      const articles = screen.getAllByRole('article')
      const principleArticles = articles.filter(article =>
        article.getAttribute('aria-labelledby')?.startsWith('principle-')
      )
      expect(principleArticles).toHaveLength(
        mockContent.corePrinciples.length
      )
    })

    it('should have correct aria-labelledby for each principle', () => {
      render(<Approach />)
      mockContent.corePrinciples.forEach(principle => {
        const article = screen
          .getAllByRole('article')
          .find(
            el =>
              el.getAttribute('aria-labelledby') ===
              `principle-${principle.id}-title`
          )
        expect(article).toBeInTheDocument()
      })
    })

    it('should render checkmark icon for each principle', () => {
      render(<Approach />)
      const icons = screen.getAllByRole('article').filter(article =>
        article.getAttribute('aria-labelledby')?.startsWith('principle-')
      )
      icons.forEach(icon => {
        const svg = icon.querySelector('svg')
        expect(svg).toBeInTheDocument()
        expect(svg).toHaveAttribute('aria-hidden', 'true')
      })
    })

    it('should apply hover styles to principle cards', () => {
      render(<Approach />)
      const firstPrinciple = screen
        .getAllByRole('article')
        .find(
          el =>
            el.getAttribute('aria-labelledby') === 'principle-principle-1-title'
        )
      expect(firstPrinciple).toHaveClass('hover:shadow-elevated')
    })
  })

  // ============================================
  // 🎯 UNIT TESTS - Differentiators
  // ============================================

  describe('Differentiators', () => {
    it('should render differentiators section heading', () => {
      render(<Approach />)
      expect(
        screen.getByRole('heading', {
          level: 3,
          name: "How We're Different",
        })
      ).toBeInTheDocument()
    })

    it('should render all differentiators', () => {
      render(<Approach />)
      mockContent.differentiators.forEach(diff => {
        expect(screen.getByText(diff.title)).toBeInTheDocument()
      })
    })

    it('should display traditional approach for each differentiator', () => {
      render(<Approach />)
      mockContent.differentiators.forEach(diff => {
        expect(screen.getByText(diff.traditional)).toBeInTheDocument()
      })
    })

    it('should display our approach for each differentiator', () => {
      render(<Approach />)
      mockContent.differentiators.forEach(diff => {
        expect(screen.getByText(diff.ourApproach)).toBeInTheDocument()
      })
    })

    it('should display impact for each differentiator', () => {
      render(<Approach />)
      mockContent.differentiators.forEach(diff => {
        expect(screen.getByText(diff.impact)).toBeInTheDocument()
      })
    })

    it('should have proper labels for approach sections', () => {
      render(<Approach />)
      expect(screen.getAllByText('Traditional Approach')).toHaveLength(
        mockContent.differentiators.length
      )
      expect(screen.getAllByText('Our Approach')).toHaveLength(
        mockContent.differentiators.length
      )
      expect(screen.getAllByText('Impact')).toHaveLength(
        mockContent.differentiators.length
      )
    })

    it('should have correct aria-labelledby for differentiators', () => {
      render(<Approach />)
      mockContent.differentiators.forEach(diff => {
        const article = screen
          .getAllByRole('article')
          .find(
            el =>
              el.getAttribute('aria-labelledby') === `diff-${diff.id}-title`
          )
        expect(article).toBeInTheDocument()
      })
    })
  })

  // ============================================
  // 🎯 UNIT TESTS - Closing Statement
  // ============================================

  describe('Closing Statement', () => {
    it('should render closing statement', () => {
      render(<Approach />)
      expect(
        screen.getByText(mockContent.closingStatement)
      ).toBeInTheDocument()
    })

    it('should apply correct styling to closing statement', () => {
      render(<Approach />)
      const closingText = screen.getByText(mockContent.closingStatement)
      const container = closingText.closest('div')
      expect(container).toHaveClass('bg-earth-900', 'rounded-lg')
    })
  })

  // ============================================
  // 🔗 INTEGRATION TESTS - Content Loading
  // ============================================

  describe('Content Integration', () => {
    it('should call getApproachContent on mount', () => {
      render(<Approach />)
      expect(getApproachContent).toHaveBeenCalledTimes(1)
    })

    it('should handle empty methodology steps gracefully', () => {
      ;(getApproachContent as jest.Mock).mockReturnValue({
        ...mockContent,
        methodologySteps: [],
      })
      render(<Approach />)
      expect(
        screen.queryByTestId('process-step-1')
      ).not.toBeInTheDocument()
    })

    it('should handle empty core principles gracefully', () => {
      ;(getApproachContent as jest.Mock).mockReturnValue({
        ...mockContent,
        corePrinciples: [],
      })
      render(<Approach />)
      const articles = screen.getAllByRole('article')
      const principleArticles = articles.filter(article =>
        article.getAttribute('aria-labelledby')?.startsWith('principle-')
      )
      expect(principleArticles).toHaveLength(0)
    })

    it('should handle empty differentiators gracefully', () => {
      ;(getApproachContent as jest.Mock).mockReturnValue({
        ...mockContent,
        differentiators: [],
      })
      render(<Approach />)
      const articles = screen.getAllByRole('article')
      const diffArticles = articles.filter(article =>
        article.getAttribute('aria-labelledby')?.startsWith('diff-')
      )
      expect(diffArticles).toHaveLength(0)
    })
  })

  // ============================================
  // 🛡️ ACCESSIBILITY TESTS
  // ============================================

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Approach />)
      const h2 = screen.getByRole('heading', { level: 2 })
      const h3s = screen.getAllByRole('heading', { level: 3 })
      const h4s = screen.getAllByRole('heading', { level: 4 })

      expect(h2).toBeInTheDocument()
      expect(h3s.length).toBeGreaterThan(0)
      expect(h4s.length).toBeGreaterThan(0)
    })

    it('should have aria-labels for sections', () => {
      render(<Approach />)
      expect(
        screen.getByLabelText('Our Approach and Methodology')
      ).toBeInTheDocument()
      expect(screen.getByLabelText('Methodology steps')).toBeInTheDocument()
    })

    it('should have proper article semantics', () => {
      render(<Approach />)
      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThan(0)
      articles.forEach(article => {
        expect(article).toHaveAttribute('aria-labelledby')
      })
    })

    it('should hide decorative icons from screen readers', () => {
      render(<Approach />)
      const svgs = document.querySelectorAll('svg')
      svgs.forEach(svg => {
        expect(svg).toHaveAttribute('aria-hidden', 'true')
      })
    })

    it('should have proper list semantics for methodology', () => {
      render(<Approach />)
      const list = screen.getByRole('list', { name: 'Methodology steps' })
      const listItems = within(list).getAllByRole('listitem')
      expect(listItems).toHaveLength(mockContent.methodologySteps.length)
    })
  })

  // ============================================
  // ⚡ PERFORMANCE TESTS
  // ============================================

  describe('Performance', () => {
    it('should memoize component to prevent unnecessary re-renders', () => {
      const { rerender } = render(<Approach />)
      const initialCallCount = (getApproachContent as jest.Mock).mock.calls
        .length

      rerender(<Approach />)

      // Content should only be fetched once due to memoization
      expect(getApproachContent).toHaveBeenCalledTimes(initialCallCount)
    })

    it('should have displayName for debugging', () => {
      expect(Approach.displayName).toBe('Approach')
    })

    it('should render efficiently with large datasets', () => {
      const largeContent = {
        ...mockContent,
        methodologySteps: Array.from({ length: 10 }, (_, i) => ({
          id: `step-${i}`,
          number: i + 1,
          title: `Step ${i + 1}`,
          description: `Description ${i + 1}`,
          icon: '🔍',
        })),
        corePrinciples: Array.from({ length: 8 }, (_, i) => ({
          id: `principle-${i}`,
          title: `Principle ${i + 1}`,
          description: `Description ${i + 1}`,
        })),
      }
      ;(getApproachContent as jest.Mock).mockReturnValue(largeContent)

      const startTime = performance.now()
      render(<Approach />)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(100) // Should render in < 100ms
    })
  })

  // ============================================
  // 🎨 RESPONSIVE DESIGN TESTS
  // ============================================

  describe('Responsive Design', () => {
    it('should apply responsive text classes', () => {
      render(<Approach />)
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveClass('text-4xl', 'sm:text-5xl')
    })

    it('should use responsive grid for principles', () => {
      render(<Approach />)
      const principlesContainer = screen
        .getByRole('heading', { name: 'Core Principles' })
        .nextElementSibling
      expect(principlesContainer).toHaveClass(
        'grid',
        'grid-cols-1',
        'md:grid-cols-2'
      )
    })

    it('should use responsive grid for differentiators', () => {
      render(<Approach />)
      const diffContainer = screen.getAllByRole('article')[0]
      const gridContainer = diffContainer.querySelector(
        '.grid.grid-cols-1.md\\:grid-cols-2'
      )
      expect(gridContainer).toBeInTheDocument()
    })
  })

  // ============================================
  // 🎭 EDGE CASES & ERROR HANDLING
  // ============================================

  describe('Edge Cases', () => {
    it('should handle missing optional className prop', () => {
      render(<Approach />)
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should handle undefined className gracefully', () => {
      render(<Approach className={undefined} />)
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should handle empty string className', () => {
      render(<Approach className="" />)
      const section = screen.getByRole('region')
      expect(section).toBeInTheDocument()
    })

    it('should handle content with special characters', () => {
      const specialContent = {
        ...mockContent,
        heading: 'Test & <Special> "Characters"',
      }
      ;(getApproachContent as jest.Mock).mockReturnValue(specialContent)
      render(<Approach />)
      expect(
        screen.getByText('Test & <Special> "Characters"')
      ).toBeInTheDocument()
    })

    it('should handle very long text content', () => {
      const longContent = {
        ...mockContent,
        introduction: 'A'.repeat(1000),
      }
      ;(getApproachContent as jest.Mock).mockReturnValue(longContent)
      render(<Approach />)
      expect(screen.getByText('A'.repeat(1000))).toBeInTheDocument()
    })
  })

  // ============================================
  // 🔄 STATE & PROPS TESTS
  // ============================================

  describe('Props Handling', () => {
    it('should accept and apply custom className', () => {
      const customClass = 'my-custom-class another-class'
      render(<Approach className={customClass} />)
      const section = screen.getByRole('region')
      expect(section).toHaveClass('my-custom-class', 'another-class')
    })

    it('should maintain default behavior without props', () => {
      render(<Approach />)
      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('id', 'approach')
      expect(section).toHaveAttribute('data-variant', 'earth')
    })

    it('should properly type check props', () => {
      const validProps: ApproachProps = {
        className: 'test-class',
      }
      render(<Approach {...validProps} />)
      expect(screen.getByRole('region')).toBeInTheDocument()
    })
  })

  // ============================================
  // 🎯 VISUAL REGRESSION TESTS
  // ============================================

  describe('Visual Consistency', () => {
    it('should apply consistent spacing classes', () => {
      render(<Approach />)
      const header = screen
        .getByRole('heading', { level: 2 })
        .closest('div')
      expect(header).toHaveClass('mb-16')
    })

    it('should apply consistent color scheme', () => {
      render(<Approach />)
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveClass('text-earth-900')
    })

    it('should apply shadow effects consistently', () => {
      render(<Approach />)
      const articles = screen.getAllByRole('article')
      articles.forEach(article => {
        expect(article).toHaveClass('shadow-soft')
      })
    })

    it('should apply transition effects', () => {
      render(<Approach />)
      const articles = screen.getAllByRole('article')
      articles.forEach(article => {
        expect(article).toHaveClass('transition-all', 'duration-300')
      })
    })
  })

  // ============================================
  // 🧪 SNAPSHOT TESTS
  // ============================================

  describe('Snapshot Tests', () => {
    it('should match snapshot with default props', () => {
      const { container } = render(<Approach />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('should match snapshot with custom className', () => {
      const { container } = render(<Approach className="custom-class" />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('should match snapshot with minimal content', () => {
      const minimalContent = {
        heading: 'Test',
        subheading: 'Test',
        introduction: 'Test',
        methodologySteps: [],
        corePrinciples: [],
        differentiators: [],
        closingStatement: 'Test',
      }
      ;(getApproachContent as jest.Mock).mockReturnValue(minimalContent)
      const { container } = render(<Approach />)
      expect(container.firstChild).toMatchSnapshot()
    })
  })
})