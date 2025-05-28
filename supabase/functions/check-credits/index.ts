
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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    // Buscar créditos do usuário
    const { data: credits, error: creditsError } = await supabaseClient
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (creditsError) throw creditsError;

    // Buscar assinatura ativa
    const { data: subscription } = await supabaseClient
      .from("credit_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    // Buscar histórico de transações (últimas 50)
    const { data: transactions, error: transError } = await supabaseClient
      .from("credit_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (transError) throw transError;

    // Calcular percentual usado
    const usagePercentage = credits.monthly_limit > 0 
      ? Math.round((credits.used_this_month / credits.monthly_limit) * 100)
      : 0;

    return new Response(JSON.stringify({
      credits: {
        current: credits.current_credits,
        used: credits.used_this_month,
        limit: credits.monthly_limit,
        renewalDate: credits.renewal_date,
        usagePercentage
      },
      subscription,
      transactions,
      alerts: {
        lowCredits: usagePercentage >= 90,
        noCredits: credits.current_credits <= 0
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in check-credits:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
