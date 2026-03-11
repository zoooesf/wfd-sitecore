import { PAGE_TITLE_SUFFIX } from 'lib/const';

/**
 * Removes HTML tags from a text string
 * @param text - The text string that may contain HTML tags
 * @returns The text with HTML tags stripped out
 */
export const stripHtmlTags = (text: string): string => {
  return text.replace(/<[^>]*>?/g, '');
};

/**
 * Safely strips HTML tags from a text string with null/undefined handling
 * @param text - The text string that may contain HTML tags (can be null/undefined)
 * @returns The text with HTML tags stripped out, or empty string if input is null/undefined
 */
export const safeStripHtmlTags = (text?: string | null): string => {
  return text ? stripHtmlTags(text) : '';
};

/**
 * Safely strips HTML tags from a text string while preserving mark tags, with null/undefined handling
 * @param text - The text string that may contain HTML tags (can be null/undefined)
 * @returns The text with HTML tags stripped out except for mark tags, or empty string if input is null/undefined
 */
export const safeStripHtmlTagsPreservingHighlights = (text?: string | null | unknown): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return text.replace(/<(?!\/?mark\b)[^>]*>/gi, '');
};

/**
 * Gets the highlighted text from Sitecore Search highlight field, handling array format
 * @param highlightField - The highlight field which can be a string, array of strings, or undefined
 * @param fallbackText - The fallback text to use if highlight is not available
 * @returns The highlighted text (first element if array) or fallback text
 */
export const getHighlightedText = (
  highlightField?: string | string[] | null,
  fallbackText?: string | null
): string => {
  const highlightedText = Array.isArray(highlightField) ? highlightField[0] : highlightField;
  const finalText = highlightedText || fallbackText || '';

  return safeStripHtmlTagsPreservingHighlights(finalText);
};

/*
 * Removes accents from a string
 * Note: replace(/[\u0300-\u036f]/g, '') - Removes all combining diacritical marks (the accent characters) using the Unicode range for combining marks
 * Note: normalize('NFD') - Converts the string to its decomposed form, separating the base character and the diacritical marks
 * @param str - The string to remove accents from
 * @returns The string with accents removed
 */
export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Normalizes title text by removing common suffixes.
 * @param title - The title string to normalize
 * @returns The normalized title with common suffixes removed
 */
export const normalizeTitleText = (title: string): string => {
  if (!title) return '';

  return title.replace(new RegExp(`\\s*-*${PAGE_TITLE_SUFFIX}\\s*$`, 'i'), '').trim();
};
