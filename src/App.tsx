import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { Login } from '@/pages/auth/Login';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';
import { Register } from '@/pages/auth/Register';
import { Home } from '@/pages/Home';
import { Courses } from '@/pages/Courses';
import { CourseDetails } from '@/pages/CourseDetails';
import { Mentoring } from '@/pages/Mentoring';
import { Tasks } from '@/pages/Tasks';
import { Community } from '@/pages/Community';
import { Profile } from '@/pages/Profile';
import { Settings } from '@/pages/Settings';
import { NotFound } from '@/pages/NotFound';
import { Users } from '@/pages/admin/Users';
import { Suppliers } from '@/pages/admin/Suppliers';
import { Students } from '@/pages/admin/Students';
import { TasksAdmin } from '@/pages/admin/TasksAdmin';
import { Finances } from '@/pages/admin/Finances';
import { CRM } from '@/pages/admin/CRM';
import LeadDetails from '@/pages/admin/LeadDetails';

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
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/cursos" element={<Layout><Courses /></Layout>} />
            <Route path="/cursos/:courseId" element={<Layout><CourseDetails /></Layout>} />
            <Route path="/mentoring" element={<Layout><Mentoring /></Layout>} />
            <Route path="/community" element={<Layout><Community /></Layout>} />

            {/* Private Routes */}
            <Route path="/tasks" element={<RouteGuard><Layout><Tasks /></Layout></RouteGuard>} />
            <Route path="/profile" element={<RouteGuard><Layout><Profile /></Layout></RouteGuard>} />
            <Route path="/settings" element={<RouteGuard><Layout><Settings /></Layout></RouteGuard>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<RouteGuard />}>
              <Route path="users" element={<Layout><Users /></Layout>} />
              <Route path="suppliers" element={<Layout><Suppliers /></Layout>} />
              <Route path="students" element={<Layout><Students /></Layout>} />
              <Route path="tasks" element={<Layout><TasksAdmin /></Layout>} />
              <Route path="finances" element={<Layout><Finances /></Layout>} />
              <Route path="crm" element={<CRM />} />
              <Route path="crm/lead/:id" element={<LeadDetails />} />
            </Route>

            {/* Not Found Route */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </div>
  );
}

export default App;
