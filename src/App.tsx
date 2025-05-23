
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/auth";  // Importação corrigida
import Layout from "@/layout/Layout";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ResetPassword from "@/pages/ResetPassword";
import AcceptInvite from "@/pages/AcceptInvite";

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

// Aluno pages
import StudentDashboard from "@/pages/student/Dashboard";
import StudentSettings from "@/pages/student/Settings";
import StudentMySuppliers from "@/pages/student/MySuppliers";
import StudentPartners from "@/pages/student/Partners";
import StudentSuppliers from "@/pages/student/Suppliers";
import StudentTools from "@/pages/student/Tools";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />
          
          <Route path="/admin" element={<Layout isAdmin={true} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="permissions" element={<AdminPermissions />} />
            <Route path="gestao-alunos" element={<AdminStudents />} />
            <Route path="gestao-alunos/:id" element={<AdminStudentDetail />} />
            <Route path="tasks" element={<AdminTasks />} />
            <Route path="tasks/:id" element={<AdminTaskDetail />} />
            <Route path="crm" element={<AdminCrm />} />
            <Route path="registers" element={<AdminRegisters />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="tools" element={<AdminTools />} />
            <Route path="suppliers" element={<AdminSuppliers />} />
          </Route>
          
          <Route path="/student" element={<Layout isAdmin={false} />}>
            <Route index element={<StudentDashboard />} />
            <Route path="settings" element={<StudentSettings />} />
            <Route path="my-suppliers" element={<StudentMySuppliers />} />
            <Route path="partners" element={<StudentPartners />} />
            <Route path="suppliers" element={<StudentSuppliers />} />
            <Route path="tools" element={<StudentTools />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
