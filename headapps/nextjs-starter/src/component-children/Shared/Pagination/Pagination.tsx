import React, { useCallback, useMemo, JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { cn } from 'lib/helpers/classname';
import { useTranslation } from 'lib/hooks/useTranslation';
import { useFrame } from 'lib/hooks/useFrame';
import { SECONDARY_THEME } from 'lib/const';

/**
 * UI component for Pagination
 */
export const Pagination: React.FC<PaginationProps> = ({
  length,
  selected,
  setSelected,
  className,
}) => {
  const { t } = useTranslation();
  const { effectiveTheme } = useFrame();
  const handleToggle = useCallback(
    (num: number) => {
      const validatedNum = Math.max(1, Math.min(num, length));
      setSelected(validatedNum);
    },
    [length, setSelected]
  );

  // Get theme-aware colors for hover and active states
  const hoverBgClass = effectiveTheme === SECONDARY_THEME ? 'bg-primary/20' : 'bg-secondary/20';
  const activeBorderClass =
    effectiveTheme === SECONDARY_THEME ? 'border-primary/20' : 'border-secondary/20';

  return (
    <nav
      data-component="Pagination"
      aria-label={t('Pagination')}
      className={cn('z-10 flex gap-1 bg-surface', effectiveTheme, className)}
    >
      <PrevButton active={selected} onClick={handleToggle} hoverBgClass={hoverBgClass} />
      <CenterButtonList
        active={selected}
        length={length}
        onClick={handleToggle}
        hoverBgClass={hoverBgClass}
        activeBorderClass={activeBorderClass}
      />
      <NextButton
        active={selected}
        length={length}
        onClick={handleToggle}
        hoverBgClass={hoverBgClass}
      />
    </nav>
  );
};

const CenterButtonList: React.FC<ButtonListProps> = ({
  active,
  length,
  onClick,
  hoverBgClass,
  activeBorderClass,
}) => {
  const pageListProps = useMemo(
    () => ({ active, length, onClick, hoverBgClass, activeBorderClass }),
    [active, length, onClick, hoverBgClass, activeBorderClass]
  );

  return (
    <div className="flex gap-1">
      {length < 4 ? (
        /* Non-expanded view (same for mobile and desktop) */
        <ExpandedPageList {...pageListProps} />
      ) : (
        <PageButtonList {...pageListProps} />
      )}
    </div>
  );
};

const PageButtonList: React.FC<ButtonListProps> = ({
  active,
  length,
  onClick,
  hoverBgClass,
  activeBorderClass,
}) => {
  const pageButtons = useMemo(() => {
    const buttons: JSX.Element[] = [];

    // Match sitecore search pagination
    if (active <= 2) {
      // On page 1 or 2: [1] [2] [...] [last]
      buttons.push(
        <PageButton
          key={1}
          num={1}
          active={active}
          onClick={onClick}
          hoverBgClass={hoverBgClass}
          activeBorderClass={activeBorderClass}
        />
      );
      buttons.push(
        <PageButton
          key={2}
          num={2}
          active={active}
          onClick={onClick}
          hoverBgClass={hoverBgClass}
          activeBorderClass={activeBorderClass}
        />
      );
      buttons.push(<EllipsisButton key="ellipsis" hoverBgClass={hoverBgClass} />);
      buttons.push(
        <PageButton
          key={length}
          num={length}
          active={active}
          onClick={onClick}
          hoverBgClass={hoverBgClass}
          activeBorderClass={activeBorderClass}
        />
      );
    } else if (active === length) {
      // On last page: [1] [2] [...] [last]
      buttons.push(
        <PageButton
          key={1}
          num={1}
          active={active}
          onClick={onClick}
          hoverBgClass={hoverBgClass}
          activeBorderClass={activeBorderClass}
        />
      );
      buttons.push(
        <PageButton
          key={2}
          num={2}
          active={active}
          onClick={onClick}
          hoverBgClass={hoverBgClass}
          activeBorderClass={activeBorderClass}
        />
      );
      buttons.push(<EllipsisButton key="ellipsis" hoverBgClass={hoverBgClass} />);
      buttons.push(
        <PageButton
          key={length}
          num={length}
          active={active}
          onClick={onClick}
          hoverBgClass={hoverBgClass}
          activeBorderClass={activeBorderClass}
        />
      );
    } else if (active === length - 1) {
      // On second-to-last page: [1] [...] [second-to-last] [last]
      buttons.push(
        <PageButton
          key={1}
          num={1}
          active={active}
          onClick={onClick}
          hoverBgClass={hoverBgClass}
          activeBorderClass={activeBorderClass}
        />
      );
      buttons.push(<EllipsisButton key="ellipsis" hoverBgClass={hoverBgClass} />);
      buttons.push(
        <PageButton
          key={active}
          num={active}
          active={active}
          onClick={onClick}
          hoverBgClass={hoverBgClass}
          activeBorderClass={activeBorderClass}
        />
      );
      buttons.push(
        <PageButton
          key={length}
          num={length}
          active={active}
          onClick={onClick}
          hoverBgClass={hoverBgClass}
          activeBorderClass={activeBorderClass}
        />
      );
    } else {
      // On middle page (3 to last-2): [1] [...] [current] [...] [last]
      buttons.push(
        <PageButton
          key={1}
          num={1}
          active={active}
          onClick={onClick}
          hoverBgClass={hoverBgClass}
          activeBorderClass={activeBorderClass}
        />
      );
      buttons.push(<EllipsisButton key="start-ellipsis" hoverBgClass={hoverBgClass} />);
      buttons.push(
        <PageButton
          key={active}
          num={active}
          active={active}
          onClick={onClick}
          hoverBgClass={hoverBgClass}
          activeBorderClass={activeBorderClass}
        />
      );
      buttons.push(<EllipsisButton key="end-ellipsis" hoverBgClass={hoverBgClass} />);
      buttons.push(
        <PageButton
          key={length}
          num={length}
          active={active}
          onClick={onClick}
          hoverBgClass={hoverBgClass}
          activeBorderClass={activeBorderClass}
        />
      );
    }

    return buttons;
  }, [active, length, onClick, hoverBgClass, activeBorderClass]);

  return <>{pageButtons}</>;
};

const ExpandedPageList: React.FC<ButtonListProps> = ({
  active,
  length,
  onClick,
  hoverBgClass,
  activeBorderClass,
}) => {
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
      <PageButton
        key={idx}
        num={startPage + idx}
        active={active}
        onClick={onClick}
        hoverBgClass={hoverBgClass}
        activeBorderClass={activeBorderClass}
      />
    ));
  }, [active, endPage, onClick, startPage, hoverBgClass, activeBorderClass]);

  return <>{buttons}</>;
};

