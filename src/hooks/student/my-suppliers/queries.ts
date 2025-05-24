
import { supabase } from "@/integrations/supabase/client";
import { SupplierFormValues, MySupplier } from "@/types/my-suppliers.types";

const SELECT_QUERY = `
  *,
  brands:my_supplier_brands(*),
  branches:my_supplier_branches(*),
  contacts:my_supplier_contacts(*),
  communications:my_supplier_communications(*),
  ratings:my_supplier_ratings(*),
  commentItems:my_supplier_comments(*)
`;

export const fetchSuppliersQuery = (userId: string) => {
  return supabase
    .from('my_suppliers')
    .select(SELECT_QUERY)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
};

export const createSupplierQuery = (supplierData: any) => {
  return supabase
    .from('my_suppliers')
    .insert(supplierData)
    .select(SELECT_QUERY)
    .single();
};

export const updateSupplierQuery = (id: string, userId: string, updates: Partial<MySupplier>) => {
  return supabase
    .from('my_suppliers')
    .update({
      name: updates.name,
      category: updates.category,
      cnpj: updates.cnpj,
      email: updates.email,
      phone: updates.phone,
      website: updates.website,
      address: updates.address,
      type: updates.type,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select(SELECT_QUERY)
    .single();
};

export const deleteSupplierQuery = (id: string, userId: string) => {
  return supabase
    .from('my_suppliers')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
};
