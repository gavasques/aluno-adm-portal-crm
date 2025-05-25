
import { useEffect } from "react";
import { useSystemMenus } from "@/hooks/admin/useSystemMenus";
import { useFormState } from "./permissions/form/useFormState";
import { useMenuManagement } from "./permissions/form/useMenuManagement";
import { useAccessManagement } from "./permissions/form/useAccessManagement";
import { useFormSubmission } from "./permissions/form/useFormSubmission";

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
  const { systemMenus, isLoading: loadingMenus } = useSystemMenus();
  
  // Form state management
  const {
    name,
    setName,
    description,
    setDescription,
    isAdmin,
    setIsAdmin,
    allowAdminAccess,
    setAllowAdminAccess,
    selectedMenus,
    setSelectedMenus,
    isSubmitting,
    setIsSubmitting,
    loadingGroupData,
    setLoadingGroupData,
  } = useFormState({ isEdit, permissionGroup });

  // Menu management
  const { handleMenuToggle } = useMenuManagement({
    isEdit,
    permissionGroup,
    isAdmin,
    selectedMenus,
    setSelectedMenus,
    setLoadingGroupData,
  });

  // Access management
  const { handleAllowAdminAccessChange } = useAccessManagement({
    isAdmin,
    allowAdminAccess,
    setAllowAdminAccess,
  });

  // Form submission
  const { handleSubmit } = useFormSubmission({
    isEdit,
    permissionGroup,
    name,
    description,
    isAdmin,
    allowAdminAccess,
    selectedMenus,
    setIsSubmitting,
    onSuccess,
    onOpenChange,
  });

  // Monitor de estado para debug e validação de consistência
  useEffect(() => {
    console.log("=== STATE MONITOR (CONSISTENCY CHECK) ===");
    console.log("Estado atual:");
    console.log("- isAdmin:", isAdmin);
    console.log("- allowAdminAccess:", allowAdminAccess);
    console.log("- selectedMenus count:", selectedMenus.length);
    console.log("- isEdit:", isEdit);
    
    // VALIDAÇÃO DE CONSISTÊNCIA CRÍTICA
    if (!isAdmin && allowAdminAccess && selectedMenus.length === 0) {
      console.warn("⚠️ INCONSISTÊNCIA DETECTADA: Admin limitado sem menus!");
      console.warn("📋 Isso pode indicar perda acidental de menus");
    }
    if (isAdmin && selectedMenus.length > 0) {
      console.warn("⚠️ INCONSISTÊNCIA: Admin completo com menus específicos!");
    }
    
    // PROTEÇÃO ADICIONAL: Verificar se é edição de grupo existente
    if (isEdit && permissionGroup) {
      console.log("🛡️ MODO EDIÇÃO ATIVO:");
      console.log("- Grupo:", permissionGroup.name);
      console.log("- ID:", permissionGroup.id);
      console.log("- is_admin original:", permissionGroup.is_admin);
      console.log("- allow_admin_access original:", permissionGroup.allow_admin_access);
    }
    
    console.log("=========================================");
  }, [isAdmin, allowAdminAccess, selectedMenus.length, isEdit, permissionGroup]);

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
    setAllowAdminAccess: handleAllowAdminAccessChange,
    selectedMenus,
    isSubmitting,
    isLoading,
    systemMenus,
    // Handlers
    handleSubmit,
    handleMenuToggle,
  };
};
