import React from 'react';
import { Section } from '@/components/ui/Section';
import { ContactForm } from '@/components/forms/ContactForm';
import {
  contactContent,
  getContactContent,
  getPrimaryContactMethods,
  ContactMethod,
} from '@/lib/content/contact';

/**
 * Contact section component props
 */
export interface ContactProps {
  /**
   * Additional CSS classes for the section
   */
  className?: string;

  /**
   * Callback function when form is successfully submitted
   */
  onFormSubmit?: (data: {
    name: string;
    email: string;
    company: string;
    message: string;
  }) => Promise<void>;

  /**
   * Whether to show the contact form
   * @default true
   */
  showForm?: boolean;

  /**
   * Whether to show contact methods
   * @default true
   */
  showContactMethods?: boolean;
}

/**
 * Contact Method Icon Component
 */
const ContactMethodIcon: React.FC<{ icon: string; className?: string }> = ({
  icon,
  className = '',
}) => {
  const iconClasses = ['w-6', 'h-6', className].filter(Boolean).join(' ');

  switch (icon) {
    case 'email':
      return (
        <svg
          className={iconClasses}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    case 'phone':
      return (
        <svg
          className={iconClasses}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      );
    case 'linkedin':
      return (
        <svg
          className={iconClasses}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case 'form':
      return (
        <svg
          className={iconClasses}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    default:
      return null;
  }
};

/**
 * Contact Method Card Component
 */
const ContactMethodCard: React.FC<{ method: ContactMethod }> = ({ method }) => {
  const cardClasses = [
    'group',
    'bg-earth-50',
    'border',
    'border-sand-200',
    'rounded-lg',
    'p-6',
    'transition-all',
    'duration-300',
    'hover:shadow-soft-lg',
    'hover:border-earth-300',
    'hover:-translate-y-1',
  ].join(' ');

  const iconContainerClasses = [
    'w-12',
    'h-12',
    'bg-earth-100',
    'rounded-lg',
    'flex',
    'items-center',
    'justify-center',
    'mb-4',
    'text-earth-700',
    'group-hover:bg-earth-200',
    'transition-colors',
    'duration-300',
  ].join(' ');

  return (
    <a
      href={method.href}
      className={cardClasses}
      aria-label={method.ariaLabel}
      target={method.type === 'linkedin' ? '_blank' : undefined}
      rel={method.type === 'linkedin' ? 'noopener noreferrer' : undefined}
    >
      <div className={iconContainerClasses}>
        <ContactMethodIcon icon={method.icon} />
      </div>
      <h3 className="text-lg font-semibold text-earth-900 mb-2">
        {method.label}
      </h3>
      <p className="text-earth-700 font-medium mb-2">{method.value}</p>
      <p className="text-sm text-stone-600">{method.description}</p>
    </a>
  );
};

/**
 * Contact Section Component
 *
 * Comprehensive contact section with multiple contact methods and functional form.
 * Provides clear call-to-action and multiple ways for visitors to get in touch.
 *
 * Features:
 * - Multiple contact methods (email, phone, LinkedIn, form)
 * - Functional contact form with validation
 * - Responsive design for all devices
 * - Accessibility compliant
 * - Clear messaging and CTAs
 *
 * @example
 * ```tsx
 * <Contact
 *   onFormSubmit={async (data) => {
 *     await sendContactEmail(data);
 *   }}
 * />
 * ```
 */
export const Contact: React.FC<ContactProps> = ({
  className = '',
  onFormSubmit,
  showForm = true,
  showContactMethods = true,
}) => {
  const content = getContactContent();
  const primaryMethods = getPrimaryContactMethods();

  const handleFormSubmit = async (formData: {
    name: string;
    email: string;
    company: string;
    message: string;
  }): Promise<void> => {
    if (onFormSubmit) {
      await onFormSubmit(formData);
    } else {
      console.log('Contact form submitted:', formData);
    }
  };

  return (
    <Section
      id="contact"
      variant="earth"
      padding="xl"
      className={className}
      ariaLabel="Contact section"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-earth-900 mb-4">
            {content.heading}
          </h2>
          <p className="text-xl text-stone-600 mb-6">{content.subheading}</p>
          <p className="text-lg text-stone-700 leading-relaxed max-w-3xl mx-auto">
            {content.introduction}
          </p>
        </div>

        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-earth-900 mb-2">
              {content.ctaText}
            </h3>
            <p className="text-stone-600">{content.ctaSubtext}</p>
          </div>

          {showContactMethods && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {contactContent.methods.map((method) => (
                <ContactMethodCard key={method.id} method={method} />
              ))}
            </div>
          )}
        </div>

        {showForm && (
          <div id="contact-form" className="scroll-mt-8">
            <div className="bg-sand-50 border border-sand-200 rounded-xl p-8 sm:p-10 shadow-soft">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-earth-900 mb-2">
                  Send Us a Message
                </h3>
                <p className="text-stone-600">
                  Fill out the form below and we'll get back to you soon
                </p>
              </div>

              <ContactForm
                onSubmit={handleFormSubmit}
                showSuccessMessage={true}
                resetOnSuccess={true}
              />
            </div>
          </div>
        )}

        <div className="mt-12 space-y-6">
          <div className="bg-moss-50 border border-moss-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-moss-700 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-moss-900 mb-1">
                  Your Privacy Matters
                </h4>
                <p className="text-sm text-moss-800">{content.privacyNote}</p>
              </div>
            </div>
          </div>

          <div className="bg-clay-50 border border-clay-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-clay-700 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-clay-900 mb-1">
                  Response Time
                </h4>
                <p className="text-sm text-clay-800">
                  {content.responseTimeNote}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-stone-700 leading-relaxed max-w-3xl mx-auto">
            {content.closingStatement}
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Contact;