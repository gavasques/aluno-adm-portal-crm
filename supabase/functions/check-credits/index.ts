
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔍 Iniciando check-credits function");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Buscar configurações do sistema
    const { data: settingsData, error: settingsError } = await supabaseClient
      .from("system_credit_settings")
      .select("setting_key, setting_value, setting_type");

    let defaultFreeCredits = 50;
    let lowCreditThreshold = 10;

    if (!settingsError && settingsData) {
      const monthlyFreeSetting = settingsData.find(s => s.setting_key === 'monthly_free_credits');
      if (monthlyFreeSetting) {
        defaultFreeCredits = parseInt(monthlyFreeSetting.setting_value);
      }
      
      const thresholdSetting = settingsData.find(s => s.setting_key === 'low_credit_threshold');
      if (thresholdSetting) {
        lowCreditThreshold = parseInt(thresholdSetting.setting_value);
      }
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("⚠️ Sem token de autorização, retornando dados padrão");
      return new Response(JSON.stringify({
        credits: {
          current: defaultFreeCredits,
          used: 0,
          limit: defaultFreeCredits,
          renewalDate: new Date().toISOString().split('T')[0],
          usagePercentage: 0
        },
        subscription: null,
        transactions: [],
        alerts: {
          lowCredits: false,
          noCredits: false
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user?.email) {
      console.log("⚠️ Usuário não autenticado, retornando dados padrão");
      return new Response(JSON.stringify({
        credits: {
          current: defaultFreeCredits,
          used: 0,
          limit: defaultFreeCredits,
          renewalDate: new Date().toISOString().split('T')[0],
          usagePercentage: 0
        },
        subscription: null,
        transactions: [],
        alerts: {
          lowCredits: false,
          noCredits: false
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const user = userData.user;
    console.log("👤 Usuário autenticado:", user.email);

    // Verificar ou criar registro de créditos do usuário
    let { data: credits, error: creditsError } = await supabaseClient
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (creditsError && creditsError.code === 'PGRST116') {
      // Usuário não existe, criar com créditos padrão baseado nas configurações
      console.log("🆕 Criando registro de créditos para novo usuário");
      const { data: newCredits, error: insertError } = await supabaseClient
        .from("user_credits")
        .insert({
          user_id: user.id,
          current_credits: defaultFreeCredits,
          monthly_limit: defaultFreeCredits,
          used_this_month: 0,
          renewal_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (insertError) {
        console.error("❌ Erro ao criar créditos:", insertError);
        // Retornar dados padrão em caso de erro
        return new Response(JSON.stringify({
          credits: {
            current: defaultFreeCredits,
            used: 0,
            limit: defaultFreeCredits,
            renewalDate: new Date().toISOString().split('T')[0],
            usagePercentage: 0
          },
          subscription: null,
          transactions: [],
          alerts: {
            lowCredits: false,
            noCredits: false
          }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      credits = newCredits;
    } else if (creditsError) {
      console.error("❌ Erro ao buscar créditos:", creditsError);
      // Retornar dados padrão em caso de erro
      return new Response(JSON.stringify({
        credits: {
          current: 0,
          used: 0,
          limit: defaultFreeCredits,
          renewalDate: new Date().toISOString().split('T')[0],
          usagePercentage: 0
        },
        subscription: null,
        transactions: [],
        alerts: {
          lowCredits: false,
          noCredits: true
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Buscar transações recentes
    const { data: transactions } = await supabaseClient
      .from("credit_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // Buscar assinatura (se houver)
    const { data: subscription } = await supabaseClient
      .from("credit_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    // Calcular porcentagem de uso
    const usagePercentage = credits.monthly_limit > 0 ? (credits.used_this_month / credits.monthly_limit) * 100 : 0;

    // Verificar alertas usando configurações dinâmicas
    const alerts = {
      lowCredits: credits.current_credits <= lowCreditThreshold && credits.current_credits > 0,
      noCredits: credits.current_credits <= 0
    };

    console.log("✅ Dados de créditos processados com sucesso:", {
      current: credits.current_credits,
      used: credits.used_this_month,
      limit: credits.monthly_limit,
      usagePercentage: Math.round(usagePercentage),
      alerts
    });

    return new Response(JSON.stringify({
      credits: {
        current: credits.current_credits,
        used: credits.used_this_month,
        limit: credits.monthly_limit,
        renewalDate: credits.renewal_date,
        usagePercentage: Math.round(usagePercentage)
      },
      subscription,
      transactions: transactions || [],
      alerts
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("❌ Erro em check-credits:", error);
    return new Response(JSON.stringify({ 
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
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
