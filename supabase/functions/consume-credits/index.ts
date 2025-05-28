
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
    const { amount = 1, description = "Uso de funcionalidade" } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    // Verificar créditos disponíveis
    const { data: credits, error: creditsError } = await supabaseClient
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (creditsError) throw creditsError;

    if (credits.current_credits < amount) {
      return new Response(JSON.stringify({ 
        error: "Créditos insuficientes",
        currentCredits: credits.current_credits,
        required: amount
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Consumir créditos
    const { error: updateError } = await supabaseClient
      .from("user_credits")
      .update({
        current_credits: credits.current_credits - amount,
        used_this_month: credits.used_this_month + amount,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", user.id);

    if (updateError) throw updateError;

    // Registrar transação
    const { error: transError } = await supabaseClient
      .from("credit_transactions")
      .insert({
        user_id: user.id,
        type: "uso",
        amount: -amount,
        description
      });

    if (transError) throw transError;

    return new Response(JSON.stringify({
      success: true,
      remainingCredits: credits.current_credits - amount,
      consumed: amount
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in consume-credits:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
