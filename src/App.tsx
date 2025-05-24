
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { AuthProvider } from "./hooks/auth";
import Home from "./pages/Index";
import Dashboard from "./pages/student/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLayout from "./layout/AdminLayout";
import StudentLayout from "./layout/StudentLayout";
import StudentSuppliers from "./pages/student/Suppliers";
import MySuppliers from "./pages/student/MySuppliers";
import StudentPartners from "./pages/student/Partners";
import StudentTools from "./pages/student/Tools";
import StudentSettings from "./pages/student/Settings";
import AdminSuppliers from "./pages/admin/Suppliers";
import SupplierDetailWrapper from "./components/admin/SupplierDetailWrapper";
import AdminPartners from "./pages/admin/Partners";
import AdminTools from "./pages/admin/Tools";
import AdminUsers from "./pages/admin/Users";
import AdminStudents from "./pages/admin/Students";
import StudentDetail from "./pages/admin/StudentDetail";
import AdminPermissions from "./pages/admin/Permissions";
import AdminRegistrations from "./pages/admin/Registers";
import CourseList from "./pages/admin/Courses";
import CourseDetail from "./pages/admin/CourseDetails";
import Mentoring from "./pages/admin/Mentoring";
import MentoringDetail from "./pages/admin/MentoringDetail";
import AdminBonus from "./pages/admin/Bonus";
import BonusDetail from "./pages/admin/BonusDetail";
import AdminTasks from "./pages/admin/Tasks";
import AdminCRM from "./pages/admin/CRM";
import AdminAuditDashboard from "./pages/admin/Audit";

// New Mentoring Pages
import AdminMentoringManagement from "./pages/admin/AdminMentoringManagement";
import AdminMentoringCatalog from "./pages/admin/AdminMentoringCatalog";
import AdminMentoringEnrollments from "./pages/admin/AdminMentoringEnrollments";
import AdminMentoringSessions from "./pages/admin/AdminMentoringSessions";
import AdminMentoringMaterials from "./pages/admin/AdminMentoringMaterials";
import StudentMentoring from "./pages/student/Mentoring";
import StudentMentoringDetail from "./pages/student/MentoringDetail";
import StudentMentoringSession from "./pages/student/MentoringSession";

import RouteGuard from "./components/RouteGuard";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <AuthProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="fornecedores" element={<AdminSuppliers />} />
                <Route path="fornecedores/:id" element={
                  <RouteGuard requireAdminAccess={true}>
                    <SupplierDetailWrapper />
                  </RouteGuard>
                } />
                <Route path="parceiros" element={<AdminPartners />} />
                <Route path="ferramentas" element={<AdminTools />} />
                <Route path="usuarios" element={<AdminUsers />} />
                <Route path="alunos" element={<AdminStudents />} />
                <Route path="alunos/:id" element={<StudentDetail />} />
                <Route path="permissoes" element={<AdminPermissions />} />
                <Route path="cadastros" element={<AdminRegistrations />} />
                <Route path="cursos" element={<CourseList />} />
                <Route path="cursos/:id" element={<CourseDetail />} />
                <Route path="bonus" element={<AdminBonus />} />
                <Route path="bonus/:id" element={<BonusDetail />} />
                <Route path="tarefas" element={<AdminTasks />} />
                <Route path="crm" element={<AdminCRM />} />
                <Route path="auditoria" element={<AdminAuditDashboard />} />
                
                {/* Mentoring Management Routes - CORRIGIDA */}
                <Route path="mentorias" element={<AdminMentoringManagement />} />
                <Route path="mentorias/catalogo" element={<AdminMentoringCatalog />} />
                <Route path="mentorias/inscricoes" element={<AdminMentoringEnrollments />} />
                <Route path="mentorias/sessoes" element={<AdminMentoringSessions />} />
                <Route path="mentorias/materiais" element={<AdminMentoringMaterials />} />
                <Route path="mentorias/:id" element={<MentoringDetail />} />
              </Route>

              {/* Student Routes */}
              <Route path="/aluno" element={<StudentLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="fornecedores" element={<StudentSuppliers />} />
                <Route path="meus-fornecedores" element={<MySuppliers />} />
                <Route path="parceiros" element={<StudentPartners />} />
                <Route path="ferramentas" element={<StudentTools />} />
                <Route path="configuracoes" element={<StudentSettings />} />
                
                {/* Student Mentoring Routes - CORRIGIDA */}
                <Route path="mentorias" element={<StudentMentoring />} />
                <Route path="mentorias/:enrollmentId" element={<StudentMentoringDetail />} />
                <Route path="mentorias/:enrollmentId/sessoes/:sessionId" element={<StudentMentoringSession />} />
              </Route>
            </Routes>
          </AuthProvider>
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
