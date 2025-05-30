
import { useMemo } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  pageSize: number;
  currentPage: number;
}

interface UsePaginationReturn<T> {
  paginatedItems: T[];
  pageInfo: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    startIndex: number;
    endIndex: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export const usePagination = <T>({
  items,
  pageSize,
  currentPage
}: UsePaginationProps<T>): UsePaginationReturn<T> => {
  const paginatedData = useMemo(() => {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalItems);
    
    const paginatedItems = items.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    return {
      paginatedItems,
      pageInfo: {
        totalItems,
        totalPages,
        currentPage,
        pageSize,
        startIndex,
        endIndex,
        hasPreviousPage: currentPage > 1,
        hasNextPage: currentPage < totalPages
      }
    };
  }, [items, pageSize, currentPage]);

  return paginatedData;
};
