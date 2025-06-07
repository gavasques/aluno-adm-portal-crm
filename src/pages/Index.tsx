
import { useAuth } from "@/hooks/auth";
import { useSimplePermissions } from "@/hooks/useSimplePermissions";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Index = () => {
  const { user, loading: authLoading, error } = useAuth();
  const { hasAdminAccess, loading: permissionsLoading } = useSimplePermissions();
  const [timeoutReached, setTimeoutReached] = useState(false);

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

  // Timeout de segurança para evitar loading infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('⚠️ Timeout alcançado, forçando carregamento');
      setTimeoutReached(true);
    }, 8000);

    return () => clearTimeout(timeout);
  }, []);

  // Se timeout foi alcançado, mostrar página mesmo se ainda carregando
  const shouldShowPage = timeoutReached || (!authLoading && !permissionsLoading);

  // Mostrar loading apenas por um tempo limitado
  if (!shouldShowPage && (authLoading || (user && permissionsLoading))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-800 to-black">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando...</p>
          <p className="text-sm text-blue-200 mt-2">
            {authLoading ? 'Verificando autenticação...' : 'Carregando permissões...'}
          </p>
        </div>
      </div>
    );
  }

  // Redirecionar usuário logado (apenas se não houve timeout)
  if (user && !timeoutReached && shouldShowPage) {
    console.log("🔄 Redirecionando usuário logado");
    if (hasAdminAccess) {
      console.log("➡️ Redirecionando para admin");
      return <Navigate to="/admin" replace />;
    } else {
      console.log("➡️ Redirecionando para aluno");
      return <Navigate to="/aluno" replace />;
    }
  }

  // Página de boas-vindas para usuários não logados ou em caso de timeout
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

        {/* Erro ou timeout */}
        {(error || timeoutReached) && (
          <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 p-3 rounded">
            <p className="text-sm">
              {error || 'Carregamento demorou mais que o esperado. Você pode tentar fazer login.'}
            </p>
          </div>
        )}

        {/* Modo de recuperação para usuários logados com timeout */}
        {user && timeoutReached && (
          <div className="space-y-2">
            <p className="text-blue-300 text-sm">
              Você está logado como: {user.email}
            </p>
            <div className="flex gap-2">
              <Link to="/admin" className="flex-1">
                <Button variant="outline" className="w-full text-sm">
                  Área Admin
                </Button>
              </Link>
              <Link to="/aluno" className="flex-1">
                <Button variant="outline" className="w-full text-sm">
                  Área Aluno
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
