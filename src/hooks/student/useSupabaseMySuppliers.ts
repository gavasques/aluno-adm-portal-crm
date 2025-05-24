
import { useState, useEffect } from "react";
import { useSession } from "@/hooks/auth/useSession";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MySupplier, SupplierFormValues } from "@/types/my-suppliers.types";

export const useSupabaseMySuppliers = () => {
  const { user } = useSession();
  const [suppliers, setSuppliers] = useState<MySupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar fornecedores do usuário
  const loadSuppliers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Buscar fornecedores com dados relacionados
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('my_suppliers')
        .select(`
          *,
          brands:my_supplier_brands(*),
          branches:my_supplier_branches(*),
          contacts:my_supplier_contacts(*),
          communications:my_supplier_communications(*),
          ratings:my_supplier_ratings(*),
          commentItems:my_supplier_comments(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (suppliersError) {
        console.error('Error loading suppliers:', suppliersError);
        throw suppliersError;
      }

      // Transformar dados para o formato esperado
      const transformedSuppliers: MySupplier[] = (suppliersData || []).map(supplier => ({
        ...supplier,
        files: [],
        images: []
      }));

      setSuppliers(transformedSuppliers);
    } catch (err: any) {
      console.error('Error loading suppliers:', err);
      setError(err.message || 'Erro ao carregar fornecedores');
      toast.error('Erro ao carregar fornecedores');
    } finally {
      setLoading(false);
    }
  };

  // Criar novo fornecedor
  const createSupplier = async (data: SupplierFormValues): Promise<MySupplier | null> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    try {
      const supplierData = {
        user_id: user.id,
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
      };

      const { data: newSupplier, error } = await supabase
        .from('my_suppliers')
        .insert(supplierData)
        .select(`
          *,
          brands:my_supplier_brands(*),
          branches:my_supplier_branches(*),
          contacts:my_supplier_contacts(*),
          communications:my_supplier_communications(*),
          ratings:my_supplier_ratings(*),
          commentItems:my_supplier_comments(*)
        `)
        .single();

      if (error) {
        console.error('Error creating supplier:', error);
        throw error;
      }

      const transformedSupplier: MySupplier = {
        ...newSupplier,
        files: [],
        images: []
      };

      setSuppliers(prev => [transformedSupplier, ...prev]);
      toast.success(`${data.name} foi adicionado com sucesso.`);
      
      return transformedSupplier;
    } catch (err: any) {
      console.error('Error creating supplier:', err);
      toast.error('Erro ao criar fornecedor');
      return null;
    }
  };

  // Atualizar fornecedor
  const updateSupplier = async (id: string, updates: Partial<MySupplier>): Promise<MySupplier | null> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    try {
      const { data: updatedSupplier, error } = await supabase
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
        .eq('user_id', user.id)
        .select(`
          *,
          brands:my_supplier_brands(*),
          branches:my_supplier_branches(*),
          contacts:my_supplier_contacts(*),
          communications:my_supplier_communications(*),
          ratings:my_supplier_ratings(*),
          commentItems:my_supplier_comments(*)
        `)
        .single();

      if (error) {
        console.error('Error updating supplier:', error);
        throw error;
      }

      const transformedSupplier: MySupplier = {
        ...updatedSupplier,
        files: [],
        images: []
      };

      setSuppliers(prev => prev.map(supplier => 
        supplier.id === id ? transformedSupplier : supplier
      ));

      toast.success('Fornecedor atualizado com sucesso!');
      return transformedSupplier;
    } catch (err: any) {
      console.error('Error updating supplier:', err);
      toast.error('Erro ao atualizar fornecedor');
      return null;
    }
  };

  // Deletar fornecedor
  const deleteSupplier = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    try {
      const { error } = await supabase
        .from('my_suppliers')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting supplier:', error);
        throw error;
      }

      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      toast.success('Fornecedor excluído com sucesso.');
      return true;
    } catch (err: any) {
      console.error('Error deleting supplier:', err);
      toast.error('Erro ao excluir fornecedor');
      return false;
    }
  };

  // Carregar fornecedores quando o usuário muda
  useEffect(() => {
    if (user) {
      loadSuppliers();
    } else {
      setSuppliers([]);
      setLoading(false);
    }
  }, [user]);

  return {
    suppliers,
    loading,
    error,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refreshSuppliers: loadSuppliers
  };
};
