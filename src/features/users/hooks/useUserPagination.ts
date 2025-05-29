
import { useState, useMemo } from 'react';
import { User } from '@/types/user.types';

interface UseUserPaginationProps {
  users: User[];
}

export const useUserPagination = ({ users }: UseUserPaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const totalPages = Math.ceil(users.length / pageSize);
  
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return users.slice(startIndex, endIndex);
  }, [users, currentPage, pageSize]);

  const pageInfo = {
    currentPage,
    totalPages,
    totalItems: users.length,
    startIndex: (currentPage - 1) * pageSize + 1,
    endIndex: Math.min(currentPage * pageSize, users.length),
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    if (pageInfo.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pageInfo.hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changePageSize = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return {
    paginatedUsers,
    pageInfo,
    pageSize,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changePageSize
  };
};
