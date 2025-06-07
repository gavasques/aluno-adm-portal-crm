
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/auth';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import StudentDashboard from '@/pages/student/Dashboard';
import Layout from '@/layout/Layout';
import AdminLayout from '@/layout/AdminLayout';
import StudentLayout from '@/layout/StudentLayout';
import { useAuth } from '@/hooks/auth';
import { useSimplePermissions } from '@/hooks/useSimplePermissions';

// Admin Pages
import AdminUsers from '@/pages/admin/Users';
import AdminNews from '@/pages/admin/News';
import AdminMentoring from '@/pages/admin/Mentoring';
import AdminSettings from '@/pages/admin/Settings';
import AdminPartners from '@/pages/admin/Partners';
import AdminTools from '@/pages/admin/Tools';

// Student Pages
import StudentCredits from '@/pages/student/Credits';
import StudentMySuppliers from '@/pages/student/MySuppliers';
import StudentMentoring from '@/pages/student/Mentoring';
import StudentPartners from '@/pages/student/Partners';
import StudentTools from '@/pages/student/Tools';
import StudentSuppliers from '@/pages/student/Suppliers';
import LiviAI from '@/pages/student/LiviAI';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Route Guard Component
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) => {
  const { user, loading } = useAuth();
  const { hasAdminAccess, loading: permissionsLoading } = useSimplePermissions();

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (requireAdmin && !hasAdminAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout isAdmin={true}>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout isAdmin={true}>
                    <AdminUsers />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/news" element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout isAdmin={true}>
                    <AdminNews />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/mentoring" element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout isAdmin={true}>
                    <AdminMentoring />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout isAdmin={true}>
                    <AdminSettings />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/partners" element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout isAdmin={true}>
                    <AdminPartners />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/tools" element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout isAdmin={true}>
                    <AdminTools />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Student Routes */}
              <Route path="/aluno" element={
                <ProtectedRoute>
                  <Layout isAdmin={false}>
                    <StudentDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/aluno/creditos" element={
                <ProtectedRoute>
                  <Layout isAdmin={false}>
                    <StudentCredits />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/aluno/meus-fornecedores" element={
                <ProtectedRoute>
                  <Layout isAdmin={false}>
                    <StudentMySuppliers />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/aluno/mentoria" element={
                <ProtectedRoute>
                  <Layout isAdmin={false}>
                    <StudentMentoring />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/aluno/parceiros" element={
                <ProtectedRoute>
                  <Layout isAdmin={false}>
                    <StudentPartners />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/aluno/ferramentas" element={
                <ProtectedRoute>
                  <Layout isAdmin={false}>
                    <StudentTools />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/aluno/fornecedores" element={
                <ProtectedRoute>
                  <Layout isAdmin={false}>
                    <StudentSuppliers />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/aluno/livi-ai" element={
                <ProtectedRoute>
                  <Layout isAdmin={false}>
                    <LiviAI />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">404</h1>
                    <p className="text-gray-600">Página não encontrada</p>
                  </div>
                </div>
              } />
            </Routes>
            
            <Toaster />
            <SonnerToaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
