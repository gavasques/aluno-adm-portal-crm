
import { supabase } from '@/integrations/supabase/client';
import { BasePermissionService } from './BasePermissionService';
import { PermissionGroupModel } from '@/models/permissions';
import type {
  IPermissionGroupService,
  PermissionGroup,
  CreatePermissionGroupData,
  UpdatePermissionGroupData,
  PermissionOperationResult,
  SystemModule,
  ModulePermissionData,
} from '@/types/permissions';

export class PermissionGroupService extends BasePermissionService implements IPermissionGroupService {
  async getAll(): Promise<PermissionGroup[]> {
    const result = await this.executeWithErrorHandling(async () => {
      const { data, error } = await supabase
        .from("permission_groups")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    }, "buscar grupos de permissão");

    return result || [];
  }

  async getById(id: string): Promise<PermissionGroup | null> {
    const result = await this.executeWithErrorHandling(async () => {
      const { data, error } = await supabase
        .from("permission_groups")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    }, "buscar grupo de permissão");

    return result;
  }

  async create(data: CreatePermissionGroupData): Promise<PermissionOperationResult> {
    try {
      console.log("=== PERMISSION GROUP SERVICE: CREATE ===");
      console.log("Dados recebidos:", data);

      // Criar o grupo
      const { data: newGroup, error: groupError } = await supabase
        .from("permission_groups")
        .insert({
          name: data.name,
          description: data.description,
          is_admin: data.is_admin,
          allow_admin_access: data.allow_admin_access,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      console.log("Grupo criado:", newGroup);

      // Se não é admin e tem menus, associar os menus
      if (!data.is_admin && data.menu_keys?.length > 0) {
        const menuInserts = data.menu_keys.map(menuKey => ({
          permission_group_id: newGroup.id,
          menu_key: menuKey,
        }));

        const { error: menuError } = await supabase
          .from("permission_group_menus")
          .insert(menuInserts);

        if (menuError) {
          console.error("Erro ao associar menus:", menuError);
          // Tentar remover o grupo criado em caso de erro
          await supabase.from("permission_groups").delete().eq("id", newGroup.id);
          throw menuError;
        }

        console.log("Menus associados:", data.menu_keys);
      }

      console.log("=== CREATE CONCLUÍDO COM SUCESSO ===");

      return this.handleSuccess("Grupo de permissão criado com sucesso", newGroup);
    } catch (error) {
      return this.handleError(error, "criar grupo de permissão");
    }
  }

  async update(data: UpdatePermissionGroupData): Promise<PermissionOperationResult> {
    try {
      console.log("=== PERMISSION GROUP SERVICE: UPDATE ===");
      console.log("Dados recebidos:", data);

      // Atualizar o grupo
      const { error: groupError } = await supabase
        .from("permission_groups")
        .update({
          name: data.name,
          description: data.description,
          is_admin: data.is_admin,
          allow_admin_access: data.allow_admin_access,
        })
        .eq("id", data.id);

      if (groupError) throw groupError;

      console.log("Grupo atualizado");

      // Gerenciar menus
      await this.updateGroupMenus(data.id, data.menu_keys || []);

      console.log("=== UPDATE CONCLUÍDO COM SUCESSO ===");

      return this.handleSuccess("Grupo de permissão atualizado com sucesso");
    } catch (error) {
      return this.handleError(error, "atualizar grupo de permissão");
    }
  }

  async delete(id: string): Promise<PermissionOperationResult> {
    try {
      // Verificar se há usuários vinculados
      const { data: users, error: usersError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("permission_group_id", id);

      if (usersError) throw usersError;

      if (users && users.length > 0) {
        return {
          success: false,
          error: `Não é possível excluir o grupo. Há ${users.length} usuário(s) vinculado(s).`,
        };
      }

      // Remover associações de menus
      await supabase
        .from("permission_group_menus")
        .delete()
        .eq("permission_group_id", id);

      // Remover associações de módulos
      await supabase
        .from("permission_group_modules")
        .delete()
        .eq("permission_group_id", id);

      // Remover o grupo
      const { error } = await supabase
        .from("permission_groups")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return this.handleSuccess("Grupo de permissão removido com sucesso");
    } catch (error) {
      return this.handleError(error, "remover grupo de permissão");
    }
  }

  async getGroupMenus(groupId: string): Promise<string[]> {
    const result = await this.executeWithErrorHandling(async () => {
      const { data, error } = await supabase
        .from("permission_group_menus")
        .select("menu_key")
        .eq("permission_group_id", groupId);

      if (error) throw error;
      return data.map(item => item.menu_key);
    }, "buscar menus do grupo");

    return result || [];
  }

  async updateGroupMenus(groupId: string, menuKeys: string[]): Promise<PermissionOperationResult> {
    try {
      // Remover menus existentes
      await supabase
        .from("permission_group_menus")
        .delete()
        .eq("permission_group_id", groupId);

      // Adicionar novos menus
      if (menuKeys.length > 0) {
        const menuInserts = menuKeys.map(menuKey => ({
          permission_group_id: groupId,
          menu_key: menuKey,
        }));

        const { error } = await supabase
          .from("permission_group_menus")
          .insert(menuInserts);

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      return this.handleError(error, "atualizar menus do grupo");
    }
  }

  async getGroupUsers(groupId: string): Promise<any[]> {
    const result = await this.executeWithErrorHandling(async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, role")
        .eq("permission_group_id", groupId);

      if (error) throw error;
      return data || [];
    }, "buscar usuários do grupo");

    return result || [];
  }

  async removeUserFromGroup(userId: string): Promise<PermissionOperationResult> {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ permission_group_id: null })
        .eq("id", userId);

      if (error) throw error;

      return this.handleSuccess("Usuário removido do grupo com sucesso");
    } catch (error) {
      return this.handleError(error, "remover usuário do grupo");
    }
  }

  async getGroupModulePermissions(groupId: string, modules: SystemModule[]): Promise<ModulePermissionData[]> {
    const result = await this.executeWithErrorHandling(async () => {
      const { data, error } = await supabase
        .from("permission_group_modules")
        .select("module_id, action_id, granted")
        .eq("permission_group_id", groupId);

      if (error) throw error;

      // Mapear para o formato esperado
      return modules.map(module => ({
        module_id: module.id,
        module_key: module.module_key,
        module_name: module.module_name,
        actions: module.actions.map(action => {
          const permission = data?.find(p => p.module_id === module.id && p.action_id === action.id);
          return {
            action_id: action.id,
            action_key: action.action_key,
            action_name: action.action_name,
            granted: permission?.granted || false,
          };
        }),
      }));
    }, "buscar permissões modulares do grupo");

    return result || [];
  }

  async saveGroupModulePermissions(groupId: string, permissions: ModulePermissionData[]): Promise<PermissionOperationResult> {
    try {
      // Remover permissões existentes
      await supabase
        .from("permission_group_modules")
        .delete()
        .eq("permission_group_id", groupId);

      // Preparar inserções
      const inserts = permissions.flatMap(module =>
        module.actions.map(action => ({
          permission_group_id: groupId,
          module_id: module.module_id,
          action_id: action.action_id,
          granted: action.granted,
        }))
      );

      if (inserts.length > 0) {
        const { error } = await supabase
          .from("permission_group_modules")
          .insert(inserts);

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      return this.handleError(error, "salvar permissões modulares");
    }
  }
}
