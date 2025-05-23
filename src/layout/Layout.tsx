
import { Outlet, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./Header";
import StudentSidebar from "./StudentSidebar";
import AdminSidebar from "./AdminSidebar";
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/auth";
import { usePermissions } from "@/hooks/usePermissions";

interface LayoutProps {
  isAdmin?: boolean;
}

const Layout = ({ isAdmin: propIsAdmin }: LayoutProps = {}) => {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { permissions, loading: permissionsLoading } = usePermissions();
  
  const isAdminRoute = propIsAdmin !== undefined ? propIsAdmin : location.pathname.startsWith("/admin");
  const isStudentRoute = location.pathname.startsWith("/student");
  const isHome = location.pathname === "/";
  
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

  // Se estiver tentando acessar área admin sem permissão, redirecionar para student
  if (isAdminRoute && user && !permissions.hasAdminAccess) {
    console.log("Usuário sem permissão admin tentando acessar área administrativa, redirecionando para /student");
    return <Navigate to="/student" replace />;
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
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
