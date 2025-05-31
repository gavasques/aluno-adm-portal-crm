
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCRMLeadDetail } from '@/hooks/crm/useCRMLeadDetail';

const CRMLeadDetail = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const { lead, loading } = useCRMLeadDetail(leadId || '');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lead não encontrado</h2>
          <Button onClick={() => navigate('/admin/crm')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao CRM
          </Button>
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
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Status do Pipeline</h3>
          <div className="space-y-2">
            <p><strong>Pipeline:</strong> {lead.pipeline?.name || 'Não definido'}</p>
            <p><strong>Estágio:</strong> {lead.column?.name || 'Não definido'}</p>
            <p><strong>Responsável:</strong> {lead.responsible?.name || 'Não definido'}</p>
          </div>
        </div>
      </div>

      {lead.notes && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Observações</h3>
          <p className="text-gray-700">{lead.notes}</p>
        </div>
      )}
    </div>
  );
};

export default CRMLeadDetail;
