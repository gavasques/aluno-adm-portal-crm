import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import AdminDashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Settings from './pages/admin/Settings';
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import StudentSettings from './pages/student/Settings';
import AdminLayout from './layout/AdminLayout';
import Layout from './layout/Layout';
import { ModernDashboard } from './components/dashboard/ModernDashboard';
import { UsersPage } from './pages/admin/UsersPage';
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { ImprovedToaster } from "@/components/ui/improved-toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NotificationsProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout isAdmin={true} />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="usuarios" element={<UsersPage />} />
                <Route path="categorias" element={<Categories />} />
                <Route path="produtos" element={<Products />} />
                <Route path="pedidos" element={<Orders />} />
                <Route path="clientes" element={<Customers />} />
                <Route path="configuracoes" element={<Settings />} />
              </Route>

              {/* Student Routes */}
              <Route path="/aluno" element={<Layout isAdmin={false} />}>
                <Route index element={<StudentDashboard />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="cursos" element={<StudentCourses />} />
                <Route path="configuracoes" element={<StudentSettings />} />
              </Route>

              {/* Redirect to Sign In if not authenticated */}
              <Route path="/" element={<Navigate to="/signin" />} />
            </Routes>
            <ImprovedToaster />
          </div>
        </NotificationsProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
