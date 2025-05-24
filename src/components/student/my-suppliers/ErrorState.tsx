
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, WifiOff, Zap } from "lucide-react";

interface ErrorStateProps {
  error: string;
  retryCount: number;
  onRetry: () => void;
}

export const ErrorState = ({ error, retryCount, onRetry }: ErrorStateProps) => {
  const isNetworkError = error.includes('conexão') || error.includes('internet');
  const isCircuitBreakerError = error.includes('Muitas tentativas');
  const isAuthError = error.includes('autenticado');
  
  let ErrorIcon = AlertCircle;
  let errorColor = 'red';
  
  if (isNetworkError) {
    ErrorIcon = WifiOff;
    errorColor = 'orange';
  } else if (isCircuitBreakerError) {
    ErrorIcon = Zap;
    errorColor = 'yellow';
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Fornecedores</h1>
          <p className="text-gray-600 mt-2">
            Gerencie seus fornecedores pessoais e mantenha seus dados organizados.
          </p>
        </div>
      </div>
      
      <Alert variant={errorColor === 'red' ? 'destructive' : 'warning'} className={`border-${errorColor}-200 bg-${errorColor}-50`}>
        <ErrorIcon className={`h-6 w-6 text-${errorColor}-600`} />
        <AlertTitle className={`text-${errorColor}-800 font-semibold`}>
          {isNetworkError ? 'Problema de Conexão' : 
           isCircuitBreakerError ? 'Sistema Temporariamente Indisponível' :
           isAuthError ? 'Erro de Autenticação' : 'Erro ao Carregar Fornecedores'}
        </AlertTitle>
        <AlertDescription className={`text-${errorColor}-700`}>
          <p className="mb-4">{error}</p>
          
          {retryCount > 0 && (
            <p className="text-xs mb-4">
              Tentativas realizadas: {retryCount}
            </p>
          )}
          
          <div className="flex gap-2 mb-4">
            {!isCircuitBreakerError && (
              <Button 
                onClick={onRetry}
                className={`bg-${errorColor}-600 hover:bg-${errorColor}-700 text-white`}
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            )}
            
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className={`border-${errorColor}-300 text-${errorColor}-700 hover:bg-${errorColor}-100`}
              size="sm"
            >
              Recarregar Página
            </Button>
          </div>

          <div className={`p-3 bg-${errorColor}-100 rounded-md`}>
            <p className={`text-xs text-${errorColor}-700`}>
              <strong>
                {isNetworkError ? 'Dica de Conectividade:' :
                 isCircuitBreakerError ? 'Proteção Ativa:' :
                 'Solução:'}
              </strong>{' '}
              {isNetworkError ? 
                'Verifique sua conexão com a internet e tente novamente.' :
               isCircuitBreakerError ?
                'O sistema detectou muitos erros e pausou as tentativas para proteger o servidor. Aguarde alguns minutos.' :
               isAuthError ?
                'Faça logout e login novamente para restaurar sua sessão.' :
                'Se o problema persistir, entre em contato com o suporte.'}
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
