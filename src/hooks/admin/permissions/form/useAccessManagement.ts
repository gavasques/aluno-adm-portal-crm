
import { useCallback } from "react";

interface UseAccessManagementProps {
  isAdmin: boolean;
  allowAdminAccess: boolean;
  setAllowAdminAccess: (value: boolean) => void;
}

export const useAccessManagement = ({
  isAdmin,
  allowAdminAccess,
  setAllowAdminAccess,
}: UseAccessManagementProps) => {
  // Handler customizado para allowAdminAccess (SEM dependência problemática)
  const handleAllowAdminAccessChange = useCallback((value: boolean) => {
    console.log("=== ALLOW ADMIN ACCESS CHANGE (FIXED) ===");
    console.log("Mudando allowAdminAccess de", allowAdminAccess, "para", value);
    console.log("isAdmin atual:", isAdmin);
    
    if (!isAdmin) {
      // Para usuários não-admin, apenas mudar o allowAdminAccess
      // SEM TOCAR nos menus selecionados - CRÍTICO!
      console.log("✅ Usuário não é admin completo - PRESERVANDO menus");
      setAllowAdminAccess(value);
      console.log("✅ allowAdminAccess alterado, menus preservados");
    } else {
      // Admin completo sempre tem allowAdminAccess = true
      console.log("⚠️ Admin completo - mantendo allowAdminAccess = true");
      setAllowAdminAccess(true);
    }
    
    console.log("==========================================");
  }, [isAdmin, allowAdminAccess, setAllowAdminAccess]);

  return {
    handleAllowAdminAccessChange,
  };
};
