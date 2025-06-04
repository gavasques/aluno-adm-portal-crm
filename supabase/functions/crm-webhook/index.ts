
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    console.log('=== CRM WEBHOOK RECEIVED ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);

    // Parse URL parameters
    const url = new URL(req.url);
    const pipelineId = url.searchParams.get('pipeline_id');
    const token = url.searchParams.get('token');

    console.log('Pipeline ID:', pipelineId);
    console.log('Token provided:', !!token);

    if (!pipelineId) {
      console.error('❌ Pipeline ID missing');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Pipeline ID is required',
          message: 'Please provide pipeline_id parameter'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    let payload;
    try {
      const body = await req.text();
      console.log('Raw body received:', body);
      payload = JSON.parse(body);
      console.log('Parsed payload:', JSON.stringify(payload, null, 2));
    } catch (error) {
      console.error('❌ Failed to parse JSON:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON payload',
          message: 'Request body must be valid JSON'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify pipeline exists
    const { data: pipeline, error: pipelineError } = await supabase
      .from('crm_pipelines')
      .select('id, name')
      .eq('id', pipelineId)
      .eq('is_active', true)
      .single();

    if (pipelineError || !pipeline) {
      console.error('❌ Pipeline not found:', pipelineError);
      
      // Log the webhook attempt
      await supabase.from('crm_webhook_logs').insert({
        pipeline_id: pipelineId,
        payload_received: payload,
        success: false,
        error_message: 'Pipeline not found or inactive',
        response_status: 404,
        response_body: { success: false, error: 'Pipeline not found' },
        ip_address: req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent'),
        webhook_url: req.url
      });

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Pipeline not found or inactive',
          pipeline_id: pipelineId
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Pipeline found:', pipeline.name);

    // Get field mappings for this pipeline
    const { data: mappings, error: mappingsError } = await supabase
      .from('crm_webhook_field_mappings')
      .select(`
        webhook_field_name,
        crm_field_name,
        crm_field_type,
        field_type,
        is_required,
        is_active,
        transformation_rules,
        custom_field:crm_custom_fields(id, field_name, field_key)
      `)
      .eq('pipeline_id', pipelineId)
      .eq('is_active', true);

    if (mappingsError) {
      console.error('❌ Error fetching mappings:', mappingsError);
    }

    console.log('Field mappings found:', mappings?.length || 0);

    // Transform data based on format
    let transformedData;
    
    // Detect Typeform format (has form_response.answers array)
    if (payload.form_response?.answers) {
      console.log('📝 Processing Typeform format');
      transformedData = await transformTypeformData(payload, mappings || [], supabase);
    } else {
      console.log('📝 Processing standard format');
      transformedData = await transformStandardData(payload, mappings || []);
    }

    console.log('Transformed data:', transformedData);

    // Validate required fields
    if (!transformedData.name || !transformedData.email) {
      console.error('❌ Missing required fields:', { 
        name: !!transformedData.name, 
        email: !!transformedData.email 
      });
      
      // Log the failed attempt
      await supabase.from('crm_webhook_logs').insert({
        pipeline_id: pipelineId,
        payload_received: payload,
        success: false,
        error_message: 'Name and email are required fields',
        response_status: 400,
        response_body: { 
          success: false, 
          error: 'Name and email are required',
          received_data: transformedData
        },
        ip_address: req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent'),
        webhook_url: req.url
      });

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Name and email are required',
          received_data: transformedData,
          available_mappings: mappings?.map(m => ({
            webhook_field: m.webhook_field_name,
            crm_field: m.crm_field_name,
            required: m.is_required
          }))
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get first column of the pipeline
    const { data: firstColumn, error: columnError } = await supabase
      .from('crm_pipeline_columns')
      .select('id, name')
      .eq('pipeline_id', pipelineId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(1)
      .single();

    if (columnError || !firstColumn) {
      console.error('❌ No active columns found for pipeline:', columnError);
      
      await supabase.from('crm_webhook_logs').insert({
        pipeline_id: pipelineId,
        payload_received: payload,
        success: false,
        error_message: 'No active columns found for pipeline',
        response_status: 500,
        response_body: { success: false, error: 'Pipeline has no active columns' },
        ip_address: req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent'),
        webhook_url: req.url
      });

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Pipeline has no active columns' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ First column found:', firstColumn.name);

    // Check if lead already exists by email
    const { data: existingLead } = await supabase
      .from('crm_leads')
      .select('id, name, email')
      .eq('email', transformedData.email)
      .single();

    if (existingLead) {
      console.log('👤 Lead already exists:', existingLead.id);
      
      // Log successful webhook (existing lead)
      await supabase.from('crm_webhook_logs').insert({
        pipeline_id: pipelineId,
        payload_received: payload,
        success: true,
        lead_created_id: existingLead.id,
        response_status: 200,
        response_body: {
          success: true,
          message: 'Lead already exists',
          lead_id: existingLead.id,
          existing: true
        },
        ip_address: req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent'),
        webhook_url: req.url
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Lead already exists',
          lead_id: existingLead.id,
          existing: true,
          pipeline: pipeline,
          column: firstColumn
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create new lead
    const leadData = {
      pipeline_id: pipelineId,
      column_id: firstColumn.id,
      ...transformedData,
      status: 'aberto',
      created_at: new Date().toISOString()
    };

    console.log('📝 Creating new lead with data:', leadData);

    const { data: newLead, error: leadError } = await supabase
      .from('crm_leads')
      .insert(leadData)
      .select('id, name, email')
      .single();

    if (leadError) {
      console.error('❌ Failed to create lead:', leadError);
      
      await supabase.from('crm_webhook_logs').insert({
        pipeline_id: pipelineId,
        payload_received: payload,
        success: false,
        error_message: `Failed to create lead: ${leadError.message}`,
        response_status: 500,
        response_body: { success: false, error: leadError.message },
        ip_address: req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent'),
        webhook_url: req.url
      });

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to create lead',
          details: leadError.message
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Lead created successfully:', newLead.id);

    // Log successful webhook
    await supabase.from('crm_webhook_logs').insert({
      pipeline_id: pipelineId,
      payload_received: payload,
      success: true,
      lead_created_id: newLead.id,
      response_status: 200,
      response_body: {
        success: true,
        message: 'Lead created successfully',
        lead_id: newLead.id
      },
      ip_address: req.headers.get('x-forwarded-for'),
      user_agent: req.headers.get('user-agent'),
      webhook_url: req.url
    });

    const successResponse = {
      success: true,
      message: 'Lead created successfully',
      lead_id: newLead.id,
      pipeline: pipeline,
      column: firstColumn
    };

    console.log('🎉 Webhook processed successfully');
    console.log('Response:', successResponse);

    return new Response(
      JSON.stringify(successResponse),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    
    try {
      await supabase.from('crm_webhook_logs').insert({
        pipeline_id: new URL(req.url).searchParams.get('pipeline_id'),
        payload_received: {},
        success: false,
        error_message: `Unexpected error: ${error.message}`,
        response_status: 500,
        response_body: { success: false, error: 'Internal server error' },
        ip_address: req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent'),
        webhook_url: req.url
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        message: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Transform Typeform data format
async function transformTypeformData(payload: any, mappings: any[], supabase: any) {
  console.log('🔄 Transforming Typeform data');
  
  const result: any = {};
  const answers = payload.form_response?.answers || [];

  // Create mapping from field IDs to CRM fields
  const fieldMappings = new Map();
  for (const mapping of mappings) {
    fieldMappings.set(mapping.webhook_field_name, mapping);
  }

  console.log('Available field mappings:', Array.from(fieldMappings.keys()));

  // Process each answer
  for (const answer of answers) {
    const fieldId = answer.field?.id;
    if (!fieldId) continue;

    console.log(`Processing field ID: ${fieldId}`);
    
    // Check if we have a mapping for this field ID
    const mapping = fieldMappings.get(fieldId);
    if (!mapping) {
      console.log(`⚠️ No mapping found for field ID: ${fieldId}`);
      continue;
    }

    console.log(`✅ Found mapping: ${fieldId} -> ${mapping.crm_field_name}`);

    // Extract value based on answer type
    let value = null;
    if (answer.short_text?.value) {
      value = answer.short_text.value;
    } else if (answer.email?.value) {
      value = answer.email.value;
    } else if (answer.phone_number?.value) {
      value = answer.phone_number.value;
    } else if (answer.long_text?.value) {
      value = answer.long_text.value;
    } else if (answer.choice?.label) {
      value = answer.choice.label;
    } else if (answer.boolean !== undefined) {
      value = answer.boolean;
    } else if (answer.number) {
      value = answer.number;
    }

    if (value !== null) {
      // Apply transformations if needed
      if (mapping.transformation_rules && typeof mapping.transformation_rules === 'object') {
        // Apply transformation rules here if needed
      }

      result[mapping.crm_field_name] = value;
      console.log(`✅ Mapped: ${fieldId} -> ${mapping.crm_field_name} = ${value}`);
    }
  }

  // Add any additional metadata
  if (payload.form_response?.token) {
    result.external_id = payload.form_response.token;
  }

  console.log('Final transformed data:', result);
  return result;
}

// Transform standard data format
async function transformStandardData(payload: any, mappings: any[]) {
  console.log('🔄 Transforming standard data');
  
  const result: any = {};
  
  // Create mapping from webhook fields to CRM fields
  const fieldMappings = new Map();
  for (const mapping of mappings) {
    fieldMappings.set(mapping.webhook_field_name, mapping);
  }

  // Process each field in payload
  for (const [key, value] of Object.entries(payload)) {
    const mapping = fieldMappings.get(key);
    if (mapping && value !== null && value !== undefined) {
      result[mapping.crm_field_name] = value;
    } else if (!mapping) {
      // For unmapped fields, use direct mapping if it matches CRM fields
      const directFields = ['name', 'email', 'phone', 'notes', 'has_company', 'sells_on_amazon'];
      if (directFields.includes(key)) {
        result[key] = value;
      }
    }
  }

  console.log('Final transformed data:', result);
  return result;
}
