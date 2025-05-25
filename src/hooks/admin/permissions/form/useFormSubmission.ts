
import { useCallback } from "react";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";

interface UseFormSubmissionProps {
  isEdit: boolean;
  permissionGroup?: any;
  name: string;
  description: string;
  isAdmin: boolean;
  allowAdminAccess: boolean;
  selectedMenus: string[];
  setIsSubmitting: (submitting: boolean) => void;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useFormSubmission = ({
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
}: UseFormSubmissionProps) => {
  const { createPermissionGroup, updatePermissionGroup } = usePermissionGroups();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) return;
    
    try {
      setIsSubmitting(true);
      
      // VALIDAÇÃO CRÍTICA: Verificar estado antes do submit
      let menusToSend: string[];
      
      console.log("=== SUBMIT VALIDATION (FIXED) ===");
      console.log("Estado final antes do submit:");
      console.log("- isAdmin:", isAdmin);
      console.log("- allowAdminAccess:", allowAdminAccess);
      console.log("- selectedMenus count:", selectedMenus.length);
      console.log("- selectedMenus:", selectedMenus);
      
      if (isAdmin) {
        // Admin completo - sem menus específicos (acesso total)
        menusToSend = [];
        console.log("✅ SUBMIT: Admin completo - enviando array vazio");
      } else {
        // Admin limitado ou usuário normal - preservar menus selecionados
        menusToSend = [...selectedMenus]; // Clonar array para segurança
        console.log("✅ SUBMIT: Admin limitado/usuário normal - preservando menus:", menusToSend.length);
        
        // VALIDAÇÃO FINAL: Verificar inconsistências
        if (allowAdminAccess && selectedMenus.length === 0) {
          console.warn("⚠️ ATENÇÃO: Admin limitado sem menus selecionados!");
        }
      }
      
      console.log("menusToSend final para backend:", menusToSend.length, "menus");
      console.log("=================================");
      
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
      console.error("❌ Erro ao salvar grupo de permissão:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    name, 
    description, 
    isAdmin, 
    allowAdminAccess, 
    selectedMenus, 
    isEdit, 
    permissionGroup, 
    createPermissionGroup, 
    updatePermissionGroup, 
    onSuccess, 
    onOpenChange,
    setIsSubmitting
  ]);

  return {
    handleSubmit,
  };
};
