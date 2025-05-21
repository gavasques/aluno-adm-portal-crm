
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/hooks/useAuth";

import Layout from "./layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import StudentDashboard from "./pages/student/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import Suppliers from "./pages/student/Suppliers";
import Partners from "./pages/student/Partners";
import Tools from "./pages/student/Tools";
import MySuppliers from "./pages/student/MySuppliers";
import Settings from "./pages/student/Settings";
import AdminUsers from "./pages/admin/Users";
import AdminStudents from "./pages/admin/Students";
import AdminCourses from "./pages/admin/Courses";
import AdminMentoring from "./pages/admin/Mentoring";
import MentoringDetail from "./pages/admin/MentoringDetail";
import AdminBonus from "./pages/admin/Bonus";
import BonusDetail from "./pages/admin/BonusDetail";
import AdminTasks from "./pages/admin/Tasks";
import TaskDetail from "./pages/admin/TaskDetail";
import AdminCRM from "./pages/admin/CRM";
import AdminSuppliers from "./pages/admin/Suppliers";
import AdminPartners from "./pages/admin/Partners";
import AdminTools from "./pages/admin/Tools";
import CourseDetails from "./pages/admin/CourseDetails";
import StudentDetail from "./pages/admin/StudentDetail";
import Categories from "./pages/admin/Categories";
import SoftwareTypes from "./pages/admin/SoftwareTypes";
import PartnerTypes from "./pages/admin/PartnerTypes";
import Registers from "./pages/admin/Registers";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

// Componente para proteger rotas que exigem autenticação
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="reset-password/:token" element={<ResetPassword />} />
                
                {/* Student Routes */}
                <Route path="student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
                <Route path="student/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
                <Route path="student/partners" element={<ProtectedRoute><Partners /></ProtectedRoute>} />
                <Route path="student/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
                <Route path="student/my-suppliers" element={<ProtectedRoute><MySuppliers /></ProtectedRoute>} />
                <Route path="student/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
                <Route path="admin/students" element={<ProtectedRoute><AdminStudents /></ProtectedRoute>} />
                <Route path="admin/gestao-alunos" element={<ProtectedRoute><AdminStudents /></ProtectedRoute>} />
                <Route path="admin/student/:id" element={<ProtectedRoute><StudentDetail /></ProtectedRoute>} />
                <Route path="admin/gestao-alunos/:id" element={<ProtectedRoute><StudentDetail /></ProtectedRoute>} />
                
                {/* Nova rota unificada para os cadastros */}
                <Route path="admin/registers" element={<ProtectedRoute><Registers /></ProtectedRoute>} />
                
                {/* Redirecionamentos das rotas antigas para a nova página de cadastros */}
                <Route path="admin/courses" element={<Navigate to="/admin/registers?tab=courses" replace />} />
                <Route path="admin/courses/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
                <Route path="admin/mentoring" element={<Navigate to="/admin/registers" replace />} />
                <Route path="admin/mentoring/:id" element={<ProtectedRoute><MentoringDetail /></ProtectedRoute>} />
                <Route path="admin/bonus" element={<Navigate to="/admin/registers?tab=bonus" replace />} />
                <Route path="admin/bonus/:id" element={<ProtectedRoute><BonusDetail /></ProtectedRoute>} />
                <Route path="admin/categories" element={<Navigate to="/admin/registers?tab=categories" replace />} />
                <Route path="admin/software-types" element={<Navigate to="/admin/registers?tab=software-types" replace />} />
                <Route path="admin/partner-types" element={<Navigate to="/admin/registers?tab=partner-types" replace />} />
                
                <Route path="admin/tasks" element={<ProtectedRoute><AdminTasks /></ProtectedRoute>} />
                <Route path="admin/tasks/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
                <Route path="admin/crm" element={<ProtectedRoute><AdminCRM /></ProtectedRoute>} />
                <Route path="admin/suppliers" element={<ProtectedRoute><AdminSuppliers /></ProtectedRoute>} />
                <Route path="admin/partners" element={<ProtectedRoute><AdminPartners /></ProtectedRoute>} />
                <Route path="admin/tools" element={<ProtectedRoute><AdminTools /></ProtectedRoute>} />
                
                <Route path="admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
