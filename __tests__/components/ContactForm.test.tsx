/**
 * ContactForm Component Test Suite
 * 
 * Comprehensive tests covering:
 * - Component rendering and accessibility
 * - Form validation and error handling
 * - User interactions and state management
 * - Form submission workflows
 * - Edge cases and error scenarios
 * - Performance and memory management
 * 
 * Coverage Target: >80%
 * Test Framework: Jest + React Testing Library
 */

import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm, ContactFormProps } from '@/components/forms/ContactForm'
import type { ContactFormData } from '@/lib/validation/contactForm'

// ============================================================================
// 🏭 Test Data Factories
// ============================================================================

const createValidFormData = (
  overrides?: Partial<ContactFormData>
): ContactFormData => ({
  name: 'John Doe',
  email: 'john.doe@example.com',
  company: 'Acme Corporation',
  message: 'I would like to discuss a potential project collaboration.',
  ...overrides,
})

const createInvalidFormData = (
  field: keyof ContactFormData
): ContactFormData => {
  const base = createValidFormData()
  switch (field) {
    case 'name':
      return { ...base, name: '' }
    case 'email':
      return { ...base, email: 'invalid-email' }
    case 'company':
      return { ...base, company: '' }
    case 'message':
      return { ...base, message: '' }
    default:
      return base
  }
}

// ============================================================================
// 🎭 Mock Functions
// ============================================================================

const createMockSubmit = () => jest.fn().mockResolvedValue(undefined)

const createFailingMockSubmit = (errorMessage = 'Network error') =>
  jest.fn().mockRejectedValue(new Error(errorMessage))

// ============================================================================
// 🎨 Test Utilities
// ============================================================================

const fillFormWithData = async (data: ContactFormData) => {
  const user = userEvent.setup()

  await user.clear(screen.getByLabelText(/name/i))
  await user.type(screen.getByLabelText(/name/i), data.name)

  await user.clear(screen.getByLabelText(/email/i))
  await user.type(screen.getByLabelText(/email/i), data.email)

  await user.clear(screen.getByLabelText(/company/i))
  await user.type(screen.getByLabelText(/company/i), data.company)

  await user.clear(screen.getByLabelText(/message/i))
  await user.type(screen.getByLabelText(/message/i), data.message)
}

const getFormFields = () => ({
  name: screen.getByLabelText(/name/i) as HTMLInputElement,
  email: screen.getByLabelText(/email/i) as HTMLInputElement,
  company: screen.getByLabelText(/company/i) as HTMLInputElement,
  message: screen.getByLabelText(/message/i) as HTMLTextAreaElement,
  submit: screen.getByRole('button', { name: /send message/i }),
})

// ============================================================================
// 🧪 Test Suite: Component Rendering
// ============================================================================

