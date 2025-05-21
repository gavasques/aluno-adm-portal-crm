
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Mostrar um loading enquanto verificamos a autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirecionar para o login se o usuário não estiver autenticado
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Renderizar o conteúdo protegido
  return <Outlet />;
};

export default ProtectedRoute;
