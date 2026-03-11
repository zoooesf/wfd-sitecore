import { withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import { ARTICLE_VARIANTS } from 'lib/helpers/article-variants';
import ArticleFooter, {
  ArticleFooterProps,
} from 'component-children/Articles/ArticleFooter/ArticleFooter';

const ArticleFooterDefault: React.FC<ArticleFooterProps> = (props) => {
  const variant = ARTICLE_VARIANTS.DEFAULT;
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ArticleFooter {...props} variant={variant} />
    </Frame>
  );
};

// Insights variant
const InsightsArticleFooter: React.FC<ArticleFooterProps> = (props) => {
  const variant = ARTICLE_VARIANTS.INSIGHTS;
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ArticleFooter {...props} variant={variant} />
    </Frame>
  );
};

// News variant
const NewsArticleFooter: React.FC<ArticleFooterProps> = (props) => {
  const variant = ARTICLE_VARIANTS.NEWS;
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ArticleFooter {...props} variant={variant} />
    </Frame>
  );
};

export const Default = withDatasourceCheck()<ArticleFooterProps>(ArticleFooterDefault);
export const Insights = withDatasourceCheck()<ArticleFooterProps>(InsightsArticleFooter);
export const News = withDatasourceCheck()<ArticleFooterProps>(NewsArticleFooter);
