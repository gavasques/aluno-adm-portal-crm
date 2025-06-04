
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookAnswer {
  id: string;
  kind: string;
  title: string;
  value: string;
  properties?: any;
}

interface WebhookPayload {
  answers?: WebhookAnswer[];
  formId?: string;
  formName?: string;
  fields?: any[];
  hiddenFields?: any[];
  [key: string]: any;
}

interface FieldMapping {
  id: string;
  webhook_field_name: string;
  crm_field_name: string;
  crm_field_type: 'standard' | 'custom';
  custom_field_id?: string;
  field_type: string;
  is_required: boolean;
  is_active: boolean;
  transformation_rules: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const pipelineId = url.searchParams.get('pipeline');

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token não fornecido' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verificar token válido
    const { data: tokenData, error: tokenError } = await supabase
      .from('crm_webhook_tokens')
      .select('*, crm_pipelines(id, name)')
      .eq('token', token)
      .eq('is_active', true)
      .single();

    if (tokenError || !tokenData) {
      console.error('Token inválido:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Token inválido ou expirado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const targetPipelineId = pipelineId || tokenData.pipeline_id;

    // Buscar mapeamentos de campos
    const { data: mappings, error: mappingsError } = await supabase
      .from('crm_webhook_field_mappings')
      .select(`
        *,
        custom_field:crm_custom_fields(id, field_name, field_key)
      `)
      .eq('pipeline_id', targetPipelineId)
      .eq('is_active', true);

    if (mappingsError) {
      console.error('Erro ao buscar mapeamentos:', mappingsError);
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar configurações de mapeamento' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Processar payload
    const payload: WebhookPayload = await req.json();
    console.log('Payload recebido:', JSON.stringify(payload, null, 2));

    let transformedData: Record<string, any> = {};

    // Detectar e transformar formato com array answers
    if (payload.answers && Array.isArray(payload.answers)) {
      console.log('Detectado formato com answers array');
      transformedData = transformAnswersFormat(payload.answers, mappings || []);
    } else {
      console.log('Detectado formato tradicional');
      transformedData = transformTraditionalFormat(payload, mappings || []);
    }

    // Validar campo obrigatório (name)
    if (!transformedData.name) {
      return new Response(
        JSON.stringify({ error: 'Campo "name" é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar coluna padrão do pipeline
    const { data: defaultColumn } = await supabase
      .from('crm_pipeline_columns')
      .select('id')
      .eq('pipeline_id', targetPipelineId)
      .order('sort_order', { ascending: true })
      .limit(1)
      .single();

    // Criar lead
    const leadData = {
      ...transformedData,
      pipeline_id: targetPipelineId,
      column_id: defaultColumn?.id,
      status: 'aberto',
      created_by: null
    };

    const { data: createdLead, error: leadError } = await supabase
      .from('crm_leads')
      .insert(leadData)
      .select()
      .single();

    if (leadError) {
      console.error('Erro ao criar lead:', leadError);
      
      // Log do webhook
      await supabase.from('crm_webhook_logs').insert({
        pipeline_id: targetPipelineId,
        payload_received: payload,
        success: false,
        error_message: leadError.message,
        response_status: 500,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent')
      });

      return new Response(
        JSON.stringify({ error: 'Erro ao criar lead', details: leadError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log de sucesso
    await supabase.from('crm_webhook_logs').insert({
      pipeline_id: targetPipelineId,
      payload_received: payload,
      lead_created_id: createdLead.id,
      success: true,
      response_status: 200,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent')
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        lead_id: createdLead.id,
        message: 'Lead criado com sucesso' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro no webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function transformAnswersFormat(answers: WebhookAnswer[], mappings: FieldMapping[]): Record<string, any> {
  const transformed: Record<string, any> = {};
  
  console.log('Transformando formato answers:', answers.length, 'respostas');
  
  for (const answer of answers) {
    // Buscar mapeamento por ID do campo
    const mapping = mappings.find(m => m.webhook_field_name === answer.id);
    
    if (mapping && mapping.is_active) {
      const fieldName = mapping.crm_field_type === 'custom' && mapping.custom_field_id
        ? mapping.custom_field_id
        : mapping.crm_field_name;
      
      let value = answer.value;
      
      // Aplicar transformações baseadas no tipo
      value = applyFieldTransformations(value, mapping.field_type, mapping.transformation_rules);
      
      transformed[fieldName] = value;
      console.log(`Mapeado: ${answer.id} (${answer.kind}) -> ${fieldName} = ${value}`);
    } else {
      console.log(`Campo não mapeado: ${answer.id} (${answer.kind}) - "${answer.title}"`);
    }
  }
  
  return transformed;
}

function transformTraditionalFormat(payload: WebhookPayload, mappings: FieldMapping[]): Record<string, any> {
  const transformed: Record<string, any> = {};
  
  for (const mapping of mappings) {
    if (mapping.is_active && payload[mapping.webhook_field_name] !== undefined) {
      const fieldName = mapping.crm_field_type === 'custom' && mapping.custom_field_id
        ? mapping.custom_field_id
        : mapping.crm_field_name;
      
      let value = payload[mapping.webhook_field_name];
      value = applyFieldTransformations(value, mapping.field_type, mapping.transformation_rules);
      
      transformed[fieldName] = value;
    }
  }
  
  return transformed;
}

function applyFieldTransformations(value: any, fieldType: string, rules: Record<string, any>): any {
  if (value === null || value === undefined) {
    return rules.default || null;
  }
  
  switch (fieldType) {
    case 'email':
      return typeof value === 'string' ? value.toLowerCase().trim() : value;
    
    case 'phone':
      if (typeof value === 'string') {
        // Limpar formatação do telefone, manter apenas números e +
        return value.replace(/[^\d+]/g, '');
      }
      return value;
    
    case 'boolean':
      if (typeof value === 'string') {
        const lowerValue = value.toLowerCase();
        return lowerValue === 'true' || lowerValue === 'yes' || lowerValue === 'sim' || lowerValue === '1';
      }
      return Boolean(value);
    
    case 'number':
      return typeof value === 'string' ? parseFloat(value) : Number(value);
    
    case 'text':
    default:
      return typeof value === 'string' ? value.trim() : String(value);
  }
}
