
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth } from 'date-fns';

export const useCRMReportsFilters = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });

  const resetToCurrentMonth = () => {
    setDateRange({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    });
  };

  const setLastMonth = () => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    setDateRange({
      from: startOfMonth(lastMonth),
      to: endOfMonth(lastMonth)
    });
  };

  const setLast3Months = () => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    setDateRange({
      from: startOfMonth(threeMonthsAgo),
      to: new Date()
    });
  };

  return {
    dateRange,
    setDateRange,
    resetToCurrentMonth,
    setLastMonth,
    setLast3Months
  };
};
