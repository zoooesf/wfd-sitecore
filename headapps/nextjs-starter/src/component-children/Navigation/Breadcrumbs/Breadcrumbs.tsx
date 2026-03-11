import { LayoutServiceData } from '@sitecore-content-sdk/nextjs';
import { gql } from 'graphql-request';
import Link from 'next/link';
import SubRoutes from './SubRoutes';
import SimplePageTitle from './SimplePageTitle';
import { useRouter } from 'next/router';
import { BreadcrumbPathType } from 'components/Navigation/Breadcrumbs/Breadcrumbs';
import Icon from 'component-children/Shared/Icon/Icon';
import BackButton from './BackButton';
import { getGraphQlClient } from 'lib/graphql-client';
import { cn, getLayoutLanguage } from 'lib/helpers';
import { useTranslation } from 'lib/hooks/useTranslation';

export const BreadCrumbsRendering: React.FC<BreadcrumbsRenderingProps> = ({
  path,
  subRoute,
  pageTitle,
}) => {
  const router = useRouter();
  // Wait for router to be ready
  if (!router.isReady || path.length === 0) return null;

  return (
    <>
      <div
        data-component="Breadcrumbs"
        className="copy-xs mx-auto flex min-h-10 w-full flex-wrap items-center gap-1 py-2"
      >
        <HomeButton />
        <BackButton subRoute={subRoute} />
        <CaretIcon />
        {path.length > 1 ? (
          <SubRoutes subRoute={subRoute} pageTitle={pageTitle} />
        ) : (
          <SimplePageTitle heading={pageTitle} />
        )}
      </div>
    </>
  );
};

const HomeButton = () => {
  const { t } = useTranslation();

  return (
    <Link
      className={cn(
        'hidden items-center justify-center text-content transition',
        'hover:underline',
        'md:flex'
      )}
      aria-label={t('Home')}
      href="/"
    >
      <Icon
        className={cn('block h-3 w-3', 'md:hidden')}
        color="text-content"
        prefix="fas"
        icon="angle-left"
      />
      <span>{t('Home')}</span>
    </Link>
  );
};

export const CaretIcon = () => (
  <Icon
    className={cn('hidden h-3 w-3', 'md:block')}
    color="text-content"
    prefix="fas"
    icon="angle-right"
  />
);

export const getPagePathList = async (
  layoutData: LayoutServiceData
): Promise<BreadcrumbItem | null> => {
  const dataSource = layoutData?.sitecore?.route?.itemId;
  const language = getLayoutLanguage(layoutData);
  const path = layoutData?.sitecore?.context?.itemPath as string;

  if (!dataSource || !path) {
    console.warn('Missing required data for breadcrumb generation');
    return null;
  }

  const graphQLClient = getGraphQlClient();

  if (path === '/' || path.split('/').length <= 2) return null;

  const parentString = Array(path.split('/').length - 2)
    .fill(null)
    .reduce(
      (acc) => `
        parent {
          name
          displayName
          ${acc}
        }
      `,
      ''
    );

  // This query cannot be extracted to a static graphql-documents file because the query
  // structure itself is dynamic (nested `parent` depth varies by page depth).
  // GraphQL variables can only substitute values, not query structure.
  const query = gql`
    query {
      item(path: "${dataSource}", language: "${language}") {
        id
        name
        displayName
        ${parentString}
      }
    }
  `;

  return await graphQLClient
    .request(query)
    .then((response: BreadcrumbsResponseType) => response.item);
};

type BreadcrumbItem = {
  id: string;
  name: string;
  displayName: string;
  parent?: BreadcrumbItem;
};

type BreadcrumbsResponseType = {
  item: BreadcrumbItem;
};

type BreadcrumbsRenderingProps = {
  subRoute: BreadcrumbPathType[];
  path: string[];
  pageTitle: string;
};

export default BreadCrumbsRendering;
