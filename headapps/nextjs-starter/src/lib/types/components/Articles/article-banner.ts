import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ArticleRouteFieldsType } from 'lib/types';

export type ArticleBannerProps = ComponentProps & {
  fields: ArticleRouteFieldsType;
  variant?: string;
  rendering: ComponentRendering & {
    path?: string;
  };
};
