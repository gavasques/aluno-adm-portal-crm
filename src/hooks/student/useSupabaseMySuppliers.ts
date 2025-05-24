
import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/hooks/auth/useSession";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MySupplier, SupplierFormValues } from "@/types/my-suppliers.types";

export const useSupabaseMySuppliers = () => {
  const { user } = useSession();
  const [suppliers, setSuppliers] = useState<MySupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Função auxiliar para delay em retry
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Função auxiliar para verificar se o usuário está autenticado
  const checkAuthAndUser = useCallback(() => {
    if (!user?.id) {
      console.log("User not authenticated or user.id is missing");
      setLoading(false);
      setError("Usuário não autenticado");
      return false;
    }
    return true;
  }, [user]);

  // Carregar fornecedores do usuário com retry logic
  const loadSuppliers = useCallback(async (retryAttempt = 0) => {
    if (!checkAuthAndUser()) return;

    try {
      setError(null);
      console.log(`Loading suppliers for user: ${user!.id}, attempt: ${retryAttempt + 1}`);

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
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (suppliersError) {
        console.error('Supabase error loading suppliers:', suppliersError);
        throw new Error(`Erro do banco de dados: ${suppliersError.message}`);
      }

      console.log(`Successfully loaded ${suppliersData?.length || 0} suppliers`);

      // Transformar dados para o formato esperado
      const transformedSuppliers: MySupplier[] = (suppliersData || []).map(supplier => ({
        ...supplier,
        files: [],
        images: []
      }));

      setSuppliers(transformedSuppliers);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      console.error(`Error loading suppliers (attempt ${retryAttempt + 1}):`, err);
      
      // Se ainda há tentativas restantes, tenta novamente
      if (retryAttempt < MAX_RETRIES) {
        const backoffDelay = Math.pow(2, retryAttempt) * 1000; // Exponential backoff
        console.log(`Retrying in ${backoffDelay}ms...`);
        await delay(backoffDelay);
        return loadSuppliers(retryAttempt + 1);
      }
      
      // Se esgotou as tentativas
      const errorMessage = err.message || 'Erro desconhecido ao carregar fornecedores';
      setError(errorMessage);
      setRetryCount(retryAttempt + 1);
      
      if (!err.message?.includes('Failed to fetch')) {
        toast.error('Erro ao carregar fornecedores');
      }
    } finally {
      setLoading(false);
    }
  }, [user, checkAuthAndUser]);

  // Criar novo fornecedor
  const createSupplier = async (data: SupplierFormValues): Promise<MySupplier | null> => {
    if (!checkAuthAndUser()) {
      toast.error('Usuário não autenticado');
      return null;
    }

    try {
      console.log('Creating supplier:', data);

      const supplierData = {
        user_id: user!.id,
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
        throw new Error(`Erro ao criar fornecedor: ${error.message}`);
      }

      console.log('Supplier created successfully:', newSupplier);

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
      toast.error(err.message || 'Erro ao criar fornecedor');
      return null;
    }
  };

  // Atualizar fornecedor
  const updateSupplier = async (id: string, updates: Partial<MySupplier>): Promise<MySupplier | null> => {
    if (!checkAuthAndUser()) {
      toast.error('Usuário não autenticado');
      return null;
    }

    try {
      console.log('Updating supplier:', id, updates);

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
        .eq('user_id', user!.id)
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
        throw new Error(`Erro ao atualizar fornecedor: ${error.message}`);
      }

      console.log('Supplier updated successfully:', updatedSupplier);

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
      toast.error(err.message || 'Erro ao atualizar fornecedor');
      return null;
    }
  };

  // Deletar fornecedor
  const deleteSupplier = async (id: string): Promise<boolean> => {
    if (!checkAuthAndUser()) {
      toast.error('Usuário não autenticado');
      return false;
    }

    try {
      console.log('Deleting supplier:', id);

      const { error } = await supabase
        .from('my_suppliers')
        .delete()
        .eq('id', id)
        .eq('user_id', user!.id);

      if (error) {
        console.error('Error deleting supplier:', error);
        throw new Error(`Erro ao excluir fornecedor: ${error.message}`);
      }

      console.log('Supplier deleted successfully');

      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      toast.success('Fornecedor excluído com sucesso.');
      return true;
    } catch (err: any) {
      console.error('Error deleting supplier:', err);
      toast.error(err.message || 'Erro ao excluir fornecedor');
      return false;
    }
  };

  // Carregar fornecedores quando o usuário muda
  useEffect(() => {
    if (user?.id) {
      console.log('User available, loading suppliers...');
      loadSuppliers();
    } else {
      console.log('No user available, clearing suppliers...');
      setSuppliers([]);
      setLoading(false);
      setError(null);
    }
  }, [user?.id, loadSuppliers]);

  return {
    suppliers,
    loading,
    error,
    retryCount,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refreshSuppliers: () => loadSuppliers(0)
  };
};
