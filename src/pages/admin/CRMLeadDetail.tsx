
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useCRMLeadDetail } from '@/hooks/crm/useCRMLeadDetail';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CRMLeadDetail = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const { data: lead, isLoading: loading, error } = useCRMLeadDetail(leadId || '');

  console.log('🎯 CRMLeadDetail - leadId:', leadId, 'lead:', lead, 'loading:', loading, 'error:', error);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando detalhes do lead...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/crm')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao CRM
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            Lead ID: {leadId}
          </p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/crm')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao CRM
          </Button>
        </div>
        
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lead não encontrado</h2>
          <p className="text-gray-600 mb-4">
            Não foi possível encontrar o lead com ID: {leadId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/crm')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao CRM
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900">{lead.name}</h1>
        <p className="text-gray-600">{lead.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
          <div className="space-y-2">
            <p><strong>Email:</strong> {lead.email}</p>
            {lead.phone && <p><strong>Telefone:</strong> {lead.phone}</p>}
            <p><strong>Tem empresa:</strong> {lead.has_company ? 'Sim' : 'Não'}</p>
            <p><strong>Vende na Amazon:</strong> {lead.sells_on_amazon ? 'Sim' : 'Não'}</p>
            <p><strong>Trabalha com FBA:</strong> {lead.works_with_fba ? 'Sim' : 'Não'}</p>
            <p><strong>Busca marca própria:</strong> {lead.seeks_private_label ? 'Sim' : 'Não'}</p>
            <p><strong>Pronto para investir 3k:</strong> {lead.ready_to_invest_3k ? 'Sim' : 'Não'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Status do Pipeline</h3>
          <div className="space-y-2">
            <p><strong>Pipeline:</strong> {lead.pipeline?.name || 'Não definido'}</p>
            <p><strong>Estágio:</strong> {lead.column?.name || 'Não definido'}</p>
            <p><strong>Responsável:</strong> {lead.responsible?.name || 'Não definido'}</p>
            {lead.scheduled_contact_date && (
              <p><strong>Próximo contato:</strong> {new Date(lead.scheduled_contact_date).toLocaleDateString('pt-BR')}</p>
            )}
          </div>
        </div>

        {lead.what_sells && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Produtos</h3>
            <p><strong>O que vende:</strong> {lead.what_sells}</p>
            {lead.keep_or_new_niches && (
              <p><strong>Nichos:</strong> {lead.keep_or_new_niches}</p>
            )}
            {lead.amazon_store_link && (
              <p><strong>Link da loja:</strong> 
                <a href={lead.amazon_store_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  {lead.amazon_store_link}
                </a>
              </p>
            )}
          </div>
        )}

        {lead.notes && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Observações</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
          </div>
        )}

        {lead.main_doubts && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Principais Dúvidas</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{lead.main_doubts}</p>
          </div>
        )}
      </div>

      {lead.tags && lead.tags.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {lead.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: tag.color + '20', color: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMLeadDetail;
