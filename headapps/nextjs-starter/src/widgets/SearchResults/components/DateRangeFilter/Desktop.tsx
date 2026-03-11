import React, { useState, useRef, useEffect } from 'react';
import { DayPicker, type DateRange as DayPickerDateRange } from 'react-day-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faXmark,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import type { DateRange } from 'lib/types/date-range';
import { formatDateRange, getConsecutiveMonths, getFormattedDate } from 'lib/helpers';
import { getDateFnsLocale, normalizeLocaleForIntl } from 'lib/helpers/locale-helper';
import 'react-day-picker/dist/style.css';
import { useTranslation } from 'lib/hooks/useTranslation';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { mainLanguage } from 'lib/i18n/i18n-config';

type DesktopDateRangeFilterProps = {
  dateRange: DateRange;
  onDateRangeChange: (start: Date | undefined, end: Date | undefined) => void;
};

export const DesktopDateRangeFilter: React.FC<DesktopDateRangeFilterProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  const { t } = useTranslation();
  const { page } = useSitecore();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [displayMonths, setDisplayMonths] = useState<[Date, Date]>(() => {
    // If there's an initial date selection, show months based on that date
    // Otherwise, show current month and next month
    const baseDate = dateRange.start || new Date();
    const months = getConsecutiveMonths(baseDate);
    return months;
  });
  const [localRange, setLocalRange] = useState<DayPickerDateRange | undefined>(() => {
    const initialRange =
      dateRange.start && dateRange.end ? { from: dateRange.start, to: dateRange.end } : undefined;
    return initialRange;
  });
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const hasSelection = dateRange.start && dateRange.end;

  // Get locale for date formatting
  const currentLocale = page?.locale || mainLanguage;
  const dateFnsLocale = getDateFnsLocale(currentLocale);
  const intlLocale = normalizeLocaleForIntl(currentLocale);

  // Sync local range with parent when calendar opens
  useEffect(() => {
    if (isCalendarOpen) {
      const newRange =
        dateRange.start && dateRange.end ? { from: dateRange.start, to: dateRange.end } : undefined;
      setLocalRange(newRange);
    }
  }, [isCalendarOpen, dateRange.start, dateRange.end]);

  // Close calendar when clicking outside
  useEffect(() => {
    if (!isCalendarOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        buttonRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCalendarOpen]);

  const handleSelect = (range: DayPickerDateRange | undefined) => {
    // Update local state immediately for visual feedback
    setLocalRange(range);

    // Only update parent state when both dates are selected
    if (range?.from && range?.to) {
      onDateRangeChange(range.from, range.to);
      setIsCalendarOpen(false);
    }
  };

  // Calculate min dynamically: after first date is selected, allow same-date selection
  const minDays = localRange?.from && !localRange?.to ? 0 : 1;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalRange(undefined);
    onDateRangeChange(undefined, undefined);
    setIsCalendarOpen(false);
  };

  const handlePrevious = () => {
    setDisplayMonths(([first]) => {
      const newFirst = new Date(first.getFullYear(), first.getMonth() - 1, 1);
      const newSecond = new Date(first.getFullYear(), first.getMonth(), 1);
      return [newFirst, newSecond];
    });
  };

  const handleNext = () => {
    setDisplayMonths(([, second]) => {
      const newFirst = new Date(second.getFullYear(), second.getMonth(), 1);
      const newSecond = new Date(second.getFullYear(), second.getMonth() + 1, 1);
      return [newFirst, newSecond];
    });
  };

  return (
    <div className="relative hidden md:block">
      <div className="border-b border-content pb-4">
        <span className="font-semibold text-content">{t('Date Range')}</span>
        <div className="mt-2">
          <button
            ref={buttonRef}
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="flex w-full items-center justify-between rounded border border-content/30 bg-surface px-3 py-2 text-left transition-colors hover:border-content/40"
          >
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} className="h-4 w-4 text-content/60" />
              <span className="copy-sm text-content">
                {hasSelection
                  ? formatDateRange(dateRange.start, dateRange.end, intlLocale)
                  : t('Select date range')}
              </span>
            </div>
            {hasSelection && (
              <div
                onClick={handleClear}
                className="rounded p-1 hover:bg-content/10"
                aria-label={t('Clear Selection')}
              >
                <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
              </div>
            )}
          </button>
        </div>
      </div>

      {isCalendarOpen && (
        <div
          ref={popupRef}
          className="desktop absolute left-0 top-full z-50 mt-2 rounded-lg border border-content/20 bg-surface p-4 shadow-lg"
        >
          {/* Custom navigation */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              className="rounded p-2 hover:bg-content/10"
              aria-label={t('Previous')}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
            </button>
            <div className="copy-sm flex gap-8">
              <span>
                {getFormattedDate(displayMonths[0], { month: 'long', year: 'numeric' }, intlLocale)}
              </span>
              <span>
                {getFormattedDate(displayMonths[1], { month: 'long', year: 'numeric' }, intlLocale)}
              </span>
            </div>
            <button
              onClick={handleNext}
              className="rounded p-2 hover:bg-content/10"
              aria-label={t('Next')}
            >
              <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
            </button>
          </div>

          {/* Dual calendars */}
          <div className="flex gap-4">
            <DayPicker
              mode="range"
              selected={localRange}
              onSelect={handleSelect}
              month={displayMonths[0]}
              locale={dateFnsLocale}
              className="date-range-selector"
              showOutsideDays={false}
              hideNavigation
              min={minDays}
            />
            <DayPicker
              mode="range"
              selected={localRange}
              onSelect={handleSelect}
              month={displayMonths[1]}
              locale={dateFnsLocale}
              className="date-range-selector"
              showOutsideDays={false}
              hideNavigation
              min={minDays}
            />
          </div>
        </div>
      )}
    </div>
  );
};
