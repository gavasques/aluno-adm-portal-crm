
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
  history?: SupplierHistoryItem[];
  branches?: SupplierBranch[];
  contacts?: SupplierContact[];
  communications?: SupplierCommunication[];
  isActive?: boolean;
}

export interface SupplierHistoryItem {
  id: string | number;
  action: string;
  date: string;
  user: string;
}

export interface SupplierBranch {
  id: string | number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  phone?: string;
  email?: string;
}

export interface SupplierContact {
  id: string | number;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  isMain?: boolean;
}

export interface SupplierCommunication {
  id: string | number;
  date: string;
  type: string;
  description: string;
  user: string;
}

export interface SuppliersTableProps {
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
