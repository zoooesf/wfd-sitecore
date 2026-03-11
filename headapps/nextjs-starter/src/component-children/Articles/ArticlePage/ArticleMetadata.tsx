import Head from 'next/head';
import { ArticleRouteFieldsType } from 'lib/types';
import { getPageCategories } from 'lib/helpers';

export const ArticleMetadata: React.FC<ArticleMetadataProps> = ({ routeFields }) => {
  const { profiles, pageCategory } = routeFields;

  const profilesText = Array.isArray(profiles)
    ? profiles
        .map((profile) =>
          (profile?.fields?.firstName?.value + ' ' + profile?.fields?.lastName?.value).trim()
        )
        .join(', ')
    : '';

  // Add category data processing
  const categoryData = getPageCategories(pageCategory);
  const categoryText = Array.isArray(categoryData)
    ? categoryData
        .map((item) => item.fields?.pageCategory?.value)
        .filter(Boolean)
        .join(', ')
    : '';

  return (
    <Head>
      {profilesText && <meta property="article:profiles" content={profilesText} />}
      {categoryText && <meta property="article:category" content={categoryText} />}
    </Head>
  );
};

type ArticleMetadataProps = {
  routeFields: ArticleRouteFieldsType;
};

// Variant wrapper components for easy usage - content mostly identical for now
export const NewsMetadata: React.FC<ArticleMetadataProps> = ({ routeFields }) => {
  const { profiles, pageCategory } = routeFields;

  const profilesText = Array.isArray(profiles)
    ? profiles
        .map(
          (profile) =>
            profile?.displayName ||
            (profile?.fields?.firstName?.value + ' ' + profile?.fields?.lastName?.value).trim()
        )
        .join(', ')
    : '';

  // Add category data processing
  const categoryData = getPageCategories(pageCategory);
  const categoryText = Array.isArray(categoryData)
    ? categoryData
        .map((item) => item.fields?.pageCategory?.value)
        .filter(Boolean)
        .join(', ')
    : '';

  return (
    <Head>
      {profilesText && <meta property="article:profiles" content={profilesText} />}
      {categoryText && <meta property="article:category" content={categoryText} />}
    </Head>
  );
};

export const InsightsMetadata: React.FC<ArticleMetadataProps> = ({ routeFields }) => {
  const { profiles, pageCategory } = routeFields;

  const profilesText = Array.isArray(profiles)
    ? profiles
        .map(
          (profile) =>
            profile?.displayName ||
            (profile?.fields?.firstName?.value + ' ' + profile?.fields?.lastName?.value).trim()
        )
        .join(', ')
    : '';

  // Add category data processing
  const categoryData = getPageCategories(pageCategory);
  const categoryText = Array.isArray(categoryData)
    ? categoryData
        .map((item) => item.fields?.pageCategory?.value)
        .filter(Boolean)
        .join(', ')
    : '';

  return (
    <Head>
      {profilesText && <meta property="article:profiles" content={profilesText} />}
      {categoryText && <meta property="article:category" content={categoryText} />}
    </Head>
  );
};
