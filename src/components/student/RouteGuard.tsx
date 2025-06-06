
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AccessDenied from "@/components/admin/AccessDenied";

interface StudentRouteGuardProps {
  children: React.ReactNode;
  requiredMenuKey?: string;
}

const StudentRouteGuard: React.FC<StudentRouteGuardProps> = ({ 
  children, 
  requiredMenuKey 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { permissions, loading: permissionsLoading } = usePermissions();
  const navigate = useNavigate();

  console.log("=== STUDENT ROUTE GUARD DEBUG ===");
  console.log("Auth state:", {
    user: user?.email,
    authLoading,
    isAuthenticated: !!user
  });
  console.log("Permissions state:", {
    hasAdminAccess: permissions.hasAdminAccess,
    allowedMenus: permissions.allowedMenus,
    permissionsLoading,
    requiredMenuKey
  });
  console.log("================================");

  useEffect(() => {
    // Se não está autenticado e não está carregando, redirecionar para login
    if (!authLoading && !user) {
      console.log("StudentRouteGuard: Usuário não autenticado, redirecionando para login");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Mostrar loading enquanto verifica autenticação e permissões
  if (authLoading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se não está autenticado, não renderizar nada (já foi redirecionado)
  if (!user) {
    return null;
  }

  // Se tem acesso admin e está tentando acessar área do aluno, permitir
  // (admin pode acessar qualquer área)
  if (permissions.hasAdminAccess) {
    console.log("StudentRouteGuard: Admin acessando área do aluno - permitido");
    return <>{children}</>;
  }

  // Se requer menu específico e usuário não tem acesso a ele
  if (requiredMenuKey && !permissions.allowedMenus.includes(requiredMenuKey)) {
    console.log("StudentRouteGuard: Usuário não tem acesso ao menu:", requiredMenuKey);
    return <AccessDenied />;
  }

  // Se não tem acesso admin mas não requer menu específico, permitir acesso
  // (área básica do aluno deve ser acessível a todos os usuários autenticados)
  console.log("StudentRouteGuard: Acesso permitido para usuário:", user.email);
  return <>{children}</>;
};

export default StudentRouteGuard;
