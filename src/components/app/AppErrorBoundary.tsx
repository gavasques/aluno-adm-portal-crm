
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🚨 ErrorBoundary: Erro capturado:', error);
    console.error('🚨 ErrorBoundary: Stack completo:', error.stack);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 ErrorBoundary: Detalhes completos do erro:');
    console.error('- Mensagem:', error.message);
    console.error('- Stack:', error.stack);
    console.error('- Component Stack:', errorInfo.componentStack);
    console.error('- Error Info:', errorInfo);
    
    // Log adicional para debug
    console.error('🚨 ErrorBoundary: Estado da aplicação:', {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
    
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 max-w-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erro na Aplicação</h1>
            <p className="text-gray-600 mb-4">
              Ocorreu um erro inesperado. Verifique o console para mais detalhes.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="bg-gray-100 p-3 rounded text-sm mb-4 text-left">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Detalhes do erro
                </summary>
                <div className="text-xs text-red-600 overflow-auto whitespace-pre-wrap max-h-40">
                  <strong>Erro:</strong> {this.state.error.message}
                  <br /><br />
                  <strong>Stack:</strong> {this.state.error.stack}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      <br /><br />
                      <strong>Component Stack:</strong> {this.state.errorInfo.componentStack}
                    </>
                  )}
                </div>
              </details>
            )}
            
            <div className="space-x-3">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Recarregar Página
              </button>
              <button 
                onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
