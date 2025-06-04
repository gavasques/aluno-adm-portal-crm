
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TypeformField {
  id: string;
  ref: string;
  type: string;
  title: string;
}

interface TypeformAnswer {
  type: string;
  field: TypeformField;
  text?: string;
  email?: string;
  phone_number?: string;
  boolean?: boolean;
  choice?: {
    id: string;
    ref: string;
    label: string;
  };
  url?: string;
}

interface TypeformPayload {
  event_type: string;
  form_response: {
    form_id: string;
    token: string;
    answers: TypeformAnswer[];
    definition: {
      fields: TypeformField[];
    };
    submitted_at: string;
  };
}

// Função para detectar se é webhook do Typeform
function isTypeformWebhook(payload: any): payload is TypeformPayload {
  return payload && 
         payload.event_type && 
         payload.form_response && 
         Array.isArray(payload.form_response.answers);
}

// Função para transformar dados do Typeform para formato CRM
function transformTypeformToCRM(typeformPayload: TypeformPayload, mappings: any[]): any {
  console.log('🔄 Transforming Typeform data to CRM format');
  
  const crmData: any = {};
  const answers = typeformPayload.form_response.answers;

  // Iterar sobre cada resposta do Typeform
  answers.forEach(answer => {
    const field = answer.field;
    
    // Tentar encontrar mapeamento por ref, id ou title
    const mapping = mappings.find(m => 
      m.webhook_field_name === field.ref ||
      m.webhook_field_name === field.id ||
      m.webhook_field_name === field.title ||
      m.webhook_field_name === `field_${field.ref}` ||
      m.webhook_field_name === `field_${field.id}`
    );

    if (!mapping || !mapping.is_active) {
      console.log(`⚠️ No mapping found for field: ${field.ref} (${field.title})`);
      return;
    }

    let value: any = null;

    // Extrair valor baseado no tipo da resposta
    switch (answer.type) {
      case 'text':
        value = answer.text;
        break;
      case 'email':
        value = answer.email;
        break;
      case 'phone_number':
        value = answer.phone_number;
        break;
      case 'boolean':
        value = answer.boolean;
        break;
      case 'choice':
        value = answer.choice?.label;
        break;
      case 'url':
        value = answer.url;
        break;
      default:
        console.log(`⚠️ Unknown answer type: ${answer.type}`);
        return;
    }

    // Aplicar transformações se necessário
    if (mapping.transformation_rules && Object.keys(mapping.transformation_rules).length > 0) {
      value = applyTransformationRules(value, mapping.transformation_rules);
    }

    // Mapear para o campo CRM
    if (mapping.crm_field_type === 'custom') {
      // Para campos customizados, armazenar em estrutura separada
      if (!crmData.custom_fields) {
        crmData.custom_fields = {};
      }
      crmData.custom_fields[mapping.custom_field_id] = value;
    } else {
      // Para campos padrão
      crmData[mapping.crm_field_name] = value;
    }

    console.log(`✅ Mapped ${field.ref} -> ${mapping.crm_field_name}: ${value}`);
  });

  return crmData;
}

// Função para aplicar regras de transformação
function applyTransformationRules(value: any, rules: Record<string, any>): any {
  if (!value || !rules) return value;

  // Aplicar valor padrão se vazio
  if (rules.default && (!value || value === '')) {
    return rules.default;
  }

  // Transformar texto
  if (typeof value === 'string') {
    if (rules.toLowerCase) {
      value = value.toLowerCase();
    }
    if (rules.toUpperCase) {
      value = value.toUpperCase();
    }
    if (rules.trim) {
      value = value.trim();
    }
  }

  // Mapear valores específicos
  if (rules.valueMap && rules.valueMap[value]) {
    return rules.valueMap[value];
  }

  return value;
}

