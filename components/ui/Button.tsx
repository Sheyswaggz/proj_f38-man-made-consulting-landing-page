import React from 'react';

/**
 * Button variant types for styling
 */
type ButtonVariant = 'primary' | 'secondary';

/**
 * Button size types
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Button component
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Size of the button
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Icon to display before the button text
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icon to display after the button text
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Whether the button should take full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Button content
   */
  children: React.ReactNode;
}

/**
 * Get variant-specific CSS classes
 */
const getVariantClasses = (variant: ButtonVariant): string => {
  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-earth-600 text-white hover:bg-earth-700 active:bg-earth-800 focus-visible:ring-earth-500 disabled:bg-earth-300 disabled:text-earth-500',
    secondary:
      'bg-sand-100 text-earth-900 hover:bg-sand-200 active:bg-sand-300 focus-visible:ring-sand-500 disabled:bg-sand-50 disabled:text-sand-400 border border-sand-300',
  };
  
  return variants[variant];
};

/**
 * Get size-specific CSS classes
 */
const getSizeClasses = (size: ButtonSize): string => {
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return sizes[size];
};

/**
 * Reusable Button component with earth-toned styling and accessibility features
 * 
 * Features:
 * - Multiple variants (primary, secondary)
 * - Multiple sizes (sm, md, lg)
 * - Loading state with visual feedback
 * - Icon support (left and right)
 * - Full accessibility with ARIA attributes
 * - Keyboard navigation support
 * - Focus visible states
 * - Disabled state handling
 * - Responsive design
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * <Button variant="secondary" leftIcon={<Icon />} isLoading>
 *   Loading...
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);
    const widthClasses = fullWidth ? 'w-full' : '';

    const buttonClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`.trim();

    const iconSpacing = size === 'sm' ? 'gap-1.5' : size === 'md' ? 'gap-2' : 'gap-2.5';

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={buttonClasses}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        <span className={`inline-flex items-center ${iconSpacing}`}>
          {isLoading && (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          
          {!isLoading && leftIcon && (
            <span className="inline-flex items-center" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          
          <span>{children}</span>
          
          {!isLoading && rightIcon && (
            <span className="inline-flex items-center" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;