
import { serve } from "https://deno.land/std@0.202.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info, cache-control, x-timestamp",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Criar cliente Supabase com token service_role para ter permissões admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Criar função SQL para obter grupos de permissão sem enfrentar RLS
    const { error } = await supabaseAdmin.rpc('execute_sql', {
      sql: `
        -- Criar função para obter todos os grupos de permissão
        CREATE OR REPLACE FUNCTION get_permission_groups()
        RETURNS SETOF permission_groups
        LANGUAGE sql
        SECURITY DEFINER
        SET search_path = public
        AS $$
          SELECT * FROM permission_groups;
        $$;

        -- Função auxiliar para verificar se o usuário atual é admin
        CREATE OR REPLACE FUNCTION is_admin()
        RETURNS boolean
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = public
        AS $$
        BEGIN
          RETURN EXISTS (
            SELECT 1
            FROM permission_groups pg
            JOIN profiles p ON p.permission_group_id = pg.id
            WHERE p.id = auth.uid() AND pg.is_admin = true
          );
        END;
        $$;
      `
    });

    if (error) {
      console.error('Erro ao criar funções auxiliares:', error);
      return new Response(
        JSON.stringify({
          error: `Erro ao criar funções auxiliares: ${error.message}`
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500
        }
      );
    }

    // Atualizar políticas RLS para permission_groups
    const { error: policyError } = await supabaseAdmin.rpc('execute_sql', {
      sql: `
        -- Remover políticas existentes que podem estar causando recursão
        DROP POLICY IF EXISTS "Admins can manage permission groups" ON permission_groups;
        
        -- Adicionar nova política usando a função de segurança
        CREATE POLICY "Admins can manage permission groups"
        ON permission_groups
        USING (is_admin() OR auth.uid() = '00000000-0000-0000-0000-000000000000');
      `
    });

    if (policyError) {
      console.error('Erro ao atualizar políticas RLS:', policyError);
      return new Response(
        JSON.stringify({
          error: `Erro ao atualizar políticas RLS: ${policyError.message}`
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Funções auxiliares criadas com sucesso"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error('Erro não tratado:', error);
    return new Response(
      JSON.stringify({
        error: `Erro não tratado: ${error.message}`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
