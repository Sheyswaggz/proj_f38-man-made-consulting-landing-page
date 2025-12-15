/**
 * Contact Section Content
 *
 * Defines contact methods, CTA messaging, and section content for the contact/lead capture section.
 * Provides conversational, human-centered messaging that encourages engagement without pressure.
 */

export interface ContactMethod {
  readonly id: string
  readonly type: 'email' | 'phone' | 'form' | 'linkedin'
  readonly label: string
  readonly value: string
  readonly href: string
  readonly icon: string
  readonly description: string
  readonly primary: boolean
  readonly ariaLabel: string
}

export interface ContactFormField {
  readonly id: string
  readonly name: string
  readonly label: string
  readonly type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  readonly placeholder: string
  readonly required: boolean
  readonly validation?: {
    readonly pattern?: string
    readonly minLength?: number
    readonly maxLength?: number
    readonly message?: string
  }
  readonly options?: readonly string[]
  readonly ariaDescribedBy?: string
}

export interface ContactContent {
  readonly heading: string
  readonly subheading: string
  readonly introduction: string
  readonly ctaText: string
  readonly ctaSubtext: string
  readonly methods: readonly ContactMethod[]
  readonly formFields: readonly ContactFormField[]
  readonly formSubmitText: string
  readonly formSuccessMessage: string
  readonly formErrorMessage: string
  readonly privacyNote: string
  readonly responseTimeNote: string
  readonly closingStatement: string
}

export const contactContent: ContactContent = {
  heading: "Let's Talk About Your Challenges",
  subheading: 'No sales pitch, no pressure—just an honest conversation',
  introduction:
    "We're not here to sell you something you don't need. We want to understand your situation, share our perspective, and see if there's a genuine fit. If we can help, great. If not, we'll tell you honestly and might even point you toward someone who can.",
  ctaText: 'Ready to explore what's possible?',
  ctaSubtext:
    'Reach out through whichever method feels most comfortable. We typically respond within 24 hours.',
  methods: [
    {
      id: 'method-email',
      type: 'email',
      label: 'Email',
      value: 'hello@manmadeconsulting.com',
      href: 'mailto:hello@manmadeconsulting.com',
      icon: 'email',
      description: 'Send us a detailed message about your needs',
      primary: true,
      ariaLabel: 'Send email to Man Made Consulting',
    },
    {
      id: 'method-phone',
      type: 'phone',
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      icon: 'phone',
      description: 'Schedule a call to discuss your project',
      primary: false,
      ariaLabel: 'Call Man Made Consulting',
    },
    {
      id: 'method-linkedin',
      type: 'linkedin',
      label: 'LinkedIn',
      value: 'Man Made Consulting',
      href: 'https://linkedin.com/company/manmadeconsulting',
      icon: 'linkedin',
      description: 'Connect with us professionally',
      primary: false,
      ariaLabel: 'Visit Man Made Consulting LinkedIn profile',
    },
    {
      id: 'method-form',
      type: 'form',
      label: 'Contact Form',
      value: 'Fill out the form below',
      href: '#contact-form',
      icon: 'form',
      description: 'Quick and easy way to get in touch',
      primary: true,
      ariaLabel: 'Use contact form to reach Man Made Consulting',
    },
  ],
  formFields: [
    {
      id: 'field-name',
      name: 'name',
      label: 'Your Name',
      type: 'text',
      placeholder: 'Jane Smith',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100,
        message: 'Please enter your full name',
      },
      ariaDescribedBy: 'name-help',
    },
    {
      id: 'field-email',
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'jane@company.com',
      required: true,
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        message: 'Please enter a valid email address',
      },
      ariaDescribedBy: 'email-help',
    },
    {
      id: 'field-company',
      name: 'company',
      label: 'Company',
      type: 'text',
      placeholder: 'Your Company Name',
      required: false,
      validation: {
        maxLength: 100,
      },
      ariaDescribedBy: 'company-help',
    },
    {
      id: 'field-phone',
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+1 (555) 123-4567',
      required: false,
      validation: {
        pattern: '^[+]?[(]?[0-9]{1,4}[)]?[-\\s.]?[(]?[0-9]{1,4}[)]?[-\\s.]?[0-9]{1,9}$',
        message: 'Please enter a valid phone number',
      },
      ariaDescribedBy: 'phone-help',
    },
    {
      id: 'field-message',
      name: 'message',
      label: 'Tell Us About Your Challenge',
      type: 'textarea',
      placeholder:
        "What's the problem you're trying to solve? What have you tried so far? What does success look like for you?",
      required: true,
      validation: {
        minLength: 20,
        maxLength: 2000,
        message: 'Please provide at least 20 characters describing your needs',
      },
      ariaDescribedBy: 'message-help',
    },
  ],
  formSubmitText: 'Start the Conversation',
  formSuccessMessage:
    "Thanks for reaching out! We've received your message and will respond within 24 hours. We're looking forward to learning more about your challenges.",
  formErrorMessage:
    "Something went wrong submitting your message. Please try again or reach out directly via email at hello@manmadeconsulting.com. We're here to help.",
  privacyNote:
    "We respect your privacy. Your information will only be used to respond to your inquiry and won't be shared with third parties. No spam, no unwanted follow-ups.",
  responseTimeNote:
    'We typically respond within 24 hours during business days. If your inquiry is urgent, feel free to call us directly.',
  closingStatement:
    "Whether you're just exploring options or ready to move forward, we're here to have an honest conversation about what's possible. No pressure, no hard sell—just straightforward guidance from people who care about doing good work.",
} as const

