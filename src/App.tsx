import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/useAuth';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMentors from './pages/admin/AdminMentors';
import AdminMentees from './pages/admin/AdminMentees';
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
                <Layout>
                  <Home />
                </Layout>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={
                <RouteGuard>
                  <Layout>
                    <Profile />
                  </Layout>
                </RouteGuard>
              } />

              {/* Rotas de Admin */}
              <Route path="/admin" element={
                <RouteGuard requiredRole="Admin">
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </RouteGuard>
              } />
              <Route path="/admin/usuarios" element={
                <RouteGuard requiredRole="Admin">
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </RouteGuard>
              } />
              <Route path="/admin/mentores" element={
                <RouteGuard requiredRole="Admin">
                  <AdminLayout>
                    <AdminMentors />
                  </AdminLayout>
                </RouteGuard>
              } />
              <Route path="/admin/mentees" element={
                <RouteGuard requiredRole="Admin">
                  <AdminLayout>
                    <AdminMentees />
                  </AdminLayout>
                </RouteGuard>
              } />
              <Route path="/admin/mentorias" element={
                <RouteGuard requiredRole="Admin">
                  <AdminLayout>
                    <AdminMentoringCatalog />
                  </AdminLayout>
                </RouteGuard>
              } />
              <Route path="/admin/mentorias/inscricoes" element={
                <RouteGuard requiredRole="Admin">
                  <AdminLayout>
                    <AdminMentoringEnrollments />
                  </AdminLayout>
                </RouteGuard>
              } />
              <Route path="/admin/mentorias/inscricoes-individuais" element={
                <RouteGuard requiredRole="Admin">
                  <AdminLayout>
                    <AdminIndividualEnrollments />
                  </AdminLayout>
                </RouteGuard>
              } />
              <Route path="/admin/mentorias/inscricoes-em-grupo" element={
                <RouteGuard requiredRole="Admin">
                  <AdminLayout>
                    <AdminGroupEnrollments />
                  </AdminLayout>
                </RouteGuard>
              } />
              <Route path="/admin/mentorias/sessoes" element={
                <RouteGuard requiredRole="Admin">
                  <AdminLayout>
                    <AdminMentoringSessions />
                  </AdminLayout>
                </RouteGuard>
              } />
              <Route path="/admin/mentorias/materiais" element={
                <RouteGuard requiredRole="Admin">
                  <AdminLayout>
                    <AdminMentoringMaterials />
                  </AdminLayout>
                </RouteGuard>
              } />
              
              {/* Rota para configurações do Calendly */}
              <Route path="/admin/calendly-config" element={
                <RouteGuard requiredRole="Admin">
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
