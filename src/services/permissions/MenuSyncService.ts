
import { supabase } from '@/integrations/supabase/client';
import { BasePermissionService } from './BasePermissionService';
import { toast } from 'sonner';

interface SidebarMenuItem {
  key: string;
  label: string;
  description?: string;
  icon?: string;
}

export class MenuSyncService extends BasePermissionService {
  // Mapeamento dos menus do sidebar atual
  private readonly sidebarMenus: SidebarMenuItem[] = [
    // Admin menus
    { key: 'dashboard', label: 'Dashboard', description: 'Dashboard principal do sistema', icon: 'layout-dashboard' },
    { key: 'users', label: 'Usuários', description: 'Gerenciar usuários do sistema', icon: 'users' },
    { key: 'permissions', label: 'Permissões', description: 'Configurar grupos de permissão', icon: 'shield' },
    { key: 'suppliers', label: 'Fornecedores', description: 'Gerenciar fornecedores globais', icon: 'building' },
    { key: 'partners', label: 'Parceiros', description: 'Gerenciar parceiros', icon: 'handshake' },
    { key: 'tools', label: 'Ferramentas', description: 'Gerenciar ferramentas', icon: 'tool' },
    { key: 'students', label: 'Alunos', description: 'Gerenciar alunos', icon: 'graduation-cap' },
    { key: 'crm', label: 'CRM', description: 'Gestão de leads e oportunidades', icon: 'pipeline' },
    { key: 'courses', label: 'Cursos', description: 'Gerenciar cursos disponíveis', icon: 'graduation-cap' },
    { key: 'bonus', label: 'Bônus', description: 'Gerenciar sistema de bônus', icon: 'gift' },
    { key: 'tasks', label: 'Tarefas', description: 'Lista de tarefas do administrador', icon: 'check-square' },
    { key: 'credits', label: 'Gestão de Créditos', description: 'Controle e monitore o sistema de créditos', icon: 'credit-card' },
    { key: 'calendly-config', label: 'Configuração Calendly', description: 'Configurar integração com Calendly', icon: 'calendar' },
    { key: 'audit', label: 'Auditoria', description: 'Logs e auditoria do sistema', icon: 'shield' },
    
    // Mentoring submenus
    { key: 'mentoring-dashboard', label: 'Dashboard Mentorias', description: 'Visão geral das mentorias', icon: 'chart-bar' },
    { key: 'mentoring-catalog', label: 'Catálogo de Mentorias', description: 'Gerenciar catálogo de mentorias', icon: 'book-open' },
    { key: 'individual-enrollments', label: 'Inscrições Individuais', description: 'Gerenciar inscrições individuais', icon: 'user' },
    { key: 'group-enrollments', label: 'Inscrições em Grupo', description: 'Gerenciar inscrições em grupo', icon: 'users' },
    { key: 'mentoring-materials', label: 'Materiais de Mentoria', description: 'Gerenciar materiais das mentorias', icon: 'file-text' },
    
    // Student menus
    { key: 'my-suppliers', label: 'Meus Fornecedores', description: 'Fornecedores pessoais do usuário', icon: 'briefcase' },
    { key: 'settings', label: 'Configurações', description: 'Configurações do usuário', icon: 'settings' },
  ];

