import React, { useState, useCallback, useId } from 'react';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import {
  ContactFormData,
  CONTACT_FORM_FIELDS,
  validateContactForm,
  sanitizeContactFormData,
  createEmptyContactForm,
  getFieldError,
  ValidationResult,
} from '@/lib/validation/contactForm';

/**
 * Form submission state types
 */
type SubmissionState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

/**
 * Props for the ContactForm component
 */
export interface ContactFormProps {
  /**
   * Callback function called when form is successfully submitted
   */
  onSubmit?: (data: ContactFormData) => Promise<void>;

  /**
   * Additional CSS classes for the form container
   */
  className?: string;

  /**
   * Whether to show success message after submission
   * @default true
   */
  showSuccessMessage?: boolean;

  /**
   * Custom success message
   * @default "Thank you for your message. We'll get back to you soon!"
   */
  successMessage?: string;

  /**
   * Whether to reset form after successful submission
   * @default true
   */
  resetOnSuccess?: boolean;
}

/**
 * Contact Form Component
 *
 * A fully accessible contact form with comprehensive validation,
 * error handling, and user feedback. Implements client-side validation
 * before submission with clear error messages and success states.
 *
 * Features:
 * - Real-time field validation
 * - Accessible error announcements
 * - Loading states during submission
 * - Success/error feedback
 * - Input sanitization
 * - Keyboard navigation support
 * - Screen reader friendly
 *
 * @example
 * ```tsx
 * <ContactForm
 *   onSubmit={async (data) => {
 *     await sendContactEmail(data);
 *   }}
 * />
 * ```
 */
