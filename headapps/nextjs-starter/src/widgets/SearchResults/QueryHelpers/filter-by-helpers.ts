import { FilterEqual, FilterOr } from '@sitecore-search/react';
import { CategoryType } from 'lib/helpers/page-category';
import { TagType } from 'lib/types';

type SearchListingWithFiltersFields = {
  fields: {
    filterByKeyword?: TagType[];
    // Add support for route field names (without filterBy prefix)
    keyword?: TagType[];
    location?: TagType[];
    // Add SxaTags for processing page tags
    SxaTags?: TagType[];
    // New tags field for prefix-based filtering (supports both TagType and CategoryType)
    tags?: (TagType | CategoryType)[];
  };
};

type FilterConfig = {
  fieldName: keyof SearchListingWithFiltersFields['fields'];
  searchField: string;
  valueField: 'Title' | 'pageCategory';
};

const FILTER_CONFIGS: FilterConfig[] = [
  // Support for route field names (without filterBy prefix)
  { fieldName: 'keyword', searchField: 'm_keywords', valueField: 'Title' },
  { fieldName: 'location', searchField: 'm_event_location', valueField: 'Title' },
];

const createFilterGroup = (
  items: (TagType | CategoryType)[],
  searchField: string,
  valueField: 'Title' | 'pageCategory'
): FilterOr | null => {
  if (!items?.length) return null;

  const filters: FilterEqual[] = [];

  items.forEach((item) => {
    let value =
      valueField === 'pageCategory'
        ? (item as CategoryType)?.fields?.pageCategory?.value
        : (item as TagType)?.fields?.Title?.value;

    if (value) {
      // Strip prefix from SXA tag values (e.g., "topic:Technology" -> "Technology")
      if (value.includes(':')) {
        const [, tagValue] = value.split(':', 2);
        if (tagValue) {
          value = tagValue;
        }
      }

      filters.push(new FilterEqual(searchField, value));
    }
  });

  return filters.length > 0 ? new FilterOr(filters) : null;
};

export const getFilterByTags = (filterByTagsFields: SearchListingWithFiltersFields): FilterOr[] => {
  const allFilters: FilterOr[] = [];

  // Process new 'tags' field - group by prefix and handle both TagType and CategoryType
  if (filterByTagsFields.fields?.tags?.length) {
    const categorizedItems: Record<string, (TagType | CategoryType)[]> = {};

    filterByTagsFields.fields.tags.forEach((item) => {
      // Try to get value from TagType (Title) or CategoryType (pageCategory)
      const titleValue = (item as TagType)?.fields?.Title?.value;
      const categoryValue = (item as CategoryType)?.fields?.pageCategory?.value;
      const value = titleValue || categoryValue;

      if (value && value.includes(':')) {
        const [prefix, ...rest] = value.split(':');
        const valueAfterPrefix = rest.join(':'); // Handle values with multiple colons

        if (prefix && valueAfterPrefix) {
          if (!categorizedItems[prefix]) {
            categorizedItems[prefix] = [];
          }

          // Create a new item with just the value (without prefix)
          // Preserve the type (TagType or CategoryType)
          if (titleValue) {
            // It's a TagType
            categorizedItems[prefix].push({
              ...item,
              fields: {
                Title: { value: valueAfterPrefix },
              },
            } as TagType);
          } else if (categoryValue) {
            // It's a CategoryType
            categorizedItems[prefix].push({
              ...item,
              fields: {
                pageCategory: { value: valueAfterPrefix },
              },
            } as CategoryType);
          }
        }
      }
    });

    // Create filters for each category
    Object.entries(categorizedItems).forEach(([prefix, items]) => {
      const searchField = `m_${prefix}`;

      // Determine if we're dealing with TagType or CategoryType based on first item
      const firstItem = items[0];
      const valueField = (firstItem as TagType)?.fields?.Title ? 'Title' : 'pageCategory';

      const filterGroup = createFilterGroup(items, searchField, valueField);
      if (filterGroup) {
        allFilters.push(filterGroup);
      }
    });
  }

  // Special handling for SxaTags - extract and categorize by prefix
  if (filterByTagsFields.fields?.SxaTags?.length) {
    const categorizedTags: Record<string, TagType[]> = {};

    filterByTagsFields.fields.SxaTags.forEach((tag) => {
      const titleValue = tag.fields?.Title?.value;

      if (titleValue && titleValue.includes(':')) {
        const [prefix, value] = titleValue.split(':', 2);
        if (prefix && value) {
          if (!categorizedTags[prefix]) {
            categorizedTags[prefix] = [];
          }
          // Create a new tag with just the value (without prefix)
          categorizedTags[prefix].push({
            ...tag,
            fields: {
              Title: { value: value },
            },
          });
        }
      }
    });

    // Create filters for each category
    Object.entries(categorizedTags).forEach(([prefix, tags]) => {
      const searchField = `m_${prefix}`;

      const filterGroup = createFilterGroup(tags, searchField, 'Title');
      if (filterGroup) {
        allFilters.push(filterGroup);
      }
    });
  }

  // Process filterByKeyword with prefix-based grouping (similar to tags field)
  if (filterByTagsFields.fields?.filterByKeyword?.length) {
    const categorizedItems: Record<string, (TagType | CategoryType)[]> = {};

    filterByTagsFields.fields.filterByKeyword.forEach((item) => {
      // Try to get value from TagType (Title) or CategoryType (pageCategory)
      const titleValue = (item as TagType)?.fields?.Title?.value;
      const categoryValue =
        'pageCategory' in (item.fields || {})
          ? (item as unknown as CategoryType)?.fields?.pageCategory?.value
          : undefined;
      const value = titleValue || categoryValue;

      if (value && value.includes(':')) {
        const [prefix, ...rest] = value.split(':');
        const valueAfterPrefix = rest.join(':'); // Handle values with multiple colons

        if (prefix && valueAfterPrefix) {
          if (!categorizedItems[prefix]) {
            categorizedItems[prefix] = [];
          }

          // Create a new item with just the value (without prefix)
          // Preserve the type (TagType or CategoryType)
          if (titleValue) {
            // It's a TagType
            categorizedItems[prefix].push({
              ...item,
              fields: {
                Title: { value: valueAfterPrefix },
              },
            } as TagType);
          } else if (categoryValue) {
            // It's a CategoryType
            categorizedItems[prefix].push({
              ...item,
              fields: {
                pageCategory: { value: valueAfterPrefix },
              },
            } as CategoryType);
          }
        }
      } else if (value) {
        // If no prefix, treat as regular keyword (m_keywords field)
        if (!categorizedItems['keywords']) {
          categorizedItems['keywords'] = [];
        }
        categorizedItems['keywords'].push(item);
      }
    });

    // Create filters for each category
    Object.entries(categorizedItems).forEach(([prefix, items]) => {
      const searchField = `m_${prefix}`;

      // Determine if we're dealing with TagType or CategoryType based on first item
      const firstItem = items[0];
      const valueField = (firstItem as TagType)?.fields?.Title ? 'Title' : 'pageCategory';

      const filterGroup = createFilterGroup(items, searchField, valueField);
      if (filterGroup) {
        allFilters.push(filterGroup);
      }
    });
  }

  // Process remaining filter fields (keyword and location for route-based filtering)
  FILTER_CONFIGS.forEach(({ fieldName, searchField, valueField }) => {
    const items = filterByTagsFields.fields?.[fieldName] as (TagType | CategoryType)[] | undefined;

    const filterGroup = items ? createFilterGroup(items, searchField, valueField) : null;

    if (filterGroup) {
      allFilters.push(filterGroup);
    }
  });

  return allFilters;
};
