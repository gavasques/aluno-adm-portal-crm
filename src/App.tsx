
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/auth';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

// Imports diretos - sem lazy loading para evitar problemas
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import StudentDashboard from '@/pages/student/Dashboard';
import StudentMySuppliers from '@/pages/student/MySuppliers';
import StudentMentoring from '@/pages/student/Mentoring';

import UnifiedOptimizedLayout from '@/layout/UnifiedOptimizedLayout';
import OptimizedProtectedRoute from '@/components/routing/OptimizedProtectedRoute';

// Query client simplificado
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

// Error Boundary para capturar erros
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🚨 ErrorBoundary: Erro capturado:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ErrorBoundary: Detalhes do erro:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Ops! Algo deu errado</h1>
            <p className="text-gray-600 mb-4">Ocorreu um erro inesperado na aplicação.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  console.log('🚀 App: Iniciando aplicação...');

  // Detectar se há problemas de extensões
  useEffect(() => {
    const checkResources = () => {
      console.log('🔍 App: Verificando recursos da aplicação...');
      
      // Verificar se há erros de rede bloqueados
      const originalConsoleError = console.error;
      console.error = (...args) => {
        if (args.some(arg => typeof arg === 'string' && arg.includes('ERR_BLOCKED_BY_CLIENT'))) {
          console.warn('⚠️ App: Detectado bloqueio de recursos por extensão do navegador');
        }
        originalConsoleError.apply(console, args);
      };
    };

    checkResources();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="App">
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
              
              <Toaster />
              <SonnerToaster position="top-right" />
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
