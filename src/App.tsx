
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import AdminLayout from '@/layout/AdminLayout';
import StudentLayout from '@/layout/StudentLayout';
import { SimpleRouteGuard } from '@/components/SimpleRouteGuard';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import CRM from '@/pages/admin/CRM';
import LeadDetails from '@/pages/admin/LeadDetails';
import UserManagement from '@/pages/admin/UserManagement';
import StudentManagement from '@/pages/admin/StudentManagement';
import CourseManagement from '@/pages/admin/CourseManagement';
import BonusManagement from '@/pages/admin/BonusManagement';
import CreditsManagement from '@/pages/admin/CreditsManagement';
import TaskManagement from '@/pages/admin/TaskManagement';
import NewsManagement from '@/pages/admin/NewsManagement';
import SuppliersAdm from '@/pages/admin/SuppliersAdm';
import PartnersAdm from '@/pages/admin/PartnersAdm';
import ToolsAdm from '@/pages/admin/ToolsAdm';
import Categories from '@/pages/admin/Categories';
import Types from '@/pages/admin/Types';
import Permissions from '@/pages/admin/Permissions';
import Audit from '@/pages/admin/Audit';
import CalendlyConfig from '@/pages/admin/CalendlyConfig';

// Mentoring Admin Pages
import MentoringDashboard from '@/pages/admin/mentoring/Dashboard';
import MentoringCatalog from '@/pages/admin/mentoring/Catalog';
import MentoringEnrollments from '@/pages/admin/mentoring/Enrollments';
import MentoringSessions from '@/pages/admin/mentoring/Sessions';
import MentoringMaterials from '@/pages/admin/mentoring/Materials';

// Student Pages
import StudentDashboard from '@/pages/student/Dashboard';
import StudentCredits from '@/pages/student/Credits';
import StudentSuppliers from '@/pages/student/Suppliers';
import StudentPartners from '@/pages/student/Partners';
import StudentTools from '@/pages/student/Tools';
import StudentMySuppliers from '@/pages/student/MySuppliers';
import StudentMentoring from '@/pages/student/Mentoring';
import StudentLiviAI from '@/pages/student/LiviAI';

// Public Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <HelmetProvider>
        <Helmet>
          <title>Portal LV - Educação Avançada</title>
          <meta name="description" content="Portal educacional completo com cursos, mentorias e recursos para crescimento profissional." />
        </Helmet>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <SimpleRouteGuard requireAuth={true} requireAdmin={true}>
                <AdminLayout />
              </SimpleRouteGuard>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="usuarios" element={<UserManagement />} />
              <Route path="crm" element={<CRM />} />
              <Route path="crm/lead/:id" element={<LeadDetails />} />
              <Route path="lista-tarefas" element={<TaskManagement />} />
              
              {/* Mentoring Routes */}
              <Route path="mentoria" element={<MentoringDashboard />} />
              <Route path="mentoria/catalogo" element={<MentoringCatalog />} />
              <Route path="mentoria/inscricoes" element={<MentoringEnrollments />} />
              <Route path="mentoria/sessoes" element={<MentoringSessions />} />
              <Route path="mentoria/materiais" element={<MentoringMaterials />} />
              
              {/* Management Routes */}
              <Route path="gestao-alunos" element={<StudentManagement />} />
              <Route path="cadastro-cursos" element={<CourseManagement />} />
              <Route path="cadastro-bonus" element={<BonusManagement />} />
              <Route path="gestao-creditos" element={<CreditsManagement />} />
              <Route path="noticias" element={<NewsManagement />} />
              
              {/* Resources Routes */}
              <Route path="fornecedores-adm" element={<SuppliersAdm />} />
              <Route path="parceiros-adm" element={<PartnersAdm />} />
              <Route path="ferramentas-adm" element={<ToolsAdm />} />
              
              {/* Configuration Routes */}
              <Route path="categorias" element={<Categories />} />
              <Route path="tipos" element={<Types />} />
              <Route path="permissoes" element={<Permissions />} />
              <Route path="auditoria" element={<Audit />} />
              <Route path="config-calendly" element={<CalendlyConfig />} />
            </Route>

            {/* Student Routes */}
            <Route path="/aluno" element={
              <SimpleRouteGuard requireAuth={true}>
                <StudentLayout />
              </SimpleRouteGuard>
            }>
              <Route index element={<StudentDashboard />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="meus-creditos" element={<StudentCredits />} />
              <Route path="fornecedores" element={<StudentSuppliers />} />
              <Route path="parceiros" element={<StudentPartners />} />
              <Route path="ferramentas" element={<StudentTools />} />
              <Route path="meus-fornecedores" element={<StudentMySuppliers />} />
              <Route path="mentoria" element={<StudentMentoring />} />
              <Route path="livi-ai" element={<StudentLiviAI />} />
            </Route>

            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </div>
  );
}

export default App;
