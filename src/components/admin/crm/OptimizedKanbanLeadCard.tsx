
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, User, Calendar, Eye, Clock, AlertTriangle } from 'lucide-react';
import { CRMLead, CRMLeadContact } from '@/types/crm.types';
import { differenceInDays, isToday, isTomorrow, isPast } from 'date-fns';

interface OptimizedKanbanLeadCardProps {
  lead: CRMLead;
  pendingContacts: CRMLeadContact[];
  onOpenDetail?: (lead: CRMLead) => void;
}

const OptimizedKanbanLeadCard = ({ lead, pendingContacts, onOpenDetail }: OptimizedKanbanLeadCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenDetail?.(lead);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenDetail?.(lead);
  };

  // Buscar próximo contato pendente
  const nextContact = pendingContacts
    .sort((a, b) => new Date(a.contact_date).getTime() - new Date(b.contact_date).getTime())[0];

  const getContactBadge = () => {
    if (!nextContact) return null;

    const contactDate = new Date(nextContact.contact_date);
    const today = new Date();
    
    if (isPast(contactDate) && !isToday(contactDate)) {
      return (
        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200 h-5 px-1.5">
          <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
          Atrasado
        </Badge>
      );
    }
    
    if (isToday(contactDate)) {
      return (
        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 h-5 px-1.5">
          <Clock className="h-2.5 w-2.5 mr-0.5" />
          Hoje
        </Badge>
      );
    }
    
    if (isTomorrow(contactDate)) {
      return (
        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 h-5 px-1.5">
          <Clock className="h-2.5 w-2.5 mr-0.5" />
          Amanhã
        </Badge>
      );
    }
    
    const daysDiff = differenceInDays(contactDate, today);
    if (daysDiff <= 7) {
      return (
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 h-5 px-1.5">
          <Calendar className="h-2.5 w-2.5 mr-0.5" />
          {daysDiff}d
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
      onClick={handleCardClick}
    >
      <Card className="hover:shadow-md transition-all duration-200 border border-gray-200 bg-white hover:bg-gray-50">
        <CardContent className="p-3">
          {/* Header do Card */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-xs line-clamp-1 mb-1">
                {lead.name}
              </h4>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0 text-gray-400 hover:text-blue-600" 
                onClick={handleViewDetails}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Próximo Contato */}
          {nextContact && (
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2 p-2 bg-gray-50/50 rounded-md">
              <div className="flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" />
                <span className="text-xs">Próximo: {formatDate(nextContact.contact_date)}</span>
              </div>
              {getContactBadge()}
            </div>
          )}

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {lead.tags.slice(0, 2).map(tag => (
                <Badge 
                  key={tag.id} 
                  variant="outline" 
                  className="text-xs px-1.5 py-0.5 border-gray-200 h-5"
                  style={{ 
                    backgroundColor: tag.color + '15', 
                    color: tag.color,
                    borderColor: tag.color + '30'
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
              {lead.tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-gray-50 text-gray-600 h-5">
                  +{lead.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Responsável */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center min-w-0">
              <Avatar className="h-5 w-5 mr-1.5">
                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {lead.responsible ? getInitials(lead.responsible.name) : <User className="h-2.5 w-2.5" />}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600 truncate">
                {lead.responsible ? lead.responsible.name : 'Sem responsável'}
              </span>
            </div>
          </div>

          {/* Data de contato agendada */}
          {lead.scheduled_contact_date && (
            <div className="flex items-center text-xs text-gray-500 bg-gray-50 rounded-md px-2 py-1">
              <Calendar className="w-2.5 h-2.5 mr-1" />
              <span className="text-xs">Contato: {formatDate(lead.scheduled_contact_date)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedKanbanLeadCard;
