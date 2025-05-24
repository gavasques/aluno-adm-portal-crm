
import { MySupplier, SupplierFormValues } from "@/types/my-suppliers.types";

export interface UseSupabaseMySuppliers {
  suppliers: MySupplier[];
  loading: boolean;
  error: string | null;
  retryCount: number;
  createSupplier: (data: SupplierFormValues) => Promise<MySupplier | null>;
  updateSupplier: (id: string, updates: Partial<MySupplier>) => Promise<MySupplier | null>;
  deleteSupplier: (id: string) => Promise<boolean>;
  refreshSuppliers: () => void;
}
