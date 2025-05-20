
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Tipos de dados
export interface Supplier {
  id: number | string;
  name: string;
  category: string;
  categoryId?: number;
  rating: number;
  comments: number;
  cnpj?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  logo?: string;
  type?: string;
  brands?: string[];
  status?: "Ativo" | "Inativo";
}

interface SuppliersTableProps {
  suppliers: Supplier[];
  isAdmin?: boolean;
  onSelectSupplier: (supplier: Supplier) => void;
  onRemoveSupplier?: (id: number | string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortField: "name" | "category";
  sortDirection: "asc" | "desc";
  onSort: (field: "name" | "category") => void;
}

const SuppliersTable: React.FC<SuppliersTableProps> = ({
  suppliers,
  isAdmin = false,
  onSelectSupplier,
  onRemoveSupplier,
  pageSize,
  onPageSizeChange,
  currentPage,
  totalPages,
  onPageChange,
  sortField,
  sortDirection,
  onSort
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

  // Função para renderizar marcas como tags com limite
  const renderBrandTags = (brands?: string[]) => {
    if (!brands || brands.length === 0) return <span className="text-gray-400">Nenhuma</span>;
    
    // Mostrar apenas 3 marcas e indicar se há mais
    const visibleBrands = brands.slice(0, 3);
    const hasMore = brands.length > 3;
    
    return (
      <div className="flex flex-wrap gap-1">
        {visibleBrands.map((brand, index) => (
          <Badge key={index} variant="outline" className="bg-portal-light/20">
            {brand}
          </Badge>
        ))}
        {hasMore && <span className="text-gray-500">...</span>}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Mostrar</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="200">200</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">por página</span>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => onSort("name")} 
                  className="flex items-center gap-1 font-medium"
                >
                  Nome 
                  <ArrowUpDown className={`h-4 w-4 ${sortField === "name" ? "text-portal-primary" : ""}`} />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => onSort("category")} 
                  className="flex items-center gap-1 font-medium"
                >
                  Categoria 
                  <ArrowUpDown className={`h-4 w-4 ${sortField === "category" ? "text-portal-primary" : ""}`} />
                </Button>
              </TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Marcas</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead>Comentários</TableHead>
              {isAdmin && <TableHead>Status</TableHead>}
              {isAdmin && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 8 : 6} className="text-center py-8 text-gray-500">
                  Nenhum fornecedor encontrado.
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id} className="cursor-pointer" onClick={() => onSelectSupplier(supplier)}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>
                    {supplier.type ? (
                      <Badge variant="outline" className="bg-gray-100">
                        {supplier.type}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>{renderBrandTags(supplier.brands)}</TableCell>
                  <TableCell className="text-yellow-500">
                    {supplier.rating.toFixed(1)} ⭐
                  </TableCell>
                  <TableCell>{supplier.comments}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Badge variant={supplier.status === "Inativo" ? "destructive" : "default"}>
                        {supplier.status || "Ativo"}
                      </Badge>
                    </TableCell>
                  )}
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onRemoveSupplier) onRemoveSupplier(supplier.id);
                        }}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Mostrando {suppliers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} a {Math.min(currentPage * pageSize, totalPages * pageSize)} de {totalPages * pageSize} fornecedores
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
    </div>
  );
};

export default SuppliersTable;
