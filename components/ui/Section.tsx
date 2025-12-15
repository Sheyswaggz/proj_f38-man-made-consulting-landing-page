import React from 'react';

/**
 * Section component props interface
 */
interface SectionProps {
  /**
   * Child elements to render within the section
   */
  children: React.ReactNode;

  /**
   * Optional additional CSS classes
   */
  className?: string;

  /**
   * Section ID for navigation and accessibility
   */
  id?: string;

  /**
   * Background variant for the section
   * @default 'default'
   */
  variant?: 'default' | 'earth' | 'sand' | 'moss' | 'clay' | 'stone';

  /**
   * Padding size variant
   * @default 'default'
   */
  padding?: 'none' | 'sm' | 'default' | 'lg' | 'xl';

  /**
   * Maximum width constraint
   * @default '7xl'
   */
  maxWidth?: 'full' | '7xl' | '6xl' | '5xl' | '4xl';

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;

  /**
   * HTML element to render as
   * @default 'section'
   */
  as?: 'section' | 'div' | 'article' | 'aside' | 'main';
}

/**
 * Background variant class mappings
 */
const VARIANT_CLASSES: Record<NonNullable<SectionProps['variant']>, string> = {
  default: 'bg-earth-50',
  earth: 'bg-earth-100',
  sand: 'bg-sand-50',
  moss: 'bg-moss-50',
  clay: 'bg-clay-50',
  stone: 'bg-stone-50',
} as const;

/**
 * Padding size class mappings
 */
const PADDING_CLASSES: Record<NonNullable<SectionProps['padding']>, string> = {
  none: '',
  sm: 'py-8 sm:py-12',
  default: 'py-12 sm:py-16 lg:py-20',
  lg: 'py-16 sm:py-20 lg:py-24',
  xl: 'py-20 sm:py-24 lg:py-32',
} as const;

/**
 * Max width class mappings
 */
const MAX_WIDTH_CLASSES: Record<NonNullable<SectionProps['maxWidth']>, string> = {
  full: 'max-w-full',
  '7xl': 'max-w-7xl',
  '6xl': 'max-w-6xl',
  '5xl': 'max-w-5xl',
  '4xl': 'max-w-4xl',
} as const;

/**
 * Reusable section wrapper component with consistent spacing and layout
 * 
 * Provides a standardized container for page sections with:
 * - Configurable background variants using earth-tone color palette
 * - Responsive padding options
 * - Maximum width constraints
 * - Accessibility features
 * - Semantic HTML element selection
 * 
 * @example
 * ```tsx
 * <Section id="problem" variant="sand" padding="lg">
 *   <h2>Common Challenges</h2>
 *   <p>Content here...</p>
 * </Section>
 * ```
 */
export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id,
  variant = 'default',
  padding = 'default',
  maxWidth = '7xl',
  ariaLabel,
  as: Component = 'section',
}) => {
  const variantClass = VARIANT_CLASSES[variant];
  const paddingClass = PADDING_CLASSES[padding];
  const maxWidthClass = MAX_WIDTH_CLASSES[maxWidth];

  const sectionClasses = [
    'w-full',
    variantClass,
    paddingClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const containerClasses = [
    'mx-auto',
    'px-4',
    'sm:px-6',
    'lg:px-8',
    maxWidthClass,
  ].join(' ');

  return (
    <Component
      id={id}
      className={sectionClasses}
      aria-label={ariaLabel}
      data-section={id}
    >
      <div className={containerClasses}>{children}</div>
    </Component>
  );
};

export default Section;