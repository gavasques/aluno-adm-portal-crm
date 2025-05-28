
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { monthlyCredits } = await req.json();
    
    // Validar planos disponíveis
    const validPlans = [50, 100, 200];
    if (!validPlans.includes(monthlyCredits)) {
      throw new Error("Plano de assinatura inválido");
    }

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
    if (!user?.email) throw new Error("User not authenticated");

    // Preços mensais em centavos
    const priceMap = {
      50: 4000,   // R$ 40,00/mês (+50 créditos)
      100: 7000,  // R$ 70,00/mês (+100 créditos)
      200: 12000  // R$ 120,00/mês (+200 créditos)
    };

    const price = priceMap[monthlyCredits];

    // Para desenvolvimento, simular assinatura sem Stripe
    if (!Deno.env.get("STRIPE_SECRET_KEY")) {
      // Criar/atualizar assinatura demo
      await supabaseClient
        .from("credit_subscriptions")
        .upsert({
          user_id: user.id,
          monthly_credits: monthlyCredits,
          status: "active",
          next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          stripe_subscription_id: `demo_sub_${Date.now()}`
        });

      // Atualizar limite mensal
      await supabaseClient
        .from("user_credits")
        .update({
          monthly_limit: 50 + monthlyCredits, // limite base + créditos da assinatura
          subscription_type: `+${monthlyCredits}/mês`,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);

      await supabaseClient
        .from("credit_transactions")
        .insert({
          user_id: user.id,
          type: "assinatura",
          amount: monthlyCredits,
          description: `Assinatura de +${monthlyCredits} créditos/mês (DEMO)`,
          stripe_session_id: `demo_sub_${Date.now()}`
        });

      return new Response(JSON.stringify({
        success: true,
        demo: true,
        monthlyCredits,
        subscription: "active"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Integração real com Stripe (quando configurado)
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { 
              name: `Assinatura +${monthlyCredits} Créditos/mês`,
              description: `Assinatura recorrente de ${monthlyCredits} créditos mensais`
            },
            unit_amount: price,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/aluno/creditos?subscription=success`,
      cancel_url: `${req.headers.get("origin")}/aluno/creditos?subscription=cancelled`,
      metadata: {
        user_id: user.id,
        monthly_credits: monthlyCredits.toString(),
        type: "subscription"
      }
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in subscribe-credits:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
