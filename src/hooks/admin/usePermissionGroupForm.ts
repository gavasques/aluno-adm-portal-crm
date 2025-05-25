
import { useState, useEffect, useCallback } from "react";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { useSystemMenus } from "@/hooks/admin/useSystemMenus";
import { recoveryModeUtils } from "@/hooks/auth/useRecoveryMode";

interface UsePermissionGroupFormProps {
  isEdit: boolean;
  permissionGroup?: any;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const usePermissionGroupForm = ({
  isEdit,
  permissionGroup,
  onOpenChange,
  onSuccess,
}: UsePermissionGroupFormProps) => {
  const { createPermissionGroup, updatePermissionGroup, getPermissionGroupMenus } = usePermissionGroups();
  const { systemMenus, isLoading: loadingMenus } = useSystemMenus();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [allowAdminAccess, setAllowAdminAccess] = useState(false);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingGroupData, setLoadingGroupData] = useState(isEdit);

  // Carregar dados do grupo para edição
  useEffect(() => {
    const loadGroupData = async () => {
      if (isEdit && permissionGroup) {
        console.log("=== LOADING GROUP DATA ===");
        console.log("permissionGroup:", permissionGroup);
        
        setName(permissionGroup.name || "");
        setDescription(permissionGroup.description || "");
        setIsAdmin(permissionGroup.is_admin || false);
        setAllowAdminAccess(permissionGroup.allow_admin_access || false);
        
        try {
          const menuData = await getPermissionGroupMenus(permissionGroup.id);
          const menuKeys = menuData.map((item: any) => item.menu_key);
          console.log("Menus carregados:", menuKeys);
          setSelectedMenus(menuKeys);
        } catch (error) {
          console.error("Erro ao carregar menus do grupo:", error);
        } finally {
          setLoadingGroupData(false);
        }
      } else {
        setLoadingGroupData(false);
      }
    };
    
    loadGroupData();
  }, [isEdit, permissionGroup, getPermissionGroupMenus]);

  // CORREÇÃO: Controlar comportamento do isAdmin vs allowAdminAccess
  useEffect(() => {
    console.log("=== ADMIN ACCESS EFFECT ===");
    console.log("isAdmin:", isAdmin);
    console.log("allowAdminAccess antes:", allowAdminAccess);
    console.log("selectedMenus antes:", selectedMenus);
    
    if (isAdmin) {
      // Se é admin completo, automaticamente habilita acesso admin
      setAllowAdminAccess(true);
      // IMPORTANTE: Para admin completo, limpamos os menus específicos
      console.log("Admin completo - limpando menus específicos");
      setSelectedMenus([]);
    }
    // IMPORTANTE: Não limpar menus quando apenas allowAdminAccess muda
    
    console.log("allowAdminAccess depois:", allowAdminAccess);
    console.log("selectedMenus depois:", selectedMenus);
    console.log("========================");
  }, [isAdmin]); // Remover allowAdminAccess da dependência

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) return;
    
    try {
      setIsSubmitting(true);
      
      // CORREÇÃO PRINCIPAL: Lógica clara para diferentes tipos de acesso
      let menusToSend: string[];
      
      console.log("=== SUBMIT DEBUG ===");
      console.log("isAdmin:", isAdmin);
      console.log("allowAdminAccess:", allowAdminAccess);
      console.log("selectedMenus:", selectedMenus);
      
      if (isAdmin) {
        // Admin completo - sem menus específicos (acesso total)
        menusToSend = [];
        console.log("Caso: Admin completo - enviando array vazio");
      } else {
        // Admin limitado ou usuário normal - preservar menus selecionados
        menusToSend = selectedMenus;
        console.log("Caso: Admin limitado/Usuário - preservando menus:", menusToSend);
      }
      
      console.log("menusToSend final:", menusToSend);
      console.log("===================");
      
      if (isEdit && permissionGroup) {
        await updatePermissionGroup({
          id: permissionGroup.id,
          name,
          description,
          is_admin: isAdmin,
          allow_admin_access: allowAdminAccess,
          menu_keys: menusToSend
        });
      } else {
        await createPermissionGroup({
          name,
          description,
          is_admin: isAdmin,
          allow_admin_access: allowAdminAccess,
          menu_keys: menusToSend
        });
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar grupo de permissão:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, description, isAdmin, allowAdminAccess, selectedMenus, isEdit, permissionGroup, createPermissionGroup, updatePermissionGroup, onSuccess, onOpenChange]);

  const handleMenuToggle = useCallback((menuKey: string) => {
    console.log("=== MENU TOGGLE ===");
    console.log("Toggling menu:", menuKey);
    console.log("isAdmin:", isAdmin);
    console.log("selectedMenus antes:", selectedMenus);
    
    // IMPORTANTE: Não permitir alteração de menus se for admin completo
    if (isAdmin) {
      console.log("Admin completo - toggle ignorado");
      return;
    }
    
    setSelectedMenus((prev) => {
      const newMenus = prev.includes(menuKey)
        ? prev.filter(key => key !== menuKey)
        : [...prev, menuKey];
      
      console.log("selectedMenus depois:", newMenus);
      console.log("==================");
      return newMenus;
    });
  }, [isAdmin]);

  // Log para monitorar mudanças de estado
  useEffect(() => {
    console.log("=== STATE CHANGE ===");
    console.log("isAdmin:", isAdmin);
    console.log("allowAdminAccess:", allowAdminAccess);
    console.log("selectedMenus:", selectedMenus);
    console.log("====================");
  }, [isAdmin, allowAdminAccess, selectedMenus]);

  const isLoading = loadingMenus || loadingGroupData;

  return {
    // Form state
    name,
    setName,
    description,
    setDescription,
    isAdmin,
    setIsAdmin,
    allowAdminAccess,
    setAllowAdminAccess,
    selectedMenus,
    isSubmitting,
    isLoading,
    systemMenus,
    // Handlers
    handleSubmit,
    handleMenuToggle,
  };
};
