
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/auth';

import Home from './pages/Index';
import Login from './pages/Login';
import CompleteRegistration from './pages/CompleteRegistration';
import ResetPassword from './pages/ResetPassword';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import Profile from './pages/student/Settings';
import StudentMySuppliers from './pages/student/MySuppliers';
import StudentMentoring from './pages/student/Mentoring';
import StudentSuppliers from './pages/student/Suppliers';
import StudentPartners from './pages/student/Partners';
import StudentTools from './pages/student/Tools';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';
import AdminPermissions from './pages/admin/Permissions';
import AdminStudents from './pages/admin/Students';
import AdminRegisters from './pages/admin/Registers';
import AdminAudit from './pages/admin/Audit';
import AdminTasks from './pages/admin/Tasks';
import AdminCRM from './pages/admin/CRM';
import AdminSuppliers from './pages/admin/Suppliers';
import AdminPartners from './pages/admin/Partners';
import AdminTools from './pages/admin/Tools';

// Mentoring Admin Pages
import AdminMentoringCatalog from './pages/admin/AdminMentoringCatalog';
import AdminMentoringEnrollments from './pages/admin/AdminMentoringEnrollments';
import AdminIndividualEnrollments from './pages/admin/AdminIndividualEnrollments';
import AdminGroupEnrollments from './pages/admin/AdminGroupEnrollments';
import AdminMentoringSessions from './pages/admin/AdminMentoringSessions';
import AdminMentoringMaterials from './pages/admin/AdminMentoringMaterials';
import AdminIndividualSessions from './pages/admin/AdminIndividualSessions';
import AdminGroupSessions from './pages/admin/AdminGroupSessions';
import AdminCalendlyConfig from '@/pages/admin/AdminCalendlyConfig';

// Layouts
import AdminLayout from './layout/AdminLayout';
import Layout from './layout/Layout';
import RouteGuard from './components/RouteGuard';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <div className="min-h-screen bg-gray-50">
          <Router>
            <AuthProvider>
              <Toaster />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/complete-registration" element={<CompleteRegistration />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Rotas protegidas para alunos */}
                <Route path="/aluno" element={
                  <RouteGuard requireAdminAccess={false}>
                    <Layout isAdmin={false}>
                      <StudentDashboard />
                    </Layout>
                  </RouteGuard>
                } />
                
                <Route path="/aluno/configuracoes" element={
                  <RouteGuard requireAdminAccess={false}>
                    <Layout isAdmin={false}>
                      <Profile />
                    </Layout>
                  </RouteGuard>
                } />

                <Route path="/aluno/meus-fornecedores" element={
                  <RouteGuard requireAdminAccess={false}>
                    <Layout isAdmin={false}>
                      <StudentMySuppliers />
                    </Layout>
                  </RouteGuard>
                } />

                <Route path="/aluno/mentorias" element={
                  <RouteGuard requireAdminAccess={false}>
                    <Layout isAdmin={false}>
                      <StudentMentoring />
                    </Layout>
                  </RouteGuard>
                } />

                <Route path="/aluno/fornecedores" element={
                  <RouteGuard requireAdminAccess={false}>
                    <Layout isAdmin={false}>
                      <StudentSuppliers />
                    </Layout>
                  </RouteGuard>
                } />

                <Route path="/aluno/parceiros" element={
                  <RouteGuard requireAdminAccess={false}>
                    <Layout isAdmin={false}>
                      <StudentPartners />
                    </Layout>
                  </RouteGuard>
                } />

                <Route path="/aluno/ferramentas" element={
                  <RouteGuard requireAdminAccess={false}>
                    <Layout isAdmin={false}>
                      <StudentTools />
                    </Layout>
                  </RouteGuard>
                } />

                {/* Rota legacy mantida para compatibilidade */}
                <Route path="/profile" element={
                  <RouteGuard requireAdminAccess={false}>
                    <Layout isAdmin={false}>
                      <Profile />
                    </Layout>
                  </RouteGuard>
                } />

                {/* Rotas de Admin */}
                <Route path="/admin" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/configuracoes" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminSettings />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/usuarios" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminUsers />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/permissoes" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminPermissions />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/alunos" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminStudents />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/cadastros" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminRegisters />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/auditoria" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminAudit />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/tarefas" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminTasks />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/crm" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminCRM />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/fornecedores" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminSuppliers />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/parceiros" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminPartners />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/ferramentas" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminTools />
                    </AdminLayout>
                  </RouteGuard>
                } />

                {/* Rotas de Mentorias */}
                <Route path="/admin/mentorias" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminMentoringCatalog />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/mentorias/catalogo" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminMentoringCatalog />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/inscricoes-individuais" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminIndividualEnrollments />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/inscricoes-grupo" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminGroupEnrollments />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/mentorias/sessoes-individuais" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminIndividualSessions />
                    </AdminLayout>
                  </RouteGuard>
                } />

                <Route path="/admin/mentorias/sessoes-grupo" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminGroupSessions />
                    </AdminLayout>
                  </RouteGuard>
                } />

                {/* Rotas legadas de mentorias mantidas para compatibilidade */}
                <Route path="/admin/mentorias/inscricoes" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminMentoringEnrollments />
                    </AdminLayout>
                  </RouteGuard>
                } />
                
                <Route path="/admin/mentorias/inscricoes-individuais" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminIndividualEnrollments />
                    </AdminLayout>
                  </RouteGuard>
                } />
                
                <Route path="/admin/mentorias/inscricoes-em-grupo" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminGroupEnrollments />
                    </AdminLayout>
                  </RouteGuard>
                } />
                
                <Route path="/admin/mentorias/sessoes" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminMentoringSessions />
                    </AdminLayout>
                  </RouteGuard>
                } />
                
                <Route path="/admin/mentorias/materiais" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminMentoringMaterials />
                    </AdminLayout>
                  </RouteGuard>
                } />
                
                {/* Rota para configurações do Calendly */}
                <Route path="/admin/calendly-config" element={
                  <RouteGuard requireAdminAccess={true}>
                    <AdminLayout>
                      <AdminCalendlyConfig />
                    </AdminLayout>
                  </RouteGuard>
                } />
              </Routes>
            </AuthProvider>
          </Router>
        </div>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
