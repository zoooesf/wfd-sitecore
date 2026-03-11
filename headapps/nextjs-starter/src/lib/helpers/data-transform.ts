import moment from 'moment';

/**
 * Formats a date string into a localized display format
 * @param dateString - ISO date string to format
 * @param locale - Locale to use for formatting (defaults to 'en-US')
 * @param options - Intl.DateTimeFormatOptions for customizing the format
 * @returns Formatted date string or empty string if input is invalid
 */
export const formatDate = (
  dateString?: string,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  if (!dateString) return '';

  try {
    // Parse as UTC to prevent timezone shifts
    const date = moment.utc(dateString).toDate();
    return new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - String to append after truncation (defaults to '...')
 * @returns Truncated text with suffix or original text if shorter than maxLength
 */
export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (!text || text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + suffix;
};
