
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ImprovedToaster } from "@/components/ui/improved-toaster";
import { AuthProvider } from "@/hooks/useAuth";
import RouteGuard from "@/components/RouteGuard";
import AdminLayout from "@/layout/AdminLayout";
import StudentLayout from "@/layout/StudentLayout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ResetPassword from "@/pages/ResetPassword";
import CompleteRegistration from "@/pages/CompleteRegistration";
import NotFound from "@/pages/NotFound";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminSuppliers from "@/pages/admin/Suppliers";
import AdminPartners from "@/pages/admin/Partners";
import AdminTools from "@/pages/admin/Tools";
import AdminMentoring from "@/pages/admin/Mentoring";
import AdminStudents from "@/pages/admin/Students";
import AdminTasks from "@/pages/admin/Tasks";
import AdminCRM from "@/pages/admin/CRM";
import AdminCredits from "@/pages/admin/Credits";
import AdminPermissions from "@/pages/admin/Permissions";
import AdminAudit from "@/pages/admin/Audit";
import AdminCategories from "@/pages/admin/Categories";
import AdminSoftwareTypes from "@/pages/admin/SoftwareTypes";
import AdminPartnerTypes from "@/pages/admin/PartnerTypes";
import AdminCalendlyConfig from "@/pages/admin/AdminCalendlyConfig";
import AdminSettings from "@/pages/admin/Settings";
import AdminBonus from "@/pages/admin/Bonus";
import AdminMentoringDashboard from "@/pages/admin/AdminMentoringDashboard";
import AdminMentoringCatalog from "@/pages/admin/AdminMentoringCatalog";
import AdminIndividualEnrollments from "@/pages/admin/AdminIndividualEnrollments";
import AdminGroupEnrollments from "@/pages/admin/AdminGroupEnrollments";
import AdminMentoringMaterials from "@/pages/admin/AdminMentoringMaterials";
import AdminNews from "@/pages/admin/News";

// Student Pages
import StudentDashboard from "@/pages/student/Dashboard";
import StudentSuppliers from "@/pages/student/Suppliers";
import StudentPartners from "@/pages/student/Partners";
import StudentTools from "@/pages/student/Tools";
import StudentMentoring from "@/pages/student/Mentoring";
import StudentMySuppliers from "@/pages/student/MySuppliers";
import StudentCredits from "@/pages/student/Credits";
import StudentSettings from "@/pages/student/Settings";
import LiviAI from "@/pages/student/LiviAI";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ImprovedToaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/complete-registration" element={<CompleteRegistration />} />

              {/* Admin Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <RouteGuard requireAdminAccess>
                    <AdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="usuarios" element={<AdminUsers />} />
                        <Route path="fornecedores" element={<AdminSuppliers />} />
                        <Route path="parceiros" element={<AdminPartners />} />
                        <Route path="ferramentas" element={<AdminTools />} />
                        <Route path="mentoria" element={<AdminMentoring />} />
                        <Route path="alunos" element={<AdminStudents />} />
                        <Route path="tarefas" element={<AdminTasks />} />
                        <Route path="crm" element={<AdminCRM />} />
                        <Route path="creditos" element={<AdminCredits />} />
                        <Route path="permissoes" element={<AdminPermissions />} />
                        <Route path="auditoria" element={<AdminAudit />} />
                        <Route path="categorias" element={<AdminCategories />} />
                        <Route path="tipos-softwares" element={<AdminSoftwareTypes />} />
                        <Route path="tipos-parceiros" element={<AdminPartnerTypes />} />
                        <Route path="calendly-config" element={<AdminCalendlyConfig />} />
                        <Route path="configuracoes" element={<AdminSettings />} />
                        <Route path="bonus" element={<AdminBonus />} />
                        <Route path="mentorias" element={<AdminMentoringDashboard />} />
                        <Route path="mentorias/catalogo" element={<AdminMentoringCatalog />} />
                        <Route path="inscricoes-individuais" element={<AdminIndividualEnrollments />} />
                        <Route path="inscricoes-grupo" element={<AdminGroupEnrollments />} />
                        <Route path="mentorias/materiais" element={<AdminMentoringMaterials />} />
                        <Route path="noticias" element={<AdminNews />} />
                        <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
                      </Routes>
                    </AdminLayout>
                  </RouteGuard>
                } 
              />

              {/* Student Routes */}
              <Route 
                path="/aluno/*" 
                element={
                  <RouteGuard>
                    <StudentLayout />
                  </RouteGuard>
                }
              >
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="fornecedores" element={<StudentSuppliers />} />
                <Route path="parceiros" element={<StudentPartners />} />
                <Route path="ferramentas" element={<StudentTools />} />
                <Route path="mentoria" element={<StudentMentoring />} />
                <Route path="meus-fornecedores" element={<StudentMySuppliers />} />
                <Route path="creditos" element={<StudentCredits />} />
                <Route path="configuracoes" element={<StudentSettings />} />
                <Route path="livi-ai" element={<LiviAI />} />
                <Route path="" element={<Navigate to="/aluno/dashboard" replace />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
