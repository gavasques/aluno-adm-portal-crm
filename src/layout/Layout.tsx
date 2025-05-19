
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import AdminSidebar from "./AdminSidebar";

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Determine if we're in admin or student area
  const isAdmin = path.includes("/admin");
  const isStudent = path.includes("/student");
  const isHome = path === "/";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-1 w-full">
        {/* Show appropriate sidebar based on route */}
        {isAdmin && <AdminSidebar />}
        {isStudent && <StudentSidebar />}
        
        {/* Main content area */}
        <main className={`flex-1 p-6 ${!isHome ? 'pt-20' : ''}`}>
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;
