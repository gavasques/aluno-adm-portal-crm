
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/auth";
import { RouteDebugger } from "@/components/debug/RouteDebugger";
import { Error404Boundary } from "@/components/ErrorBoundary404";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import CompleteRegistration from "./pages/CompleteRegistration";
import NotFound from "./pages/NotFound";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Students from "./pages/admin/Students";
import Suppliers from "./pages/admin/Suppliers";
import Partners from "./pages/admin/Partners";
import Tools from "./pages/admin/Tools";
import Categories from "./pages/admin/Categories";
import PartnerTypes from "./pages/admin/PartnerTypes";
import SoftwareTypes from "./pages/admin/SoftwareTypes";
import News from "./pages/admin/News";
import Bonus from "./pages/admin/Bonus";
import BonusDetail from "./pages/admin/BonusDetail";
import Courses from "./pages/admin/Courses";
import Credits from "./pages/admin/Credits";
import Tasks from "./pages/admin/Tasks";
import CRM from "./pages/admin/CRM";
import CRMLeadDetail from "./pages/admin/CRMLeadDetail";
import CRMWebhookLogs from "./pages/admin/CRMWebhookLogs";
import Mentoring from "./pages/admin/Mentoring";
import MentoringDetail from "./pages/admin/MentoringDetail";
import AdminMentoringCatalog from "./pages/admin/AdminMentoringCatalog";
import AdminMentoringEnrollments from "./pages/admin/AdminMentoringEnrollments";
import AdminIndividualEnrollments from "./pages/admin/AdminIndividualEnrollments";
import AdminGroupEnrollments from "./pages/admin/AdminGroupEnrollments";
import AdminMentoringSessionsIndividual from "./pages/admin/AdminMentoringSessionsIndividual";
import AdminMentoringSessionsGroup from "./pages/admin/AdminMentoringSessionsGroup";
import AdminCalendlyConfig from "./pages/admin/AdminCalendlyConfig";
import Permissions from "./pages/admin/Permissions";
import Audit from "./pages/admin/Audit";
import AuditAnalytics from "./pages/admin/AuditAnalytics";
import AuditReports from "./pages/admin/AuditReports";
import AuditBehaviorAnalytics from "./pages/admin/AuditBehaviorAnalytics";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentSuppliers from "./pages/student/Suppliers";
import StudentMySuppliers from "./pages/student/MySuppliers";
import StudentMySupplierDetail from "./pages/student/MySupplierDetail";
import StudentSupplierDetail from "./pages/student/SupplierDetail";
import StudentPartners from "./pages/student/Partners";
import StudentTools from "./pages/student/Tools";
import StudentCredits from "./pages/student/Credits";
import StudentMentoring from "./pages/student/Mentoring";
import StudentLiviAI from "./pages/student/LiviAI";
import StudentSettings from "./pages/student/Settings";

import RouteGuard from "./components/admin/RouteGuard";
import StudentRouteGuard from "./components/student/RouteGuard";
import AdminLayout from "./layout/AdminLayout";
import StudentLayout from "./layout/StudentLayout";

