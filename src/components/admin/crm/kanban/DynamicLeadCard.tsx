import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Phone, 
  Mail, 
  Building2, 
  ShoppingCart, 
  Package, 
  Sparkles, 
  DollarSign, 
  Calendar,
  Tag,
  User,
  Clock,
  MapPin,
  MoreVertical
} from 'lucide-react';
import { CRMLead, CRMLeadCardField, LeadStatus } from '@/types/crm.types';
import { useCRMCardPreferences } from '@/hooks/crm/useCRMCardPreferences';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusChangeDialog from '../status/StatusChangeDialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DynamicLeadCardProps {
  lead: CRMLead;
  onClick?: () => void;
  isDragging?: boolean;
}

interface FieldRendererProps {
  field: CRMLeadCardField;
  lead: CRMLead;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, lead }) => {
  const renderField = () => {
    switch (field) {
      case 'name':
        return (
          <div className="font-semibold text-gray-900 line-clamp-2">
            {lead.name}
          </div>
        );

      case 'status':
        return (
          <Badge 
            variant={
              lead.status === 'ganho' ? 'default' : 
              lead.status === 'perdido' ? 'destructive' : 
              'secondary'
            }
            className={
              lead.status === 'ganho' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
              lead.status === 'perdido' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
              'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }
          >
            {lead.status === 'ganho' ? 'Ganho' : 
             lead.status === 'perdido' ? 'Perdido' : 
             'Em Aberto'}
          </Badge>
        );

      case 'responsible':
        return lead.responsible ? (
          <div className="flex items-center gap-2 text-sm">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {lead.responsible.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-gray-600 truncate">{lead.responsible.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <User className="h-4 w-4" />
            <span>Sem responsável</span>
          </div>
        );

      case 'phone':
        return lead.phone ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-3 w-3" />
            <span className="truncate">{lead.phone}</span>
          </div>
        ) : null;

      case 'email':
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-3 w-3" />
            <span className="truncate">{lead.email}</span>
          </div>
        );

      case 'pipeline':
        return lead.pipeline ? (
          <div className="text-xs text-gray-500">
            Pipeline: {lead.pipeline.name}
          </div>
        ) : null;

      case 'column':
        return lead.column ? (
          <div className="text-xs text-gray-500">
            Estágio: {lead.column.name}
          </div>
        ) : null;

      case 'tags':
        return lead.tags && lead.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {lead.tags.slice(0, 3).map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                style={{ 
                  backgroundColor: tag.color + '20', 
                  color: tag.color,
                  border: `1px solid ${tag.color}30`
                }}
              >
                <Tag className="h-2 w-2" />
                {tag.name}
              </div>
            ))}
            {lead.tags.length > 3 && (
              <Badge variant="outline" className="text-xs h-5">
                +{lead.tags.length - 3}
              </Badge>
            )}
          </div>
        ) : null;

      case 'has_company':
        return lead.has_company ? (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Building2 className="h-3 w-3" />
            <span>Tem empresa</span>
          </div>
        ) : null;

      case 'sells_on_amazon':
        return lead.sells_on_amazon ? (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <ShoppingCart className="h-3 w-3" />
            <span>Vende na Amazon</span>
          </div>
        ) : null;

      case 'works_with_fba':
        return lead.works_with_fba ? (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Package className="h-3 w-3" />
            <span>FBA</span>
          </div>
        ) : null;

      case 'seeks_private_label':
        return lead.seeks_private_label ? (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Sparkles className="h-3 w-3" />
            <span>Marca própria</span>
          </div>
        ) : null;

      case 'ready_to_invest_3k':
        return lead.ready_to_invest_3k ? (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <DollarSign className="h-3 w-3" />
            <span>Pronto p/ investir</span>
          </div>
        ) : null;

      case 'calendly_scheduled':
        return lead.calendly_scheduled ? (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <Calendar className="h-3 w-3" />
            <span>Calendly agendado</span>
          </div>
        ) : null;

      case 'what_sells':
        return lead.what_sells ? (
          <div className="text-xs text-gray-600 line-clamp-1">
            Vende: {lead.what_sells}
          </div>
        ) : null;

      case 'amazon_state':
        return lead.amazon_state ? (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <MapPin className="h-3 w-3" />
            <span>{lead.amazon_state}</span>
          </div>
        ) : null;

      case 'created_at':
        return (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(lead.created_at), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </span>
          </div>
        );

      case 'updated_at':
        return (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>
              Atualizado {formatDistanceToNow(new Date(lead.updated_at), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </span>
          </div>
        );

      case 'scheduled_contact_date':
        return lead.scheduled_contact_date ? (
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <Calendar className="h-3 w-3" />
            <span>
              Contato: {new Date(lead.scheduled_contact_date).toLocaleDateString('pt-BR')}
            </span>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const renderedField = renderField();
  return renderedField ? <div>{renderedField}</div> : null;
};

export const DynamicLeadCard: React.FC<DynamicLeadCardProps> = ({
  lead,
  onClick,
  isDragging = false
}) => {
  const { preferences, isLoading } = useCRMCardPreferences();
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const queryClient = useQueryClient();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id: lead.id,
    data: {
      type: 'lead',
      lead: lead,
      column_id: lead.column_id
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔗 [DYNAMIC_CARD] Click no lead:', {
      leadId: lead.id,
      leadName: lead.name,
      isDragging
    });
    
    if (!isDragging && onClick) {
      onClick();
    }
  };

  const handleStatusChange = async (status: LeadStatus, reason?: string, lossReasonId?: string) => {
    try {
      const updateData: any = {
        status,
        status_changed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (reason) {
        updateData.status_reason = reason;
      }

      if (lossReasonId) {
        updateData.loss_reason_id = lossReasonId;
      }

      const { error } = await supabase
        .from('crm_leads')
        .update(updateData)
        .eq('id', lead.id);

      if (error) throw error;

      // Invalidar queries para atualizar os dados
      queryClient.invalidateQueries({ queryKey: ['unified-crm-leads'] });
      
      toast.success(`Status alterado para "${status}"`);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      throw error;
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  console.log('🎯 [DYNAMIC_CARD] Renderizando card:', {
    leadId: lead.id,
    leadName: lead.name,
    columnId: lead.column_id,
    isDragging
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  // Organizar campos pela ordem preferida do usuário
  const orderedVisibleFields = preferences.field_order.filter(field =>
    preferences.visible_fields.includes(field)
  );

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleClick}
        className={`
          group relative bg-white rounded-lg border border-gray-200 p-4 shadow-sm
          hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer
          ${isDragging ? 'opacity-50 rotate-3 scale-105' : ''}
        `}
      >
        {/* Header com nome e menu */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <FieldRenderer field="name" lead={lead} />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={handleMenuClick}>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowStatusDialog(true)}>
                Alterar Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onClick}>
                Ver Detalhes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status */}
        <div className="mb-2">
          <FieldRenderer field="status" lead={lead} />
        </div>

        {/* Outros campos */}
        <div className="space-y-2">
          {orderedVisibleFields
            .filter(field => !['name', 'status'].includes(field))
            .slice(0, 4) // Limitar campos exibidos
            .map((field) => (
              <FieldRenderer key={field} field={field} lead={lead} />
            ))}
        </div>

        {/* Tags se existirem */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <FieldRenderer field="tags" lead={lead} />
          </div>
        )}
      </div>

      {/* Dialog de mudança de status */}
      <StatusChangeDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        leadName={lead.name}
        currentStatus={lead.status}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};

export default DynamicLeadCard;
