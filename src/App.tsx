
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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

const RouteGuard = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <div>Unauthorized</div>;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Index />} />
        <Route path="/register" element={<Index />} />
        <Route path="/forgot-password" element={<Index />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Student Routes */}
        <Route path="/aluno" element={<RouteGuard allowedRoles={['Student', 'Admin', 'Mentor']}><StudentDashboard /></RouteGuard>} />
        <Route path="/aluno/mentorias" element={<RouteGuard allowedRoles={['Student', 'Admin', 'Mentor']}><StudentMentoring /></RouteGuard>} />
        <Route path="/aluno/mentorias/:id" element={<RouteGuard allowedRoles={['Student', 'Admin', 'Mentor']}><StudentMentoringDetails /></RouteGuard>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<RouteGuard allowedRoles={['Admin']}><AdminDashboard /></RouteGuard>} />
        <Route path="/admin/mentorias" element={<RouteGuard allowedRoles={['Admin']}><AdminMentoring /></RouteGuard>} />
        <Route path="/admin/mentorias/:id" element={<RouteGuard allowedRoles={['Admin']}><AdminMentoringDetails /></RouteGuard>} />
        <Route path="/admin/usuarios" element={<RouteGuard allowedRoles={['Admin']}><AdminUsers /></RouteGuard>} />
        <Route path="/admin/grupos" element={<RouteGuard allowedRoles={['Admin']}><AdminGroups /></RouteGuard>} />
        
        {/* Mentoring Session Routes */}
        <Route path="/admin/mentorias/sessoes-individuais" element={<RouteGuard allowedRoles={['Admin']}><AdminIndividualSessions /></RouteGuard>} />
        <Route path="/admin/mentorias/sessoes-grupo" element={<RouteGuard allowedRoles={['Admin']}><AdminGroupSessions /></RouteGuard>} />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
