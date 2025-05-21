
import { useState } from "react";
import { initialPermissionGroups, studentMenuItems } from "@/data/permissionGroupsData";
import { PermissionGroup, PermissionGroupFormData } from "@/types/permission.types";
import { useToast } from "@/components/ui/use-toast";

export const usePermissionGroups = () => {
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(initialPermissionGroups);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get a single permission group by ID
  const getPermissionGroup = (id: number) => {
    return permissionGroups.find(group => group.id === id);
  };

  // Create a new permission group
  const createPermissionGroup = (data: PermissionGroupFormData) => {
    setLoading(true);
    
    try {
      const newGroup: PermissionGroup = {
        ...data,
        id: Math.max(0, ...permissionGroups.map(g => g.id)) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setPermissionGroups([...permissionGroups, newGroup]);
      
      toast({
        title: "Grupo de permissão criado",
        description: `O grupo "${data.name}" foi criado com sucesso.`,
        variant: "success"
      });
      
      return newGroup;
    } catch (error) {
      toast({
        title: "Erro ao criar grupo",
        description: "Ocorreu um erro ao criar o grupo de permissão.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing permission group
  const updatePermissionGroup = (id: number, data: PermissionGroupFormData) => {
    setLoading(true);
    
    try {
      const updatedGroups = permissionGroups.map(group => {
        if (group.id === id) {
          return {
            ...group,
            ...data,
            updatedAt: new Date().toISOString()
          };
        }
        return group;
      });
      
      setPermissionGroups(updatedGroups);
      
      toast({
        title: "Grupo de permissão atualizado",
        description: `O grupo "${data.name}" foi atualizado com sucesso.`,
        variant: "success"
      });
      
      return updatedGroups.find(group => group.id === id);
    } catch (error) {
      toast({
        title: "Erro ao atualizar grupo",
        description: "Ocorreu um erro ao atualizar o grupo de permissão.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a permission group
  const deletePermissionGroup = (id: number) => {
    setLoading(true);
    
    try {
      const group = permissionGroups.find(g => g.id === id);
      const updatedGroups = permissionGroups.filter(group => group.id !== id);
      
      setPermissionGroups(updatedGroups);
      
      toast({
        title: "Grupo de permissão excluído",
        description: `O grupo "${group?.name}" foi excluído com sucesso.`,
        variant: "success"
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erro ao excluir grupo",
        description: "Ocorreu um erro ao excluir o grupo de permissão.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    permissionGroups,
    loading,
    getPermissionGroup,
    createPermissionGroup,
    updatePermissionGroup,
    deletePermissionGroup,
    studentMenuItems
  };
};
