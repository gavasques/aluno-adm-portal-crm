
import React from 'react';
import { CRMLead } from '@/types/crm.types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  Tag,
  ShoppingCart,
  Package,
  Link as LinkIcon
} from 'lucide-react';
import { LeadDetailQuickActions } from './LeadDetailQuickActions';

interface LeadDetailOverviewProps {
  lead: CRMLead;
}

export const LeadDetailOverview = ({ lead }: LeadDetailOverviewProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna Principal - Informações do Lead */}
      <div className="lg:col-span-2 space-y-6">
        {/* Informações Básicas */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Informações Básicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{lead.email}</p>
                </div>
              </div>
              
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium">{lead.phone}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Tem empresa</p>
                  <Badge variant={lead.has_company ? "default" : "secondary"}>
                    {lead.has_company ? 'Sim' : 'Não'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Criado em</p>
                  <p className="font-medium">{formatDate(lead.created_at)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Amazon */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-600" />
              Informações Amazon
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Vende na Amazon</p>
                <Badge variant={lead.sells_on_amazon ? "default" : "secondary"}>
                  {lead.sells_on_amazon ? 'Sim' : 'Não'}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Trabalha com FBA</p>
                <Badge variant={lead.works_with_fba ? "default" : "secondary"}>
                  {lead.works_with_fba ? 'Sim' : 'Não'}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Busca marca própria</p>
                <Badge variant={lead.seeks_private_label ? "default" : "secondary"}>
                  {lead.seeks_private_label ? 'Sim' : 'Não'}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Pronto para investir 3k</p>
                <Badge variant={lead.ready_to_invest_3k ? "default" : "secondary"}>
                  {lead.ready_to_invest_3k ? 'Sim' : 'Não'}
                </Badge>
              </div>
            </div>
            
            {lead.what_sells && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-1">O que vende</p>
                <p className="text-gray-900">{lead.what_sells}</p>
              </div>
            )}
            
            {lead.amazon_store_link && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-1">Link da loja</p>
                <a 
                  href={lead.amazon_store_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <LinkIcon className="h-4 w-4" />
                  {lead.amazon_store_link}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Observações e Dúvidas */}
        {(lead.notes || lead.main_doubts) && (
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Observações e Dúvidas</h3>
              
              {lead.notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Observações</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
                  </div>
                </div>
              )}
              
              {lead.main_doubts && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Principais Dúvidas</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700 whitespace-pre-wrap">{lead.main_doubts}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-purple-600" />
                Tags
              </h3>
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
            </CardContent>
          </Card>
        )}
      </div>

      {/* Coluna Lateral - Ações Rápidas */}
      <div className="space-y-6">
        <LeadDetailQuickActions
          leadId={lead.id}
          leadName={lead.name}
          lead={lead}
          compact={false}
        />

        {/* Status do Pipeline */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Status do Pipeline</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Pipeline</p>
                <p className="font-medium">{lead.pipeline?.name || 'Não definido'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estágio</p>
                <p className="font-medium">{lead.column?.name || 'Não definido'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Responsável</p>
                <p className="font-medium">{lead.responsible?.name || 'Não definido'}</p>
              </div>
              {lead.scheduled_contact_date && (
                <div>
                  <p className="text-sm text-gray-600">Próximo contato</p>
                  <p className="font-medium">{formatDate(lead.scheduled_contact_date)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
