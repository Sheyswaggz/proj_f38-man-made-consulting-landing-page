import React from 'react';
import { Section } from '@/components/ui/Section';
import { ProcessStep } from '@/components/ui/ProcessStep';
import { getApproachContent } from '@/lib/content/approach';

/**
 * Approach component props interface
 */
export interface ApproachProps {
  /**
   * Optional additional CSS classes
   */
  className?: string;
}

/**
 * Approach Section Component
 *
 * Showcases Man Made Consulting's human-centered methodology and approach,
 * differentiating from typical automation-focused AI consulting. Features:
 * - Clear explanation of human-centered methodology
 * - Visual process flow with step-by-step breakdown
 * - Core principles emphasizing collaboration over automation
 * - Differentiators comparing traditional vs. human-centered approaches
 * - Responsive design with smooth transitions
 * - Accessibility-compliant with proper semantic structure
 *
 * Performance optimizations:
 * - Static content rendering
 * - CSS-based animations (no JavaScript animation libraries)
 * - Lazy loading considerations for images (if added)
 * - Minimal re-renders with React.memo
 *
 * @example
 * ```tsx
 * <Approach />
 * ```
 */
export const Approach: React.FC<ApproachProps> = React.memo(
  ({ className = '' }) => {
    const content = getApproachContent();

    return (
      <Section
        id="approach"
        variant="earth"
        padding="xl"
        className={className}
        ariaLabel="Our Approach and Methodology"
      >
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-earth-900 mb-6">
            {content.heading}
          </h2>
          <p className="text-xl text-earth-700 mb-8">{content.subheading}</p>
          <p className="text-lg text-stone-700 leading-relaxed">
            {content.introduction}
          </p>
        </div>

        {/* Methodology Steps */}
        <div className="mb-20">
          <h3 className="text-3xl font-serif font-bold text-earth-900 text-center mb-12">
            Our Methodology
          </h3>
          <div
            className="mx-auto max-w-4xl"
            role="list"
            aria-label="Methodology steps"
          >
            {content.methodologySteps.map((step, index) => (
              <ProcessStep
                key={step.id}
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
                isLast={index === content.methodologySteps.length - 1}
                className="transition-opacity duration-500 ease-in-out"
              />
            ))}
          </div>
        </div>

        {/* Core Principles */}
        <div className="mb-20">
          <h3 className="text-3xl font-serif font-bold text-earth-900 text-center mb-12">
            Core Principles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto max-w-6xl">
            {content.corePrinciples.map((principle) => (
              <div
                key={principle.id}
                className="group bg-white rounded-lg p-8 shadow-soft hover:shadow-elevated transition-all duration-300 ease-in-out hover:-translate-y-1"
                role="article"
                aria-labelledby={`principle-${principle.id}-title`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-earth-100 flex items-center justify-center text-earth-700 transition-colors duration-300 group-hover:bg-earth-200"
                    aria-hidden="true"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h4
                    id={`principle-${principle.id}-title`}
                    className="text-xl font-serif font-semibold text-earth-900 transition-colors duration-300 group-hover:text-earth-700"
                  >
                    {principle.title}
                  </h4>
                </div>
                <p className="text-base text-stone-700 leading-relaxed transition-colors duration-300 group-hover:text-stone-800">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Differentiators */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif font-bold text-earth-900 text-center mb-12">
            How We're Different
          </h3>
          <div className="space-y-8 mx-auto max-w-5xl">
            {content.differentiators.map((diff) => (
              <div
                key={diff.id}
                className="bg-white rounded-lg p-8 shadow-soft hover:shadow-elevated transition-all duration-300 ease-in-out"
                role="article"
                aria-labelledby={`diff-${diff.id}-title`}
              >
                <h4
                  id={`diff-${diff.id}-title`}
                  className="text-2xl font-serif font-semibold text-earth-900 mb-6"
                >
                  {diff.title}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
                      Traditional Approach
                    </div>
                    <p className="text-base text-stone-600 leading-relaxed">
                      {diff.traditional}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-earth-700 uppercase tracking-wide">
                      Our Approach
                    </div>
                    <p className="text-base text-earth-900 leading-relaxed font-medium">
                      {diff.ourApproach}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-stone-200">
                  <div className="text-sm font-semibold text-moss-700 uppercase tracking-wide mb-2">
                    Impact
                  </div>
                  <p className="text-base text-stone-700 leading-relaxed">
                    {diff.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Statement */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="bg-earth-900 rounded-lg p-8 sm:p-12 shadow-elevated">
            <p className="text-lg text-earth-50 leading-relaxed">
              {content.closingStatement}
            </p>
          </div>
        </div>
      </Section>
    );
  }
);

Approach.displayName = 'Approach';

export default Approach;