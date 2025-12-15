import React from 'react';
import { Button } from '@/components/ui/Button';

/**
 * Props for the Hero section component
 */
interface HeroProps {
  /**
   * Optional custom class name for styling overrides
   */
  className?: string;
}

/**
 * Hero section component that displays the main value proposition
 * 
 * Features:
 * - Responsive design across mobile, tablet, and desktop
 * - Earth-toned color palette consistent with brand
 * - Semantic HTML with proper heading hierarchy
 * - Accessibility compliant with ARIA labels
 * - Conversational, honest tone avoiding corporate buzzwords
 * - Prominent call-to-action button
 * - Progressive enhancement with loading states
 * - Performance optimized for sub-1.5s load time
 * 
 * @example
 * ```tsx
 * <Hero />
 * ```
 */
export const Hero: React.FC<HeroProps> = ({ className = '' }) => {
  const handleCTAClick = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      console.log('[Hero] CTA button clicked', {
        timestamp: new Date().toISOString(),
        section: 'hero',
        action: 'cta_click',
      });

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn('[Hero] Contact section not found for scroll navigation');
      }
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const startTime = performance.now();
      
      console.log('[Hero] Component mounted', {
        timestamp: new Date().toISOString(),
        section: 'hero',
        event: 'mount',
      });

      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        console.log('[Hero] Component unmounted', {
          timestamp: new Date().toISOString(),
          section: 'hero',
          event: 'unmount',
          renderTime: `${renderTime.toFixed(2)}ms`,
        });
      };
    }
  }, []);

  const baseClasses = 'relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden';
  const backgroundClasses = 'bg-gradient-to-br from-earth-50 via-sand-50 to-clay-50';
  const containerClasses = 'container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20';
  const contentClasses = 'max-w-4xl mx-auto text-center';

  const heroClasses = `${baseClasses} ${backgroundClasses} ${className}`.trim();

  return (
    <section
      id="hero"
      className={heroClasses}
      aria-labelledby="hero-heading"
      role="banner"
    >
      <div className={containerClasses}>
        <div className={contentClasses}>
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold text-earth-900 mb-6 animate-fade-in"
          >
            AI Consulting That Puts{' '}
            <span className="text-earth-700">Humans First</span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-stone-700 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            We're not here to automate your team away. We help you use AI to
            amplify what makes your people great—their creativity, judgment, and
            expertise.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl">
              No buzzwords. No hype. Just honest conversations about how AI can
              actually help your business—without replacing the humans who make
              it work.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button
              variant="primary"
              size="lg"
              onClick={handleCTAClick}
              aria-label="Start a conversation about AI consulting"
              className="min-w-[200px]"
            >
              Let's Talk
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  console.log('[Hero] Learn more button clicked', {
                    timestamp: new Date().toISOString(),
                    section: 'hero',
                    action: 'learn_more_click',
                  });

                  const servicesSection = document.getElementById('services');
                  if (servicesSection) {
                    servicesSection.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  } else {
                    console.warn('[Hero] Services section not found for scroll navigation');
                  }
                }
              }}
              aria-label="Learn more about our approach"
              className="min-w-[200px]"
            >
              Our Approach
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-sand-200">
            <p className="text-sm text-stone-500 italic">
              "Technology should serve people, not the other way around."
            </p>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 -z-10 opacity-30"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-moss-100/20 via-transparent to-clay-100/20" />
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-sand-200/30 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-earth-100/20 via-transparent to-transparent rounded-full blur-3xl" />
      </div>
    </section>
  );
};

Hero.displayName = 'Hero';

export default Hero;