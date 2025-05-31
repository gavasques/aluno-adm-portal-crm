
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string;
  subject: string;
  template: 'lead_assigned' | 'contact_scheduled' | 'lead_moved';
  data: {
    leadName?: string;
    responsibleName?: string;
    contactDate?: string;
    columnName?: string;
    [key: string]: any;
  };
}

const EMAIL_TEMPLATES = {
  lead_assigned: {
    subject: (data: any) => `Novo lead atribuído: ${data.leadName}`,
    html: (data: any) => `
      <h2>Novo lead atribuído</h2>
      <p>Olá ${data.responsibleName},</p>
      <p>Um novo lead foi atribuído a você:</p>
      <ul>
        <li><strong>Nome:</strong> ${data.leadName}</li>
        <li><strong>Email:</strong> ${data.leadEmail}</li>
      </ul>
      <p>Acesse o CRM para mais detalhes.</p>
    `
  },
  contact_scheduled: {
    subject: (data: any) => `Contato agendado com ${data.leadName}`,
    html: (data: any) => `
      <h2>Contato agendado</h2>
      <p>Um contato foi agendado:</p>
      <ul>
        <li><strong>Lead:</strong> ${data.leadName}</li>
        <li><strong>Data:</strong> ${data.contactDate}</li>
        <li><strong>Tipo:</strong> ${data.contactType}</li>
      </ul>
    `
  },
  lead_moved: {
    subject: (data: any) => `Lead ${data.leadName} movido para ${data.columnName}`,
    html: (data: any) => `
      <h2>Lead movimentado</h2>
      <p>O lead ${data.leadName} foi movido para a coluna "${data.columnName}".</p>
    `
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, template, data }: EmailRequest = await req.json();

    console.log('📧 Sending email:', { to, template, subject });

    // Aqui você integraria com um serviço de email real como SendGrid, Resend, etc.
    // Por enquanto, vamos simular o envio
    
    const emailTemplate = EMAIL_TEMPLATES[template];
    if (!emailTemplate) {
      throw new Error(`Template ${template} não encontrado`);
    }

    const emailSubject = subject || emailTemplate.subject(data);
    const emailHtml = emailTemplate.html(data);

    // Simular envio (substitua por integração real)
    console.log('Email simulado enviado:', {
      to,
      subject: emailSubject,
      html: emailHtml
    });

    // Em um ambiente real, você faria algo como:
    // const result = await sendGridClient.send({
    //   to,
    //   from: 'noreply@yourapp.com',
    //   subject: emailSubject,
    //   html: emailHtml
    // });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email enviado com sucesso (simulado)' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
