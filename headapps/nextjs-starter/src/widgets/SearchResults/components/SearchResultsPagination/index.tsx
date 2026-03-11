import { cn } from 'lib/helpers/classname';
import { useTranslation } from 'lib/hooks/useTranslation';
import { SearchPagination } from '../SearchPagination/CustomSearchPagination';
import ResultsPerPage from '../ResultsPerPage';
import { GlobalSearchProps } from 'lib/types/components/Search/global-search';

export type SearchResultsPaginationProps = {
  currentPage: number;
  totalPages: number;
  itemsPerPage?: number;
  pageSizeText?: string;
  PageSizeCount?: number;
  className?: string;
  showResultsPerPage?: boolean;
};

/**
 * Reusable pagination component that combines SearchPagination and ResultsPerPage
 * Used across all search widgets for consistent pagination UI
 */
export const SearchResultsPagination: React.FC<SearchResultsPaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage = 10,
  pageSizeText,
  PageSizeCount = 10,
  className,
  showResultsPerPage = true,
}) => {
  const { t } = useTranslation();

  // Convert PageSizeCount to GlobalSearchProps format for ResultsPerPage component
  const globalSearchFields: GlobalSearchProps = {
    fields: {
      PageSizeCount: {
        value: PageSizeCount,
      },
    },
  } as GlobalSearchProps;

  const displayPageSizeText = pageSizeText || t('Results Per Page');

  return (
    <div
      className={cn('flex w-full flex-col items-center justify-between md:flex-row', className)}
      data-component="SearchResultsPagination"
    >
      <SearchPagination
        currentPage={currentPage}
        totalPages={totalPages}
        className="order-2 md:order-1"
      />
      {showResultsPerPage && (
        <ResultsPerPage
          defaultItemsPerPage={itemsPerPage}
          pageSizeText={displayPageSizeText}
          globalSearchFields={globalSearchFields}
          className="order-1 flex w-full items-center justify-between gap-1 md:order-2 md:w-auto"
        />
      )}
    </div>
  );
};

export default SearchResultsPagination;
