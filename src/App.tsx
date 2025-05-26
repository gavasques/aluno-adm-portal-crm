import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import StudentMentoring from '@/pages/student/Mentoring';
import StudentMentoringDetails from '@/pages/student/MentoringDetails';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import AdminMentoring from '@/pages/admin/AdminMentoring';
import AdminMentoringDetails from '@/pages/admin/AdminMentoringDetails';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminGroups from '@/pages/admin/AdminGroups';
import AdminIndividualSessions from '@/pages/admin/AdminIndividualSessions';
import AdminGroupSessions from '@/pages/admin/AdminGroupSessions';

const RouteGuard = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <div>Unauthorized</div>;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
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
