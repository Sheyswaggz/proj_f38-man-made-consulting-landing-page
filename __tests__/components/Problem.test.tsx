import React from 'react'
import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Problem, ProblemProps } from '@/components/sections/Problem'
import { getProblemsContent } from '@/lib/content/problems'

// Mock dependencies
jest.mock('@/lib/content/problems')
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
    id?: string
    variant?: string
    padding?: string
    className?: string
    ariaLabel?: string
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

jest.mock('@/components/ui/Card', () => ({
  Card: ({
    icon,
    title,
    description,
    ariaLabel,
  }: {
    icon?: React.ReactNode
    title: string
    description: string
    ariaLabel?: string
  }) => (
    <div data-testid="card" aria-label={ariaLabel}>
      {icon && <div data-testid="card-icon">{icon}</div>}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ),
}))

// Test data factory
const createMockProblem = (overrides = {}) => ({
  id: 'test-problem-1',
  icon: 'puzzle-mismatch',
  title: 'Test Problem',
  description: 'Test problem description',
  ...overrides,
})

const createMockContent = (overrides = {}) => ({
  heading: 'Common AI Implementation Challenges',
  subheading: 'Organizations face these obstacles',
  problems: [
    createMockProblem({
      id: 'problem-1',
      icon: 'puzzle-mismatch',
      title: 'Misaligned Solutions',
      description: 'Generic AI tools that do not fit your needs',
    }),
    createMockProblem({
      id: 'problem-2',
      icon: 'confusion',
      title: 'Technical Confusion',
      description: 'Complex jargon without clear guidance',
    }),
  ],
  ...overrides,
})

