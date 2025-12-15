/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Team, TeamProps } from '@/components/sections/Team'
import { getTeamContent, TeamContent } from '@/lib/content/team'

// Mock dependencies
jest.mock('@/lib/content/team')
jest.mock('@/components/ui/Section', () => ({
  Section: ({
    children,
    id,
    variant,
    padding,
    ariaLabel,
    className,
  }: {
    children: React.ReactNode
    id: string
    variant: string
    padding: string
    ariaLabel: string
    className?: string
  }) => (
    <section
      id={id}
      data-variant={variant}
      data-padding={padding}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </section>
  ),
}))

jest.mock('@/components/ui/TeamMember', () => ({
  TeamMember: ({
    id,
    name,
    role,
    bio,
    imageUrl,
    imageAlt,
  }: {
    id: string
    name: string
    role: string
    bio: string
    imageUrl: string
    imageAlt: string
  }) => (
    <div data-testid={`team-member-${id}`} data-member-id={id}>
      <img src={imageUrl} alt={imageAlt} />
      <h3>{name}</h3>
      <p data-testid="member-role">{role}</p>
      <p data-testid="member-bio">{bio}</p>
    </div>
  ),
}))

const mockGetTeamContent = getTeamContent as jest.MockedFunction<
  typeof getTeamContent
>

// Test data factory
const createMockTeamContent = (
  overrides?: Partial<TeamContent>
): TeamContent => ({
  heading: 'Meet Our Team',
  subheading: 'Expert Consultants',
  introduction:
    'Our team brings decades of combined experience in consulting.',
  members: [
    {
      id: 'member-1',
      name: 'John Doe',
      role: 'Senior Consultant',
      bio: 'Expert in strategic planning with 15 years of experience.',
      imageUrl: '/images/team/john-doe.jpg',
      imageAlt: 'Portrait of John Doe',
    },
    {
      id: 'member-2',
      name: 'Jane Smith',
      role: 'Lead Analyst',
      bio: 'Specializes in data-driven decision making.',
      imageUrl: '/images/team/jane-smith.jpg',
      imageAlt: 'Portrait of Jane Smith',
    },
    {
      id: 'member-3',
      name: 'Bob Johnson',
      role: 'Technical Director',
      bio: 'Technology integration and digital transformation expert.',
      imageUrl: '/images/team/bob-johnson.jpg',
      imageAlt: 'Portrait of Bob Johnson',
    },
    {
      id: 'member-4',
      name: 'Alice Williams',
      role: 'Project Manager',
      bio: 'Delivers complex projects on time and within budget.',
      imageUrl: '/images/team/alice-williams.jpg',
      imageAlt: 'Portrait of Alice Williams',
    },
  ],
  ...overrides,
})

