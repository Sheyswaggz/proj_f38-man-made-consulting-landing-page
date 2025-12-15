import React, { forwardRef, InputHTMLAttributes, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      variant = 'default',
      inputSize = 'md',
      leftIcon,
      rightIcon,
      className = '',
      id: providedId,
      disabled = false,
      required = false,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;
    const errorId = `${inputId}-error`;
    const helperTextId = `${inputId}-helper`;

    const hasError = Boolean(error);
    const describedByIds = [
      hasError ? errorId : null,
      helperText && !hasError ? helperTextId : null,
      ariaDescribedBy,
    ]
      .filter(Boolean)
      .join(' ');

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    };

    const variantClasses = {
      default:
        'bg-earth-50 border border-sand-300 focus:border-earth-500 focus:ring-2 focus:ring-earth-200',
      filled:
        'bg-sand-100 border-0 border-b-2 border-sand-400 focus:border-earth-600 focus:bg-sand-50',
      outlined:
        'bg-transparent border-2 border-sand-400 focus:border-earth-600 focus:ring-2 focus:ring-earth-200',
    };

    const baseClasses = [
      'w-full',
      'rounded-md',
      'font-sans',
      'text-stone-900',
      'placeholder:text-stone-400',
      'transition-all',
      'duration-200',
      'outline-none',
      sizeClasses[inputSize],
      variantClasses[variant],
    ].join(' ');

    const errorClasses = hasError
      ? 'border-red-500 focus:border-red-600 focus:ring-red-200'
      : '';

    const disabledClasses = disabled
      ? 'opacity-60 cursor-not-allowed bg-stone-100'
      : 'hover:border-earth-400';

    const iconPaddingClasses = [
      leftIcon ? 'pl-10' : '',
      rightIcon ? 'pr-10' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const combinedInputClasses = [
      baseClasses,
      errorClasses,
      disabledClasses,
      iconPaddingClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const containerClasses = [
      'relative',
      fullWidth ? 'w-full' : 'w-auto',
    ].join(' ');

    const labelClasses = [
      'block',
      'mb-1.5',
      'text-sm',
      'font-medium',
      'text-stone-800',
      disabled ? 'opacity-60' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const iconBaseClasses = [
      'absolute',
      'top-1/2',
      '-translate-y-1/2',
      'pointer-events-none',
      'text-stone-500',
      disabled ? 'opacity-60' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const leftIconClasses = [iconBaseClasses, 'left-3'].join(' ');
    const rightIconClasses = [iconBaseClasses, 'right-3'].join(' ');

    const errorTextClasses = [
      'mt-1.5',
      'text-sm',
      'text-red-600',
      'flex',
      'items-start',
      'gap-1',
    ].join(' ');

    const helperTextClasses = [
      'mt-1.5',
      'text-sm',
      'text-stone-600',
    ].join(' ');

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
            {required && (
              <span className="ml-1 text-red-600" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          {leftIcon && <div className={leftIconClasses}>{leftIcon}</div>}
          <input
            ref={ref}
            id={inputId}
            className={combinedInputClasses}
            disabled={disabled}
            required={required}
            aria-invalid={hasError || ariaInvalid}
            aria-describedby={describedByIds || undefined}
            aria-required={required}
            {...props}
          />
          {rightIcon && <div className={rightIconClasses}>{rightIcon}</div>}
        </div>
        {hasError && (
          <div
            id={errorId}
            className={errorTextClasses}
            role="alert"
            aria-live="polite"
          >
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
        {helperText && !hasError && (
          <div id={helperTextId} className={helperTextClasses}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;