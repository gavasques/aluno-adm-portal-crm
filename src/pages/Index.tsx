
import { useAuth } from "@/hooks/auth";
import { usePermissions } from "@/hooks/usePermissions";
import { Navigate, Link } from "react-router-dom";
import { ConnectionTest } from "@/components/debug/ConnectionTest";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { permissions, loading: permissionsLoading } = usePermissions();
  const [redirectChecked, setRedirectChecked] = useState(false);

  console.log("=== INDEX PAGE DEBUG ===");
  console.log("User:", user?.email);
  console.log("Auth Loading:", authLoading);
  console.log("Permissions Loading:", permissionsLoading);
  console.log("Permissions:", permissions);
  console.log("Redirect Checked:", redirectChecked);
  console.log("========================");

  useEffect(() => {
    // Só marcar como verificado quando terminar de carregar
    if (!authLoading && !permissionsLoading) {
      console.log("Setting redirect checked to true");
      setRedirectChecked(true);
    }
  }, [authLoading, permissionsLoading]);

  // Mostrar loading enquanto verifica
  if (authLoading || permissionsLoading || !redirectChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se o usuário está logado, fazer redirecionamento
  if (user && redirectChecked) {
    console.log("User logged in - determining redirect");
    
    // Se tem acesso admin, vai para admin
    if (permissions.hasAdminAccess) {
      console.log("Redirecting to admin area");
      return <Navigate to="/admin" replace />;
    } 
    // Senão, vai para área do aluno
    else {
      console.log("Redirecting to student area");
      return <Navigate to="/aluno" replace />;
    }
  }

  // Página de boas-vindas para usuários não logados
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/ac3223f2-8f29-482c-a887-ed1bcabecec0.png" 
            alt="Guilherme Vasques Logo" 
            className="h-20 md:h-24 mx-auto object-cover" 
          />
        </div>

        {/* Título e descrição */}
        <div className="text-white space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Portal Educacional
          </h1>
          <p className="text-blue-200 text-lg">
            Sistema de gerenciamento e aprendizado
          </p>
        </div>

        {/* Botões de ação */}
        <div className="space-y-4">
          <Link to="/login" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 text-lg">
              Acessar Sistema
            </Button>
          </Link>
          
          <p className="text-blue-300 text-sm">
            Faça login para acessar sua área
          </p>
        </div>

        {/* Debug info (apenas em desenvolvimento) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8">
            <ConnectionTest />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
