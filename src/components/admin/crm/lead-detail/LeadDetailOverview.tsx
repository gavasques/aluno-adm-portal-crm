
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      className="h-full overflow-y-auto space-y-6"
    >
      {/* Grid com informações principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Informações de contato */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Informações de Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-lg">
              <Mail className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{lead.email}</p>
              </div>
            </div>
            {lead.phone && (
              <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-lg">
                <Phone className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">{lead.phone}</p>
                </div>
              </div>
            )}
            {lead.responsible && (
              <div className="flex items-center gap-3 p-3 bg-purple-50/50 rounded-lg">
                <UserCheck className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Responsável</p>
                  <p className="font-medium">{lead.responsible.name}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gestão de Contatos */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Gestão de Contatos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Informações de negócio */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange-600" />
              Perfil de Negócio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant={lead.has_company ? "default" : "secondary"} className="text-xs">
                <Building2 className="h-3 w-3 mr-1" />
                {lead.has_company ? 'Tem empresa' : 'Sem empresa'}
              </Badge>
              <Badge variant={lead.sells_on_amazon ? "default" : "secondary"} className="text-xs">
                <Globe className="h-3 w-3 mr-1" />
                {lead.sells_on_amazon ? 'Vende na Amazon' : 'Não vende na Amazon'}
              </Badge>
              <Badge variant={lead.ready_to_invest_3k ? "default" : "secondary"} className="text-xs">
                <DollarSign className="h-3 w-3 mr-1" />
                {lead.ready_to_invest_3k ? 'Pronto p/ investir R$ 3k' : 'Não pronto p/ investir'}
              </Badge>
              <Badge variant={lead.works_with_fba ? "default" : "secondary"} className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                {lead.works_with_fba ? 'Trabalha com FBA' : 'Não trabalha com FBA'}
              </Badge>
              <Badge variant={lead.seeks_private_label ? "default" : "secondary"} className="text-xs">
                <BadgeIcon className="h-3 w-3 mr-1" />
                {lead.seeks_private_label ? 'Busca marca própria' : 'Não busca marca própria'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* O que vende */}
        {lead.what_sells && (
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">O que vende</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{lead.what_sells}</p>
            </CardContent>
          </Card>
        )}

        {/* Principais dúvidas */}
        {lead.main_doubts && (
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Principais Dúvidas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{lead.main_doubts}</p>
            </CardContent>
          </Card>
        )}

        {/* Links da Amazon */}
        {lead.amazon_store_link && (
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange-600" />
                Loja Amazon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a 
                href={lead.amazon_store_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-all"
              >
                {lead.amazon_store_link}
              </a>
            </CardContent>
          </Card>
        )}

        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BadgeIcon className="h-5 w-5 text-purple-600" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )}
      </div>

      {/* Observações gerais */}
      {lead.notes && (
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              Observações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};
