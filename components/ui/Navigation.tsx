'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';

/**
 * Navigation section configuration
 */
interface NavigationSection {
  id: string;
  label: string;
  href: string;
}

/**
 * Navigation component props
 */
export interface NavigationProps {
  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Navigation sections to display
   */
  sections?: NavigationSection[];

  /**
   * Whether to show navigation on mobile by default
   */
  mobileOpen?: boolean;

  /**
   * Callback when navigation item is clicked
   */
  onNavigate?: (sectionId: string) => void;

  /**
   * Scroll offset for active section detection
   */
  scrollOffset?: number;

  /**
   * Whether to hide navigation on scroll down
   */
  hideOnScroll?: boolean;
}

/**
 * Default navigation sections
 */
const DEFAULT_SECTIONS: NavigationSection[] = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'problem', label: 'Challenges', href: '#problem' },
  { id: 'approach', label: 'Approach', href: '#approach' },
  { id: 'process', label: 'Process', href: '#process' },
  { id: 'social-proof', label: 'Testimonials', href: '#social-proof' },
  { id: 'team', label: 'Team', href: '#team' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

/**
 * Navigation component with smooth scrolling and active section tracking
 *
 * Features:
 * - Smooth scrolling between sections
 * - Active section indication using Intersection Observer
 * - Responsive mobile menu
 * - Keyboard navigation support
 * - Hide on scroll down behavior (optional)
 * - Performance optimized with debouncing
 */
export const Navigation: React.FC<NavigationProps> = ({
  className = '',
  sections = DEFAULT_SECTIONS,
  mobileOpen = false,
  onNavigate,
  scrollOffset = 100,
  hideOnScroll = false,
}) => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(mobileOpen);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);

  /**
   * Handle smooth scroll to section
   */
  const handleScrollToSection = useCallback(
    (sectionId: string, href: string) => {
      try {
        const targetId = href.replace('#', '');
        const targetElement = document.getElementById(targetId);

        if (!targetElement) {
          console.warn(`Navigation: Section ${targetId} not found`);
          return;
        }

        // Close mobile menu
        setIsMobileMenuOpen(false);

        // Calculate scroll position with offset
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - scrollOffset;

        // Perform smooth scroll
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Update active section immediately for better UX
        setActiveSection(sectionId);

        // Call callback if provided
        if (onNavigate) {
          try {
            onNavigate(sectionId);
          } catch (error) {
            console.error('Navigation: Error in onNavigate callback:', error);
          }
        }

        // Update URL hash without triggering scroll
        if (window.history.pushState) {
          window.history.pushState(null, '', href);
        }

        // Log navigation event
        console.log(`Navigation: Scrolled to section ${sectionId}`);
      } catch (error) {
        console.error('Navigation: Error scrolling to section:', error);
      }
    },
    [onNavigate, scrollOffset]
  );

  /**
   * Track active section using Intersection Observer
   */
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: `-${scrollOffset}px 0px -50% 0px`,
      threshold: 0,
    };

    const observers: IntersectionObserver[] = [];

    try {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (!element) {
          return;
        }

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isScrolling) {
              setActiveSection(section.id);
            }
          });
        }, observerOptions);

        observer.observe(element);
        observers.push(observer);
      });
    } catch (error) {
      console.error('Navigation: Error setting up intersection observers:', error);
    }

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections, scrollOffset, isScrolling]);

  /**
   * Handle scroll behavior for hiding navigation
   */
  useEffect(() => {
    if (!hideOnScroll) {
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set scrolling state
      setIsScrolling(true);

      // Show/hide navigation based on scroll direction
      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      }

      lastScrollY.current = currentScrollY;

      // Reset scrolling state after delay
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    try {
      window.addEventListener('scroll', handleScroll, { passive: true });
    } catch (error) {
      console.error('Navigation: Error adding scroll listener:', error);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [hideOnScroll]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, sectionId: string, href: string) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleScrollToSection(sectionId, href);
      }
    },
    [handleScrollToSection]
  );

  /**
   * Toggle mobile menu
   */
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  /**
   * Close mobile menu on escape key
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  /**
   * Prevent body scroll when mobile menu is open
   */
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const baseClasses = [
    'fixed',
    'top-0',
    'left-0',
    'right-0',
    'z-50',
    'bg-earth-50/95',
    'backdrop-blur-sm',
    'border-b',
    'border-sand-200',
    'transition-transform',
    'duration-300',
    isVisible ? 'translate-y-0' : '-translate-y-full',
  ]
    .filter(Boolean)
    .join(' ');

  const combinedClasses = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <nav
      ref={navRef}
      className={combinedClasses}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleScrollToSection('hero', '#hero')}
              className="text-xl font-semibold text-earth-900 hover:text-earth-700 transition-colors focus:outline-none focus:ring-2 focus:ring-earth-500 focus:ring-offset-2 rounded"
              aria-label="Go to home section"
            >
              Man Made
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                const linkClasses = [
                  'px-3',
                  'py-2',
                  'rounded-md',
                  'text-sm',
                  'font-medium',
                  'transition-colors',
                  'focus:outline-none',
                  'focus:ring-2',
                  'focus:ring-earth-500',
                  'focus:ring-offset-2',
                  isActive
                    ? 'bg-earth-200 text-earth-900'
                    : 'text-earth-700 hover:bg-earth-100 hover:text-earth-900',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <button
                    key={section.id}
                    onClick={() => handleScrollToSection(section.id, section.href)}
                    onKeyDown={(e) => handleKeyDown(e, section.id, section.href)}
                    className={linkClasses}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Navigate to ${section.label} section`}
                  >
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-earth-700 hover:text-earth-900 hover:bg-earth-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-earth-500 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">
                {isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              </span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-sand-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-earth-50">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              const linkClasses = [
                'block',
                'px-3',
                'py-2',
                'rounded-md',
                'text-base',
                'font-medium',
                'transition-colors',
                'focus:outline-none',
                'focus:ring-2',
                'focus:ring-earth-500',
                'focus:ring-offset-2',
                isActive
                  ? 'bg-earth-200 text-earth-900'
                  : 'text-earth-700 hover:bg-earth-100 hover:text-earth-900',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <button
                  key={section.id}
                  onClick={() => handleScrollToSection(section.id, section.href)}
                  onKeyDown={(e) => handleKeyDown(e, section.id, section.href)}
                  className={linkClasses}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Navigate to ${section.label} section`}
                >
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;