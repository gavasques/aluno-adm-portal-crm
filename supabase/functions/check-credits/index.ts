
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
    console.log("🔍 Iniciando check-credits...");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("❌ No authorization header");
      return new Response(
        JSON.stringify({ 
          error: "Token de autorização não fornecido",
          credits: { current: 0, used: 0, limit: 50, renewalDate: new Date().toISOString().split('T')[0], usagePercentage: 0 },
          subscription: null,
          transactions: [],
          alerts: { lowCredits: false, noCredits: true }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user?.id) {
      console.error("❌ User not authenticated:", userError);
      return new Response(
        JSON.stringify({ 
          error: "Usuário não autenticado",
          credits: { current: 0, used: 0, limit: 50, renewalDate: new Date().toISOString().split('T')[0], usagePercentage: 0 },
          subscription: null,
          transactions: [],
          alerts: { lowCredits: false, noCredits: true }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const userId = userData.user.id;
    console.log("✅ Usuário autenticado:", userId);

    // Garantir que o usuário tem registro de créditos
    const { error: ensureError } = await supabaseClient.rpc('ensure_user_credits', {
      target_user_id: userId
    });
    
    if (ensureError) {
      console.error("⚠️ Erro ao garantir créditos:", ensureError);
    }

    // Buscar créditos do usuário
    const { data: userCredits, error: creditsError } = await supabaseClient
      .from("user_credits")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (creditsError) {
      console.error("❌ Erro ao buscar créditos:", creditsError);
      // Retornar dados padrão ao invés de falhar
      return new Response(
        JSON.stringify({ 
          error: "Erro ao buscar créditos no banco de dados",
          credits: { current: 0, used: 0, limit: 50, renewalDate: new Date().toISOString().split('T')[0], usagePercentage: 0 },
          subscription: null,
          transactions: [],
          alerts: { lowCredits: false, noCredits: true }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    console.log("📊 Créditos encontrados:", userCredits);

    // Buscar assinatura ativa
    const { data: subscription } = await supabaseClient
      .from("credit_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    // Buscar histórico de transações
    const { data: transactions } = await supabaseClient
      .from("credit_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    // Calcular percentual de uso
    const usagePercentage = userCredits.monthly_limit > 0 
      ? Math.round((userCredits.used_this_month / userCredits.monthly_limit) * 100)
      : 0;

    // Verificar alertas
    const alerts = {
      lowCredits: usagePercentage >= 90 && userCredits.current_credits > 0,
      noCredits: userCredits.current_credits <= 0
    };

    const response = {
      credits: {
        current: userCredits.current_credits,
        used: userCredits.used_this_month,
        limit: userCredits.monthly_limit,
        renewalDate: userCredits.renewal_date,
        usagePercentage
      },
      subscription: subscription || null,
      transactions: transactions || [],
      alerts
    };

    console.log("✅ Resposta enviada com sucesso");

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error in check-credits:", error);
    
    // Sempre retornar dados padrão para evitar crash do frontend
    const errorResponse = {
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
    };

    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
