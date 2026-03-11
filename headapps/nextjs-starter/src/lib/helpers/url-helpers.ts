import { DynamicObjectType } from '../types';

/**
 * Turns the parameter object into a query string and appends it to the URL
 * @param url - String URL
 * @param params - Object with the parameters to append
 * @returns a string of the URL with the new query string
 */

export const addQueryStringParameters = (url: string, params: DynamicObjectType): string => {
  let urlObject: URL;
  try {
    urlObject = new URL(url);
  } catch (error) {
    // If new URL(url) fails, include the current page's domain
    const currentUrl = window.location.protocol + '//' + window.location.hostname;
    const currentUrlObject = new URL(currentUrl);
    urlObject = new URL(url, currentUrlObject);
  }

  const urlParams = urlObject.searchParams;

  // Set or append the new query string parameters
  for (const [key, value] of Object.entries(params)) {
    // Only add if not undefined
    if (key && value) {
      urlParams.set(key, value as string);
    }
  }

  // Update the URL with the new query string
  urlObject.search = urlParams.toString();

  return urlObject.toString();
};
