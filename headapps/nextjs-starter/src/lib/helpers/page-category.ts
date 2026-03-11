import { JSONValueType } from 'lib/types';

export type CategoryType = {
  displayName: string;
  fields: {
    pageCategory: { value: string };
  };
};

export type PageCategoryField = CategoryType[] | JSONValueType<CategoryType[]>;

export const getPageCategories = (pageCategory?: PageCategoryField): CategoryType[] => {
  if (!pageCategory) return [];

  if ('jsonValue' in pageCategory) {
    return pageCategory.jsonValue || [];
  }

  return pageCategory;
};
