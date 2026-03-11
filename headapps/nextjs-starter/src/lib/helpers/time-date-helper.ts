import moment from 'moment';
import 'moment/locale/fr-ca'; // Import French locale
import { QueryField } from 'lib/types/fields';
import { DateGQLType } from 'lib/types/graphql';
import { Field } from '@sitecore-content-sdk/nextjs';
import { mainLanguage } from 'lib/i18n/i18n-config';

const NULLISH_DATE_STRING = '0001-01-01';
const NULLISH_DATE_TIME_STRING = '0001-01-01T00:00:00Z';

export const isNullishDateTime = (date?: string | number | null | undefined) => {
  if (date === null || date === undefined) return true;
  const dateStr = String(date);
  return !dateStr || dateStr === NULLISH_DATE_STRING || dateStr === NULLISH_DATE_TIME_STRING;
};

/**
 * Format display date time for News articles
 * Used by both ArticleHeader and ArticleCard components
 *
 * @param displayDateTime - The display date time field from Sitecore (can be undefined)
 * @param datePublished - The fallback date published field (can be undefined)
 * @param dateFormat - Optional date format (defaults to 'MM/DD/YYYY HH:mm')
 * @returns Object with formatted date string and whether default date was used
 */
export const formatNewsDisplayDateTime = (
  displayDateTime: QueryField | undefined,
  datePublished: DateGQLType | Field<string> | undefined,
  dateFormat = 'MM/DD/YYYY HH:mm'
): { formattedDate: string; useDefaultDate: boolean } => {
  // Initialize result
  let formattedDate = '';
  let useDefaultDate = false;

  // Check if displayDateTime exists and is valid
  if (displayDateTime && typeof displayDateTime === 'object') {
    // Handle query field format
    if ('jsonValue' in displayDateTime && displayDateTime.jsonValue?.value) {
      const dateValue = displayDateTime.jsonValue.value;
      if (dateValue && !isNullishDateTime(dateValue)) {
        // Make sure we're working with a string for moment
        const dateString = typeof dateValue === 'string' ? dateValue : String(dateValue);

        formattedDate = moment.utc(dateString).format(dateFormat);
        return { formattedDate, useDefaultDate: false };
      }
    }
    // Handle direct field format
    else if ('value' in displayDateTime) {
      const dateTimeValue = displayDateTime.value;
      if (dateTimeValue && typeof dateTimeValue === 'string' && !isNullishDateTime(dateTimeValue)) {
        formattedDate = moment.utc(dateTimeValue).format(dateFormat);
        return { formattedDate, useDefaultDate: false };
      }
    }
  }

  // If we get here, we need to use the fallback date
  useDefaultDate = true;

  // Format the fallback date if available
  if (datePublished && typeof datePublished === 'object') {
    // Handle DateGQLType
    if ('formattedDateValue' in datePublished && datePublished.formattedDateValue) {
      const DATE_FORMAT = 'MM/DD/YYYY';
      formattedDate = moment.utc(datePublished.formattedDateValue, DATE_FORMAT).format(DATE_FORMAT);
    }
    // Handle Field<string> type
    else if ('value' in datePublished && datePublished.value) {
      formattedDate = moment.utc(datePublished.value).format(dateFormat);
    }
  }

  return { formattedDate, useDefaultDate };
};

export const getFormattedDate = (
  date?: string | Date,
  options?: Intl.DateTimeFormatOptions,
  locale?: string
) => {
  if (!date) return date;

  // Handle both Date objects and string inputs
  let utcDate: Date;
  if (typeof date === 'string') {
    // Parse as UTC to prevent timezone shifts (existing behavior)
    utcDate = moment.utc(date).toDate();
  } else {
    // Date object passed directly
    utcDate = date;
  }

  return utcDate.toLocaleDateString(locale || 'en-US', {
    timeZone: 'UTC',
    ...(options || {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    }),
  });
};

/**
 * Format date with locale-aware formatting.
 * Uses moment.js for better locale support and formatting.
 * @param date - Date string to format
 * @param locale - Locale to use for formatting (defaults to 'en')
 * @param showTime - Whether to include time in the output (defaults to false)
 * @returns Formatted date string
 */
