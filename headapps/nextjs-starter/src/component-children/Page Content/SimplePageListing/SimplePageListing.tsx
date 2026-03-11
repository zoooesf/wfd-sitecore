import { useState, useMemo } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { PageDataType } from 'lib/types';
import { ContainedWrapper } from '../../Shared/Containers/ContainedWrapper';
import { Pagination } from 'component-children/Shared/Pagination/Pagination';
import { SimplePageListingProps } from 'lib/types/components/Page Content/simple-page-listing';
import { useContextPageTags } from 'lib/contexts/page-tags-context';
import { hasMatchingTags, TagItem } from 'lib/helpers/merge-page-tags';
import { useFrame } from 'lib/hooks/useFrame';
import { SimplePageListingCard } from './SimplePageListingCard';
import { useTranslation } from 'lib/hooks/useTranslation';
import { getValidPageSize } from 'lib/helpers/page-size';
import { EditModeClickDisabler } from 'component-children/Shared/Containers/EditModeClickDisabler';

const SimplePageListingRendering: React.FC<SimplePageListingProps> = ({ fields, rendering }) => {
  const { effectiveTheme } = useFrame();
  const { pageTags } = useContextPageTags();
  const [filteringFailed, setFilteringFailed] = useState(false);
  const { t } = useTranslation();

  const filterEnabled = useMemo(() => {
    return fields?.filterByTags?.value === true;
  }, [fields?.filterByTags]);

  const filteredPages = useMemo(() => {
    const allPages = (rendering?.data || []) as PageDataType[];
    setFilteringFailed(false);

    if (!filterEnabled || !pageTags.length) {
      return allPages;
    }

    const filteredResults = allPages.filter((page) => {
      if (!page) return false;

      const pageRecord = page as unknown as Record<string, PageDataType>;
      const pageItemTags: TagItem[] = Array.isArray(pageRecord?.sxaTags?.targetItems)
        ? (pageRecord.sxaTags.targetItems as TagItem[])
        : [];

      return hasMatchingTags(pageTags, pageItemTags);
    });

    if (filteredResults.length === 0) {
      setFilteringFailed(true);
      return allPages;
    }

    return filteredResults;
  }, [rendering?.data, filterEnabled, pageTags]);

  return (
    <ContainedWrapper theme={effectiveTheme}>
      <div data-component="SimplePageListing" className="w-full py-10">
        <Text field={fields.heading} tag="h2" className="heading-lg mb-6" />

        {filterEnabled && pageTags.length > 0 && (
          <div className="mb-4 text-sm">
            {fields?.tagsHeading?.value ? (
              <Text field={fields.tagsHeading} tag="span" className="font-semibold" />
            ) : (
              <span className="font-semibold">{t('Filtering by tags:')}</span>
            )}{' '}
            {pageTags.map((tag) => tag.displayName || tag.name).join(', ')}
            {filteringFailed && (
              <div className="mt-2 text-amber-600">
                {fields?.noResultsText?.value ? (
                  <Text field={fields.noResultsText} />
                ) : (
                  <>{t('No results')}</>
                )}
              </div>
            )}
          </div>
        )}

        <EditModeClickDisabler>
          <CardGrid pages={filteredPages} itemsPerPage={fields?.PageSizeCount?.value} />
        </EditModeClickDisabler>
      </div>
    </ContainedWrapper>
  );
};

type CardGridProps = {
  pages: PageDataType[];
  itemsPerPage?: number;
};

const CardGrid: React.FC<CardGridProps> = ({ pages, itemsPerPage: itemsPerPageProp }) => {
  const itemsPerPage = getValidPageSize(itemsPerPageProp);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(pages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = pages.slice(startIndex, startIndex + itemsPerPage);
  return (
    <>
      <div className="flex flex-col gap-4">
        {paginatedResults.map((page, idx) => {
          if (!page) return null;

          return (
            <div key={idx} className="w-full">
              {page.name && <SimplePageListingCard {...page} />}
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination length={totalPages} selected={currentPage} setSelected={setCurrentPage} />
        </div>
      )}
    </>
  );
};

export default SimplePageListingRendering;
