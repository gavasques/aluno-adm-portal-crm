
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔔 Webhook Stripe recebido");

    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeKey || !webhookSecret) {
      console.error("❌ Chaves do Stripe não configuradas");
      return new Response("Server configuration error", { status: 500 });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("❌ Assinatura do webhook ausente");
      return new Response("No signature", { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("✅ Evento do webhook verificado:", event.type);
    } catch (err) {
      console.error("❌ Erro na verificação do webhook:", err.message);
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verificar se já processamos este evento (idempotência)
    const { data: existingEvent } = await supabaseClient
      .from("stripe_webhook_events")
      .select("id")
      .eq("stripe_event_id", event.id)
      .single();

    if (existingEvent) {
      console.log("⚠️ Evento já processado:", event.id);
      return new Response("Event already processed", { status: 200 });
    }

    // Registrar o evento
    const { error: eventError } = await supabaseClient
      .from("stripe_webhook_events")
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        processed: false
      });

    if (eventError) {
      console.error("❌ Erro ao registrar evento:", eventError);
    }

    // Processar diferentes tipos de eventos
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, supabaseClient);
        break;
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent, supabaseClient);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent, supabaseClient);
        break;
      default:
        console.log("ℹ️ Tipo de evento não processado:", event.type);
    }

    // Marcar evento como processado
    await supabaseClient
      .from("stripe_webhook_events")
      .update({ 
        processed: true, 
        processed_at: new Date().toISOString() 
      })
      .eq("stripe_event_id", event.id);

    return new Response("Webhook processed successfully", { 
      status: 200,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error("❌ Erro geral no webhook:", error);
    return new Response(`Webhook error: ${error.message}`, { 
      status: 500,
      headers: corsHeaders 
    });
  }
});

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, supabaseClient: any) {
  console.log("💳 Processando checkout completado:", session.id);

  try {
    const metadata = session.metadata;
    if (!metadata?.user_id || !metadata?.credits || !metadata?.package_id) {
      console.error("❌ Metadados ausentes na sessão:", session.id);
      return;
    }

    const userId = metadata.user_id;
    const credits = parseInt(metadata.credits);
    const packageId = metadata.package_id;

    console.log("📊 Dados extraídos:", { userId, credits, packageId });

    // Buscar créditos atuais do usuário
    const { data: userCredits, error: creditsError } = await supabaseClient
      .from("user_credits")
      .select("current_credits")
      .eq("user_id", userId)
      .single();

    if (creditsError) {
      console.error("❌ Erro ao buscar créditos do usuário:", creditsError);
      return;
    }

    const currentCredits = userCredits?.current_credits || 0;
    const newCredits = currentCredits + credits;

    // Atualizar créditos do usuário
    const { error: updateError } = await supabaseClient
      .from("user_credits")
      .update({ 
        current_credits: newCredits,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("❌ Erro ao atualizar créditos:", updateError);
      return;
    }

    // Registrar transação
    const { error: transactionError } = await supabaseClient
      .from("credit_transactions")
      .insert({
        user_id: userId,
        type: "compra",
        amount: credits,
        description: `Compra de ${credits} créditos via Stripe`,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        package_id: packageId,
        status: "completed"
      });

    if (transactionError) {
      console.error("❌ Erro ao registrar transação:", transactionError);
      return;
    }

    // Atualizar evento com sucesso
    await supabaseClient
      .from("stripe_webhook_events")
      .update({
        user_id: userId,
        credits_added: credits,
        session_id: session.id
      })
      .eq("stripe_event_id", session.id);

    console.log("✅ Créditos adicionados com sucesso:", { userId, credits: newCredits });

  } catch (error) {
    console.error("❌ Erro ao processar checkout:", error);
    
    // Registrar erro no evento
    await supabaseClient
      .from("stripe_webhook_events")
      .update({
        error_message: error.message,
        retry_count: 1
      })
      .eq("stripe_event_id", session.id);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent, supabaseClient: any) {
  console.log("✅ Payment Intent bem-sucedido:", paymentIntent.id);
  // Lógica adicional se necessário
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent, supabaseClient: any) {
  console.log("❌ Payment Intent falhou:", paymentIntent.id);
  
  // Registrar falha
  await supabaseClient
    .from("stripe_webhook_events")
    .update({
      error_message: "Payment failed",
      processed: true,
      processed_at: new Date().toISOString()
    })
    .eq("stripe_event_id", paymentIntent.id);
}
