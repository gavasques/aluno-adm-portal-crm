
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

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />

      {/* Rotas Admin */}
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
