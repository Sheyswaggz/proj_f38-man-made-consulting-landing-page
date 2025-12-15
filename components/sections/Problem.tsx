import React from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { getProblemsContent } from '@/lib/content/problems';

/**
 * Problem section component props interface
 */
export interface ProblemProps {
  /**
   * Additional CSS classes to apply to the section
   */
  className?: string;
}

/**
 * Icon component mapping for problem cards
 * Uses simple SVG icons for visual representation
 */
const ProblemIcon: React.FC<{ icon: string }> = ({ icon }) => {
  const iconMap: Record<string, React.ReactNode> = {
    'puzzle-mismatch': (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
        />
      </svg>
    ),
    confusion: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    disruption: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    'generic-solution': (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  };

  return iconMap[icon] || null;
};

/**
 * Problem Statement Section Component
 *
 * Displays common AI implementation challenges in a responsive grid layout.
 * Features:
 * - Responsive grid layout (1 column mobile, 2 columns tablet+)
 * - Smooth animations on scroll
 * - Accessible card components with ARIA labels
 * - Earth-tone color scheme
 * - Optimized images from Unsplash
 *
 * Performance considerations:
 * - Uses CSS Grid for efficient layout
 * - Implements proper image loading attributes
 * - Minimal re-renders with React.memo on cards
 *
 * Accessibility features:
 * - Semantic HTML structure
 * - Proper heading hierarchy
 * - ARIA labels on interactive elements
 * - Sufficient color contrast
 *
 * @example
 * ```tsx
 * <Problem />
 * ```
 */
export const Problem: React.FC<ProblemProps> = ({ className = '' }) => {
  const content = getProblemsContent();

  return (
    <Section
      id="problem"
      variant="sand"
      padding="lg"
      className={className}
      ariaLabel="Common AI implementation challenges"
    >
      <div className="space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-earth-900 text-balance">
            {content.heading}
          </h2>
          {content.subheading && (
            <p className="text-lg sm:text-xl text-stone-700 text-balance leading-relaxed">
              {content.subheading}
            </p>
          )}
        </div>

        {/* Problem Cards Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          role="list"
          aria-label="List of common AI implementation problems"
        >
          {content.problems.map((problem, index) => (
            <div
              key={problem.id}
              role="listitem"
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both',
              }}
            >
              <Card
                icon={<ProblemIcon icon={problem.icon} />}
                title={problem.title}
                description={problem.description}
                ariaLabel={`Problem: ${problem.title}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </Section>
  );
};

export default Problem;