
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./Header";
import StudentSidebar from "./StudentSidebar";
import AdminSidebar from "./AdminSidebar";
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isStudent = location.pathname.startsWith("/student");
  const isHome = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!isHome && <Header />}
      <SidebarProvider>
        <div className={`flex-grow flex w-full ${!isHome ? 'pt-12' : ''} relative`}>
          {isStudent && <StudentSidebar />}
          {isAdmin && <AdminSidebar />}
          
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
