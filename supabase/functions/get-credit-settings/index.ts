
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔧 Iniciando get-credit-settings function");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Buscar configurações do sistema
    const { data: settings, error: settingsError } = await supabaseClient
      .from("system_credit_settings")
      .select("setting_key, setting_value, setting_type");

    if (settingsError) {
      console.error("❌ Erro ao buscar configurações:", settingsError);
      throw new Error("Erro ao buscar configurações do sistema");
    }

    // Buscar pacotes de créditos (incluindo stripe_price_id)
    const { data: packages, error: packagesError } = await supabaseClient
      .from("credit_packages")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (packagesError) {
      console.error("❌ Erro ao buscar pacotes:", packagesError);
      throw new Error("Erro ao buscar pacotes de créditos");
    }

    // Buscar planos de assinatura (incluindo stripe_price_id)
    const { data: subscriptionPlans, error: subscriptionPlansError } = await supabaseClient
      .from("credit_subscription_plans")
      .select("*")
      .order("sort_order");

    if (subscriptionPlansError) {
      console.error("❌ Erro ao buscar planos de assinatura:", subscriptionPlansError);
      throw new Error("Erro ao buscar planos de assinatura");
    }

    // Converter configurações para objeto
    const systemSettings = settings.reduce((acc, setting) => {
      let value = setting.setting_value;
      
      // Converter tipos
      if (setting.setting_type === 'number') {
        value = parseFloat(setting.setting_value);
      } else if (setting.setting_type === 'boolean') {
        value = setting.setting_value === 'true';
      }
      
      acc[setting.setting_key] = value;
      return acc;
    }, {} as Record<string, any>);

    console.log("✅ Configurações carregadas com sucesso");

    return new Response(JSON.stringify({
      success: true,
      data: {
        systemSettings,
        packages: packages || [],
        subscriptionPlans: subscriptionPlans || []
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("❌ Erro em get-credit-settings:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
