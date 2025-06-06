
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔍 Verificando pagamento...");
    
    if (req.method !== "POST") {
      throw new Error("Método não permitido");
    }

    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      console.error("❌ Erro ao parsear JSON:", e);
      throw new Error("Dados inválidos no corpo da requisição");
    }

    const { session_id } = requestBody;
    console.log("📋 Session ID recebido:", session_id);

    if (!session_id) {
      throw new Error("Session ID é obrigatório");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verificar autenticação
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Usuário não autenticado");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Token inválido");
    }

    const user = userData.user;

    // Verificar se já processamos esta sessão
    const { data: existingTransaction } = await supabaseClient
      .from("credit_transactions")
      .select("id, amount, status")
      .eq("stripe_session_id", session_id)
      .eq("user_id", user.id)
      .single();

    if (existingTransaction) {
      console.log("ℹ️ Transação já existe:", existingTransaction);
      return new Response(JSON.stringify({
        success: true,
        already_processed: true,
        credits_added: existingTransaction.amount,
        status: existingTransaction.status
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Consultar Stripe para verificar status
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe não configurado");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("📊 Status da sessão Stripe:", session.payment_status);

    if (session.payment_status === "paid") {
      // Extrair metadados
      const metadata = session.metadata;
      if (!metadata?.credits || !metadata?.package_id) {
        throw new Error("Metadados ausentes na sessão");
      }

      const credits = parseInt(metadata.credits);
      const packageId = metadata.package_id;

      // Buscar créditos atuais
      const { data: userCredits, error: creditsError } = await supabaseClient
        .from("user_credits")
        .select("current_credits")
        .eq("user_id", user.id)
        .single();

      if (creditsError) {
        throw new Error("Erro ao buscar créditos do usuário");
      }

      const currentCredits = userCredits?.current_credits || 0;
      const newCredits = currentCredits + credits;

      // Atualizar créditos
      const { error: updateError } = await supabaseClient
        .from("user_credits")
        .update({ 
          current_credits: newCredits,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);

      if (updateError) {
        throw new Error("Erro ao atualizar créditos");
      }

      // Registrar transação
      const { error: transactionError } = await supabaseClient
        .from("credit_transactions")
        .insert({
          user_id: user.id,
          type: "compra",
          amount: credits,
          description: `Compra de ${credits} créditos via Stripe (verificação manual)`,
          stripe_session_id: session_id,
          stripe_payment_intent_id: session.payment_intent,
          package_id: packageId,
          status: "completed"
        });

      if (transactionError) {
        throw new Error("Erro ao registrar transação");
      }

      console.log("✅ Pagamento verificado e créditos adicionados:", { credits, newCredits });

      return new Response(JSON.stringify({
        success: true,
        payment_verified: true,
        credits_added: credits,
        new_total: newCredits
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else {
      console.log("⚠️ Pagamento não confirmado:", session.payment_status);
      
      return new Response(JSON.stringify({
        success: false,
        payment_status: session.payment_status,
        message: "Pagamento não foi confirmado"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

  } catch (error) {
    console.error("❌ Erro em verify-payment:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
