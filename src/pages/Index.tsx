
import { useAuth } from "@/hooks/auth";
import { useSimplePermissions } from "@/hooks/useSimplePermissions";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Index = () => {
  const { user, loading: authLoading, error } = useAuth();
  const { hasAdminAccess, loading: permissionsLoading } = useSimplePermissions();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  console.log("=== INDEX PAGE DEBUG ===");
  console.log("Auth state:", {
    hasUser: !!user,
    userEmail: user?.email,
    authLoading,
    error
  });
  console.log("Permissions:", {
    hasAdminAccess,
    permissionsLoading
  });
  console.log("========================");

  useEffect(() => {
    // Só redirecionar quando tudo estiver carregado e houver usuário
    if (!authLoading && !permissionsLoading && user) {
      console.log("✅ Pronto para redirecionar");
      setShouldRedirect(true);
    }
  }, [authLoading, permissionsLoading, user]);

  // Mostrar loading enquanto verifica autenticação
  if (authLoading || (user && permissionsLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-800 to-black">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Se há erro de autenticação, mostrar página de login
  if (error) {
    console.log("❌ Erro de autenticação, mostrando página inicial");
  }

  // Redirecionar usuário logado
  if (shouldRedirect && user) {
    console.log("🔄 Redirecionando usuário logado");
    if (hasAdminAccess) {
      console.log("➡️ Redirecionando para admin");
      return <Navigate to="/admin" replace />;
    } else {
      console.log("➡️ Redirecionando para aluno");
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

        {/* Erro se houver */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