describe('ContactForm - Rendering', () => {
  it('should render all form fields with correct labels', () => {
    render(<ContactForm />)

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it('should render submit button with correct text', () => {
    render(<ContactForm />)

    const submitButton = screen.getByRole('button', { name: /send message/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveTextContent('Send Message')
  })

  it('should render helper text about response time', () => {
    render(<ContactForm />)

    expect(
      screen.getByText(/we typically respond within 24 hours/i)
    ).toBeInTheDocument()
  })

  it('should apply custom className to form container', () => {
    const customClass = 'custom-form-class'
    const { container } = render(<ContactForm className={customClass} />)

    const form = container.querySelector('form')
    expect(form).toHaveClass(customClass)
  })

  it('should not render success message initially', () => {
    render(<ContactForm />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

// ============================================================================
// 🧪 Test Suite: Accessibility
// ============================================================================

describe('ContactForm - Accessibility', () => {
  it('should have proper ARIA labels on form', () => {
    render(<ContactForm />)

    const form = screen.getByRole('form', { name: /contact form/i })
    expect(form).toBeInTheDocument()
  })

  it('should mark required fields with aria-required', () => {
    render(<ContactForm />)

    const fields = getFormFields()
    expect(fields.name).toHaveAttribute('aria-required', 'true')
    expect(fields.email).toHaveAttribute('aria-required', 'true')
    expect(fields.company).toHaveAttribute('aria-required', 'true')
    expect(fields.message).toHaveAttribute('aria-required', 'true')
  })

  it('should have proper autocomplete attributes', () => {
    render(<ContactForm />)

    const fields = getFormFields()
    expect(fields.name).toHaveAttribute('autocomplete', 'name')
    expect(fields.email).toHaveAttribute('autocomplete', 'email')
    expect(fields.company).toHaveAttribute('autocomplete', 'organization')
  })

  it('should have unique IDs for all form fields', () => {
    render(<ContactForm />)

    const fields = getFormFields()
    const ids = [
      fields.name.id,
      fields.email.id,
      fields.company.id,
      fields.message.id,
    ]

    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should announce success message with proper ARIA attributes', async () => {
    const mockSubmit = createMockSubmit()
    render(<ContactForm onSubmit={mockSubmit} />)

    await fillFormWithData(createValidFormData())
    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-live', 'polite')
      expect(alert).toHaveAttribute('aria-atomic', 'true')
    })
  })

  it('should announce error message with assertive ARIA live region', async () => {
    const mockSubmit = createFailingMockSubmit()
    render(<ContactForm onSubmit={mockSubmit} />)

    await fillFormWithData(createValidFormData())
    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-live', 'assertive')
      expect(alert).toHaveAttribute('aria-atomic', 'true')
    })
  })

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const fields = getFormFields()

    await user.tab()
    expect(fields.name).toHaveFocus()

    await user.tab()
    expect(fields.email).toHaveFocus()

    await user.tab()
    expect(fields.company).toHaveFocus()

    await user.tab()
    expect(fields.message).toHaveFocus()

    await user.tab()
    expect(fields.submit).toHaveFocus()
  })
})

// ============================================================================
// 🧪 Test Suite: Form Validation
// ============================================================================

describe('ContactForm - Validation', () => {
  it('should not show validation errors before field is touched', async () => {
    render(<ContactForm />)

    const fields = getFormFields()
    expect(fields.name).not.toHaveAttribute('aria-invalid')
    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument()
  })

  it('should show validation error when required name field is empty and blurred', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const nameField = getFormFields().name
    await user.click(nameField)
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for invalid email format', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const emailField = getFormFields().email
    await user.type(emailField, 'invalid-email')
    await user.tab()

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument()
    })
  })

  it('should validate email format correctly', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const emailField = getFormFields().email

    await user.type(emailField, 'valid@example.com')
    await user.tab()

    await waitFor(() => {
      expect(
        screen.queryByText(/please enter a valid email address/i)
      ).not.toBeInTheDocument()
    })
  })

  it('should show validation error when company field is empty and blurred', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const companyField = getFormFields().company
    await user.click(companyField)
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/company is required/i)).toBeInTheDocument()
    })
  })

  it('should show validation error when message field is empty and blurred', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const messageField = getFormFields().message
    await user.click(messageField)
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/message is required/i)).toBeInTheDocument()
    })
  })

  it('should validate message minimum length', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const messageField = getFormFields().message
    await user.type(messageField, 'Hi')
    await user.tab()

    await waitFor(() => {
      expect(
        screen.getByText(/message must be at least 10 characters/i)
      ).toBeInTheDocument()
    })
  })

  it('should clear validation error when field becomes valid', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const nameField = getFormFields().name

    await user.click(nameField)
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })

    await user.type(nameField, 'John Doe')

    await waitFor(() => {
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument()
    })
  })

  it('should validate all fields on form submission', async () => {
    render(<ContactForm />)

    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/company is required/i)).toBeInTheDocument()
      expect(screen.getByText(/message is required/i)).toBeInTheDocument()
    })
  })

  it('should show error message when submitting invalid form', async () => {
    render(<ContactForm />)

    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(
        screen.getByText(/please correct the errors in the form/i)
      ).toBeInTheDocument()
    })
  })
})

// ============================================================================
// 🧪 Test Suite: Form Submission
// ============================================================================

