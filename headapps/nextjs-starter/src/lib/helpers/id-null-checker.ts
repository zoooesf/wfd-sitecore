export const contentRootIdNullChecker = (contentRootId: string) => {
  if (!contentRootId) {
    return '';
  }
  return contentRootId;
};
