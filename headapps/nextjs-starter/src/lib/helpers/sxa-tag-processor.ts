import { TagType } from 'lib/types';

/**
 * Represents a tag item from Sitecore
 */
type TagItem = {
  id?: string;
  title?: string;
  name?: string;
  displayName?: string;
};

/**
 * Normalizes SXA tags from GraphQL format to Layout Service format
 * Converts tag.title.value to tag.fields.Title.value for consistency
 * @param sxaTags - Array of SXA tag objects from any source (TagType[] or TagItem[])
 * @returns Array of normalized TagType objects with consistent fields structure
 */
export const normalizeSxaTags = (sxaTags: TagType[] | TagItem[] | undefined): TagType[] => {
  if (!Array.isArray(sxaTags)) {
    return [];
  }

  return sxaTags.map((tag): TagType => {
    // Handle TagType with title.value format (from GraphQL)
    if (
      'title' in tag &&
      tag.title &&
      typeof tag.title === 'object' &&
      'value' in tag.title &&
      !('fields' in tag && tag.fields?.Title?.value)
    ) {
      return {
        id: tag.id || '',
        name: tag.name || '',
        displayName: tag.displayName || '',
        fields: {
          Title: tag.title,
        },
      };
    }

    // Handle TagItem format (from GraphQL targetItems) - convert title string to Field format
    if ('title' in tag && typeof tag.title === 'string') {
      return {
        id: tag.id || '',
        name: tag.name || '',
        displayName: tag.displayName || '',
        fields: {
          Title: { value: tag.title },
        },
      };
    }

    // Handle TagType already in correct format (from Layout Service)
    if ('fields' in tag) {
      return tag as TagType;
    }

    // Fallback for TagItem without title
    return {
      id: tag.id || '',
      name: tag.name || '',
      displayName: tag.displayName || '',
      fields: undefined,
    };
  });
};

/**
 * Grouped tags by prefix (e.g., { year: ['2023', '2024'], topic: ['technology'] })
 */
type GroupedTags = Record<string, string[]>;

/**
 * Processes SXA tags in "prefix:value" format and groups them by prefix
 * Tags that don't follow the "prefix:value" format are ignored
 * @param sxaTags - Array of SXA tag objects from Sitecore
 * @returns Object with tags grouped by prefix (non-conforming tags are excluded)
 */
export const groupSxaTagsByPrefix = (sxaTags: TagType[] | undefined): GroupedTags => {
  if (!Array.isArray(sxaTags)) {
    return {};
  }

  // Normalize tags first to ensure consistent format
  const normalizedTags = normalizeSxaTags(sxaTags);

  return normalizedTags.reduce((acc, tag) => {
    const tagValue = tag?.fields?.Title?.value;

    // REQUIREMENT: Ignore tags that don't follow the prefix:value format
    if (tagValue && tagValue.includes(':')) {
      const [prefix, value] = tagValue.split(':', 2);
      // Only process if both prefix and value exist (non-empty after split)
      if (prefix && value) {
        if (!acc[prefix]) {
          acc[prefix] = [];
        }
        acc[prefix].push(value);
      }
      // Tags without proper prefix:value format are silently ignored
    }
    // Tags without colon separator are silently ignored
    return acc;
  }, {} as GroupedTags);
};

/**
 * Formats grouped tags as "prefix:value1,value2;prefix2:value3"
 * @param groupedTags - Tags grouped by prefix
 * @returns Formatted string for meta tags
 */
export const formatGroupedTagsForMeta = (groupedTags: GroupedTags): string => {
  return Object.entries(groupedTags)
    .map(([prefix, values]) => `${prefix}:${values.join(',')}`)
    .join(';');
};

/**
 * Converts SXA tags to TagItem format for compatibility with existing tag processing
 * @param sxaTags - Array of SXA tag objects from Sitecore
 * @returns Array of TagItem objects
 */
export const convertSxaTagsToTagItems = (sxaTags: TagType[] | undefined): TagItem[] => {
  if (!Array.isArray(sxaTags)) {
    return [];
  }

  // Normalize tags first to ensure consistent format
  const normalizedTags = normalizeSxaTags(sxaTags);

  return normalizedTags
    .map((tag) => ({
      id: tag?.id,
      name: tag?.name,
      displayName: tag?.displayName,
      title: tag?.fields?.Title?.value,
    }))
    .filter(Boolean);
};
