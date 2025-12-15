import React from 'react'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProcessSection from '@/components/sections/Process'
import { getProcessContent } from '@/lib/content/process'
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver'

// Mock dependencies
jest.mock('@/lib/content/process')
jest.mock('@/lib/hooks/useIntersectionObserver')
jest.mock('@/components/ui/Section', () => ({
  Section: ({
    children,
    id,
    className,
    ariaLabel,
  }: {
    children: React.ReactNode
    id?: string
    className?: string
    ariaLabel?: string
  }) => (
    <section
      id={id}
      className={className}
      aria-label={ariaLabel}
      data-testid="section"
    >
      {children}
    </section>
  ),
}))
jest.mock('@/components/ui/Timeline', () => ({
  Timeline: ({
    steps,
    orientation,
    showConnectors,
    className,
  }: {
    steps: readonly unknown[]
    orientation: string
    showConnectors: boolean
    className?: string
  }) => (
    <div
      data-testid="timeline"
      data-orientation={orientation}
      data-show-connectors={showConnectors}
      className={className}
      role="list"
    >
      {steps.map((step: { id: string; title: string }) => (
        <div key={step.id} data-testid={`timeline-step-${step.id}`}>
          {step.title}
        </div>
      ))}
    </div>
  ),
}))
jest.mock('@/components/ui/ExpandableCard', () => ({
  ExpandableCard: ({
    id,
    title,
    summary,
    children,
    ariaLabel,
    className,
  }: {
    id: string
    title: string
    summary: string
    children: React.ReactNode
    ariaLabel?: string
    className?: string
  }) => {
    const [isExpanded, setIsExpanded] = React.useState(false)
    return (
      <div
        data-testid={`expandable-card-${id}`}
        className={className}
        aria-label={ariaLabel}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          data-testid={`expand-button-${id}`}
        >
          {title}
        </button>
        <div data-testid={`summary-${id}`}>{summary}</div>
        {isExpanded && (
          <div data-testid={`content-${id}`}>{children}</div>
        )}
      </div>
    )
  },
}))

// Mock data factory
const createMockProcessContent = () => ({
  heading: 'Our Consulting Process',
  subheading: 'A transparent, collaborative approach',
  introduction:
    'We believe in complete transparency throughout our engagement.',
  steps: [
    {
      id: 'discovery',
      number: 1,
      title: 'Discovery & Assessment',
      description:
        'We begin by understanding your business, challenges, and goals through comprehensive analysis.',
      timeline: 'Week 1-2',
      estimatedDuration: '2 weeks',
      keyActivities: [
        'Stakeholder interviews',
        'Current state analysis',
        'Goal definition',
      ],
      deliverables: [
        {
          id: 'discovery-report',
          title: 'Discovery Report',
          description: 'Comprehensive analysis of current state and opportunities',
        },
      ],
      transparencyNote:
        'All findings are shared in real-time through our collaboration platform.',
    },
    {
      id: 'strategy',
      number: 2,
      title: 'Strategy Development',
      description:
        'We develop a tailored strategy aligned with your business objectives.',
      timeline: 'Week 3-4',
      estimatedDuration: '2 weeks',
      keyActivities: [
        'Strategy workshops',
        'Roadmap creation',
        'Risk assessment',
      ],
      deliverables: [
        {
          id: 'strategy-doc',
          title: 'Strategy Document',
          description: 'Detailed strategic plan with actionable recommendations',
        },
      ],
      transparencyNote:
        'You receive draft versions for feedback before finalization.',
    },
  ],
  transparencyPrinciples: [
    'Open communication at every stage',
    'Regular progress updates and check-ins',
    'Clear documentation of all decisions',
  ],
  collaborationApproach:
    'We work alongside your team as partners, not just consultants.',
  closingStatement:
    'Our process is designed to deliver value while building your internal capabilities.',
})

