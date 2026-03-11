/**
 * Constants for skeleton loading components
 */

// Border radius values for skeleton elements
export const SKELETON_BORDER_RADIUS = {
  SQUARE: 0, // For checkbox, button-like elements
  DEFAULT: undefined, // Uses react-loading-skeleton default (rounded)
} as const;

// Skeleton items configuration
export const SKELETON_ITEMS_CONFIG = {
  ITEMS_PER_PAGE: 3, // Number of skeleton result cards to show
} as const;

// Sidebar filters configuration
export const SIDEBAR_FILTERS_CONFIG = {
  FACET_GROUP_COUNT: 3, // Number of filter groups to show
  ITEMS_PER_GROUP: 5, // Number of checkbox items per group
} as const;

// Common skeleton dimensions
export const SKELETON_DIMENSIONS = {
  SEARCH_INPUT_HEIGHT: 42,
  SEARCH_BUTTON_WIDTH: 120,
  TOOLBAR_BUTTON_HEIGHT: 40,
  TOOLBAR_BUTTON_WIDTH: 120,
  SORT_DROPDOWN_WIDTH: 180,
  RESULTS_SUMMARY_WIDTH: 200,
  RESULTS_SUMMARY_HEIGHT: 20,
  PAGINATION_BUTTON_HEIGHT: 40,
  PAGINATION_PREV_NEXT_WIDTH: 70,
  PAGINATION_NUMBER_WIDTH: 40,
  PAGINATION_SELECTOR_TEXT_WIDTH: 120,
  PAGINATION_SELECTOR_DROPDOWN_WIDTH: 80,
} as const;
