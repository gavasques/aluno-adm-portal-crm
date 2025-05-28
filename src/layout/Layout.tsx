
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth";
import AdminSidebar from "./AdminSidebar";
import StudentSidebar from "./StudentSidebar";
import PendingValidationOverlay from "@/components/layout/PendingValidationOverlay";

interface LayoutProps {
  isAdmin: boolean;
  children: React.ReactNode;
}

const Layout = ({ isAdmin, children }: LayoutProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [sidebarWidth, setSidebarWidth] = useState(256);
  
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

  // Detectar mudanças na largura da sidebar para admin
  useEffect(() => {
    if (isAdmin) {
      const handleSidebarResize = () => {
        const sidebar = document.querySelector('[data-sidebar="admin"]');
        if (sidebar) {
          setSidebarWidth(sidebar.getBoundingClientRect().width);
        }
      };

      const observer = new ResizeObserver(handleSidebarResize);
      const sidebar = document.querySelector('[data-sidebar="admin"]');
      if (sidebar) {
        observer.observe(sidebar);
      }

      return () => {
        if (sidebar) {
          observer.unobserve(sidebar);
        }
      };
    }
  }, [isAdmin]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - largura dinâmica */}
      <div className="flex-shrink-0" style={{ width: isAdmin ? `${sidebarWidth}px` : '256px' }}>
        {isAdmin ? <AdminSidebar /> : <StudentSidebar />}
      </div>
      
      {/* Área principal de conteúdo */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
      
      <PendingValidationOverlay />
    </div>
  );
};

export default Layout;
