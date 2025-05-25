
import { useEffect, useCallback } from "react";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";

interface UseMenuManagementProps {
  isEdit: boolean;
  permissionGroup?: any;
  isAdmin: boolean;
  selectedMenus: string[];
  setSelectedMenus: React.Dispatch<React.SetStateAction<string[]>>;
  setLoadingGroupData: (loading: boolean) => void;
}

export const useMenuManagement = ({
  isEdit,
  permissionGroup,
  isAdmin,
  selectedMenus,
  setSelectedMenus,
  setLoadingGroupData,
}: UseMenuManagementProps) => {
  const { getPermissionGroupMenus } = usePermissionGroups();

  // Carregar menus do grupo para edição
  useEffect(() => {
    const loadGroupMenus = async () => {
      if (isEdit && permissionGroup?.id) {
        try {
          setLoadingGroupData(true);
          const menuData = await getPermissionGroupMenus(permissionGroup.id);
          const menuKeys = menuData.map((item: any) => item.menu_key);
          
          console.log("=== LOADING GROUP MENUS FOR EDIT ===");
          console.log("Grupo:", permissionGroup.name);
          console.log("is_admin:", permissionGroup.is_admin);
          console.log("allow_admin_access:", permissionGroup.allow_admin_access);
          console.log("Menus carregados:", menuKeys);
          console.log("===================================");
          
          setSelectedMenus(menuKeys);
        } catch (error) {
          console.error("❌ Erro ao carregar menus do grupo:", error);
          setSelectedMenus([]);
        } finally {
          setLoadingGroupData(false);
        }
      }
    };

    loadGroupMenus();
  }, [isEdit, permissionGroup?.id, getPermissionGroupMenus, setSelectedMenus, setLoadingGroupData]);

  // Comportamento para mudanças de admin - APENAS para admin completo
  useEffect(() => {
    console.log("=== ADMIN BEHAVIOR EFFECT (FINAL FIX) ===");
    console.log("isAdmin mudou para:", isAdmin);
    
    if (isAdmin) {
      // APENAS admin completo (isAdmin = true) deve limpar menus
      console.log("🔴 ADMIN COMPLETO: Limpando menus (acesso total)");
      setSelectedMenus([]);
      console.log("✅ Menus limpos para admin completo");
    } else {
      console.log("🟡 NÃO é admin completo - menus preservados");
    }
    
    console.log("==========================================");
  }, [isAdmin, setSelectedMenus]);

  const handleMenuToggle = useCallback((menuKey: string) => {
    console.log("=== MENU TOGGLE (SAFE) ===");
    console.log("Toggling menu:", menuKey);
    console.log("isAdmin:", isAdmin);
    
    // PROTEÇÃO: Não permitir alteração se for admin completo
    if (isAdmin) {
      console.log("🔴 Admin completo - toggle bloqueado (acesso total)");
      return;
    }
    
    // Para admin limitado e usuário normal, permitir toggle
    setSelectedMenus((prev) => {
      const newMenus = prev.includes(menuKey)
        ? prev.filter(key => key !== menuKey)
        : [...prev, menuKey];
      
      console.log("✅ selectedMenus atualizado:", newMenus.length, "menus");
      console.log("===========================");
      return newMenus;
    });
  }, [isAdmin, setSelectedMenus]);

  return {
    handleMenuToggle,
  };
};
