'use client';

import React, { useCallback, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Carousel } from '@/components/ui/Carousel';
import { Testimonial } from '@/components/ui/Testimonial';
import { Card } from '@/components/ui/Card';
import {
  getSocialProofContent,
  type Testimonial as TestimonialType,
  type CaseStudy,
  type CredibilityIndicator,
} from '@/lib/content/testimonials';

export interface SocialProofProps {
  readonly className?: string;
}

interface CredibilityIconProps {
  readonly icon: string;
  readonly className?: string;
}

const CredibilityIcon: React.FC<CredibilityIconProps> = ({
  icon,
  className = '',
}) => {
  const iconClasses = ['w-8 h-8 text-earth-600', className]
    .filter(Boolean)
    .join(' ');

  switch (icon) {
    case 'experience':
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case 'satisfaction':
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case 'recognition':
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
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      );
    case 'partnership':
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      );
    case 'projects':
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
    case 'security':
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      );
    default:
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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      );
  }
};

interface CaseStudyCardProps {
  readonly caseStudy: CaseStudy;
  readonly className?: string;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  caseStudy,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  return (
    <Card className={className}>
      <div className="space-y-6">
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          <img
            src={caseStudy.imageUrl}
            alt={caseStudy.imageAlt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div>
          <div className="text-sm text-earth-600 font-medium mb-2">
            {caseStudy.client} • {caseStudy.industry}
          </div>
          <h3 className="text-xl font-bold text-earth-900 mb-4">
            {caseStudy.title}
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {caseStudy.results.map((result) => (
            <div key={result.id} className="text-center">
              <div className="text-2xl font-bold text-earth-900 mb-1">
                {result.metric}
              </div>
              <div className="text-sm text-stone-600">{result.value}</div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className="w-full text-left text-earth-700 hover:text-earth-900 font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-500 focus-visible:ring-offset-2 rounded"
          aria-expanded={isExpanded}
          aria-controls={`case-study-${caseStudy.id}-details`}
        >
          <span className="flex items-center justify-between">
            <span>{isExpanded ? 'Show less' : 'Read full case study'}</span>
            <svg
              className={[
                'w-5 h-5 transition-transform duration-200',
                isExpanded ? 'rotate-180' : '',
              ].join(' ')}
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
          </span>
        </button>

        <div
          id={`case-study-${caseStudy.id}-details`}
          className={[
            'overflow-hidden transition-all duration-300',
            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
          ].join(' ')}
          aria-hidden={!isExpanded}
        >
          <div className="space-y-4 pt-4 border-t border-sand-200">
            <div>
              <h4 className="font-semibold text-earth-900 mb-2">Challenge</h4>
              <p className="text-stone-700 leading-relaxed">
                {caseStudy.challenge}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-earth-900 mb-2">Solution</h4>
              <p className="text-stone-700 leading-relaxed">
                {caseStudy.solution}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-earth-900 mb-2">Results</h4>
              <ul className="space-y-2">
                {caseStudy.results.map((result) => (
                  <li key={result.id} className="text-stone-700">
                    <span className="font-semibold text-earth-900">
                      {result.metric}
                    </span>
                    : {result.description}
                  </li>
                ))}
              </ul>
            </div>

            {caseStudy.testimonial && (
              <div className="bg-earth-100 border-l-4 border-earth-600 p-4 rounded">
                <p className="text-stone-800 italic">
                  "{caseStudy.testimonial}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

interface CredibilityIndicatorCardProps {
  readonly indicator: CredibilityIndicator;
  readonly className?: string;
}

const CredibilityIndicatorCard: React.FC<CredibilityIndicatorCardProps> = ({
  indicator,
  className = '',
}) => {
  return (
    <div
      className={[
        'bg-earth-50 border border-sand-200 rounded-lg p-6 text-center transition-all duration-300 hover:shadow-soft-lg hover:border-earth-300',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex justify-center mb-4">
        {indicator.icon && <CredibilityIcon icon={indicator.icon} />}
      </div>
      <h3 className="text-xl font-bold text-earth-900 mb-2">
        {indicator.title}
      </h3>
      <p className="text-stone-700 text-sm leading-relaxed">
        {indicator.description}
      </p>
    </div>
  );
};

export const SocialProof: React.FC<SocialProofProps> = ({
  className = '',
}) => {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const handleTestimonialChange = useCallback((index: number) => {
    setCurrentTestimonialIndex(index);
  }, []);

  let content;
  let testimonials: readonly TestimonialType[];
  let caseStudies: readonly CaseStudy[];
  let credibilityIndicators: readonly CredibilityIndicator[];

  try {
    content = getSocialProofContent();
    testimonials = content.testimonials;
    caseStudies = content.caseStudies;
    credibilityIndicators = content.credibilityIndicators;
  } catch (error) {
    console.error('Failed to load social proof content:', error);
    return (
      <Section
        id="social-proof"
        className={className}
        ariaLabel="Social proof and testimonials"
      >
        <div className="text-center text-stone-600">
          <p>Unable to load testimonials at this time.</p>
        </div>
      </Section>
    );
  }

  return (
    <Section
      id="social-proof"
      className={className}
      variant="default"
      padding="default"
      ariaLabel="Social proof and testimonials"
    >
      <div className="space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-earth-900 mb-4">
            {content.heading}
          </h2>
          <p className="text-xl text-stone-700 leading-relaxed">
            {content.subheading}
          </p>
        </div>

        <div>
          <Carousel
            autoPlay={true}
            autoPlayInterval={8000}
            showControls={true}
            showIndicators={true}
            ariaLabel="Client testimonials"
            onSlideChange={handleTestimonialChange}
            className="max-w-4xl mx-auto"
          >
            {testimonials.map((testimonial) => (
              <Testimonial
                key={testimonial.id}
                quote={testimonial.content}
                author={testimonial.name}
                role={testimonial.role}
                company={testimonial.company}
                imageUrl={testimonial.imageUrl}
                imageAlt={testimonial.imageAlt}
              />
            ))}
          </Carousel>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-earth-900 text-center mb-8">
            Case Studies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-earth-900 text-center mb-8">
            Why Trust Us
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credibilityIndicators.map((indicator) => (
              <CredibilityIndicatorCard
                key={indicator.id}
                indicator={indicator}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default SocialProof;