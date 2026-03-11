import { RichText, useSitecore, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import Frame from 'component-children/Shared/Frame/Frame';
import { ComponentProps } from 'lib/component-props';
import { EventRouteFieldsType } from 'lib/types';
import { ARTICLE_VARIANTS } from 'lib/helpers/article-variants';
import { useFrame } from 'lib/hooks/useFrame';
import { cn } from 'lib/helpers/classname';

const ArticleBodyDefault: React.FC<ArticleBodyProps> = (props) => {
  // Default variant
  const variant = ARTICLE_VARIANTS.DEFAULT;
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ArticleBody {...props} variant={variant} />
    </Frame>
  );
};

// Insights variant
const InsightsArticleBody: React.FC<ArticleBodyProps> = (props) => {
  const variant = ARTICLE_VARIANTS.INSIGHTS;
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ArticleBody {...props} variant={variant} />
    </Frame>
  );
};

// News variant
const NewsArticleBody: React.FC<ArticleBodyProps> = (props) => {
  const variant = ARTICLE_VARIANTS.NEWS;
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ArticleBody {...props} variant={variant} />
    </Frame>
  );
};

const ArticleBody: React.FC<ArticleBodyProps> = ({ variant }) => {
  const { page } = useSitecore();
  const { effectiveTheme } = useFrame();
  const routeFields = page?.layout?.sitecore?.route?.fields as unknown as EventRouteFieldsType;
  const { body } = routeFields;

  return (
    <ContainedWrapper>
      <article
        data-component="ArticleBody"
        data-variant={variant || ARTICLE_VARIANTS.DEFAULT}
        data-theme={effectiveTheme}
        className={cn(
          'flex flex-col items-center justify-center gap-4 pb-16 lg:flex-row lg:gap-8',
          effectiveTheme
        )}
      >
        <section className="w-full lg:max-w-4xl">
          <RichText field={body} className="richtext richtext-h1-4xl w-full text-content" />
        </section>
      </article>
    </ContainedWrapper>
  );
};

type ArticleBodyProps = ComponentProps & {
  variant?: string;
};

export const Default = withDatasourceCheck()<ArticleBodyProps>(ArticleBodyDefault);
export const Insights = withDatasourceCheck()<ArticleBodyProps>(InsightsArticleBody);
export const News = withDatasourceCheck()<ArticleBodyProps>(NewsArticleBody);
