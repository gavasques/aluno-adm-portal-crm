
import { useAuth } from "@/hooks/auth";
import { useSimplePermissions } from "@/hooks/useSimplePermissions";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Shield, LogOut } from "lucide-react";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
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

  // Se usuário logado, mostrar seletor de área
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-800 to-black flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/ac3223f2-8f29-482c-a887-ed1bcabecec0.png" 
              alt="Guilherme Vasques Logo" 
              className="h-20 md:h-24 mx-auto object-cover mb-6" 
            />
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Bem-vindo, {user.email?.split('@')[0]}!
            </h1>
            <p className="text-blue-200 text-lg">
              Escolha uma área para acessar
            </p>
          </div>

          {/* Seletor de Área */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Área do Aluno */}
            <Link to="/aluno">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer h-full">
                <CardHeader className="text-center">
                  <GraduationCap className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                  <CardTitle className="text-white text-xl">Área do Aluno</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-blue-200 mb-4">
                    Acesse seus créditos, fornecedores, ferramentas e materiais de estudo
                  </p>
                  <div className="text-sm text-blue-300">
                    • Gerenciar Créditos
                    <br />
                    • Fornecedores e Parceiros
                    <br />
                    • Livi AI e Mentoria
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Área Administrativa - só mostrar se tem acesso */}
            {hasAdminAccess && (
              <Link to="/admin">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer h-full">
                  <CardHeader className="text-center">
                    <Shield className="h-12 w-12 text-orange-300 mx-auto mb-4" />
                    <CardTitle className="text-white text-xl">Área Administrativa</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-blue-200 mb-4">
                      Painel completo de gestão da plataforma educacional
                    </p>
                    <div className="text-sm text-blue-300">
                      • Gestão de Usuários
                      <br />
                      • CRM e Dashboard
                      <br />
                      • Configurações do Sistema
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )}

            {/* Se não é admin, mostrar card informativo */}
            {!hasAdminAccess && (
              <Card className="bg-gray-500/20 backdrop-blur-sm border-gray-400/20 cursor-not-allowed">
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <CardTitle className="text-gray-300 text-xl">Área Administrativa</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400 text-sm">
                    Acesso restrito a administradores
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Logout */}
          <div className="text-center">
            <Button 
              variant="ghost" 
              className="text-blue-300 hover:text-white hover:bg-white/10"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
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
