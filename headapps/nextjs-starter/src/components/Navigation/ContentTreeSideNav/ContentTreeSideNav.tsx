import Link from 'next/link';
import { ComponentProps } from 'lib/component-props';
import { ComponentRendering, GetComponentServerProps } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import { getGraphQlClient } from 'lib/graphql-client';
import { cn } from 'lib/helpers/classname';
import { GetContentTreeNavigation } from 'graphql/generated/graphql-documents';
import { getLayoutLanguage } from 'lib/helpers';
import { useFrame } from 'lib/hooks/useFrame';

export const Default: React.FC<ContentTreeSideNavProps> = (props) => {
  return (
    <Frame params={props.params}>
      <ContentTreeSideNavRendering {...props} />
    </Frame>
  );
};

const ContentTreeSideNavRendering: React.FC<ContentTreeSideNavProps> = ({ rendering }) => {
  const { effectiveTheme } = useFrame();
  const currentPage = rendering?.data?.item;
  const childPages = currentPage?.children?.results || [];
  const parent = currentPage?.parent;
  const siblingPages = parent?.children?.results || [];

  if (!currentPage) {
    return null;
  }

  const themeClasses = cn(
    'ml-auto mt-10 w-full max-w-xs rounded-lg border border-surface bg-surface p-8',
    effectiveTheme
  );

  return (
    <div data-component="ContentTreeSideNav" className={themeClasses}>
      <nav className="flex flex-col gap-4">
        <Link
          href={parent?.url?.path || '#'}
          className="bg-accent/75 rounded-md p-4 text-start font-bold text-content hover:underline"
        >
          {parent?.displayName}
        </Link>
        <div className="flex flex-col gap-3 pl-6">
          {siblingPages.map((page) => (
            <div key={page.id}>
              <TreeNavItem page={page} isCurrentPage={page.id === currentPage.id} />
              {page.id === currentPage.id && childPages.length > 0 && (
                <div className="mt-3 pl-6">
                  {childPages.map((childPage) => (
                    <TreeNavItem key={childPage.id} page={childPage} isCurrentPage={false} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

const TreeNavItem: React.FC<Omit<TreeNavItemProps, 'variant'>> = ({ page, isCurrentPage }) => {
  if (!page.url?.path) return null;

  return (
    <div className="mb-4 flex flex-col">
      {isCurrentPage ? (
        <span className="font-bold text-content">{page.displayName}</span>
      ) : (
        <Link
          href={page.url.path}
          className="flex text-left text-content duration-200 hover:underline"
        >
          {page.displayName}
        </Link>
      )}
    </div>
  );
};

type TreePageType = {
  id: string;
  name: string;
  displayName: string;
  url?: {
    path: string;
  };
};

type ContentTreeSideNavProps = ComponentProps & {
  rendering: ComponentRendering & {
    data?: {
      item?: TreePageType & {
        children?: {
          results: TreePageType[];
        };
        parent?: TreePageType & {
          children: {
            results: TreePageType[];
          };
        };
      };
    };
  };
};

type TreeNavItemProps = {
  page: TreePageType;
  isCurrentPage: boolean;
};

export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  const pageID = layoutData?.sitecore?.route?.itemId;
  const language = getLayoutLanguage(layoutData);
  const graphQLClient = getGraphQlClient();
  const BASE_PAGE_ID = '{F34E99C9-9782-4E4B-AA95-9FF88394F3F2}';

  try {
    const data = await graphQLClient.request(GetContentTreeNavigation.loc?.source.body || '', {
      pageID,
      language,
      templateId: BASE_PAGE_ID,
    });
    return {
      rendering: { ...rendering, data },
      route: layoutData?.sitecore?.route,
    };
  } catch (error) {
    console.error('Error fetching content tree navigation data:', error);
    return { rendering };
  }
};
