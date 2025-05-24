import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/student/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/layouts/AdminLayout";
import StudentLayout from "./components/layouts/StudentLayout";
import StudentSuppliers from "./pages/student/Suppliers";
import StudentSupplierDetail from "./pages/student/SupplierDetail";
import MySuppliers from "./pages/student/MySuppliers";
import MySupplierDetailView from "./pages/student/MySupplierDetailView";
import StudentPartners from "./pages/student/Partners";
import StudentPartnerDetail from "./pages/student/PartnerDetail";
import StudentTools from "./pages/student/Tools";
import StudentToolDetail from "./pages/student/ToolDetail";
import StudentSettings from "./pages/student/Settings";
import AdminSuppliers from "./pages/admin/AdminSuppliers";
import SupplierDetail from "./pages/admin/SupplierDetail";
import AdminGeneral from "./pages/admin/AdminGeneral";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminTools from "./pages/admin/AdminTools";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStudents from "./pages/admin/AdminStudents";
import StudentDetail from "./pages/admin/StudentDetail";
import AdminPermissions from "./pages/admin/AdminPermissions";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import CourseList from "./pages/admin/CourseList";
import CourseDetail from "./pages/admin/CourseDetail";
import Mentoring from "./pages/admin/Mentoring";
import MentoringDetail from "./pages/admin/MentoringDetail";
import AdminBonus from "./pages/admin/AdminBonus";
import BonusDetail from "./pages/admin/BonusDetail";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminCRM from "./pages/admin/AdminCRM";
import AdminAuditDashboard from "./pages/admin/AdminAuditDashboard";

// New Mentoring Pages
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
      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="fornecedores" element={<AdminSuppliers />} />
            <Route path="fornecedores/:id" element={<SupplierDetail />} />
            <Route path="geral" element={<AdminGeneral />} />
            <Route path="parceiros" element={<AdminPartners />} />
            <Route path="ferramentas" element={<AdminTools />} />
            <Route path="usuarios" element={<AdminUsers />} />
            <Route path="alunos" element={<AdminStudents />} />
            <Route path="alunos/:id" element={<StudentDetail />} />
            <Route path="permissoes" element={<AdminPermissions />} />
            <Route path="cadastros" element={<AdminRegistrations />} />
            <Route path="cursos" element={<CourseList />} />
            <Route path="cursos/:id" element={<CourseDetail />} />
            <Route path="mentorias" element={<Mentoring />} />
            <Route path="mentorias/:id" element={<MentoringDetail />} />
            <Route path="bonus" element={<AdminBonus />} />
            <Route path="bonus/:id" element={<BonusDetail />} />
            <Route path="tarefas" element={<AdminTasks />} />
            <Route path="crm" element={<AdminCRM />} />
            <Route path="auditoria" element={<AdminAuditDashboard />} />
            
            {/* Mentoring Management Routes */}
            <Route path="mentorias/catalogo" element={<AdminMentoringCatalog />} />
            <Route path="mentorias/inscricoes" element={<AdminMentoringEnrollments />} />
            <Route path="mentorias/sessoes" element={<AdminMentoringSessions />} />
            <Route path="mentorias/materiais" element={<AdminMentoringMaterials />} />
          </Route>

          {/* Student Routes */}
          <Route path="/aluno" element={<StudentLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="fornecedores" element={<StudentSuppliers />} />
            <Route path="fornecedores/:id" element={<StudentSupplierDetail />} />
            <Route path="meus-fornecedores" element={<MySuppliers />} />
            <Route path="meus-fornecedores/:id" element={<MySupplierDetailView />} />
            <Route path="parceiros" element={<StudentPartners />} />
            <Route path="parceiros/:id" element={<StudentPartnerDetail />} />
            <Route path="ferramentas" element={<StudentTools />} />
            <Route path="ferramentas/:id" element={<StudentToolDetail />} />
            <Route path="configuracoes" element={<StudentSettings />} />
            
            {/* Student Mentoring Routes */}
            <Route path="mentorias" element={<StudentMentoring />} />
            <Route path="mentorias/:enrollmentId" element={<StudentMentoringDetail />} />
            <Route path="mentorias/:enrollmentId/sessoes/:sessionId" element={<StudentMentoringSession />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
