import React, { forwardRef, TextareaHTMLAttributes, useId, useState, useCallback } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  textareaSize?: 'sm' | 'md' | 'lg';
  maxLength?: number;
  showCharacterCount?: boolean;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      variant = 'default',
      textareaSize = 'md',
      maxLength,
      showCharacterCount = false,
      autoResize = false,
      minRows = 3,
      maxRows,
      className = '',
      id: providedId,
      disabled = false,
      required = false,
      value,
      defaultValue,
      onChange,
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
    const charCountId = `${inputId}-char-count`;

    const [internalValue, setInternalValue] = useState<string>(
      (value as string) || (defaultValue as string) || ''
    );

    const currentValue = value !== undefined ? (value as string) : internalValue;
    const characterCount = currentValue.length;

    const hasError = Boolean(error);
    const isOverLimit = maxLength !== undefined && characterCount > maxLength;

    const describedByIds = [
      hasError ? errorId : null,
      helperText && !hasError ? helperTextId : null,
      showCharacterCount ? charCountId : null,
      ariaDescribedBy,
    ]
      .filter(Boolean)
      .join(' ');

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;

        if (maxLength !== undefined && newValue.length > maxLength) {
          return;
        }

        if (value === undefined) {
          setInternalValue(newValue);
        }

        if (onChange) {
          onChange(event);
        }
      },
      [maxLength, onChange, value]
    );

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
      'resize-none',
      sizeClasses[textareaSize],
      variantClasses[variant],
    ].join(' ');

    const errorClasses = hasError || isOverLimit
      ? 'border-red-500 focus:border-red-600 focus:ring-red-200'
      : '';

    const disabledClasses = disabled
      ? 'opacity-60 cursor-not-allowed bg-stone-100'
      : 'hover:border-earth-400';

    const combinedTextareaClasses = [
      baseClasses,
      errorClasses,
      disabledClasses,
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

    const charCountClasses = [
      'mt-1.5',
      'text-sm',
      'text-right',
      isOverLimit ? 'text-red-600' : 'text-stone-600',
    ]
      .filter(Boolean)
      .join(' ');

    const footerClasses = [
      'flex',
      'justify-between',
      'items-start',
      'gap-2',
    ].join(' ');

    const rowsValue = autoResize
      ? Math.min(
          Math.max(
            minRows,
            currentValue.split('\n').length
          ),
          maxRows || Infinity
        )
      : minRows;

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
        <textarea
          ref={ref}
          id={inputId}
          className={combinedTextareaClasses}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          rows={rowsValue}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={hasError || isOverLimit || ariaInvalid}
          aria-describedby={describedByIds || undefined}
          aria-required={required}
          {...props}
        />
        {(hasError || helperText || showCharacterCount) && (
          <div className={footerClasses}>
            <div className="flex-1">
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
            {showCharacterCount && (
              <div
                id={charCountId}
                className={charCountClasses}
                aria-live="polite"
                aria-atomic="true"
              >
                {characterCount}
                {maxLength !== undefined && ` / ${maxLength}`}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;