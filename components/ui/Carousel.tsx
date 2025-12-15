'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  onSlideChange?: (index: number) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  className = '',
  autoPlay = false,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  ariaLabel = 'Carousel',
  ariaLabelledBy,
  onSlideChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const totalSlides = children.length;

  const clearAutoPlayTimer = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  const startAutoPlayTimer = useCallback(() => {
    if (!autoPlay || isPaused || totalSlides <= 1) {
      return;
    }

    clearAutoPlayTimer();

    autoPlayTimerRef.current = setTimeout(() => {
      goToNext();
    }, autoPlayInterval);
  }, [autoPlay, isPaused, totalSlides, autoPlayInterval]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) {
        return;
      }

      const validIndex = Math.max(0, Math.min(index, totalSlides - 1));

      setIsTransitioning(true);
      setCurrentIndex(validIndex);

      if (onSlideChange) {
        try {
          onSlideChange(validIndex);
        } catch (error) {
          console.error('Error in carousel onSlideChange callback:', error);
        }
      }

      setTimeout(() => {
        setIsTransitioning(false);
        slideRefs.current[validIndex]?.focus();
      }, 300);

      clearAutoPlayTimer();
      startAutoPlayTimer();
    },
    [
      currentIndex,
      isTransitioning,
      totalSlides,
      onSlideChange,
      clearAutoPlayTimer,
      startAutoPlayTimer,
    ]
  );

  const goToNext = useCallback(() => {
    const nextIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
    goToSlide(nextIndex);
  }, [currentIndex, totalSlides, goToSlide]);

  const goToPrevious = useCallback(() => {
    const prevIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
    goToSlide(prevIndex);
  }, [currentIndex, totalSlides, goToSlide]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isTransitioning) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case 'Home':
          event.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          event.preventDefault();
          goToSlide(totalSlides - 1);
          break;
        default:
          break;
      }
    },
    [isTransitioning, goToPrevious, goToNext, goToSlide, totalSlides]
  );

  const handleMouseEnter = useCallback(() => {
    if (autoPlay) {
      setIsPaused(true);
      clearAutoPlayTimer();
    }
  }, [autoPlay, clearAutoPlayTimer]);

  const handleMouseLeave = useCallback(() => {
    if (autoPlay) {
      setIsPaused(false);
      startAutoPlayTimer();
    }
  }, [autoPlay, startAutoPlayTimer]);

  useEffect(() => {
    startAutoPlayTimer();

    return () => {
      clearAutoPlayTimer();
    };
  }, [startAutoPlayTimer, clearAutoPlayTimer]);

  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, totalSlides);
  }, [totalSlides]);

  if (totalSlides === 0) {
    return null;
  }

  const baseClasses = [
    'relative',
    'w-full',
    'overflow-hidden',
    'focus:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-earth-500',
    'focus-visible:ring-offset-2',
    'rounded-lg',
  ].join(' ');

  const combinedClasses = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <div
      ref={carouselRef}
      className={combinedClasses}
      role="region"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-roledescription="carousel"
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
    >
      <div className="relative">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {children.map((child, index) => (
            <div
              key={index}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              className="w-full flex-shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${totalSlides}`}
              aria-hidden={index !== currentIndex}
              tabIndex={index === currentIndex ? 0 : -1}
            >
              {child}
            </div>
          ))}
        </div>

        {showControls && totalSlides > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              disabled={isTransitioning}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-earth-50/90 hover:bg-earth-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-3 shadow-soft transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-500 focus-visible:ring-offset-2"
              aria-label="Previous slide"
            >
              <svg
                className="w-6 h-6 text-earth-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={goToNext}
              disabled={isTransitioning}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-earth-50/90 hover:bg-earth-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-3 shadow-soft transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-500 focus-visible:ring-offset-2"
              aria-label="Next slide"
            >
              <svg
                className="w-6 h-6 text-earth-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {showIndicators && totalSlides > 1 && (
        <div
          className="flex justify-center gap-2 mt-6"
          role="tablist"
          aria-label="Carousel slides"
        >
          {children.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={[
                'w-3 h-3 rounded-full transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-500 focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed',
                index === currentIndex
                  ? 'bg-earth-600 w-8'
                  : 'bg-earth-300 hover:bg-earth-400',
              ].join(' ')}
              role="tab"
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentIndex}
              aria-controls={`slide-${index}`}
              tabIndex={index === currentIndex ? 0 : -1}
            />
          ))}
        </div>
      )}

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {totalSlides}
      </div>
    </div>
  );
};

export default Carousel;