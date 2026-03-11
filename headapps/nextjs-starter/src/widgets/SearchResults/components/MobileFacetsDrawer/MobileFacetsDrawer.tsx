import { CheckIcon } from '@radix-ui/react-icons';
import { useSearchResultsActions, useSearchResultsSelectedFilters } from '@sitecore-search/react';
import type { SearchResponseFacet } from '@sitecore-search/react';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AccordionFacetsStyled } from '../SearchFacets/styled';
import { useClickOutside } from 'lib/hooks/useClickOutside';
import { createPortal } from 'react-dom';
import { PROFILE_LAST_NAME_INITIAL_FACET_NAME } from 'lib/const';
import { ppmori } from 'src/FontSetup';
import { useFrame } from 'lib/hooks/useFrame';
import { cn } from 'lib/helpers/classname';
import { Button } from 'component-children/Shared/Button/Button';
import { ButtonIcon } from 'component-children/Shared/Button/ButtonIcon';
import { useTranslation } from 'lib/hooks/useTranslation';
import router from 'next/router';
import { buildUrlWithHash, extractHashParamsWithoutFacets } from 'lib/helpers';
import { SelectedFilterButton } from '../SelectedFilterButton';
import { PastEventsCheckbox } from '../PastEventsCheckbox';
import { MobileDateRangeFilter } from '../DateRangeFilter';
import type { DateRange } from 'lib/types/date-range';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { ThemeType } from 'lib/types';
import { SECONDARY_THEME, TERTIARY_THEME } from 'lib/const';

const DRAWER_TRANSITION_DURATION = 300;

type MobileFacetsDrawerProps = {
  facets: SearchResponseFacet[];
  showPastEvents?: boolean;
  onPastEventsChange?: (checked: boolean) => void;
  dateRange?: DateRange;
  onDateRangeChange?: (start: Date | undefined, end: Date | undefined) => void;
};

