
import { useAuth } from "@/hooks/auth";
import { useSimplePermissions } from "@/hooks/useSimplePermissions";
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
  const { hasAdminAccess, allowedMenus, loading: permissionsLoading } = useSimplePermissions();
  const navigate = useNavigate();

  console.log("=== STUDENT ROUTE GUARD ===");
  console.log("Auth:", { hasUser: !!user, authLoading });
  console.log("Permissions:", { hasAdminAccess, allowedMenus, permissionsLoading });
  console.log("Required menu:", requiredMenuKey);
  console.log("============================");

  useEffect(() => {
    // Se não está autenticado e não está carregando, redirecionar para login
    if (!authLoading && !user) {
      console.log("❌ Não autenticado, redirecionando");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Mostrar loading enquanto verifica
  if (authLoading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se não está autenticado, não renderizar (já foi redirecionado)
  if (!user) {
    return null;
  }

  // Admin pode acessar área do aluno
  if (hasAdminAccess) {
    console.log("✅ Admin acessando área do aluno");
    return <>{children}</>;
  }

  // Verificar menu específico se necessário
  if (requiredMenuKey && !allowedMenus.includes(requiredMenuKey)) {
    console.log("❌ Sem acesso ao menu:", requiredMenuKey);
    return <AccessDenied />;
  }

  // Permitir acesso básico
  console.log("✅ Acesso permitido à área do aluno");
  return <>{children}</>;
};

export default StudentRouteGuard;
