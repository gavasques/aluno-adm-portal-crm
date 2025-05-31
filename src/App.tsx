
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/sonner';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';
import { AuthProvider, useAuth } from '@/hooks/auth';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import CRM from '@/pages/admin/CRM';
import CRMLeadDetail from '@/pages/admin/CRMLeadDetail';
import NotFound from '@/pages/NotFound';
import ErrorBoundary from '@/components/ErrorBoundary';

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

                  {/* Admin Routes */}
                  <Route
                    path="/admin/*"
                    element={
                      <RouteGuard>
                        <Routes>
                          <Route path="crm" element={<CRM />} />
                          <Route path="crm/lead/:leadId" element={<CRMLeadDetail />} />
                          <Route path="*" element={<CRM />} />
                        </Routes>
                      </RouteGuard>
                    }
                  />
                  
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