const MobileFacetsDrawer = ({
  facets,
  showPastEvents,
  onPastEventsChange,
  dateRange,
  onDateRangeChange,
}: MobileFacetsDrawerProps) => {
  const { effectiveTheme } = useFrame();
  const themeClasses = cn(effectiveTheme, 'bg-surface text-content');
  const { onFacetClick, onClearFilters, onRemoveFilter } = useSearchResultsActions();
  const selectedFilters = useSearchResultsSelectedFilters();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [expandedFacets, setExpandedFacets] = useState<string[]>([]);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Calculate total active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;

    // Count selected facets
    count += selectedFilters.length;

    // Count date range filter if both dates are selected
    if (dateRange?.start && dateRange?.end) {
      count += 1;
    }

    // Count past events filter if enabled
    if (showPastEvents === true) {
      count += 1;
    }

    return count;
  }, [selectedFilters, dateRange?.start, dateRange?.end, showPastEvents]);

  const updateURLOnClearFilters = useCallback(() => {
    if (router.isReady) {
      const hashParams = extractHashParamsWithoutFacets(router);
      const asUrl = buildUrlWithHash(hashParams);
      router.push(asUrl);
    }
  }, []);

  const handleRemoveFilter = (filter: Record<string, unknown>) => {
    onRemoveFilter({
      type: 'text',
      facetId: filter.facetId as string,
      facetValueId: filter.facetValueId as string,
      facetValueText: filter.facetValueText as string,
    });
  };

  const handleClose = () => {
    setIsDrawerOpen(false);
    // Delay hiding the drawer until after animation completes
    setTimeout(() => {
      setShouldRender(false);
    }, DRAWER_TRANSITION_DURATION);
  };

  const handleOpen = () => {
    setShouldRender(true);
    // Small delay to ensure DOM is updated before animation starts
    setTimeout(() => {
      setIsDrawerOpen(true);
    }, 10);
  };

  useClickOutside([drawerRef], handleClose, isDrawerOpen);

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      // Delay resetting overflow until animation completes
      setTimeout(() => {
        document.body.style.overflow = originalStyle;
      }, DRAWER_TRANSITION_DURATION);
    };
  }, [isDrawerOpen]);

  const handleFacetTypesExpandedListChange = (newExpandedList: string[]) => {
    if (newExpandedList.length > 1) {
      const lastOpened = newExpandedList[newExpandedList.length - 1];
      setExpandedFacets([lastOpened]);
    } else {
      setExpandedFacets(newExpandedList);
    }
  };
  const otherFacets = useMemo(
    () => facets.filter((facet) => facet.name !== PROFILE_LAST_NAME_INITIAL_FACET_NAME),
    [facets]
  );

  return (
    <div
      id="mobile-facets-drawer"
      data-component="Mobile Facets Drawer"
      className="block md:hidden"
    >
      <Button
        onClick={handleOpen}
        variant="outline"
        color={effectiveTheme as ThemeType}
        iconLeft="filter"
        className="flex w-full justify-center px-4"
      >
        {activeFilterCount > 0 ? `${t('Filters')} (${activeFilterCount})` : t('Filters')}
      </Button>

      {shouldRender &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 md:hidden ${
              isDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filters-title"
          >
            {/* Background Overlay */}
            <div
              className={`absolute inset-0 bg-black transition-opacity duration-${DRAWER_TRANSITION_DURATION} ${
                isDrawerOpen ? 'bg-opacity-50' : 'bg-opacity-0'
              }`}
              onClick={handleClose}
            />
            {/* Drawer Content */}
            <div
              ref={drawerRef}
              className={`fixed inset-y-0 left-0 z-50 flex w-full flex-col transition-transform duration-300 xs:w-4/5 ${
                isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
              } ${ppmori.variable} ${themeClasses}`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4">
                <p id="mobile-filters-title" className="copy-lg font-semibold text-content">
                  {t('Filters')}
                </p>
                <ButtonIcon
                  onClick={handleClose}
                  iconPrefix="fas"
                  icon="xmark"
                  label={t('Close')}
                  withBackground={false}
                  unsetDefaultSize={true}
                  iconColor={effectiveTheme}
                />
              </div>

              {/* Drawer Body */}
              <div className="overflow-y-auto p-4">
                {/* Date Range Filter - only show if props are provided */}
                {dateRange && onDateRangeChange && (
                  <div className="mb-4">
                    <MobileDateRangeFilter
                      dateRange={dateRange}
                      onDateRangeChange={onDateRangeChange}
                    />
                  </div>
                )}

                <AccordionFacetsStyled.Root
                  facetTypesExpandedList={expandedFacets}
                  onFacetTypesExpandedListChange={handleFacetTypesExpandedListChange}
                  onFacetValueClick={onFacetClick}
                  data-component="mobile-accordion-facets"
                >
                  {otherFacets.map((facet) => (
                    <MobileFacetDropdown
                      key={facet.name}
                      facet={facet}
                      isExpanded={expandedFacets.includes(facet.name)}
                      onToggle={(expanded) => {
                        if (expanded) {
                          handleFacetTypesExpandedListChange([...expandedFacets, facet.name]);
                        } else {
                          handleFacetTypesExpandedListChange(
                            expandedFacets.filter((id) => id !== facet.name)
                          );
                        }
                      }}
                    />
                  ))}
                </AccordionFacetsStyled.Root>

                {/* Past Events Checkbox - only show if props are provided */}
                {showPastEvents !== undefined && onPastEventsChange && (
                  <PastEventsCheckbox checked={showPastEvents} onChange={onPastEventsChange} />
                )}
              </div>

              <div className="mt-auto border-t border-content/40 p-4">
                {/* Selected Filters Section */}
                {selectedFilters.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-4">
                    {selectedFilters.map((filter) => {
                      const filterRecord = filter as Record<string, unknown>;
                      return (
                        <SelectedFilterButton
                          key={`${filterRecord.facetId}-${filterRecord.facetValueId}`}
                          filter={filterRecord}
                          onRemove={handleRemoveFilter}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Clear All Filters Button - Mobile */}
                <Button
                  onClick={() => {
                    onClearFilters();
                    updateURLOnClearFilters();
                  }}
                  className={`w-full justify-center ${
                    selectedFilters.length === 0 && 'pointer-events-none opacity-50'
                  }`}
                  color={effectiveTheme === TERTIARY_THEME ? SECONDARY_THEME : TERTIARY_THEME}
                >
                  {t('Clear All Filters')}
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

type MobileFacetDropdownProps = {
  facet: SearchResponseFacet;
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
};

const MobileFacetDropdown = ({ facet, isExpanded, onToggle }: MobileFacetDropdownProps) => {
  // Regular facet rendering using AccordionFacets for proper vertical layout
  return (
    <AccordionFacetsStyled.Facet facetId={facet.name}>
      <div className="relative">
        <AccordionFacetsStyled.Trigger
          className="flex w-full items-center justify-between"
          onClick={() => onToggle(!isExpanded)}
        >
          <span>{facet.label}</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </AccordionFacetsStyled.Trigger>
      </div>
      {isExpanded && (
        <AccordionFacetsStyled.Content>
          <AccordionFacetsStyled.ValueList>
            {facet.value.map((facetValue, index) => (
              <AccordionFacetsStyled.Item
                {...{ index, facetValueId: facetValue.id }}
                key={facetValue.id}
              >
                <AccordionFacetsStyled.ItemCheckbox>
                  <AccordionFacetsStyled.ItemCheckboxIndicator>
                    <CheckIcon />
                  </AccordionFacetsStyled.ItemCheckboxIndicator>
                </AccordionFacetsStyled.ItemCheckbox>
                <AccordionFacetsStyled.ItemCheckboxLabel>
                  {facetValue.text} {facetValue.count && `(${facetValue.count})`}
                </AccordionFacetsStyled.ItemCheckboxLabel>
              </AccordionFacetsStyled.Item>
            ))}
          </AccordionFacetsStyled.ValueList>
        </AccordionFacetsStyled.Content>
      )}
    </AccordionFacetsStyled.Facet>
  );
};

export default MobileFacetsDrawer;
