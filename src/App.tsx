
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/sonner';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';
import { AuthProvider, useAuth } from '@/hooks/auth';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import ResetPassword from '@/pages/ResetPassword';
import CompleteRegistration from '@/pages/CompleteRegistration';
import NotFound from '@/pages/NotFound';
import ErrorBoundary from '@/components/ErrorBoundary';
import AdminLayout from '@/layout/AdminLayout';
import StudentLayout from '@/layout/StudentLayout';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import CRM from '@/pages/admin/CRM';
import CRMLeadDetail from '@/pages/admin/CRMLeadDetail';
import LeadDetail from '@/pages/admin/LeadDetail';
import Users from '@/pages/admin/Users';
import ModernUsers from '@/pages/admin/ModernUsers';
import Students from '@/pages/admin/Students';
import StudentDetail from '@/pages/admin/StudentDetail';
import Suppliers from '@/pages/admin/Suppliers';
import Partners from '@/pages/admin/Partners';
import Tools from '@/pages/admin/Tools';
import Credits from '@/pages/admin/Credits';
import News from '@/pages/admin/News';
import Tasks from '@/pages/admin/Tasks';
import TaskDetail from '@/pages/admin/TaskDetail';
import Permissions from '@/pages/admin/Permissions';
import Settings from '@/pages/admin/Settings';
import Categories from '@/pages/admin/Categories';
import Bonus from '@/pages/admin/Bonus';
import BonusDetail from '@/pages/admin/BonusDetail';
import PartnerTypes from '@/pages/admin/PartnerTypes';
import SoftwareTypes from '@/pages/admin/SoftwareTypes';
import Registers from '@/pages/admin/Registers';
import Audit from '@/pages/admin/Audit';
import AuditAnalytics from '@/pages/admin/AuditAnalytics';
import AuditBehaviorAnalytics from '@/pages/admin/AuditBehaviorAnalytics';
import AuditReports from '@/pages/admin/AuditReports';
import AdminCalendlyConfig from '@/pages/admin/AdminCalendlyConfig';
import Courses from '@/pages/admin/Courses';
import CourseDetails from '@/pages/admin/CourseDetails';

// Admin Mentoring Pages
import Mentoring from '@/pages/admin/Mentoring';
import MentoringDetail from '@/pages/admin/MentoringDetail';
import AdminMentoringDashboard from '@/pages/admin/AdminMentoringDashboard';
import AdminMentoringCatalog from '@/pages/admin/AdminMentoringCatalog';
import MentoringCatalogManagement from '@/pages/admin/MentoringCatalogManagement';
import AdminMentoringEnrollments from '@/pages/admin/AdminMentoringEnrollments';
import AdminIndividualEnrollments from '@/pages/admin/AdminIndividualEnrollments';
import AdminGroupEnrollments from '@/pages/admin/AdminGroupEnrollments';
import AdminMentoringSessions from '@/pages/admin/AdminMentoringSessions';
import AdminIndividualSessions from '@/pages/admin/AdminIndividualSessions';
import AdminGroupSessions from '@/pages/admin/AdminGroupSessions';
import AdminMentoringSessionsGroup from '@/pages/admin/AdminMentoringSessionsGroup';
import AdminMentoringSessionsIndividual from '@/pages/admin/AdminMentoringSessionsIndividual';
import AdminMentoringMaterials from '@/pages/admin/AdminMentoringMaterials';
import AdminMentoringManagement from '@/pages/admin/AdminMentoringManagement';
import AdminGroups from '@/pages/admin/AdminGroups';

