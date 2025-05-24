
import { MySupplier, SupplierFormValues } from "@/types/my-suppliers.types";

export const withTimeout = async <T>(
  operation: PromiseLike<T>, 
  timeoutMs: number = 10000
): Promise<T> => {
  return Promise.race([
    Promise.resolve(operation),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Operação expirou')), timeoutMs);
    })
  ]);
};

export const transformSupplierData = (supplierData: any): MySupplier => ({
  ...supplierData,
  files: [],
  images: []
});

export const createSupplierData = (data: SupplierFormValues, userId: string) => ({
  user_id: userId,
  name: data.name,
  category: data.category,
  cnpj: data.cnpj || null,
  email: data.email || null,
  phone: data.phone || null,
  website: data.website || null,
  address: data.address || null,
  type: data.type || 'Distribuidor',
  logo: data.name.substring(0, 2).toUpperCase(),
  rating: 0,
  comment_count: 0
});
