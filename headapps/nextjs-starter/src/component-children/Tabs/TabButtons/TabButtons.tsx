import { useEffect, useRef, useState } from 'react';
import { cn } from 'lib/helpers';
import Button from 'component-children/Shared/Button/Button';
import { TextField, Text } from '@sitecore-content-sdk/nextjs';
import { TabItemType } from '../TabsContainer/TabsContainer';
import {
  ARROW_SIZE,
  ArrowButton,
  SCROLL_DIRECTION,
  ScrollDirection,
} from 'component-children/Shared/ArrowButton/ArrowButton';
import { useTranslation } from 'lib/hooks/useTranslation';

const TAB_PANEL_PREFIX = 'tabpanel-';

export const TabButtons = ({ tabItems, isVertical, activeTab, setActiveTab }: TabButtonsProps) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showScrollArrows, setShowScrollArrows] = useState({ left: false, right: false });
  const arrowsAreDisplayed = showScrollArrows.left || showScrollArrows.right;

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabItems]);

  const handleScroll = () => {
    requestAnimationFrame(() => {
      if (!tabsRef.current) return;

      const tabElements = Array.from(tabsRef.current.children) as HTMLElement[];

      // For horizontal tabs, check if scrolling is needed at all
      if (!isVertical) {
        const { scrollWidth, clientWidth } = tabsRef.current;
        // If all content fits within the container, hide arrows
        if (scrollWidth <= clientWidth) {
          setShowScrollArrows({ left: false, right: false });
          return;
        }
      }

      // For sequential navigation, check if we're on first/last tab based on scroll position
      let currentVisibleIndex = findVisibleTabIndex(tabElements);

      // If no tab is visible yet (initial render), default to first tab (index 0)
      if (currentVisibleIndex === -1) {
        currentVisibleIndex = 0;
      }

      const lastTabIndex = tabElements.length - 1;
      const isOnFirstTab = currentVisibleIndex === 0;
      const isOnLastTab = currentVisibleIndex === lastTabIndex;

      setShowScrollArrows({
        left: !isOnFirstTab,
        right: !isOnLastTab,
      });
    });
  };

  // Find which tab is currently at the scroll position (leftmost visible tab)
  const findVisibleTabIndex = (tabElements: HTMLElement[]): number => {
    if (!tabsRef.current || tabElements.length === 0) return -1;

    const container = tabsRef.current;
    const containerLeft = container.getBoundingClientRect().left;
    const threshold = 10; // pixels - small threshold to account for rounding

    // Find the leftmost tab that's visibly positioned at or near the container's left edge
    for (let i = 0; i < tabElements.length; i++) {
      const tab = tabElements[i];
      const tabRect = tab.getBoundingClientRect();

      // Check if this tab's left edge is at or very close to the container's left edge
      // (accounting for the container's left position)
      if (Math.abs(tabRect.left - containerLeft) <= threshold) {
        return i;
      }

      // If tab is to the right of container start, and no exact match yet, this is the first visible tab
      if (tabRect.right > containerLeft + threshold) {
        return i;
      }
    }

    // Fallback: return last tab if we've scrolled past everything
    return tabElements.length - 1;
  };

  const scrollToTab = ({
    direction = SCROLL_DIRECTION.RIGHT,
    tabToScrollTo,
  }: {
    direction?: ScrollDirection;
    tabToScrollTo?: HTMLElement;
  }) => {
    if (!tabsRef.current) return;
    if (isVertical && !tabToScrollTo) return;
    if (!arrowsAreDisplayed && !tabToScrollTo) return;

    // Get the container and its left edge
    const container = tabsRef.current;
    const containerLeft = container.getBoundingClientRect().left;

    // Function to get the target tab for sequential navigation
    const getTargetTab = (direction: ScrollDirection) => {
      const tabElements = Array.from(tabsRef?.current?.children || []) as HTMLElement[];

      if (tabElements.length === 0) return;

      let targetTab: HTMLElement | undefined;

      // Find the currently visible tab index based on scroll position
      const currentVisibleIndex = findVisibleTabIndex(tabElements);

      // Navigate sequentially: LEFT goes to previous tab, RIGHT goes to next tab
      if (direction === SCROLL_DIRECTION.LEFT) {
        // Go to previous tab (unless we're already at the first tab)
        const targetIndex = Math.max(0, currentVisibleIndex - 1);
        targetTab = tabElements[targetIndex];
      } else {
        // Go to next tab (unless we're already at the last tab)
        const targetIndex = Math.min(tabElements.length - 1, currentVisibleIndex + 1);
        targetTab = tabElements[targetIndex];
      }

      return targetTab;
    };

    // If a target tab is provided, use it, otherwise find the target tab depending on the direction
    const targetTab = tabToScrollTo || getTargetTab(direction);

    // Scroll so the target tab's left edge aligns with container's left edge
    if (targetTab) {
      const targetRect = targetTab.getBoundingClientRect();
      const containerScrollLeft = container.scrollLeft;
      const scrollToPosition = containerScrollLeft + (targetRect.left - containerLeft);

      container.scrollTo({
        left: scrollToPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={cn(arrowsAreDisplayed && 'gap-6', isVertical ? 'w-48' : 'relative flex')}>
      <div
        ref={tabsRef}
        className={cn(
          'flex border-b border-surface/25',
          isVertical
            ? 'w-48 flex-col'
            : 'scrollbar-hide min-w-0 flex-1 flex-row overflow-x-auto overflow-y-hidden'
        )}
        onScroll={handleScroll}
        role="tablist"
        aria-orientation={isVertical ? 'vertical' : 'horizontal'}
      >
        {tabItems?.map((tab) => (
          <TabButton
            key={tab.uid}
            tab={tab}
            isVertical={isVertical}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onClick={(e) => scrollToTab({ tabToScrollTo: e.currentTarget })}
          />
        ))}
      </div>
      {!isVertical && (
        <TabButtonsScrollArrows
          showScrollArrows={showScrollArrows}
          onClick={(direction) => scrollToTab({ direction })}
        />
      )}
    </div>
  );
};

const TabButton = ({ tab, isVertical, activeTab, setActiveTab, onClick }: TabButtonProps) => {
  const [thisTabIsActive, setThisTabIsActive] = useState(false);

  useEffect(() => {
    setThisTabIsActive(activeTab === tab.uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick(e);
    setActiveTab(tab.uid);
  };

  return (
    <Button
      key={tab.uid}
      onClick={handleClick}
      className={cn(
        'relative pb-6 pt-2 lg:flex',
        !isVertical && 'flex-shrink-0 whitespace-nowrap px-3 sm:flex-1',
        'copy-sm flex items-center font-bold text-content underline decoration-transparent duration-200',
        'after:content-[&quot;&quot;] after:absolute after:bottom-2 after:left-0 after:right-0 after:h-0.5 after:translate-y-2 after:bg-transparent after:transition-all after:duration-200',
        'hover:underline hover:decoration-transparent hover:after:translate-y-0 hover:after:bg-content',
        'focus:underline focus:decoration-transparent focus:after:translate-y-0 focus:after:bg-content',
        'focus-visible:underline focus-visible:decoration-transparent focus-visible:after:translate-y-0 focus-visible:after:bg-content',
        'group-hover:decoration-transparent',
        isVertical && 'w-full text-left',
        thisTabIsActive &&
          'text-content underline decoration-transparent after:translate-y-0 after:bg-content'
      )}
      id={`tab-${tab.uid}`}
      aria-selected={thisTabIsActive}
      aria-controls={`${TAB_PANEL_PREFIX}${tab.uid}`}
      variant="link"
      role="tab"
    >
      <Text
        field={tab.heading as TextField}
        className="no-underline hover:no-underline focus:no-underline focus-visible:no-underline"
      />
    </Button>
  );
};

const TabButtonsScrollArrows = ({ showScrollArrows, onClick }: TabButtonsScrollArrowsProps) => {
  const { t } = useTranslation();

  if (!showScrollArrows.left && !showScrollArrows.right) return null;

  return (
    <div className="flex flex-shrink-0 gap-3">
      <ArrowButton
        direction={SCROLL_DIRECTION.LEFT}
        disabled={!showScrollArrows.left}
        size={ARROW_SIZE.SMALL}
        onClick={() => onClick(SCROLL_DIRECTION.LEFT)}
        ariaLabel={t('Previous Tab')}
      />
      <ArrowButton
        direction={SCROLL_DIRECTION.RIGHT}
        disabled={!showScrollArrows.right}
        size={ARROW_SIZE.SMALL}
        onClick={() => onClick(SCROLL_DIRECTION.RIGHT)}
        ariaLabel={t('Next Tab')}
      />
    </div>
  );
};

type CommonTabButtonProps = {
  isVertical: boolean;
  activeTab: string | undefined;
  setActiveTab: (tab: string) => void;
};

type TabButtonsScrollArrowsProps = {
  showScrollArrows: { left: boolean; right: boolean };
  onClick: (direction: ScrollDirection) => void;
};

type TabButtonProps = CommonTabButtonProps & {
  tab: TabItemType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type TabButtonsProps = CommonTabButtonProps & {
  tabItems: TabItemType[];
  phKey: string;
};
