import React from 'react';
import { Section } from '@/components/ui/Section';
import { Timeline, TimelineStep } from '@/components/ui/Timeline';
import { ExpandableCard } from '@/components/ui/ExpandableCard';
import { getProcessContent } from '@/lib/content/process';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';

export interface ProcessProps {
  className?: string;
}

const ProcessSection: React.FC<ProcessProps> = ({ className = '' }) => {
  const content = getProcessContent();
  const { ref: sectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  const timelineSteps: readonly TimelineStep[] = content.steps.map((step) => ({
    id: step.id,
    number: step.number,
    title: step.title,
    description: step.description,
    duration: step.estimatedDuration,
    deliverables: step.deliverables.map((d) => d.title),
  }));

  return (
    <Section
      id="process"
      className={className}
      variant="default"
      padding="large"
      maxWidth="7xl"
      ariaLabel="Consulting process overview"
    >
      <div ref={sectionRef} className="space-y-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-earth-900">
            {content.heading}
          </h2>
          <p className="text-xl md:text-2xl text-earth-700 font-medium">
            {content.subheading}
          </p>
          <p className="text-lg text-stone-700 leading-relaxed">
            {content.introduction}
          </p>
        </div>

        {/* Timeline Visualization */}
        <div
          className={`transition-all duration-700 ${
            isIntersecting
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <Timeline
            steps={timelineSteps}
            orientation="vertical"
            showConnectors={true}
            className="mb-16"
          />
        </div>

        {/* Expandable Step Details */}
        <div className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-serif font-semibold text-earth-900 text-center mb-8">
            Detailed Process Breakdown
          </h3>
          <div className="space-y-4">
            {content.steps.map((step, index) => (
              <ExpandableCard
                key={step.id}
                id={step.id}
                title={`${step.number}. ${step.title}`}
                summary={`${step.timeline} • ${step.description.slice(0, 120)}...`}
                ariaLabel={`Expand details for ${step.title}`}
                className={`transition-all duration-500 delay-${index * 100}`}
              >
                <div className="space-y-6">
                  {/* Full Description */}
                  <div>
                    <h4 className="text-lg font-semibold text-earth-800 mb-2">
                      Overview
                    </h4>
                    <p className="text-stone-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Timeline and Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-sand-50 p-4 rounded-lg border border-sand-200">
                      <h5 className="text-sm font-semibold text-earth-800 uppercase tracking-wide mb-1">
                        Timeline
                      </h5>
                      <p className="text-base text-stone-700">{step.timeline}</p>
                    </div>
                    <div className="bg-sand-50 p-4 rounded-lg border border-sand-200">
                      <h5 className="text-sm font-semibold text-earth-800 uppercase tracking-wide mb-1">
                        Duration
                      </h5>
                      <p className="text-base text-stone-700">
                        {step.estimatedDuration}
                      </p>
                    </div>
                  </div>

                  {/* Key Activities */}
                  <div>
                    <h4 className="text-lg font-semibold text-earth-800 mb-3">
                      Key Activities
                    </h4>
                    <ul className="space-y-2" role="list">
                      {step.keyActivities.map((activity, activityIndex) => (
                        <li
                          key={`${step.id}-activity-${activityIndex}`}
                          className="flex items-start gap-3"
                        >
                          <span
                            className="flex-shrink-0 w-2 h-2 rounded-full bg-earth-500 mt-2"
                            aria-hidden="true"
                          />
                          <span className="text-stone-700">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <h4 className="text-lg font-semibold text-earth-800 mb-3">
                      Deliverables
                    </h4>
                    <div className="space-y-3">
                      {step.deliverables.map((deliverable) => (
                        <div
                          key={deliverable.id}
                          className="bg-earth-50 p-4 rounded-lg border border-earth-200"
                        >
                          <h5 className="font-semibold text-earth-900 mb-1">
                            {deliverable.title}
                          </h5>
                          <p className="text-sm text-stone-700">
                            {deliverable.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transparency Note */}
                  <div className="bg-sand-100 p-4 rounded-lg border-l-4 border-earth-500">
                    <h4 className="text-sm font-semibold text-earth-800 uppercase tracking-wide mb-2">
                      Transparency Commitment
                    </h4>
                    <p className="text-stone-700 leading-relaxed">
                      {step.transparencyNote}
                    </p>
                  </div>
                </div>
              </ExpandableCard>
            ))}
          </div>
        </div>

        {/* Transparency Principles */}
        <div className="bg-earth-50 p-8 md:p-12 rounded-xl border border-earth-200">
          <h3 className="text-2xl md:text-3xl font-serif font-semibold text-earth-900 mb-6 text-center">
            Our Transparency Principles
          </h3>
          <ul className="space-y-4 max-w-4xl mx-auto" role="list">
            {content.transparencyPrinciples.map((principle, index) => (
              <li
                key={`principle-${index}`}
                className="flex items-start gap-4"
              >
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-earth-500 text-white flex items-center justify-center font-semibold text-sm"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <p className="text-stone-700 leading-relaxed pt-1">
                  {principle}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Collaboration Approach */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h3 className="text-2xl md:text-3xl font-serif font-semibold text-earth-900 text-center">
            Collaborative Partnership
          </h3>
          <p className="text-lg text-stone-700 leading-relaxed text-center">
            {content.collaborationApproach}
          </p>
        </div>

        {/* Closing Statement */}
        <div className="bg-sand-50 p-8 md:p-12 rounded-xl border border-sand-200 max-w-4xl mx-auto">
          <p className="text-lg text-stone-700 leading-relaxed text-center italic">
            {content.closingStatement}
          </p>
        </div>
      </div>
    </Section>
  );
};

export default ProcessSection;