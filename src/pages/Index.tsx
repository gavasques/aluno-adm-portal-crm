
import { AuthTabs } from "@/components/ui/auth-tabs";
import { useAuth } from "@/hooks/auth";
import { Navigate } from "react-router-dom";

const RECOVERY_MODE_KEY = "supabase_recovery_mode";

const Index = () => {
  const { user, loading, isInRecoveryMode } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

  if (user) {
    // Redirecionar para as novas URLs otimizadas
    return <Navigate to="/aluno" />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AuthTabs />
    </div>
  );
};

export default Index;
