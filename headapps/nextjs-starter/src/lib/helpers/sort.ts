import { ArticleDataType } from 'lib/types';
import moment from 'moment';

/**
 * Sorts article data by published date in descending order (newest first)
 * @param a - First article data item to compare
 * @param b - Second article data item to compare
 * @returns Number indicating sort order (-1, 0, 1)
 */
export const sortByDatePublished = (a: ArticleDataType, b: ArticleDataType): number => {
  // Early return if either date is missing
  if (!a?.datePublished && !b?.datePublished) return 0;
  if (!a?.datePublished) return 1; // b comes first
  if (!b?.datePublished) return -1; // a comes first

  // Convert dates to timestamps for comparison (parse as UTC to prevent timezone shifts)
  const aDateValue = a.datePublished.formattedDateValue;
  const bDateValue = b.datePublished.formattedDateValue;

  const aDate = aDateValue ? moment.utc(aDateValue, 'MM/DD/YYYY').valueOf() : 0;
  const bDate = bDateValue ? moment.utc(bDateValue, 'MM/DD/YYYY').valueOf() : 0;

  return bDate - aDate;
};
