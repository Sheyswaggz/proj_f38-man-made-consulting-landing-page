'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export interface TeamMemberProps {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  imageAlt: string;
  className?: string;
}

export const TeamMember: React.FC<TeamMemberProps> = ({
  id,
  name,
  role,
  bio,
  imageUrl,
  imageAlt,
  className = '',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      console.error(`Failed to load team member image: ${imageUrl}`, {
        memberId: id,
        memberName: name,
        timestamp: new Date().toISOString(),
      });
      setImageError(true);
    };
  }, [imageUrl, id, name]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsHovered(!isHovered);
    }
  };

  const baseClasses = [
    'bg-earth-50',
    'border',
    'border-sand-200',
    'rounded-lg',
    'overflow-hidden',
    'transition-all',
    'duration-300',
    'shadow-soft',
    'flex',
    'flex-col',
    'h-full',
  ].join(' ');

  const hoverClasses = isHovered
    ? 'shadow-soft-lg border-earth-300 transform -translate-y-1'
    : 'hover:shadow-soft-lg hover:border-earth-300 hover:-translate-y-1';

  const combinedClasses = [baseClasses, hoverClasses, className]
    .filter(Boolean)
    .join(' ');

  const imageContainerClasses = [
    'relative',
    'w-full',
    'aspect-square',
    'bg-sand-100',
    'overflow-hidden',
  ].join(' ');

  const imageClasses = [
    'object-cover',
    'transition-transform',
    'duration-300',
    isHovered ? 'scale-105' : 'scale-100',
  ].join(' ');

  const contentClasses = [
    'p-6',
    'flex',
    'flex-col',
    'flex-grow',
    'gap-3',
  ].join(' ');

  const nameClasses = [
    'text-xl',
    'font-serif',
    'font-semibold',
    'text-earth-900',
    'mb-1',
  ].join(' ');

  const roleClasses = [
    'text-base',
    'font-medium',
    'text-earth-600',
    'mb-2',
  ].join(' ');

  const bioClasses = [
    'text-sm',
    'text-stone-700',
    'leading-relaxed',
    'flex-grow',
  ].join(' ');

  const skeletonClasses = [
    'absolute',
    'inset-0',
    'bg-gradient-to-r',
    'from-sand-100',
    'via-sand-200',
    'to-sand-100',
    'animate-pulse',
  ].join(' ');

  return (
    <div
      ref={cardRef}
      className={combinedClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="article"
      aria-labelledby={`${id}-name`}
      tabIndex={0}
    >
      <div className={imageContainerClasses}>
        {!imageLoaded && !imageError && (
          <div className={skeletonClasses} aria-hidden="true" />
        )}
        {imageError ? (
          <div
            className="absolute inset-0 flex items-center justify-center bg-sand-200"
            role="img"
            aria-label={imageAlt}
          >
            <svg
              className="w-16 h-16 text-sand-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={imageClasses}
            priority={false}
            loading="lazy"
            onLoad={() => {
              setImageLoaded(true);
              console.log(`Team member image loaded successfully`, {
                memberId: id,
                memberName: name,
                imageUrl,
                timestamp: new Date().toISOString(),
              });
            }}
            onError={() => {
              console.error(`Image component error for team member`, {
                memberId: id,
                memberName: name,
                imageUrl,
                timestamp: new Date().toISOString(),
              });
              setImageError(true);
            }}
          />
        )}
      </div>

      <div className={contentClasses}>
        <div>
          <h3 id={`${id}-name`} className={nameClasses}>
            {name}
          </h3>
          <p className={roleClasses} aria-label={`Role: ${role}`}>
            {role}
          </p>
        </div>

        <p className={bioClasses}>{bio}</p>
      </div>
    </div>
  );
};

export default TeamMember;