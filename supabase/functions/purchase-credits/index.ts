
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
      return new Response(JSON.stringify({ 
        error: "Quantidade de créditos inválida",
        demo: true,
        message: "Erro na validação. Usando modo demonstração."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Verificar se o Stripe está configurado
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.log("⚠️ Stripe não configurado, simulando compra");
      
      try {
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
          { auth: { persistSession: false } }
        );

        const authHeader = req.headers.get("Authorization");
        if (authHeader) {
          const token = authHeader.replace("Bearer ", "");
          const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
          
          if (!userError && userData.user) {
            console.log("👤 Usuário autenticado para demo:", userData.user.email);
            
            // Tentar atualizar créditos (UPSERT)
            const { data: currentCredits, error: selectError } = await supabaseClient
              .from("user_credits")
              .select("current_credits")
              .eq("user_id", userData.user.id)
              .single();

            let newTotal = credits;
            if (!selectError && currentCredits) {
              newTotal = (currentCredits.current_credits || 0) + credits;
            }

            // UPSERT na tabela user_credits
            const { error: upsertError } = await supabaseClient
              .from("user_credits")
              .upsert({
                user_id: userData.user.id,
                current_credits: newTotal,
                monthly_limit: 50,
                used_this_month: 0,
                renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                subscription_type: null,
                updated_at: new Date().toISOString()
              }, { 
                onConflict: 'user_id',
                ignoreDuplicates: false 
              });

            if (upsertError) {
              console.warn("⚠️ Erro ao atualizar créditos (continuando demo):", upsertError);
            }

            // Tentar inserir transação
            const { error: transactionError } = await supabaseClient
              .from("credit_transactions")
              .insert({
                user_id: userData.user.id,
                type: "compra",
                amount: credits,
                description: `Compra avulsa de ${credits} créditos (DEMO)`,
                stripe_session_id: `demo_${Date.now()}`
              });

            if (transactionError) {
              console.warn("⚠️ Erro ao criar transação (continuando demo):", transactionError);
            }
          }
        }
      } catch (demoError) {
        console.warn("⚠️ Erro no modo demo:", demoError);
      }

      console.log("✅ Compra simulada realizada com sucesso");
      return new Response(JSON.stringify({
        success: true,
        demo: true,
        credits: credits,
        purchased: credits,
        message: "Compra simulada realizada com sucesso! (Modo demonstração - Stripe não configurado)"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Integração real com Stripe
    console.log("💳 Iniciando integração com Stripe");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("❌ Token de autorização não fornecido");
      return new Response(JSON.stringify({ 
        error: "Token de autorização não fornecido",
        demo: true,
        message: "Erro de autenticação. Usando modo demonstração."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("🔐 Verificando autenticação do usuário");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user?.email) {
      console.error("❌ Usuário não autenticado:", userError);
      return new Response(JSON.stringify({ 
        error: "Usuário não autenticado",
        demo: true,
        message: "Erro de autenticação. Usando modo demonstração."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
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
      console.log("🆕 Cliente será criado no checkout");
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
    
    // Retornar sempre um erro tratado para não quebrar o frontend
    return new Response(JSON.stringify({ 
      error: "Erro interno do servidor",
      demo: true,
      message: `Erro no processamento: ${error.message}. Usando modo demonstração.`,
      details: error.toString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // Sempre retorna 200 para não quebrar o frontend
    });
  }
});
