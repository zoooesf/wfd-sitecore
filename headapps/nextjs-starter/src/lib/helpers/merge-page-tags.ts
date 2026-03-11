import { normalizeIdLowercase } from './guid-helpers';

/**
 * Represents a tag item from Sitecore
 */
export type TagItem = {
  id?: string;
  title?: string;
  name?: string;
  displayName?: string;
};

/**
 * Checks if two sets of tags have any matching items by ID
 * @param tagsA - First array of tag items
 * @param tagsB - Second array of tag items
 * @returns True if there's at least one matching tag ID, false otherwise
 */
export const hasMatchingTags = (tagsA: TagItem[] = [], tagsB: TagItem[] = []): boolean => {
  if (!tagsA.length || !tagsB.length) {
    return false;
  }
  // Normalize all IDs in tagsA
  const normalizedTagsAIds = new Set(
    tagsA.map((tag) => (tag.id ? normalizeIdLowercase(tag.id) : null)).filter(Boolean)
  );
  // Normalize all IDs in tagsB
  const normalizedTagsBIds = tagsB
    .map((tag) => (tag.id ? normalizeIdLowercase(tag.id) : null))
    .filter(Boolean);
  // Find matching normalized IDs
  const matchingIds = normalizedTagsBIds.filter((id) => normalizedTagsAIds.has(id));
  return matchingIds.length > 0;
};
