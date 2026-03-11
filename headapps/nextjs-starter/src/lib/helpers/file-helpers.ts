/**
 * File-related utility functions
 */

/**
 * Extract file name from src URL or use displayName as fallback
 * @param src - The file source URL
 * @param displayName - Fallback display name
 * @returns The extracted file name
 */
export const getFileNameFromSrc = (src: string, displayName: string): string => {
  if (src) {
    const urlParts = src.split('/');
    return urlParts[urlParts.length - 1] || displayName;
  }
  return displayName;
};
