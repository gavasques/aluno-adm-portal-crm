
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  name: string;
  email: string;
  phone?: string;
  has_company?: boolean;
  sells_on_amazon?: boolean;
  works_with_fba?: boolean;
  had_contact_with_lv?: boolean;
  seeks_private_label?: boolean;
  ready_to_invest_3k?: boolean;
  calendly_scheduled?: boolean;
  what_sells?: string;
  keep_or_new_niches?: string;
  amazon_store_link?: string;
  amazon_state?: string;
  amazon_tax_regime?: string;
  main_doubts?: string;
  calendly_link?: string;
  notes?: string;
  status_reason?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use POST.' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    // Get pipeline_id from URL parameters
    const url = new URL(req.url);
    const pipelineId = url.searchParams.get('pipeline_id');
    
    if (!pipelineId) {
      return new Response(
        JSON.stringify({ 
          error: 'Pipeline ID is required. Use ?pipeline_id=xxx in the URL.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const payload: WebhookPayload = await req.json();
    
    // Validate required fields
    if (!payload.name || !payload.email) {
      return new Response(
        JSON.stringify({ 
          error: 'Name and email are required fields.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid email format.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔗 Webhook received for pipeline:', pipelineId);
    console.log('📝 Lead data:', { name: payload.name, email: payload.email });

    // Verify pipeline exists and is active
    const { data: pipeline, error: pipelineError } = await supabase
      .from('crm_pipelines')
      .select('id, name, is_active')
      .eq('id', pipelineId)
      .eq('is_active', true)
      .single();

    if (pipelineError || !pipeline) {
      console.error('❌ Pipeline not found or inactive:', pipelineError);
      return new Response(
        JSON.stringify({ 
          error: 'Pipeline not found or inactive.' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the first active column of the pipeline
    const { data: firstColumn, error: columnError } = await supabase
      .from('crm_pipeline_columns')
      .select('id, name')
      .eq('pipeline_id', pipelineId)
      .eq('is_active', true)
      .order('sort_order')
      .limit(1)
      .single();

    if (columnError || !firstColumn) {
      console.error('❌ No active columns found for pipeline:', columnError);
      return new Response(
        JSON.stringify({ 
          error: 'No active columns found for this pipeline.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if lead with this email already exists
    const { data: existingLead } = await supabase
      .from('crm_leads')
      .select('id, name, email')
      .eq('email', payload.email)
      .single();

    if (existingLead) {
      console.log('⚠️ Lead already exists:', existingLead.id);
      return new Response(
        JSON.stringify({ 
          message: 'Lead already exists',
          lead_id: existingLead.id,
          existing: true
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Prepare lead data
    const leadData = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone || null,
      has_company: payload.has_company || false,
      sells_on_amazon: payload.sells_on_amazon || false,
      works_with_fba: payload.works_with_fba || false,
      had_contact_with_lv: payload.had_contact_with_lv || false,
      seeks_private_label: payload.seeks_private_label || false,
      ready_to_invest_3k: payload.ready_to_invest_3k || false,
      calendly_scheduled: payload.calendly_scheduled || false,
      what_sells: payload.what_sells || null,
      keep_or_new_niches: payload.keep_or_new_niches || null,
      amazon_store_link: payload.amazon_store_link || null,
      amazon_state: payload.amazon_state || null,
      amazon_tax_regime: payload.amazon_tax_regime || null,
      main_doubts: payload.main_doubts || null,
      calendly_link: payload.calendly_link || null,
      notes: payload.notes || null,
      status_reason: payload.status_reason || null,
      pipeline_id: pipelineId,
      column_id: firstColumn.id,
      status: 'aberto' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Create the lead
    const { data: newLead, error: leadError } = await supabase
      .from('crm_leads')
      .insert(leadData)
      .select('id, name, email, pipeline_id, column_id')
      .single();

    if (leadError) {
      console.error('❌ Error creating lead:', leadError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create lead: ' + leadError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Lead created successfully:', newLead.id);

    // Log the webhook activity for audit
    await supabase
      .from('audit_logs')
      .insert({
        event_type: 'crm_webhook_received',
        event_category: 'crm',
        action: 'create_lead',
        description: `Lead criado via webhook para pipeline ${pipeline.name}`,
        entity_type: 'crm_lead',
        entity_id: newLead.id,
        metadata: {
          pipeline_id: pipelineId,
          pipeline_name: pipeline.name,
          column_id: firstColumn.id,
          column_name: firstColumn.name,
          webhook_source: 'external'
        },
        risk_level: 'low'
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lead created successfully',
        lead_id: newLead.id,
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
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Webhook error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error: ' + (error as Error).message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
