import { Field } from '@sitecore-content-sdk/nextjs';
import { LinkGQLType } from '../types';

/**
 * Safely retrieves the value from a Sitecore field with fallback support
 * @param primary - The primary Field<string> to get the value from
 * @param fallback - The fallback Field<string> to use if primary is undefined or empty
 * @returns The value of the primary field, fallback field, or empty string if both are undefined
 */
export const getFieldValue = (primary?: Field<string>, fallback?: Field<string>): string => {
  // Using nullish coalescing for more efficient value checking
  return primary?.value ?? fallback?.value ?? '';
};

/**
 * Checks if a LinkGQLType has a valid href value
 * @param link - The LinkGQLType to check
 * @returns Boolean indicating if the link has a non-empty href
 */
export const hasValidHref = (link?: LinkGQLType): boolean => {
  return !!(link?.jsonValue?.value?.href && link.jsonValue.value.href !== '');
};
