
import React from 'react';
import { motion } from 'framer-motion';
import { CRMLead } from '@/types/crm.types';
import { 
  User, 
  Building2, 
  FileText, 
  Mail, 
  Phone, 
  Calendar,
  Globe,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { LeadDetailQuickActions } from './LeadDetailQuickActions';
import { RecentComments } from './RecentComments';

interface LeadDetailOverviewProps {
  lead: CRMLead;
}

export const LeadDetailOverview = ({ lead }: LeadDetailOverviewProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full overflow-y-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Coluna principal - Informações básicas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações de contato - compactadas */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              Informações de Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 bg-gray-50/50 rounded-lg">
                <Mail className="h-3 w-3 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-xs">{lead.email}</p>
                </div>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2 p-2 bg-gray-50/50 rounded-lg">
                  <Phone className="h-3 w-3 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Telefone</p>
                    <p className="font-medium text-xs">{lead.phone}</p>
                  </div>
                </div>
              )}
              {lead.scheduled_contact_date && (
                <div className="flex items-center gap-2 p-2 bg-green-50/50 rounded-lg">
                  <Calendar className="h-3 w-3 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Próximo contato</p>
                    <p className="font-medium text-xs">{formatDate(lead.scheduled_contact_date)}</p>
                  </div>
                </div>
              )}
              {lead.responsible && (
                <div className="flex items-center gap-2 p-2 bg-purple-50/50 rounded-lg">
                  <UserCheck className="h-3 w-3 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Responsável</p>
                    <p className="font-medium text-xs">{lead.responsible.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informações de negócio */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange-600" />
              Informações de Negócio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl ${lead.has_company ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border`}>
                <Building2 className={`h-8 w-8 mb-2 ${lead.has_company ? 'text-green-600' : 'text-gray-400'}`} />
                <p className="text-sm font-medium">{lead.has_company ? 'Tem empresa' : 'Pessoa física'}</p>
              </div>
              <div className={`p-4 rounded-xl ${lead.sells_on_amazon ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'} border`}>
                <Globe className={`h-8 w-8 mb-2 ${lead.sells_on_amazon ? 'text-orange-600' : 'text-gray-400'}`} />
                <p className="text-sm font-medium">{lead.sells_on_amazon ? 'Vende na Amazon' : 'Não vende na Amazon'}</p>
              </div>
              <div className={`p-4 rounded-xl ${lead.ready_to_invest_3k ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border`}>
                <DollarSign className={`h-8 w-8 mb-2 ${lead.ready_to_invest_3k ? 'text-green-600' : 'text-gray-400'}`} />
                <p className="text-sm font-medium">{lead.ready_to_invest_3k ? 'Pronto p/ R$ 3k' : 'Não qualificado'}</p>
              </div>
            </div>
            
            {lead.what_sells && (
              <div className="mt-4 p-3 bg-blue-50/50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">O que vende</p>
                <p className="text-sm font-medium">{lead.what_sells}</p>
              </div>
            )}
          </div>

          {/* Observações */}
          {(lead.main_doubts || lead.notes) && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                Observações
              </h3>
              <div className="space-y-4">
                {lead.main_doubts && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Principais dúvidas:</p>
                    <p className="text-sm text-gray-600 bg-yellow-50/50 p-3 rounded-lg">{lead.main_doubts}</p>
                  </div>
                )}
                {lead.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Observações gerais:</p>
                    <p className="text-sm text-gray-600 bg-gray-50/50 p-3 rounded-lg">{lead.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar direita - Comentários recentes e ações */}
        <div className="space-y-6">
          {/* Comentários recentes - espaço expandido */}
          <RecentComments leadId={lead.id} />

          {/* Quick actions */}
          <LeadDetailQuickActions leadId={lead.id} leadName={lead.name} />
        </div>
      </div>
    </motion.div>
  );
};
