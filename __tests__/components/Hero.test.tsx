import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Hero } from '@/components/sections/Hero'

// Mock the Button component
jest.mock('@/components/ui/Button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    size,
    className,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode
    onClick?: () => void
    variant?: string
    size?: string
    className?: string
    'aria-label'?: string
  }) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  ),
}))

// Mock console methods to verify logging
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation()
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation()

// Mock performance API
const mockPerformanceNow = jest.fn()
Object.defineProperty(global.performance, 'now', {
  writable: true,
  value: mockPerformanceNow,
})

// Mock scrollIntoView
const mockScrollIntoView = jest.fn()
Element.prototype.scrollIntoView = mockScrollIntoView

describe('Hero Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPerformanceNow.mockReturnValue(0)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('🎨 Rendering & Structure', () => {
    test('renders hero section with correct structure', () => {
      render(<Hero />)

      const section = screen.getByRole('banner')
      expect(section).toBeInTheDocument()
      expect(section).toHaveAttribute('id', 'hero')
      expect(section).toHaveAttribute('aria-labelledby', 'hero-heading')
    })

    test('renders main heading with correct text', () => {
      render(<Hero />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveAttribute('id', 'hero-heading')
      expect(heading).toHaveTextContent(/AI Consulting That Puts/i)
      expect(heading).toHaveTextContent(/Humans First/i)
    })

    test('renders value proposition text', () => {
      render(<Hero />)

      expect(
        screen.getByText(
          /We're not here to automate your team away/i,
          { exact: false }
        )
      ).toBeInTheDocument()
    })

    test('renders supporting text without buzzwords', () => {
      render(<Hero />)

      expect(
        screen.getByText(/No buzzwords. No hype/i, { exact: false })
      ).toBeInTheDocument()
    })

    test('renders inspirational quote', () => {
      render(<Hero />)

      expect(
        screen.getByText(
          /Technology should serve people, not the other way around/i
        )
      ).toBeInTheDocument()
    })

    test('applies custom className when provided', () => {
      const customClass = 'custom-hero-class'
      render(<Hero className={customClass} />)

      const section = screen.getByRole('banner')
      expect(section).toHaveClass(customClass)
    })

    test('applies default classes without custom className', () => {
      render(<Hero />)

      const section = screen.getByRole('banner')
      expect(section).toHaveClass('relative')
      expect(section).toHaveClass('w-full')
      expect(section).toHaveClass('flex')
      expect(section).toHaveClass('items-center')
      expect(section).toHaveClass('justify-center')
    })
  })

  describe('🎯 Call-to-Action Buttons', () => {
    test('renders primary CTA button with correct text', () => {
      render(<Hero />)

      const ctaButton = screen.getByRole('button', { name: /Let's Talk/i })
      expect(ctaButton).toBeInTheDocument()
      expect(ctaButton).toHaveAttribute(
        'aria-label',
        'Start a conversation about AI consulting'
      )
    })

    test('renders secondary CTA button with correct text', () => {
      render(<Hero />)

      const learnMoreButton = screen.getByRole('button', {
        name: /Our Approach/i,
      })
      expect(learnMoreButton).toBeInTheDocument()
      expect(learnMoreButton).toHaveAttribute(
        'aria-label',
        'Learn more about our approach'
      )
    })

    test('primary CTA button has correct variant and size', () => {
      render(<Hero />)

      const ctaButton = screen.getByRole('button', { name: /Let's Talk/i })
      expect(ctaButton).toHaveAttribute('data-variant', 'primary')
      expect(ctaButton).toHaveAttribute('data-size', 'lg')
    })

    test('secondary CTA button has correct variant and size', () => {
      render(<Hero />)

      const learnMoreButton = screen.getByRole('button', {
        name: /Our Approach/i,
      })
      expect(learnMoreButton).toHaveAttribute('data-variant', 'secondary')
      expect(learnMoreButton).toHaveAttribute('data-size', 'lg')
    })

    test('CTA buttons have minimum width class', () => {
      render(<Hero />)

      const ctaButton = screen.getByRole('button', { name: /Let's Talk/i })
      const learnMoreButton = screen.getByRole('button', {
        name: /Our Approach/i,
      })

      expect(ctaButton).toHaveClass('min-w-[200px]')
      expect(learnMoreButton).toHaveClass('min-w-[200px]')
    })
  })

  describe('🔗 Navigation & Scrolling', () => {
    test('primary CTA scrolls to contact section when clicked', async () => {
      const mockContactSection = document.createElement('section')
      mockContactSection.id = 'contact'
      document.body.appendChild(mockContactSection)

      render(<Hero />)

      const ctaButton = screen.getByRole('button', { name: /Let's Talk/i })
      await userEvent.click(ctaButton)

      await waitFor(() => {
        expect(mockScrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'start',
        })
      })

      document.body.removeChild(mockContactSection)
    })

    test('secondary CTA scrolls to services section when clicked', async () => {
      const mockServicesSection = document.createElement('section')
      mockServicesSection.id = 'services'
      document.body.appendChild(mockServicesSection)

      render(<Hero />)

      const learnMoreButton = screen.getByRole('button', {
        name: /Our Approach/i,
      })
      await userEvent.click(learnMoreButton)

      await waitFor(() => {
        expect(mockScrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'start',
        })
      })

      document.body.removeChild(mockServicesSection)
    })

    test('logs warning when contact section not found', async () => {
      render(<Hero />)

      const ctaButton = screen.getByRole('button', { name: /Let's Talk/i })
      await userEvent.click(ctaButton)

      await waitFor(() => {
        expect(mockConsoleWarn).toHaveBeenCalledWith(
          '[Hero] Contact section not found for scroll navigation'
        )
      })
    })

    test('logs warning when services section not found', async () => {
      render(<Hero />)

      const learnMoreButton = screen.getByRole('button', {
        name: /Our Approach/i,
      })
      await userEvent.click(learnMoreButton)

      await waitFor(() => {
        expect(mockConsoleWarn).toHaveBeenCalledWith(
          '[Hero] Services section not found for scroll navigation'
        )
      })
    })
  })

  describe('📊 Analytics & Logging', () => {
    test('logs component mount event', () => {
      render(<Hero />)

      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Hero] Component mounted',
        expect.objectContaining({
          section: 'hero',
          event: 'mount',
          timestamp: expect.any(String),
        })
      )
    })

    test('logs component unmount event with render time', () => {
      mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(150)

      const { unmount } = render(<Hero />)
      unmount()

      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Hero] Component unmounted',
        expect.objectContaining({
          section: 'hero',
          event: 'unmount',
          timestamp: expect.any(String),
          renderTime: '150.00ms',
        })
      )
    })

    test('logs primary CTA click event', async () => {
      const mockContactSection = document.createElement('section')
      mockContactSection.id = 'contact'
      document.body.appendChild(mockContactSection)

      render(<Hero />)

      const ctaButton = screen.getByRole('button', { name: /Let's Talk/i })
      await userEvent.click(ctaButton)

      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Hero] CTA button clicked',
        expect.objectContaining({
          section: 'hero',
          action: 'cta_click',
          timestamp: expect.any(String),
        })
      )

      document.body.removeChild(mockContactSection)
    })

    test('logs secondary CTA click event', async () => {
      const mockServicesSection = document.createElement('section')
      mockServicesSection.id = 'services'
      document.body.appendChild(mockServicesSection)

      render(<Hero />)

      const learnMoreButton = screen.getByRole('button', {
        name: /Our Approach/i,
      })
      await userEvent.click(learnMoreButton)

      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Hero] Learn more button clicked',
        expect.objectContaining({
          section: 'hero',
          action: 'learn_more_click',
          timestamp: expect.any(String),
        })
      )

      document.body.removeChild(mockServicesSection)
    })
  })

  describe('♿ Accessibility', () => {
    test('has proper ARIA labels on section', () => {
      render(<Hero />)

      const section = screen.getByRole('banner')
      expect(section).toHaveAttribute('aria-labelledby', 'hero-heading')
    })

    test('has proper ARIA labels on CTA buttons', () => {
      render(<Hero />)

      const ctaButton = screen.getByRole('button', { name: /Let's Talk/i })
      const learnMoreButton = screen.getByRole('button', {
        name: /Our Approach/i,
      })

      expect(ctaButton).toHaveAttribute(
        'aria-label',
        'Start a conversation about AI consulting'
      )
      expect(learnMoreButton).toHaveAttribute(
        'aria-label',
        'Learn more about our approach'
      )
    })

    test('decorative background has aria-hidden', () => {
      const { container } = render(<Hero />)

      const decorativeDiv = container.querySelector('[aria-hidden="true"]')
      expect(decorativeDiv).toBeInTheDocument()
    })

    test('heading has proper hierarchy (h1)', () => {
      render(<Hero />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
    })

    test('all interactive elements are keyboard accessible', async () => {
      render(<Hero />)

      const ctaButton = screen.getByRole('button', { name: /Let's Talk/i })
      const learnMoreButton = screen.getByRole('button', {
        name: /Our Approach/i,
      })

      ctaButton.focus()
      expect(ctaButton).toHaveFocus()

      await userEvent.tab()
      expect(learnMoreButton).toHaveFocus()
    })
  })

  describe('🎨 Styling & Responsive Design', () => {
    test('applies gradient background classes', () => {
      render(<Hero />)

      const section = screen.getByRole('banner')
      expect(section).toHaveClass('bg-gradient-to-br')
      expect(section).toHaveClass('from-earth-50')
      expect(section).toHaveClass('via-sand-50')
      expect(section).toHaveClass('to-clay-50')
    })

    test('applies responsive padding classes', () => {
      const { container } = render(<Hero />)

      const containerDiv = container.querySelector('.container')
      expect(containerDiv).toHaveClass('px-4')
      expect(containerDiv).toHaveClass('sm:px-6')
      expect(containerDiv).toHaveClass('lg:px-8')
    })

    test('applies responsive text size classes to heading', () => {
      render(<Hero />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('text-4xl')
      expect(heading).toHaveClass('sm:text-5xl')
      expect(heading).toHaveClass('lg:text-6xl')
    })

    test('applies animation classes', () => {
      render(<Hero />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('animate-fade-in')
    })

    test('applies minimum height for viewport coverage', () => {
      render(<Hero />)

      const section = screen.getByRole('banner')
      expect(section).toHaveClass('min-h-[calc(100vh-4rem)]')
    })
  })

  describe('🔄 Component Lifecycle', () => {
    test('handles multiple mount/unmount cycles', () => {
      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(150)

      const { unmount, rerender } = render(<Hero />)
      unmount()

      rerender(<Hero />)
      unmount()

      expect(mockConsoleLog).toHaveBeenCalledTimes(4) // 2 mounts + 2 unmounts
    })

    test('cleans up event listeners on unmount', () => {
      const { unmount } = render(<Hero />)

      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Hero] Component mounted',
        expect.any(Object)
      )

      unmount()

      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Hero] Component unmounted',
        expect.any(Object)
      )
    })
  })

  describe('🎭 User Interactions', () => {
    test('handles rapid button clicks gracefully', async () => {
      const mockContactSection = document.createElement('section')
      mockContactSection.id = 'contact'
      document.body.appendChild(mockContactSection)

      render(<Hero />)

      const ctaButton = screen.getByRole('button', { name: /Let's Talk/i })

      await userEvent.click(ctaButton)
      await userEvent.click(ctaButton)
      await userEvent.click(ctaButton)

      await waitFor(() => {
        expect(mockScrollIntoView).toHaveBeenCalledTimes(3)
      })

      document.body.removeChild(mockContactSection)
    })

    test('handles keyboard navigation', async () => {
      render(<Hero />)

      const ctaButton = screen.getByRole('button', { name: /Let's Talk/i })

      ctaButton.focus()
      fireEvent.keyDown(ctaButton, { key: 'Enter', code: 'Enter' })

      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Hero] CTA button clicked',
        expect.any(Object)
      )
    })
  })

  describe('🛡️ Edge Cases & Error Handling', () => {
    test('handles missing window object gracefully', () => {
      const originalWindow = global.window

      // @ts-expect-error - Testing edge case
      delete global.window

      expect(() => render(<Hero />)).not.toThrow()

      global.window = originalWindow
    })

    test('handles missing document.getElementById gracefully', async () => {
      render(<Hero />)

      const ctaButton = screen.getByRole('button', { name: /Let's Talk/i })
      await userEvent.click(ctaButton)

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        '[Hero] Contact section not found for scroll navigation'
      )
    })

    test('renders without className prop', () => {
      render(<Hero />)

      const section = screen.getByRole('banner')
      expect(section).toBeInTheDocument()
    })

    test('renders with empty className', () => {
      render(<Hero className="" />)

      const section = screen.getByRole('banner')
      expect(section).toBeInTheDocument()
    })
  })

  describe('⚡ Performance', () => {
    test('calculates render time correctly', () => {
      mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(250.5)

      const { unmount } = render(<Hero />)
      unmount()

      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Hero] Component unmounted',
        expect.objectContaining({
          renderTime: '250.50ms',
        })
      )
    })

    test('uses memoized callback for CTA click handler', async () => {
      const mockContactSection = document.createElement('section')
      mockContactSection.id = 'contact'
      document.body.appendChild(mockContactSection)

      const { rerender } = render(<Hero />)

      const ctaButton = screen.getByRole('button', { name: /Let's Talk/i })
      const firstClickHandler = ctaButton.onclick

      rerender(<Hero />)

      const ctaButtonAfterRerender = screen.getByRole('button', {
        name: /Let's Talk/i,
      })
      const secondClickHandler = ctaButtonAfterRerender.onclick

      expect(firstClickHandler).toBe(secondClickHandler)

      document.body.removeChild(mockContactSection)
    })
  })

  describe('📱 Responsive Behavior', () => {
    test('applies responsive flex direction classes', () => {
      const { container } = render(<Hero />)

      const buttonContainer = container.querySelector(
        '.flex.flex-col.sm\\:flex-row'
      )
      expect(buttonContainer).toBeInTheDocument()
    })

    test('applies responsive gap classes', () => {
      const { container } = render(<Hero />)

      const buttonContainer = container.querySelector('.gap-4')
      expect(buttonContainer).toBeInTheDocument()
    })
  })

  describe('🎨 Visual Design Elements', () => {
    test('renders decorative background gradients', () => {
      const { container } = render(<Hero />)

      const decorativeDiv = container.querySelector('[aria-hidden="true"]')
      expect(decorativeDiv).toBeInTheDocument()

      const gradients = decorativeDiv?.querySelectorAll('.absolute')
      expect(gradients?.length).toBeGreaterThan(0)
    })

    test('applies earth-toned color palette', () => {
      render(<Hero />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('text-earth-900')

      const span = heading.querySelector('span')
      expect(span).toHaveClass('text-earth-700')
    })

    test('applies serif font to heading', () => {
      render(<Hero />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('font-serif')
    })
  })

  describe('📝 Content Quality', () => {
    test('avoids corporate buzzwords in copy', () => {
      render(<Hero />)

      const text = screen.getByText(/No buzzwords. No hype/i, { exact: false })
      expect(text).toBeInTheDocument()
    })

    test('emphasizes human-first approach', () => {
      render(<Hero />)

      expect(
        screen.getByText(/AI Consulting That Puts/i, { exact: false })
      ).toBeInTheDocument()
      expect(screen.getByText(/Humans First/i)).toBeInTheDocument()
    })

    test('communicates honest, conversational tone', () => {
      render(<Hero />)

      expect(
        screen.getByText(/Just honest conversations/i, { exact: false })
      ).toBeInTheDocument()
    })
  })

  describe('🔍 Component Display Name', () => {
    test('has correct display name', () => {
      expect(Hero.displayName).toBe('Hero')
    })
  })
})