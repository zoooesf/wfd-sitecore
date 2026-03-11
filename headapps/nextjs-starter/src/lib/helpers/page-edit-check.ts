import { ImageFieldValue, Page } from '@sitecore-content-sdk/nextjs';
import { JSX } from 'react';

/**
 * Handles switching between the content to display on the Page builder Editor and the Rendering Page
 * @param page - Sitecore page context
 * @param content - Sitecore Component to display on an Editor
 * @param field - field to check if it should render something
 * @param displayContent - element to display if not on an Editor
 * @returns if Datasource if broken in Sitecore return null, else return the content or displayContent
 */

export const pageEditCheck = (
  page: Page,
  content: JSX.Element,
  field?: ImageFieldValue | string | boolean | number,
  displayContent?: JSX.Element
): JSX.Element | null => {
  if (!!page?.mode.isEditing) return content;
  if (field) return displayContent ?? content;

  return null;
};
