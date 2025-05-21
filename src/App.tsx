
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import Layout from "./layout/Layout";
import Index from "./pages/Index";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Tasks from "./pages/admin/Tasks";
import TaskDetail from "./pages/admin/TaskDetail";
import Courses from "./pages/admin/Courses";
import CourseDetails from "./pages/admin/CourseDetails";
import Mentoring from "./pages/admin/Mentoring";
import MentoringDetail from "./pages/admin/MentoringDetail";
import Bonus from "./pages/admin/Bonus";
import BonusDetail from "./pages/admin/BonusDetail";
import Permissions from "./pages/admin/Permissions";
import PermissionGroupDetail from "./pages/admin/PermissionGroupDetail";
import CRM from "./pages/admin/CRM";
import Registers from "./pages/admin/Registers";
import Categories from "./pages/admin/Categories";
import SoftwareTypes from "./pages/admin/SoftwareTypes";
import PartnerTypes from "./pages/admin/PartnerTypes";
import Students from "./pages/admin/Students";
import StudentDetail from "./pages/admin/StudentDetail";
import Partners from "./pages/admin/Partners";
import Tools from "./pages/admin/Tools";
import Suppliers from "./pages/admin/Suppliers";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentSettings from "./pages/student/Settings";
import StudentSuppliers from "./pages/student/Suppliers";
import StudentMySuppliers from "./pages/student/MySuppliers";
import StudentPartners from "./pages/student/Partners";
import StudentTools from "./pages/student/Tools";

import { AuthProvider } from "./hooks/useAuth";
import { ProfileProvider } from "./hooks/useProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentRouteGuard from "./components/StudentRouteGuard";

// Create a React Query client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ProfileProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  {/* Admin routes */}
                  <Route path="/admin" element={<Dashboard />} />
                  <Route path="/admin/tasks" element={<Tasks />} />
                  <Route path="/admin/tasks/:id" element={<TaskDetail />} />
                  <Route path="/admin/courses" element={<Courses />} />
                  <Route path="/admin/courses/:id" element={<CourseDetails />} />
                  <Route path="/admin/mentoring" element={<Mentoring />} />
                  <Route path="/admin/mentoring/:id" element={<MentoringDetail />} />
                  <Route path="/admin/bonus" element={<Bonus />} />
                  <Route path="/admin/bonus/:id" element={<BonusDetail />} />
                  <Route path="/admin/permissions" element={<Permissions />} />
                  <Route path="/admin/permissions/:id" element={<PermissionGroupDetail />} />
                  <Route path="/admin/crm" element={<CRM />} />
                  <Route path="/admin/registers" element={<Registers />} />
                  <Route path="/admin/categories" element={<Categories />} />
                  <Route path="/admin/software-types" element={<SoftwareTypes />} />
                  <Route path="/admin/partner-types" element={<PartnerTypes />} />
                  <Route path="/admin/students" element={<Students />} />
                  <Route path="/admin/students/:id" element={<StudentDetail />} />
                  <Route path="/admin/partners" element={<Partners />} />
                  <Route path="/admin/tools" element={<Tools />} />
                  <Route path="/admin/suppliers" element={<Suppliers />} />
                  <Route path="/admin/users" element={<Users />} />
                  <Route path="/admin/settings" element={<Settings />} />
                  
                  {/* Student routes with permissions guard */}
                  <Route element={<StudentRouteGuard />}>
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="/student/settings" element={<StudentSettings />} />
                    <Route path="/student/suppliers" element={<StudentSuppliers />} />
                    <Route path="/student/my-suppliers" element={<StudentMySuppliers />} />
                    <Route path="/student/partners" element={<StudentPartners />} />
                    <Route path="/student/tools" element={<StudentTools />} />
                  </Route>
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </ProfileProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
