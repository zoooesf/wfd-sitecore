import React, { useState, useRef, useEffect } from 'react';
import { ArticleDataType } from 'lib/types';
import { ArticleCard } from 'component-children/Shared/Card/ArticleCard';
import { useTranslation } from 'lib/hooks/useTranslation';
import { getNoResultsMessageByVariant } from 'lib/helpers/listing/article-listing';
import { Pagination } from 'component-children/Shared/Pagination/Pagination';
import { ARTICLE_VARIANTS, ArticleVariant } from 'lib/helpers/article-variants';
import { getValidPageSize } from 'lib/helpers/page-size';

export type ArticleResultsType = {
  results: ArticleDataType[];
  searchRef?: React.RefObject<HTMLDivElement | null>; // Optional - only scrolls when provided
  variant?: ArticleVariant;
  itemsPerPage?: number;
};

const ArticleListGrid: React.FC<ArticleResultsType> = ({
  results,
  searchRef,
  variant = ARTICLE_VARIANTS.DEFAULT,
  itemsPerPage: itemsPerPageProp,
}) => {
  const itemsPerPage = getValidPageSize(itemsPerPageProp);
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const isInitialMount = useRef(true);

  const totalPages = React.useMemo(
    () => Math.ceil(results.length / itemsPerPage),
    [results.length, itemsPerPage]
  );

  const paginatedResults = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return results.slice(startIndex, startIndex + itemsPerPage);
  }, [results, currentPage, itemsPerPage]);

  // Only scroll when searchRef is provided
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only scroll if searchRef was provided
    if (typeof window !== 'undefined' && searchRef?.current) {
      searchRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [currentPage, searchRef]);

  // Add handling for empty results with variant-specific messages
  if (results.length === 0) {
    const dictionaryKey = getNoResultsMessageByVariant(variant);
    return <p className="py-8 text-center">{t(dictionaryKey)}</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-4" data-component="ArticleListGrid">
        {paginatedResults.map((article, index) => {
          if (!article) return null;

          return <ArticleCard key={article.id || index} fields={article} variant={variant} />;
        })}
      </div>
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination length={totalPages} selected={currentPage} setSelected={setCurrentPage} />
        </div>
      )}
    </>
  );
};

export default ArticleListGrid;
