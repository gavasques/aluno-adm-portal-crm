

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
import AdminCRM from './pages/admin/CRM';
import AdminCredits from './pages/admin/Credits';
import AdminTasks from './pages/admin/Tasks';
import AdminSuppliers from './pages/admin/Suppliers';
import AdminPartners from './pages/admin/Partners';
import AdminTools from './pages/admin/Tools';
import AdminMentoring from './pages/admin/Mentoring';
import AdminMentoringCatalogManagement from './pages/admin/MentoringCatalogManagement';
import AdminIndividualEnrollments from './pages/admin/AdminIndividualEnrollments';
import AdminMentoringSessionsIndividual from './pages/admin/AdminMentoringSessionsIndividual';
import AdminStudents from './pages/admin/Students';
import AdminPermissions from './pages/admin/Permissions';
import AdminAudit from './pages/admin/Audit';
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { ImprovedToaster } from "@/components/ui/improved-toaster";
import LeadDetail from '@/pages/admin/LeadDetail';

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
                  
                  {/* Operacional */}
                  <Route path="creditos" element={<AdminCredits />} />
                  <Route path="tarefas" element={<AdminTasks />} />
                  <Route path="crm" element={<AdminCRM />} />
                  
                  {/* Add the new lead detail route */}
                  <Route path="crm/lead/:leadId" element={<LeadDetail />} />
                  
                  {/* Geral ADM */}
                  <Route path="fornecedores" element={<AdminSuppliers />} />
                  <Route path="parceiros" element={<AdminPartners />} />
                  <Route path="ferramentas" element={<AdminTools />} />
                  
                  {/* Mentorias - Rotas Corrigidas */}
                  <Route path="mentorias" element={<AdminMentoring />} />
                  <Route path="mentorias/catalogo" element={<AdminMentoringCatalogManagement />} />
                  <Route path="inscricoes-individuais" element={<AdminIndividualEnrollments />} />
                  <Route path="inscricoes-grupo" element={<AdminMentoring />} />
                  <Route path="mentorias/materiais" element={<AdminMentoring />} />
                  <Route path="mentorias/sessoes-individuais" element={<AdminMentoringSessionsIndividual />} />
                  
                  {/* Gestão */}
                  <Route path="usuarios" element={<Users />} />
                  <Route path="alunos" element={<AdminStudents />} />
                  <Route path="permissoes" element={<AdminPermissions />} />
                  <Route path="auditoria" element={<AdminAudit />} />
                  <Route path="calendly-config" element={<Settings />} />
                  
                  {/* Cadastros */}
                  <Route path="categorias" element={<Categories />} />
                  <Route path="tipos-softwares" element={<Categories />} />
                  <Route path="tipos-parceiros" element={<Categories />} />
                  
                  {/* Sistema */}
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

