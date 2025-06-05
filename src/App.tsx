
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/auth';
import { Toaster as SonnerToaster } from 'sonner';
import AdminLayout from './layout/AdminLayout';
import StudentLayout from './layout/StudentLayout';
import RouteGuard from './components/RouteGuard';
import NotFound from './pages/NotFound';

// Landing & Auth Pages
import Index from './pages/Index';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import CompleteRegistration from './pages/CompleteRegistration';

// Admin Pages - Main
import AdminDashboard from './pages/admin/Dashboard';
import AdminCRM from './pages/admin/CRM';
import AdminBonus from './pages/admin/Bonus';
import ApiDocumentation from './pages/admin/ApiDocumentation';
import AdminAudit from './pages/admin/Audit';
import AdminAuditReports from './pages/admin/AuditReports';
import AdminAuditAnalytics from './pages/admin/AuditAnalytics';
import AdminAuditBehaviorAnalytics from './pages/admin/AuditBehaviorAnalytics';
import AdminCalendlyConfig from './pages/admin/AdminCalendlyConfig';
import AdminGroups from './pages/admin/AdminGroups';
import AdminGroupSessions from './pages/admin/AdminGroupSessions';
import AdminIndividualSessions from './pages/admin/AdminIndividualSessions';
import CRMWebhookLogs from './pages/admin/CRMWebhookLogs';
import Tasks from './pages/admin/Tasks';

// Admin Pages - Specific
import Categories from './pages/admin/Categories';
import SoftwareTypes from './pages/admin/SoftwareTypes';
import PartnerTypes from './pages/admin/PartnerTypes';
import Permissions from './pages/admin/Permissions';
import Users from './pages/admin/Users';
import Students from './pages/admin/Students';
import Courses from './pages/admin/Courses';
import Mentoring from './pages/admin/Mentoring';
import Credits from './pages/admin/Credits';
import News from './pages/admin/News';
import Suppliers from './pages/admin/Suppliers';
import Partners from './pages/admin/Partners';
import Tools from './pages/admin/Tools';
import Settings from './pages/admin/Settings';

// Admin Pages - Mentoring
import AdminMentoringCatalog from './pages/admin/AdminMentoringCatalog';
import AdminMentoringSessionsGroup from './pages/admin/AdminMentoringSessionsGroup';
import AdminMentoringSessionsIndividual from './pages/admin/AdminMentoringSessionsIndividual';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentCredits from './pages/student/Credits';
import StudentSuppliers from './pages/student/Suppliers';
import StudentPartners from './pages/student/Partners';
import StudentTools from './pages/student/Tools';
import MySuppliers from './pages/student/MySuppliers';
import StudentMentoring from './pages/student/Mentoring';
import LiviAI from './pages/student/LiviAI';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/complete-registration" element={<CompleteRegistration />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <RouteGuard requireAdminAccess={true}>
                <AdminLayout />
              </RouteGuard>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="crm" element={<AdminCRM />} />
              <Route path="bonus" element={<AdminBonus />} />
              <Route path="api-docs" element={<ApiDocumentation />} />
              
              {/* Mentoring Routes */}
              <Route path="mentorias" element={<AdminDashboard />} />
              <Route path="mentorias/catalogo" element={<AdminMentoringCatalog />} />
              <Route path="inscricoes-individuais" element={<AdminGroups />} />
              <Route path="inscricoes-grupo" element={<AdminGroups />} />
              <Route path="sessoes-individuais" element={<AdminMentoringSessionsIndividual />} />
              <Route path="sessoes-grupo" element={<AdminMentoringSessionsGroup />} />
              <Route path="mentorias/materiais" element={<AdminDashboard />} />
              
              {/* Management Routes */}
              <Route path="usuarios" element={<Users />} />
              <Route path="alunos" element={<Students />} />
              <Route path="cursos" element={<Courses />} />
              <Route path="mentoria" element={<Mentoring />} />
              <Route path="creditos" element={<Credits />} />
              <Route path="noticias" element={<News />} />
              <Route path="tarefas" element={<Tasks />} />
              <Route path="crm-webhook-logs" element={<CRMWebhookLogs />} />
              
              {/* Resources Routes */}
              <Route path="fornecedores" element={<Suppliers />} />
              <Route path="parceiros" element={<Partners />} />
              <Route path="ferramentas" element={<Tools />} />
              
              {/* Configuration Routes */}
              <Route path="categorias" element={<Categories />} />
              <Route path="tipos-softwares" element={<SoftwareTypes />} />
              <Route path="tipos-parceiros" element={<PartnerTypes />} />
              <Route path="permissoes" element={<Permissions />} />
              <Route path="auditoria" element={<AdminAudit />} />
              <Route path="auditoria/relatorios" element={<AdminAuditReports />} />
              <Route path="auditoria/analytics" element={<AdminAuditAnalytics />} />
              <Route path="auditoria/behavior" element={<AdminAuditBehaviorAnalytics />} />
              <Route path="calendly-config" element={<AdminCalendlyConfig />} />
              <Route path="configuracoes" element={<Settings />} />
              
              {/* Individual/Group Sessions */}
              <Route path="individual-sessions" element={<AdminIndividualSessions />} />
              <Route path="group-sessions" element={<AdminGroupSessions />} />
            </Route>

            {/* Student Routes */}
            <Route path="/student" element={
              <RouteGuard requireAdminAccess={false}>
                <StudentLayout />
              </RouteGuard>
            }>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="creditos" element={<StudentCredits />} />
              <Route path="fornecedores" element={<StudentSuppliers />} />
              <Route path="parceiros" element={<StudentPartners />} />
              <Route path="ferramentas" element={<StudentTools />} />
              <Route path="meus-fornecedores" element={<MySuppliers />} />
              <Route path="mentoria" element={<StudentMentoring />} />
              <Route path="livi-ai" element={<LiviAI />} />
            </Route>

            {/* Catch all route - 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
        <SonnerToaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
