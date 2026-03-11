import React, { createContext, useContext, useMemo } from 'react';
import { Page, useSitecore } from '@sitecore-content-sdk/nextjs';
import { convertSxaTagsToTagItems } from 'lib/helpers';
import { TagType } from 'lib/types';

export type TagItem = {
  id?: string;
  title?: string;
  name?: string;
  displayName?: string;
};

export type ContextPageTagsValue = {
  pageId: string | null;
  pagePath: string | null;
  pageTags: TagItem[]; // combined unique tags from all sources
};

const defaultValue: ContextPageTagsValue = {
  pageId: null,
  pagePath: null,
  pageTags: [],
};

const ContextPageTags = createContext<ContextPageTagsValue>(defaultValue);

export const useContextPageTags = (): ContextPageTagsValue => useContext(ContextPageTags);

type ProviderProps = {
  children: React.ReactNode;
  /**
   * Optional override for Sitecore page object if needed. When omitted, the provider
   * will read from useSitecore(). This makes it easy to drop the provider in Layout.
   */
  pageOverride?: Page;
};

export const ContextPageTagsProvider: React.FC<ProviderProps> = ({ children, pageOverride }) => {
  const sitecoreProps = useSitecore();
  const page = pageOverride ?? sitecoreProps?.page;

  const value = useMemo<ContextPageTagsValue>(() => {
    const route = (page?.layout?.sitecore?.route ?? {}) as {
      fields?: Record<string, unknown>;
      [key: string]: unknown;
    };
    const pageId: string | null = (route?.itemId as string) ?? null;
    const pagePath: string | null = (route?.url as { path?: string })?.path ?? null;

    // SxaTags from route fields (Layout Service) - now the only source of tags
    const sxaTags = route?.fields?.SxaTags as TagType[] | undefined;
    const allTags: TagItem[] = convertSxaTagsToTagItems(sxaTags);

    // Create a unique set of tags by ID
    const uniqueTagsMap = new Map<string, TagItem>();
    allTags.forEach((tag) => {
      if (tag.id && !uniqueTagsMap.has(tag.id)) {
        uniqueTagsMap.set(tag.id, tag);
      }
    });

    const pageTags = Array.from(uniqueTagsMap.values());

    return {
      pageId,
      pagePath,
      pageTags,
    };
  }, [page?.layout?.sitecore?.route]);

  return <ContextPageTags.Provider value={value}>{children}</ContextPageTags.Provider>;
};

export default ContextPageTags;
