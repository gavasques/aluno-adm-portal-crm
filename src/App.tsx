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

// Optimized imports
import { AdminRoutes, StudentRoutes, preloadCriticalRoutes } from '@/utils/performance/optimized-routes';
import UnifiedOptimizedLayout from '@/layout/UnifiedOptimizedLayout';
import OptimizedProtectedRoute from '@/components/routing/OptimizedProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

// Preload Manager Component
const PreloadManager = () => {
  const { hasAdminAccess, loading } = useSimplePermissions();

  useEffect(() => {
    if (!loading) {
      preloadCriticalRoutes(hasAdminAccess);
    }
  }, [hasAdminAccess, loading]);

  return null;
};

// Route Groups for better organization
const AdminRouteGroup = () => (
  <Routes>
    <Route path="/" element={<AdminRoutes.Dashboard />} />
    <Route path="/users" element={<AdminRoutes.Users />} />
    <Route path="/news" element={<AdminRoutes.News />} />
    <Route path="/mentoring" element={<AdminRoutes.Mentoring />} />
    <Route path="/settings" element={<AdminRoutes.Settings />} />
    <Route path="/partners" element={<AdminRoutes.Partners />} />
    <Route path="/tools" element={<AdminRoutes.Tools />} />
  </Routes>
);

const StudentRouteGroup = () => (
  <Routes>
    <Route path="/" element={<StudentRoutes.Dashboard />} />
    <Route path="/creditos" element={<StudentRoutes.Credits />} />
    <Route path="/meus-fornecedores" element={<StudentRoutes.MySuppliers />} />
    <Route path="/mentoria" element={<StudentRoutes.Mentoring />} />
    <Route path="/parceiros" element={<StudentRoutes.Partners />} />
    <Route path="/ferramentas" element={<StudentRoutes.Tools />} />
    <Route path="/fornecedores" element={<StudentRoutes.Suppliers />} />
    <Route path="/livi-ai" element={<StudentRoutes.LiviAI />} />
  </Routes>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <PreloadManager />
            
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              {/* Admin Routes */}
              <Route path="/admin/*" element={
                <OptimizedProtectedRoute requireAdmin={true}>
                  <UnifiedOptimizedLayout isAdmin={true}>
                    <AdminRouteGroup />
                  </UnifiedOptimizedLayout>
                </OptimizedProtectedRoute>
              } />

              {/* Student Routes */}
              <Route path="/aluno/*" element={
                <OptimizedProtectedRoute>
                  <UnifiedOptimizedLayout isAdmin={false}>
                    <StudentRouteGroup />
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
