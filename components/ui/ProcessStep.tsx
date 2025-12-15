import React from 'react';

export interface ProcessStepProps {
  /**
   * Step number in the process sequence
   */
  number: number;
  /**
   * Title of the process step
   */
  title: string;
  /**
   * Detailed description of the step
   */
  description: string;
  /**
   * Optional icon identifier for the step
   */
  icon?: string;
  /**
   * Additional CSS classes for customization
   */
  className?: string;
  /**
   * Whether this is the last step in the sequence
   */
  isLast?: boolean;
}

/**
 * ProcessStep Component
 * 
 * A reusable component for displaying methodology process steps with consistent
 * styling, hover effects, and accessibility features. Designed for the Approach
 * section to showcase Man Made Consulting's human-centered methodology.
 * 
 * Features:
 * - Numbered step indicator with earth-tone styling
 * - Smooth hover transitions and micro-interactions
 * - Responsive design maintaining visual hierarchy
 * - Semantic HTML structure for screen readers
 * - Optional icon support for visual enhancement
 * - Connector line between steps (hidden for last step)
 * 
 * @example
 * ```tsx
 * <ProcessStep
 *   number={1}
 *   title="Discovery & Understanding"
 *   description="We start by deeply understanding your team's workflows..."
 *   icon="search"
 * />
 * ```
 */
export const ProcessStep: React.FC<ProcessStepProps> = ({
  number,
  title,
  description,
  icon,
  className = '',
  isLast = false,
}) => {
  return (
    <div
      className={`relative flex gap-6 ${className}`}
      role="listitem"
      aria-label={`Step ${number}: ${title}`}
    >
      {/* Step Number Circle */}
      <div className="relative flex-shrink-0">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-earth-100 text-earth-800 font-serif font-semibold text-lg transition-all duration-300 ease-in-out hover:bg-earth-200 hover:scale-110 hover:shadow-soft focus-within:outline focus-within:outline-2 focus-within:outline-earth-500 focus-within:outline-offset-2"
          aria-hidden="true"
        >
          {number}
        </div>

        {/* Connector Line */}
        {!isLast && (
          <div
            className="absolute left-1/2 top-12 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-earth-200 to-transparent"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <div className="group">
          {/* Title with optional icon */}
          <div className="flex items-center gap-3 mb-3">
            {icon && (
              <span
                className="text-earth-600 transition-colors duration-300 group-hover:text-earth-700"
                aria-hidden="true"
              >
                {/* Icon placeholder - can be replaced with actual icon component */}
                <svg
                  className="h-5 w-5"
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
              </span>
            )}
            <h3 className="text-xl font-serif font-semibold text-earth-900 transition-colors duration-300 group-hover:text-earth-700">
              {title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-base text-stone-700 leading-relaxed transition-colors duration-300 group-hover:text-stone-800">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessStep;