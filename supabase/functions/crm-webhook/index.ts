
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  console.log('🚀 Webhook CRM - Início do processamento');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Método não permitido' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Extrair pipeline_id da URL
    const url = new URL(req.url);
    const pipelineId = url.searchParams.get('pipeline_id');
    
    if (!pipelineId) {
      console.error('❌ Pipeline ID não fornecido na URL');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Pipeline ID é obrigatório na URL' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`📝 Pipeline ID: ${pipelineId}`);

    // Parse do payload
    let payload;
    try {
      payload = await req.json();
      console.log(`📦 Payload recebido: ${JSON.stringify(payload, null, 2)}`);
    } catch (error) {
      console.error('❌ Erro ao fazer parse do JSON:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payload JSON inválido' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar mapeamentos de campos para este pipeline
    const { data: mappings, error: mappingsError } = await supabase
      .from('crm_webhook_field_mappings')
      .select(`
        *,
        custom_field:crm_custom_fields(id, field_name, field_key)
      `)
      .eq('pipeline_id', pipelineId)
      .eq('is_active', true);

    if (mappingsError) {
      console.error('❌ Erro ao buscar mapeamentos:', mappingsError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Erro interno ao buscar configurações' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🗺️ Mapeamentos encontrados: ${mappings?.length || 0}`);

    // Verificar se o pipeline existe e está ativo
    const { data: pipeline, error: pipelineError } = await supabase
      .from('crm_pipelines')
      .select('id, name, is_active')
      .eq('id', pipelineId)
      .eq('is_active', true)
      .single();

    if (pipelineError || !pipeline) {
      console.error('❌ Pipeline não encontrado ou inativo:', pipelineError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Pipeline não encontrado ou inativo' 
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar primeira coluna do pipeline
    const { data: firstColumn, error: columnError } = await supabase
      .from('crm_pipeline_columns')
      .select('id, name')
      .eq('pipeline_id', pipelineId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(1)
      .single();

    if (columnError || !firstColumn) {
      console.error('❌ Nenhuma coluna encontrada para o pipeline:', columnError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Pipeline sem colunas configuradas' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transformar dados baseado nos mapeamentos
    console.log('🔄 Transformando dados baseado nos mapeamentos...');
    
    const transformedData: any = {};
    const missingRequiredFields: string[] = [];

    // Processar cada mapeamento
    if (mappings && mappings.length > 0) {
      console.log(`📋 Mapeamentos disponíveis: ${mappings.length}`);
      
      mappings.forEach(mapping => {
        const webhookValue = payload[mapping.webhook_field_name];
        
        // Verificar se é campo obrigatório e está faltando
        if (mapping.is_required && (webhookValue === undefined || webhookValue === null || webhookValue === '')) {
          const fieldDisplayName = mapping.crm_field_type === 'custom' 
            ? mapping.custom_field?.field_name || mapping.crm_field_name
            : mapping.webhook_field_name;
          missingRequiredFields.push(fieldDisplayName);
          console.error(`⚠️ Campo obrigatório faltando: ${fieldDisplayName}`);
          return;
        }

        // Se o campo existe no payload, fazer o mapeamento
        if (webhookValue !== undefined) {
          console.log(`🔗 Mapeando: ${mapping.webhook_field_name} (${webhookValue}) → ${mapping.crm_field_name}`);
          
          // Aplicar transformações se necessário
          let finalValue = webhookValue;
          
          // Transformações específicas por tipo de campo
          if (mapping.field_type === 'boolean') {
            if (typeof webhookValue === 'string') {
              finalValue = ['true', '1', 'yes', 'sim', 'y', 's'].includes(webhookValue.toLowerCase());
            } else {
              finalValue = Boolean(webhookValue);
            }
          }
          
          // Para campos customizados, não incluir no transformedData principal
          if (mapping.crm_field_type === 'standard') {
            transformedData[mapping.crm_field_name] = finalValue;
          }
          // Campos customizados serão tratados separadamente
        }
      });
    }

    console.log('✅ Transformação concluída');
    console.log(`🔄 Dados transformados: ${JSON.stringify(transformedData, null, 2)}`);

    // Verificar campos obrigatórios
    if (missingRequiredFields.length > 0) {
      console.error(`❌ Campos obrigatórios faltando: ${JSON.stringify(missingRequiredFields)}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Campos obrigatórios faltando: ${missingRequiredFields.join(', ')}`,
          missing_fields: missingRequiredFields
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se temos pelo menos um campo útil (email ou name como fallback)
    if (!transformedData.name && !transformedData.email) {
      // Se não temos nem name nem email mapeados, usar valores do payload diretamente como fallback
      if (payload.name) transformedData.name = payload.name;
      if (payload.email) transformedData.email = payload.email;
      
      // Se ainda não temos nada, criar valores padrão
      if (!transformedData.name && !transformedData.email) {
        transformedData.name = `Lead Webhook ${new Date().getTime()}`;
        transformedData.email = `webhook-${new Date().getTime()}@temp.com`;
      }
    }

    // Verificar se já existe lead com o mesmo email
    if (transformedData.email) {
      const { data: existingLead } = await supabase
        .from('crm_leads')
        .select('id, name, email, status')
        .eq('email', transformedData.email)
        .eq('pipeline_id', pipelineId)
        .single();

      if (existingLead) {
        console.log(`ℹ️ Lead já existe: ${existingLead.id}`);
        
        // Log da tentativa de duplicação
        await supabase
          .from('crm_webhook_logs')
          .insert({
            pipeline_id: pipelineId,
            payload_received: payload,
            success: true,
            response_status: 200,
            response_body: {
              success: true,
              message: "Lead already exists",
              lead_id: existingLead.id,
              pipeline: { id: pipeline.id, name: pipeline.name },
              column: { id: firstColumn.id, name: firstColumn.name }
            },
            lead_created_id: existingLead.id,
            ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            user_agent: req.headers.get('user-agent'),
            webhook_url: req.url
          });

        return new Response(
          JSON.stringify({
            success: true,
            message: "Lead already exists",
            lead_id: existingLead.id,
            pipeline: { id: pipeline.id, name: pipeline.name },
            column: { id: firstColumn.id, name: firstColumn.name }
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Criar o lead
    console.log('📝 Criando lead...');
    
    const leadData = {
      ...transformedData,
      pipeline_id: pipelineId,
      column_id: firstColumn.id,
      status: 'aberto',
      created_by: null // Webhook não tem usuário específico
    };

    const { data: newLead, error: leadError } = await supabase
      .from('crm_leads')
      .insert(leadData)
      .select()
      .single();

    if (leadError) {
      console.error('❌ Erro ao criar lead:', leadError);
      
      // Log do erro
      await supabase
        .from('crm_webhook_logs')
        .insert({
          pipeline_id: pipelineId,
          payload_received: payload,
          success: false,
          response_status: 500,
          response_body: { success: false, error: 'Erro ao criar lead' },
          error_message: leadError.message,
          ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          user_agent: req.headers.get('user-agent'),
          webhook_url: req.url
        });
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Erro ao criar lead no banco de dados' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ Lead criado com sucesso: ${newLead.id}`);

    // Processar campos customizados se existirem
    if (mappings && mappings.length > 0) {
      const customFieldMappings = mappings.filter(m => m.crm_field_type === 'custom' && m.custom_field_id);
      
      for (const mapping of customFieldMappings) {
        const webhookValue = payload[mapping.webhook_field_name];
        
        if (webhookValue !== undefined && webhookValue !== null) {
          let finalValue = webhookValue;
          
          // Transformações para campos customizados
          if (mapping.field_type === 'boolean') {
            if (typeof webhookValue === 'string') {
              finalValue = ['true', '1', 'yes', 'sim', 'y', 's'].includes(webhookValue.toLowerCase());
            } else {
              finalValue = Boolean(webhookValue);
            }
          }
          
          // Inserir valor do campo customizado
          await supabase
            .from('crm_custom_field_values')
            .insert({
              lead_id: newLead.id,
              field_id: mapping.custom_field_id,
              field_value: String(finalValue)
            });
          
          console.log(`🔧 Campo customizado inserido: ${mapping.custom_field?.field_name} = ${finalValue}`);
        }
      }
    }

    // Resposta de sucesso
    const successResponse = {
      success: true,
      message: "Lead created successfully",
      lead_id: newLead.id,
      pipeline: { id: pipeline.id, name: pipeline.name },
      column: { id: firstColumn.id, name: firstColumn.name }
    };

    // Log de sucesso
    await supabase
      .from('crm_webhook_logs')
      .insert({
        pipeline_id: pipelineId,
        payload_received: payload,
        success: true,
        response_status: 200,
        response_body: successResponse,
        lead_created_id: newLead.id,
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent'),
        webhook_url: req.url
      });

    console.log('🎉 Webhook processado com sucesso');

    return new Response(
      JSON.stringify(successResponse),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Erro geral:', error);
    
    // Tentar logar o erro se possível
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      await supabase
        .from('crm_webhook_logs')
        .insert({
          pipeline_id: null,
          payload_received: {},
          success: false,
          response_status: 500,
          response_body: { success: false, error: 'Erro interno do servidor' },
          error_message: error.message,
          ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          user_agent: req.headers.get('user-agent'),
          webhook_url: req.url
        });
    } catch (logError) {
      console.error('❌ Erro ao logar erro:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Erro interno do servidor' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
