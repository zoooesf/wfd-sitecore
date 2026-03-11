import { JSX } from 'react';
import { GetComponentServerProps, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import { getItemPathString } from 'lib/helpers/item-path';
import ArticleBanner from 'component-children/Articles/ArticleBanner/ArticleBanner';
import ContainedArticleBanner from 'component-children/Articles/ArticleBanner/ContainedArticleBanner';
import { ArticleBannerProps } from 'lib/types/components/Articles/article-banner';
import { ARTICLE_VARIANTS } from 'lib/helpers/article-variants';

const ArticleBannerDefault = (props: ArticleBannerProps): JSX.Element => {
  const variant = ARTICLE_VARIANTS.DEFAULT;
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ArticleBanner {...props} variant={variant} />
    </Frame>
  );
};

const ArticleBannerContained = (props: ArticleBannerProps): JSX.Element => {
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ContainedArticleBanner {...props} />
    </Frame>
  );
};

const InsightsBanner = (props: ArticleBannerProps): JSX.Element => {
  const variant = ARTICLE_VARIANTS.INSIGHTS;
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ArticleBanner {...props} variant={variant} />
    </Frame>
  );
};

const NewsBanner = (props: ArticleBannerProps): JSX.Element => {
  const variant = ARTICLE_VARIANTS.NEWS;
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ArticleBanner {...props} variant={variant} />
    </Frame>
  );
};

export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  try {
    const itemPath = await getItemPathString(rendering?.dataSource as string);
    return {
      rendering: { ...rendering, path: itemPath },
    };
  } catch (error) {
    console.error('Error fetching item path:', error);
    return {
      rendering: { ...rendering, data: [] },
      route: layoutData?.sitecore?.route,
    };
  }
};

export const Default = withDatasourceCheck()<ArticleBannerProps>(ArticleBannerDefault);
export const Contained = withDatasourceCheck()<ArticleBannerProps>(ArticleBannerContained);
export const Insights = withDatasourceCheck()<ArticleBannerProps>(InsightsBanner);
export const News = withDatasourceCheck()<ArticleBannerProps>(NewsBanner);
