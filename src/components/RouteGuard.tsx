
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/auth";
import AccessDenied from "./admin/AccessDenied";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredMenuKey?: string;
  requireAdminAccess?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requiredMenuKey, 
  requireAdminAccess = false 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { permissions, loading: permissionsLoading } = usePermissions();
  const navigate = useNavigate();
  const hasRedirectedRef = useRef(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Reset redirect flag when dependencies change
    hasRedirectedRef.current = false;
    setShowAccessDenied(false);
  }, [user?.id, permissions.hasAdminAccess, requiredMenuKey]);

  useEffect(() => {
    // Mark as not initial load after first permissions check
    if (!permissionsLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [permissionsLoading, isInitialLoad]);

  useEffect(() => {
    if (authLoading || permissionsLoading || hasRedirectedRef.current) return;

    console.log("=== ROUTE GUARD DEBUG ===");
    console.log("Current user:", {
      id: user?.id,
      email: user?.email,
      isAuthenticated: !!user
    });
    console.log("Permissions:", {
      hasAdminAccess: permissions.hasAdminAccess,
      allowedMenus: permissions.allowedMenus,
      requiredMenuKey,
      requireAdminAccess
    });
    console.log("========================");

    // Se não está autenticado, redirecionar para home
    if (!user) {
      console.log("Usuário não autenticado, redirecionando para home");
      hasRedirectedRef.current = true;
      navigate("/");
      return;
    }

    // Aguardar um ciclo após o carregamento inicial para evitar flash
    if (isInitialLoad) {
      return;
    }

    // Se requer acesso admin e usuário não tem
    if (requireAdminAccess && !permissions.hasAdminAccess) {
      console.log("Acesso negado: usuário não tem permissão admin");
      hasRedirectedRef.current = true;
      setShowAccessDenied(true);
      return;
    }

    // Se requer menu específico e usuário não tem acesso
    if (requiredMenuKey && permissions.allowedMenus.length > 0 && !permissions.allowedMenus.includes(requiredMenuKey)) {
      console.log(`Acesso negado: usuário não tem acesso ao menu ${requiredMenuKey}`);
      hasRedirectedRef.current = true;
      setShowAccessDenied(true);
      return;
    }

    console.log("Acesso permitido para usuário:", user.email);
  }, [
    user, 
    permissions.hasAdminAccess,
    permissions.allowedMenus,
    authLoading, 
    permissionsLoading, 
    navigate, 
    requiredMenuKey, 
    requireAdminAccess,
    isInitialLoad
  ]);

  // Mostrar loading enquanto verifica permissões ou durante carregamento inicial
  if (authLoading || permissionsLoading || isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se deve mostrar tela de acesso negado
  if (showAccessDenied) {
    return <AccessDenied />;
  }

  // Se não tem permissão, não renderizar nada (já mostrou acesso negado)
  if (requireAdminAccess && !permissions.hasAdminAccess) {
    return null;
  }

  if (requiredMenuKey && permissions.allowedMenus.length > 0 && !permissions.allowedMenus.includes(requiredMenuKey)) {
    return null;
  }

  return <>{children}</>;
};

export default RouteGuard;
