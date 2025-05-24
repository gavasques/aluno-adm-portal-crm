import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Layout isAdmin={false}><Index /></Layout>} />
                <Route path="/reset-password" element={<Layout isAdmin={false}><ResetPassword /></Layout>} />
                <Route path="/accept-invite" element={<Layout isAdmin={false}><AcceptInvite /></Layout>} />
                
                {/* Redirect from /student to /aluno */}
                <Route path="/student" element={<Navigate to="/aluno" replace />} />
                <Route path="/student/*" element={<Navigate to="/aluno" replace />} />
                
                {/* Admin Routes - URLs em português */}
                <Route path="/admin" element={<AdminRouteGuard requireAdminAccess><AdminLayout><Dashboard /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/configuracoes" element={<AdminRouteGuard requireAdminAccess><AdminLayout><Settings /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/usuarios" element={<AdminRouteGuard requireAdminAccess><AdminLayout><Users /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/permissoes" element={<AdminRouteGuard requireAdminAccess><AdminLayout><Permissions /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/alunos" element={<AdminRouteGuard requireAdminAccess><AdminLayout><Students /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/alunos/:id" element={<AdminRouteGuard requireAdminAccess><AdminLayout><StudentDetail /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/cadastros" element={<AdminRouteGuard requireAdminAccess><AdminLayout><Courses /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/tarefas" element={<AdminRouteGuard requireAdminAccess><AdminLayout><Tasks /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/tarefas/:id" element={<AdminRouteGuard requireAdminAccess><AdminLayout><TaskDetail /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/leads" element={<AdminRouteGuard requireAdminAccess><AdminLayout><CRM /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/fornecedores" element={<AdminRouteGuard requireAdminAccess><AdminLayout><Suppliers /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/parceiros" element={<AdminRouteGuard requireAdminAccess><AdminLayout><Partners /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/ferramentas" element={<AdminRouteGuard requireAdminAccess><AdminLayout><Tools /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/cursos" element={<AdminRouteGuard requireAdminAccess><AdminLayout><Courses /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/cursos/:id" element={<AdminRouteGuard requireAdminAccess><AdminLayout><CourseDetails /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/mentorias" element={<AdminRouteGuard requireAdminAccess><AdminLayout><Mentoring /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/mentorias/:id" element={<AdminRouteGuard requireAdminAccess><AdminLayout><MentoringDetail /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/bonus" element={<AdminRouteGuard requireAdminAccess><AdminLayout><Bonus /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/bonus/:id" element={<AdminRouteGuard requireAdminAccess><AdminLayout><BonusDetail /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/categorias" element={<AdminRouteGuard requireAdminAccess><AdminLayout><Categories /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/tipos-parceiro" element={<AdminRouteGuard requireAdminAccess><AdminLayout><PartnerTypes /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/tipos-software" element={<AdminRouteGuard requireAdminAccess><AdminLayout><SoftwareTypes /></AdminLayout></AdminRouteGuard>} />
                <Route path="/admin/auditoria" element={<AdminRouteGuard requireAdminAccess requiredMenuKey="audit"><AdminLayout><Audit /></AdminLayout></AdminRouteGuard>} />

                {/* Student Routes */}
                <Route path="/aluno" element={<StudentRouteGuard requiredMenuKey="dashboard"><StudentLayout><StudentDashboard /></StudentLayout></StudentRouteGuard>} />
                <Route path="/aluno/fornecedores" element={<StudentRouteGuard requiredMenuKey="suppliers"><StudentLayout><StudentSuppliers /></StudentLayout></StudentRouteGuard>} />
                <Route path="/aluno/meus-fornecedores" element={<StudentRouteGuard requiredMenuKey="my-suppliers"><StudentLayout><MySuppliers /></StudentLayout></StudentRouteGuard>} />
                <Route path="/aluno/parceiros" element={<StudentRouteGuard requiredMenuKey="partners"><StudentLayout><StudentPartners /></StudentLayout></StudentRouteGuard>} />
                <Route path="/aluno/ferramentas" element={<StudentRouteGuard requiredMenuKey="tools"><StudentLayout><StudentTools /></StudentLayout></StudentRouteGuard>} />
                <Route path="/aluno/configuracoes" element={<StudentRouteGuard requiredMenuKey="settings"><StudentLayout><StudentSettings /></StudentLayout></StudentRouteGuard>} />

                {/* 404 Route */}
                <Route path="*" element={<Layout isAdmin={false}><NotFound /></Layout>} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
