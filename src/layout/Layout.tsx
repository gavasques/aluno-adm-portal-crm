
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import AdminSidebar from "./AdminSidebar";
import StudentSidebar from "./StudentSidebar";
import TopBar from "./TopBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import PendingValidationOverlay from "@/components/layout/PendingValidationOverlay";

interface LayoutProps {
  isAdmin: boolean;
  children: React.ReactNode;
}

const Layout = ({ isAdmin, children }: LayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Se não há usuário, não renderizar o layout
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="flex min-h-screen">
          {isAdmin ? <AdminSidebar /> : <StudentSidebar />}
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <main className="flex-1 p-6 pt-20 overflow-auto">
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
