export const mockPageCategoryGQL = (value: string) => {
  return {
    name: value,
    displayName: value,
    id: `page-category-${value.toLowerCase().replace(/\s+/g, '-')}`,
    url: `/page-categories/${value.toLowerCase().replace(/\s+/g, '-')}`,
    fields: {
      pageCategory: { value: value },
    },
  };
};
