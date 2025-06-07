
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/auth';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

// Imports diretos para páginas críticas
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import StudentDashboard from '@/pages/student/Dashboard';
import StudentMySuppliers from '@/pages/student/MySuppliers';
import StudentMentoring from '@/pages/student/Mentoring';

import UnifiedOptimizedLayout from '@/layout/UnifiedOptimizedLayout';
import OptimizedProtectedRoute from '@/components/routing/OptimizedProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

// Componente de loading simples
const SimpleLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="text-gray-600">Carregando...</p>
    </div>
  </div>
);

function App() {
  console.log('🚀 App iniciando...');

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              {/* Rotas Admin */}
              <Route path="/admin/*" element={
                <OptimizedProtectedRoute requireAdmin={true}>
                  <UnifiedOptimizedLayout isAdmin={true}>
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      <Route path="/users" element={<AdminUsers />} />
                    </Routes>
                  </UnifiedOptimizedLayout>
                </OptimizedProtectedRoute>
              } />

              {/* Rotas Aluno */}
              <Route path="/aluno/*" element={
                <OptimizedProtectedRoute>
                  <UnifiedOptimizedLayout isAdmin={false}>
                    <Routes>
                      <Route path="/" element={<StudentDashboard />} />
                      <Route path="/meus-fornecedores" element={<StudentMySuppliers />} />
                      <Route path="/mentoria" element={<StudentMentoring />} />
                    </Routes>
                  </UnifiedOptimizedLayout>
                </OptimizedProtectedRoute>
              } />

              {/* 404 */}
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
