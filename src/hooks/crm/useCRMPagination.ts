
import { useState, useMemo } from 'react';
import { CRMLead } from '@/types/crm.types';

interface UseCRMPaginationProps {
  data: CRMLead[];
  itemsPerPage?: number;
}

export const useCRMPagination = ({ data, itemsPerPage = 50 }: UseCRMPaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);

  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const pageInfo = {
    currentPage,
    totalPages,
    totalItems: data.length,
    itemsPerPage,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, data.length),
  };

  return {
    paginatedData,
    pageInfo,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    setCurrentPage,
  };
};
