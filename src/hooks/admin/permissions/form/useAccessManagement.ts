
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
  // Handler para allowAdminAccess com validações de segurança APRIMORADAS
  const handleAllowAdminAccessChange = useCallback((value: boolean) => {
    console.log("=== ALLOW ADMIN ACCESS CHANGE (FINAL SAFE) ===");
    console.log("Mudando allowAdminAccess de", allowAdminAccess, "para", value);
    console.log("isAdmin atual:", isAdmin);
    
    if (!isAdmin) {
      // Para usuários não-admin completo, permitir alteração do allowAdminAccess
      // CRÍTICO: NÃO tocar nos menus aqui - eles devem ser preservados!
      console.log("✅ Usuário não é admin completo - alterando allowAdminAccess");
      console.log("🔒 GARANTINDO preservação dos menus selecionados");
      console.log("📝 IMPORTANTE: Esta mudança NÃO deve afetar selectedMenus");
      setAllowAdminAccess(value);
      
      if (value) {
        console.log("🟡 Usuário agora é ADMIN LIMITADO - menus PRESERVADOS");
      } else {
        console.log("🔵 Usuário voltou a ser USUÁRIO NORMAL - menus PRESERVADOS");
      }
    } else {
      // Admin completo sempre tem allowAdminAccess = true
      console.log("⚠️ Admin completo - mantendo allowAdminAccess = true");
      setAllowAdminAccess(true);
    }
    
    console.log("===============================================");
  }, [isAdmin, allowAdminAccess, setAllowAdminAccess]);

  return {
    handleAllowAdminAccessChange,
  };
};
