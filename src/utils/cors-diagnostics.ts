
import { supabase } from '@/integrations/supabase/client';

interface CORSDiagnostics {
  canConnect: boolean;
  corsError: boolean;
  authStatus: 'authenticated' | 'unauthenticated' | 'error';
  edgeFunctionStatus: 'working' | 'error' | 'not_tested';
  currentOrigin: string;
  authWorking: boolean;
  errors: string[];
  recommendations: string[];
  details: {
    profileTest?: any;
    sessionTest?: any;
    edgeFunctionTest?: any;
    criticalError?: any;
  };
}

export const runCORSDiagnostics = async (): Promise<CORSDiagnostics> => {
  const result: CORSDiagnostics = {
    canConnect: false,
    corsError: false,
    authStatus: 'error',
    edgeFunctionStatus: 'not_tested',
    currentOrigin: typeof window !== 'undefined' ? window.location.origin : '',
    authWorking: false,
    errors: [],
    recommendations: [],
    details: {}
  };

  try {
    // Teste 1: Conectividade básica
    console.log('🔍 [CORS_DIAGNOSTICS] Teste 1: Conectividade básica');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    result.details.profileTest = { data: profileData, error: profileError };
    
    if (!profileError) {
      result.canConnect = true;
      console.log('✅ [CORS_DIAGNOSTICS] Conectividade OK');
    } else {
      console.log('❌ [CORS_DIAGNOSTICS] Erro de conectividade:', profileError);
      result.errors.push(`Erro de conectividade: ${profileError.message}`);
      if (profileError.message.includes('CORS') || profileError.message.includes('cross-origin')) {
        result.corsError = true;
      }
    }

    // Teste 2: Autenticação
    console.log('🔍 [CORS_DIAGNOSTICS] Teste 2: Autenticação');
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    result.details.sessionTest = { data: session, error: sessionError };
    
    if (!sessionError) {
      if (session.session) {
        result.authStatus = 'authenticated';
        result.authWorking = true;
        console.log('✅ [CORS_DIAGNOSTICS] Usuário autenticado');
      } else {
        result.authStatus = 'unauthenticated';
        result.authWorking = false;
        console.log('⚠️ [CORS_DIAGNOSTICS] Usuário não autenticado');
      }
    } else {
      console.log('❌ [CORS_DIAGNOSTICS] Erro na autenticação:', sessionError);
      result.errors.push(`Erro de autenticação: ${sessionError.message}`);
    }

    // Teste 3: Edge Functions (apenas se conectividade estiver OK)
    if (result.canConnect) {
      try {
        console.log('🔍 [CORS_DIAGNOSTICS] Teste 3: Edge Functions');
        const { data: edgeData, error: edgeError } = await supabase.functions.invoke('list-users', {
          method: 'GET'
        });
        
        result.details.edgeFunctionTest = { data: edgeData, error: edgeError };
        
        if (!edgeError) {
          result.edgeFunctionStatus = 'working';
          console.log('✅ [CORS_DIAGNOSTICS] Edge Functions OK');
        } else {
          result.edgeFunctionStatus = 'error';
          result.errors.push(`Edge Function error: ${edgeError.message}`);
          console.log('❌ [CORS_DIAGNOSTICS] Erro na Edge Function:', edgeError);
        }
      } catch (error: any) {
        result.edgeFunctionStatus = 'error';
        result.details.edgeFunctionTest = { error };
        result.errors.push(`Edge Function exception: ${error.message}`);
        console.log('❌ [CORS_DIAGNOSTICS] Erro ao testar Edge Function:', error);
      }
    }

    // Adicionar recomendações
    if (result.corsError) {
      result.recommendations.push('Verificar configurações CORS no dashboard do Supabase');
    }
    if (!result.authWorking && result.authStatus === 'unauthenticated') {
      result.recommendations.push('Fazer login para acessar recursos protegidos');
    }

  } catch (error: any) {
    console.error('💥 [CORS_DIAGNOSTICS] Erro crítico nos diagnósticos:', error);
    result.details.criticalError = error;
    result.errors.push(`Erro crítico: ${error.message}`);
  }

  console.log('📊 [CORS_DIAGNOSTICS] Resultado final:', result);
  return result;
};

export const logCORSDiagnostics = async (): Promise<void> => {
  const diagnostics = await runCORSDiagnostics();
  console.log('=== DIAGNÓSTICO CORS COMPLETO ===');
  console.log(JSON.stringify(diagnostics, null, 2));
  console.log('==================================');
};

export type { CORSDiagnostics };