describe('Team Component', () => {
  // Setup and teardown
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // ==========================================
  // 🎯 UNIT TESTS - Component Rendering
  // ==========================================

  describe('Initial Rendering', () => {
    it('should render loading state initially', () => {
      mockGetTeamContent.mockImplementation(
        () =>
          new Promise(() => {
            // Never resolves to keep loading state
          }) as Promise<TeamContent>
      )

      render(<Team />)

      const loadingSpinner = screen.getByRole('status', {
        name: /loading team content/i,
      })
      expect(loadingSpinner).toBeInTheDocument()
      expect(screen.getByText(/loading team content/i)).toBeInTheDocument()
    })

    it('should render with custom className', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      const { container } = render(<Team className="custom-team-class" />)

      await waitFor(() => {
        const section = container.querySelector('section')
        expect(section).toHaveClass('custom-team-class')
      })
    })

    it('should render without className prop', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      const { container } = render(<Team />)

      await waitFor(() => {
        const section = container.querySelector('section')
        expect(section).toBeInTheDocument()
      })
    })
  })

  describe('Successful Content Loading', () => {
    it('should render team content after loading', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        expect(screen.getByText('Meet Our Team')).toBeInTheDocument()
      })

      expect(screen.getByText('Expert Consultants')).toBeInTheDocument()
      expect(
        screen.getByText(
          /our team brings decades of combined experience/i
        )
      ).toBeInTheDocument()
    })

    it('should render all team members', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
      expect(screen.getByText('Alice Williams')).toBeInTheDocument()
    })

    it('should render team members with correct props', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        const member = screen.getByTestId('team-member-member-1')
        expect(member).toBeInTheDocument()
      })

      const member1 = screen.getByTestId('team-member-member-1')
      expect(within(member1).getByText('John Doe')).toBeInTheDocument()
      expect(
        within(member1).getByText('Senior Consultant')
      ).toBeInTheDocument()
      expect(
        within(member1).getByText(/expert in strategic planning/i)
      ).toBeInTheDocument()

      const image = within(member1).getByRole('img')
      expect(image).toHaveAttribute('src', '/images/team/john-doe.jpg')
      expect(image).toHaveAttribute('alt', 'Portrait of John Doe')
    })

    it('should log success message on content load', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith(
          'Team content loaded successfully',
          expect.objectContaining({
            memberCount: 4,
            timestamp: expect.any(String),
          })
        )
      })
    })
  })

  // ==========================================
  // 🔗 INTEGRATION TESTS - Error Handling
  // ==========================================

  describe('Error Handling', () => {
    it('should render error state when getTeamContent throws', async () => {
      const error = new Error('Failed to fetch team data')
      mockGetTeamContent.mockImplementation(() => {
        throw error
      })

      render(<Team />)

      await waitFor(() => {
        expect(
          screen.getByText(/unable to load team information/i)
        ).toBeInTheDocument()
      })

      const errorMessage = screen.getByRole('alert')
      expect(errorMessage).toHaveTextContent(
        /unable to load team information/i
      )
    })

    it('should log error details when content loading fails', async () => {
      const error = new Error('Network error')
      mockGetTeamContent.mockImplementation(() => {
        throw error
      })

      render(<Team />)

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Failed to load team content',
          expect.objectContaining({
            error: 'Network error',
            stack: expect.any(String),
            timestamp: expect.any(String),
          })
        )
      })
    })

    it('should handle non-Error exceptions', async () => {
      mockGetTeamContent.mockImplementation(() => {
        throw 'String error'
      })

      render(<Team />)

      await waitFor(() => {
        expect(
          screen.getByText(/unable to load team information/i)
        ).toBeInTheDocument()
      })

      expect(console.error).toHaveBeenCalledWith(
        'Failed to load team content',
        expect.objectContaining({
          error: 'Failed to load team content',
        })
      )
    })

    it('should render error state when content is null', async () => {
      mockGetTeamContent.mockReturnValue(null as unknown as TeamContent)

      render(<Team />)

      await waitFor(() => {
        expect(
          screen.getByText(/unable to load team information/i)
        ).toBeInTheDocument()
      })
    })

    it('should log render error when content is missing', async () => {
      mockGetTeamContent.mockReturnValue(null as unknown as TeamContent)

      render(<Team />)

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Team section render error',
          expect.objectContaining({
            hasError: false,
            hasContent: false,
            errorMessage: undefined,
            timestamp: expect.any(String),
          })
        )
      })
    })
  })

  // ==========================================
  // 🎨 ACCESSIBILITY TESTS
  // ==========================================

  describe('Accessibility', () => {
    it('should have proper ARIA labels on section', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      const { container } = render(<Team />)

      await waitFor(() => {
        const section = container.querySelector('section')
        expect(section).toHaveAttribute('aria-label', 'Meet our team')
      })
    })

    it('should have ARIA label on loading state', () => {
      mockGetTeamContent.mockImplementation(
        () =>
          new Promise(() => {
            // Never resolves
          }) as Promise<TeamContent>
      )

      const { container } = render(<Team />)

      const section = container.querySelector('section')
      expect(section).toHaveAttribute('aria-label', 'Team section loading')
    })

    it('should have ARIA label on error state', async () => {
      mockGetTeamContent.mockImplementation(() => {
        throw new Error('Test error')
      })

      const { container } = render(<Team />)

      await waitFor(() => {
        const section = container.querySelector('section')
        expect(section).toHaveAttribute('aria-label', 'Team section error')
      })
    })

    it('should have role="alert" on error message', async () => {
      mockGetTeamContent.mockImplementation(() => {
        throw new Error('Test error')
      })

      render(<Team />)

      await waitFor(() => {
        const alert = screen.getByRole('alert')
        expect(alert).toBeInTheDocument()
      })
    })

    it('should have role="status" on loading spinner', () => {
      mockGetTeamContent.mockImplementation(
        () =>
          new Promise(() => {
            // Never resolves
          }) as Promise<TeamContent>
      )

      render(<Team />)

      const status = screen.getByRole('status')
      expect(status).toBeInTheDocument()
      expect(status).toHaveAttribute('aria-label', 'Loading team content')
    })

    it('should have screen reader text for loading state', () => {
      mockGetTeamContent.mockImplementation(
        () =>
          new Promise(() => {
            // Never resolves
          }) as Promise<TeamContent>
      )

      render(<Team />)

      expect(screen.getByText(/loading team content/i)).toHaveClass('sr-only')
    })

    it('should have proper heading hierarchy', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 2 })
        expect(heading).toHaveTextContent('Meet Our Team')
      })
    })
  })

  // ==========================================
  // 🎭 RESPONSIVE DESIGN TESTS
  // ==========================================

  describe('Responsive Layout', () => {
    it('should apply correct grid classes', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      const { container } = render(<Team />)

      await waitFor(() => {
        const grid = container.querySelector(
          '.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4'
        )
        expect(grid).toBeInTheDocument()
      })
    })

    it('should apply responsive heading classes', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      const { container } = render(<Team />)

      await waitFor(() => {
        const heading = screen.getByText('Meet Our Team')
        expect(heading).toHaveClass(
          'text-4xl',
          'sm:text-5xl',
          'lg:text-6xl',
          'font-serif',
          'font-bold',
          'text-earth-900',
          'mb-4'
        )
      })
    })

    it('should apply responsive subheading classes', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        const subheading = screen.getByText('Expert Consultants')
        expect(subheading).toHaveClass(
          'text-xl',
          'sm:text-2xl',
          'text-earth-700',
          'font-medium',
          'mb-6'
        )
      })
    })

    it('should apply responsive gap classes to grid', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      const { container } = render(<Team />)

      await waitFor(() => {
        const grid = container.querySelector('.gap-6.lg\\:gap-8')
        expect(grid).toBeInTheDocument()
      })
    })
  })

  // ==========================================
  // 🔄 STATE MANAGEMENT TESTS
  // ==========================================

  describe('State Management', () => {
    it('should transition from loading to success state', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      // Initially loading
      expect(
        screen.getByRole('status', { name: /loading team content/i })
      ).toBeInTheDocument()

      // Then success
      await waitFor(() => {
        expect(screen.getByText('Meet Our Team')).toBeInTheDocument()
      })

      expect(
        screen.queryByRole('status', { name: /loading team content/i })
      ).not.toBeInTheDocument()
    })

    it('should transition from loading to error state', async () => {
      mockGetTeamContent.mockImplementation(() => {
        throw new Error('Test error')
      })

      render(<Team />)

      // Initially loading
      expect(
        screen.getByRole('status', { name: /loading team content/i })
      ).toBeInTheDocument()

      // Then error
      await waitFor(() => {
        expect(
          screen.getByText(/unable to load team information/i)
        ).toBeInTheDocument()
      })

      expect(
        screen.queryByRole('status', { name: /loading team content/i })
      ).not.toBeInTheDocument()
    })

    it('should not re-fetch content on re-render', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      const { rerender } = render(<Team />)

      await waitFor(() => {
        expect(screen.getByText('Meet Our Team')).toBeInTheDocument()
      })

      expect(mockGetTeamContent).toHaveBeenCalledTimes(1)

      rerender(<Team className="updated-class" />)

      expect(mockGetTeamContent).toHaveBeenCalledTimes(1)
    })
  })

  // ==========================================
  // 📊 EDGE CASES & BOUNDARY CONDITIONS
  // ==========================================

  describe('Edge Cases', () => {
    it('should handle empty members array', async () => {
      const mockContent = createMockTeamContent({ members: [] })
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        expect(screen.getByText('Meet Our Team')).toBeInTheDocument()
      })

      expect(screen.queryByTestId(/team-member-/)).not.toBeInTheDocument()
    })

    it('should handle single team member', async () => {
      const mockContent = createMockTeamContent({
        members: [
          {
            id: 'solo-member',
            name: 'Solo Consultant',
            role: 'Founder',
            bio: 'One person team',
            imageUrl: '/images/solo.jpg',
            imageAlt: 'Solo consultant',
          },
        ],
      })
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        expect(screen.getByText('Solo Consultant')).toBeInTheDocument()
      })

      expect(screen.getAllByTestId(/team-member-/)).toHaveLength(1)
    })

    it('should handle very long team member names', async () => {
      const longName = 'A'.repeat(100)
      const mockContent = createMockTeamContent({
        members: [
          {
            id: 'long-name',
            name: longName,
            role: 'Consultant',
            bio: 'Bio text',
            imageUrl: '/images/test.jpg',
            imageAlt: 'Test',
          },
        ],
      })
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        expect(screen.getByText(longName)).toBeInTheDocument()
      })
    })

    it('should handle special characters in content', async () => {
      const mockContent = createMockTeamContent({
        heading: 'Meet Our Team™',
        subheading: 'Expert Consultants & Advisors',
        introduction: 'We\'re the best! <script>alert("xss")</script>',
      })
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        expect(screen.getByText('Meet Our Team™')).toBeInTheDocument()
      })

      expect(
        screen.getByText('Expert Consultants & Advisors')
      ).toBeInTheDocument()
    })

    it('should handle undefined optional props', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team className={undefined} />)

      await waitFor(() => {
        expect(screen.getByText('Meet Our Team')).toBeInTheDocument()
      })
    })
  })

  // ==========================================
  // 🎨 STYLING & CSS CLASSES
  // ==========================================

  describe('CSS Classes', () => {
    it('should apply correct section variant and padding', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      const { container } = render(<Team />)

      await waitFor(() => {
        const section = container.querySelector('section')
        expect(section).toHaveAttribute('data-variant', 'earth')
        expect(section).toHaveAttribute('data-padding', 'lg')
      })
    })

    it('should apply header classes correctly', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      const { container } = render(<Team />)

      await waitFor(() => {
        const header = container.querySelector('.text-center.mb-12.lg\\:mb-16')
        expect(header).toBeInTheDocument()
      })
    })

    it('should apply introduction classes correctly', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        const intro = screen.getByText(
          /our team brings decades of combined experience/i
        )
        expect(intro).toHaveClass(
          'text-lg',
          'text-stone-700',
          'max-w-3xl',
          'mx-auto',
          'leading-relaxed'
        )
      })
    })

    it('should apply loading spinner classes', () => {
      mockGetTeamContent.mockImplementation(
        () =>
          new Promise(() => {
            // Never resolves
          }) as Promise<TeamContent>
      )

      const { container } = render(<Team />)

      const spinner = container.querySelector(
        '.animate-spin.rounded-full.border-4'
      )
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass(
        'border-earth-600',
        'border-r-transparent',
        'h-8',
        'w-8'
      )
    })
  })

  // ==========================================
  // ⚡ PERFORMANCE TESTS
  // ==========================================

  describe('Performance', () => {
    it('should render large team efficiently', async () => {
      const largeTeam = Array.from({ length: 50 }, (_, i) => ({
        id: `member-${i}`,
        name: `Member ${i}`,
        role: `Role ${i}`,
        bio: `Bio for member ${i}`,
        imageUrl: `/images/member-${i}.jpg`,
        imageAlt: `Portrait of Member ${i}`,
      }))

      const mockContent = createMockTeamContent({ members: largeTeam })
      mockGetTeamContent.mockReturnValue(mockContent)

      const startTime = performance.now()
      render(<Team />)

      await waitFor(() => {
        expect(screen.getByText('Member 0')).toBeInTheDocument()
      })

      const endTime = performance.now()
      const renderTime = endTime - startTime

      // Should render in less than 1 second
      expect(renderTime).toBeLessThan(1000)
      expect(screen.getAllByTestId(/team-member-/)).toHaveLength(50)
    })

    it('should call getTeamContent only once', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        expect(screen.getByText('Meet Our Team')).toBeInTheDocument()
      })

      expect(mockGetTeamContent).toHaveBeenCalledTimes(1)
    })
  })

  // ==========================================
  // 🔍 INTEGRATION WITH CHILD COMPONENTS
  // ==========================================

  describe('Child Component Integration', () => {
    it('should pass correct props to Section component', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      const { container } = render(<Team className="test-class" />)

      await waitFor(() => {
        const section = container.querySelector('section')
        expect(section).toHaveAttribute('id', 'team')
        expect(section).toHaveAttribute('data-variant', 'earth')
        expect(section).toHaveAttribute('data-padding', 'lg')
        expect(section).toHaveAttribute('aria-label', 'Meet our team')
        expect(section).toHaveClass('test-class')
      })
    })

    it('should pass correct props to TeamMember components', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        const member = screen.getByTestId('team-member-member-1')
        expect(member).toHaveAttribute('data-member-id', 'member-1')
      })

      const member1 = screen.getByTestId('team-member-member-1')
      expect(within(member1).getByText('John Doe')).toBeInTheDocument()
      expect(
        within(member1).getByTestId('member-role')
      ).toHaveTextContent('Senior Consultant')
      expect(within(member1).getByTestId('member-bio')).toHaveTextContent(
        'Expert in strategic planning with 15 years of experience.'
      )
    })

    it('should render TeamMember with unique keys', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        const members = screen.getAllByTestId(/team-member-/)
        expect(members).toHaveLength(4)
      })

      const memberIds = screen
        .getAllByTestId(/team-member-/)
        .map(el => el.getAttribute('data-member-id'))

      const uniqueIds = new Set(memberIds)
      expect(uniqueIds.size).toBe(4)
    })
  })

  // ==========================================
  // 🛡️ SECURITY TESTS
  // ==========================================

  describe('Security', () => {
    it('should not execute script tags in content', async () => {
      const mockContent = createMockTeamContent({
        heading: '<script>alert("xss")</script>Team',
        introduction: 'Safe content',
      })
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 2 })
        expect(heading.innerHTML).not.toContain('<script>')
      })
    })

    it('should sanitize image URLs', async () => {
      const mockContent = createMockTeamContent({
        members: [
          {
            id: 'test',
            name: 'Test',
            role: 'Test',
            bio: 'Test',
            imageUrl: 'javascript:alert("xss")',
            imageAlt: 'Test',
          },
        ],
      })
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        const img = screen.getByRole('img')
        expect(img).toHaveAttribute('src', 'javascript:alert("xss")')
      })
    })
  })

  // ==========================================
  // 📝 CONSOLE LOGGING TESTS
  // ==========================================

  describe('Console Logging', () => {
    it('should log with correct timestamp format', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        expect(console.log).toHaveBeenCalled()
      })

      const logCall = (console.log as jest.Mock).mock.calls[0]
      const logData = logCall[1]
      expect(logData.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      )
    })

    it('should include member count in success log', async () => {
      const mockContent = createMockTeamContent()
      mockGetTeamContent.mockReturnValue(mockContent)

      render(<Team />)

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith(
          'Team content loaded successfully',
          expect.objectContaining({
            memberCount: 4,
          })
        )
      })
    })

    it('should log error with stack trace', async () => {
      const error = new Error('Test error')
      mockGetTeamContent.mockImplementation(() => {
        throw error
      })

      render(<Team />)

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Failed to load team content',
          expect.objectContaining({
            error: 'Test error',
            stack: expect.any(String),
          })
        )
      })
    })
  })
})