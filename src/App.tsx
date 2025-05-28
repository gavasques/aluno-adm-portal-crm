import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Import pages
import Index from './pages/Index';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import CompleteRegistration from './pages/CompleteRegistration';
import Dashboard from './pages/admin/Dashboard';
import Credits from './pages/admin/Credits';
import Tasks from './pages/admin/Tasks';
import TaskDetail from './pages/admin/TaskDetail';
import CRM from './pages/admin/CRM';
import AdminSuppliers from './pages/admin/Suppliers';
import AdminPartners from './pages/admin/Partners';
import AdminTools from './pages/admin/Tools';
import AdminMentoringDashboard from './pages/admin/mentoring/AdminMentoringDashboard';
import AdminMentoringCatalog from './pages/admin/mentoring/AdminMentoringCatalog';
import AdminIndividualEnrollments from './pages/admin/mentoring/AdminIndividualEnrollments';
import AdminGroupEnrollments from './pages/admin/mentoring/AdminGroupEnrollments';
import AdminMentoringMaterials from './pages/admin/mentoring/AdminMentoringMaterials';
import OptimizedUsers from './pages/admin/OptimizedUsers';
import Permissions from './pages/admin/Permissions';
import Audit from './pages/admin/Audit';
import AdminCalendlyConfig from './pages/admin/AdminCalendlyConfig';
import Settings from './pages/admin/Settings';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentSuppliers from './pages/student/StudentSuppliers';
import StudentSupplierDetail from './pages/student/StudentSupplierDetail';
import MySuppliers from './pages/student/MySuppliers';
import MySupplierDetail from './pages/student/MySupplierDetail';
import StudentPartners from './pages/student/StudentPartners';
import StudentTools from './pages/student/StudentTools';
import StudentMentoring from './pages/student/StudentMentoring';
import StudentMentoringDetail from './pages/student/StudentMentoringDetail';
import MentoringSession from './pages/student/MentoringSession';
import StudentCredits from './pages/student/StudentCredits';
import StudentSettings from './pages/student/StudentSettings';
import NotFound from './pages/NotFound';

// Import route guard
import RouteGuard from './components/auth/RouteGuard';
import { useAuth } from './hooks/useAuth';

// Create a query client
const queryClient = new QueryClient();

import Categories from './pages/admin/Categories';
import SoftwareTypes from './pages/admin/SoftwareTypes';
import PartnerTypes from './pages/admin/PartnerTypes';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/complete-registration" element={<CompleteRegistration />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <Dashboard />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/creditos" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <Credits />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/tarefas" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <Tasks />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/tarefas/:taskId" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <TaskDetail />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/crm" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <CRM />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/fornecedores" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <AdminSuppliers />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/parceiros" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <AdminPartners />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/ferramentas" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <AdminTools />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/mentorias" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <AdminMentoringDashboard />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/mentorias/catalogo" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <AdminMentoringCatalog />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/inscricoes-individuais" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <AdminIndividualEnrollments />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/inscricoes-grupo" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <AdminGroupEnrollments />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/mentorias/materiais" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <AdminMentoringMaterials />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/usuarios" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <OptimizedUsers />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/permissoes" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <Permissions />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/auditoria" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <Audit />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/calendly-config" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <AdminCalendlyConfig />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/categorias" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <Categories />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/tipos-softwares" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <SoftwareTypes />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/tipos-parceiros" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <PartnerTypes />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/admin/configuracoes" element={
            <RouteGuard requiredRole="admin">
              <Layout isAdmin={true}>
                <Settings />
              </Layout>
            </RouteGuard>
          } />

          {/* Student routes */}
          <Route path="/aluno" element={
            <RouteGuard requiredRole="student">
              <Layout isAdmin={false}>
                <StudentDashboard />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/aluno/fornecedores" element={
            <RouteGuard requiredRole="student">
              <Layout isAdmin={false}>
                <StudentSuppliers />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/aluno/fornecedores/:id" element={
            <RouteGuard requiredRole="student">
              <Layout isAdmin={false}>
                <StudentSupplierDetail />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/aluno/meus-fornecedores" element={
            <RouteGuard requiredRole="student">
              <Layout isAdmin={false}>
                <MySuppliers />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/aluno/meus-fornecedores/:id" element={
            <RouteGuard requiredRole="student">
              <Layout isAdmin={false}>
                <MySupplierDetail />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/aluno/parceiros" element={
            <RouteGuard requiredRole="student">
              <Layout isAdmin={false}>
                <StudentPartners />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/aluno/ferramentas" element={
            <RouteGuard requiredRole="student">
              <Layout isAdmin={false}>
                <StudentTools />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/aluno/mentorias" element={
            <RouteGuard requiredRole="student">
              <Layout isAdmin={false}>
                <StudentMentoring />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/aluno/mentorias/:id" element={
            <RouteGuard requiredRole="student">
              <Layout isAdmin={false}>
                <StudentMentoringDetail />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/aluno/mentorias/:id/sessao" element={
            <RouteGuard requiredRole="student">
              <Layout isAdmin={false}>
                <MentoringSession />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/aluno/creditos" element={
            <RouteGuard requiredRole="student">
              <Layout isAdmin={false}>
                <StudentCredits />
              </Layout>
            </RouteGuard>
          } />
          
          <Route path="/aluno/configuracoes" element={
            <RouteGuard requiredRole="student">
              <Layout isAdmin={false}>
                <StudentSettings />
              </Layout>
            </RouteGuard>
          } />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </QueryClientProvider>
    </Router>
  );
}

export default App;
