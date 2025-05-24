
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import AdminSidebar from "./AdminSidebar";
import StudentSidebar from "./StudentSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import PendingValidationOverlay from "@/components/layout/PendingValidationOverlay";

interface LayoutProps {
  isAdmin: boolean;
  children: React.ReactNode;
}

const Layout = ({ isAdmin, children }: LayoutProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Se está carregando a autenticação, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  // Se não há usuário autenticado, não renderizar o layout completo
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full overflow-hidden">
          {/* Sidebar - largura fixa */}
          <div className="flex-shrink-0 relative" style={{ width: '208px' }}>
            {isAdmin ? <AdminSidebar /> : <StudentSidebar />}
          </div>
          
          {/* Área principal - ocupa o restante do espaço com espaçamento de 10px */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden mx-2.5">
            <main className="flex-1 overflow-auto p-2.5 pt-2.5">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
      <PendingValidationOverlay />
    </div>
  );
};

export default Layout;
