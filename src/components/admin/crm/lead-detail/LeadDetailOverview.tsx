
import React from 'react';
import { motion } from 'framer-motion';
import { CRMLead, CRMLeadContact } from '@/types/crm.types';
import { 
  User, 
  Building2, 
  FileText, 
  Mail, 
  Phone, 
  Calendar,
  Globe,
  DollarSign,
  UserCheck,
  Badge as BadgeIcon,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RecentComments } from './RecentComments';
import { isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';

interface LeadDetailOverviewProps {
  lead: CRMLead & {
    pending_contacts?: CRMLeadContact[];
    last_completed_contact?: CRMLeadContact;
  };
}

export const LeadDetailOverview = ({ lead }: LeadDetailOverviewProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Buscar próximo contato pendente
  const nextContact = lead.pending_contacts && lead.pending_contacts.length > 0
    ? lead.pending_contacts
        .filter(contact => contact.status === 'pending')
        .sort((a, b) => new Date(a.contact_date).getTime() - new Date(b.contact_date).getTime())[0]
    : null;

  // Último contato realizado
  const lastCompletedContact = lead.last_completed_contact;

  const getContactBadge = (contactDate: string, isCompleted: boolean = false) => {
    if (isCompleted) {
      return (
        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Realizado
        </Badge>
      );
    }

    const contactDateObj = new Date(contactDate);
    
    if (isPast(contactDateObj) && !isToday(contactDateObj)) {
      return (
        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
          <Clock className="h-3 w-3 mr-1" />
          Atrasado
        </Badge>
      );
    }
    
    if (isToday(contactDateObj)) {
      return (
        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
          <Clock className="h-3 w-3 mr-1" />
          Hoje
        </Badge>
      );
    }
    
    if (isTomorrow(contactDateObj)) {
      return (
        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Amanhã
        </Badge>
      );
    }
    
    const daysDiff = differenceInDays(contactDateObj, new Date());
    if (daysDiff <= 7) {
      return (
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
          <Calendar className="h-3 w-3 mr-1" />
          {daysDiff}d
        </Badge>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full overflow-y-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Coluna esquerda - Informações do lead */}
        <div className="space-y-4">
          {/* Informações de contato - compactadas */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
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

          {/* Informações de Contatos - Nova seção */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Gestão de Contatos
            </h3>
            <div className="space-y-3">
              {/* Próximo Contato */}
              <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Próximo Contato</p>
                    <p className="text-xs text-gray-500">
                      {nextContact ? formatDate(nextContact.contact_date) : 'Sem contatos agendados'}
                    </p>
                  </div>
                </div>
                {nextContact && getContactBadge(nextContact.contact_date)}
              </div>

              {/* Último Contato */}
              <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Último Contato</p>
                    <p className="text-xs text-gray-500">
                      {lastCompletedContact && lastCompletedContact.completed_at
                        ? formatDate(lastCompletedContact.completed_at)
                        : 'Nenhum contato realizado'
                      }
                    </p>
                  </div>
                </div>
                {lastCompletedContact && lastCompletedContact.completed_at && 
                  getContactBadge(lastCompletedContact.completed_at, true)
                }
              </div>
            </div>
          </div>

          {/* Informações de negócio - reduzidas com badges */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-orange-600" />
              Informações de Negócio
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant={lead.has_company ? "default" : "secondary"} className="text-xs">
                <Building2 className="h-3 w-3 mr-1" />
                {lead.has_company ? 'Tem empresa' : 'Pessoa física'}
              </Badge>
              <Badge variant={lead.sells_on_amazon ? "default" : "secondary"} className="text-xs">
                <Globe className="h-3 w-3 mr-1" />
                {lead.sells_on_amazon ? 'Amazon' : 'Não Amazon'}
              </Badge>
              <Badge variant={lead.ready_to_invest_3k ? "default" : "secondary"} className="text-xs">
                <DollarSign className="h-3 w-3 mr-1" />
                {lead.ready_to_invest_3k ? 'R$ 3k OK' : 'Não qualificado'}
              </Badge>
              <Badge variant={lead.works_with_fba ? "default" : "secondary"} className="text-xs">
                FBA: {lead.works_with_fba ? 'Sim' : 'Não'}
              </Badge>
              <Badge variant={lead.seeks_private_label ? "default" : "secondary"} className="text-xs">
                PL: {lead.seeks_private_label ? 'Sim' : 'Não'}
              </Badge>
              <Badge variant={lead.had_contact_with_lv ? "default" : "secondary"} className="text-xs">
                Contato LV: {lead.had_contact_with_lv ? 'Sim' : 'Não'}
              </Badge>
            </div>
            
            {lead.what_sells && (
              <div className="mt-3 p-3 bg-blue-50/50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">O que vende</p>
                <p className="text-sm font-medium">{lead.what_sells}</p>
              </div>
            )}
          </div>

          {/* Dados Adicionais e Tags - duas colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Dados Adicionais */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-600" />
                Dados Adicionais
              </h3>
              <div className="space-y-3">
                {lead.amazon_store_link && (
                  <div className="p-2 bg-orange-50/50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Link da loja Amazon</p>
                    <p className="text-sm font-medium break-all">{lead.amazon_store_link}</p>
                  </div>
                )}
                {lead.amazon_state && (
                  <div className="p-2 bg-gray-50/50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Estado Amazon</p>
                    <p className="text-sm font-medium">{lead.amazon_state}</p>
                  </div>
                )}
                {lead.amazon_tax_regime && (
                  <div className="p-2 bg-gray-50/50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Regime Tributário</p>
                    <p className="text-sm font-medium">{lead.amazon_tax_regime}</p>
                  </div>
                )}
                {lead.keep_or_new_niches && (
                  <div className="p-2 bg-purple-50/50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Nichos</p>
                    <p className="text-sm font-medium">{lead.keep_or_new_niches}</p>
                  </div>
                )}
                {lead.calendly_link && (
                  <div className="p-2 bg-green-50/50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Link Calendly</p>
                    <p className="text-sm font-medium break-all">{lead.calendly_link}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {lead.tags && lead.tags.length > 0 && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BadgeIcon className="h-4 w-4 text-purple-600" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map(tag => (
                    <Badge
                      key={tag.id}
                      className="text-xs"
                      style={{ 
                        backgroundColor: tag.color + '20', 
                        color: tag.color,
                        borderColor: tag.color + '40'
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          {(lead.main_doubts || lead.notes) && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-600" />
                Observações
              </h3>
              <div className="space-y-3">
                {lead.main_doubts && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Principais dúvidas:</p>
                    <p className="text-sm text-gray-600 bg-yellow-50/50 p-3 rounded-lg">{lead.main_doubts}</p>
                  </div>
                )}
                {lead.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Observações gerais:</p>
                    <p className="text-sm text-gray-600 bg-gray-50/50 p-3 rounded-lg">{lead.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Coluna direita - Comentários expandidos */}
        <div className="space-y-4">
          {/* Comentários recentes com editor integrado */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg h-[calc(100vh-300px)] min-h-[500px] flex flex-col">
            <RecentComments leadId={lead.id} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
