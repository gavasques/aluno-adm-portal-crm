
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
    console.log("Iniciando check-credits...");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    
    if (!user?.id) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }

    console.log("Usuário autenticado:", user.id);

    // Buscar ou criar registro de créditos do usuário
    let { data: userCredits, error: creditsError } = await supabaseClient
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (creditsError && creditsError.code === "PGRST116") {
      // Usuário não tem registro de créditos, criar um novo
      console.log("Criando registro de créditos para usuário:", user.id);
      
      const renewalDate = new Date();
      renewalDate.setMonth(renewalDate.getMonth() + 1);
      renewalDate.setDate(1); // Primeiro dia do próximo mês
      
      const { data: newCredits, error: createError } = await supabaseClient
        .from("user_credits")
        .insert({
          user_id: user.id,
          current_credits: 50,
          monthly_limit: 50,
          used_this_month: 0,
          renewal_date: renewalDate.toISOString().split('T')[0],
          subscription_type: null
        })
        .select()
        .single();

      if (createError) {
        console.error("Erro ao criar créditos:", createError);
        throw createError;
      }
      
      userCredits = newCredits;
    } else if (creditsError) {
      console.error("Erro ao buscar créditos:", creditsError);
      throw creditsError;
    }

    console.log("Créditos encontrados:", userCredits);

    // Buscar assinatura ativa
    const { data: subscription } = await supabaseClient
      .from("credit_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    // Buscar histórico de transações (últimas 10)
    const { data: transactions } = await supabaseClient
      .from("credit_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

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

    console.log("Resposta enviada:", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in check-credits:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
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
      status: 200, // Retorna 200 mesmo com erro para evitar crash do frontend
    });
  }
});
