
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const location = useLocation();
  const { toast } = useToast();
  
  const isAdmin = profile?.role === "Admin";
  const isAdminRoute = location.pathname.startsWith("/admin");
  
  useEffect(() => {
    // Verificar se o usuário está tentando acessar uma rota de admin sem ser admin
    if (!authLoading && !profileLoading && user && profile && isAdminRoute && !isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta área.",
        variant: "destructive",
      });
    }
  }, [user, profile, isAdminRoute, isAdmin, authLoading, profileLoading, toast]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    // Redirecionar para login caso não esteja autenticado
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Se for uma rota de admin e o usuário não for admin, redirecionar para a área do aluno
  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/student" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
