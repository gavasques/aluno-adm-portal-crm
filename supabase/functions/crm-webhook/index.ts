
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  [key: string]: any;
}

interface FieldMapping {
  id: string;
  webhook_field_name: string;
  crm_field_name: string;
  crm_field_type: 'standard' | 'custom';
  custom_field_id?: string;
  field_type: 'text' | 'number' | 'phone' | 'boolean' | 'select' | 'email';
  transformation_rules: Record<string, any>;
  is_required: boolean;
  is_active: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    console.log('🚀 Webhook CRM - Início do processamento');
    
    // Obter pipeline_id da URL
    const url = new URL(req.url);
    const pipelineId = url.searchParams.get('pipeline_id');
    
    if (!pipelineId) {
      console.error('❌ Pipeline ID não fornecido');
      return new Response(
        JSON.stringify({ 
          error: 'Pipeline ID é obrigatório',
          message: 'Adicione ?pipeline_id=SEU_PIPELINE_ID na URL' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('📝 Pipeline ID:', pipelineId);

    // Parse do payload
    const payload: WebhookPayload = await req.json();
    console.log('📦 Payload recebido:', JSON.stringify(payload, null, 2));

    // Buscar mapeamentos de campo para este pipeline
    const { data: mappings, error: mappingsError } = await supabase
      .from('crm_webhook_field_mappings')
      .select(`
        *,
        custom_field:crm_custom_fields(id, field_key, field_name)
      `)
      .eq('pipeline_id', pipelineId)
      .eq('is_active', true);

    if (mappingsError) {
      console.error('❌ Erro ao buscar mapeamentos:', mappingsError);
      throw new Error(`Erro ao buscar mapeamentos: ${mappingsError.message}`);
    }

    console.log('🗺️ Mapeamentos encontrados:', mappings?.length || 0);

    // Transformar dados usando mapeamentos
    const transformedData = await transformStandardData(payload, mappings || []);
    console.log('🔄 Dados transformados:', JSON.stringify(transformedData, null, 2));

    // Validar campos obrigatórios
    if (!transformedData.name || !transformedData.email) {
      console.error('❌ Campos obrigatórios faltando:', { 
        name: transformedData.name, 
        email: transformedData.email 
      });
      return new Response(
        JSON.stringify({ 
          error: 'Campos obrigatórios faltando',
          message: 'Os campos "name" e "email" são obrigatórios',
          received_data: transformedData
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verificar se o pipeline existe e obter a primeira coluna
    const { data: pipeline, error: pipelineError } = await supabase
      .from('crm_pipelines')
      .select(`
        id,
        name,
        columns:crm_pipeline_columns(id, name, position)
      `)
      .eq('id', pipelineId)
      .eq('is_active', true)
      .single();

    if (pipelineError || !pipeline) {
      console.error('❌ Pipeline não encontrado:', pipelineError);
      return new Response(
        JSON.stringify({ 
          error: 'Pipeline não encontrado',
          pipeline_id: pipelineId
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Ordenar colunas por posição e pegar a primeira
    const sortedColumns = (pipeline.columns || []).sort((a, b) => a.position - b.position);
    const firstColumn = sortedColumns[0];

    if (!firstColumn) {
      console.error('❌ Nenhuma coluna encontrada no pipeline');
      return new Response(
        JSON.stringify({ 
          error: 'Pipeline sem colunas configuradas',
          pipeline_id: pipelineId
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('📊 Pipeline:', pipeline.name, '| Primeira coluna:', firstColumn.name);

    // Verificar se já existe um lead com este email no pipeline
    const { data: existingLead } = await supabase
      .from('crm_leads')
      .select('id, name, email')
      .eq('email', transformedData.email)
      .eq('pipeline_id', pipelineId)
      .single();

    if (existingLead) {
      console.log('👤 Lead já existe:', existingLead.name);
      
      // Log do webhook
      await logWebhookRequest(supabase, req, payload, pipelineId, 200, 'Lead já existente');
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Lead já existe no pipeline',
          lead_id: existingLead.id,
          lead: existingLead,
          pipeline: {
            id: pipeline.id,
            name: pipeline.name
          },
          column: {
            id: firstColumn.id,
            name: firstColumn.name
          }
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Criar novo lead
    const leadData = {
      pipeline_id: pipelineId,
      column_id: firstColumn.id,
      name: transformedData.name,
      email: transformedData.email,
      phone: transformedData.phone || null,
      has_company: transformedData.has_company || false,
      sells_on_amazon: transformedData.sells_on_amazon || false,
      what_sells: transformedData.what_sells || null,
      notes: transformedData.notes || null,
      amazon_store_link: transformedData.amazon_store_link || null,
      amazon_state: transformedData.amazon_state || null,
      amazon_tax_regime: transformedData.amazon_tax_regime || null,
      works_with_fba: transformedData.works_with_fba || false,
      ready_to_invest_3k: transformedData.ready_to_invest_3k || false,
      seeks_private_label: transformedData.seeks_private_label || false,
      had_contact_with_lv: transformedData.had_contact_with_lv || false,
      keep_or_new_niches: transformedData.keep_or_new_niches || null,
      main_doubts: transformedData.main_doubts || null,
      calendly_scheduled: transformedData.calendly_scheduled || false,
      calendly_link: transformedData.calendly_link || null,
      source: 'webhook',
      status: 'active'
    };

    console.log('💾 Criando lead:', leadData.name, leadData.email);

    const { data: newLead, error: createError } = await supabase
      .from('crm_leads')
      .insert(leadData)
      .select()
      .single();

    if (createError) {
      console.error('❌ Erro ao criar lead:', createError);
      await logWebhookRequest(supabase, req, payload, pipelineId, 500, `Erro ao criar lead: ${createError.message}`);
      throw new Error(`Erro ao criar lead: ${createError.message}`);
    }

    console.log('✅ Lead criado com sucesso:', newLead.id);

    // Salvar campos customizados se houver
    const customFieldsData = await saveCustomFields(supabase, newLead.id, transformedData, mappings || []);
    console.log('🔧 Campos customizados salvos:', customFieldsData.length);

    // Log do webhook
    await logWebhookRequest(supabase, req, payload, pipelineId, 200, 'Lead criado com sucesso');

    const response = {
      success: true,
      message: 'Lead created successfully',
      lead_id: newLead.id,
      lead: {
        id: newLead.id,
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone
      },
      pipeline: {
        id: pipeline.id,
        name: pipeline.name
      },
      column: {
        id: firstColumn.id,
        name: firstColumn.name
      },
      custom_fields_saved: customFieldsData.length
    };

    console.log('🎉 Resposta final:', JSON.stringify(response, null, 2));

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('💥 Erro crítico:', error);
    
    // Log do erro
    const url = new URL(req.url);
    const pipelineId = url.searchParams.get('pipeline_id') || 'unknown';
    
    try {
      const payload = await req.json();
      await logWebhookRequest(supabase, req, payload, pipelineId, 500, error.message);
    } catch (logError) {
      console.error('Erro ao fazer log:', logError);
    }

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function transformStandardData(payload: WebhookPayload, mappings: FieldMapping[]): Promise<Record<string, any>> {
  const result: Record<string, any> = {};
  
  console.log('🔄 Transformando dados padrão...');
  console.log('📋 Mapeamentos disponíveis:', mappings.length);
  
  for (const mapping of mappings) {
    const webhookValue = payload[mapping.webhook_field_name];
    
    if (webhookValue !== undefined && webhookValue !== null) {
      console.log(`🔗 Mapeando: ${mapping.webhook_field_name} (${webhookValue}) → ${mapping.crm_field_name}`);
      
      // Aplicar transformações se necessário
      let transformedValue = webhookValue;
      
      // Aplicar regras de transformação
      if (mapping.transformation_rules && Object.keys(mapping.transformation_rules).length > 0) {
        transformedValue = applyTransformationRules(webhookValue, mapping.transformation_rules);
      }
      
      // Converter tipo se necessário
      transformedValue = convertFieldType(transformedValue, mapping.field_type);
      
      if (mapping.crm_field_type === 'standard') {
        result[mapping.crm_field_name] = transformedValue;
      } else {
        // Para campos customizados, armazenar em uma estrutura especial
        if (!result._custom_fields) {
          result._custom_fields = {};
        }
        result._custom_fields[mapping.custom_field_id!] = transformedValue;
      }
    } else if (mapping.is_required) {
      console.warn(`⚠️ Campo obrigatório faltando: ${mapping.webhook_field_name}`);
    }
  }
  
  console.log('✅ Transformação concluída');
  return result;
}

function applyTransformationRules(value: any, rules: Record<string, any>): any {
  let transformedValue = value;
  
  // Aplicar valor padrão se vazio
  if (rules.default && (!value || value === '')) {
    transformedValue = rules.default;
  }
  
  // Aplicar mapeamento de valores
  if (rules.mapping && typeof rules.mapping === 'object') {
    transformedValue = rules.mapping[value] || value;
  }
  
  // Aplicar regex de limpeza
  if (rules.regex && typeof transformedValue === 'string') {
    const regex = new RegExp(rules.regex.pattern, rules.regex.flags);
    transformedValue = transformedValue.replace(regex, rules.regex.replacement || '');
  }
  
  return transformedValue;
}

function convertFieldType(value: any, fieldType: string): any {
  try {
    switch (fieldType) {
      case 'number':
        return typeof value === 'number' ? value : parseFloat(value) || 0;
      case 'boolean':
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
          return ['true', '1', 'yes', 'sim', 'on'].includes(value.toLowerCase());
        }
        return Boolean(value);
      case 'phone':
        return typeof value === 'string' ? value.replace(/\D/g, '') : String(value);
      case 'email':
        return typeof value === 'string' ? value.toLowerCase().trim() : String(value);
      default:
        return String(value);
    }
  } catch (error) {
    console.warn(`Erro ao converter tipo ${fieldType}:`, error);
    return value;
  }
}

async function saveCustomFields(
  supabase: any,
  leadId: string,
  transformedData: Record<string, any>,
  mappings: FieldMapping[]
): Promise<any[]> {
  if (!transformedData._custom_fields) {
    return [];
  }
  
  const customFieldsToSave = [];
  
  for (const [customFieldId, value] of Object.entries(transformedData._custom_fields)) {
    const mapping = mappings.find(m => m.custom_field_id === customFieldId);
    if (mapping) {
      customFieldsToSave.push({
        lead_id: leadId,
        custom_field_id: customFieldId,
        value: JSON.stringify(value)
      });
    }
  }
  
  if (customFieldsToSave.length === 0) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('crm_custom_field_values')
    .insert(customFieldsToSave)
    .select();
  
  if (error) {
    console.error('Erro ao salvar campos customizados:', error);
    return [];
  }
  
  return data || [];
}

async function logWebhookRequest(
  supabase: any,
  req: Request,
  payload: any,
  pipelineId: string,
  statusCode: number,
  responseMessage: string
): Promise<void> {
  try {
    const logData = {
      pipeline_id: pipelineId,
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries()),
      payload: payload,
      status_code: statusCode,
      response_message: responseMessage,
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString()
    };

    await supabase
      .from('crm_webhook_logs')
      .insert(logData);
      
  } catch (error) {
    console.error('Erro ao fazer log da requisição:', error);
  }
}
