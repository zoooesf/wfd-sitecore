import React, { useCallback, useMemo, JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useSearchResultsActions } from '@sitecore-search/react';
import { cn } from 'lib/helpers/classname';
import { useTranslation } from 'lib/hooks/useTranslation';
import { useFrame } from 'lib/hooks/useFrame';

/**
 * Search Pagination component that combines the design of shared Pagination
 * with the functionality of SearchResults pagination
 */
export const SearchPagination: React.FC<SearchPaginationProps> = ({
  currentPage,
  totalPages,
  className,
  expanded,
}) => {
  const { t } = useTranslation();
  const { effectiveTheme } = useFrame();
  const { onPageNumberChange } = useSearchResultsActions();

  const handlePageChange = useCallback(
    (page: number) => {
      const validatedPage = Math.max(1, Math.min(page, totalPages));
      onPageNumberChange({ page: validatedPage });
    },
    [totalPages, onPageNumberChange]
  );

  return (
    <nav
      data-component="SearchPagination"
      aria-label={t('Pagination')}
      className={cn('z-10 flex gap-1 bg-surface', effectiveTheme, className)}
    >
      <PrevButton active={currentPage} onClick={handlePageChange} />
      <CenterButtonList
        active={currentPage}
        length={totalPages}
        onClick={handlePageChange}
        expanded={expanded}
      />
      <NextButton active={currentPage} length={totalPages} onClick={handlePageChange} />
    </nav>
  );
};

const CenterButtonList: React.FC<ButtonListProps> = ({ active, length, onClick, expanded }) => {
  const pageListProps = useMemo(() => ({ active, length, onClick }), [active, length, onClick]);

  return (
    <div className="flex gap-1">
      {expanded ? (
        <>
          {/* Mobile view when expanded */}
          <div className="flex lg:hidden">
            {length < 4 ? (
              <ExpandedPageList {...pageListProps} />
            ) : (
              <PageButtonList {...pageListProps} />
            )}
          </div>
          {/* Desktop view when expanded */}
          <div className="hidden gap-1 lg:flex">
            <ExpandedPageList {...pageListProps} />
          </div>
        </>
      ) : length < 4 ? (
        /* Non-expanded view (same for mobile and desktop) */
        <ExpandedPageList {...pageListProps} />
      ) : (
        <PageButtonList {...pageListProps} />
      )}
    </div>
  );
};

const PageButtonList: React.FC<ButtonListProps> = ({ active, length, onClick }) => {
  const pageButtons = useMemo(() => {
    const buttons: JSX.Element[] = [];

    // Use smart pagination for all cases with 2 or more pages
    if (length === 1) {
      // Single page: just show [1]
      buttons.push(<PageButton key={1} num={1} active={active} onClick={onClick} />);
    } else if (length === 2) {
      // Two pages: show [1, 2]
      buttons.push(<PageButton key={1} num={1} active={active} onClick={onClick} />);
      buttons.push(<PageButton key={2} num={2} active={active} onClick={onClick} />);
    } else if (length === 3) {
      // Three pages: show all [1, 2, 3]
      buttons.push(<PageButton key={1} num={1} active={active} onClick={onClick} />);
      buttons.push(<PageButton key={2} num={2} active={active} onClick={onClick} />);
      buttons.push(<PageButton key={3} num={3} active={active} onClick={onClick} />);
    } else {
      // For 4+ pages: show [1] [2] [...] [last] format with current page logic
      if (active <= 2) {
        // On page 1 or 2: [1] [2] [...] [last]
        buttons.push(<PageButton key={1} num={1} active={active} onClick={onClick} />);
        buttons.push(<PageButton key={2} num={2} active={active} onClick={onClick} />);
        buttons.push(<EllipsisButton key="ellipsis" />);
        buttons.push(<PageButton key={length} num={length} active={active} onClick={onClick} />);
      } else if (active === length) {
        // On last page: [1] [2] [...] [last]
        buttons.push(<PageButton key={1} num={1} active={active} onClick={onClick} />);
        buttons.push(<PageButton key={2} num={2} active={active} onClick={onClick} />);
        buttons.push(<EllipsisButton key="ellipsis" />);
        buttons.push(<PageButton key={length} num={length} active={active} onClick={onClick} />);
      } else if (active === length - 1) {
        // On second-to-last page: [1] [...] [second-to-last] [last]
        buttons.push(<PageButton key={1} num={1} active={active} onClick={onClick} />);
        buttons.push(<EllipsisButton key="ellipsis" />);
        buttons.push(<PageButton key={active} num={active} active={active} onClick={onClick} />);
        buttons.push(<PageButton key={length} num={length} active={active} onClick={onClick} />);
      } else {
        // On middle page (3 to last-2): [1] [...] [current] [...] [last]
        buttons.push(<PageButton key={1} num={1} active={active} onClick={onClick} />);
        buttons.push(<EllipsisButton key="start-ellipsis" />);
        buttons.push(<PageButton key={active} num={active} active={active} onClick={onClick} />);
        buttons.push(<EllipsisButton key="end-ellipsis" />);
        buttons.push(<PageButton key={length} num={length} active={active} onClick={onClick} />);
      }
    }

    return buttons;
  }, [active, length, onClick]);

  return <>{pageButtons}</>;
};

