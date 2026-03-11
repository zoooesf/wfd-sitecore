import { useState, useEffect } from 'react';
import { ComponentProps } from 'lib/component-props';
import { LinkGQLProps } from 'lib/types';
import {
  ComponentRendering,
  Field,
  GetComponentServerProps,
  Image,
  ImageField,
  LinkField,
  Placeholder,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import ButtonIcon from 'component-children/Shared/Button/ButtonIcon';
import { AccordionMotion } from 'component-children/Shared/Animation/AccordionMotion';
import { HEADER_CHILD_ID, HEADER_LINK_GROUP_ID, HEADER_LINK_ID } from 'lib/graphql/id';
import Link from 'next/link';
import { cn, placeholderGenerator } from 'lib/helpers';
import { PageList } from 'component-children/Navigation/Header/PageList';
import { usePathname } from 'next/navigation';
import { SearchModal } from 'component-children/Search/SearchModal';
import { getGraphQlClient } from 'lib/graphql-client';
import { GetHeaderNavigation, GetItemById } from 'graphql/generated/graphql-documents';
import { useTranslation } from 'lib/hooks/useTranslation';
import { SEARCH_CONFIG } from 'lib/const/search-const';
import { FrameProvider } from 'lib/hooks/useFrame';
import { getLayoutLanguage } from 'lib/helpers';
import { mainLanguage } from 'lib/i18n/i18n-config';

const HeaderDefault: React.FC<HeaderProps> = ({ rendering, params, fields }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const tertiaryNavPlaceholderName = placeholderGenerator(params, 'tertiarynav');
  const { t } = useTranslation();

  // Hide search button on search results pages
  // On the server (SSG/ISR), pathname="/_site_<site name>/path/to/the/page"
  // On the client, pathname="/path/to/the/page"
  // To prevent hydration errors, remove leading slash and _site_<site name>/ prefix if present
  const trimmedPath = pathname?.replace(/^\//, '').replace(/^_site_[^/]+\//, '');
  const isSearchResultsPage = trimmedPath === SEARCH_CONFIG.searchPageUrl;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Get datasource name for data-source-name attribute (use fetched item name, fallback to GUID)
  const datasourceName =
    (rendering as ComponentRendering & { itemName?: string }).itemName ||
    rendering.dataSource ||
    rendering.uid;

  // Check if Demo field is checked to hide component (with safe access)
  const isDemoHidden =
    fields?.demo?.value === '1' || fields?.demo?.value === true || fields?.demo?.value === 'true';

  return (
    <>
      <div className={cn('hidden', 'lg:block')} role="navigation" aria-label="Tertiary navigation">
        <Placeholder name={tertiaryNavPlaceholderName} rendering={rendering} />
      </div>
      <FrameProvider params={{ Styles: 'theme:secondary' }}>
        <div
          data-component="Header"
          data-source-name={datasourceName}
          className={cn(
            'secondary relative z-40 w-full border-b border-content/20 bg-surface px-0 text-content',
            'lg:px-16',
            isDemoHidden && 'hidden'
          )}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="relative m-auto w-full max-w-outer-content bg-surface">
            <div
              className={cn(
                'flex w-full flex-row items-stretch justify-between px-8 py-6',
                'lg:justify-start lg:gap-6 lg:px-0'
              )}
            >
              <div className={cn('flex items-center justify-center', 'lg:hidden')}>
                <ButtonIcon
                  className={cn('text-content', 'lg:hidden')}
                  iconPrefix="fas"
                  icon={isMobileMenuOpen ? 'xmark' : 'bars'}
                  label={isMobileMenuOpen ? t('Close') : t('Open')}
                  onClick={() => {
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                    setIsSearchOpen(false); // Close search modal when hamburger opens
                  }}
                  variant="white"
                />
              </div>
              <div className={cn('ml-auto mr-auto flex', 'lg:ml-0')}>
                <Link href="/" aria-label={t('Home')} data-id="headerLogo">
                  <Image className={cn('h-6 w-auto invert', 'lg:h-8')} field={fields?.logo} />
                </Link>
              </div>
              {/* Desktop Mega Menu */}
              <PageList rendering={rendering} />
              {!isSearchResultsPage && (
                <div className="flex items-center justify-center">
                  {/* if mobile menu is open, hide the search button */}
                  <ButtonIcon
                    iconPrefix="fas"
                    icon="magnifying-glass"
                    label={t('Search')}
                    onClick={
                      isMobileMenuOpen
                        ? undefined
                        : () => {
                            setIsSearchOpen(true);
                            setIsMobileMenuOpen(false);
                          }
                    }
                    className={isMobileMenuOpen ? 'invisible' : ''}
                    variant="white"
                  />
                </div>
              )}
            </div>
            {/* Mobile Navigation */}
            <AccordionMotion isOpen={isMobileMenuOpen}>
              <div className="h-[calc(100vh-88px)] w-full overflow-y-auto sm:h-[calc(100vh-128px)] lg:hidden">
                <PageList className="flex flex-col" rendering={rendering} isMobile />
                <Placeholder name={tertiaryNavPlaceholderName} rendering={rendering} />
              </div>
            </AccordionMotion>
          </div>
        </div>
      </FrameProvider>
      {!isSearchResultsPage && (
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  );
};

export type HeaderRenderingProps = {
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

type HeaderProps = ComponentProps &
  HeaderRenderingProps & {
    fields: {
      searchLink: LinkField;
      logo: ImageField;
      demo?: Field<string | boolean>;
    };
  };

export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  const graphQLClient = getGraphQlClient();
  const language = getLayoutLanguage(layoutData);
  // Fetch navigation data
  const data = rendering.dataSource
    ? await graphQLClient.request(GetHeaderNavigation.loc?.source.body || '', {
        datasourcePath: rendering.dataSource,
        linkTemplateId: HEADER_LINK_ID,
        childTemplateId: HEADER_CHILD_ID,
        linkGroupTemplateId: HEADER_LINK_GROUP_ID,
        language: language,
      })
    : null;

  // Fetch item name for data-source-name attribute
  let itemName = null;
  if (rendering.dataSource && GetItemById.loc?.source.body) {
    try {
      const itemData = await graphQLClient.request(GetItemById.loc.source.body, {
        itemId: rendering.dataSource,
        language: mainLanguage,
      });
      itemName = (itemData as { item?: { name?: string } })?.item?.name || null;
    } catch (error) {
      console.error('Error fetching item name for header:', rendering.dataSource, error);
    }
  }

  return {
    rendering: {
      ...rendering,
      data,
      itemName, // Add the item name to the rendering object
    },
  };
};

export const Default = withDatasourceCheck()<HeaderProps>(HeaderDefault);
