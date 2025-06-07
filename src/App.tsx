import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Credits from './pages/student/Credits';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';
import { useAuth } from '@/hooks/auth';

// Lazy load das páginas de créditos
const CreditSuccess = lazy(() => import('./pages/student/credits/Success'));
const CreditCancelled = lazy(() => import('./pages/student/credits/Cancelled'));

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/pricing" element={<PublicRoute><Pricing /></PublicRoute>} />
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
          <Route path="/aluno/creditos" element={<PrivateRoute><Credits /></PrivateRoute>} />
          
          {/* Rotas de créditos */}
          <Route 
            path="/aluno/creditos/sucesso" 
            element={
              <Suspense fallback={<div>Carregando...</div>}>
                <CreditSuccess />
              </Suspense>
            } 
          />
          <Route 
            path="/aluno/creditos/cancelado" 
            element={
              <Suspense fallback={<div>Carregando...</div>}>
                <CreditCancelled />
              </Suspense>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
