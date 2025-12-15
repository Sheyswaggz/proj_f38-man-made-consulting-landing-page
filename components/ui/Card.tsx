import React from 'react';

/**
 * Card component props interface
 */
export interface CardProps {
  /**
   * Optional icon element to display at the top of the card
   */
  icon?: React.ReactNode;
  
  /**
   * Card title text
   */
  title: string;
  
  /**
   * Card description text
   */
  description: string;
  
  /**
   * Additional CSS classes to apply to the card container
   */
  className?: string;
  
  /**
   * Optional click handler for interactive cards
   */
  onClick?: () => void;
  
  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
}

/**
 * Reusable Card component for displaying content with consistent earth-tone styling
 * 
 * Features:
 * - Flexible layout with optional icon
 * - Hover effects with smooth transitions
 * - Responsive design
 * - Accessibility support with ARIA labels
 * - Earth-tone color scheme matching brand guidelines
 * 
 * @example
 * ```tsx
 * <Card
 *   icon={<AlertCircle className="w-8 h-8" />}
 *   title="Implementation Challenges"
 *   description="Traditional AI implementations often fail due to lack of human-centered design"
 *   ariaLabel="Learn about AI implementation challenges"
 * />
 * ```
 */
export const Card: React.FC<CardProps> = ({
  icon,
  title,
  description,
  className = '',
  onClick,
  ariaLabel,
}) => {
  const isInteractive = Boolean(onClick);
  
  const baseClasses = [
    'bg-earth-50',
    'border',
    'border-sand-200',
    'rounded-lg',
    'p-6',
    'transition-all',
    'duration-300',
    'shadow-soft',
  ].join(' ');
  
  const interactiveClasses = isInteractive
    ? [
        'cursor-pointer',
        'hover:shadow-soft-lg',
        'hover:border-earth-300',
        'hover:-translate-y-1',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-earth-500',
        'focus-visible:ring-offset-2',
      ].join(' ')
    : '';
  
  const combinedClasses = [baseClasses, interactiveClasses, className]
    .filter(Boolean)
    .join(' ');
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick?.();
    }
  };
  
  const Component = isInteractive ? 'div' : 'div';
  
  return (
    <Component
      className={combinedClasses}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={ariaLabel || title}
    >
      {icon && (
        <div className="mb-4 text-earth-600 flex items-center justify-center w-12 h-12 bg-sand-100 rounded-lg">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-earth-900 mb-3 text-balance">
        {title}
      </h3>
      
      <p className="text-stone-700 leading-relaxed text-balance">
        {description}
      </p>
    </Component>
  );
};

export default Card;