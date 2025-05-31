import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  Trash2
} from 'lucide-react';
import { CRMLeadContact } from '@/types/crm.types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

interface ContactsListProps {
  contacts: CRMLeadContact[];
  onCompleteContact: (contactId: string, notes?: string) => void;
  onDeleteContact: (contactId: string) => void;
  loading?: boolean;
}

const ContactsList = ({ contacts, onCompleteContact, onDeleteContact, loading }: ContactsListProps) => {
  const [completingContact, setCompletingContact] = useState<string | null>(null);

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      default: return <Phone className="h-4 w-4" />;
    }
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case 'call': return 'Ligação';
      case 'email': return 'Email';
      case 'whatsapp': return 'WhatsApp';
      case 'meeting': return 'Reunião';
      default: return 'Contato';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Realizado
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Atrasado
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCompleteContact = async (contactId: string) => {
    setCompletingContact(contactId);
    try {
      await onCompleteContact(contactId);
    } finally {
      setCompletingContact(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Nenhum contato agendado</p>
        <p className="text-gray-400 text-xs">Agende o primeiro contato com este lead</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact, index) => (
        <motion.div
          key={contact.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getContactTypeIcon(contact.contact_type)}
                  <span className="font-medium text-sm">
                    {getContactTypeLabel(contact.contact_type)}
                  </span>
                </div>
                {getStatusBadge(contact.status)}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(contact.contact_date)}</span>
                <span className="text-gray-400">•</span>
                <span>
                  {formatDistanceToNow(new Date(contact.contact_date), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                    {contact.responsible?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">
                  {contact.responsible?.name}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {contact.contact_reason}
                </p>
                {contact.notes && (
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {contact.notes}
                  </p>
                )}
              </div>

              {contact.status === 'completed' && contact.completed_at && (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  Realizado em {formatDate(contact.completed_at)}
                  {contact.completed_by && (
                    <span> por {contact.completed_by}</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              {contact.status === 'pending' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCompleteContact(contact.id)}
                  disabled={completingContact === contact.id}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {completingContact === contact.id ? 'Marcando...' : 'Marcar como Realizado'}
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onDeleteContact(contact.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ContactsList;
