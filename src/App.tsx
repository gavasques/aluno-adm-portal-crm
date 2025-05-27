
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/useAuth';

import Home from './pages/Index';
import Login from './pages/AcceptInvite';
import Profile from './pages/student/Settings';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminMentoringCatalog from './pages/admin/AdminMentoringCatalog';
import AdminMentoringEnrollments from './pages/admin/AdminMentoringEnrollments';
import AdminIndividualEnrollments from './pages/admin/AdminIndividualEnrollments';
import AdminGroupEnrollments from './pages/admin/AdminGroupEnrollments';
import AdminMentoringSessions from './pages/admin/AdminMentoringSessions';
import AdminMentoringMaterials from './pages/admin/AdminMentoringMaterials';
import AdminLayout from './layout/AdminLayout';
import Layout from './layout/Layout';
import RouteGuard from './components/RouteGuard';
import { HelmetProvider } from 'react-helmet-async';
import AdminCalendlyConfig from '@/pages/admin/AdminCalendlyConfig';

function App() {
  const queryClient = new QueryClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <div className="min-h-screen bg-gray-50">
          <Router>
            <Toaster />
            <Routes>
              <Route path="/" element={
                <Layout isAdmin={false}>
                  <Home />
                </Layout>
              } />
              <Route path="/login" element={<Login />} />
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
              <Route path="/admin/usuarios" element={
                <RouteGuard requireAdminAccess={true}>
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </RouteGuard>
              } />
              <Route path="/admin/mentorias" element={
                <RouteGuard requireAdminAccess={true}>
                  <AdminLayout>
                    <AdminMentoringCatalog />
                  </AdminLayout>
                </RouteGuard>
              } />
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
          </Router>
        </div>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
