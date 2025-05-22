
import { AuthTabs } from "@/components/ui/auth-tabs";
import { useAuth } from "@/hooks/auth";
import { Navigate } from "react-router-dom";

// Nome da chave no localStorage para controle de estado de recuperação de senha
const RECOVERY_MODE_KEY = "supabase_recovery_mode";

const Index = () => {
  const { user, loading, isInRecoveryMode } = useAuth();

  // Se estiver carregando, mostra um indicador de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se estiver em modo de recuperação, mostrar as abas de autenticação
  // Para evitar login automático durante o processo de recuperação
  if (isInRecoveryMode && isInRecoveryMode()) {
    console.log("Página de login em modo de recuperação - mostrando login manual");
    return (
      <div className="min-h-screen relative overflow-hidden">
        <AuthTabs />
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-amber-100 text-amber-800 p-3 rounded-md shadow-md text-sm max-w-md text-center">
          <strong>Atenção:</strong> Há um processo de recuperação de senha em andamento. Complete-o na outra aba ou solicite um novo link.
        </div>
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
