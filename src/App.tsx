
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/sonner';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';
import { useAuth } from '@/hooks/useAuth';
import Login from '@/pages/Login';
import CRM from '@/pages/admin/CRM';
import CRMLeadDetail from '@/pages/admin/CRMLeadDetail';

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
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Toaster />
        <AccessibilityProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
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
              
              {/* Default Route */}
              <Route path="*" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </AccessibilityProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
