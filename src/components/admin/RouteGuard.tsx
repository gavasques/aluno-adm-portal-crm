
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/auth";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredMenuKey?: string;
  requireAdminAccess?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requiredMenuKey, 
  requireAdminAccess = true 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { permissions, loading: permissionsLoading } = usePermissions();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || permissionsLoading) return;

    // Se não está autenticado, redirecionar para home
    if (!user) {
      navigate("/");
      return;
    }

    // Se requer acesso admin e usuário não tem
    if (requireAdminAccess && !permissions.hasAdminAccess) {
      console.log("Acesso negado: usuário não tem permissão admin");
      navigate("/student");
      return;
    }

    // Se requer menu específico e usuário não tem acesso
    if (requiredMenuKey && !permissions.allowedMenus.includes(requiredMenuKey)) {
      console.log(`Acesso negado: usuário não tem acesso ao menu ${requiredMenuKey}`);
      navigate("/student");
      return;
    }
  }, [
    user, 
    permissions, 
    authLoading, 
    permissionsLoading, 
    navigate, 
    requiredMenuKey, 
    requireAdminAccess
  ]);

  // Mostrar loading enquanto verifica permissões
  if (authLoading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se não tem permissão, não renderizar nada (já redirecionou)
  if (requireAdminAccess && !permissions.hasAdminAccess) {
    return null;
  }

  if (requiredMenuKey && !permissions.allowedMenus.includes(requiredMenuKey)) {
    return null;
  }

  return <>{children}</>;
};

export default RouteGuard;
