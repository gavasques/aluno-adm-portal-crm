
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ResourceBlockingDetector } from '@/utils/resourceBlockingDetector';

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
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 ErrorBoundary: Detalhes do erro:', error, errorInfo);
    console.error('🚨 ErrorBoundary: Stack trace completo:', errorInfo.componentStack);
    
    // Verificar se é erro relacionado a bloqueio
    if (error.message.includes('blocked') || error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
      ResourceBlockingDetector.createFallbackMode();
    }
    
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 max-w-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Ops! Algo deu errado</h1>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message.includes('blocked') 
                ? 'Recursos bloqueados por extensões do navegador detectados.'
                : 'Ocorreu um erro inesperado na aplicação.'
              }
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="bg-gray-100 p-3 rounded text-sm mb-4">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className="text-xs text-red-600 overflow-auto whitespace-pre-wrap">
                  <strong>Erro:</strong> {this.state.error.message}
                  {this.state.error.stack && (
                    <>
                      <br /><br />
                      <strong>Stack:</strong> {this.state.error.stack}
                    </>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      <br /><br />
                      <strong>Component Stack:</strong> {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}
            
            {this.state.error?.message.includes('blocked') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-sm text-yellow-800">
                <p className="font-semibold mb-2">Soluções:</p>
                <ul className="text-left space-y-1">
                  <li>• Desative extensões de bloqueio (AdBlock, uBlock)</li>
                  <li>• Use modo incógnito</li>
                  <li>• Adicione o site às exceções</li>
                </ul>
              </div>
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