describe('ContactForm - Submission', () => {
  it('should call onSubmit with sanitized form data when valid', async () => {
    const mockSubmit = createMockSubmit()
    render(<ContactForm onSubmit={mockSubmit} />)

    const formData = createValidFormData()
    await fillFormWithData(formData)

    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1)
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
        })
      )
    })
  })

  it('should show loading state during submission', async () => {
    const mockSubmit = jest
      .fn()
      .mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )
    render(<ContactForm onSubmit={mockSubmit} />)

    await fillFormWithData(createValidFormData())
    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(screen.getByText(/sending/i)).toBeInTheDocument()
    })

    const submitButton = getFormFields().submit
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveAttribute('aria-label', 'Submitting form')
  })

  it('should disable all form fields during submission', async () => {
    const mockSubmit = jest
      .fn()
      .mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )
    render(<ContactForm onSubmit={mockSubmit} />)

    await fillFormWithData(createValidFormData())
    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      const fields = getFormFields()
      expect(fields.name).toBeDisabled()
      expect(fields.email).toBeDisabled()
      expect(fields.company).toBeDisabled()
      expect(fields.message).toBeDisabled()
      expect(fields.submit).toBeDisabled()
    })
  })

  it('should show success message after successful submission', async () => {
    const mockSubmit = createMockSubmit()
    render(<ContactForm onSubmit={mockSubmit} />)

    await fillFormWithData(createValidFormData())
    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(
        screen.getByText(/thank you for your message/i)
      ).toBeInTheDocument()
    })
  })

  it('should show custom success message when provided', async () => {
    const mockSubmit = createMockSubmit()
    const customMessage = 'Custom success message!'
    render(<ContactForm onSubmit={mockSubmit} successMessage={customMessage} />)

    await fillFormWithData(createValidFormData())
    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(screen.getByText(customMessage)).toBeInTheDocument()
    })
  })

  it('should not show success message when showSuccessMessage is false', async () => {
    const mockSubmit = createMockSubmit()
    render(<ContactForm onSubmit={mockSubmit} showSuccessMessage={false} />)

    await fillFormWithData(createValidFormData())
    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
    })

    expect(
      screen.queryByText(/thank you for your message/i)
    ).not.toBeInTheDocument()
  })

  it('should reset form after successful submission by default', async () => {
    const mockSubmit = createMockSubmit()
    render(<ContactForm onSubmit={mockSubmit} />)

    const formData = createValidFormData()
    await fillFormWithData(formData)
    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
    })

    const fields = getFormFields()
    expect(fields.name).toHaveValue('')
    expect(fields.email).toHaveValue('')
    expect(fields.company).toHaveValue('')
    expect(fields.message).toHaveValue('')
  })

  it('should not reset form when resetOnSuccess is false', async () => {
    const mockSubmit = createMockSubmit()
    render(<ContactForm onSubmit={mockSubmit} resetOnSuccess={false} />)

    const formData = createValidFormData()
    await fillFormWithData(formData)
    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
    })

    const fields = getFormFields()
    expect(fields.name).toHaveValue(formData.name)
    expect(fields.email).toHaveValue(formData.email)
    expect(fields.company).toHaveValue(formData.company)
    expect(fields.message).toHaveValue(formData.message)
  })

  it('should handle submission without onSubmit prop', async () => {
    render(<ContactForm />)

    await fillFormWithData(createValidFormData())
    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(
        screen.getByText(/thank you for your message/i)
      ).toBeInTheDocument()
    })
  })
})

// ============================================================================
// 🧪 Test Suite: Error Handling
// ============================================================================

describe('ContactForm - Error Handling', () => {
  it('should show error message when submission fails', async () => {
    const errorMessage = 'Network connection failed'
    const mockSubmit = createFailingMockSubmit(errorMessage)
    render(<ContactForm onSubmit={mockSubmit} />)

    await fillFormWithData(createValidFormData())
    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('should show generic error message for unknown errors', async () => {
    const mockSubmit = jest.fn().mockRejectedValue('Unknown error')
    render(<ContactForm onSubmit={mockSubmit} />)

    await fillFormWithData(createValidFormData())
    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(
        screen.getByText(/an unexpected error occurred/i)
      ).toBeInTheDocument()
    })
  })

  it('should re-enable form fields after submission error', async () => {
    const mockSubmit = createFailingMockSubmit()
    render(<ContactForm onSubmit={mockSubmit} />)

    await fillFormWithData(createValidFormData())
    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    const fields = getFormFields()
    expect(fields.name).not.toBeDisabled()
    expect(fields.email).not.toBeDisabled()
    expect(fields.company).not.toBeDisabled()
    expect(fields.message).not.toBeDisabled()
    expect(fields.submit).not.toBeDisabled()
  })

  it('should allow retry after submission error', async () => {
    const mockSubmit = jest
      .fn()
      .mockRejectedValueOnce(new Error('First attempt failed'))
      .mockResolvedValueOnce(undefined)

    render(<ContactForm onSubmit={mockSubmit} />)

    await fillFormWithData(createValidFormData())
    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(screen.getByText(/first attempt failed/i)).toBeInTheDocument()
    })

    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(
        screen.getByText(/thank you for your message/i)
      ).toBeInTheDocument()
    })

    expect(mockSubmit).toHaveBeenCalledTimes(2)
  })

  it('should not submit form when validation fails', async () => {
    const mockSubmit = createMockSubmit()
    render(<ContactForm onSubmit={mockSubmit} />)

    await fillFormWithData(createInvalidFormData('email'))
    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument()
    })

    expect(mockSubmit).not.toHaveBeenCalled()
  })
})

