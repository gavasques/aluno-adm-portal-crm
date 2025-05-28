
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/auth";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import AccessDenied from "./admin/AccessDenied";
import BannedUserAccess from "./admin/BannedUserAccess";

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
  const { permissionGroups, isLoading: groupsLoading } = usePermissionGroups();
  const navigate = useNavigate();
  const hasRedirectedRef = useRef(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [showBannedAccess, setShowBannedAccess] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Reset redirect flag when dependencies change
    hasRedirectedRef.current = false;
    setShowAccessDenied(false);
    setShowBannedAccess(false);
  }, [user?.id, permissions.hasAdminAccess, requiredMenuKey]);

  useEffect(() => {
    // Mark as not initial load after first permissions check
    if (!permissionsLoading && !groupsLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [permissionsLoading, groupsLoading, isInitialLoad]);

  useEffect(() => {
    if (authLoading || permissionsLoading || groupsLoading || hasRedirectedRef.current) return;

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

    // Se não está autenticado, redirecionar para login
    if (!user) {
      console.log("Usuário não autenticado, redirecionando para login");
      hasRedirectedRef.current = true;
      navigate("/login");
      return;
    }

    // Aguardar um ciclo após o carregamento inicial para evitar flash
    if (isInitialLoad) {
      return;
    }

    // Verificar se o usuário está banido
    if (user && permissionGroups.length > 0) {
      // Buscar informações do usuário no perfil para verificar grupo de permissão
      const userProfile = user as any; // O perfil completo deve estar disponível
      if (userProfile.permission_group_id) {
        const userGroup = permissionGroups.find(g => g.id === userProfile.permission_group_id);
        if (userGroup?.name.toLowerCase() === "banido") {
          console.log("Usuário banido detectado, mostrando tela de acesso negado");
          hasRedirectedRef.current = true;
          setShowBannedAccess(true);
          return;
        }
      }
    }

    // Se requer acesso admin e usuário não tem
    if (requireAdminAccess && !permissions.hasAdminAccess) {
      console.log("Acesso negado: usuário não tem permissão admin");
      hasRedirectedRef.current = true;
      setShowAccessDenied(true);
      return;
    }

    // Se requer menu específico, verificar permissão
    // IMPORTANTE: Admins têm acesso automático a todos os menus
    if (requiredMenuKey && !permissions.hasAdminAccess) {
      // Só verificar permissões específicas se não for admin
      if (permissions.allowedMenus.length > 0 && !permissions.allowedMenus.includes(requiredMenuKey)) {
        console.log(`Acesso negado: usuário não tem acesso ao menu ${requiredMenuKey}`);
        hasRedirectedRef.current = true;
        setShowAccessDenied(true);
        return;
      }
    }

    console.log("Acesso permitido para usuário:", user.email);
  }, [
    user, 
    permissions.hasAdminAccess,
    permissions.allowedMenus,
    authLoading, 
    permissionsLoading,
    groupsLoading,
    permissionGroups,
    navigate, 
    requiredMenuKey, 
    requireAdminAccess,
    isInitialLoad
  ]);

  // Mostrar loading enquanto verifica permissões ou durante carregamento inicial
  if (authLoading || permissionsLoading || groupsLoading || isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se deve mostrar tela de usuário banido
  if (showBannedAccess) {
    return <BannedUserAccess />;
  }

  // Se deve mostrar tela de acesso negado
  if (showAccessDenied) {
    return <AccessDenied />;
  }

  // Se não tem permissão, não renderizar nada (já mostrou acesso negado)
  if (requireAdminAccess && !permissions.hasAdminAccess) {
    return null;
  }

  if (requiredMenuKey && !permissions.hasAdminAccess && permissions.allowedMenus.length > 0 && !permissions.allowedMenus.includes(requiredMenuKey)) {
    return null;
  }

  return <>{children}</>;
};

export default RouteGuard;
