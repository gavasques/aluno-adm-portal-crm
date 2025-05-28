
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
    const { credits } = await req.json();
    
    // Validar quantidade de créditos
    const validAmounts = [10, 20, 50, 100, 200, 500];
    if (!validAmounts.includes(credits)) {
      throw new Error("Quantidade de créditos inválida");
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

    // Preços em centavos (R$0,10 por crédito)
    const priceMap = {
      10: 1000,   // R$ 10,00
      20: 2000,   // R$ 20,00
      50: 4500,   // R$ 45,00 (10% desconto)
      100: 8000,  // R$ 80,00 (20% desconto)
      200: 14000, // R$ 140,00 (30% desconto)
      500: 30000  // R$ 300,00 (40% desconto)
    };

    const price = priceMap[credits];

    // Para desenvolvimento, simular compra sem Stripe
    if (!Deno.env.get("STRIPE_SECRET_KEY")) {
      // Simular compra bem-sucedida
      const { data: currentCredits } = await supabaseClient
        .from("user_credits")
        .select("current_credits")
        .eq("user_id", user.id)
        .single();

      const newTotal = (currentCredits?.current_credits || 0) + credits;

      await supabaseClient
        .from("user_credits")
        .update({
          current_credits: newTotal,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);

      await supabaseClient
        .from("credit_transactions")
        .insert({
          user_id: user.id,
          type: "compra",
          amount: credits,
          description: `Compra avulsa de ${credits} créditos (DEMO)`,
          stripe_session_id: `demo_${Date.now()}`
        });

      return new Response(JSON.stringify({
        success: true,
        demo: true,
        credits: newTotal,
        purchased: credits
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
              name: `${credits} Créditos`,
              description: `Compra avulsa de ${credits} créditos`
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/aluno/creditos?success=true`,
      cancel_url: `${req.headers.get("origin")}/aluno/creditos?cancelled=true`,
      metadata: {
        user_id: user.id,
        credits: credits.toString(),
        type: "purchase"
      }
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in purchase-credits:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