serve(async (req) => {
  const startTime = Date.now();
  let pipelineId: string | null = null;
  let payload: any = null;
  let responseStatus = 200;
  let responseBody: any = { message: 'Webhook processed successfully' };
  let leadCreatedId: string | null = null;
  let processingTime = 0;
  let errorMessage: string | null = null;
  let success = false;

  // Capturar informações da requisição com fallbacks seguros
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('x-real-ip') || 
                   req.headers.get('cf-connecting-ip') ||
                   '127.0.0.1';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const webhookUrl = req.url;

  // Função para validar e formatar IP
  const formatIPAddress = (ip: string): string => {
    const cleanIP = ip.trim().split(',')[0].trim();
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipv4Regex.test(cleanIP)) {
      return cleanIP;
    }
    return '127.0.0.1';
  };

  const formattedIP = formatIPAddress(clientIP);

  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      responseStatus = 405;
      errorMessage = 'Method not allowed. Only POST requests are accepted.';
      responseBody = { error: errorMessage };
      return new Response(
        JSON.stringify(responseBody),
        { 
          status: responseStatus, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('🚀 Webhook received');

    // Get pipeline ID and token from URL parameters
    const url = new URL(req.url);
    pipelineId = url.searchParams.get('pipeline_id');
    const token = url.searchParams.get('token');

    if (!pipelineId || !token) {
      responseStatus = 400;
      errorMessage = 'Pipeline ID and token are required in URL parameters.';
      responseBody = { error: errorMessage };
      return new Response(
        JSON.stringify(responseBody),
        { 
          status: responseStatus, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    try {
      payload = await req.json();
    } catch (parseError) {
      responseStatus = 400;
      errorMessage = 'Invalid JSON payload.';
      responseBody = { error: errorMessage };
      return new Response(
        JSON.stringify(responseBody),
        { 
          status: responseStatus, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('📝 Received payload:', JSON.stringify(payload, null, 2));

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Validate token
    const { data: tokenData, error: tokenError } = await supabase
      .from('crm_webhook_tokens')
      .select('*')
      .eq('pipeline_id', pipelineId)
      .eq('token', token)
      .eq('is_active', true)
      .single();

    if (tokenError || !tokenData) {
      responseStatus = 401;
      errorMessage = 'Invalid or inactive token.';
      responseBody = { error: errorMessage };
      return new Response(
        JSON.stringify(responseBody),
        { 
          status: responseStatus, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check token expiration
    if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
      responseStatus = 401;
      errorMessage = 'Token has expired.';
      responseBody = { error: errorMessage };
      return new Response(
        JSON.stringify(responseBody),
        { 
          status: responseStatus, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get field mappings for this pipeline
    const { data: mappings, error: mappingsError } = await supabase
      .from('crm_webhook_field_mappings')
      .select(`
        *,
        custom_field:crm_custom_fields(id, field_name, field_key)
      `)
      .eq('pipeline_id', pipelineId)
      .eq('is_active', true);

    if (mappingsError) {
      console.error('❌ Error fetching mappings:', mappingsError);
      responseStatus = 500;
      errorMessage = 'Error fetching field mappings.';
      responseBody = { error: errorMessage };
      return new Response(
        JSON.stringify(responseBody),
        { 
          status: responseStatus, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`📋 Found ${mappings?.length || 0} field mappings for pipeline ${pipelineId}`);

    let leadData: any = {};

    // Detectar e transformar dados do Typeform
    if (isTypeformWebhook(payload)) {
      console.log('🎯 Detected Typeform webhook');
      leadData = transformTypeformToCRM(payload, mappings || []);
      
      // Verificar se temos pelo menos o campo obrigatório 'name'
      if (!leadData.name) {
        // Tentar encontrar nome em outros campos comuns
        const possibleNameFields = ['first_name', 'nome', 'name'];
        for (const field of possibleNameFields) {
          if (leadData[field]) {
            leadData.name = leadData[field];
            break;
          }
        }
      }
    } else {
      console.log('📝 Processing generic webhook format');
      // Processar formato genérico (código existente)
      if (!payload || !payload.name || !payload.email) {
        responseStatus = 400;
        errorMessage = 'Name and email are required fields.';
        responseBody = { error: errorMessage };
        return new Response(
          JSON.stringify(responseBody),
          { 
            status: responseStatus, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Transform payload based on mappings
      for (const mapping of mappings || []) {
        if (!mapping.is_active) continue;

        const webhookValue = payload[mapping.webhook_field_name];
        
        if (webhookValue !== undefined && webhookValue !== null) {
          let transformedValue = webhookValue;

          // Apply transformation rules if they exist
          if (mapping.transformation_rules && Object.keys(mapping.transformation_rules).length > 0) {
            transformedValue = applyTransformationRules(webhookValue, mapping.transformation_rules);
          }

          if (mapping.crm_field_type === 'custom') {
            if (!leadData.custom_fields) {
              leadData.custom_fields = {};
            }
            leadData.custom_fields[mapping.custom_field_id] = transformedValue;
          } else {
            leadData[mapping.crm_field_name] = transformedValue;
          }
        } else if (mapping.is_required) {
          responseStatus = 400;
          errorMessage = `Required field '${mapping.webhook_field_name}' is missing.`;
          responseBody = { error: errorMessage };
          return new Response(
            JSON.stringify(responseBody),
            { 
              status: responseStatus, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      }
    }

    // Validar campos obrigatórios após transformação
    if (!leadData.name) {
      responseStatus = 400;
      errorMessage = 'Name field is required but not found in mapped data.';
      responseBody = { error: errorMessage };
      return new Response(
        JSON.stringify(responseBody),
        { 
          status: responseStatus, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Set default pipeline and column if not provided
    leadData.pipeline_id = leadData.pipeline_id || pipelineId;

    if (!leadData.column_id) {
      // Get the first column of the pipeline as default
      const { data: columns } = await supabase
        .from('crm_pipeline_columns')
        .select('id')
        .eq('pipeline_id', pipelineId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(1);

      if (columns && columns.length > 0) {
        leadData.column_id = columns[0].id;
      }
    }

    console.log('💾 Creating lead with data:', JSON.stringify(leadData, null, 2));

    // Create the lead
    const { data: newLead, error: leadError } = await supabase
      .from('crm_leads')
      .insert(leadData)
      .select()
      .single();

    if (leadError) {
      console.error('❌ Error creating lead:', leadError);
      responseStatus = 500;
      errorMessage = `Error creating lead: ${leadError.message}`;
      responseBody = { error: errorMessage };
      return new Response(
        JSON.stringify(responseBody),
        { 
          status: responseStatus, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    leadCreatedId = newLead.id;
    success = true;
    responseBody = { 
      message: 'Lead created successfully', 
      lead_id: newLead.id,
      source: isTypeformWebhook(payload) ? 'typeform' : 'generic'
    };

    console.log(`✅ Lead created successfully with ID: ${newLead.id}`);

    return new Response(
      JSON.stringify(responseBody),
      { 
        status: responseStatus, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    responseStatus = 500;
    errorMessage = `Internal server error: ${error.message}`;
    responseBody = { error: errorMessage };
    
    return new Response(
      JSON.stringify(responseBody),
      { 
        status: responseStatus, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } finally {
    processingTime = Date.now() - startTime;
    
    // Log the webhook request
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      console.log('💾 Saving webhook log:', {
        pipeline_id: pipelineId,
        success,
        status: responseStatus,
        ip: formattedIP,
        processing_time: processingTime
      });

      const logData = {
        pipeline_id: pipelineId,
        payload_received: payload || {},
        response_status: responseStatus,
        response_body: responseBody,
        ip_address: formattedIP,
        user_agent: userAgent || 'unknown',
        lead_created_id: leadCreatedId,
        processing_time_ms: processingTime,
        error_message: errorMessage,
        success: success,
        webhook_url: webhookUrl || ''
      };

      const { error: logError } = await supabase
        .from('crm_webhook_logs')
        .insert(logData);

      if (logError) {
        console.error('❌ Error saving webhook log:', logError);
        console.error('❌ Log data that failed:', JSON.stringify(logData, null, 2));
      } else {
        console.log('✅ Webhook log saved successfully');
      }
    } catch (logError) {
      console.error('❌ Critical error in logging block:', logError);
      console.error('❌ Variables at error time:', {
        pipelineId,
        success,
        responseStatus,
        formattedIP,
        processingTime,
        errorMessage
      });
    }
  }
});
