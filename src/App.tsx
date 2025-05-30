
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ImprovedToaster } from "@/components/ui/improved-toaster";
import { AuthProvider } from "@/hooks/useAuth";
import RouteGuard from "@/components/RouteGuard";
import FreshAdminSidebar from "@/layout/FreshAdminSidebar";
import StudentSidebar from "@/layout/StudentSidebar";
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

const queryClient = new QueryClient();

// CACHE BREAKER - FRESH START v3.0.0
const FRESH_APP_VERSION = `fresh-app-${Date.now()}`;
console.log(`🔥 FRESH APP LOADED - CACHE BROKEN - ${FRESH_APP_VERSION}`);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ImprovedToaster />
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
                    <div 
                      className="min-h-screen bg-gray-50 flex" 
                      data-fresh-app={FRESH_APP_VERSION}
                      data-cache-breaker={Date.now()}
                    >
                      <FreshAdminSidebar />
                      <div className="flex-1" style={{ marginLeft: '220px' }}>
                        <main className="p-4">
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
                        </main>
                      </div>
                    </div>
                  </RouteGuard>
                } 
              />

              {/* Student Routes */}
              <Route 
                path="/aluno/*" 
                element={
                  <RouteGuard>
                    <div className="min-h-screen bg-gray-50 flex">
                      <StudentSidebar />
                      <div className="flex-1 ml-56">
                        <main className="p-6">
                          <Routes>
                            <Route path="dashboard" element={<StudentDashboard />} />
                            <Route path="fornecedores" element={<StudentSuppliers />} />
                            <Route path="parceiros" element={<StudentPartners />} />
                            <Route path="ferramentas" element={<StudentTools />} />
                            <Route path="mentoria" element={<StudentMentoring />} />
                            <Route path="meus-fornecedores" element={<StudentMySuppliers />} />
                            <Route path="creditos" element={<StudentCredits />} />
                            <Route path="configuracoes" element={<StudentSettings />} />
                            <Route path="" element={<Navigate to="/aluno/dashboard" replace />} />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </RouteGuard>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
