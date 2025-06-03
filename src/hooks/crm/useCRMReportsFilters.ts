
import { useState } from 'react';

export interface DateRange {
  from: Date;
  to?: Date;
}

export const useCRMReportsFilters = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
    to: new Date()
  });

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange({
      from: range.from,
      to: range.to || new Date()
    });
  };

  return {
    dateRange,
    setDateRange: handleDateRangeChange
  };
};
