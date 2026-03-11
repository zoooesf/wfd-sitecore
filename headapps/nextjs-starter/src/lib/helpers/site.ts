import { LayoutServiceData, Page } from '@sitecore-content-sdk/nextjs';
import { FALLBACK_SITE_NAME } from 'lib/const';

/**
 * Get site name from Sitecore page
 * @param page - The Sitecore page object
 * @returns The site name or fallback site name
 */
export const getPageSiteName = (page?: Page): string => {
  return page?.siteName ?? FALLBACK_SITE_NAME;
};

/**
 * Get site name from layout data
 * @param layoutData - The layout service data
 * @returns The site name or fallback site name
 */
export const getSiteName = (layoutData?: LayoutServiceData): string => {
  return layoutData?.sitecore?.context?.site?.name ?? FALLBACK_SITE_NAME;
};
