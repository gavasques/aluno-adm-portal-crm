
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import AccessDenied from "./AccessDenied";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredMenuKey?: string;
  requireAdminAccess?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requiredMenuKey, 
  requireAdminAccess = true 
}) => {
  const { user, loading, isAdmin, canAccessMenu } = useOptimizedAuth();
  const navigate = useNavigate();
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  
  // Evitar múltiplos redirecionamentos
  const hasRedirectedRef = useRef(false);
  const lastUserRef = useRef<string | null>(null);

  useEffect(() => {
    // Reset quando usuário muda
    if (lastUserRef.current !== user?.id) {
      hasRedirectedRef.current = false;
      setShowAccessDenied(false);
      lastUserRef.current = user?.id || null;
      console.log('RouteGuard: User changed, resetting state');
    }
  }, [user?.id]);

  useEffect(() => {
    // Aguardar carregamento
    if (loading || hasRedirectedRef.current) return;

    console.log("🛡️ RouteGuard check:", {
      path: window.location.pathname,
      hasUser: !!user,
      userEmail: user?.email,
      isAdmin,
      requiredMenuKey,
      requireAdminAccess,
      loading
    });

    // Se não está autenticado, redirecionar para login
    if (!user) {
      console.log("❌ Usuário não autenticado, redirecionando para login...");
      hasRedirectedRef.current = true;
      navigate("/login", { replace: true });
      return;
    }

    // Verificar permissões de admin
    if (requireAdminAccess && !isAdmin) {
      console.log("❌ Acesso admin negado para:", user.email);
      hasRedirectedRef.current = true;
      setShowAccessDenied(true);
      return;
    }

    // Verificar menu específico (só para não-admins)
    if (requiredMenuKey && !isAdmin && !canAccessMenu(requiredMenuKey)) {
      console.log(`❌ Acesso negado ao menu: ${requiredMenuKey} para:`, user.email);
      hasRedirectedRef.current = true;
      setShowAccessDenied(true);
      return;
    }

    console.log("✅ Acesso permitido para:", user.email);
  }, [user, loading, isAdmin, canAccessMenu, navigate, requiredMenuKey, requireAdminAccess]);

  // Loading state
  if (loading) {
    console.log("RouteGuard: Loading...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Access denied
  if (showAccessDenied) {
    console.log("RouteGuard: Showing access denied");
    return <AccessDenied />;
  }

  // Renderizar conteúdo se tudo OK
  console.log("RouteGuard: Rendering children");
  return <>{children}</>;
};

export default RouteGuard;
