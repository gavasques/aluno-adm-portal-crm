
import { supabase } from "@/integrations/supabase/client";

export interface CORSDiagnostics {
  canConnect: boolean;
  corsError: boolean;
  authWorking: boolean;
  redirectUrl: string;
  currentOrigin: string;
  errors: string[];
  recommendations: string[];
}

export const runCORSDiagnostics = async (): Promise<CORSDiagnostics> => {
  const diagnostics: CORSDiagnostics = {
    canConnect: false,
    corsError: false,
    authWorking: false,
    redirectUrl: '',
    currentOrigin: window.location.origin,
    errors: [],
    recommendations: []
  };

  try {
    console.log('🔍 [CORS_DIAGNOSTICS] Iniciando diagnóstico...');
    
    // Teste 1: Verificar conexão básica
    console.log('🔍 [CORS_DIAGNOSTICS] Testando conexão básica...');
    
    const { data: connectionTest, error: connectionError } = await supabase
      .from('crm_leads')
      .select('id')
      .limit(1);

    if (connectionError) {
      console.error('❌ [CORS_DIAGNOSTICS] Erro de conexão:', connectionError);
      
      if (connectionError.message.includes('CORS') || 
          connectionError.message.includes('cross-origin') ||
          connectionError.message.includes('Access-Control-Allow-Origin')) {
        diagnostics.corsError = true;
        diagnostics.errors.push('Erro de CORS detectado');
        diagnostics.recommendations.push('Configurar CORS no dashboard do Supabase');
      } else {
        diagnostics.errors.push(`Erro de conexão: ${connectionError.message}`);
      }
    } else {
      diagnostics.canConnect = true;
      console.log('✅ [CORS_DIAGNOSTICS] Conexão básica funcionando');
    }

    // Teste 2: Verificar autenticação
    console.log('🔍 [CORS_DIAGNOSTICS] Testando autenticação...');
    
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        diagnostics.errors.push(`Erro de autenticação: ${sessionError.message}`);
      } else if (sessionData?.session) {
        diagnostics.authWorking = true;
        console.log('✅ [CORS_DIAGNOSTICS] Autenticação funcionando');
      } else {
        diagnostics.errors.push('Nenhuma sessão ativa encontrada');
      }
    } catch (authError: any) {
      diagnostics.errors.push(`Erro ao verificar autenticação: ${authError.message}`);
    }

    // Teste 3: Verificar se está sendo redirecionado
    if (window.location.hostname.includes('lovable.dev')) {
      diagnostics.redirectUrl = window.location.origin;
      
      if (!diagnostics.canConnect && !diagnostics.corsError) {
        diagnostics.recommendations.push('Verificar se há redirecionamentos para URLs externas');
        diagnostics.recommendations.push('Configurar proxy local se necessário');
      }
    }

    // Recomendações baseadas nos resultados
    if (diagnostics.corsError) {
      diagnostics.recommendations.push('Adicionar https://lovable.dev e *.lovable.dev aos domínios permitidos no Supabase');
      diagnostics.recommendations.push('Verificar configurações de CORS no dashboard do Supabase');
    }

    if (!diagnostics.authWorking && diagnostics.canConnect) {
      diagnostics.recommendations.push('Verificar se o usuário está logado');
      diagnostics.recommendations.push('Tentar fazer login novamente');
    }

  } catch (error: any) {
    console.error('❌ [CORS_DIAGNOSTICS] Erro geral:', error);
    diagnostics.errors.push(`Erro geral: ${error.message}`);
    
    if (error.message.includes('fetch')) {
      diagnostics.corsError = true;
      diagnostics.recommendations.push('Problema de rede ou CORS - verificar configurações do Supabase');
    }
  }

  console.log('📊 [CORS_DIAGNOSTICS] Resultado:', diagnostics);
  return diagnostics;
};

// Função para testar uma operação específica (movimento de lead)
export const testLeadMovement = async (leadId: string, newColumnId: string): Promise<boolean> => {
  console.log('🧪 [CORS_TEST] Testando movimento de lead...', { leadId, newColumnId });
  
  try {
    const { data, error } = await supabase
      .from('crm_leads')
      .update({ column_id: newColumnId, updated_at: new Date().toISOString() })
      .eq('id', leadId)
      .select('id, name, column_id')
      .single();

    if (error) {
      console.error('❌ [CORS_TEST] Erro no teste de movimento:', error);
      return false;
    }

    console.log('✅ [CORS_TEST] Teste de movimento bem-sucedido:', data);
    return true;
  } catch (error: any) {
    console.error('❌ [CORS_TEST] Erro ao testar movimento:', error);
    return false;
  }
};

// Função para exibir diagnóstico no console
export const logCORSDiagnostics = async () => {
  const diagnostics = await runCORSDiagnostics();
  
  console.log('=== DIAGNÓSTICO DE CORS ===');
  console.log('🌐 Origem atual:', diagnostics.currentOrigin);
  console.log('🔗 Pode conectar:', diagnostics.canConnect ? '✅' : '❌');
  console.log('🚫 Erro de CORS:', diagnostics.corsError ? '❌' : '✅');
  console.log('🔐 Autenticação:', diagnostics.authWorking ? '✅' : '❌');
  
  if (diagnostics.errors.length > 0) {
    console.log('❌ Erros encontrados:');
    diagnostics.errors.forEach(error => console.log('  -', error));
  }
  
  if (diagnostics.recommendations.length > 0) {
    console.log('💡 Recomendações:');
    diagnostics.recommendations.forEach(rec => console.log('  -', rec));
  }
  
  console.log('============================');
  
  return diagnostics;
};