const ExpandedPageList: React.FC<ButtonListProps> = ({ active, length, onClick }) => {
  const { startPage, endPage } = useMemo(() => {
    let startPage = Math.max(active - halfVisiblePages, 1);
    const endPage = Math.min(startPage + MAX_VISIBLE_PAGES_EXPANDED - 1, length);

    if (endPage - startPage < MAX_VISIBLE_PAGES_EXPANDED - 1) {
      startPage = Math.max(endPage - MAX_VISIBLE_PAGES_EXPANDED + 1, 1);
    }

    return { startPage, endPage };
  }, [active, length]);

  const buttons = useMemo(() => {
    return Array.from({ length: endPage - startPage + 1 }, (_, idx: number) => (
      <PageButton key={idx} num={startPage + idx} active={active} onClick={onClick} />
    ));
  }, [active, endPage, onClick, startPage]);

  return <>{buttons}</>;
};

const PageButton: React.FC<PageButtonProps> = React.memo(({ num, active, onClick }) => {
  const handleClick = useCallback(() => onClick(num), [onClick, num]);
  const { t } = useTranslation();
  const isActive = num === active;

  return (
    <button
      onClick={handleClick}
      className={cn(
        'label-regular flex h-8 w-8 items-center justify-center rounded px-3 text-content duration-300',
        'hover:bg-content hover:text-surface',
        isActive && 'bg-content font-bold text-surface no-underline shadow-sm hover:bg-content/50'
      )}
      aria-label={`${t('Page')} ${num}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {num}
    </button>
  );
});
PageButton.displayName = 'PageButton';

const PrevButton: React.FC<NavButtonProps> = React.memo(({ active, onClick }) => {
  const startPageActive = active === 1;
  const handleClick = useCallback(() => onClick(active - 1), [onClick, active]);
  const { t } = useTranslation();

  return (
    <button
      onClick={handleClick}
      className={cn(
        'label-regular flex h-8 items-center justify-center rounded bg-surface px-3 text-content duration-300',
        'mr-3 w-24 gap-2'
      )}
      aria-label={t('Previous Page')}
      aria-disabled={startPageActive}
      disabled={startPageActive}
    >
      <FontAwesomeIcon
        icon={faChevronLeft}
        className={cn('h-3 shrink-0', iconActiveClass(startPageActive))}
        aria-hidden="true"
      />
      <span className={textActiveClass(startPageActive)}>{t('Previous')}</span>
    </button>
  );
});

PrevButton.displayName = 'PrevButton';

const NextButton: React.FC<NavButtonProps> = React.memo(({ active, length = 1, onClick }) => {
  const endPageActive = active === length;
  const handleClick = useCallback(() => onClick(active + 1), [onClick, active]);
  const { t } = useTranslation();

  return (
    <button
      onClick={handleClick}
      className={cn(
        'label-regular flex h-8 items-center justify-center rounded bg-surface px-3 text-content duration-300',
        'gap-2'
      )}
      disabled={endPageActive}
      aria-disabled={endPageActive}
      aria-label={t('Next Page')}
    >
      <span className={textActiveClass(endPageActive)}>{t('Next')}</span>
      <FontAwesomeIcon
        icon={faChevronRight}
        className={cn('h-3 shrink-0', iconActiveClass(endPageActive))}
        aria-hidden="true"
      />
    </button>
  );
});
NextButton.displayName = 'NextButton';

const EllipsisButton = React.memo(() => {
  const { t } = useTranslation();
  return (
    <button
      className={cn(
        'label-regular flex h-8 w-8 items-center justify-center rounded bg-surface px-3 text-content duration-300'
      )}
      disabled
      aria-label={t('Hidden Pages')}
    >
      ...
    </button>
  );
});
EllipsisButton.displayName = 'EllipsisButton';

const textActiveClass = (active: boolean) => (active ? 'text-content/50' : '');
const iconActiveClass = (active: boolean) => (active ? 'text-content/50' : '');

const MAX_VISIBLE_PAGES_EXPANDED = 9;
const halfVisiblePages = Math.floor(MAX_VISIBLE_PAGES_EXPANDED / 2);

type ButtonListProps = {
  active: number;
  length: number;
  onClick: (num: number) => void;
  expanded?: boolean;
};

type NavButtonProps = {
  active: number;
  length?: number;
  onClick: (num: number) => void;
};

type PageButtonProps = {
  num: number;
  active: number;
  onClick: (num: number) => void;
};

export type SearchPaginationProps = {
  currentPage: number;
  totalPages: number;
  expanded?: boolean;
  className?: string;
};
