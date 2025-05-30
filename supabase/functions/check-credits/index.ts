
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
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user?.id) {
      console.error("❌ User not authenticated:", userError);
      throw new Error("User not authenticated");
    }

    const userId = userData.user.id;
    console.log("✅ Usuário autenticado:", userId);
    console.log("📧 Email do usuário:", userData.user.email);

    // Forçar recriação do registro se necessário
    const { error: ensureError } = await supabaseClient.rpc('ensure_user_credits', {
      target_user_id: userId
    });
    
    if (ensureError) {
      console.error("⚠️ Erro ao garantir créditos (continuando):", ensureError);
    } else {
      console.log("✅ Registro de créditos garantido");
    }

    // Buscar créditos do usuário com logs detalhados
    const { data: userCredits, error: creditsError } = await supabaseClient
      .from("user_credits")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (creditsError) {
      console.error("❌ Erro ao buscar créditos:", creditsError);
      throw creditsError;
    }

    console.log("📊 Créditos encontrados:", {
      current_credits: userCredits.current_credits,
      monthly_limit: userCredits.monthly_limit,
      used_this_month: userCredits.used_this_month,
      renewal_date: userCredits.renewal_date
    });

    // Buscar assinatura ativa
    const { data: subscription, error: subError } = await supabaseClient
      .from("credit_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (subError) {
      console.error("⚠️ Erro ao buscar assinatura:", subError);
    }

    console.log("💳 Assinatura encontrada:", subscription);

    // Buscar histórico de transações (últimas 20 para debug)
    const { data: transactions, error: transError } = await supabaseClient
      .from("credit_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (transError) {
      console.error("⚠️ Erro ao buscar transações:", transError);
    }

    console.log("📝 Transações encontradas:", transactions?.length || 0);
    if (transactions && transactions.length > 0) {
      console.log("🔍 Últimas 3 transações:", transactions.slice(0, 3));
    }

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
      alerts,
      debug: {
        userId,
        userEmail: userData.user.email,
        timestamp: new Date().toISOString()
      }
    };

    console.log("✅ Resposta final:", {
      current_credits: response.credits.current,
      transactions_count: response.transactions.length,
      has_subscription: !!response.subscription
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error in check-credits:", error);
    
    // Retornar dados padrão com erro para não quebrar o frontend
    const errorResponse = {
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
      },
      debug: {
        error: error.message,
        timestamp: new Date().toISOString()
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // Retorna 200 para evitar crash do frontend
    });
  }
});