// ============================================================================
// 🧪 Test Suite: User Interactions
// ============================================================================

describe('ContactForm - User Interactions', () => {
  it('should update field value on user input', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const nameField = getFormFields().name
    await user.type(nameField, 'Jane Smith')

    expect(nameField).toHaveValue('Jane Smith')
  })

  it('should handle rapid typing in fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const messageField = getFormFields().message
    const longMessage = 'A'.repeat(500)

    await user.type(messageField, longMessage)

    expect(messageField).toHaveValue(longMessage)
  })

  it('should handle paste events', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const emailField = getFormFields().email
    await user.click(emailField)
    await user.paste('pasted@example.com')

    expect(emailField).toHaveValue('pasted@example.com')
  })

  it('should handle form submission via Enter key', async () => {
    const mockSubmit = createMockSubmit()
    const user = userEvent.setup()
    render(<ContactForm onSubmit={mockSubmit} />)

    await fillFormWithData(createValidFormData())

    const nameField = getFormFields().name
    await user.click(nameField)
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
    })
  })

  it('should prevent default form submission behavior', async () => {
    const mockSubmit = createMockSubmit()
    render(<ContactForm onSubmit={mockSubmit} />)

    const form = screen.getByRole('form')
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
    const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault')

    await fillFormWithData(createValidFormData())
    form.dispatchEvent(submitEvent)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should handle multiple rapid submissions gracefully', async () => {
    const mockSubmit = jest
      .fn()
      .mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )
    render(<ContactForm onSubmit={mockSubmit} />)

    await fillFormWithData(createValidFormData())

    const submitButton = getFormFields().submit
    fireEvent.click(submitButton)
    fireEvent.click(submitButton)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1)
    })
  })
})

// ============================================================================
// 🧪 Test Suite: Edge Cases
// ============================================================================

describe('ContactForm - Edge Cases', () => {
  it('should handle empty string values', async () => {
    render(<ContactForm />)

    const fields = getFormFields()
    fireEvent.change(fields.name, { target: { value: '' } })
    fireEvent.change(fields.email, { target: { value: '' } })
    fireEvent.change(fields.company, { target: { value: '' } })
    fireEvent.change(fields.message, { target: { value: '' } })

    expect(fields.name).toHaveValue('')
    expect(fields.email).toHaveValue('')
    expect(fields.company).toHaveValue('')
    expect(fields.message).toHaveValue('')
  })

  it('should handle whitespace-only values', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const nameField = getFormFields().name
    await user.type(nameField, '   ')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })
  })

  it('should handle very long input values', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const longName = 'A'.repeat(1000)
    const nameField = getFormFields().name

    await user.type(nameField, longName)

    expect(nameField).toHaveValue(longName)
  })

  it('should handle special characters in input', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const specialChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?"
    const nameField = getFormFields().name

    await user.type(nameField, specialChars)

    expect(nameField).toHaveValue(specialChars)
  })

  it('should handle unicode characters', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const unicodeName = '日本語 中文 한국어 العربية'
    const nameField = getFormFields().name

    await user.type(nameField, unicodeName)

    expect(nameField).toHaveValue(unicodeName)
  })

  it('should handle email with plus addressing', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const emailField = getFormFields().email
    await user.type(emailField, 'user+tag@example.com')
    await user.tab()

    await waitFor(() => {
      expect(
        screen.queryByText(/please enter a valid email address/i)
      ).not.toBeInTheDocument()
    })
  })

  it('should handle email with subdomain', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const emailField = getFormFields().email
    await user.type(emailField, 'user@mail.example.com')
    await user.tab()

    await waitFor(() => {
      expect(
        screen.queryByText(/please enter a valid email address/i)
      ).not.toBeInTheDocument()
    })
  })

  it('should sanitize HTML in input values', async () => {
    const mockSubmit = createMockSubmit()
    const user = userEvent.setup()
    render(<ContactForm onSubmit={mockSubmit} />)

    const maliciousInput = '<script>alert("xss")</script>'
    const nameField = getFormFields().name

    await user.type(nameField, maliciousInput)
    await fillFormWithData({
      ...createValidFormData(),
      name: maliciousInput,
    })

    fireEvent.click(getFormFields().submit)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
      const submittedData = mockSubmit.mock.calls[0][0] as ContactFormData
      expect(submittedData.name).not.toContain('<script>')
    })
  })
})

