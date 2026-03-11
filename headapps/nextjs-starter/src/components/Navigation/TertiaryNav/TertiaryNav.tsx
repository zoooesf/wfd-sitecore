import { ComponentProps } from 'lib/component-props';
import Button from 'component-children/Shared/Button/Button';
import { ClassNameProps, LinkGQLProps } from 'lib/types';
import {
  ComponentRendering,
  Field,
  GetComponentServerProps,
  Placeholder,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { getGraphQlClient } from 'lib/graphql-client';
import { GetTertiaryNavigation, GetItemById } from 'graphql/generated/graphql-documents';
import { HEADER_CHILD_ID } from 'lib/graphql/id';
import { cn, getLayoutLanguage, placeholderGenerator } from 'lib/helpers';
import { FrameProvider } from 'lib/hooks/useFrame';
import { mainLanguage } from 'lib/i18n/i18n-config';

const TertiaryNavDefault: React.FC<TertiaryNavProps> = ({ rendering, params, fields }) => {
  // Get datasource name for data-source-name attribute (use fetched item name, fallback to GUID)
  const datasourceName =
    (rendering as ComponentRendering & { itemName?: string }).itemName ||
    rendering.dataSource ||
    rendering.uid;

  // Check if Demo field is checked to hide component
  const isDemoHidden =
    fields?.demo?.value === '1' || fields?.demo?.value === true || fields?.demo?.value === 'true';

  return (
    <FrameProvider params={{ Styles: 'theme:secondary' }}>
      <div
        data-component="TertiaryNav"
        data-source-name={datasourceName}
        className={cn(
          'secondary relative z-50 w-full bg-surface px-0 text-content lg:px-16',
          isDemoHidden && 'hidden'
        )}
      >
        <div className="m-auto flex w-full max-w-outer-content flex-col gap-4 py-2 lg:flex-row lg:justify-end lg:gap-0">
          <NavList rendering={rendering} />
          <Placeholder
            name={placeholderGenerator(params, 'tertiarynavcomponents')}
            rendering={rendering}
            render={(components) =>
              components.length > 0 && (
                <div className="ml-0 flex flex-col items-center gap-3 lg:ml-6 lg:flex-row lg:gap-6">
                  {components}
                </div>
              )
            }
          />
        </div>
      </div>
    </FrameProvider>
  );
};

const NavItem: React.FC<LinkGQLProps & ClassNameProps> = ({ link }) => {
  if (!link?.jsonValue?.value?.href) return <></>;

  return (
    <div
      data-component="NavItem"
      className="flex w-full items-start justify-start bg-surface text-content md:items-center md:justify-center lg:whitespace-nowrap"
    >
      <Button
        link={link?.jsonValue}
        variant="link"
        className="lg:copy-xs copy-sm w-full px-8 py-3 no-underline lg:p-0 lg:text-content/90"
      />
    </div>
  );
};

const NavList: React.FC<NavListProps> = ({
  rendering,
  className = 'flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:gap-6',
}) => {
  const linkListData = rendering?.data?.item?.links?.results;

  return (
    <div data-component="NavList" className={className}>
      {linkListData?.map((navlink, idx) => (
        <NavItem key={idx} {...navlink} />
      ))}
    </div>
  );
};

type TertiaryNavRenderingProps = {
  rendering: ComponentRendering & {
    data?: {
      item?: {
        links?: {
          results?: LinkGQLProps[];
        };
      };
    };
  };
};

type TertiaryNavProps = ComponentProps &
  TertiaryNavRenderingProps & {
    fields?: {
      demo?: Field<string | boolean>;
    };
  };

type NavListProps = TertiaryNavRenderingProps & ClassNameProps;

export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  const language = getLayoutLanguage(layoutData);
  const graphQLClient = getGraphQlClient();

  // Only make the GraphQL request if we have a datasource
  if (!rendering.dataSource) {
    return {
      rendering,
    };
  }

  try {
    const data = await graphQLClient.request(GetTertiaryNavigation.loc?.source.body || '', {
      datasourcePath: rendering.dataSource,
      language,
      templateId: HEADER_CHILD_ID,
    });

    // Fetch item name for data-source-name attribute
    let itemName = null;
    if (rendering.dataSource && GetItemById.loc?.source.body) {
      try {
        const itemData = await graphQLClient.request(GetItemById.loc.source.body, {
          itemId: rendering.dataSource,
          language: language || mainLanguage,
        });
        itemName = (itemData as { item?: { name?: string } })?.item?.name || null;
      } catch (error) {
        console.error('Error fetching item name for tertiary nav:', rendering.dataSource, error);
      }
    }

    return {
      rendering: {
        ...rendering,
        data,
        itemName, // Add the item name to the rendering object
      },
    };
  } catch (error) {
    console.error('Error fetching tertiary navigation data:', error);
    return {
      rendering,
    };
  }
};

export const Default = withDatasourceCheck()<TertiaryNavProps>(TertiaryNavDefault);
