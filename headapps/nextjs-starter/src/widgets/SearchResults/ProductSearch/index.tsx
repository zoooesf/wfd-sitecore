import React from 'react';
import type {
  SearchResponseFacet,
  SearchResponseSortChoice,
  SearchResultsInitialState,
} from '@sitecore-search/react';
import {
  FilterAnd,
  FilterEqual,
  WidgetDataType,
  useSearchResults,
  widget,
} from '@sitecore-search/react';

import ProductCard from '../components/ProductCard';
import Filters from '../components/Filter';
import SearchFacets from '../components/SearchFacets';
import { SearchResultsPagination } from '../components/SearchResultsPagination';
import { SearchResultsToolbar } from '../components/SearchResultsToolbar';
import { useTranslation } from 'lib/hooks/useTranslation';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { useFrame } from 'lib/hooks/useFrame';
import { SharedSearchInput } from '../components/SharedSearchInput';
import {
  SearchResultsGlobalStyles,
  SearchResultsContainer,
  ResultListContainer,
  ListLayoutContainer,
  MainLayoutContainer,
  SidebarContainer,
  MainContentContainer,
  NoResultsContainer,
} from './styled';
import { ProductModel, ProductSearchResultsProps } from './types';
import { PageController } from '@sitecore-search/react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import {
  LANGUAGE_ATTRIBUTE_NAME,
  LOCALE_CONFIG,
  SITE_ATTRIBUTE_NAME,
  HIGHLIGHT_FRAGMENT_SIZE,
  DEFAULT_PAGE_SIZE,
  getSitecoreSearchSourceBySite,
} from 'lib/const/search-const';
import { mainLanguage } from 'lib/i18n/i18n-config';
import { removeCurlyBraces } from 'lib/helpers/guid-helpers';
import { PRODUCT_PAGE_TEMPLATE_ID } from 'lib/graphql/id';
import { SearchSkeletonTheme, SearchResultsSkeletonLayout } from '../components/skeletons';
import { SKELETON_ITEMS_CONFIG } from 'lib/const';
import { EditModeClickDisabler } from 'component-children/Shared/Containers/EditModeClickDisabler';

type InitialState = SearchResultsInitialState<
  'itemsPerPage' | 'keyphrase' | 'page' | 'sortType' | 'selectedFacets'
>;

const context = PageController.getContext();

const ProductSearchComponent = ({
  defaultSortType = 'm_relevancy',
  defaultPage = 1,
  defaultKeyphrase = '',
  defaultItemsPerPage = DEFAULT_PAGE_SIZE,
  globalSearchFields,
}: ProductSearchResultsProps) => {
  const { effectiveTheme } = useFrame();
  const { page: sitecorePage } = useSitecore();
  const currentLocale = sitecorePage?.locale || mainLanguage;
  const languageAndCountry = LOCALE_CONFIG[currentLocale] ?? LOCALE_CONFIG['default'];

  const {
    widgetRef,
    actions: { onKeyphraseChange, onItemClick },
    state: { sortType, page, itemsPerPage, keyphrase },
    queryResult: {
      isLoading,
      data: {
        total_item: totalItems = 0,
        sort: { choices: sortChoices = [] } = {},
        facet: facets = [],
        content: productItems = [],
      } = {},
    },
  } = useSearchResults<ProductModel, InitialState>({
    query: (query) => {
      context.setLocaleLanguage(languageAndCountry.language);
      context.setLocaleCountry(languageAndCountry.country);

      const allFilters = [];

      const lang = sitecorePage?.locale;
      const languageFilter = new FilterEqual(LANGUAGE_ATTRIBUTE_NAME, lang);
      allFilters.push(languageFilter);

      const siteName = sitecorePage?.siteName;
      const siteFilter = new FilterEqual(SITE_ATTRIBUTE_NAME, siteName);
      allFilters.push(siteFilter);
      const templateIdFilter = new FilterEqual(
        'm_templateid',
        removeCurlyBraces(PRODUCT_PAGE_TEMPLATE_ID).toLowerCase()
      );
      allFilters.push(templateIdFilter);
      query
        .getRequest()
        .setSearchFilter(new FilterAnd(allFilters))
        .setSources([getSitecoreSearchSourceBySite(sitecorePage?.siteName as string)])
        .setSearchQueryHighlightFragmentSize(HIGHLIGHT_FRAGMENT_SIZE)
        .setSearchQueryHighlightFields(['description'])
        .setSearchQueryHighlightPreTag('<mark>')
        .setSearchQueryHighlightPostTag('</mark>');
    },
    state: {
      sortType: defaultSortType,
      page: defaultPage,
      itemsPerPage: defaultItemsPerPage,
      keyphrase: defaultKeyphrase,
      selectedFacets: [],
    },
  });
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <ContainedWrapper theme={effectiveTheme}>
      <SearchResultsGlobalStyles />
      <SearchResultsContainer ref={widgetRef} data-component="ProductSearchResults">
        {isLoading ? (
          <SearchSkeletonTheme>
            <SearchResultsSkeletonLayout
              itemsPerPage={SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE}
              showSidebar={true}
              gridCols="grid-cols-1"
              horizontalBreakpoint="sm"
              showImage={true}
            />
          </SearchSkeletonTheme>
        ) : (
          <EditModeClickDisabler>
            <SearchResultsGrid
              productItems={productItems}
              facets={facets}
              page={page}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              sortChoices={sortChoices}
              sortType={sortType}
              totalPages={totalPages}
              defaultItemsPerPage={defaultItemsPerPage}
              onItemClick={onItemClick}
              globalSearchFields={globalSearchFields}
              onKeyphraseChange={onKeyphraseChange}
              keyphrase={keyphrase}
            />
          </EditModeClickDisabler>
        )}
      </SearchResultsContainer>
    </ContainedWrapper>
  );
};

