
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ResetPassword from "@/pages/ResetPassword";
import CompleteRegistration from "@/pages/CompleteRegistration";
import AdminLayout from "@/layout/AdminLayout";
import StudentLayout from "@/layout/StudentLayout";
import Dashboard from "@/pages/student/Dashboard";
import Suppliers from "@/pages/student/Suppliers";
import SupplierDetail from "@/pages/student/SupplierDetail";
import MySuppliers from "@/pages/student/MySuppliers";
import MySupplierDetailPage from "@/pages/student/MySupplierDetail";
import Partners from "@/pages/student/Partners";
import Tools from "@/pages/student/Tools";
import Mentoring from "@/pages/student/Mentoring";
import MentoringDetail from "@/pages/student/MentoringDetail";
import MentoringSession from "@/pages/student/MentoringSession";
import Settings from "@/pages/student/Settings";
import NotFound from "@/pages/NotFound";
import RouteGuard from "@/components/RouteGuard";
import { AuthProvider } from "@/hooks/useAuth";
import Credits from "@/pages/student/Credits";
import Users from "@/pages/admin/Users";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/complete-registration" element={<CompleteRegistration />} />

              {/* Admin routes */}
              <Route
                path="/admin/*"
                element={
                  <RouteGuard requireAdminAccess>
                    <AdminLayout>
                      <Routes>
                        <Route path="usuarios" element={<Users />} />
                        <Route path="dashboard" element={<div>Admin Dashboard - Em breve</div>} />
                        <Route path="fornecedores" element={<div>Fornecedores Admin - Em breve</div>} />
                        <Route path="parceiros" element={<div>Parceiros Admin - Em breve</div>} />
                        <Route path="ferramentas" element={<div>Ferramentas Admin - Em breve</div>} />
                        <Route path="tarefas" element={<div>Tarefas - Em breve</div>} />
                        <Route path="crm" element={<div>CRM - Em breve</div>} />
                        <Route path="mentirias" element={<div>Mentorias - Em breve</div>} />
                        <Route path="permissoes" element={<div>Permissões - Em breve</div>} />
                        <Route path="configuracoes" element={<div>Configurações - Em breve</div>} />
                        <Route path="*" element={<div>Página não encontrada</div>} />
                      </Routes>
                    </AdminLayout>
                  </RouteGuard>
                }
              />

              {/* Student routes */}
              <Route
                path="/aluno/*"
                element={
                  <RouteGuard>
                    <StudentLayout />
                  </RouteGuard>
                }
              >
                {/* Redirect /aluno to /aluno/dashboard */}
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="creditos" element={<Credits />} />
                <Route path="fornecedores" element={<Suppliers />} />
                <Route path="fornecedores/:id" element={<SupplierDetail />} />
                <Route path="meus-fornecedores" element={<MySuppliers />} />
                <Route path="meus-fornecedores/:id" element={<MySupplierDetailPage />} />
                <Route path="parceiros" element={<Partners />} />
                <Route path="ferramentas" element={<Tools />} />
                <Route path="mentoria" element={<Mentoring />} />
                <Route path="mentoria/:id" element={<MentoringDetail />} />
                <Route path="sessao/:id" element={<MentoringSession />} />
                <Route path="configuracoes" element={<Settings />} />
              </Route>

              {/* Redirect /alunos to /aluno for compatibility */}
              <Route path="/alunos/*" element={<Navigate to="/aluno" replace />} />

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
