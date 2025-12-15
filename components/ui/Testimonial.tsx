import React from 'react';

export interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  imageUrl: string;
  imageAlt?: string;
  className?: string;
}

export const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  author,
  role,
  company,
  imageUrl,
  imageAlt,
  className = '',
}) => {
  const defaultImageAlt = `${author}, ${role} at ${company}`;
  const finalImageAlt = imageAlt || defaultImageAlt;

  const baseClasses = [
    'bg-earth-50',
    'border',
    'border-sand-200',
    'rounded-lg',
    'p-6',
    'md:p-8',
    'shadow-soft',
    'transition-all',
    'duration-300',
    'hover:shadow-soft-lg',
    'hover:border-earth-300',
    'flex',
    'flex-col',
    'gap-6',
  ].join(' ');

  const combinedClasses = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <figure className={combinedClasses}>
      <blockquote className="flex-1">
        <svg
          className="w-8 h-8 text-earth-400 mb-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-stone-800 text-lg leading-relaxed">{quote}</p>
      </blockquote>

      <figcaption className="flex items-center gap-4 pt-4 border-t border-sand-200">
        <div className="relative w-12 h-12 flex-shrink-0">
          <img
            src={imageUrl}
            alt={finalImageAlt}
            className="w-full h-full rounded-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <cite className="not-italic">
            <div className="font-semibold text-earth-900 truncate">
              {author}
            </div>
            <div className="text-sm text-stone-600 truncate">
              {role} at {company}
            </div>
          </cite>
        </div>
      </figcaption>
    </figure>
  );
};

export default Testimonial;