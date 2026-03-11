import {
  Field,
  RichText,
  Text,
  useSitecore,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import { ComponentProps } from 'lib/component-props';
import { getLocalizedFormattedDate, isNullishDateTime } from 'lib/helpers/time-date-helper';
import { ArticleRouteFieldsType } from 'lib/types';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { SocialShare } from 'component-children/Shared/SocialShare/SocialShare';
import {
  NewsMetadata,
  InsightsMetadata,
  ArticleMetadata,
} from 'component-children/Articles/ArticlePage/ArticleMetadata';
import { getPageCategories } from 'lib/helpers/page-category';
import { ARTICLE_VARIANTS, ArticleVariant } from 'lib/helpers/article-variants';
import { mainLanguage } from 'lib/i18n/i18n-config';
import { useFrame } from 'lib/hooks/useFrame';
const ArticleHeaderDefault: React.FC<ArticleHeaderProps> = (props) => {
  const variant = ARTICLE_VARIANTS.DEFAULT;
  const { page } = useSitecore();
  const routeFields = page?.layout?.sitecore?.route?.fields as unknown as ArticleRouteFieldsType;

  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <ArticleMetadata routeFields={routeFields} />
      <ArticleHeader {...props} variant={variant} />
    </Frame>
  );
};

// Insights variant
const InsightsArticleHeader: React.FC<ArticleHeaderProps> = (props) => {
  const variant = ARTICLE_VARIANTS.INSIGHTS;
  const { page } = useSitecore();
  const routeFields = page?.layout?.sitecore?.route?.fields as unknown as ArticleRouteFieldsType;

  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <InsightsMetadata routeFields={routeFields} />
      <ArticleHeader {...props} variant={variant} />
    </Frame>
  );
};

// News variant
const NewsArticleHeader: React.FC<ArticleHeaderProps> = (props) => {
  const variant = ARTICLE_VARIANTS.NEWS;
  const { page } = useSitecore();
  const routeFields = page?.layout?.sitecore?.route?.fields as unknown as ArticleRouteFieldsType;

  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <NewsMetadata routeFields={routeFields} />
      <ArticleHeader {...props} variant={variant} />
    </Frame>
  );
};

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ variant }) => {
  const { page } = useSitecore();
  const { effectiveTheme } = useFrame();
  const routeFields = page?.layout?.sitecore?.route?.fields as unknown as ArticleRouteFieldsType;

  const { heading, subheading, pageCategory, datePublished, displayDateTime } = routeFields;

  const categoryData = getPageCategories(pageCategory);
  const category = categoryData?.[0]?.fields?.pageCategory;

  return (
    <ContainedWrapper theme={effectiveTheme} className="pb-13">
      <div
        data-component="ArticleHeader"
        data-variant={variant || ARTICLE_VARIANTS.DEFAULT}
        data-theme={effectiveTheme}
        className="relative flex w-full flex-col gap-2 border-b border-content/20 bg-surface py-lg pb-sm"
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Text
              editable={false}
              field={category}
              tag="p"
              className="heading-base uppercase text-content"
            />
            <DateSection
              variant={variant}
              datePublished={datePublished}
              locale={page?.locale}
              newsDisplayDateTime={displayDateTime as Field<string>}
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 lg:flex-1 lg:pr-16">
            <Text className="heading-4xl text-content" field={heading} tag="h1" />
            <RichText className="richtext text-content" field={subheading} />
          </div>
          <div className="mt-4 flex justify-end lg:mt-0">
            <SocialShare />
          </div>
        </div>
      </div>
    </ContainedWrapper>
  );
};

const DateSection: React.FC<DateSectionProps> = ({
  variant,
  datePublished,
  locale = mainLanguage,
  newsDisplayDateTime,
}) => {
  const showTime = variant === ARTICLE_VARIANTS.NEWS;
  const newsDate = isNullishDateTime(newsDisplayDateTime?.value)
    ? datePublished?.value
    : newsDisplayDateTime?.value;

  const dateTime = variant === ARTICLE_VARIANTS.NEWS ? newsDate : datePublished?.value;
  if (!dateTime) return null;

  const formattedDate = getLocalizedFormattedDate(dateTime || '', locale || mainLanguage, showTime);
  if (!formattedDate) return null;

  return <p className="copy-base text-content">{formattedDate}</p>;
};

type ArticleHeaderProps = ComponentProps & {
  variant?: ArticleVariant;
};

type DateSectionProps = {
  variant?: ArticleVariant;
  datePublished: Field<string> | undefined;
  newsDisplayDateTime: Field<string> | undefined;
  locale?: string;
};

export const Default = withDatasourceCheck()<ArticleHeaderProps>(ArticleHeaderDefault);
export const Insights = withDatasourceCheck()<ArticleHeaderProps>(InsightsArticleHeader);
export const News = withDatasourceCheck()<ArticleHeaderProps>(NewsArticleHeader);
