// Article variant constants and types
export const ARTICLE_VARIANTS = {
  DEFAULT: 'Default',
  INSIGHTS: 'Insights',
  NEWS: 'News',
} as const;

export type ArticleVariant = (typeof ARTICLE_VARIANTS)[keyof typeof ARTICLE_VARIANTS];