  async syncMenusWithDatabase(): Promise<{ added: number; updated: number; inconsistencies: string[] }> {
    try {
      console.log('🔄 Iniciando sincronização de menus...');
      
      // Buscar menus existentes na base
      const { data: existingMenus, error } = await supabase
        .from('system_menus')
        .select('*');

      if (error) throw error;

      const existingMenuKeys = new Set(existingMenus?.map(m => m.menu_key) || []);
      const sidebarMenuKeys = new Set(this.sidebarMenus.map(m => m.key));
      
      let added = 0;
      let updated = 0;
      const inconsistencies: string[] = [];

      // 1. Adicionar menus novos do sidebar
      const menusToAdd = this.sidebarMenus.filter(menu => !existingMenuKeys.has(menu.key));
      
      if (menusToAdd.length > 0) {
        const { error: insertError } = await supabase
          .from('system_menus')
          .insert(menusToAdd.map(menu => ({
            menu_key: menu.key,
            display_name: menu.label,
            description: menu.description,
            icon: menu.icon
          })));

        if (insertError) throw insertError;
        added = menusToAdd.length;
        console.log(`✅ Adicionados ${added} novos menus`);
      }

      // 2. Atualizar menus existentes com informações atualizadas
      for (const sidebarMenu of this.sidebarMenus) {
        const existingMenu = existingMenus?.find(m => m.menu_key === sidebarMenu.key);
        
        if (existingMenu && existingMenu.display_name !== sidebarMenu.label) {
          const { error: updateError } = await supabase
            .from('system_menus')
            .update({
              display_name: sidebarMenu.label,
              description: sidebarMenu.description,
              icon: sidebarMenu.icon
            })
            .eq('menu_key', sidebarMenu.key);

          if (updateError) throw updateError;
          updated++;
          console.log(`🔄 Atualizado menu: ${sidebarMenu.key}`);
        }
      }

      // 3. Detectar menus órfãos (na base mas não no sidebar)
      const orphanMenus = existingMenus?.filter(menu => !sidebarMenuKeys.has(menu.menu_key)) || [];
      if (orphanMenus.length > 0) {
        inconsistencies.push(`${orphanMenus.length} menu(s) órfão(s) encontrado(s): ${orphanMenus.map(m => m.menu_key).join(', ')}`);
      }

      // 4. Verificar grupos sem acesso aos novos menus
      if (added > 0) {
        await this.updateGroupPermissionsForNewMenus(menusToAdd.map(m => m.key));
      }

      console.log('✅ Sincronização concluída');
      return { added, updated, inconsistencies };

    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      throw error;
    }
  }

  private async updateGroupPermissionsForNewMenus(newMenuKeys: string[]): Promise<void> {
    try {
      // Buscar grupos admin que devem ter acesso automático aos novos menus
      const { data: adminGroups, error } = await supabase
        .from('permission_groups')
        .select('id')
        .eq('is_admin', true);

      if (error) throw error;

      if (adminGroups && adminGroups.length > 0) {
        const permissions = adminGroups.flatMap(group => 
          newMenuKeys.map(menuKey => ({
            permission_group_id: group.id,
            menu_key: menuKey
          }))
        );

        const { error: insertError } = await supabase
          .from('permission_group_menus')
          .insert(permissions);

        if (insertError) {
          console.warn('Aviso: Alguns grupos admin podem não ter recebido acesso aos novos menus:', insertError);
        } else {
          console.log(`✅ Grupos admin atualizados com ${newMenuKeys.length} novos menus`);
        }
      }
    } catch (error) {
      console.warn('Aviso: Erro ao atualizar permissões dos grupos admin:', error);
    }
  }

  async validateMenuConsistency(): Promise<{
    isConsistent: boolean;
    issues: string[];
    suggestions: string[];
  }> {
    try {
      const { data: dbMenus, error } = await supabase
        .from('system_menus')
        .select('*');

      if (error) throw error;

      const issues: string[] = [];
      const suggestions: string[] = [];

      const dbMenuKeys = new Set(dbMenus?.map(m => m.menu_key) || []);
      const sidebarMenuKeys = new Set(this.sidebarMenus.map(m => m.key));

      // Menus no sidebar mas não na base
      const missingInDb = this.sidebarMenus.filter(m => !dbMenuKeys.has(m.key));
      if (missingInDb.length > 0) {
        issues.push(`${missingInDb.length} menu(s) do sidebar não estão na base de dados`);
        suggestions.push('Execute a sincronização para adicionar os menus faltantes');
      }

      // Menus na base mas não no sidebar
      const orphanMenus = dbMenus?.filter(m => !sidebarMenuKeys.has(m.menu_key)) || [];
      if (orphanMenus.length > 0) {
        issues.push(`${orphanMenus.length} menu(s) órfão(s) na base de dados`);
        suggestions.push('Considere remover ou adicionar estes menus ao sidebar');
      }

      // Verificar nomes inconsistentes
      for (const sidebarMenu of this.sidebarMenus) {
        const dbMenu = dbMenus?.find(m => m.menu_key === sidebarMenu.key);
        if (dbMenu && dbMenu.display_name !== sidebarMenu.label) {
          issues.push(`Nome inconsistente para '${sidebarMenu.key}': sidebar='${sidebarMenu.label}', db='${dbMenu.display_name}'`);
          suggestions.push('Execute a sincronização para corrigir os nomes');
        }
      }

      return {
        isConsistent: issues.length === 0,
        issues,
        suggestions
      };

    } catch (error) {
      console.error('Erro na validação:', error);
      return {
        isConsistent: false,
        issues: ['Erro ao validar consistência'],
        suggestions: ['Verifique a conexão com a base de dados']
      };
    }
  }

  getSidebarMenus(): SidebarMenuItem[] {
    return this.sidebarMenus;
  }
}