const SearchResultsGrid: React.FC<SearchResultsGridProps> = ({
  productItems,
  facets,
  page,
  itemsPerPage,
  totalItems,
  sortChoices,
  sortType,
  totalPages,
  onItemClick,
  globalSearchFields,
  onKeyphraseChange,
  keyphrase,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      {/* Sidebar and Main Content Layout */}
      <MainLayoutContainer>
        {/* Left Sidebar - Filters - hidden on mobile */}
        <SidebarContainer>
          <Filters />
          <SearchFacets
            facets={facets as SearchResponseFacet[]}
            expandedAccordions={globalSearchFields?.fields?.facetsToExpand?.value}
          />
        </SidebarContainer>

        {/* Right Content Area */}
        <MainContentContainer>
          {/* Top Controls */}
          <SharedSearchInput
            currentKeyphrase={keyphrase}
            placeholder={t('Search')}
            ariaLabel={t('Search')}
            testId="productSRInput"
            buttonText={t('Search')}
            onKeyphraseChange={onKeyphraseChange}
          />
          {totalItems > 0 && (
            <SearchResultsToolbar
              facets={facets as SearchResponseFacet[]}
              page={page}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              totalItemsReturned={productItems.length}
              sortChoices={sortChoices as SearchResponseSortChoice[]}
              sortType={sortType}
            />
          )}

          {/* Results List */}
          <ResultListContainer data-component="SearchResultsGrid">
            {(productItems.length || 0) <= 0 && (
              <NoResultsContainer>
                <p>{t('SearchNoResults')}</p>
              </NoResultsContainer>
            )}
            <ListLayoutContainer>
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {productItems.map((media, index) => {
                  if (!media) return null;

                  return (
                    <ProductCard
                      product={media}
                      index={index}
                      onItemClick={onItemClick}
                      key={media.id || index}
                    />
                  );
                })}
              </div>
            </ListLayoutContainer>
          </ResultListContainer>

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <SearchResultsPagination
              currentPage={page}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              pageSizeText={t('Results Per Page')}
              PageSizeCount={globalSearchFields?.fields?.PageSizeCount?.value}
            />
          )}
        </MainContentContainer>
      </MainLayoutContainer>
    </div>
  );
};

type SearchResultsGridProps = {
  productItems: ProductModel[];
  facets: Record<string, unknown>[];
  page: number;
  itemsPerPage: number;
  totalItems: number;
  sortChoices: Record<string, unknown>[];
  sortType: string;
  totalPages: number;
  defaultItemsPerPage: number;
  onItemClick: (item: Record<string, unknown>) => void;
  globalSearchFields?: ProductSearchResultsProps['globalSearchFields'];
  onKeyphraseChange: (params: { keyphrase: string }) => void;
  keyphrase?: string;
};

const ProductSearchWidget = widget(
  ProductSearchComponent,
  WidgetDataType.SEARCH_RESULTS,
  'content'
);

export default ProductSearchWidget;
