
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RouteGuard from './components/RouteGuard';
import Index from './pages/Index';
import Login from './pages/Login';
import AdminLayout from './layout/AdminLayout';
import StudentLayout from './layout/StudentLayout';

// Lazy load das páginas de créditos
const CreditSuccess = lazy(() => import('./pages/student/credits/Success'));
const CreditCancelled = lazy(() => import('./pages/student/credits/Cancelled'));
const StudentCredits = lazy(() => import('./pages/student/Credits'));

// Lazy load páginas administrativas
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminStudents = lazy(() => import('./pages/admin/Students'));
const AdminSuppliers = lazy(() => import('./pages/admin/Suppliers'));
const AdminPartners = lazy(() => import('./pages/admin/Partners'));
const AdminTools = lazy(() => import('./pages/admin/Tools'));
const AdminNews = lazy(() => import('./pages/admin/News'));
const AdminMentoring = lazy(() => import('./pages/admin/Mentoring'));
const AdminCredits = lazy(() => import('./pages/admin/Credits'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));

// Lazy load páginas do estudante
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const StudentSuppliers = lazy(() => import('./pages/student/Suppliers'));
const StudentPartners = lazy(() => import('./pages/student/Partners'));
const StudentTools = lazy(() => import('./pages/student/Tools'));
const StudentMySuppliers = lazy(() => import('./pages/student/MySuppliers'));
const StudentMentoring = lazy(() => import('./pages/student/Mentoring'));
const StudentLiviAI = lazy(() => import('./pages/student/LiviAI'));
const StudentConfiguration = lazy(() => import('./pages/student/Configuration'));

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Página inicial */}
          <Route path="/" element={<Index />} />
          
          {/* Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Área Administrativa */}
          <Route path="/admin" element={
            <RouteGuard>
              <AdminLayout />
            </RouteGuard>
          }>
            <Route index element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <AdminDashboard />
              </Suspense>
            } />
            <Route path="usuarios" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <AdminUsers />
              </Suspense>
            } />
            <Route path="alunos" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <AdminStudents />
              </Suspense>
            } />
            <Route path="fornecedores" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <AdminSuppliers />
              </Suspense>
            } />
            <Route path="parceiros" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <AdminPartners />
              </Suspense>
            } />
            <Route path="ferramentas" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <AdminTools />
              </Suspense>
            } />
            <Route path="noticias" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <AdminNews />
              </Suspense>
            } />
            <Route path="mentorias" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <AdminMentoring />
              </Suspense>
            } />
            <Route path="creditos" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <AdminCredits />
              </Suspense>
            } />
            <Route path="configuracoes" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <AdminSettings />
              </Suspense>
            } />
          </Route>
          
          {/* Área do Aluno */}
          <Route path="/aluno" element={
            <RouteGuard>
              <StudentLayout />
            </RouteGuard>
          }>
            <Route index element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <StudentDashboard />
              </Suspense>
            } />
            <Route path="fornecedores" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <StudentSuppliers />
              </Suspense>
            } />
            <Route path="parceiros" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <StudentPartners />
              </Suspense>
            } />
            <Route path="ferramentas" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <StudentTools />
              </Suspense>
            } />
            <Route path="meus-fornecedores" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <StudentMySuppliers />
              </Suspense>
            } />
            <Route path="mentoria" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <StudentMentoring />
              </Suspense>
            } />
            <Route path="livi-ai" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <StudentLiviAI />
              </Suspense>
            } />
            <Route path="creditos" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <StudentCredits />
              </Suspense>
            } />
            <Route path="configuracoes" element={
              <Suspense fallback={<div className="p-8">Carregando...</div>}>
                <StudentConfiguration />
              </Suspense>
            } />
          </Route>
          
          {/* Rotas de retorno do Stripe */}
          <Route 
            path="/aluno/creditos/sucesso" 
            element={
              <RouteGuard>
                <Suspense fallback={<div>Carregando...</div>}>
                  <CreditSuccess />
                </Suspense>
              </RouteGuard>
            } 
          />
          <Route 
            path="/aluno/creditos/cancelado" 
            element={
              <RouteGuard>
                <Suspense fallback={<div>Carregando...</div>}>
                  <CreditCancelled />
                </Suspense>
              </RouteGuard>
            } 
          />
          
          {/* Rota 404 - redirecionar para home */}
          <Route path="*" element={<Index />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
