import React, { useState, useRef, useEffect } from 'react';

/**
 * ExpandableCard component props interface
 */
export interface ExpandableCardProps {
  /**
   * Unique identifier for the card
   */
  id: string;

  /**
   * Card title text
   */
  title: string;

  /**
   * Card summary/preview text shown when collapsed
   */
  summary: string;

  /**
   * Full content shown when expanded
   */
  children: React.ReactNode;

  /**
   * Optional icon element to display
   */
  icon?: React.ReactNode;

  /**
   * Whether the card is initially expanded
   * @default false
   */
  defaultExpanded?: boolean;

  /**
   * Callback when expansion state changes
   */
  onExpandChange?: (expanded: boolean) => void;

  /**
   * Additional CSS classes for the container
   */
  className?: string;

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
}

/**
 * ExpandableCard component for displaying collapsible content with smooth animations
 *
 * Features:
 * - Smooth expand/collapse animations
 * - Full keyboard navigation support (Enter, Space, Escape)
 * - Proper ARIA attributes for screen readers
 * - Focus management for accessibility
 * - Responsive design with earth-tone styling
 * - Auto-scroll to expanded content
 *
 * @example
 * ```tsx
 * <ExpandableCard
 *   id="step-1"
 *   title="Discovery Phase"
 *   summary="Understanding your needs and challenges"
 *   icon={<SearchIcon />}
 * >
 *   <p>Detailed content about the discovery phase...</p>
 * </ExpandableCard>
 * ```
 */
export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  id,
  title,
  summary,
  children,
  icon,
  defaultExpanded = false,
  onExpandChange,
  className = '',
  ariaLabel,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);

    if (onExpandChange) {
      onExpandChange(newExpandedState);
    }

    if (newExpandedState && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 300);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    } else if (event.key === 'Escape' && isExpanded) {
      event.preventDefault();
      setIsExpanded(false);
      if (onExpandChange) {
        onExpandChange(false);
      }
    }
  };

  const baseClasses = [
    'bg-earth-50',
    'border',
    'border-sand-200',
    'rounded-lg',
    'transition-all',
    'duration-300',
    'shadow-soft',
  ].join(' ');

  const expandedClasses = isExpanded
    ? 'shadow-soft-lg border-earth-300'
    : 'hover:shadow-soft-lg hover:border-earth-300';

  const combinedClasses = [baseClasses, expandedClasses, className]
    .filter(Boolean)
    .join(' ');

  const buttonId = `${id}-button`;
  const contentId = `${id}-content`;

  return (
    <div ref={cardRef} className={combinedClasses}>
      <button
        id={buttonId}
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        aria-label={ariaLabel || `${isExpanded ? 'Collapse' : 'Expand'} ${title}`}
        className="w-full text-left p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-500 focus-visible:ring-offset-2 rounded-lg transition-colors duration-200"
      >
        <div className="flex items-start gap-4">
          {icon && (
            <div
              className="flex-shrink-0 text-earth-600 flex items-center justify-center w-12 h-12 bg-sand-100 rounded-lg"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-2">
              <h3 className="text-xl font-semibold text-earth-900 text-balance">
                {title}
              </h3>

              <svg
                className={`flex-shrink-0 w-6 h-6 text-earth-600 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <p className="text-stone-700 leading-relaxed text-balance">
              {summary}
            </p>
          </div>
        </div>
      </button>

      <div
        id={contentId}
        ref={contentRef}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isExpanded}
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : '0px',
          opacity: isExpanded ? 1 : 0,
        }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div className="px-6 pb-6 pt-2">
          <div className="border-t border-sand-200 pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ExpandableCard;