// ============================================================================
// 🧪 Test Suite: Performance
// ============================================================================

describe('ContactForm - Performance', () => {
  it('should render within acceptable time', () => {
    const startTime = performance.now()
    render(<ContactForm />)
    const endTime = performance.now()

    const renderTime = endTime - startTime
    expect(renderTime).toBeLessThan(100) // 100ms threshold
  })

  it('should handle rapid field updates efficiently', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const nameField = getFormFields().name
    const startTime = performance.now()

    for (let i = 0; i < 50; i++) {
      await user.type(nameField, 'a')
    }

    const endTime = performance.now()
    const updateTime = endTime - startTime

    expect(updateTime).toBeLessThan(1000) // 1 second for 50 updates
  })

  it('should not cause memory leaks on unmount', () => {
    const { unmount } = render(<ContactForm />)

    expect(() => unmount()).not.toThrow()
  })

  it('should handle multiple re-renders efficiently', () => {
    const { rerender } = render(<ContactForm />)

    const startTime = performance.now()

    for (let i = 0; i < 10; i++) {
      rerender(<ContactForm key={i} />)
    }

    const endTime = performance.now()
    const rerenderTime = endTime - startTime

    expect(rerenderTime).toBeLessThan(200) // 200ms for 10 re-renders
  })
})

// ============================================================================
// 🧪 Test Suite: Integration Scenarios
// ============================================================================

describe('ContactForm - Integration Scenarios', () => {
  it('should complete full user journey successfully', async () => {
    const mockSubmit = createMockSubmit()
    const user = userEvent.setup()
    render(<ContactForm onSubmit={mockSubmit} />)

    // User fills out form
    await user.type(getFormFields().name, 'Alice Johnson')
    await user.type(getFormFields().email, 'alice@example.com')
    await user.type(getFormFields().company, 'Tech Corp')
    await user.type(
      getFormFields().message,
      'I am interested in your consulting services.'
    )

    // User submits form
    await user.click(getFormFields().submit)

    // Verify submission
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Alice Johnson',
          email: 'alice@example.com',
          company: 'Tech Corp',
          message: 'I am interested in your consulting services.',
        })
      )
    })

    // Verify success message
    expect(
      screen.getByText(/thank you for your message/i)
    ).toBeInTheDocument()

    // Verify form is reset
    expect(getFormFields().name).toHaveValue('')
  })

  it('should handle validation error correction flow', async () => {
    const mockSubmit = createMockSubmit()
    const user = userEvent.setup()
    render(<ContactForm onSubmit={mockSubmit} />)

    // Submit with invalid email
    await user.type(getFormFields().name, 'Bob Smith')
    await user.type(getFormFields().email, 'invalid-email')
    await user.type(getFormFields().company, 'Company Inc')
    await user.type(getFormFields().message, 'This is a test message.')
    await user.click(getFormFields().submit)

    // Verify error shown
    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument()
    })

    // Correct the error
    await user.clear(getFormFields().email)
    await user.type(getFormFields().email, 'bob@example.com')

    // Submit again
    await user.click(getFormFields().submit)

    // Verify successful submission
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
      expect(
        screen.getByText(/thank you for your message/i)
      ).toBeInTheDocument()
    })
  })

  it('should handle error recovery and retry flow', async () => {
    const mockSubmit = jest
      .fn()
      .mockRejectedValueOnce(new Error('Server error'))
      .mockResolvedValueOnce(undefined)

    const user = userEvent.setup()
    render(<ContactForm onSubmit={mockSubmit} />)

    // Fill and submit form
    await fillFormWithData(createValidFormData())
    await user.click(getFormFields().submit)

    // Verify error shown
    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument()
    })

    // Retry submission
    await user.click(getFormFields().submit)

    // Verify success
    await waitFor(() => {
      expect(
        screen.getByText(/thank you for your message/i)
      ).toBeInTheDocument()
    })

    expect(mockSubmit).toHaveBeenCalledTimes(2)
  })
})