
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/hooks/auth/useSession';
import { toast } from 'sonner';
import { SupplierFormValues, MySupplier } from '@/types/my-suppliers.types';
import { createSupplierQuery, updateSupplierQuery, deleteSupplierQuery } from './queries';
import { transformSupplierData } from './utils';

export const useOptimizedOperations = () => {
  const { user } = useSession();
  const queryClient = useQueryClient();
  
  const createSupplierMutation = useMutation({
    mutationFn: async (data: SupplierFormValues) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const supplierData = {
        user_id: user.id,
        name: data.name,
        category: data.category,
        cnpj: data.cnpj || null,
        email: data.email || null,
        phone: data.phone || null,
        website: data.website || null,
        address: data.address || null,
        type: data.type
      };
      
      const result = await createSupplierQuery(supplierData);
      if (result.error) throw new Error(result.error.message);
      
      return transformSupplierData(result.data);
    },
    onSuccess: (newSupplier) => {
      // Optimistic update
      queryClient.setQueryData(['my-suppliers', user?.id], (oldData: MySupplier[] | undefined) => {
        if (!oldData) return [newSupplier];
        return [newSupplier, ...oldData];
      });
      
      toast.success('Fornecedor criado com sucesso!');
    },
    onError: (error: Error) => {
      console.error('Error creating supplier:', error);
      toast.error('Erro ao criar fornecedor');
    }
  });
  
  const updateSupplierMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MySupplier> }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const result = await updateSupplierQuery(id, user.id, updates);
      if (result.error) throw new Error(result.error.message);
      
      return transformSupplierData(result.data);
    },
    onSuccess: (updatedSupplier) => {
      // Optimistic update
      queryClient.setQueryData(['my-suppliers', user?.id], (oldData: MySupplier[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(supplier => 
          supplier.id === updatedSupplier.id ? updatedSupplier : supplier
        );
      });
      
      toast.success('Fornecedor atualizado com sucesso!');
    },
    onError: (error: Error) => {
      console.error('Error updating supplier:', error);
      toast.error('Erro ao atualizar fornecedor');
    }
  });
  
  const deleteSupplierMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const result = await deleteSupplierQuery(id, user.id);
      if (result.error) throw new Error(result.error.message);
      
      return id;
    },
    onSuccess: (deletedId) => {
      // Optimistic update
      queryClient.setQueryData(['my-suppliers', user?.id], (oldData: MySupplier[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.filter(supplier => supplier.id !== deletedId);
      });
      
      toast.success('Fornecedor excluído com sucesso!');
    },
    onError: (error: Error) => {
      console.error('Error deleting supplier:', error);
      toast.error('Erro ao excluir fornecedor');
    }
  });
  
  return {
    createSupplier: createSupplierMutation.mutateAsync,
    updateSupplier: (id: string, updates: Partial<MySupplier>) => 
      updateSupplierMutation.mutateAsync({ id, updates }),
    deleteSupplier: deleteSupplierMutation.mutateAsync,
    isCreating: createSupplierMutation.isPending,
    isUpdating: updateSupplierMutation.isPending,
    isDeleting: deleteSupplierMutation.isPending
  };
};
