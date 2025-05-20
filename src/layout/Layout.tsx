import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import StudentSidebar from "./StudentSidebar";
import AdminSidebar from "./AdminSidebar";
import { useLocation } from "react-router-dom";
const Layout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isStudent = location.pathname.startsWith("/student");
  return <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex-grow flex pt-12 relative">
        {isStudent && <StudentSidebar />}
        {isAdmin && <AdminSidebar />}
        
        <main className="flex-1 flex flex-col overflow-x-hidden">
          <div className="flex-grow p-4 px-0 py-0">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>;
};
export default Layout;