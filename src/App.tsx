
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/auth";
import Layout from "@/layout/Layout";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ResetPassword from "@/pages/ResetPassword";
import AcceptInvite from "@/pages/AcceptInvite";
import EmailConfirmation from "@/components/auth/EmailConfirmation";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminSettings from "@/pages/admin/Settings";
import AdminUsers from "@/pages/admin/Users";
import AdminStudents from "@/pages/admin/Students";
import AdminStudentDetail from "@/pages/admin/StudentDetail";
import AdminTasks from "@/pages/admin/Tasks";
import AdminTaskDetail from "@/pages/admin/TaskDetail";
import AdminCrm from "@/pages/admin/CRM";
import AdminRegisters from "@/pages/admin/Registers";
import AdminPartners from "@/pages/admin/Partners";
import AdminTools from "@/pages/admin/Tools";
import AdminSuppliers from "@/pages/admin/Suppliers";
import AdminPermissions from "@/pages/admin/Permissions";

// Student pages
import StudentDashboard from "@/pages/student/Dashboard";
import StudentSettings from "@/pages/student/Settings";
import StudentMySuppliers from "@/pages/student/MySuppliers";
import StudentPartners from "@/pages/student/Partners";
import StudentSuppliers from "@/pages/student/Suppliers";
import StudentTools from "@/pages/student/Tools";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Páginas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/redefinir-senha" element={<ResetPassword />} />
            <Route path="/confirmar-email" element={<EmailConfirmation />} />
            <Route path="/aceitar-convite" element={<AcceptInvite />} />
            
            {/* Redirects para compatibilidade - URLs antigas */}
            <Route path="/reset-password" element={<Navigate to="/redefinir-senha" replace />} />
            <Route path="/confirm-email" element={<Navigate to="/confirmar-email" replace />} />
            <Route path="/accept-invite" element={<Navigate to="/aceitar-convite" replace />} />
            
            {/* Área administrativa com URLs otimizadas */}
            <Route path="/admin" element={<Layout isAdmin={true} />}>
              <Route index element={<AdminDashboard />} />
              <Route path="configuracoes" element={<AdminSettings />} />
              <Route path="usuarios" element={<AdminUsers />} />
              <Route path="permissoes" element={<AdminPermissions />} />
              <Route path="alunos" element={<AdminStudents />} />
              <Route path="alunos/:id" element={<AdminStudentDetail />} />
              <Route path="tarefas" element={<AdminTasks />} />
              <Route path="tarefas/:id" element={<AdminTaskDetail />} />
              <Route path="leads" element={<AdminCrm />} />
              <Route path="cadastros" element={<AdminRegisters />} />
              <Route path="parceiros" element={<AdminPartners />} />
              <Route path="ferramentas" element={<AdminTools />} />
              <Route path="fornecedores" element={<AdminSuppliers />} />
              
              {/* Redirects para compatibilidade - URLs administrativas antigas */}
              <Route path="settings" element={<Navigate to="/admin/configuracoes" replace />} />
              <Route path="users" element={<Navigate to="/admin/usuarios" replace />} />
              <Route path="permissions" element={<Navigate to="/admin/permissoes" replace />} />
              <Route path="gestao-alunos" element={<Navigate to="/admin/alunos" replace />} />
              <Route path="gestao-alunos/:id" element={<Navigate to="/admin/alunos/$1" replace />} />
              <Route path="tasks" element={<Navigate to="/admin/tarefas" replace />} />
              <Route path="tasks/:id" element={<Navigate to="/admin/tarefas/$1" replace />} />
              <Route path="crm" element={<Navigate to="/admin/leads" replace />} />
              <Route path="registers" element={<Navigate to="/admin/cadastros" replace />} />
              <Route path="partners" element={<Navigate to="/admin/parceiros" replace />} />
              <Route path="tools" element={<Navigate to="/admin/ferramentas" replace />} />
              <Route path="suppliers" element={<Navigate to="/admin/fornecedores" replace />} />
            </Route>
            
            {/* Área do aluno com URLs otimizadas */}
            <Route path="/aluno" element={<Layout isAdmin={false} />}>
              <Route index element={<StudentDashboard />} />
              <Route path="configuracoes" element={<StudentSettings />} />
              <Route path="meus-fornecedores" element={<StudentMySuppliers />} />
              <Route path="parceiros" element={<StudentPartners />} />
              <Route path="fornecedores" element={<StudentSuppliers />} />
              <Route path="ferramentas" element={<StudentTools />} />
            </Route>
            
            {/* Redirects para compatibilidade - URLs do aluno antigas */}
            <Route path="/student" element={<Navigate to="/aluno" replace />} />
            <Route path="/student/settings" element={<Navigate to="/aluno/configuracoes" replace />} />
            <Route path="/student/my-suppliers" element={<Navigate to="/aluno/meus-fornecedores" replace />} />
            <Route path="/student/partners" element={<Navigate to="/aluno/parceiros" replace />} />
            <Route path="/student/suppliers" element={<Navigate to="/aluno/fornecedores" replace />} />
            <Route path="/student/tools" element={<Navigate to="/aluno/ferramentas" replace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
