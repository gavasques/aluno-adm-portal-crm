
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
    console.log("🚀 Iniciando purchase-credits function");
    
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

    const { credits } = requestBody;
    console.log("📋 Dados recebidos:", { credits });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Buscar pacote correspondente (incluindo stripe_price_id)
    const { data: creditPackage, error: packageError } = await supabaseClient
      .from("credit_packages")
      .select("*")
      .eq("credits", credits)
      .eq("is_active", true)
      .single();

    if (packageError || !creditPackage) {
      console.log("⚠️ Pacote não encontrado, retornando modo demo");
      return new Response(JSON.stringify({ 
        success: true,
        demo: true,
        credits: credits || 10,
        message: `Compra simulada realizada: ${credits || 10} créditos! (Modo demonstração - pacote não configurado)`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Verificar autenticação
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("⚠️ Sem token de autorização, retornando modo demo");
      return new Response(JSON.stringify({
        success: true,
        demo: true,
        credits: credits,
        message: `Compra simulada realizada: ${credits} créditos! (Modo demonstração - sem autenticação)`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Verificar se o Stripe está configurado
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey || stripeKey === "" || stripeKey === "your_stripe_secret_key_here") {
      console.log("⚠️ Stripe não configurado, retornando modo demo");
      return new Response(JSON.stringify({
        success: true,
        demo: true,
        credits: credits,
        message: `Compra simulada realizada: ${credits} créditos! (Modo demonstração - Stripe não configurado)`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("🔐 Verificando autenticação do usuário");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user?.email) {
      console.log("⚠️ Usuário não autenticado, retornando modo demo");
      return new Response(JSON.stringify({ 
        success: true,
        demo: true,
        credits: credits,
        message: `Compra simulada realizada: ${credits} créditos! (Modo demonstração - erro de autenticação)`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const user = userData.user;
    console.log("👤 Usuário autenticado:", user.email);

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Verificar se o cliente já existe no Stripe
    console.log("🔍 Verificando cliente existente no Stripe");
    const customers = await stripe.customers.list({ 
      email: user.email, 
      limit: 1 
    });

    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("👤 Cliente existente encontrado:", customerId);
    } else {
      console.log("🆕 Cliente será criado no checkout");
    }

    const origin = req.headers.get("origin") || "https://id-preview--615752d4-0ad0-4fbd-9977-45d5385af67b.lovable.app";
    console.log("🌐 Origin:", origin);

    console.log("🛒 Criando sessão de checkout");

    // Metadados melhorados para o webhook
    const metadata = {
      user_id: user.id,
      user_email: user.email,
      credits: credits.toString(),
      package_id: creditPackage.id,
      type: "purchase",
      timestamp: new Date().toISOString()
    };

    let sessionConfig: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      mode: "payment",
      success_url: `${origin}/aluno/creditos/sucesso?session_id={CHECKOUT_SESSION_ID}&credits=${credits}`,
      cancel_url: `${origin}/aluno/creditos/cancelado`,
      metadata: metadata
    };

    // Se o pacote tem stripe_price_id configurado, usar o Price ID do Stripe
    if (creditPackage.stripe_price_id) {
      console.log("💳 Usando Stripe Price ID pré-configurado:", creditPackage.stripe_price_id);
      sessionConfig.line_items = [
        {
          price: creditPackage.stripe_price_id,
          quantity: 1,
        }
      ];
    } else {
      // Fallback: criar preço dinamicamente como antes
      console.log("🔧 Criando preço dinamicamente");
      const price = Math.round(parseFloat(creditPackage.price.toString()) * 100);
      console.log("💰 Preço do pacote:", { credits, price: price / 100 });
      
      sessionConfig.line_items = [
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
        }
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log("✅ Sessão de checkout criada:", session.id);

    // Registrar sessão pendente na base de dados
    try {
      await supabaseClient
        .from("credit_transactions")
        .insert({
          user_id: user.id,
          type: "compra",
          amount: credits,
          description: `Compra de ${credits} créditos - Aguardando confirmação`,
          stripe_session_id: session.id,
          package_id: creditPackage.id,
          status: "pending"
        });
      console.log("📝 Transação pendente registrada");
    } catch (err) {
      console.error("⚠️ Erro ao registrar transação pendente:", err);
      // Não bloquear o fluxo por causa disso
    }

    return new Response(JSON.stringify({ 
      success: true,
      url: session.url,
      session_id: session.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("❌ Erro em purchase-credits:", error);
    
    // Sempre retornar um modo demo funcional em caso de erro
    return new Response(JSON.stringify({ 
      success: true,
      demo: true,
      credits: 10,
      message: `Compra simulada realizada: 10 créditos! (Modo demonstração - erro: ${error.message})`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
