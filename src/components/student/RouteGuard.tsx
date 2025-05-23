
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/auth";
import AccessDenied from "@/components/admin/AccessDenied";

interface StudentRouteGuardProps {
  children: React.ReactNode;
  requiredMenuKey: string;
}

const StudentRouteGuard: React.FC<StudentRouteGuardProps> = ({ 
  children, 
  requiredMenuKey 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { permissions, loading: permissionsLoading } = usePermissions();

  // Mostrar loading enquanto verifica permissões
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

  // Verificar se tem permissão para o menu específico
  const hasPermission = permissions.hasAdminAccess || 
    permissions.allowedMenus.length === 0 || 
    permissions.allowedMenus.includes(requiredMenuKey);

  if (!hasPermission) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};

export default StudentRouteGuard;
