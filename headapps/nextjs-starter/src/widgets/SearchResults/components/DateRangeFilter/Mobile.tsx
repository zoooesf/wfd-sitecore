import { useState } from 'react';
import { DayPicker, type DateRange as DayPickerDateRange } from 'react-day-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type { DateRange } from 'lib/types/date-range';
import { formatDateRange, getFormattedDate } from 'lib/helpers';
import { getDateFnsLocale, normalizeLocaleForIntl } from 'lib/helpers/locale-helper';
import { Button } from 'component-children/Shared/Button/Button';
import 'react-day-picker/dist/style.css';
import { useTranslation } from 'lib/hooks/useTranslation';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { mainLanguage } from 'lib/i18n/i18n-config';

type MobileDateRangeFilterProps = {
  dateRange: DateRange;
  onDateRangeChange: (start: Date | undefined, end: Date | undefined) => void;
};

export const MobileDateRangeFilter: React.FC<MobileDateRangeFilterProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  const { t } = useTranslation();
  const { page } = useSitecore();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    // If there's an initial date selection, show that month
    // Otherwise, show current month
    const month = dateRange.start || new Date();
    return month;
  });
  const [localRange, setLocalRange] = useState<DayPickerDateRange | undefined>(() => {
    const initialRange =
      dateRange.start && dateRange.end ? { from: dateRange.start, to: dateRange.end } : undefined;
    return initialRange;
  });

  const hasSelection = dateRange.start && dateRange.end;

  // Get locale for date formatting
  const currentLocale = page?.locale || mainLanguage;
  const dateFnsLocale = getDateFnsLocale(currentLocale);
  const intlLocale = normalizeLocaleForIntl(currentLocale);

  const handleSelect = (range: DayPickerDateRange | undefined) => {
    // Update local state immediately for visual feedback
    setLocalRange(range);

    // Only update parent state when both dates are selected
    if (range?.from && range?.to) {
      onDateRangeChange(range.from, range.to);
    }
  };

  // Calculate min dynamically: after first date is selected, allow same-date selection
  const minDays = localRange?.from && !localRange?.to ? 0 : 1;

  const handleClear = () => {
    setLocalRange(undefined);
    onDateRangeChange(undefined, undefined);
  };

  const handlePrevious = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNext = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="border-b border-content pb-4">
      {/* Accordion Header */}
      <button
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-semibold text-content">{t('Date Range')}</span>
        <div className="flex items-center gap-2">
          {hasSelection && (
            <span className="copy-sm">
              {formatDateRange(dateRange.start, dateRange.end, intlLocale)}
            </span>
          )}
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`w-4 transition-transform duration-200 ${
              isAccordionOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isAccordionOpen ? 'mt-2 max-h-150 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Custom navigation */}
        <div className="mb-3 flex items-center justify-between px-2">
          <button
            onClick={handlePrevious}
            className="rounded p-2 hover:bg-content/10"
            aria-label={t('Previous')}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
          </button>
          <span className="copy-sm font-semibold">
            {getFormattedDate(currentMonth, { month: 'long', year: 'numeric' }, intlLocale)}
          </span>
          <button
            onClick={handleNext}
            className="rounded p-2 hover:bg-content/10"
            aria-label={t('Next')}
          >
            <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
          </button>
        </div>

        <DayPicker
          mode="range"
          selected={localRange}
          onSelect={handleSelect}
          month={currentMonth}
          locale={dateFnsLocale}
          className="date-range-selector flex w-full justify-center"
          showOutsideDays={false}
          hideNavigation
          min={minDays}
        />

        {hasSelection && (
          <Button
            onClick={handleClear}
            variant="button"
            className="mt-4 flex w-full justify-center"
          >
            {t('Clear Selection')}
          </Button>
        )}
      </div>
    </div>
  );
};
