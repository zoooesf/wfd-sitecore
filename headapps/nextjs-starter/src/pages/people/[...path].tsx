import { useEffect, JSX } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import {
  SitecoreProvider,
  ComponentPropsContext,
  SitecorePageProps,
  StaticPath,
} from '@sitecore-content-sdk/nextjs';
import { extractPath, handleEditorFastRefresh } from '@sitecore-content-sdk/nextjs/utils';
import client from 'lib/sitecore-client';
import components from '.sitecore/component-map';
import scConfig from 'sitecore.config';
import { PersonContext } from 'lib/contexts/person-context';
import { getGraphQlClient } from 'lib/graphql-client';
import { GetProfileBySlug, GetProfileBySlugAdditional } from 'graphql/generated/graphql-documents';
import {
  ProfileGQL,
  AchievementItem,
  EducationItem,
  InvolvementItem,
} from 'lib/types/page/profile';
import { PROFILE_TEMPLATE_ID, INSIGHTS_TEMPLATE_ID } from 'lib/graphql/id';
import { contentRootIdNullChecker, fetchSiteRootInfo, getPageSiteName } from 'lib/helpers';
import {
  getEventListingWithDetails,
  filterEventsByPerson,
} from 'lib/helpers/listing/event-listing';
import { getArticlesByVariant, filterArticlesByPerson } from 'lib/helpers/listing/article-listing';
import { ARTICLE_VARIANTS } from 'lib/helpers/article-variants';

// Type definition for the GraphQL query result
interface ProfileSearchResult {
  search: {
    results: ProfileGQL[];
  };
}

type PersonPageProps = SitecorePageProps & {
  person?: ProfileGQL | null;
  originalPath?: string[];
};

