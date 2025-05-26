
import { useMemo } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  pageSize: number;
  currentPage: number;
}

export const usePagination = <T>({ items, pageSize, currentPage }: UsePaginationProps<T>) => {
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }, [items, pageSize, currentPage]);
  
  const totalPages = Math.ceil(items.length / pageSize);
  const totalItems = items.length;
  
  const pageInfo = {
    currentPage,
    totalPages,
    totalItems,
    startIndex: (currentPage - 1) * pageSize + 1,
    endIndex: Math.min(currentPage * pageSize, totalItems),
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
  
  return {
    paginatedItems,
    pageInfo
  };
};
