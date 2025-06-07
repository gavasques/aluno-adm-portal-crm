
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import StudentDashboard from '@/pages/student/Dashboard';
import StudentMySuppliers from '@/pages/student/MySuppliers';
import StudentMentoring from '@/pages/student/Mentoring';
import StudentCredits from '@/pages/student/Credits';
import StudentSuppliers from '@/pages/student/Suppliers';
import StudentPartners from '@/pages/student/Partners';
import StudentTools from '@/pages/student/Tools';
import StudentLiviAI from '@/pages/student/LiviAI';
import StudentSettings from '@/pages/student/Settings';
import NotFound from '@/pages/NotFound';
import UnifiedOptimizedLayout from '@/layout/UnifiedOptimizedLayout';
import OptimizedProtectedRoute from '@/components/routing/OptimizedProtectedRoute';

// Import lazy para performance
const AdminMentoringCatalog = React.lazy(() => import('@/pages/admin/AdminMentoringCatalog'));
const AdminAuditReports = React.lazy(() => import('@/pages/admin/AuditReports'));

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />

      {/* Rotas Admin - Principal */}
      <Route 
        path="/admin" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <AdminDashboard />
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      
      {/* Rotas Admin - Gestão de Usuários */}
      <Route 
        path="/admin/usuarios" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <AdminUsers />
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <AdminUsers />
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />

      {/* Rotas Admin - CRM */}
      <Route 
        path="/admin/crm" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">CRM Dashboard</h1>
                <p className="text-gray-600">Sistema de gerenciamento de relacionamento com clientes</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/crm/leads" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Gestão de Leads</h1>
                <p className="text-gray-600">Gerencie seus leads e oportunidades</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/crm/reports" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Relatórios CRM</h1>
                <p className="text-gray-600">Análises e relatórios do CRM</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/crm/settings" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Configurações CRM</h1>
                <p className="text-gray-600">Configure seu sistema CRM</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/crm-webhook-logs" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Logs Webhook CRM</h1>
                <p className="text-gray-600">Monitore os logs de webhooks do CRM</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />

      {/* Rotas Admin - Mentoria */}
      <Route 
        path="/admin/mentorias" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Dashboard de Mentorias</h1>
                <p className="text-gray-600">Visão geral do sistema de mentorias</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/mentoria" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Dashboard de Mentorias</h1>
                <p className="text-gray-600">Visão geral do sistema de mentorias</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/mentorias/catalogo" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <React.Suspense fallback={<div className="p-8">Carregando...</div>}>
                <AdminMentoringCatalog />
              </React.Suspense>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/mentoria/catalogo" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <React.Suspense fallback={<div className="p-8">Carregando...</div>}>
                <AdminMentoringCatalog />
              </React.Suspense>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/inscricoes-individuais" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Inscrições Individuais</h1>
                <p className="text-gray-600">Gerencie inscrições individuais de mentoria</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/inscricoes-grupo" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Inscrições em Grupo</h1>
                <p className="text-gray-600">Gerencie inscrições em grupo de mentoria</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/sessoes-individuais" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Sessões Individuais</h1>
                <p className="text-gray-600">Gerencie sessões individuais de mentoria</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/sessoes-grupo" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Sessões em Grupo</h1>
                <p className="text-gray-600">Gerencie sessões em grupo de mentoria</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/mentorias/materiais" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Central de Materiais</h1>
                <p className="text-gray-600">Gerencie materiais de mentoria</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />

      {/* Rotas Admin - Gestão */}
      <Route 
        path="/admin/alunos" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Gestão de Alunos</h1>
                <p className="text-gray-600">Gerencie os alunos da plataforma</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/cursos" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Cadastro de Cursos</h1>
                <p className="text-gray-600">Gerencie os cursos disponíveis</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/bonus" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Cadastro de Bônus</h1>
                <p className="text-gray-600">Gerencie bônus e recompensas</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/creditos" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Gestão de Créditos</h1>
                <p className="text-gray-600">Gerencie o sistema de créditos</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/credits" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Gestão de Créditos</h1>
                <p className="text-gray-600">Gerencie o sistema de créditos</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/noticias" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Notícias</h1>
                <p className="text-gray-600">Gerencie as notícias da plataforma</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/tarefas" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Lista de Tarefas</h1>
                <p className="text-gray-600">Gerencie suas tarefas e atividades</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/tasks" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Lista de Tarefas</h1>
                <p className="text-gray-600">Gerencie suas tarefas e atividades</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />

      {/* Rotas Admin - Recursos Gerais */}
      <Route 
        path="/admin/fornecedores" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Fornecedores ADM</h1>
                <p className="text-gray-600">Gerencie fornecedores da plataforma</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/suppliers" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Fornecedores ADM</h1>
                <p className="text-gray-600">Gerencie fornecedores da plataforma</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/parceiros" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Parceiros ADM</h1>
                <p className="text-gray-600">Gerencie parceiros da plataforma</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/partners" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Parceiros ADM</h1>
                <p className="text-gray-600">Gerencie parceiros da plataforma</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/ferramentas" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Ferramentas ADM</h1>
                <p className="text-gray-600">Gerencie ferramentas da plataforma</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />

      {/* Rotas Admin - Configurações */}
      <Route 
        path="/admin/categorias" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Categorias</h1>
                <p className="text-gray-600">Gerencie categorias do sistema</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/tipos-softwares" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Tipos de Ferramentas</h1>
                <p className="text-gray-600">Gerencie tipos de ferramentas</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/tipos-parceiros" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Tipos de Parceiros</h1>
                <p className="text-gray-600">Gerencie tipos de parceiros</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/permissoes" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Permissões</h1>
                <p className="text-gray-600">Gerencie permissões do sistema</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/permissions" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Permissões</h1>
                <p className="text-gray-600">Gerencie permissões do sistema</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/auditoria" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <React.Suspense fallback={<div className="p-8">Carregando...</div>}>
                <AdminAuditReports />
              </React.Suspense>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/calendly-config" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Config. Calendly</h1>
                <p className="text-gray-600">Configure integração com Calendly</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/configuracoes" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Configurações</h1>
                <p className="text-gray-600">Configurações gerais do sistema</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Configurações</h1>
                <p className="text-gray-600">Configurações gerais do sistema</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/admin/notifications" 
        element={
          <OptimizedProtectedRoute requireAdmin={true}>
            <UnifiedOptimizedLayout isAdmin={true}>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Notificações</h1>
                <p className="text-gray-600">Central de notificações</p>
              </div>
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />

      {/* Rotas Aluno */}
      <Route 
        path="/aluno" 
        element={
          <OptimizedProtectedRoute>
            <UnifiedOptimizedLayout isAdmin={false}>
              <StudentDashboard />
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/aluno/creditos" 
        element={
          <OptimizedProtectedRoute>
            <UnifiedOptimizedLayout isAdmin={false}>
              <StudentCredits />
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/aluno/fornecedores" 
        element={
          <OptimizedProtectedRoute>
            <UnifiedOptimizedLayout isAdmin={false}>
              <StudentSuppliers />
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/aluno/parceiros" 
        element={
          <OptimizedProtectedRoute>
            <UnifiedOptimizedLayout isAdmin={false}>
              <StudentPartners />
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/aluno/ferramentas" 
        element={
          <OptimizedProtectedRoute>
            <UnifiedOptimizedLayout isAdmin={false}>
              <StudentTools />
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/aluno/meus-fornecedores" 
        element={
          <OptimizedProtectedRoute>
            <UnifiedOptimizedLayout isAdmin={false}>
              <StudentMySuppliers />
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/aluno/mentoria" 
        element={
          <OptimizedProtectedRoute>
            <UnifiedOptimizedLayout isAdmin={false}>
              <StudentMentoring />
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/aluno/livi-ai" 
        element={
          <OptimizedProtectedRoute>
            <UnifiedOptimizedLayout isAdmin={false}>
              <StudentLiviAI />
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />
      <Route 
        path="/aluno/configuracoes" 
        element={
          <OptimizedProtectedRoute>
            <UnifiedOptimizedLayout isAdmin={false}>
              <StudentSettings />
            </UnifiedOptimizedLayout>
          </OptimizedProtectedRoute>
        } 
      />

      {/* 404 - Usar o componente NotFound existente */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
