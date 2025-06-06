
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  console.log("=== ROUTE GUARD DEBUG ===");
  console.log("Auth:", { hasUser: !!user, authLoading });
  console.log("========================");

  useEffect(() => {
    // Se não está carregando e não tem usuário, redirecionar para login
    if (!authLoading && !user) {
      console.log("❌ Não autenticado, redirecionando para login");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, não renderizar (já foi redirecionado)
  if (!user) {
    return null;
  }

  // Se autenticado, renderizar o conteúdo
  console.log("✅ Usuário autenticado, renderizando conteúdo");
  return <>{children}</>;
};

export default RouteGuard;
