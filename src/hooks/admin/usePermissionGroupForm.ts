
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
        setName(permissionGroup.name || "");
        setDescription(permissionGroup.description || "");
        setIsAdmin(permissionGroup.is_admin || false);
        setAllowAdminAccess(permissionGroup.allow_admin_access || false);
        
        try {
          const menuData = await getPermissionGroupMenus(permissionGroup.id);
          const menuKeys = menuData.map((item: any) => item.menu_key);
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

  // Automaticamente habilitar acesso admin se for grupo admin
  useEffect(() => {
    if (isAdmin) {
      setAllowAdminAccess(true);
    }
  }, [isAdmin]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) return;
    
    try {
      setIsSubmitting(true);
      
      // CORREÇÃO PRINCIPAL: Distinguir entre admin completo e admin limitado
      let menusToSend: string[];
      
      if (isAdmin) {
        // Admin completo - não precisa de menus específicos
        menusToSend = [];
      } else {
        // Admin limitado ou usuário normal - preservar menus selecionados
        menusToSend = selectedMenus;
      }
      
      console.log("=== SUBMIT DEBUG ===");
      console.log("isAdmin:", isAdmin);
      console.log("allowAdminAccess:", allowAdminAccess);
      console.log("selectedMenus:", selectedMenus);
      console.log("menusToSend:", menusToSend);
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
    setSelectedMenus((prev) => {
      if (prev.includes(menuKey)) {
        return prev.filter(key => key !== menuKey);
      } else {
        return [...prev, menuKey];
      }
    });
  }, []);

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
