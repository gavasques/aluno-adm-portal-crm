
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import AdminDashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import Settings from './pages/admin/Settings';
import StudentDashboard from './pages/student/Dashboard';
import StudentSettings from './pages/student/Settings';
import LiviAI from './pages/student/LiviAI';
import AdminLayout from './layout/AdminLayout';
import Layout from './layout/Layout';
import Users from './pages/admin/Users';
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { ImprovedToaster } from "@/components/ui/improved-toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <NotificationsProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="usuarios" element={<Users />} />
                  <Route path="categorias" element={<Categories />} />
                  <Route path="configuracoes" element={<Settings />} />
                </Route>

                {/* Student Routes */}
                <Route path="/aluno" element={<Layout isAdmin={false} />}>
                  <Route index element={<StudentDashboard />} />
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="livi-ai" element={<LiviAI />} />
                  <Route path="configuracoes" element={<StudentSettings />} />
                </Route>

                {/* Redirect to Admin Dashboard by default */}
                <Route path="/" element={<Navigate to="/admin" />} />
              </Routes>
              <ImprovedToaster />
            </div>
          </NotificationsProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