export const getLocalizedFormattedDate = (
  date?: string,
  locale = mainLanguage,
  showTime = false
): string => {
  if (isNullishDateTime(date)) return '';

  const lowercaseLocale = locale.toLowerCase();
  const localeLanguage = locale.split('-')[0];
  const lowercaseLocaleLanguage = localeLanguage.toLowerCase();
  const momentDate = moment.utc(date);
  momentDate.locale([
    locale,
    lowercaseLocale,
    localeLanguage,
    lowercaseLocaleLanguage,
    mainLanguage,
  ]);

  return momentDate.format(showTime ? 'LLL' : 'LL');
};

export const getFormattedTime = (date?: string, options?: Intl.DateTimeFormatOptions) => {
  if (!date) return date;

  // Parse as UTC to prevent timezone shifts
  const utcDate = moment.utc(date).toDate();

  return utcDate.toLocaleTimeString('en-US', {
    timeZone: 'UTC',
    ...(options || { hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' }),
  });
};

export const getDateRange = ({
  startDate,
  endDate,
  options,
  displayBasicRange,
  locale,
}: DateTimeRangeProps) => {
  // Handle nullish dates
  if (isNullishDateTime(startDate) || isNullishDateTime(endDate)) {
    if (!isNullishDateTime(startDate)) {
      return getFormattedDate(startDate, options, locale);
    }
    if (!isNullishDateTime(endDate)) {
      return getFormattedDate(endDate, options, locale);
    }
    return '';
  }

  const dates = {
    start: {
      day: getFormattedDate(startDate, { day: 'numeric' }, locale),
      month: getFormattedDate(startDate, { month: 'long' }, locale),
      year: getFormattedDate(startDate, { year: 'numeric' }, locale),
    },
    end: {
      day: getFormattedDate(endDate, { day: 'numeric' }, locale),
      month: getFormattedDate(endDate, { month: 'long' }, locale),
      year: getFormattedDate(endDate, { year: 'numeric' }, locale),
    },
  };

  if (displayBasicRange) {
    return `${getFormattedDate(startDate, options, locale)} - ${getFormattedDate(
      endDate,
      options,
      locale
    )}`;
  }

  // Exact same date
  if (
    dates.start.day === dates.end.day &&
    dates.start.month === dates.end.month &&
    dates.start.year === dates.end.year
  ) {
    return getFormattedDate(startDate, options, locale);
  }

  // Different year
  if (dates.start.year !== dates.end.year) {
    return `${getFormattedDate(startDate, options, locale)} - ${getFormattedDate(
      endDate,
      options,
      locale
    )}`;
  }

  // Same year, Different month
  if (dates.start.month !== dates.end.month) {
    return `${dates.start.month} ${dates.start.day} - ${dates.end.month} ${dates.end.day}, ${dates.end.year}`;
  }

  // Same year, Same month, Different day
  if (dates.start.day !== dates.end.day) {
    return `${dates.start.month} ${dates.start.day} - ${dates.end.day}, ${dates.end.year}`;
  }

  return `${getFormattedDate(startDate, options, locale)} - ${getFormattedDate(
    endDate,
    options,
    locale
  )}`;
};

export const normalizeDateTimeFieldValue = (date?: string): string => {
  return isNullishDateTime(date) ? '' : String(date || '');
};

type DateTimeRangeProps = {
  startDate?: string;
  endDate?: string;
  options?: Intl.DateTimeFormatOptions;
  displayBasicRange?: boolean;
  locale?: string;
};

/**
 * Processes an event/article object to add formatted date and time fields
 * @param item - The event/article object with m_event_startdate and m_event_enddate fields
 * @returns The original object with additional formatted date fields
 */
export const processEventDates = <T extends Record<string, unknown>>(
  item: T
): T & {
  formattedStartDate?: string;
  formattedEndDate?: string;
  event_starttime?: string;
  event_endtime?: string;
} => {
  const startDate = item.m_event_startdate as string;
  const endDate = item.m_event_enddate as string;

  return {
    ...item,
    formattedStartDate: startDate ? getFormattedDate(startDate) : undefined,
    formattedEndDate: endDate ? getFormattedDate(endDate) : undefined,
    event_starttime: startDate
      ? getFormattedTime(startDate, {
          timeZone: 'UTC',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZoneName: 'short',
        })
      : undefined,
    event_endtime: endDate
      ? getFormattedTime(endDate, {
          timeZone: 'UTC',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZoneName: 'short',
        })
      : undefined,
  };
};
