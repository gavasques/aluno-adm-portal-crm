
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/contexts/UserContext';
import { Toaster as SonnerToaster } from 'sonner';
import AdminLayout from './layout/AdminLayout';
import StudentLayout from './layout/StudentLayout';

// Pages
import Index from './pages/Index';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminCRM from './pages/admin/CRM';
import AdminBonus from './pages/admin/Bonus';
import ApiDocumentation from './pages/admin/ApiDocumentation';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="crm" element={<AdminCRM />} />
              <Route path="bonus" element={<AdminBonus />} />
              <Route path="api-docs" element={<ApiDocumentation />} />
            </Route>

            {/* Student Routes */}
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
        <SonnerToaster />
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
