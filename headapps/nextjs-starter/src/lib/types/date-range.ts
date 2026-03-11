export type DateRange = {
  start: Date | undefined;
  end: Date | undefined;
};

export type DateRangeFilterProps = {
  dateRange: DateRange;
  onDateRangeChange: (start: Date | undefined, end: Date | undefined) => void;
};
