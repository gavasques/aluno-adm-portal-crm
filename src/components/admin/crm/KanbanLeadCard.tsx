
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, User, Calendar, Phone, Mail } from 'lucide-react';
import { CRMLead } from '@/types/crm.types';

interface KanbanLeadCardProps {
  lead: CRMLead;
}

const KanbanLeadCard = ({ lead }: KanbanLeadCardProps) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h4 className="font-semibold text-sm line-clamp-1">{lead.name}</h4>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Mail className="w-3 h-3 mr-1" />
                <span className="line-clamp-1">{lead.email}</span>
              </div>
              {lead.phone && (
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Phone className="w-3 h-3 mr-1" />
                  <span>{lead.phone}</span>
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {lead.tags.slice(0, 2).map(tag => (
                <Badge 
                  key={tag.id} 
                  variant="secondary" 
                  className="text-xs px-1 py-0"
                  style={{ backgroundColor: tag.color + '20', color: tag.color }}
                >
                  {tag.name}
                </Badge>
              ))}
              {lead.tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  +{lead.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Responsável */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <Avatar className="h-5 w-5 mr-2">
                <AvatarFallback className="text-xs bg-blue-100">
                  {lead.responsible ? getInitials(lead.responsible.name) : <User className="h-3 w-3" />}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-600">
                {lead.responsible ? lead.responsible.name : 'Sem responsável'}
              </span>
            </div>
          </div>

          {/* Data de contato agendada */}
          {lead.scheduled_contact_date && (
            <div className="flex items-center text-xs text-gray-500 mt-2">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Contato: {formatDate(lead.scheduled_contact_date)}</span>
            </div>
          )}

          {/* Informações importantes */}
          <div className="flex flex-wrap gap-1 mt-2">
            {lead.has_company && (
              <Badge variant="outline" className="text-xs">Empresa</Badge>
            )}
            {lead.sells_on_amazon && (
              <Badge variant="outline" className="text-xs">Amazon</Badge>
            )}
            {lead.ready_to_invest_3k && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">R$ 3k</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KanbanLeadCard;
