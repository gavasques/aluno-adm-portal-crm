
import { useState } from 'react';

export const useCRMReportsFilters = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
    to: new Date()
  });

  return {
    dateRange,
    setDateRange
  };
};
