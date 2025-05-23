
// Fix Permission Groups Policy Edge Function
// This function will create a proper RLS policy for permission_groups table

import { serve } from "https://deno.land/std@0.202.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info, cache-control, x-timestamp',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log("Iniciando correção das políticas RLS para permission_groups...");

    // Remover todas as políticas existentes para evitar conflitos
    const { data: dropResult, error: dropError } = await supabaseAdmin
      .rpc('drop_policies_for_table', { table_name: 'permission_groups' });

    if (dropError) {
      console.error("Erro ao remover políticas existentes:", dropError);
      // Continuamos mesmo com erro, pois pode ser que não existam políticas ainda
    } else {
      console.log("Políticas existentes removidas com sucesso:", dropResult);
    }

    // Habilitar RLS na tabela
    const { error: enableRlsError } = await supabaseAdmin
      .rpc('execute_sql', { 
        sql: 'ALTER TABLE public.permission_groups ENABLE ROW LEVEL SECURITY;' 
      });

    if (enableRlsError) {
      console.error("Erro ao habilitar RLS:", enableRlsError);
      throw enableRlsError;
    }

    // Criar políticas RLS para SELECT
    const { error: selectPolicyError } = await supabaseAdmin
      .rpc('execute_sql', { 
        sql: `
          CREATE POLICY "Usuários autenticados podem ler grupos de permissão"
          ON public.permission_groups
          FOR SELECT
          USING (public.can_access_permission_groups());
        `
      });

    if (selectPolicyError) {
      console.error("Erro ao criar política SELECT:", selectPolicyError);
      throw selectPolicyError;
    }

    // Criar políticas RLS para INSERT
    const { error: insertPolicyError } = await supabaseAdmin
      .rpc('execute_sql', { 
        sql: `
          CREATE POLICY "Usuários autenticados podem criar grupos de permissão"
          ON public.permission_groups
          FOR INSERT
          WITH CHECK (public.can_access_permission_groups());
        `
      });

    if (insertPolicyError) {
      console.error("Erro ao criar política INSERT:", insertPolicyError);
      throw insertPolicyError;
    }

    // Criar políticas RLS para UPDATE
    const { error: updatePolicyError } = await supabaseAdmin
      .rpc('execute_sql', { 
        sql: `
          CREATE POLICY "Usuários autenticados podem atualizar grupos de permissão"
          ON public.permission_groups
          FOR UPDATE
          USING (public.can_access_permission_groups());
        `
      });

    if (updatePolicyError) {
      console.error("Erro ao criar política UPDATE:", updatePolicyError);
      throw updatePolicyError;
    }

    // Criar políticas RLS para DELETE
    const { error: deletePolicyError } = await supabaseAdmin
      .rpc('execute_sql', { 
        sql: `
          CREATE POLICY "Usuários autenticados podem excluir grupos de permissão"
          ON public.permission_groups
          FOR DELETE
          USING (public.can_access_permission_groups());
        `
      });

    if (deletePolicyError) {
      console.error("Erro ao criar política DELETE:", deletePolicyError);
      throw deletePolicyError;
    }

    console.log("Políticas RLS para permission_groups corrigidas com sucesso!");

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Políticas RLS para permission_groups corrigidas com sucesso!"
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Erro ao corrigir políticas:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Erro ao corrigir políticas RLS"
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500
      }
    );
  }
});
