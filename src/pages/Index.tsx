
import { AuthTabs } from "@/components/ui/auth-tabs";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();

  // Se estiver carregando, mostra um indicador de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se o usuário já estiver autenticado, redireciona para a página apropriada
  if (user) {
    // O redirecionamento específico para admin/student é tratado no hook useAuth
    return <Navigate to="/student" />;
  }

  // Se não estiver autenticado, mostra as abas de autenticação
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AuthTabs />
    </div>
  );
};

export default Index;
