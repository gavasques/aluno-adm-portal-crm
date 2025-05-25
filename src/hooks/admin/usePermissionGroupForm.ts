
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

  // Monitor de estado para debug (sem dependência problemática)
  useEffect(() => {
    console.log("=== STATE MONITOR (SAFE) ===");
    console.log("Estado atual:");
    console.log("- isAdmin:", isAdmin);
    console.log("- allowAdminAccess:", allowAdminAccess);
    console.log("- selectedMenus count:", selectedMenus.length);
    
    // VALIDAÇÃO DE CONSISTÊNCIA
    if (!isAdmin && allowAdminAccess && selectedMenus.length === 0) {
      console.warn("⚠️ INCONSISTÊNCIA: Admin limitado sem menus!");
    }
    if (isAdmin && selectedMenus.length > 0) {
      console.warn("⚠️ INCONSISTÊNCIA: Admin completo com menus específicos!");
    }
    console.log("============================");
  }, [isAdmin, allowAdminAccess, selectedMenus.length]);

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
