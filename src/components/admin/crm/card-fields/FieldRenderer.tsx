
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CRMLead, CRMLeadCardField } from '@/types/crm.types';
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar, 
  CalendarClock, 
  AlertTriangle, 
  Clock,
  CheckCircle, 
  XCircle, 
  Phone, 
  Mail, 
  User, 
  Tag,
  Building,
  ShoppingCart,
  Package,
  Target,
  DollarSign,
  Calendar as CalendarIcon
} from 'lucide-react';

interface FieldRendererProps {
  field: CRMLeadCardField;
  lead: CRMLead;
  compact?: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, lead, compact = false }) => {
  const renderScheduledContactDate = () => {
    if (!lead.scheduled_contact_date) return null;

    const contactDate = new Date(lead.scheduled_contact_date);
    const now = new Date();
    const daysDiff = differenceInDays(contactDate, now);
    
    let bgColor = 'bg-blue-100';
    let textColor = 'text-blue-800';
    let icon = <CalendarClock className="h-3 w-3" />;
    let urgencyText = '';

    if (isPast(contactDate) && !isToday(contactDate)) {
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      icon = <AlertTriangle className="h-3 w-3" />;
      urgencyText = 'ATRASADO';
    } else if (isToday(contactDate)) {
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-800';
      icon = <Clock className="h-3 w-3" />;
      urgencyText = 'HOJE';
    } else if (isTomorrow(contactDate)) {
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      icon = <Calendar className="h-3 w-3" />;
      urgencyText = 'AMANHÃ';
    } else if (daysDiff <= 3) {
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      icon = <Calendar className="h-3 w-3" />;
      urgencyText = `EM ${daysDiff} DIAS`;
    }

    const formattedDate = format(contactDate, 'dd/MM/yyyy', { locale: ptBR });

    return (
      <div className={`${bgColor} ${textColor} rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-2 border-l-4 ${
        isPast(contactDate) && !isToday(contactDate) ? 'border-l-red-500' :
        isToday(contactDate) ? 'border-l-orange-500' :
        isTomorrow(contactDate) ? 'border-l-yellow-500' : 'border-l-blue-500'
      }`}>
        {icon}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold">{urgencyText}</span>
            <span>{formattedDate}</span>
          </div>
          <span className="text-xs opacity-80">Próximo contato</span>
        </div>
      </div>
    );
  };

  const renderBasicField = () => {
    switch (field) {
      case 'scheduled_contact_date':
        return renderScheduledContactDate();

      case 'name':
        return (
          <div className="font-semibold text-gray-900 text-sm truncate">
            {lead.name}
          </div>
        );

      case 'email':
        if (!lead.email) return null;
        return (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Mail className="h-3 w-3" />
            <span className="truncate">{lead.email}</span>
          </div>
        );

      case 'phone':
        if (!lead.phone) return null;
        return (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Phone className="h-3 w-3" />
            <span>{lead.phone}</span>
          </div>
        );

      case 'status':
        const statusColors = {
          'aberto': 'bg-blue-100 text-blue-800',
          'ganho': 'bg-green-100 text-green-800',
          'perdido': 'bg-red-100 text-red-800'
        };
        return (
          <Badge className={`text-xs ${statusColors[lead.status] || 'bg-gray-100 text-gray-800'}`}>
            {lead.status?.toUpperCase()}
          </Badge>
        );

      case 'responsible':
        if (!lead.responsible) return null;
        return (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <User className="h-3 w-3" />
            <span className="truncate">{lead.responsible.name}</span>
          </div>
        );

      case 'pipeline':
        if (!lead.pipeline) return null;
        return (
          <Badge variant="outline" className="text-xs">
            {lead.pipeline.name}
          </Badge>
        );

      case 'column':
        if (!lead.column) return null;
        return (
          <Badge variant="outline" className="text-xs">
            {lead.column.name}
          </Badge>
        );

      case 'tags':
        if (!lead.tags || lead.tags.length === 0) return null;
        return (
          <div className="flex flex-wrap gap-1">
            {lead.tags.slice(0, compact ? 2 : 5).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs px-1 py-0"
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
              >
                {tag.name}
              </Badge>
            ))}
            {compact && lead.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                +{lead.tags.length - 2}
              </Badge>
            )}
          </div>
        );

      // Campos de qualificação como badges
      case 'has_company':
        return lead.has_company ? (
          <Badge className="bg-green-100 text-green-800 text-xs flex items-center gap-1">
            <Building className="h-3 w-3" />
            Tem Empresa
          </Badge>
        ) : null;

      case 'sells_on_amazon':
        return lead.sells_on_amazon ? (
          <Badge className="bg-orange-100 text-orange-800 text-xs flex items-center gap-1">
            <ShoppingCart className="h-3 w-3" />
            Vende Amazon
          </Badge>
        ) : null;

      case 'works_with_fba':
        return lead.works_with_fba ? (
          <Badge className="bg-blue-100 text-blue-800 text-xs flex items-center gap-1">
            <Package className="h-3 w-3" />
            FBA
          </Badge>
        ) : null;

      case 'seeks_private_label':
        return lead.seeks_private_label ? (
          <Badge className="bg-purple-100 text-purple-800 text-xs flex items-center gap-1">
            <Target className="h-3 w-3" />
            Marca Própria
          </Badge>
        ) : null;

      case 'ready_to_invest_3k':
        return lead.ready_to_invest_3k ? (
          <Badge className="bg-green-100 text-green-800 text-xs flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Pronto 3k
          </Badge>
        ) : null;

      case 'calendly_scheduled':
        return lead.calendly_scheduled ? (
          <Badge className="bg-indigo-100 text-indigo-800 text-xs flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            Calendly
          </Badge>
        ) : null;

      // Campos de texto
      case 'what_sells':
        if (!lead.what_sells) return null;
        return (
          <div className="text-xs text-gray-600">
            <span className="font-medium">Vende:</span> {compact ? lead.what_sells.slice(0, 30) + '...' : lead.what_sells}
          </div>
        );

      case 'amazon_state':
        if (!lead.amazon_state) return null;
        return (
          <div className="text-xs text-gray-600">
            <span className="font-medium">Estado:</span> {lead.amazon_state}
          </div>
        );

      case 'amazon_tax_regime':
        if (!lead.amazon_tax_regime) return null;
        return (
          <div className="text-xs text-gray-600">
            <span className="font-medium">Regime:</span> {lead.amazon_tax_regime}
          </div>
        );

      case 'amazon_store_link':
        if (!lead.amazon_store_link) return null;
        return (
          <div className="text-xs text-gray-600">
            <span className="font-medium">Loja:</span> 
            <a 
              href={lead.amazon_store_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              Ver loja
            </a>
          </div>
        );

      case 'keep_or_new_niches':
        if (!lead.keep_or_new_niches) return null;
        return (
          <div className="text-xs text-gray-600">
            <span className="font-medium">Nichos:</span> {compact ? lead.keep_or_new_niches.slice(0, 20) + '...' : lead.keep_or_new_niches}
          </div>
        );

      case 'main_doubts':
        if (!lead.main_doubts) return null;
        return (
          <div className="text-xs text-gray-600">
            <span className="font-medium">Dúvidas:</span> {compact ? lead.main_doubts.slice(0, 30) + '...' : lead.main_doubts}
          </div>
        );

      case 'notes':
        if (!lead.notes) return null;
        return (
          <div className="text-xs text-gray-600">
            <span className="font-medium">Obs:</span> {compact ? lead.notes.slice(0, 30) + '...' : lead.notes}
          </div>
        );

      case 'calendly_link':
        if (!lead.calendly_link) return null;
        return (
          <div className="text-xs text-gray-600">
            <a 
              href={lead.calendly_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Link Calendly
            </a>
          </div>
        );

      case 'created_at':
        return (
          <div className="text-xs text-gray-500">
            Criado: {format(new Date(lead.created_at), 'dd/MM/yyyy', { locale: ptBR })}
          </div>
        );

      case 'updated_at':
        return (
          <div className="text-xs text-gray-500">
            Atualizado: {format(new Date(lead.updated_at), 'dd/MM/yyyy', { locale: ptBR })}
          </div>
        );

      default:
        return null;
    }
  };

  const renderedField = renderBasicField();
  
  if (!renderedField) return null;

  return <div className="w-full">{renderedField}</div>;
};
