
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuditLogEntry {
  user_id?: string;
  session_id?: string;
  event_type: string;
  event_category: string;
  entity_type?: string;
  entity_id?: string;
  action: string;
  description?: string;
  ip_address?: string;
  user_agent?: string;
  request_path?: string;
  request_method?: string;
  old_values?: any;
  new_values?: any;
  metadata?: any;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  success?: boolean;
  error_message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: logEntry } = await req.json() as { data: AuditLogEntry }

    console.log('Received audit log entry:', logEntry)

    // Extrair IP do request
    const ip_address = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      'unknown'

    // Preparar dados do log
    const auditData = {
      ...logEntry,
      ip_address: logEntry.ip_address || ip_address,
      user_agent: logEntry.user_agent || req.headers.get('user-agent'),
      created_at: new Date().toISOString()
    }

    // Inserir log no banco
    const { data, error } = await supabaseClient
      .from('audit_logs')
      .insert([auditData])
      .select()

    if (error) {
      console.error('Error inserting audit log:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Audit log inserted successfully:', data)

    return new Response(
      JSON.stringify({ success: true, id: data[0]?.id }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in audit logger:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