const PageButton: React.FC<PageButtonProps> = React.memo(
  ({ num, active, onClick, hoverBgClass, activeBorderClass }) => {
    const handleClick = useCallback(() => onClick(num), [onClick, num]);
    const { t } = useTranslation();
    const isActive = num === active;

    return (
      <button
        onClick={handleClick}
        className={cn(
          'label-regular flex h-8 w-8 items-center justify-center rounded bg-transparent px-3 text-content duration-300',
          `enabled:hover:${hoverBgClass}`,
          isActive && 'border-1 font-bold no-underline shadow-sm',
          isActive && activeBorderClass
        )}
        aria-label={`${t('Page')} ${num}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {num}
      </button>
    );
  }
);
PageButton.displayName = 'PageButton';

const PrevButton: React.FC<NavButtonProps> = React.memo(({ active, onClick, hoverBgClass }) => {
  const startPageActive = active === 1;
  const handleClick = useCallback(() => onClick(active - 1), [onClick, active]);
  const { t } = useTranslation();

  return (
    <button
      onClick={handleClick}
      className={cn(
        'label-regular flex h-8 items-center justify-center rounded bg-transparent px-3 text-content duration-300',
        `enabled:hover:${hoverBgClass}`,
        'mr-3 w-24 gap-2'
      )}
      aria-label={t('Previous Page')}
      aria-disabled={startPageActive}
      disabled={startPageActive}
    >
      <FontAwesomeIcon
        icon={faArrowLeft}
        className={cn('h-3 shrink-0', iconActiveClass(startPageActive))}
        aria-hidden="true"
      />
      <span className={textActiveClass(startPageActive)}>{t('Previous')}</span>
    </button>
  );
});

PrevButton.displayName = 'PrevButton';

const NextButton: React.FC<NavButtonProps> = React.memo(
  ({ active, length = 1, onClick, hoverBgClass }) => {
    const endPageActive = active === length;
    const handleClick = useCallback(() => onClick(active + 1), [onClick, active]);
    const { t } = useTranslation();

    return (
      <button
        onClick={handleClick}
        className={cn(
          'label-regular flex h-8 items-center justify-center rounded bg-transparent px-3 text-content duration-300',
          `enabled:hover:${hoverBgClass}`,
          'gap-2'
        )}
        disabled={endPageActive}
        aria-disabled={endPageActive}
        aria-label={t('Next Page')}
      >
        <span className={textActiveClass(endPageActive)}>{t('Next')}</span>
        <FontAwesomeIcon
          icon={faArrowRight}
          className={cn('h-3 shrink-0', iconActiveClass(endPageActive))}
          aria-hidden="true"
        />
      </button>
    );
  }
);
NextButton.displayName = 'NextButton';

const EllipsisButton = React.memo(({ hoverBgClass }: { hoverBgClass?: string }) => {
  const { t } = useTranslation();
  return (
    <button
      className={cn(
        'label-regular flex h-8 w-8 items-center justify-center rounded bg-transparent px-3 text-content duration-300',
        hoverBgClass && `enabled:hover:${hoverBgClass}`
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
  hoverBgClass?: string;
  activeBorderClass?: string;
};

type NavButtonProps = {
  active: number;
  length?: number;
  onClick: (num: number) => void;
  hoverBgClass?: string;
};

type PageButtonProps = {
  num: number;
  active: number;
  onClick: (num: number) => void;
  hoverBgClass?: string;
  activeBorderClass?: string;
};

type PaginationProps = {
  length: number;
  selected: number;
  setSelected: (option: number) => void;
  className?: string;
};