const SitecorePage = ({ page, notFound, componentProps, person }: PersonPageProps): JSX.Element => {
  useEffect(() => {
    // Since Sitecore Editor does not support Fast Refresh, need to refresh editor chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);

  if (notFound || !page) {
    // Shouldn't hit this (as long as 'notFound' is being returned below), but just to be safe
    return <NotFound />;
  }

  // We need to modify the layout data to inject our custom title
  // This ensures the Metadata component in the Layout will use our title
  if (page?.layout?.sitecore?.route?.fields) {
    // Create a heading field with the profile name
    page.layout.sitecore.route.fields.heading = {
      value: person?.displayName || person?.name || 'Person',
    };
  }

  return (
    <PersonContext.Provider value={person || null}>
      <ComponentPropsContext value={componentProps || {}}>
        <SitecoreProvider componentMap={components} api={scConfig.api} page={page}>
          <Layout page={page} />
        </SitecoreProvider>
      </ComponentPropsContext>
    </PersonContext.Provider>
  );
};

// This function gets called at build and export time to determine
// pages for SSG ("paths", as tokenized array).
export const getStaticPaths: GetStaticPaths = async () => {
  const paths: StaticPath[] = [];
  const fallback: boolean | 'blocking' = 'blocking';

  return {
    paths,
    fallback,
  };
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation (or fallback) is enabled and a new request comes in.
export const getStaticProps: GetStaticProps = async (context) => {
  let props = {};
  let page;
  const { params } = context;
  // Get the language from context
  const language = context.locale || 'en';

  // If no params or in preview mode, use standard processing
  if (!params?.path || context.preview) {
    const path = extractPath(context);
    page = context.preview
      ? await client.getPreview(context.previewData)
      : await client.getPage(path, { locale: language });

    if (page) {
      props = {
        page,
        dictionary: await client.getDictionary({
          site: page.siteName,
          locale: page.locale,
        }),
        componentProps: await client.getComponentData(page.layout, context, components),
      };
    }
    return {
      props,
      revalidate: 5, // In seconds
      notFound: !page,
    };
  }

  // Create GraphQL client and fetch profile data
  const graphQLClient = getGraphQlClient();

  // Get the site
  const homePage = await client.getPage('/', { locale: language });
  if (!homePage) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
      revalidate: 5, // In seconds
    };
  }
  const siteName = getPageSiteName(homePage);

  const { contentRoot } = await fetchSiteRootInfo(siteName, language, graphQLClient);
  const contentRootId = contentRootIdNullChecker(contentRoot?.id);

  // Store the original path for potential use in components
  const originalPath = [...(params.path as string[])];

  // Extract the slug (last segment of the path)
  const slug = originalPath[originalPath.length - 1];
  // Transform slug (e.g., "anna-example") to proper name format (e.g., "Anna Example")
  const profileName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Fetch the profile by slug
  let profile = null;
  const profileResult = await graphQLClient.request(GetProfileBySlug.loc?.source.body || '', {
    language,
    templateId: PROFILE_TEMPLATE_ID,
    name: profileName,
    path: contentRootId,
  });
  const typedResult = profileResult as ProfileSearchResult;

  // Additional query for profile as the main query won't allow more than 15 levels of depth
  const profileResultAdditonal = await graphQLClient.request(
    GetProfileBySlugAdditional.loc?.source.body || '',
    {
      language,
      templateId: PROFILE_TEMPLATE_ID,
      name: profileName,
      path: contentRootId,
    }
  );
  const typedResultAdditonal = profileResultAdditonal as ProfileSearchResult;

  // Combine results from both queries
  const mainProfile = typedResult?.search?.results?.[0] || null;
  const additionalProfile = typedResultAdditonal?.search?.results?.[0] || null;
  profile = mainProfile
    ? {
        ...mainProfile,
        ...additionalProfile,
      }
    : null;

  // If no profile found, redirect to the custom 404 page
  if (!profile) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
      revalidate: 5, // In seconds
    };
  }

  // Process children folders to extract achievements, education, and involvements
  if (profile.children?.results) {
    const achievementsFolder = profile.children.results.find(
      (folder: { name: string }) => folder.name === 'Achievements'
    );
    const educationFolder = profile.children.results.find(
      (folder: { name: string }) => folder.name === 'Education'
    );
    const involvementsFolder = profile.children.results.find(
      (folder: { name: string }) => folder.name === 'Involvements'
    );

    profile.achievements = (achievementsFolder?.children?.results as AchievementItem[]) || [];
    profile.education = (educationFolder?.children?.results as EducationItem[]) || [];
    profile.involvements = (involvementsFolder?.children?.results as InvolvementItem[]) || [];
  }

  // Fetch events and articles for the person
  // Fetch all events
  const eventListingData = await getEventListingWithDetails(contentRootId, language);

  // Fetch all insights articles
  const articlesList = await getArticlesByVariant(
    ARTICLE_VARIANTS.INSIGHTS,
    language,
    contentRootId,
    { INSIGHTS_TEMPLATE_ID }
  );

  // Filter events and articles for that person
  const personName = `${profile.firstName.value} ${profile.lastName.value}`.trim();
  const filteredEvents = filterEventsByPerson(eventListingData.results, personName);
  const filteredArticles = filterArticlesByPerson(articlesList, personName);

  // Add filtered events and articles to profile
  profile.events = filteredEvents;
  profile.articles = filteredArticles;

  // Modify the path to point to the wildcard item
  params.path = ['people', ',-w-,'];

  // Get the page with the modified path (pointing to wildcard item)
  page = await client.getPage(params.path, { locale: language });

  if (page) {
    props = {
      page,
      dictionary: await client.getDictionary({
        site: page.siteName,
        locale: page.locale,
      }),
      componentProps: await client.getComponentData(page.layout, context, components),
      // Pass the original path and profile data as additional props
      originalPath,
      person: profile,
    };
  }
  return {
    props,
    revalidate: 5, // In seconds
    notFound: !page,
  };
};

export default SitecorePage;