// Otimizar configuração do QueryClient para evitar refetches desnecessários
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 1,
      refetchOnWindowFocus: false, // Evitar refetch ao focar janela
      refetchOnMount: false, // Evitar refetch desnecessário
      refetchOnReconnect: false, // Evitar refetch ao reconectar
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <RouteDebugger />
            <Error404Boundary>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/complete-registration" element={<CompleteRegistration />} />
                
                {/* Admin Routes - URLs em português para corresponder ao menu */}
                <Route path="/admin" element={
                  <RouteGuard requireAdminAccess>
                    <AdminLayout />
                  </RouteGuard>
                }>
                  <Route index element={<Dashboard />} />
                  {/* Rota duplicada para dashboard */}
                  <Route path="dashboard" element={<Dashboard />} />
                  
                  {/* Principal */}
                  <Route path="usuarios" element={<Users />} />
                  <Route path="crm" element={<CRM />} />
                  <Route path="crm/lead/:id" element={<CRMLeadDetail />} />
                  <Route path="crm-webhook-logs" element={<CRMWebhookLogs />} />
                  <Route path="tarefas" element={<Tasks />} />
                  
                  {/* Mentorias */}
                  <Route path="mentorias" element={<Mentoring />} />
                  <Route path="mentorias/:id" element={<MentoringDetail />} />
                  <Route path="mentorias/catalogo" element={<AdminMentoringCatalog />} />
                  <Route path="inscricoes-individuais" element={<AdminIndividualEnrollments />} />
                  <Route path="inscricoes-grupo" element={<AdminGroupEnrollments />} />
                  <Route path="sessoes-individuais" element={<AdminMentoringSessionsIndividual />} />
                  <Route path="sessoes-grupo" element={<AdminMentoringSessionsGroup />} />
                  <Route path="mentorias/materiais" element={<AdminMentoringCatalog />} />
                  
                  {/* Gestão */}
                  <Route path="alunos" element={<Students />} />
                  <Route path="cursos" element={<Courses />} />
                  <Route path="mentoria" element={<Mentoring />} />
                  <Route path="bonus" element={<Bonus />} />
                  <Route path="bonus/:id" element={<BonusDetail />} />
                  <Route path="creditos" element={<Credits />} />
                  <Route path="noticias" element={<News />} />
                  
                  {/* Recursos Gerais */}
                  <Route path="fornecedores" element={<Suppliers />} />
                  <Route path="parceiros" element={<Partners />} />
                  <Route path="ferramentas" element={<Tools />} />
                  
                  {/* Configurações */}
                  <Route path="categorias" element={<Categories />} />
                  <Route path="tipos-softwares" element={<SoftwareTypes />} />
                  <Route path="tipos-parceiros" element={<PartnerTypes />} />
                  <Route path="permissoes" element={<Permissions />} />
                  <Route path="auditoria" element={<Audit />} />
                  <Route path="audit-analytics" element={<AuditAnalytics />} />
                  <Route path="audit-reports" element={<AuditReports />} />
                  <Route path="audit-behavior" element={<AuditBehaviorAnalytics />} />
                  <Route path="calendly-config" element={<AdminCalendlyConfig />} />
                  
                  {/* Rotas legadas para compatibilidade */}
                  <Route path="users" element={<Users />} />
                  <Route path="students" element={<Students />} />
                  <Route path="suppliers" element={<Suppliers />} />
                  <Route path="partners" element={<Partners />} />
                  <Route path="tools" element={<Tools />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="partner-types" element={<PartnerTypes />} />
                  <Route path="software-types" element={<SoftwareTypes />} />
                  <Route path="news" element={<News />} />
                  <Route path="courses" element={<Courses />} />
                  <Route path="credits" element={<Credits />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="mentoring" element={<Mentoring />} />
                  <Route path="mentoring/:id" element={<MentoringDetail />} />
                  <Route path="mentoring-catalog" element={<AdminMentoringCatalog />} />
                  <Route path="mentoring-enrollments" element={<AdminMentoringEnrollments />} />
                  <Route path="individual-enrollments" element={<AdminIndividualEnrollments />} />
                  <Route path="group-enrollments" element={<AdminGroupEnrollments />} />
                  <Route path="individual-sessions" element={<AdminMentoringSessionsIndividual />} />
                  <Route path="group-sessions" element={<AdminMentoringSessionsGroup />} />
                  <Route path="permissions" element={<Permissions />} />
                  <Route path="audit" element={<Audit />} />
                </Route>

                {/* Student Routes */}
                <Route path="/aluno" element={
                  <StudentRouteGuard>
                    <StudentLayout />
                  </StudentRouteGuard>
                }>
                  <Route index element={<StudentDashboard />} />
                  <Route path="fornecedores" element={<StudentSuppliers />} />
                  <Route path="meus-fornecedores" element={<StudentMySuppliers />} />
                  <Route path="meus-fornecedores/:id" element={<StudentMySupplierDetail />} />
                  <Route path="fornecedores/:id" element={<StudentSupplierDetail />} />
                  <Route path="parceiros" element={<StudentPartners />} />
                  <Route path="ferramentas" element={<StudentTools />} />
                  <Route path="creditos" element={<StudentCredits />} />
                  <Route path="mentoria" element={<StudentMentoring />} />
                  <Route path="livi-ai" element={<StudentLiviAI />} />
                  <Route path="configuracoes" element={<StudentSettings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Error404Boundary>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
