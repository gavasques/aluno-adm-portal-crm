
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, User, Calendar, Phone, Mail, Building, DollarSign } from 'lucide-react';
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
      <Card className="hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white">
        <CardContent className="p-4">
          {/* Header do Card */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
                {lead.name}
              </h4>
              <div className="flex items-center text-xs text-gray-500">
                <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">{lead.email}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>

          {/* Informações de Contato */}
          {lead.phone && (
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
              <span>{lead.phone}</span>
            </div>
          )}

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {lead.tags.slice(0, 2).map(tag => (
                <Badge 
                  key={tag.id} 
                  variant="outline" 
                  className="text-xs px-2 py-0.5 border-gray-200"
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
                <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600">
                  +{lead.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Responsável */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {lead.responsible ? getInitials(lead.responsible.name) : <User className="h-3 w-3" />}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600">
                {lead.responsible ? lead.responsible.name : 'Sem responsável'}
              </span>
            </div>
          </div>

          {/* Informações Importantes */}
          <div className="flex flex-wrap gap-1 mb-2">
            {lead.has_company && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                <Building className="h-3 w-3 mr-1" />
                Empresa
              </Badge>
            )}
            {lead.sells_on_amazon && (
              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                Amazon
              </Badge>
            )}
            {lead.ready_to_invest_3k && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                <DollarSign className="h-3 w-3 mr-1" />
                R$ 3k
              </Badge>
            )}
          </div>

          {/* Data de contato agendada */}
          {lead.scheduled_contact_date && (
            <div className="flex items-center text-xs text-gray-500 bg-gray-50 rounded-md px-2 py-1">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Contato: {formatDate(lead.scheduled_contact_date)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KanbanLeadCard;
