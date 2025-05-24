import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/auth";
import Index from "./pages/Index";
import ResetPassword from "./pages/ResetPassword";
import AcceptInvite from "./pages/AcceptInvite";
import NotFound from "./pages/NotFound";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Students from "./pages/admin/Students";
import StudentDetail from "./pages/admin/StudentDetail";
import CRM from "./pages/admin/CRM";
import Tasks from "./pages/admin/Tasks";
import TaskDetail from "./pages/admin/TaskDetail";
import Suppliers from "./pages/admin/Suppliers";
import Partners from "./pages/admin/Partners";
import Tools from "./pages/admin/Tools";
import Courses from "./pages/admin/Courses";
import CourseDetails from "./pages/admin/CourseDetails";
import Mentoring from "./pages/admin/Mentoring";
import MentoringDetail from "./pages/admin/MentoringDetail";
import Bonus from "./pages/admin/Bonus";
import BonusDetail from "./pages/admin/BonusDetail";
import Categories from "./pages/admin/Categories";
import PartnerTypes from "./pages/admin/PartnerTypes";
import SoftwareTypes from "./pages/admin/SoftwareTypes";
import Permissions from "./pages/admin/Permissions";
import Audit from "./pages/admin/Audit";
import Settings from "./pages/admin/Settings";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentSuppliers from "./pages/student/Suppliers";
import MySuppliers from "./pages/student/MySuppliers";
import StudentPartners from "./pages/student/Partners";
import StudentTools from "./pages/student/Tools";
import StudentSettings from "./pages/student/Settings";

// Components
import Layout from "./layout/Layout";
import AdminRouteGuard from "./components/admin/RouteGuard";
import StudentRouteGuard from "./components/student/RouteGuard";

// Layouts
import AdminLayout from "./layout/AdminLayout";
import StudentLayout from "./layout/StudentLayout";

// Route Guards
import RouteGuard from "./components/RouteGuard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/reset-password" element={<Layout><ResetPassword /></Layout>} />
              <Route path="/accept-invite" element={<Layout><AcceptInvite /></Layout>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<RouteGuard><AdminLayout><Dashboard /></AdminLayout></RouteGuard>} />
              <Route path="/admin/users" element={<RouteGuard><AdminLayout><Users /></AdminLayout></RouteGuard>} />
              <Route path="/admin/students" element={<RouteGuard><AdminLayout><Students /></AdminLayout></RouteGuard>} />
              <Route path="/admin/students/:id" element={<RouteGuard><AdminLayout><StudentDetail /></AdminLayout></RouteGuard>} />
              <Route path="/admin/crm" element={<RouteGuard><AdminLayout><CRM /></AdminLayout></RouteGuard>} />
              <Route path="/admin/tasks" element={<RouteGuard><AdminLayout><Tasks /></AdminLayout></RouteGuard>} />
              <Route path="/admin/tasks/:id" element={<RouteGuard><AdminLayout><TaskDetail /></AdminLayout></RouteGuard>} />
              <Route path="/admin/suppliers" element={<RouteGuard><AdminLayout><Suppliers /></AdminLayout></RouteGuard>} />
              <Route path="/admin/partners" element={<RouteGuard><AdminLayout><Partners /></AdminLayout></RouteGuard>} />
              <Route path="/admin/tools" element={<RouteGuard><AdminLayout><Tools /></AdminLayout></RouteGuard>} />
              <Route path="/admin/courses" element={<RouteGuard><AdminLayout><Courses /></AdminLayout></RouteGuard>} />
              <Route path="/admin/courses/:id" element={<RouteGuard><AdminLayout><CourseDetails /></AdminLayout></RouteGuard>} />
              <Route path="/admin/mentoring" element={<RouteGuard><AdminLayout><Mentoring /></AdminLayout></RouteGuard>} />
              <Route path="/admin/mentoring/:id" element={<RouteGuard><AdminLayout><MentoringDetail /></AdminLayout></RouteGuard>} />
              <Route path="/admin/bonus" element={<RouteGuard><AdminLayout><Bonus /></AdminLayout></RouteGuard>} />
              <Route path="/admin/bonus/:id" element={<RouteGuard><AdminLayout><BonusDetail /></AdminLayout></RouteGuard>} />
              <Route path="/admin/categories" element={<RouteGuard><AdminLayout><Categories /></AdminLayout></RouteGuard>} />
              <Route path="/admin/partner-types" element={<RouteGuard><AdminLayout><PartnerTypes /></AdminLayout></RouteGuard>} />
              <Route path="/admin/software-types" element={<RouteGuard><AdminLayout><SoftwareTypes /></AdminLayout></RouteGuard>} />
              <Route path="/admin/permissions" element={<RouteGuard><AdminLayout><Permissions /></AdminLayout></RouteGuard>} />
              <Route path="/admin/audit" element={<RouteGuard><AdminLayout><Audit /></AdminLayout></RouteGuard>} />
              <Route path="/admin/settings" element={<RouteGuard><AdminLayout><Settings /></AdminLayout></RouteGuard>} />

              {/* Student Routes */}
              <Route path="/aluno" element={<StudentRouteGuard><StudentLayout><StudentDashboard /></StudentLayout></StudentRouteGuard>} />
              <Route path="/aluno/fornecedores" element={<StudentRouteGuard><StudentLayout><StudentSuppliers /></StudentLayout></StudentRouteGuard>} />
              <Route path="/aluno/meus-fornecedores" element={<StudentRouteGuard><StudentLayout><MySuppliers /></StudentLayout></StudentRouteGuard>} />
              <Route path="/aluno/parceiros" element={<StudentRouteGuard><StudentLayout><StudentPartners /></StudentLayout></StudentRouteGuard>} />
              <Route path="/aluno/ferramentas" element={<StudentRouteGuard><StudentLayout><StudentTools /></StudentLayout></StudentRouteGuard>} />
              <Route path="/aluno/configuracoes" element={<StudentRouteGuard><StudentLayout><StudentSettings /></StudentLayout></StudentRouteGuard>} />

              {/* 404 Route */}
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
