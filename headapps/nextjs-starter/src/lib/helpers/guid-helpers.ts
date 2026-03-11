/**
 * GUID utility functions for normalizing and comparing GUIDs in different formats
 */

/**
 * Removes curly braces from a GUID string
 * @param guid - The GUID string (with or without curly braces)
 * @returns The GUID without curly braces
 */
export const removeCurlyBraces = (guid: string): string => {
  return guid.replace(/[{}]/g, '');
};

/**
 * Ensures a GUID string has curly braces
 * @param guid - The GUID string (with or without curly braces)
 * @returns The GUID with curly braces
 */
export const ensureCurlyBraces = (guid: string | undefined): string => {
  if (!guid) return '';
  return guid.startsWith('{') ? guid : `{${guid}}`;
};

/**
 * Normalizes an ID by removing hyphens and converting to lowercase
 * Useful for comparing IDs that might be in different formats
 * @param id - The ID string to normalize
 * @returns The normalized ID (lowercase, no hyphens)
 */
export const normalizeIdLowercase = (id: string): string => {
  return id.toLowerCase().replace(/-/g, '');
};

/**
 * Normalizes an ID by removing hyphens and converting to uppercase
 * Useful for comparing IDs that might be in different formats
 * @param id - The ID string to normalize
 * @returns The normalized ID (uppercase, no hyphens)
 */
export const normalizeIdUppercase = (id: string): string => {
  return id.toUpperCase().replace(/-/g, '');
};
