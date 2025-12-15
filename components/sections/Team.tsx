'use client';

import React, { useEffect, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { TeamMember, TeamMemberProps } from '@/components/ui/TeamMember';
import { getTeamContent, TeamContent } from '@/lib/content/team';

export interface TeamProps {
  className?: string;
}

export const Team: React.FC<TeamProps> = ({ className = '' }) => {
  const [content, setContent] = useState<TeamContent | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const teamContent = getTeamContent();
      setContent(teamContent);
      setIsLoading(false);

      console.log('Team content loaded successfully', {
        memberCount: teamContent.members.length,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to load team content');
      setError(error);
      setIsLoading(false);

      console.error('Failed to load team content', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    }
  }, []);

  if (isLoading) {
    return (
      <Section
        id="team"
        variant="earth"
        padding="lg"
        ariaLabel="Team section loading"
        className={className}
      >
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-earth-600 border-r-transparent"
            role="status"
            aria-label="Loading team content"
          >
            <span className="sr-only">Loading team content...</span>
          </div>
        </div>
      </Section>
    );
  }

  if (error || !content) {
    console.error('Team section render error', {
      hasError: !!error,
      hasContent: !!content,
      errorMessage: error?.message,
      timestamp: new Date().toISOString(),
    });

    return (
      <Section
        id="team"
        variant="earth"
        padding="lg"
        ariaLabel="Team section error"
        className={className}
      >
        <div className="text-center">
          <p className="text-earth-700" role="alert">
            Unable to load team information. Please try again later.
          </p>
        </div>
      </Section>
    );
  }

  const headerClasses = ['text-center', 'mb-12', 'lg:mb-16'].join(' ');

  const headingClasses = [
    'text-4xl',
    'sm:text-5xl',
    'lg:text-6xl',
    'font-serif',
    'font-bold',
    'text-earth-900',
    'mb-4',
  ].join(' ');

  const subheadingClasses = [
    'text-xl',
    'sm:text-2xl',
    'text-earth-700',
    'font-medium',
    'mb-6',
  ].join(' ');

  const introductionClasses = [
    'text-lg',
    'text-stone-700',
    'max-w-3xl',
    'mx-auto',
    'leading-relaxed',
  ].join(' ');

  const gridClasses = [
    'grid',
    'grid-cols-1',
    'sm:grid-cols-2',
    'lg:grid-cols-4',
    'gap-6',
    'lg:gap-8',
  ].join(' ');

  return (
    <Section
      id="team"
      variant="earth"
      padding="lg"
      ariaLabel="Meet our team"
      className={className}
    >
      <div className={headerClasses}>
        <h2 className={headingClasses}>{content.heading}</h2>
        <p className={subheadingClasses}>{content.subheading}</p>
        <p className={introductionClasses}>{content.introduction}</p>
      </div>

      <div className={gridClasses}>
        {content.members.map((member) => {
          const memberProps: TeamMemberProps = {
            id: member.id,
            name: member.name,
            role: member.role,
            bio: member.bio,
            imageUrl: member.imageUrl,
            imageAlt: member.imageAlt,
          };

          return <TeamMember key={member.id} {...memberProps} />;
        })}
      </div>
    </Section>
  );
};

export default Team;