// Student Pages
import StudentDashboard from '@/pages/student/Dashboard';
import StudentCredits from '@/pages/student/Credits';
import StudentLiviAI from '@/pages/student/LiviAI';
import StudentMentoring from '@/pages/student/Mentoring';
import StudentMentoringDetail from '@/pages/student/MentoringDetail';
import StudentMentoringSession from '@/pages/student/MentoringSession';
import StudentMySuppliers from '@/pages/student/MySuppliers';
import MySupplierDetail from '@/pages/student/MySupplierDetail';
import StudentPartners from '@/pages/student/Partners';
import StudentSuppliers from '@/pages/student/Suppliers';
import SupplierDetail from '@/pages/student/SupplierDetail';
import StudentTools from '@/pages/student/Tools';
import StudentSettings from '@/pages/student/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Toaster />
          <AccessibilityProvider>
            <BrowserRouter>
              <AuthProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/complete-registration" element={<CompleteRegistration />} />

                  {/* Admin Routes with Layout */}
                  <Route
                    path="/admin"
                    element={
                      <RouteGuard>
                        <AdminLayout />
                      </RouteGuard>
                    }
                  >
                    {/* Main Admin Pages */}
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    
                    {/* Geral */}
                    <Route path="creditos" element={<Credits />} />
                    
                    {/* Operacional */}
                    <Route path="tarefas" element={<Tasks />} />
                    <Route path="tarefas/:id" element={<TaskDetail />} />
                    <Route path="crm" element={<CRM />} />
                    <Route path="crm/lead/:leadId" element={<CRMLeadDetail />} />
                    <Route path="lead/:id" element={<LeadDetail />} />
                    
                    {/* Geral ADM */}
                    <Route path="fornecedores" element={<Suppliers />} />
                    <Route path="parceiros" element={<Partners />} />
                    <Route path="ferramentas" element={<Tools />} />
                    
                    {/* Mentorias */}
                    <Route path="mentorias" element={<AdminMentoringDashboard />} />
                    <Route path="mentorias/catalogo" element={<AdminMentoringCatalog />} />
                    <Route path="inscricoes-individuais" element={<AdminIndividualEnrollments />} />
                    <Route path="inscricoes-grupo" element={<AdminGroupEnrollments />} />
                    <Route path="sessoes-individuais" element={<AdminIndividualSessions />} />
                    <Route path="sessoes-grupo" element={<AdminGroupSessions />} />
                    <Route path="mentorias/materiais" element={<AdminMentoringMaterials />} />
                    
                    {/* Gestão */}
                    <Route path="usuarios" element={<Users />} />
                    <Route path="modern-users" element={<ModernUsers />} />
                    <Route path="alunos" element={<Students />} />
                    <Route path="alunos/:id" element={<StudentDetail />} />
                    <Route path="cursos" element={<Courses />} />
                    <Route path="cursos/:id" element={<CourseDetails />} />
                    <Route path="mentoria" element={<Mentoring />} />
                    <Route path="mentoria/:id" element={<MentoringDetail />} />
                    <Route path="bonus" element={<Bonus />} />
                    <Route path="bonus/:id" element={<BonusDetail />} />
                    <Route path="noticias" element={<News />} />
                    <Route path="permissoes" element={<Permissions />} />
                    <Route path="auditoria" element={<Audit />} />
                    <Route path="audit-analytics" element={<AuditAnalytics />} />
                    <Route path="audit-behavior" element={<AuditBehaviorAnalytics />} />
                    <Route path="audit-reports" element={<AuditReports />} />
                    <Route path="calendly-config" element={<AdminCalendlyConfig />} />
                    
                    {/* Cadastros */}
                    <Route path="categorias" element={<Categories />} />
                    <Route path="tipos-softwares" element={<SoftwareTypes />} />
                    <Route path="tipos-parceiros" element={<PartnerTypes />} />
                    
                    {/* Sistema */}
                    <Route path="configuracoes" element={<Settings />} />
                    <Route path="registers" element={<Registers />} />
                    
                    {/* Additional Mentoring Routes */}
                    <Route path="mentoring-catalog-management" element={<MentoringCatalogManagement />} />
                    <Route path="mentoring-enrollments" element={<AdminMentoringEnrollments />} />
                    <Route path="individual-enrollments" element={<AdminIndividualEnrollments />} />
                    <Route path="group-enrollments" element={<AdminGroupEnrollments />} />
                    <Route path="mentoring-sessions" element={<AdminMentoringSessions />} />
                    <Route path="individual-sessions" element={<AdminIndividualSessions />} />
                    <Route path="group-sessions" element={<AdminGroupSessions />} />
                    <Route path="mentoring-sessions-group" element={<AdminMentoringSessionsGroup />} />
                    <Route path="mentoring-sessions-individual" element={<AdminMentoringSessionsIndividual />} />
                    <Route path="mentoring-materials" element={<AdminMentoringMaterials />} />
                    <Route path="mentoring-management" element={<AdminMentoringManagement />} />
                    <Route path="groups" element={<AdminGroups />} />
                  </Route>

                  {/* Student Routes with Layout */}
                  <Route
                    path="/aluno"
                    element={
                      <RouteGuard>
                        <StudentLayout />
                      </RouteGuard>
                    }
                  >
                    {/* Main Student Pages */}
                    <Route index element={<StudentDashboard />} />
                    <Route path="dashboard" element={<StudentDashboard />} />
                    
                    {/* Student Resources */}
                    <Route path="creditos" element={<StudentCredits />} />
                    <Route path="livi-ai" element={<StudentLiviAI />} />
                    
                    {/* Mentoring */}
                    <Route path="mentoria" element={<StudentMentoring />} />
                    <Route path="mentoria/:id" element={<StudentMentoringDetail />} />
                    <Route path="mentoria/sessao/:id" element={<StudentMentoringSession />} />
                    
                    {/* Suppliers & Resources */}
                    <Route path="fornecedores" element={<StudentSuppliers />} />
                    <Route path="fornecedores/:id" element={<SupplierDetail />} />
                    <Route path="meus-fornecedores" element={<StudentMySuppliers />} />
                    <Route path="meus-fornecedores/:id" element={<MySupplierDetail />} />
                    <Route path="parceiros" element={<StudentPartners />} />
                    <Route path="ferramentas" element={<StudentTools />} />
                    
                    {/* Settings */}
                    <Route path="configuracoes" element={<StudentSettings />} />
                  </Route>
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </AccessibilityProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
