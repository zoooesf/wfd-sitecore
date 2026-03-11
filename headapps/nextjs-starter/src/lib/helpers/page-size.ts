/**
 * Default page size for listing components
 */
export const DEFAULT_PAGE_SIZE = 12;

/**
 * Validates and returns a valid page size value.
 * Returns DEFAULT_PAGE_SIZE (12) if the value is:
 * - undefined or null
 * - not a valid number
 * - not an integer
 * - less than or equal to 0
 *
 * @param value - The page size value from Sitecore field
 * @returns A valid page size integer
 */
export const getValidPageSize = (value: number | undefined | null): number => {
  if (value === undefined || value === null) {
    return DEFAULT_PAGE_SIZE;
  }

  const parsed = Number(value);

  if (isNaN(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
    return DEFAULT_PAGE_SIZE;
  }

  return parsed;
};
