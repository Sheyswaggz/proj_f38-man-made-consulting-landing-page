/**
 * Contact Form Validation Schema and Utilities
 *
 * Provides TypeScript interfaces, validation rules, and error messages
 * for contact form fields with comprehensive input validation.
 */

/**
 * Contact form field names as a const object for type safety
 */
export const CONTACT_FORM_FIELDS = {
  NAME: 'name',
  EMAIL: 'email',
  COMPANY: 'company',
  MESSAGE: 'message',
} as const

/**
 * Type representing valid contact form field names
 */
export type ContactFormField =
  (typeof CONTACT_FORM_FIELDS)[keyof typeof CONTACT_FORM_FIELDS]

/**
 * Contact form data structure
 */
export interface ContactFormData {
  name: string
  email: string
  company: string
  message: string
}

/**
 * Validation error structure for a single field
 */
export interface FieldValidationError {
  field: ContactFormField
  message: string
}

/**
 * Validation result type
 */
export type ValidationResult =
  | { isValid: true; errors: [] }
  | { isValid: false; errors: FieldValidationError[] }

/**
 * Field-specific validation rules
 */
export interface FieldValidationRules {
  required: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  customValidator?: (value: string) => boolean
}

/**
 * Validation configuration for all form fields
 */
export const VALIDATION_RULES: Record<ContactFormField, FieldValidationRules> =
  {
    [CONTACT_FORM_FIELDS.NAME]: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s'-]+$/,
    },
    [CONTACT_FORM_FIELDS.EMAIL]: {
      required: true,
      maxLength: 254,
      pattern:
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    },
    [CONTACT_FORM_FIELDS.COMPANY]: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    [CONTACT_FORM_FIELDS.MESSAGE]: {
      required: true,
      minLength: 10,
      maxLength: 2000,
    },
  }

/**
 * Error messages for validation failures
 */
export const VALIDATION_MESSAGES: Record<
  ContactFormField,
  Record<string, string>
> = {
  [CONTACT_FORM_FIELDS.NAME]: {
    required: 'Name is required',
    minLength: 'Name must be at least 2 characters',
    maxLength: 'Name must not exceed 100 characters',
    pattern: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  },
  [CONTACT_FORM_FIELDS.EMAIL]: {
    required: 'Email is required',
    maxLength: 'Email must not exceed 254 characters',
    pattern: 'Please enter a valid email address',
  },
  [CONTACT_FORM_FIELDS.COMPANY]: {
    required: 'Company name is required',
    minLength: 'Company name must be at least 2 characters',
    maxLength: 'Company name must not exceed 100 characters',
  },
  [CONTACT_FORM_FIELDS.MESSAGE]: {
    required: 'Message is required',
    minLength: 'Message must be at least 10 characters',
    maxLength: 'Message must not exceed 2000 characters',
  },
}

/**
 * Validates a single form field value
 *
 * @param field - The field name to validate
 * @param value - The field value to validate
 * @returns Validation error if invalid, undefined if valid
 */
export function validateField(
  field: ContactFormField,
  value: string
): FieldValidationError | undefined {
  const rules = VALIDATION_RULES[field]
  const messages = VALIDATION_MESSAGES[field]
  const trimmedValue = value.trim()

  if (rules.required && !trimmedValue) {
    return {
      field,
      message: messages.required,
    }
  }

  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return {
      field,
      message: messages.minLength,
    }
  }

  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    return {
      field,
      message: messages.maxLength,
    }
  }

  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    return {
      field,
      message: messages.pattern,
    }
  }

  if (rules.customValidator && !rules.customValidator(trimmedValue)) {
    return {
      field,
      message: messages.pattern ?? 'Invalid value',
    }
  }

  return undefined
}

/**
 * Validates all contact form fields
 *
 * @param data - The form data to validate
 * @returns Validation result with errors if any
 */
export function validateContactForm(
  data: ContactFormData
): ValidationResult {
  const errors: FieldValidationError[] = []

  const fields: ContactFormField[] = [
    CONTACT_FORM_FIELDS.NAME,
    CONTACT_FORM_FIELDS.EMAIL,
    CONTACT_FORM_FIELDS.COMPANY,
    CONTACT_FORM_FIELDS.MESSAGE,
  ]

  for (const field of fields) {
    const error = validateField(field, data[field])
    if (error) {
      errors.push(error)
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    }
  }

  return {
    isValid: true,
    errors: [],
  }
}

/**
 * Sanitizes form input by trimming whitespace and removing potentially harmful characters
 *
 * @param value - The value to sanitize
 * @returns Sanitized value
 */
export function sanitizeInput(value: string): string {
  return value
    .trim()
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/\s+/g, ' ')
}

/**
 * Sanitizes all contact form data
 *
 * @param data - The form data to sanitize
 * @returns Sanitized form data
 */
export function sanitizeContactFormData(
  data: ContactFormData
): ContactFormData {
  return {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email),
    company: sanitizeInput(data.company),
    message: sanitizeInput(data.message),
  }
}

/**
 * Type guard to check if data is valid ContactFormData
 *
 * @param data - The data to check
 * @returns True if data is valid ContactFormData
 */
export function isContactFormData(data: unknown): data is ContactFormData {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const formData = data as Record<string, unknown>

  return (
    typeof formData.name === 'string' &&
    typeof formData.email === 'string' &&
    typeof formData.company === 'string' &&
    typeof formData.message === 'string'
  )
}

/**
 * Gets error message for a specific field from validation result
 *
 * @param result - The validation result
 * @param field - The field to get error for
 * @returns Error message if exists, undefined otherwise
 */
export function getFieldError(
  result: ValidationResult,
  field: ContactFormField
): string | undefined {
  if (result.isValid) {
    return undefined
  }

  const error = result.errors.find(err => err.field === field)
  return error?.message
}

/**
 * Checks if a specific field has an error in validation result
 *
 * @param result - The validation result
 * @param field - The field to check
 * @returns True if field has error
 */
export function hasFieldError(
  result: ValidationResult,
  field: ContactFormField
): boolean {
  return getFieldError(result, field) !== undefined
}

/**
 * Creates an empty contact form data object
 *
 * @returns Empty contact form data
 */
export function createEmptyContactForm(): ContactFormData {
  return {
    name: '',
    email: '',
    company: '',
    message: '',
  }
}

/**
 * Validates email format with additional checks
 *
 * @param email - The email to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
  const trimmedEmail = email.trim()

  if (!trimmedEmail || trimmedEmail.length > 254) {
    return false
  }

  const emailPattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  if (!emailPattern.test(trimmedEmail)) {
    return false
  }

  const [localPart, domain] = trimmedEmail.split('@')

  if (!localPart || !domain || localPart.length > 64) {
    return false
  }

  if (domain.startsWith('.') || domain.endsWith('.')) {
    return false
  }

  if (domain.includes('..')) {
    return false
  }

  return true
}