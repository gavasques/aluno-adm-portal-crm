
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import AdminLayout from '@/layout/AdminLayout';
import StudentLayout from '@/layout/StudentLayout';
import { SimpleRouteGuard } from '@/components/SimpleRouteGuard';

// Admin Pages - apenas as que existem
import AdminDashboard from '@/pages/admin/Dashboard';
import CRM from '@/pages/admin/CRM';
import LeadDetails from '@/pages/admin/LeadDetails';
import Categories from '@/pages/admin/Categories';
import Permissions from '@/pages/admin/Permissions';
import Audit from '@/pages/admin/Audit';

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
              <Route path="crm" element={<CRM />} />
              <Route path="crm/lead/:id" element={<LeadDetails />} />
              <Route path="categorias" element={<Categories />} />
              <Route path="permissoes" element={<Permissions />} />
              <Route path="auditoria" element={<Audit />} />
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