describe('Problem Component', () => {
  // Setup and teardown
  beforeEach(() => {
    jest.clearAllMocks()
    const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
      typeof getProblemsContent
    >
    mockGetProblemsContent.mockReturnValue(createMockContent())
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // 🎯 Unit Tests - Component Rendering
  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(<Problem />)
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      const customClass = 'custom-problem-class'
      render(<Problem className={customClass} />)
      const section = screen.getByRole('region')
      expect(section).toHaveClass(customClass)
    })

    it('should render section with correct attributes', () => {
      render(<Problem />)
      const section = screen.getByRole('region')

      expect(section).toHaveAttribute('id', 'problem')
      expect(section).toHaveAttribute('data-variant', 'sand')
      expect(section).toHaveAttribute('data-padding', 'lg')
      expect(section).toHaveAttribute(
        'aria-label',
        'Common AI implementation challenges'
      )
    })

    it('should render heading from content', () => {
      render(<Problem />)
      expect(
        screen.getByRole('heading', {
          name: /common ai implementation challenges/i,
          level: 2,
        })
      ).toBeInTheDocument()
    })

    it('should render subheading when provided', () => {
      render(<Problem />)
      expect(
        screen.getByText(/organizations face these obstacles/i)
      ).toBeInTheDocument()
    })

    it('should not render subheading when not provided', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      mockGetProblemsContent.mockReturnValue(
        createMockContent({ subheading: undefined })
      )

      render(<Problem />)
      expect(
        screen.queryByText(/organizations face these obstacles/i)
      ).not.toBeInTheDocument()
    })
  })

  // 🎯 Unit Tests - Problem Cards
  describe('Problem Cards Rendering', () => {
    it('should render all problem cards', () => {
      render(<Problem />)
      const cards = screen.getAllByTestId('card')
      expect(cards).toHaveLength(2)
    })

    it('should render problem cards with correct titles', () => {
      render(<Problem />)
      expect(
        screen.getByRole('heading', { name: /misaligned solutions/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: /technical confusion/i })
      ).toBeInTheDocument()
    })

    it('should render problem cards with correct descriptions', () => {
      render(<Problem />)
      expect(
        screen.getByText(/generic ai tools that do not fit your needs/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/complex jargon without clear guidance/i)
      ).toBeInTheDocument()
    })

    it('should render cards with proper ARIA labels', () => {
      render(<Problem />)
      expect(
        screen.getByLabelText(/problem: misaligned solutions/i)
      ).toBeInTheDocument()
      expect(
        screen.getByLabelText(/problem: technical confusion/i)
      ).toBeInTheDocument()
    })

    it('should render cards in a list structure', () => {
      render(<Problem />)
      const list = screen.getByRole('list', {
        name: /list of common ai implementation problems/i,
      })
      expect(list).toBeInTheDocument()

      const listItems = within(list).getAllByRole('listitem')
      expect(listItems).toHaveLength(2)
    })
  })

  // 🎯 Unit Tests - Icon Rendering
  describe('Problem Icons', () => {
    it('should render puzzle-mismatch icon', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      mockGetProblemsContent.mockReturnValue(
        createMockContent({
          problems: [
            createMockProblem({ id: 'p1', icon: 'puzzle-mismatch' }),
          ],
        })
      )

      render(<Problem />)
      const icons = screen.getAllByTestId('card-icon')
      expect(icons[0]).toBeInTheDocument()

      const svg = icons[0].querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })

    it('should render confusion icon', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      mockGetProblemsContent.mockReturnValue(
        createMockContent({
          problems: [createMockProblem({ id: 'p1', icon: 'confusion' })],
        })
      )

      render(<Problem />)
      const icons = screen.getAllByTestId('card-icon')
      expect(icons[0]).toBeInTheDocument()
    })

    it('should render disruption icon', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      mockGetProblemsContent.mockReturnValue(
        createMockContent({
          problems: [createMockProblem({ id: 'p1', icon: 'disruption' })],
        })
      )

      render(<Problem />)
      const icons = screen.getAllByTestId('card-icon')
      expect(icons[0]).toBeInTheDocument()
    })

    it('should render generic-solution icon', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      mockGetProblemsContent.mockReturnValue(
        createMockContent({
          problems: [
            createMockProblem({ id: 'p1', icon: 'generic-solution' }),
          ],
        })
      )

      render(<Problem />)
      const icons = screen.getAllByTestId('card-icon')
      expect(icons[0]).toBeInTheDocument()
    })

    it('should handle unknown icon gracefully', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      mockGetProblemsContent.mockReturnValue(
        createMockContent({
          problems: [createMockProblem({ id: 'p1', icon: 'unknown-icon' })],
        })
      )

      render(<Problem />)
      const icons = screen.queryAllByTestId('card-icon')
      expect(icons).toHaveLength(0)
    })

    it('should render all SVG icons with proper attributes', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      mockGetProblemsContent.mockReturnValue(
        createMockContent({
          problems: [
            createMockProblem({ id: 'p1', icon: 'puzzle-mismatch' }),
          ],
        })
      )

      render(<Problem />)
      const svg = screen.getByTestId('card-icon').querySelector('svg')

      expect(svg).toHaveAttribute('fill', 'none')
      expect(svg).toHaveAttribute('stroke', 'currentColor')
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
      expect(svg).toHaveClass('w-8', 'h-8')
    })
  })

  // 🎯 Unit Tests - Animation Styles
  describe('Animation Styles', () => {
    it('should apply animation delay to cards', () => {
      render(<Problem />)
      const listItems = screen.getAllByRole('listitem')

      expect(listItems[0]).toHaveStyle({ animationDelay: '0ms' })
      expect(listItems[1]).toHaveStyle({ animationDelay: '100ms' })
    })

    it('should apply animation fill mode', () => {
      render(<Problem />)
      const listItems = screen.getAllByRole('listitem')

      listItems.forEach(item => {
        expect(item).toHaveStyle({ animationFillMode: 'both' })
      })
    })

    it('should apply fade-in-up animation class', () => {
      render(<Problem />)
      const listItems = screen.getAllByRole('listitem')

      listItems.forEach(item => {
        expect(item).toHaveClass('animate-fade-in-up')
      })
    })
  })

  // 🔗 Integration Tests - Content Integration
  describe('Content Integration', () => {
    it('should call getProblemsContent on render', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >

      render(<Problem />)
      expect(mockGetProblemsContent).toHaveBeenCalledTimes(1)
    })

    it('should handle empty problems array', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      mockGetProblemsContent.mockReturnValue(
        createMockContent({ problems: [] })
      )

      render(<Problem />)
      const cards = screen.queryAllByTestId('card')
      expect(cards).toHaveLength(0)
    })

    it('should handle large number of problems', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      const manyProblems = Array.from({ length: 10 }, (_, i) =>
        createMockProblem({ id: `problem-${i}`, title: `Problem ${i}` })
      )
      mockGetProblemsContent.mockReturnValue(
        createMockContent({ problems: manyProblems })
      )

      render(<Problem />)
      const cards = screen.getAllByTestId('card')
      expect(cards).toHaveLength(10)
    })
  })

  // 🛡️ Accessibility Tests
  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Problem />)
      const h2 = screen.getByRole('heading', { level: 2 })
      expect(h2).toBeInTheDocument()
    })

    it('should have semantic section element', () => {
      render(<Problem />)
      const section = screen.getByRole('region')
      expect(section.tagName).toBe('SECTION')
    })

    it('should have descriptive ARIA labels', () => {
      render(<Problem />)
      expect(
        screen.getByLabelText(/common ai implementation challenges/i)
      ).toBeInTheDocument()
      expect(
        screen.getByLabelText(/list of common ai implementation problems/i)
      ).toBeInTheDocument()
    })

    it('should hide decorative icons from screen readers', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      mockGetProblemsContent.mockReturnValue(
        createMockContent({
          problems: [
            createMockProblem({ id: 'p1', icon: 'puzzle-mismatch' }),
          ],
        })
      )

      render(<Problem />)
      const svg = screen.getByTestId('card-icon').querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })

    it('should have proper list structure for screen readers', () => {
      render(<Problem />)
      const list = screen.getByRole('list')
      const listItems = within(list).getAllByRole('listitem')

      expect(list).toBeInTheDocument()
      expect(listItems.length).toBeGreaterThan(0)
    })
  })

  // 🎨 Responsive Design Tests
  describe('Responsive Layout', () => {
    it('should apply responsive grid classes', () => {
      render(<Problem />)
      const grid = screen.getByRole('list')

      expect(grid).toHaveClass('grid')
      expect(grid).toHaveClass('grid-cols-1')
      expect(grid).toHaveClass('md:grid-cols-2')
    })

    it('should apply responsive gap classes', () => {
      render(<Problem />)
      const grid = screen.getByRole('list')

      expect(grid).toHaveClass('gap-6')
      expect(grid).toHaveClass('lg:gap-8')
    })

    it('should apply responsive text sizing to heading', () => {
      render(<Problem />)
      const heading = screen.getByRole('heading', { level: 2 })

      expect(heading).toHaveClass('text-3xl')
      expect(heading).toHaveClass('sm:text-4xl')
      expect(heading).toHaveClass('lg:text-5xl')
    })

    it('should apply responsive text sizing to subheading', () => {
      render(<Problem />)
      const subheading = screen.getByText(/organizations face these obstacles/i)

      expect(subheading).toHaveClass('text-lg')
      expect(subheading).toHaveClass('sm:text-xl')
    })
  })

  // 🎯 Edge Cases and Error Handling
  describe('Edge Cases', () => {
    it('should handle missing problem id', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      mockGetProblemsContent.mockReturnValue(
        createMockContent({
          problems: [{ ...createMockProblem(), id: '' }],
        })
      )

      expect(() => render(<Problem />)).not.toThrow()
    })

    it('should handle missing problem title', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      mockGetProblemsContent.mockReturnValue(
        createMockContent({
          problems: [{ ...createMockProblem(), title: '' }],
        })
      )

      expect(() => render(<Problem />)).not.toThrow()
    })

    it('should handle missing problem description', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      mockGetProblemsContent.mockReturnValue(
        createMockContent({
          problems: [{ ...createMockProblem(), description: '' }],
        })
      )

      expect(() => render(<Problem />)).not.toThrow()
    })

    it('should handle very long problem titles', () => {
      const longTitle = 'A'.repeat(200)
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      mockGetProblemsContent.mockReturnValue(
        createMockContent({
          problems: [createMockProblem({ title: longTitle })],
        })
      )

      render(<Problem />)
      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    it('should handle very long problem descriptions', () => {
      const longDescription = 'B'.repeat(500)
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      mockGetProblemsContent.mockReturnValue(
        createMockContent({
          problems: [createMockProblem({ description: longDescription })],
        })
      )

      render(<Problem />)
      expect(screen.getByText(longDescription)).toBeInTheDocument()
    })

    it('should handle special characters in content', () => {
      const specialTitle = 'Problem <>&"\'`'
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      mockGetProblemsContent.mockReturnValue(
        createMockContent({
          problems: [createMockProblem({ title: specialTitle })],
        })
      )

      render(<Problem />)
      expect(screen.getByText(specialTitle)).toBeInTheDocument()
    })
  })

  // ⚡ Performance Tests
  describe('Performance', () => {
    it('should render efficiently with multiple problems', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      const manyProblems = Array.from({ length: 50 }, (_, i) =>
        createMockProblem({ id: `problem-${i}` })
      )
      mockGetProblemsContent.mockReturnValue(
        createMockContent({ problems: manyProblems })
      )

      const startTime = performance.now()
      render(<Problem />)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(1000) // Should render in less than 1 second
    })

    it('should not cause unnecessary re-renders', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      const renderSpy = jest.fn()
      mockGetProblemsContent.mockImplementation(() => {
        renderSpy()
        return createMockContent()
      })

      const { rerender } = render(<Problem />)
      rerender(<Problem />)

      expect(renderSpy).toHaveBeenCalledTimes(2) // Once per render
    })
  })

  // 🎭 Component Props Tests
  describe('Component Props', () => {
    it('should accept and apply className prop', () => {
      const testClass = 'test-custom-class'
      render(<Problem className={testClass} />)
      expect(screen.getByRole('region')).toHaveClass(testClass)
    })

    it('should handle undefined className', () => {
      render(<Problem className={undefined} />)
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should handle empty string className', () => {
      render(<Problem className="" />)
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should handle multiple className values', () => {
      const classes = 'class-one class-two class-three'
      render(<Problem className={classes} />)
      const section = screen.getByRole('region')
      expect(section).toHaveClass('class-one')
      expect(section).toHaveClass('class-two')
      expect(section).toHaveClass('class-three')
    })
  })

  // 🎨 Styling Tests
  describe('Styling', () => {
    it('should apply correct color scheme classes', () => {
      render(<Problem />)
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveClass('text-earth-900')
    })

    it('should apply spacing classes', () => {
      render(<Problem />)
      const section = screen.getByRole('region')
      const container = section.querySelector('.space-y-12')
      expect(container).toBeInTheDocument()
    })

    it('should apply text balance classes', () => {
      render(<Problem />)
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveClass('text-balance')
    })

    it('should apply max-width constraint to header', () => {
      render(<Problem />)
      const heading = screen.getByRole('heading', { level: 2 })
      const headerContainer = heading.parentElement
      expect(headerContainer).toHaveClass('max-w-3xl')
      expect(headerContainer).toHaveClass('mx-auto')
    })
  })

  // 🔄 State Management Tests
  describe('State Management', () => {
    it('should maintain consistent state across renders', () => {
      const { rerender } = render(<Problem />)
      const initialCards = screen.getAllByTestId('card')

      rerender(<Problem />)
      const rerenderedCards = screen.getAllByTestId('card')

      expect(rerenderedCards).toHaveLength(initialCards.length)
    })

    it('should handle content updates', () => {
      const mockGetProblemsContent = getProblemsContent as jest.MockedFunction<
        typeof getProblemsContent
      >
      const { rerender } = render(<Problem />)

      mockGetProblemsContent.mockReturnValue(
        createMockContent({
          problems: [createMockProblem({ title: 'Updated Problem' })],
        })
      )

      rerender(<Problem />)
      expect(screen.getByText(/updated problem/i)).toBeInTheDocument()
    })
  })
})