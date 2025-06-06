
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import RouteGuard from './components/RouteGuard';
import Index from './pages/Index';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Student from './pages/Student';

// Lazy load das páginas de créditos
const CreditSuccess = lazy(() => import('./pages/student/credits/Success'));
const CreditCancelled = lazy(() => import('./pages/student/credits/Cancelled'));
const StudentCredits = lazy(() => import('./pages/student/Credits'));

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
          <Route 
            path="/admin" 
            element={
              <RouteGuard>
                <Admin />
              </RouteGuard>
            } 
          />
          
          {/* Área do Aluno */}
          <Route 
            path="/aluno" 
            element={
              <RouteGuard>
                <Student />
              </RouteGuard>
            } 
          />
          
          {/* Rotas de créditos do aluno */}
          <Route 
            path="/aluno/creditos" 
            element={
              <RouteGuard>
                <Suspense fallback={<div>Carregando...</div>}>
                  <StudentCredits />
                </Suspense>
              </RouteGuard>
            } 
          />
          
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
