/**
 * Type definitions for Storybook stories (Content SDK)
 */
import { Page } from '@sitecore-content-sdk/nextjs';

/**
 * Type for field values in Sitecore fields
 */
export interface FieldValue {
  value?: string;
  editable?: string;
}

/**
 * Type for Storybook args that may contain nested page fields (Content SDK)
 * Uses an index signature to allow accessing deeply nested properties
 * via both dot notation and nested object access
 *
 * Example usage:
 * - Nested: currentArgs?.page?.layout?.sitecore?.route?.fields?.heading?.value
 * - Flat dotted path: currentArgs?.['page.layout.sitecore.route.fields.heading.value']
 */
export type StoryArgsWithLayoutData = {
  page?: {
    layout?: {
      sitecore?: {
        route?: {
          fields?: Record<string, FieldValue>;
        };
      };
    };
  };
  [key: string]: unknown;
};

/**
 * Extracts page object from Storybook's context.loaded for Content SDK
 * Returns the page object returned by mockPageWithRoute
 */
export function getPageFromLoader(loaded: unknown): { page: Page } | undefined {
  if (loaded && typeof loaded === 'object' && 'page' in loaded) {
    return loaded as { page: Page };
  }
  return undefined;
}
