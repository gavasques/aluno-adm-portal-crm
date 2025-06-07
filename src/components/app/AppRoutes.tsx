
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import StudentDashboard from '@/pages/student/Dashboard';
import StudentMySuppliers from '@/pages/student/MySuppliers';
import StudentMentoring from '@/pages/student/Mentoring';
import UnifiedOptimizedLayout from '@/layout/UnifiedOptimizedLayout';
import OptimizedProtectedRoute from '@/components/routing/OptimizedProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />

      {/* Rotas Admin */}
      <Route path="/admin/*" element={
        <OptimizedProtectedRoute requireAdmin={true}>
          <UnifiedOptimizedLayout isAdmin={true}>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/users" element={<AdminUsers />} />
            </Routes>
          </UnifiedOptimizedLayout>
        </OptimizedProtectedRoute>
      } />

      {/* Rotas Aluno */}
      <Route path="/aluno/*" element={
        <OptimizedProtectedRoute>
          <UnifiedOptimizedLayout isAdmin={false}>
            <Routes>
              <Route path="/" element={<StudentDashboard />} />
              <Route path="/meus-fornecedores" element={<StudentMySuppliers />} />
              <Route path="/mentoria" element={<StudentMentoring />} />
            </Routes>
          </UnifiedOptimizedLayout>
        </OptimizedProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">404</h1>
            <p className="text-gray-600">Página não encontrada</p>
            <button 
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Voltar
            </button>
          </div>
        </div>
      } />
    </Routes>
  );
};
