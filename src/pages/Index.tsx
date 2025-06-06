
import { useAuth } from "@/hooks/auth";
import { useSimplePermissions } from "@/hooks/useSimplePermissions";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { hasAdminAccess, loading: permissionsLoading } = useSimplePermissions();

  console.log("=== INDEX PAGE DEBUG ===");
  console.log("Auth state:", {
    hasUser: !!user,
    userEmail: user?.email,
    authLoading
  });
  console.log("Permissions:", {
    hasAdminAccess,
    permissionsLoading
  });
  console.log("========================");

  // Mostrar loading apenas se ainda carregando autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-800 to-black">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Se usuário logado, mostrar opções de navegação
  if (user) {
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

          {/* Título */}
          <div className="text-white space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Bem-vindo, {user.email}!
            </h1>
            <p className="text-blue-200 text-lg">
              Escolha uma área para acessar
            </p>
          </div>

          {/* Opções de navegação */}
          <div className="space-y-4">
            <Link to="/aluno/creditos" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 text-lg">
                Área do Aluno - Créditos
              </Button>
            </Link>
            
            <Link to="/admin" className="block">
              <Button variant="outline" className="w-full text-white border-white hover:bg-white hover:text-blue-800 py-3 text-lg">
                Área Administrativa
              </Button>
            </Link>
          </div>

          {/* Logout */}
          <div className="pt-4">
            <Button 
              variant="ghost" 
              className="text-blue-300 hover:text-white"
              onClick={() => {
                // Implementar logout quando necessário
                console.log('Logout clicked');
              }}
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
    );
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
      </div>
    </div>
  );
};

export default Index;