export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  className = '',
  showSuccessMessage = true,
  successMessage = "Thank you for your message. We'll get back to you soon!",
  resetOnSuccess = true,
}) => {
  const formId = useId();
  const [formData, setFormData] = useState<ContactFormData>(
    createEmptyContactForm()
  );
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
  });
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    status: 'idle',
  });
  const [touchedFields, setTouchedFields] = useState<
    Set<keyof ContactFormData>
  >(new Set());

  /**
   * Handle field value changes
   */
  const handleFieldChange = useCallback(
    (field: keyof ContactFormData) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        setFormData((prev) => ({
          ...prev,
          [field]: newValue,
        }));

        if (touchedFields.has(field)) {
          const updatedData = {
            ...formData,
            [field]: newValue,
          };
          const result = validateContactForm(updatedData);
          setValidationResult(result);
        }
      },
    [formData, touchedFields]
  );

  /**
   * Handle field blur events to mark fields as touched
   */
  const handleFieldBlur = useCallback(
    (field: keyof ContactFormData) => () => {
      setTouchedFields((prev) => new Set(prev).add(field));

      const result = validateContactForm(formData);
      setValidationResult(result);
    },
    [formData]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setTouchedFields(
        new Set([
          CONTACT_FORM_FIELDS.NAME,
          CONTACT_FORM_FIELDS.EMAIL,
          CONTACT_FORM_FIELDS.COMPANY,
          CONTACT_FORM_FIELDS.MESSAGE,
        ])
      );

      const sanitizedData = sanitizeContactFormData(formData);
      const result = validateContactForm(sanitizedData);
      setValidationResult(result);

      if (!result.isValid) {
        setSubmissionState({
          status: 'error',
          message: 'Please correct the errors in the form before submitting.',
        });
        return;
      }

      setSubmissionState({ status: 'submitting' });

      try {
        if (onSubmit) {
          await onSubmit(sanitizedData);
        }

        setSubmissionState({
          status: 'success',
          message: successMessage,
        });

        if (resetOnSuccess) {
          setFormData(createEmptyContactForm());
          setTouchedFields(new Set());
          setValidationResult({ isValid: true, errors: [] });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred. Please try again.';

        setSubmissionState({
          status: 'error',
          message: errorMessage,
        });
      }
    },
    [formData, onSubmit, successMessage, resetOnSuccess]
  );

  /**
   * Get error message for a specific field
   */
  const getFieldErrorMessage = useCallback(
    (field: keyof ContactFormData): string | undefined => {
      if (!touchedFields.has(field)) {
        return undefined;
      }
      return getFieldError(validationResult, field);
    },
    [validationResult, touchedFields]
  );

  const isSubmitting = submissionState.status === 'submitting';
  const isSuccess = submissionState.status === 'success';
  const isError = submissionState.status === 'error';

  const formClasses = [
    'w-full',
    'max-w-2xl',
    'mx-auto',
    'space-y-6',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const statusMessageClasses = [
    'p-4',
    'rounded-lg',
    'text-sm',
    'font-medium',
    'flex',
    'items-start',
    'gap-3',
  ].join(' ');

  const successClasses = [
    statusMessageClasses,
    'bg-green-50',
    'text-green-800',
    'border',
    'border-green-200',
  ].join(' ');

  const errorClasses = [
    statusMessageClasses,
    'bg-red-50',
    'text-red-800',
    'border',
    'border-red-200',
  ].join(' ');

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className={formClasses}
      noValidate
      aria-label="Contact form"
    >
      {isSuccess && showSuccessMessage && (
        <div
          className={successClasses}
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{submissionState.message}</span>
        </div>
      )}

      {isError && (
        <div
          className={errorClasses}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
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
          <span>{submissionState.message}</span>
        </div>
      )}

      <Input
        id={`${formId}-name`}
        name={CONTACT_FORM_FIELDS.NAME}
        label="Name"
        type="text"
        value={formData.name}
        onChange={handleFieldChange(CONTACT_FORM_FIELDS.NAME)}
        onBlur={handleFieldBlur(CONTACT_FORM_FIELDS.NAME)}
        error={getFieldErrorMessage(CONTACT_FORM_FIELDS.NAME)}
        required
        fullWidth
        disabled={isSubmitting}
        autoComplete="name"
        placeholder="Your full name"
        aria-required="true"
      />

      <Input
        id={`${formId}-email`}
        name={CONTACT_FORM_FIELDS.EMAIL}
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleFieldChange(CONTACT_FORM_FIELDS.EMAIL)}
        onBlur={handleFieldBlur(CONTACT_FORM_FIELDS.EMAIL)}
        error={getFieldErrorMessage(CONTACT_FORM_FIELDS.EMAIL)}
        required
        fullWidth
        disabled={isSubmitting}
        autoComplete="email"
        placeholder="your.email@example.com"
        aria-required="true"
      />

      <Input
        id={`${formId}-company`}
        name={CONTACT_FORM_FIELDS.COMPANY}
        label="Company"
        type="text"
        value={formData.company}
        onChange={handleFieldChange(CONTACT_FORM_FIELDS.COMPANY)}
        onBlur={handleFieldBlur(CONTACT_FORM_FIELDS.COMPANY)}
        error={getFieldErrorMessage(CONTACT_FORM_FIELDS.COMPANY)}
        required
        fullWidth
        disabled={isSubmitting}
        autoComplete="organization"
        placeholder="Your company name"
        aria-required="true"
      />

      <TextArea
        id={`${formId}-message`}
        name={CONTACT_FORM_FIELDS.MESSAGE}
        label="Message"
        value={formData.message}
        onChange={handleFieldChange(CONTACT_FORM_FIELDS.MESSAGE)}
        onBlur={handleFieldBlur(CONTACT_FORM_FIELDS.MESSAGE)}
        error={getFieldErrorMessage(CONTACT_FORM_FIELDS.MESSAGE)}
        required
        fullWidth
        disabled={isSubmitting}
        placeholder="Tell us about your project or inquiry..."
        minRows={5}
        maxRows={10}
        maxLength={2000}
        showCharacterCount
        aria-required="true"
      />

      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting}
          aria-label={isSubmitting ? 'Submitting form' : 'Submit contact form'}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </div>

      <p className="text-sm text-stone-600 text-center">
        We typically respond within 24 hours during business days.
      </p>
    </form>
  );
};

export default ContactForm;