describe('ProcessSection', () => {
  const mockGetProcessContent = getProcessContent as jest.MockedFunction<
    typeof getProcessContent
  >
  const mockUseIntersectionObserver =
    useIntersectionObserver as jest.MockedFunction<
      typeof useIntersectionObserver
    >

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetProcessContent.mockReturnValue(createMockProcessContent())
    mockUseIntersectionObserver.mockReturnValue({
      ref: { current: null },
      isIntersecting: true,
    })
  })

  describe('🎯 Component Rendering', () => {
    it('should render the process section with correct structure', () => {
      render(<ProcessSection />)

      expect(screen.getByTestId('section')).toBeInTheDocument()
      expect(screen.getByTestId('section')).toHaveAttribute('id', 'process')
      expect(screen.getByTestId('section')).toHaveAttribute(
        'aria-label',
        'Consulting process overview'
      )
    })

    it('should render heading and subheading', () => {
      render(<ProcessSection />)

      expect(
        screen.getByRole('heading', { name: /our consulting process/i })
      ).toBeInTheDocument()
      expect(
        screen.getByText(/a transparent, collaborative approach/i)
      ).toBeInTheDocument()
    })

    it('should render introduction text', () => {
      render(<ProcessSection />)

      expect(
        screen.getByText(
          /we believe in complete transparency throughout our engagement/i
        )
      ).toBeInTheDocument()
    })

    it('should apply custom className when provided', () => {
      render(<ProcessSection className="custom-class" />)

      expect(screen.getByTestId('section')).toHaveClass('custom-class')
    })
  })

  describe('📊 Timeline Visualization', () => {
    it('should render timeline with correct steps', () => {
      render(<ProcessSection />)

      const timeline = screen.getByTestId('timeline')
      expect(timeline).toBeInTheDocument()
      expect(timeline).toHaveAttribute('data-orientation', 'vertical')
      expect(timeline).toHaveAttribute('data-show-connectors', 'true')
    })

    it('should pass correct step data to timeline', () => {
      render(<ProcessSection />)

      expect(screen.getByTestId('timeline-step-discovery')).toBeInTheDocument()
      expect(screen.getByTestId('timeline-step-strategy')).toBeInTheDocument()
    })

    it('should show timeline with animation when intersecting', () => {
      mockUseIntersectionObserver.mockReturnValue({
        ref: { current: null },
        isIntersecting: true,
      })

      render(<ProcessSection />)

      const timeline = screen.getByTestId('timeline')
      expect(timeline.parentElement).toHaveClass('opacity-100', 'translate-y-0')
    })

    it('should hide timeline initially when not intersecting', () => {
      mockUseIntersectionObserver.mockReturnValue({
        ref: { current: null },
        isIntersecting: false,
      })

      render(<ProcessSection />)

      const timeline = screen.getByTestId('timeline')
      expect(timeline.parentElement).toHaveClass('opacity-0', 'translate-y-8')
    })
  })

  describe('🔄 Expandable Step Details', () => {
    it('should render all expandable cards for steps', () => {
      render(<ProcessSection />)

      expect(
        screen.getByTestId('expandable-card-discovery')
      ).toBeInTheDocument()
      expect(
        screen.getByTestId('expandable-card-strategy')
      ).toBeInTheDocument()
    })

    it('should display step titles with numbers', () => {
      render(<ProcessSection />)

      expect(
        screen.getByRole('button', { name: /1\. discovery & assessment/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /2\. strategy development/i })
      ).toBeInTheDocument()
    })

    it('should display step summaries', () => {
      render(<ProcessSection />)

      expect(screen.getByTestId('summary-discovery')).toHaveTextContent(
        /week 1-2/i
      )
      expect(screen.getByTestId('summary-strategy')).toHaveTextContent(
        /week 3-4/i
      )
    })

    it('should expand card when clicked', async () => {
      const user = userEvent.setup()
      render(<ProcessSection />)

      const expandButton = screen.getByTestId('expand-button-discovery')
      expect(expandButton).toHaveAttribute('aria-expanded', 'false')

      await user.click(expandButton)

      expect(expandButton).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByTestId('content-discovery')).toBeInTheDocument()
    })

    it('should collapse card when clicked again', async () => {
      const user = userEvent.setup()
      render(<ProcessSection />)

      const expandButton = screen.getByTestId('expand-button-discovery')

      await user.click(expandButton)
      expect(screen.getByTestId('content-discovery')).toBeInTheDocument()

      await user.click(expandButton)
      expect(screen.queryByTestId('content-discovery')).not.toBeInTheDocument()
    })
  })

  describe('📝 Step Detail Content', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      render(<ProcessSection />)
      await user.click(screen.getByTestId('expand-button-discovery'))
    })

    it('should display full description', () => {
      const content = screen.getByTestId('content-discovery')
      expect(
        within(content).getByText(
          /we begin by understanding your business, challenges, and goals/i
        )
      ).toBeInTheDocument()
    })

    it('should display timeline and duration', () => {
      const content = screen.getByTestId('content-discovery')
      expect(within(content).getByText('Week 1-2')).toBeInTheDocument()
      expect(within(content).getByText('2 weeks')).toBeInTheDocument()
    })

    it('should display key activities list', () => {
      const content = screen.getByTestId('content-discovery')
      const activities = within(content).getByRole('list', {
        name: /key activities/i,
      })

      expect(
        within(activities).getByText(/stakeholder interviews/i)
      ).toBeInTheDocument()
      expect(
        within(activities).getByText(/current state analysis/i)
      ).toBeInTheDocument()
      expect(
        within(activities).getByText(/goal definition/i)
      ).toBeInTheDocument()
    })

    it('should display deliverables', () => {
      const content = screen.getByTestId('content-discovery')

      expect(
        within(content).getByText(/discovery report/i)
      ).toBeInTheDocument()
      expect(
        within(content).getByText(
          /comprehensive analysis of current state and opportunities/i
        )
      ).toBeInTheDocument()
    })

    it('should display transparency note', () => {
      const content = screen.getByTestId('content-discovery')

      expect(
        within(content).getByText(
          /all findings are shared in real-time through our collaboration platform/i
        )
      ).toBeInTheDocument()
    })
  })

  describe('🛡️ Transparency Principles', () => {
    it('should render transparency principles section', () => {
      render(<ProcessSection />)

      expect(
        screen.getByRole('heading', { name: /our transparency principles/i })
      ).toBeInTheDocument()
    })

    it('should display all transparency principles', () => {
      render(<ProcessSection />)

      const principlesList = screen.getByRole('list', {
        name: /transparency principles/i,
      })

      expect(
        within(principlesList).getByText(/open communication at every stage/i)
      ).toBeInTheDocument()
      expect(
        within(principlesList).getByText(
          /regular progress updates and check-ins/i
        )
      ).toBeInTheDocument()
      expect(
        within(principlesList).getByText(
          /clear documentation of all decisions/i
        )
      ).toBeInTheDocument()
    })

    it('should number transparency principles', () => {
      render(<ProcessSection />)

      const principlesList = screen.getByRole('list', {
        name: /transparency principles/i,
      })
      const numbers = within(principlesList).getAllByText(/^[1-3]$/)

      expect(numbers).toHaveLength(3)
    })
  })

  describe('🤝 Collaboration Approach', () => {
    it('should render collaboration section', () => {
      render(<ProcessSection />)

      expect(
        screen.getByRole('heading', { name: /collaborative partnership/i })
      ).toBeInTheDocument()
    })

    it('should display collaboration approach text', () => {
      render(<ProcessSection />)

      expect(
        screen.getByText(
          /we work alongside your team as partners, not just consultants/i
        )
      ).toBeInTheDocument()
    })
  })

  describe('💬 Closing Statement', () => {
    it('should render closing statement', () => {
      render(<ProcessSection />)

      expect(
        screen.getByText(
          /our process is designed to deliver value while building your internal capabilities/i
        )
      ).toBeInTheDocument()
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper ARIA labels on section', () => {
      render(<ProcessSection />)

      expect(screen.getByTestId('section')).toHaveAttribute(
        'aria-label',
        'Consulting process overview'
      )
    })

    it('should have proper ARIA labels on expandable cards', () => {
      render(<ProcessSection />)

      expect(
        screen.getByTestId('expandable-card-discovery')
      ).toHaveAttribute(
        'aria-label',
        'Expand details for Discovery & Assessment'
      )
    })

    it('should have proper aria-expanded state', async () => {
      const user = userEvent.setup()
      render(<ProcessSection />)

      const button = screen.getByTestId('expand-button-discovery')
      expect(button).toHaveAttribute('aria-expanded', 'false')

      await user.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('should use semantic list elements', () => {
      render(<ProcessSection />)

      const lists = screen.getAllByRole('list')
      expect(lists.length).toBeGreaterThan(0)
    })

    it('should have proper heading hierarchy', () => {
      render(<ProcessSection />)

      const h2 = screen.getByRole('heading', {
        level: 2,
        name: /our consulting process/i,
      })
      const h3s = screen.getAllByRole('heading', { level: 3 })

      expect(h2).toBeInTheDocument()
      expect(h3s.length).toBeGreaterThan(0)
    })
  })

  describe('🎨 Styling and Layout', () => {
    it('should apply responsive text sizes', () => {
      render(<ProcessSection />)

      const heading = screen.getByRole('heading', {
        name: /our consulting process/i,
      })
      expect(heading).toHaveClass('text-4xl', 'md:text-5xl')
    })

    it('should apply proper spacing', () => {
      render(<ProcessSection />)

      const section = screen.getByTestId('section')
      const container = section.querySelector('.space-y-16')
      expect(container).toBeInTheDocument()
    })

    it('should apply background colors to sections', () => {
      render(<ProcessSection />)

      const transparencySection = screen
        .getByRole('heading', { name: /our transparency principles/i })
        .closest('div')
      expect(transparencySection).toHaveClass('bg-earth-50')
    })
  })

  describe('🔌 Integration with Hooks', () => {
    it('should call useIntersectionObserver with correct options', () => {
      render(<ProcessSection />)

      expect(mockUseIntersectionObserver).toHaveBeenCalledWith({
        threshold: 0.1,
        triggerOnce: true,
      })
    })

    it('should call getProcessContent to fetch data', () => {
      render(<ProcessSection />)

      expect(mockGetProcessContent).toHaveBeenCalledTimes(1)
    })
  })

  describe('🧪 Edge Cases', () => {
    it('should handle empty steps array', () => {
      mockGetProcessContent.mockReturnValue({
        ...createMockProcessContent(),
        steps: [],
      })

      render(<ProcessSection />)

      expect(screen.queryByTestId('expandable-card-discovery')).toBeNull()
    })

    it('should handle missing optional fields', () => {
      const contentWithMissingFields = createMockProcessContent()
      contentWithMissingFields.steps[0].deliverables = []

      mockGetProcessContent.mockReturnValue(contentWithMissingFields)

      render(<ProcessSection />)

      expect(screen.getByTestId('section')).toBeInTheDocument()
    })

    it('should handle long text content gracefully', () => {
      const contentWithLongText = createMockProcessContent()
      contentWithLongText.steps[0].description = 'A'.repeat(500)

      mockGetProcessContent.mockReturnValue(contentWithLongText)

      render(<ProcessSection />)

      expect(screen.getByTestId('section')).toBeInTheDocument()
    })
  })

  describe('⚡ Performance', () => {
    it('should render efficiently with multiple steps', () => {
      const manySteps = Array.from({ length: 10 }, (_, i) => ({
        id: `step-${i}`,
        number: i + 1,
        title: `Step ${i + 1}`,
        description: `Description ${i + 1}`,
        timeline: `Week ${i + 1}`,
        estimatedDuration: '1 week',
        keyActivities: ['Activity 1', 'Activity 2'],
        deliverables: [
          {
            id: `deliverable-${i}`,
            title: `Deliverable ${i + 1}`,
            description: 'Description',
          },
        ],
        transparencyNote: 'Note',
      }))

      mockGetProcessContent.mockReturnValue({
        ...createMockProcessContent(),
        steps: manySteps,
      })

      const { container } = render(<ProcessSection />)

      expect(container.querySelectorAll('[data-testid^="expandable-card-"]'))
        .toHaveLength(10)
    })
  })

  describe('🎭 User Interactions', () => {
    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<ProcessSection />)

      const firstButton = screen.getByTestId('expand-button-discovery')
      firstButton.focus()

      expect(firstButton).toHaveFocus()

      await user.keyboard('{Enter}')
      await waitFor(() => {
        expect(firstButton).toHaveAttribute('aria-expanded', 'true')
      })
    })

    it('should allow multiple cards to be expanded simultaneously', async () => {
      const user = userEvent.setup()
      render(<ProcessSection />)

      await user.click(screen.getByTestId('expand-button-discovery'))
      await user.click(screen.getByTestId('expand-button-strategy'))

      expect(screen.getByTestId('content-discovery')).toBeInTheDocument()
      expect(screen.getByTestId('content-strategy')).toBeInTheDocument()
    })
  })

  describe('📱 Responsive Behavior', () => {
    it('should apply responsive grid classes', () => {
      render(<ProcessSection />)

      const grids = screen
        .getByTestId('section')
        .querySelectorAll('.grid-cols-1.md\\:grid-cols-2')
      expect(grids.length).toBeGreaterThan(0)
    })

    it('should apply responsive padding', () => {
      render(<ProcessSection />)

      const paddedElements = screen
        .getByTestId('section')
        .querySelectorAll('.p-8.md\\:p-12')
      expect(paddedElements.length).toBeGreaterThan(0)
    })
  })
})