
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/contexts/UserContext';
import { Toaster as SonnerToaster } from 'sonner';
import AdminLayout from './layout/AdminLayout';
import StudentLayout from './layout/StudentLayout';
import RouteGuard from './components/RouteGuard';
import NotFound from './pages/NotFound';

// Landing & Auth Pages
import Index from './pages/Index';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';

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

// Admin Pages - Mentoring
import AdminMentoringCatalog from './pages/admin/AdminMentoringCatalog';
import AdminMentoringSessionsGroup from './pages/admin/AdminMentoringSessionsGroup';
import AdminMentoringSessionsIndividual from './pages/admin/AdminMentoringSessionsIndividual';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';

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
      <UserProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
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
              <Route path="usuarios" element={<AdminDashboard />} />
              <Route path="alunos" element={<AdminDashboard />} />
              <Route path="cursos" element={<AdminDashboard />} />
              <Route path="mentoria" element={<AdminDashboard />} />
              <Route path="creditos" element={<AdminDashboard />} />
              <Route path="noticias" element={<AdminDashboard />} />
              <Route path="tarefas" element={<AdminDashboard />} />
              <Route path="crm-webhook-logs" element={<AdminDashboard />} />
              
              {/* Resources Routes */}
              <Route path="fornecedores" element={<AdminDashboard />} />
              <Route path="parceiros" element={<AdminDashboard />} />
              <Route path="ferramentas" element={<AdminDashboard />} />
              
              {/* Configuration Routes */}
              <Route path="categorias" element={<AdminDashboard />} />
              <Route path="tipos-softwares" element={<AdminDashboard />} />
              <Route path="tipos-parceiros" element={<AdminDashboard />} />
              <Route path="permissoes" element={<AdminDashboard />} />
              <Route path="auditoria" element={<AdminAudit />} />
              <Route path="auditoria/relatorios" element={<AdminAuditReports />} />
              <Route path="auditoria/analytics" element={<AdminAuditAnalytics />} />
              <Route path="auditoria/behavior" element={<AdminAuditBehaviorAnalytics />} />
              <Route path="calendly-config" element={<AdminCalendlyConfig />} />
              <Route path="configuracoes" element={<AdminDashboard />} />
              
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
              <Route path="creditos" element={<StudentDashboard />} />
              <Route path="fornecedores" element={<StudentDashboard />} />
              <Route path="parceiros" element={<StudentDashboard />} />
              <Route path="ferramentas" element={<StudentDashboard />} />
              <Route path="meus-fornecedores" element={<StudentDashboard />} />
              <Route path="mentoria" element={<StudentDashboard />} />
              <Route path="livi-ai" element={<StudentDashboard />} />
            </Route>

            {/* Catch all route - 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
        <SonnerToaster />
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
