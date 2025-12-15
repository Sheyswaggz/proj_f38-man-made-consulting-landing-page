'use client';

import React from 'react';
import Script from 'next/script';
import {
  organizationStructuredData,
  serviceStructuredData,
  websiteStructuredData,
} from '@/lib/seo/metadata';

/**
 * Props for the StructuredData component
 */
export interface StructuredDataProps {
  /**
   * Additional structured data to include beyond the defaults
   */
  readonly additionalData?: readonly Record<string, unknown>[];
  /**
   * Whether to include organization data
   * @default true
   */
  readonly includeOrganization?: boolean;
  /**
   * Whether to include service data
   * @default true
   */
  readonly includeService?: boolean;
  /**
   * Whether to include website data
   * @default true
   */
  readonly includeWebsite?: boolean;
  /**
   * Custom class name for the script container
   */
  readonly className?: string;
}

/**
 * Validates structured data object for JSON-LD compliance
 */
function validateStructuredData(data: unknown): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  if (!obj['@context'] || !obj['@type']) {
    return false;
  }

  if (typeof obj['@context'] !== 'string') {
    return false;
  }

  if (typeof obj['@type'] !== 'string') {
    return false;
  }

  return true;
}

/**
 * Safely stringifies structured data with error handling
 */
function safeStringify(data: unknown): string | null {
  try {
    if (!validateStructuredData(data)) {
      console.error('[StructuredData] Invalid structured data format:', data);
      return null;
    }

    return JSON.stringify(data);
  } catch (error) {
    console.error('[StructuredData] Failed to stringify data:', error);
    return null;
  }
}

/**
 * Combines multiple structured data objects into a single JSON-LD array
 */
function combineStructuredData(
  dataArray: readonly unknown[]
): string | null {
  const validData = dataArray.filter((data) => {
    const isValid = validateStructuredData(data);
    if (!isValid) {
      console.warn('[StructuredData] Skipping invalid data:', data);
    }
    return isValid;
  });

  if (validData.length === 0) {
    console.error('[StructuredData] No valid structured data to render');
    return null;
  }

  try {
    return JSON.stringify(validData);
  } catch (error) {
    console.error('[StructuredData] Failed to combine data:', error);
    return null;
  }
}

/**
 * StructuredData Component
 *
 * Injects JSON-LD structured data into the page for SEO optimization.
 * Includes organization, service, and website structured data by default,
 * with support for additional custom structured data.
 *
 * @example
 * ```tsx
 * <StructuredData />
 * ```
 *
 * @example With custom data
 * ```tsx
 * <StructuredData
 *   additionalData={[
 *     {
 *       '@context': 'https://schema.org',
 *       '@type': 'Article',
 *       headline: 'My Article',
 *       author: { '@type': 'Person', name: 'John Doe' }
 *     }
 *   ]}
 * />
 * ```
 *
 * @example Selective inclusion
 * ```tsx
 * <StructuredData
 *   includeOrganization={true}
 *   includeService={false}
 *   includeWebsite={true}
 * />
 * ```
 */
export const StructuredData: React.FC<StructuredDataProps> = ({
  additionalData = [],
  includeOrganization = true,
  includeService = true,
  includeWebsite = true,
  className,
}) => {
  const structuredDataArray: unknown[] = [];

  if (includeOrganization) {
    structuredDataArray.push(organizationStructuredData);
  }

  if (includeService) {
    structuredDataArray.push(serviceStructuredData);
  }

  if (includeWebsite) {
    structuredDataArray.push(websiteStructuredData);
  }

  if (additionalData.length > 0) {
    structuredDataArray.push(...additionalData);
  }

  const jsonLdContent = combineStructuredData(structuredDataArray);

  if (!jsonLdContent) {
    console.error(
      '[StructuredData] No valid structured data available to render'
    );
    return null;
  }

  const handleScriptLoad = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[StructuredData] JSON-LD structured data loaded successfully');
    }
  };

  const handleScriptError = (error: Error) => {
    console.error('[StructuredData] Failed to load structured data script:', error);
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: jsonLdContent }}
      onLoad={handleScriptLoad}
      onError={handleScriptError}
      className={className}
    />
  );
};

/**
 * Creates a custom structured data object with validation
 */
export function createStructuredData<T extends Record<string, unknown>>(
  data: T
): T | null {
  if (!validateStructuredData(data)) {
    console.error('[StructuredData] Invalid structured data provided:', data);
    return null;
  }

  return data;
}

/**
 * Validates an array of structured data objects
 */
export function validateStructuredDataArray(
  dataArray: readonly unknown[]
): boolean {
  if (!Array.isArray(dataArray)) {
    return false;
  }

  return dataArray.every((data) => validateStructuredData(data));
}

/**
 * Merges multiple structured data objects of the same type
 */
export function mergeStructuredData<T extends Record<string, unknown>>(
  base: T,
  ...overrides: Partial<T>[]
): T {
  const merged = { ...base };

  for (const override of overrides) {
    Object.assign(merged, override);
  }

  if (!validateStructuredData(merged)) {
    console.warn('[StructuredData] Merged data is invalid, returning base');
    return base;
  }

  return merged;
}

/**
 * Extracts structured data type from an object
 */
export function getStructuredDataType(
  data: unknown
): string | null {
  if (!validateStructuredData(data)) {
    return null;
  }

  const obj = data as Record<string, unknown>;
  return typeof obj['@type'] === 'string' ? obj['@type'] : null;
}

/**
 * Checks if structured data is of a specific type
 */
export function isStructuredDataType(
  data: unknown,
  type: string
): boolean {
  const dataType = getStructuredDataType(data);
  return dataType === type;
}

export default StructuredData;