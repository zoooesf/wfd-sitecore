import { getDateRange } from 'lib/helpers/time-date-helper';

/**
 * Format a date range for display
 * @param start - Start date
 * @param end - End date
 * @param locale - Locale for formatting (e.g., 'en-US', 'fr-CA')
 * @returns Formatted string like "Sep 3, 2025 - Oct 16, 2025"
 */
export const formatDateRange = (
  start: Date | undefined,
  end: Date | undefined,
  locale?: string
): string => {
  if (!start || !end) {
    return '';
  }

  // Convert Date objects to ISO strings for the helper function
  const startStr = start.toISOString();
  const endStr = end.toISOString();

  // Use the existing helper with custom options to match "MMM D, YYYY" format
  return (
    getDateRange({
      startDate: startStr,
      endDate: endStr,
      options: { month: 'short', day: 'numeric', year: 'numeric' },
      displayBasicRange: true, // This gives "Date - Date" format
      locale,
    }) || ''
  );
};

/**
 * Get two consecutive months for desktop dual calendar display
 * @param date - Base date (usually current date or selected start date)
 * @returns Array of two Date objects representing consecutive months
 */
export const getConsecutiveMonths = (date: Date = new Date()): [Date, Date] => {
  const firstMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const secondMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  return [firstMonth, secondMonth];
};
