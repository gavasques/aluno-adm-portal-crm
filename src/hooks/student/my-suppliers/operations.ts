
import { toast } from "sonner";
import { MySupplier, SupplierFormValues } from "@/types/my-suppliers.types";
import { withTimeout, transformSupplierData, createSupplierData } from "./utils";
import { createSupplierQuery, updateSupplierQuery, deleteSupplierQuery } from "./queries";

export const useSupplierOperations = (
  user: any,
  canMakeRequest: () => boolean,
  recordSuccess: () => void,
  recordError: () => void,
  setSuppliers: React.Dispatch<React.SetStateAction<MySupplier[]>>
) => {
  const createSupplier = async (data: SupplierFormValues): Promise<MySupplier | null> => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return null;
    }

    if (!canMakeRequest()) {
      toast.error('Não é possível criar fornecedor no momento');
      return null;
    }

    try {
      console.log('Creating supplier:', data);

      const supplierData = createSupplierData(data, user.id);
      const createQueryResult = await withTimeout(createSupplierQuery(supplierData)) as any;

      if (createQueryResult.error) {
        console.error('Error creating supplier:', createQueryResult.error);
        throw new Error(`Erro ao criar fornecedor: ${createQueryResult.error.message}`);
      }

      console.log('Supplier created successfully:', createQueryResult.data);

      const transformedSupplier = transformSupplierData(createQueryResult.data);
      setSuppliers(prev => [transformedSupplier, ...prev]);
      toast.success(`${data.name} foi adicionado com sucesso.`);
      recordSuccess();
      
      return transformedSupplier;
    } catch (err: any) {
      console.error('Error creating supplier:', err);
      recordError();
      toast.error(err.message || 'Erro ao criar fornecedor');
      return null;
    }
  };

  const updateSupplier = async (id: string, updates: Partial<MySupplier>): Promise<MySupplier | null> => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return null;
    }

    if (!canMakeRequest()) {
      toast.error('Não é possível atualizar fornecedor no momento');
      return null;
    }

    try {
      console.log('Updating supplier:', id, updates);

      const updateQueryResult = await withTimeout(updateSupplierQuery(id, user.id, updates)) as any;

      if (updateQueryResult.error) {
        console.error('Error updating supplier:', updateQueryResult.error);
        throw new Error(`Erro ao atualizar fornecedor: ${updateQueryResult.error.message}`);
      }

      console.log('Supplier updated successfully:', updateQueryResult.data);

      const transformedSupplier = transformSupplierData(updateQueryResult.data);
      setSuppliers(prev => prev.map(supplier => 
        supplier.id === id ? transformedSupplier : supplier
      ));

      toast.success('Fornecedor atualizado com sucesso!');
      recordSuccess();
      return transformedSupplier;
    } catch (err: any) {
      console.error('Error updating supplier:', err);
      recordError();
      toast.error(err.message || 'Erro ao atualizar fornecedor');
      return null;
    }
  };

  const deleteSupplier = async (id: string): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return false;
    }

    if (!canMakeRequest()) {
      toast.error('Não é possível excluir fornecedor no momento');
      return false;
    }

    try {
      console.log('Deleting supplier:', id);

      const deleteQueryResult = await withTimeout(deleteSupplierQuery(id, user.id)) as any;

      if (deleteQueryResult.error) {
        console.error('Error deleting supplier:', deleteQueryResult.error);
        throw new Error(`Erro ao excluir fornecedor: ${deleteQueryResult.error.message}`);
      }

      console.log('Supplier deleted successfully');

      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      toast.success('Fornecedor excluído com sucesso.');
      recordSuccess();
      return true;
    } catch (err: any) {
      console.error('Error deleting supplier:', err);
      recordError();
      toast.error(err.message || 'Erro ao excluir fornecedor');
      return false;
    }
  };

  return {
    createSupplier,
    updateSupplier,
    deleteSupplier
  };
};
