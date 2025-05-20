
import React from "react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SupplierTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
}

const SupplierTablePagination: React.FC<SupplierTablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    // Mostrar sempre a primeira página
    if (totalPages > 0) {
      pages.push(
        <PaginationItem key="1">
          <PaginationLink 
            onClick={() => onPageChange(1)} 
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Adicionar elipse se houver muitas páginas antes da página atual
    if (currentPage > 3) {
      pages.push(
        <PaginationItem key="ellipsis1">
          <span className="flex h-9 w-9 items-center justify-center">...</span>
        </PaginationItem>
      );
    }

    // Adicionar páginas ao redor da página atual
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Já adicionamos a primeira e última
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => onPageChange(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Adicionar elipse se houver muitas páginas depois da página atual
    if (currentPage < totalPages - 2) {
      pages.push(
        <PaginationItem key="ellipsis2">
          <span className="flex h-9 w-9 items-center justify-center">...</span>
        </PaginationItem>
      );
    }

    // Mostrar sempre a última página, se houver mais de uma página
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            onClick={() => onPageChange(totalPages)} 
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-500">
        Mostrando {totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0} a {Math.min(currentPage * pageSize, totalPages * pageSize)} de {totalItems} fornecedores
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} 
            />
          </PaginationItem>
          
          {renderPageNumbers()}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} 
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default SupplierTablePagination;
