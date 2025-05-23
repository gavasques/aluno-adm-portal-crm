
import { Outlet, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./Header";
import StudentSidebar from "./StudentSidebar";
import AdminSidebar from "./AdminSidebar";
import AccessDenied from "@/components/admin/AccessDenied";
import PendingValidationOverlay from "@/components/layout/PendingValidationOverlay";
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/auth";
import { usePermissions } from "@/hooks/usePermissions";
import { useEffect, useRef, useState } from "react";

interface LayoutProps {
  isAdmin?: boolean;
}

const Layout = ({ isAdmin: propIsAdmin }: LayoutProps = {}) => {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { permissions, loading: permissionsLoading } = usePermissions();
  const redirectedRef = useRef(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  
  const isAdminRoute = propIsAdmin !== undefined ? propIsAdmin : location.pathname.startsWith("/admin");
  const isStudentRoute = location.pathname.startsWith("/student");
  const isHome = location.pathname === "/";
  
  // Reset redirection flag when location changes
  useEffect(() => {
    redirectedRef.current = false;
    setShowAccessDenied(false);
  }, [location.pathname]);

  // Verificar se deve mostrar o overlay de validação pendente
  const shouldShowPendingValidation = user && 
    !authLoading && 
    !permissionsLoading && 
    permissions.permissionGroupName === "Geral" && 
    !permissions.hasAdminAccess &&
    !isHome;

  // Se estiver carregando, mostrar indicador de carregamento
  if (authLoading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Se o usuário não estiver autenticado, redirecionar para a página inicial
  if (!user && !isHome) {
    return <Navigate to="/" replace />;
  }

  // Verificação de acesso admin
  if (user && !authLoading && !permissionsLoading && !redirectedRef.current) {
    // Se estiver tentando acessar área admin sem permissão
    if (isAdminRoute && !permissions.hasAdminAccess) {
      console.log("Usuário sem permissão admin tentando acessar área administrativa");
      redirectedRef.current = true;
      setShowAccessDenied(true);
      return <AccessDenied />;
    }
  }

  // Se deve mostrar a tela de acesso negado
  if (showAccessDenied) {
    return <AccessDenied />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!isHome && <Header />}
      <SidebarProvider>
        <div className={`flex-grow flex ${!isHome ? 'pt-12' : ''} relative w-full`}>
          {isStudentRoute && <StudentSidebar />}
          {isAdminRoute && permissions.hasAdminAccess && <AdminSidebar />}
          
          <motion.main 
            className="flex-1 overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex-grow"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Outlet />
            </motion.div>
          </motion.main>
          
          {/* Overlay de validação pendente */}
          {shouldShowPendingValidation && <PendingValidationOverlay />}
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
