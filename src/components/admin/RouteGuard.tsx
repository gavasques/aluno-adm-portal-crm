
import { useAuth } from "@/hooks/auth";
import { useSimplePermissions } from "@/hooks/useSimplePermissions";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AccessDenied from "./AccessDenied";

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
  const { hasAdminAccess, allowedMenus, loading: permissionsLoading } = useSimplePermissions();
  const navigate = useNavigate();

  console.log("=== ADMIN ROUTE GUARD ===");
  console.log("Auth:", { hasUser: !!user, authLoading });
  console.log("Permissions:", { hasAdminAccess, allowedMenus, permissionsLoading });
  console.log("Required:", { requiredMenuKey, requireAdminAccess });
  console.log("==========================");

  useEffect(() => {
    // Se não está autenticado e não está carregando, redirecionar
    if (!authLoading && !user) {
      console.log("❌ Não autenticado, redirecionando");
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  // Mostrar loading
  if (authLoading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se não está autenticado, não renderizar
  if (!user) {
    return null;
  }

  // Verificar acesso admin
  if (requireAdminAccess && !hasAdminAccess) {
    console.log("❌ Sem acesso admin");
    return <AccessDenied />;
  }

  // Verificar menu específico
  if (requiredMenuKey && !hasAdminAccess && !allowedMenus.includes(requiredMenuKey)) {
    console.log("❌ Sem acesso ao menu:", requiredMenuKey);
    return <AccessDenied />;
  }

  console.log("✅ Acesso permitido");
  return <>{children}</>;
};

export default RouteGuard;
