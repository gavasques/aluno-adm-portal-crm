
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Mail, Building, Calendar, DollarSign, User, Clock, Tag, ExternalLink, MessageSquare, FileText, Package, ShoppingCart, Truck } from 'lucide-react';
import { CRMLead, CRMLeadCardField } from '@/types/crm.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FieldRendererProps {
  field: CRMLeadCardField;
  lead: CRMLead;
  compact?: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, lead, compact = false }) => {
  const renderField = () => {
    switch (field) {
      case 'name':
        return (
          <div className="font-medium text-gray-900 text-sm leading-tight">
            {lead.name}
          </div>
        );

      case 'email':
        if (!lead.email) return null;
        return (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Mail className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{lead.email}</span>
          </div>
        );

      case 'phone':
        if (!lead.phone) return null;
        return (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Phone className="h-3 w-3 flex-shrink-0" />
            <span>{lead.phone}</span>
          </div>
        );

      case 'status':
        return (
          <Badge 
            variant="outline" 
            className={`text-xs ${getStatusColor(lead.status)}`}
          >
            {getStatusLabel(lead.status)}
          </Badge>
        );

      case 'responsible':
        return (
          <div className="flex items-center gap-1.5">
            <Avatar className="h-4 w-4">
              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {lead.responsible ? lead.responsible.name.charAt(0) : <User className="h-2.5 w-2.5" />}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600 truncate">
              {lead.responsible?.name || 'Sem responsável'}
            </span>
          </div>
        );

      case 'pipeline':
        if (!lead.pipeline) return null;
        return (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>Pipeline: {lead.pipeline.name}</span>
          </div>
        );

      case 'column':
        if (!lead.column) return null;
        return (
          <Badge 
            variant="outline" 
            className="text-xs" 
            style={{ 
              backgroundColor: lead.column.color + '15', 
              borderColor: lead.column.color + '30',
              color: lead.column.color 
            }}
          >
            {lead.column.name}
          </Badge>
        );

      case 'tags':
        if (!lead.tags || lead.tags.length === 0) return null;
        const visibleTags = compact ? lead.tags.slice(0, 2) : lead.tags.slice(0, 3);
        return (
          <div className="flex flex-wrap gap-1">
            {visibleTags.map(tag => (
              <Badge 
                key={tag.id} 
                variant="outline" 
                className="text-xs px-1.5 py-0.5 h-5"
                style={{ 
                  backgroundColor: tag.color + '15', 
                  color: tag.color,
                  borderColor: tag.color + '30'
                }}
              >
                {tag.name}
              </Badge>
            ))}
            {lead.tags.length > visibleTags.length && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-gray-50 text-gray-600 h-5">
                +{lead.tags.length - visibleTags.length}
              </Badge>
            )}
          </div>
        );

      case 'has_company':
        if (!lead.has_company) return null;
        return (
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 h-5 px-1.5">
            <Building className="h-2.5 w-2.5 mr-0.5" />
            Empresa
          </Badge>
        );

      case 'sells_on_amazon':
        if (!lead.sells_on_amazon) return null;
        return (
          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 h-5 px-1.5">
            <ShoppingCart className="h-2.5 w-2.5 mr-0.5" />
            Amazon
          </Badge>
        );

      case 'works_with_fba':
        if (!lead.works_with_fba) return null;
        return (
          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 h-5 px-1.5">
            <Truck className="h-2.5 w-2.5 mr-0.5" />
            FBA
          </Badge>
        );

      case 'seeks_private_label':
        if (!lead.seeks_private_label) return null;
        return (
          <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200 h-5 px-1.5">
            <Package className="h-2.5 w-2.5 mr-0.5" />
            Marca Própria
          </Badge>
        );

      case 'ready_to_invest_3k':
        if (!lead.ready_to_invest_3k) return null;
        return (
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 h-5 px-1.5">
            <DollarSign className="h-2.5 w-2.5 mr-0.5" />
            R$ 3k
          </Badge>
        );

      case 'calendly_scheduled':
        if (!lead.calendly_scheduled) return null;
        return (
          <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200 h-5 px-1.5">
            <Calendar className="h-2.5 w-2.5 mr-0.5" />
            Agendado
          </Badge>
        );

      case 'what_sells':
        if (!lead.what_sells) return null;
        return (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Package className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{lead.what_sells}</span>
          </div>
        );

      case 'amazon_state':
        if (!lead.amazon_state) return null;
        return (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span>Estado: {lead.amazon_state}</span>
          </div>
        );

      case 'created_at':
        return (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>
              Criado {format(new Date(lead.created_at), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
        );

      case 'updated_at':
        return (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>
              Atualizado {format(new Date(lead.updated_at), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
        );

      case 'scheduled_contact_date':
        if (!lead.scheduled_contact_date) return null;
        return (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>
              Próximo: {format(new Date(lead.scheduled_contact_date), 'dd/MM', { locale: ptBR })}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  const fieldContent = renderField();
  if (!fieldContent) return null;

  return <div className="field-item">{fieldContent}</div>;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'aberto':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'ganho':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'perdido':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'aberto':
      return 'Aberto';
    case 'ganho':
      return 'Ganho';
    case 'perdido':
      return 'Perdido';
    default:
      return status;
  }
};
