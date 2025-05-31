
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { CRMFilters, CRMLead } from '@/types/crm.types';
import { useCRMData } from '@/hooks/crm/useCRMData';
import { useNavigate } from 'react-router-dom';
import { isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';

interface CRMListViewProps {
  filters: CRMFilters;
  onEditLead?: (lead: CRMLead) => void;
}

const CRMListView = ({ filters, onEditLead }: CRMListViewProps) => {
  const navigate = useNavigate();
  const { leadsWithContacts, loading } = useCRMData(filters);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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
          <AlertTriangle className="h-3 w-3 mr-1" />
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

  const handleViewDetails = (lead: CRMLead) => {
    navigate(`/admin/crm/lead/${lead.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (leadsWithContacts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum lead encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leadsWithContacts.map(lead => {
        const nextContact = lead.pending_contacts && lead.pending_contacts.length > 0
          ? lead.pending_contacts
              .filter(contact => contact.status === 'pending')
              .sort((a, b) => new Date(a.contact_date).getTime() - new Date(b.contact_date).getTime())[0]
          : null;

        const lastCompletedContact = lead.last_completed_contact;

        return (
          <div
            key={lead.id}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-gray-900">{lead.name}</h3>
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: lead.column?.color || '#6b7280' }}
                  />
                  <span className="text-sm text-gray-600">{lead.column?.name}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{lead.email}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Próximo: {nextContact ? formatDate(nextContact.contact_date) : 'Sem contatos'}
                    </span>
                    {nextContact && getContactBadge(nextContact.contact_date)}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>
                      Último: {lastCompletedContact && lastCompletedContact.completed_at
                        ? formatDate(lastCompletedContact.completed_at)
                        : 'Sem contatos'
                      }
                    </span>
                    {lastCompletedContact && lastCompletedContact.completed_at && 
                      getContactBadge(lastCompletedContact.completed_at, true)
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(lead)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Detalhes
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CRMListView;
