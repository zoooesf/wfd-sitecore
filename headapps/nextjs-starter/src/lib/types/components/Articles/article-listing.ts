import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ArticleDataType } from 'lib/types';
import { ArticleVariant } from 'lib/helpers/article-variants';

type ArticleListingFields = {
  heading: Field<string>;
  filterByTags?: Field<boolean>;
  tagsHeading?: Field<string>;
  noResultsText?: Field<string>;
  PageSizeCount?: Field<number>;
};

type ArticleListingRenderingType = {
  rendering: ComponentRendering & {
    data: ArticleDataType[];
  };
};

export type ArticleListingProps = ComponentProps &
  ArticleListingRenderingType & {
    fields: ArticleListingFields;
    variant?: ArticleVariant;
  };
