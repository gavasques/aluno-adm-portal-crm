
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
  // Handler para allowAdminAccess com validações de segurança
  const handleAllowAdminAccessChange = useCallback((value: boolean) => {
    console.log("=== ALLOW ADMIN ACCESS CHANGE (SAFE) ===");
    console.log("Mudando allowAdminAccess de", allowAdminAccess, "para", value);
    console.log("isAdmin atual:", isAdmin);
    
    if (!isAdmin) {
      // Para usuários não-admin completo, permitir alteração do allowAdminAccess
      // IMPORTANTE: NÃO tocar nos menus aqui - eles devem ser preservados!
      console.log("✅ Usuário não é admin completo - alterando allowAdminAccess");
      console.log("🔒 PRESERVANDO menus selecionados (não alterados aqui)");
      setAllowAdminAccess(value);
      
      if (value) {
        console.log("🟡 Usuário agora é ADMIN LIMITADO - menus preservados");
      } else {
        console.log("🔵 Usuário voltou a ser USUÁRIO NORMAL - menus preservados");
      }
    } else {
      // Admin completo sempre tem allowAdminAccess = true
      console.log("⚠️ Admin completo - mantendo allowAdminAccess = true");
      setAllowAdminAccess(true);
    }
    
    console.log("========================================");
  }, [isAdmin, allowAdminAccess, setAllowAdminAccess]);

  return {
    handleAllowAdminAccessChange,
  };
};
