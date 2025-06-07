
import { useAuth } from "@/hooks/auth";
import { useSimplePermissions } from "@/hooks/useSimplePermissions";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Index = () => {
  const { user, loading: authLoading, error } = useAuth();
  const { hasAdminAccess, loading: permissionsLoading } = useSimplePermissions();
  const [forceRender, setForceRender] = useState(false);

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

  // Timeout de emergência para evitar loading infinito
  useEffect(() => {
    const emergencyTimeout = setTimeout(() => {
      console.log('⚠️ Index: Timeout de emergência alcançado, forçando renderização');
      setForceRender(true);
    }, 10000); // 10 segundos

    const normalTimeout = setTimeout(() => {
      if (authLoading || permissionsLoading) {
        console.log('⚠️ Index: Timeout normal alcançado, ainda carregando');
        setForceRender(true);
      }
    }, 5000); // 5 segundos

    return () => {
      clearTimeout(emergencyTimeout);
      clearTimeout(normalTimeout);
    };
  }, [authLoading, permissionsLoading]);

  // Condições para mostrar loading
  const shouldShowLoading = !forceRender && (authLoading || (user && permissionsLoading));

  // Loading state com timeout
  if (shouldShowLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-800 to-black">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando aplicação...</p>
          <p className="text-sm text-blue-200 mt-2">
            {authLoading ? 'Verificando autenticação...' : 'Carregando permissões...'}
          </p>
          <div className="mt-4 text-xs text-blue-300">
            Se demorar muito, pode ser um problema de extensão do navegador
          </div>
        </div>
      </div>
    );
  }

  // Redirecionar usuário logado (apenas se não houve timeout)
  if (user && !forceRender) {
    console.log("🔄 Index: Redirecionando usuário logado");
    if (hasAdminAccess) {
      console.log("➡️ Index: Redirecionando para admin");
      return <Navigate to="/admin" replace />;
    } else {
      console.log("➡️ Index: Redirecionando para aluno");
      return <Navigate to="/aluno" replace />;
    }
  }

  // Página de boas-vindas
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/ac3223f2-8f29-482c-a887-ed1bcabecec0.png" 
            alt="Guilherme Vasques Logo" 
            className="h-20 md:h-24 mx-auto object-cover" 
            onError={(e) => {
              console.log('❌ Index: Erro ao carregar logo');
              (e.target as HTMLImageElement).style.display = 'none';
            }}
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

        {/* Informações de debug */}
        {(error || forceRender) && (
          <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 p-3 rounded text-sm">
            {error && <p>Erro: {error}</p>}
            {forceRender && <p>Timeout alcançado - renderização forçada</p>}
            <p className="mt-2">
              Se você está logado, tente os links abaixo:
            </p>
            <div className="flex gap-2 mt-2">
              <Link to="/admin" className="text-blue-200 underline">Admin</Link>
              <Link to="/aluno" className="text-blue-200 underline">Aluno</Link>
            </div>
          </div>
        )}

        {/* Debug info em desenvolvimento */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-blue-300 mt-4 p-2 bg-black/20 rounded">
            Debug: user={user?.email || 'none'}, authLoading={authLoading.toString()}, 
            permissionsLoading={permissionsLoading.toString()}, forceRender={forceRender.toString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
