
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import StudentSidebar from "./StudentSidebar";
import AdminSidebar from "./AdminSidebar";
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isStudent = location.pathname.startsWith("/student");
  
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="flex-grow flex pt-12">
          {isStudent && <StudentSidebar />}
          {isAdmin && <AdminSidebar />}
          
          <main className="flex-1 flex flex-col overflow-x-hidden">
            <div className="flex-grow p-4">
              <Outlet />
            </div>
            <Footer />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
