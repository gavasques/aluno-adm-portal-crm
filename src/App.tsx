
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Index from '@/pages/Index';
import ResetPassword from '@/pages/ResetPassword';
import StudentDashboard from '@/pages/student/Dashboard';
import StudentMentoring from '@/pages/student/Mentoring';
import StudentMentoringDetails from '@/pages/student/MentoringDetail';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminMentoring from '@/pages/admin/Mentoring';
import AdminMentoringDetails from '@/pages/admin/MentoringDetail';
import AdminUsers from '@/pages/admin/Users';
import AdminGroups from '@/pages/admin/AdminGroups';
import AdminIndividualSessions from '@/pages/admin/AdminIndividualSessions';
import AdminGroupSessions from '@/pages/admin/AdminGroupSessions';
import RouteGuard from '@/components/RouteGuard';
import StudentLayout from '@/layout/StudentLayout';
import AdminLayout from '@/layout/AdminLayout';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes - No protection needed */}
      <Route path="/login" element={<Index />} />
      <Route path="/register" element={<Index />} />
      <Route path="/forgot-password" element={<Index />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Student Routes with Layout and Protection */}
      <Route path="/aluno" element={
        <RouteGuard requiredMenuKey="student-dashboard">
          <StudentLayout />
        </RouteGuard>
      }>
        <Route index element={<StudentDashboard />} />
        <Route path="mentorias" element={<StudentMentoring />} />
        <Route path="mentorias/:id" element={<StudentMentoringDetails />} />
      </Route>
      
      {/* Admin Routes with Layout and Protection */}
      <Route path="/admin" element={
        <RouteGuard requireAdminAccess>
          <AdminLayout />
        </RouteGuard>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="mentorias" element={<AdminMentoring />} />
        <Route path="mentorias/:id" element={<AdminMentoringDetails />} />
        <Route path="usuarios" element={<AdminUsers />} />
        <Route path="grupos" element={<AdminGroups />} />
        <Route path="mentorias/sessoes-individuais" element={<AdminIndividualSessions />} />
        <Route path="mentorias/sessoes-grupo" element={<AdminGroupSessions />} />
      </Route>
      
      {/* Default Route - Redirect based on authentication */}
      <Route path="/" element={
        user ? <Navigate to="/aluno" replace /> : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

export default App;
