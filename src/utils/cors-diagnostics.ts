
import { supabase } from '@/integrations/supabase/client';

interface CORSDiagnostics {
  canConnect: boolean;
  corsError: boolean;
  authStatus: 'authenticated' | 'unauthenticated' | 'error';
  edgeFunctionStatus: 'working' | 'error' | 'not_tested';
  details: {
    profileTest?: any;
    sessionTest?: any;
    edgeFunctionTest?: any;
  };
}

export const runCORSDiagnostics = async (): Promise<CORSDiagnostics> => {
  const result: CORSDiagnostics = {
    canConnect: false,
    corsError: false,
    authStatus: 'error',
    edgeFunctionStatus: 'not_tested',
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
        console.log('✅ [CORS_DIAGNOSTICS] Usuário autenticado');
      } else {
        result.authStatus = 'unauthenticated';
        console.log('⚠️ [CORS_DIAGNOSTICS] Usuário não autenticado');
      }
    } else {
      console.log('❌ [CORS_DIAGNOSTICS] Erro na autenticação:', sessionError);
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
          console.log('❌ [CORS_DIAGNOSTICS] Erro na Edge Function:', edgeError);
        }
      } catch (error) {
        result.edgeFunctionStatus = 'error';
        result.details.edgeFunctionTest = { error };
        console.log('❌ [CORS_DIAGNOSTICS] Erro ao testar Edge Function:', error);
      }
    }

  } catch (error) {
    console.error('💥 [CORS_DIAGNOSTICS] Erro crítico nos diagnósticos:', error);
    result.details.criticalError = error;
  }

  console.log('📊 [CORS_DIAGNOSTICS] Resultado final:', result);
  return result;
};
