
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/auth';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { useSimplePermissions } from '@/hooks/useSimplePermissions';

// Static imports for critical pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';

// Lazy imports with simple fallback
import { Suspense, lazy } from 'react';

const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/Users'));
const StudentDashboard = lazy(() => import('@/pages/student/Dashboard'));
const StudentMySuppliers = lazy(() => import('@/pages/student/MySuppliers'));
const StudentMentoring = lazy(() => import('@/pages/student/Mentoring'));

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

// Simple loading component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="text-gray-600">Carregando...</p>
    </div>
  </div>
);

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
              <Route path="/admin/*" element={
                <OptimizedProtectedRoute requireAdmin={true}>
                  <UnifiedOptimizedLayout isAdmin={true}>
                    <Routes>
                      <Route path="/" element={
                        <Suspense fallback={<PageLoading />}>
                          <AdminDashboard />
                        </Suspense>
                      } />
                      <Route path="/users" element={
                        <Suspense fallback={<PageLoading />}>
                          <AdminUsers />
                        </Suspense>
                      } />
                    </Routes>
                  </UnifiedOptimizedLayout>
                </OptimizedProtectedRoute>
              } />

              {/* Student Routes */}
              <Route path="/aluno/*" element={
                <OptimizedProtectedRoute>
                  <UnifiedOptimizedLayout isAdmin={false}>
                    <Routes>
                      <Route path="/" element={
                        <Suspense fallback={<PageLoading />}>
                          <StudentDashboard />
                        </Suspense>
                      } />
                      <Route path="/meus-fornecedores" element={
                        <Suspense fallback={<PageLoading />}>
                          <StudentMySuppliers />
                        </Suspense>
                      } />
                      <Route path="/mentoria" element={
                        <Suspense fallback={<PageLoading />}>
                          <StudentMentoring />
                        </Suspense>
                      } />
                    </Routes>
                  </UnifiedOptimizedLayout>
                </OptimizedProtectedRoute>
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
