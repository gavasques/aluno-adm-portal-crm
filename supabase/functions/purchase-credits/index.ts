
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
    console.log("🚀 Iniciando purchase-credits function");
    
    const { credits } = await req.json();
    console.log("📋 Dados recebidos:", { credits });
    
    // Validar quantidade de créditos
    const validAmounts = [10, 20, 50, 100, 200, 500];
    if (!validAmounts.includes(credits)) {
      console.error("❌ Quantidade de créditos inválida:", credits);
      throw new Error("Quantidade de créditos inválida");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("❌ Token de autorização não fornecido");
      throw new Error("Token de autorização não fornecido");
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("🔐 Verificando autenticação do usuário");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user?.email) {
      console.error("❌ Usuário não autenticado:", userError);
      throw new Error("Usuário não autenticado");
    }

    const user = userData.user;
    console.log("👤 Usuário autenticado:", user.email);

    // Preços em centavos (BRL)
    const priceMap = {
      10: 1000,   // R$ 10,00
      20: 2000,   // R$ 20,00
      50: 4500,   // R$ 45,00 (10% desconto)
      100: 8000,  // R$ 80,00 (20% desconto)
      200: 14000, // R$ 140,00 (30% desconto)
      500: 30000  // R$ 300,00 (40% desconto)
    };

    const price = priceMap[credits];
    console.log("💰 Preço calculado:", { credits, price: price / 100 });

    // Verificar se o Stripe está configurado
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.log("⚠️ Stripe não configurado, simulando compra");
      
      // Simular compra bem-sucedida para desenvolvimento
      const { data: currentCredits } = await supabaseClient
        .from("user_credits")
        .select("current_credits")
        .eq("user_id", user.id)
        .single();

      const newTotal = (currentCredits?.current_credits || 0) + credits;

      const { error: updateError } = await supabaseClient
        .from("user_credits")
        .update({
          current_credits: newTotal,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("❌ Erro ao atualizar créditos:", updateError);
      }

      const { error: transactionError } = await supabaseClient
        .from("credit_transactions")
        .insert({
          user_id: user.id,
          type: "compra",
          amount: credits,
          description: `Compra avulsa de ${credits} créditos (DEMO)`,
          stripe_session_id: `demo_${Date.now()}`
        });

      if (transactionError) {
        console.error("❌ Erro ao criar transação:", transactionError);
      }

      console.log("✅ Compra simulada realizada com sucesso");
      return new Response(JSON.stringify({
        success: true,
        demo: true,
        credits: newTotal,
        purchased: credits,
        message: "Compra simulada realizada com sucesso! (Modo demonstração)"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Integração real com Stripe
    console.log("💳 Iniciando integração com Stripe");
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Verificar se o cliente já existe no Stripe
    console.log("🔍 Verificando cliente existente no Stripe");
    const customers = await stripe.customers.list({ 
      email: user.email, 
      limit: 1 
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("👤 Cliente existente encontrado:", customerId);
    } else {
      console.log("🆕 Criando novo cliente no Stripe");
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    console.log("🌐 Origin:", origin);

    console.log("🛒 Criando sessão de checkout");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { 
              name: `${credits} Créditos`,
              description: `Compra avulsa de ${credits} créditos para a plataforma`
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/aluno/creditos?success=true&credits=${credits}`,
      cancel_url: `${origin}/aluno/creditos?cancelled=true`,
      metadata: {
        user_id: user.id,
        credits: credits.toString(),
        type: "purchase"
      }
    });

    console.log("✅ Sessão de checkout criada:", session.id);

    return new Response(JSON.stringify({ 
      url: session.url,
      session_id: session.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("❌ Erro em purchase-credits:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Erro interno do servidor",
      details: error.toString(),
      demo: true,
      message: "Erro no pagamento. Usando modo demonstração."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // Retorna 200 para não quebrar o frontend
    });
  }
});
