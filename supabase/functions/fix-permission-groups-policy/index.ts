
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

    // Primeiro, remover todas as políticas existentes para evitar conflitos
    const { error: dropPoliciesError } = await supabaseAdmin.rpc('drop_policies_for_table', {
      table_name: 'permission_groups'
    });

    if (dropPoliciesError) {
      console.error("Erro ao remover políticas existentes:", dropPoliciesError);
      // Continuar mesmo com erro, pois pode ser que as políticas não existam ainda
    }

    // Criar uma função de segurança definida para verificar acesso aos grupos de permissão
    const { error: createFunctionError } = await supabaseAdmin.rpc('execute_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION public.can_access_permission_groups()
        RETURNS BOOLEAN
        LANGUAGE sql
        SECURITY DEFINER
        AS $$
          -- Verificar se o usuário está autenticado
          SELECT auth.uid() IS NOT NULL;
        $$;
      `
    });

    if (createFunctionError) {
      console.error("Erro ao criar função de segurança:", createFunctionError);
      throw createFunctionError;
    }

    // Criar políticas RLS adequadas para a tabela permission_groups
    const { error: createPoliciesError } = await supabaseAdmin.rpc('execute_sql', {
      sql: `
        -- Ativar RLS na tabela permission_groups
        ALTER TABLE public.permission_groups ENABLE ROW LEVEL SECURITY;
        
        -- Política para SELECT (leitura)
        CREATE POLICY "Usuários autenticados podem ler grupos de permissão"
        ON public.permission_groups
        FOR SELECT
        USING (public.can_access_permission_groups());
        
        -- Política para INSERT (inserção)
        CREATE POLICY "Usuários autenticados podem criar grupos de permissão"
        ON public.permission_groups
        FOR INSERT
        WITH CHECK (public.can_access_permission_groups());
        
        -- Política para UPDATE (atualização)
        CREATE POLICY "Usuários autenticados podem atualizar grupos de permissão"
        ON public.permission_groups
        FOR UPDATE
        USING (public.can_access_permission_groups());
        
        -- Política para DELETE (exclusão)
        CREATE POLICY "Usuários autenticados podem excluir grupos de permissão"
        ON public.permission_groups
        FOR DELETE
        USING (public.can_access_permission_groups());
      `
    });

    if (createPoliciesError) {
      console.error("Erro ao criar políticas RLS:", createPoliciesError);
      throw createPoliciesError;
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
