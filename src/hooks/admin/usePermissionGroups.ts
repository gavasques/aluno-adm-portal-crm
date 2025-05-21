
import { useState } from "react";
import { initialPermissionGroups, studentMenuItems } from "@/data/permissionGroupsData";
import { PermissionGroup, PermissionGroupFormData } from "@/types/permission.types";
import { useToast } from "@/components/ui/use-toast";
import { USERS } from "@/data/users";

export const usePermissionGroups = () => {
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(initialPermissionGroups);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Estado para os usuários que vamos manipular
  const [users, setUsers] = useState(USERS);

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
        variant: "default"
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
        variant: "default"
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
      
      // Remover todos os usuários deste grupo (definir permissionGroupId como undefined)
      const updatedUsers = users.map(user => {
        if (user.permissionGroupId === id) {
          return { ...user, permissionGroupId: undefined };
        }
        return user;
      });
      
      setPermissionGroups(updatedGroups);
      setUsers(updatedUsers);
      
      // Atualiza o USERS global para refletir as mudanças
      for (let i = 0; i < USERS.length; i++) {
        if (USERS[i].permissionGroupId === id) {
          USERS[i].permissionGroupId = undefined;
        }
      }
      
      toast({
        title: "Grupo de permissão excluído",
        description: `O grupo "${group?.name}" foi excluído com sucesso.`,
        variant: "default"
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
  
  // Adiciona um usuário a um grupo de permissão
  const addUserToGroup = (userId: number, groupId: number) => {
    // Atualiza o usuário no array local
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, permissionGroupId: groupId };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    // Atualiza o USERS global para refletir as mudanças
    const userIndex = USERS.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      USERS[userIndex].permissionGroupId = groupId;
    }
    
    return true;
  };
  
  // Remove um usuário de qualquer grupo
  const removeUserFromGroup = (userId: number) => {
    // Atualiza o usuário no array local
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, permissionGroupId: undefined };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    // Atualiza o USERS global para refletir as mudanças
    const userIndex = USERS.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      USERS[userIndex].permissionGroupId = undefined;
    }
    
    return true;
  };

  return {
    permissionGroups,
    loading,
    users,
    getPermissionGroup,
    createPermissionGroup,
    updatePermissionGroup,
    deletePermissionGroup,
    addUserToGroup,
    removeUserFromGroup,
    studentMenuItems
  };
};
