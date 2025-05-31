
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/sonner';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { Dashboard } from '@/pages/admin/Dashboard';
import { Users } from '@/pages/admin/Users';
import { Tools } from '@/pages/admin/Tools';
import { Settings } from '@/pages/admin/Settings';
import { Suppliers } from '@/pages/admin/Suppliers';
import Login from '@/pages/Login';
import { Profile } from '@/pages/student/Profile';
import { MySuppliers } from '@/pages/student/MySuppliers';
import Index from '@/pages/Index';
import CRM from '@/pages/admin/CRM';
import CRMLeadDetail from '@/pages/admin/CRMLeadDetail';
import ErrorBoundary from '@/components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

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
                  
                  {/* Student Routes */}
                  <Route path="/aluno" element={<Profile />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/my-suppliers" element={<MySuppliers />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/*" element={
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="users" element={<Users />} />
                      <Route path="tools" element={<Tools />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="suppliers" element={<Suppliers />} />
                      
                      {/* CRM Routes */}
                      <Route path="crm" element={<CRM />} />
                      <Route path="crm/lead/:leadId" element={<CRMLeadDetail />} />
                      
                      {/* Default Admin Route */}
                      <Route path="*" element={<Dashboard />} />
                    </Routes>
                  } />
                  
                  {/* Default Route */}
                  <Route path="*" element={<Index />} />
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
