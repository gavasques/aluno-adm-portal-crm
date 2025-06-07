
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/layout/AdminLayout';
import StudentLayout from '@/layout/StudentLayout';

// Admin Pages - Principal
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminModernUsers from '@/pages/admin/ModernUsers';
import AdminTasks from '@/pages/admin/Tasks';

// Admin Pages - CRM - Usar página CRM real
import CRM from '@/pages/admin/CRM';
import CRMLeads from '@/pages/admin/crm/Leads';
import CRMReports from '@/pages/admin/crm/Reports';
import CRMSettings from '@/pages/admin/crm/Settings';
import CRMWebhookLogs from '@/pages/admin/CRMWebhookLogs';

// Admin Pages - Mentoria
import AdminMentoring from '@/pages/admin/Mentoring';
import AdminMentoringCatalogManagement from '@/pages/admin/MentoringCatalogManagement';
import AdminIndividualRegistrations from '@/pages/admin/IndividualRegistrations';
import AdminGroupRegistrations from '@/pages/admin/GroupRegistrations';
import AdminIndividualSessions from '@/pages/admin/IndividualSessions';
import AdminGroupSessions from '@/pages/admin/GroupSessions';
import AdminMentoringMaterials from '@/pages/admin/MentoringMaterials';

// Admin Pages - Gestão
import AdminStudents from '@/pages/admin/Students';
import AdminCourses from '@/pages/admin/Courses';
import AdminBonus from '@/pages/admin/Bonus';
import AdminCredits from '@/pages/admin/Credits';
import AdminNews from '@/pages/admin/News';

// Admin Pages - Recursos - Criar páginas completas
import AdminSuppliersPage from '@/pages/admin/SuppliersPage';
import AdminPartnersPage from '@/pages/admin/PartnersPage';
import AdminToolsPage from '@/pages/admin/ToolsPage';

// Admin Pages - Configurações
import AdminCategories from '@/pages/admin/Categories';
import AdminSoftwareTypes from '@/pages/admin/SoftwareTypes';
import AdminPartnerTypes from '@/pages/admin/PartnerTypes';
import AdminPermissions from '@/pages/admin/Permissions';
import AdminPermissionCreate from '@/pages/admin/PermissionCreate';
import AdminPermissionEdit from '@/pages/admin/PermissionEdit';
import AdminAudit from '@/pages/admin/Audit';
import AdminCalendlyConfig from '@/pages/admin/CalendlyConfig';
import AdminNotifications from '@/pages/admin/Notifications';
import AdminSettings from '@/pages/admin/Settings';

// Student Pages
import StudentDashboard from '@/pages/student/Dashboard';
import StudentCredits from '@/pages/student/Credits';
import StudentSuppliers from '@/pages/student/Suppliers';
import StudentPartners from '@/pages/student/Partners';
import StudentTools from '@/pages/student/Tools';
import StudentMySuppliers from '@/pages/student/MySuppliers';
import StudentMentoring from '@/pages/student/Mentoring';
import StudentLiviAI from '@/pages/student/LiviAI';
import StudentSettings from '@/pages/student/Settings';

// Home Page
import Home from '@/pages/Home';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home Route */}
      <Route path="/" element={<Home />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Principal */}
        <Route index element={<AdminDashboard />} />
        <Route path="usuarios" element={<AdminUsers />} />
        <Route path="usuarios-moderno" element={<AdminModernUsers />} />
        <Route path="tarefas" element={<AdminTasks />} />
        
        {/* CRM - Usar página CRM real */}
        <Route path="crm" element={<CRM />} />
        <Route path="crm/dashboard" element={<CRM />} />
        <Route path="crm/leads" element={<CRMLeads />} />
        <Route path="crm/reports" element={<CRMReports />} />
        <Route path="crm/settings" element={<CRMSettings />} />
        <Route path="crm-webhook-logs" element={<CRMWebhookLogs />} />
        
        {/* Mentoria */}
        <Route path="mentorias" element={<AdminMentoring />} />
        <Route path="mentorias/catalogo" element={<AdminMentoringCatalogManagement />} />
        <Route path="mentorias/materiais" element={<AdminMentoringMaterials />} />
        <Route path="inscricoes-individuais" element={<AdminIndividualRegistrations />} />
        <Route path="inscricoes-grupo" element={<AdminGroupRegistrations />} />
        <Route path="sessoes-individuais" element={<AdminIndividualSessions />} />
        <Route path="sessoes-grupo" element={<AdminGroupSessions />} />
        
        {/* Gestão */}
        <Route path="alunos" element={<AdminStudents />} />
        <Route path="cursos" element={<AdminCourses />} />
        <Route path="bonus" element={<AdminBonus />} />
        <Route path="creditos" element={<AdminCredits />} />
        <Route path="noticias" element={<AdminNews />} />
        
        {/* Recursos - Usar páginas completas */}
        <Route path="fornecedores" element={<AdminSuppliersPage />} />
        <Route path="parceiros" element={<AdminPartnersPage />} />
        <Route path="ferramentas" element={<AdminToolsPage />} />
        
        {/* Configurações */}
        <Route path="categorias" element={<AdminCategories />} />
        <Route path="tipos-softwares" element={<AdminSoftwareTypes />} />
        <Route path="tipos-parceiros" element={<AdminPartnerTypes />} />
        <Route path="permissoes" element={<AdminPermissions />} />
        <Route path="permissoes/criar" element={<AdminPermissionCreate />} />
        <Route path="permissoes/editar/:id" element={<AdminPermissionEdit />} />
        <Route path="auditoria" element={<AdminAudit />} />
        <Route path="calendly-config" element={<AdminCalendlyConfig />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="configuracoes" element={<AdminSettings />} />
      </Route>

      {/* Student Routes */}
      <Route path="/aluno" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="creditos" element={<StudentCredits />} />
        <Route path="fornecedores" element={<StudentSuppliers />} />
        <Route path="parceiros" element={<StudentPartners />} />
        <Route path="ferramentas" element={<StudentTools />} />
        <Route path="meus-fornecedores" element={<StudentMySuppliers />} />
        <Route path="mentoria" element={<StudentMentoring />} />
        <Route path="livi-ai" element={<StudentLiviAI />} />
        <Route path="configuracoes" element={<StudentSettings />} />
      </Route>

      {/* Redirect for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
