
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle, RefreshCw } from 'lucide-react';

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-6">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Erro 404</h1>
        <p className="text-gray-600 mb-6">
          A página que você está procurando não foi encontrada ou ocorreu um erro.
        </p>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Rota atual:</strong> {location.pathname}
          </p>
          {error && (
            <p className="text-sm text-red-600">
              <strong>Erro:</strong> {error.message}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Recarregar Página
          </Button>
          <Link to="/admin">
            <Button className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
