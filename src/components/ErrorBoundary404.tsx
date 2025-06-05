
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface Error404BoundaryProps {
  children: React.ReactNode;
}

interface Error404StateType {
  hasError: boolean;
  error?: Error;
}

export class Error404Boundary extends React.Component<Error404BoundaryProps, Error404StateType> {
  constructor(props: Error404BoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Error404StateType {
    console.error('Error404Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error404Boundary error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Error404Display error={this.state.error} />;
    }

    return this.props.children;
  }
}

const Error404Display: React.FC<{ error?: Error }> = ({ error }) => {
  const location = useLocation();

  const handleRefresh = () => {
    window.location.reload();
  };

  const getRouteInfo = () => {
    const path = location.pathname;
    
    if (path.startsWith('/admin/')) {
      return {
        type: 'Admin',
        section: path.replace('/admin/', '').split('/')[0] || 'dashboard',
        color: 'blue'
      };
    }
    
    if (path.startsWith('/aluno/')) {
      return {
        type: 'Aluno', 
        section: path.replace('/aluno/', '').split('/')[0] || 'dashboard',
        color: 'green'
      };
    }
    
    return {
      type: 'Geral',
      section: path.split('/')[1] || 'home',
      color: 'gray'
    };
  };

  const routeInfo = getRouteInfo();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-lg mx-auto px-6">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Página não encontrada</h1>
        
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
          routeInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
          routeInfo.color === 'green' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {routeInfo.type} - {routeInfo.section}
        </div>
        
        <p className="text-gray-600 mb-6">
          A página "{location.pathname}" não foi encontrada ou não está disponível.
        </p>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Rota tentada:</strong> {location.pathname}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Seção:</strong> {routeInfo.type}
          </p>
          {error && (
            <p className="text-sm text-red-600">
              <strong>Erro técnico:</strong> {error.message}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {routeInfo.type === 'Admin' && (
            <Link to="/admin">
              <Button className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Admin
              </Button>
            </Link>
          )}
          
          {routeInfo.type === 'Aluno' && (
            <Link to="/aluno">
              <Button className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Aluno
              </Button>
            </Link>
          )}
          
          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Recarregar
          </Button>
          
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Início
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 text-xs text-gray-400">
          <p>Se o problema persistir, entre em contato com o suporte.</p>
          <p className="mt-1">Timestamp: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  );
};
