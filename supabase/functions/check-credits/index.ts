
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔍 Iniciando check-credits function");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Token de autorização não fornecido");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user?.email) {
      throw new Error("Usuário não autenticado");
    }

    const user = userData.user;
    console.log("👤 Usuário autenticado:", user.email);

    // Verificar ou criar registro de créditos do usuário
    let { data: credits, error: creditsError } = await supabaseClient
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (creditsError && creditsError.code === 'PGRST116') {
      // Usuário não existe, criar com créditos padrão
      console.log("🆕 Criando registro de créditos para novo usuário");
      const { data: newCredits, error: insertError } = await supabaseClient
        .from("user_credits")
        .insert({
          user_id: user.id,
          current_credits: 50,
          monthly_limit: 50,
          used_this_month: 0,
          last_reset: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(`Erro ao criar créditos: ${insertError.message}`);
      }
      credits = newCredits;
    } else if (creditsError) {
      throw new Error(`Erro ao buscar créditos: ${creditsError.message}`);
    }

    // Buscar transações recentes
    const { data: transactions } = await supabaseClient
      .from("credit_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // Buscar assinatura (se houver)
    const { data: subscription } = await supabaseClient
      .from("credit_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    // Calcular porcentagem de uso
    const usagePercentage = (credits.used_this_month / credits.monthly_limit) * 100;

    // Verificar alertas
    const alerts = {
      lowCredits: usagePercentage >= 90 && credits.current_credits > 0,
      noCredits: credits.current_credits <= 0
    };

    console.log("✅ Dados de créditos processados com sucesso:", {
      current: credits.current_credits,
      used: credits.used_this_month,
      limit: credits.monthly_limit,
      usagePercentage: Math.round(usagePercentage)
    });

    return new Response(JSON.stringify({
      credits: {
        current: credits.current_credits,
        used: credits.used_this_month,
        limit: credits.monthly_limit,
        renewalDate: credits.last_reset,
        usagePercentage: Math.round(usagePercentage)
      },
      subscription,
      transactions: transactions || [],
      alerts
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("❌ Erro em check-credits:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Erro interno do servidor",
      credits: {
        current: 0,
        used: 0,
        limit: 50,
        renewalDate: new Date().toISOString().split('T')[0],
        usagePercentage: 0
      },
      subscription: null,
      transactions: [],
      alerts: {
        lowCredits: false,
        noCredits: true
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // Retorna 200 mesmo com erro para evitar quebrar o frontend
    });
  }
});