/**
 * Validates contact content structure
 */
function isValidContactMethod(value: unknown): value is ContactMethod {
  if (typeof value !== 'object' || value === null) return false
  const method = value as Record<string, unknown>
  return (
    typeof method.id === 'string' &&
    typeof method.type === 'string' &&
    ['email', 'phone', 'form', 'linkedin'].includes(method.type) &&
    typeof method.label === 'string' &&
    typeof method.value === 'string' &&
    typeof method.href === 'string' &&
    typeof method.icon === 'string' &&
    typeof method.description === 'string' &&
    typeof method.primary === 'boolean' &&
    typeof method.ariaLabel === 'string'
  )
}

function isValidContactFormField(value: unknown): value is ContactFormField {
  if (typeof value !== 'object' || value === null) return false
  const field = value as Record<string, unknown>
  return (
    typeof field.id === 'string' &&
    typeof field.name === 'string' &&
    typeof field.label === 'string' &&
    typeof field.type === 'string' &&
    ['text', 'email', 'tel', 'textarea', 'select'].includes(field.type) &&
    typeof field.placeholder === 'string' &&
    typeof field.required === 'boolean'
  )
}

function isValidContactContent(value: unknown): value is ContactContent {
  if (typeof value !== 'object' || value === null) return false
  const content = value as Record<string, unknown>
  return (
    typeof content.heading === 'string' &&
    typeof content.subheading === 'string' &&
    typeof content.introduction === 'string' &&
    typeof content.ctaText === 'string' &&
    typeof content.ctaSubtext === 'string' &&
    Array.isArray(content.methods) &&
    content.methods.every(isValidContactMethod) &&
    Array.isArray(content.formFields) &&
    content.formFields.every(isValidContactFormField) &&
    typeof content.formSubmitText === 'string' &&
    typeof content.formSuccessMessage === 'string' &&
    typeof content.formErrorMessage === 'string' &&
    typeof content.privacyNote === 'string' &&
    typeof content.responseTimeNote === 'string' &&
    typeof content.closingStatement === 'string'
  )
}

/**
 * Retrieves validated contact content
 */
export function getContactContent(): ContactContent {
  if (!isValidContactContent(contactContent)) {
    throw new Error('Invalid contact content structure')
  }
  return contactContent
}

/**
 * Retrieves a specific contact method by ID
 */
export function getContactMethodById(id: string): ContactMethod | undefined {
  return contactContent.methods.find(method => method.id === id)
}

/**
 * Retrieves primary contact methods
 */
export function getPrimaryContactMethods(): readonly ContactMethod[] {
  return contactContent.methods.filter(method => method.primary)
}

/**
 * Retrieves contact methods by type
 */
export function getContactMethodsByType(
  type: ContactMethod['type']
): readonly ContactMethod[] {
  return contactContent.methods.filter(method => method.type === type)
}

/**
 * Retrieves a specific form field by name
 */
export function getFormFieldByName(name: string): ContactFormField | undefined {
  return contactContent.formFields.find(field => field.name === name)
}

/**
 * Retrieves required form fields
 */
export function getRequiredFormFields(): readonly ContactFormField[] {
  return contactContent.formFields.filter(field => field.required)
}

/**
 * Retrieves all contact method IDs
 */
export function getContactMethodIds(): readonly string[] {
  return contactContent.methods.map(method => method.id)
}

/**
 * Retrieves all form field names
 */
export function getFormFieldNames(): readonly string[] {
  return contactContent.formFields.map(field => field.name)
}

/**
 * Retrieves contact methods in display order
 */
export function getContactMethodsInOrder(): readonly ContactMethod[] {
  return [...contactContent.methods].sort((a, b) => {
    if (a.primary && !b.primary) return -1
    if (!a.primary && b.primary) return 1
    return 0
  })
}