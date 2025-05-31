import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/sonner';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';
import { useAuth } from '@/hooks/useAuth';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Dashboard } from '@/pages/admin/Dashboard';
import { Users } from '@/pages/admin/Users';
import { Tools } from '@/pages/admin/Tools';
import { Settings } from '@/pages/admin/Settings';
import { Suppliers } from '@/pages/admin/Suppliers';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';
import { Profile } from '@/pages/student/Profile';
import { MySuppliers } from '@/pages/student/MySuppliers';
import { PublicPage } from '@/pages/PublicPage';
import { Terms } from '@/pages/Terms';
import { Privacy } from '@/pages/Privacy';
import { Contact } from '@/pages/Contact';
import { Pricing } from '@/pages/Pricing';
import { Upgrade } from '@/pages/Upgrade';
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
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
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
              <Route path="/" element={<PublicPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />

              {/* Auth Routes */}
              <Route
                path="/profile"
                element={
                  <RouteGuard>
                    <Profile />
                  </RouteGuard>
                }
              />
              <Route
                path="/my-suppliers"
                element={
                  <RouteGuard>
                    <MySuppliers />
                  </RouteGuard>
                }
              />
              <Route
                path="/upgrade"
                element={
                  <RouteGuard>
                    <Upgrade />
                  </RouteGuard>
                }
              />
              
              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <RouteGuard>
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
                  </RouteGuard>
                }
              />
              
              {/* Default Route */}
              <Route path="*" element={<PublicPage />} />
            </Routes>
          </BrowserRouter>
        </AccessibilityProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
