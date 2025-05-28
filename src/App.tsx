import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Partners from "@/pages/student/Partners";
import Tools from "@/pages/student/Tools";
import Mentoring from "@/pages/student/Mentoring";
import MentoringDetail from "@/pages/student/MentoringDetail";
import MentoringSession from "@/pages/student/MentoringSession";
import Settings from "@/pages/student/Settings";
import NotFound from "@/pages/NotFound";
import RouteGuard from "@/components/RouteGuard";
import { AuthProvider } from "@/hooks/useAuth";
import { MySupplierDetailView } from "@/components/student/my-suppliers/MySupplierDetailView";
import Credits from "@/pages/student/Credits";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
                <RouteGuard requiredRole="Admin">
                  <AdminLayout />
                </RouteGuard>
              }
            >
              {/* Admin routes */}
            </Route>

            {/* Student routes */}
            <Route
              path="/aluno/*"
              element={
                <RouteGuard requiredRole="Student">
                  <StudentLayout />
                </RouteGuard>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="creditos" element={<Credits />} />
              <Route path="fornecedores" element={<Suppliers />} />
              <Route path="fornecedores/:id" element={<SupplierDetail />} />
              <Route path="meus-fornecedores" element={<MySuppliers />} />
              <Route path="meus-fornecedores/:id" element={<MySupplierDetailView />} />
              <Route path="parceiros" element={<Partners />} />
              <Route path="ferramentas" element={<Tools />} />
              <Route path="mentoria" element={<Mentoring />} />
              <Route path="mentoria/:id" element={<MentoringDetail />} />
              <Route path="sessao/:id" element={<MentoringSession />} />
              <Route path="configuracoes" element={<Settings />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
