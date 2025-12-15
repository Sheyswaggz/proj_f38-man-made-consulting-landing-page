import React from 'react';

export interface TimelineStep {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  deliverables: readonly string[];
  icon?: string;
}

export interface TimelineProps {
  steps: readonly TimelineStep[];
  className?: string;
  orientation?: 'vertical' | 'horizontal';
  showConnectors?: boolean;
  activeStep?: number;
}

export const Timeline: React.FC<TimelineProps> = ({
  steps,
  className = '',
  orientation = 'vertical',
  showConnectors = true,
  activeStep,
}) => {
  const isVertical = orientation === 'vertical';

  const getStepClasses = (index: number): string => {
    const baseClasses = 'relative flex';
    const orientationClasses = isVertical
      ? 'flex-col md:flex-row gap-6 md:gap-8'
      : 'flex-col items-center gap-4';
    const activeClasses =
      activeStep !== undefined && index === activeStep
        ? 'opacity-100'
        : activeStep !== undefined && index < activeStep
          ? 'opacity-75'
          : activeStep !== undefined
            ? 'opacity-50'
            : 'opacity-100';

    return `${baseClasses} ${orientationClasses} ${activeClasses}`;
  };

  const getConnectorClasses = (isLast: boolean): string => {
    if (!showConnectors || isLast) return 'hidden';

    const baseClasses = 'absolute bg-earth-300';
    const orientationClasses = isVertical
      ? 'left-6 md:left-8 top-20 md:top-12 w-0.5 h-full md:h-0.5 md:w-full md:left-20 md:top-6'
      : 'left-1/2 top-20 w-0.5 h-full -translate-x-1/2';

    return `${baseClasses} ${orientationClasses}`;
  };

  const getIndicatorClasses = (index: number): string => {
    const baseClasses =
      'flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-serif font-semibold text-lg md:text-xl transition-all duration-300';
    const activeClasses =
      activeStep !== undefined && index === activeStep
        ? 'bg-earth-600 text-white shadow-soft-lg scale-110'
        : activeStep !== undefined && index < activeStep
          ? 'bg-earth-500 text-white shadow-soft'
          : 'bg-earth-100 text-earth-700 border-2 border-earth-300';

    return `${baseClasses} ${activeClasses}`;
  };

  const getContentClasses = (): string => {
    const baseClasses = 'flex-1 space-y-3';
    return baseClasses;
  };

  return (
    <div
      className={`timeline ${isVertical ? 'space-y-12 md:space-y-16' : 'flex flex-col md:flex-row gap-8 md:gap-12'} ${className}`}
      role="list"
      aria-label="Process timeline"
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.id}
            className={getStepClasses(index)}
            role="listitem"
            aria-label={`Step ${step.number}: ${step.title}`}
          >
            {/* Step Indicator */}
            <div className="relative flex-shrink-0">
              <div
                className={getIndicatorClasses(index)}
                aria-label={`Step ${step.number}`}
              >
                {step.number}
              </div>

              {/* Connector Line */}
              <div className={getConnectorClasses(isLast)} aria-hidden="true" />
            </div>

            {/* Step Content */}
            <div className={getContentClasses()}>
              {/* Title and Duration */}
              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-serif font-semibold text-earth-900">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-earth-600 font-medium">
                  {step.duration}
                </p>
              </div>

              {/* Description */}
              <p className="text-base md:text-lg text-stone-700 leading-relaxed">
                {step.description}
              </p>

              {/* Deliverables */}
              {step.deliverables.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-earth-800 uppercase tracking-wide">
                    Deliverables
                  </h4>
                  <ul
                    className="space-y-1.5"
                    role="list"
                    aria-label={`Deliverables for ${step.title}`}
                  >
                    {step.deliverables.map((deliverable, deliverableIndex) => (
                      <li
                        key={`${step.id}-deliverable-${deliverableIndex}`}
                        className="flex items-start gap-2 text-sm md:text-base text-stone-700"
                      >
                        <span
                          className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-earth-500 mt-2"
                          aria-hidden="true"
                        />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;