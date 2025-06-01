
import React, { useState } from 'react';
import { Calendar, Phone, Mail, MessageSquare, Video, Plus, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LeadContactsTabProps {
  leadId: string;
}

const LeadContactsTab = ({ leadId }: LeadContactsTabProps) => {
  const [contacts] = useState([
    {
      id: '1',
      type: 'call',
      reason: 'Apresentação da proposta',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
      status: 'pending',
      responsible: 'João Silva',
      notes: 'Cliente interessado em saber mais sobre o processo'
    },
    {
      id: '2',
      type: 'email',
      reason: 'Envio de material complementar',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      status: 'completed',
      responsible: 'Maria Santos',
      notes: 'Enviado e-book sobre marca própria'
    },
    {
      id: '3',
      type: 'whatsapp',
      reason: 'Follow-up inicial',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ontem
      status: 'completed',
      responsible: 'João Silva',
      notes: 'Cliente respondeu positivamente'
    },
    {
      id: '4',
      type: 'meeting',
      reason: 'Reunião de descoberta',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Em 3 dias
      status: 'pending',
      responsible: 'Maria Santos',
      notes: 'Reunião agendada via Calendly'
    }
  ]);

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />;
      case 'meeting':
        return <Video className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case 'call':
        return 'Ligação';
      case 'email':
        return 'E-mail';
      case 'whatsapp':
        return 'WhatsApp';
      case 'meeting':
        return 'Reunião';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluído</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Atrasado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'call':
        return 'text-blue-600 bg-blue-100';
      case 'email':
        return 'text-green-600 bg-green-100';
      case 'whatsapp':
        return 'text-emerald-600 bg-emerald-100';
      case 'meeting':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const pendingContacts = contacts.filter(c => c.status === 'pending');
  const completedContacts = contacts.filter(c => c.status === 'completed');

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Contatos ({contacts.length})
        </h3>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Agendar Contato
        </Button>
      </div>

      <div className="space-y-6">
        {/* Contatos Pendentes */}
        {pendingContacts.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Pendentes ({pendingContacts.length})
            </h4>
            <div className="space-y-3">
              {pendingContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg border border-yellow-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getContactTypeColor(contact.type)}`}>
                        {getContactIcon(contact.type)}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{contact.reason}</h5>
                        <p className="text-sm text-gray-600">
                          {format(contact.date, 'dd/MM/yyyy HH:mm', { locale: ptBR })} • {contact.responsible}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {getContactTypeLabel(contact.type)}
                      </Badge>
                      {getStatusBadge(contact.status)}
                    </div>
                  </div>
                  {contact.notes && (
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                      {contact.notes}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Contatos Concluídos */}
        {completedContacts.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Concluídos ({completedContacts.length})
            </h4>
            <div className="space-y-3">
              {completedContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg border border-green-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getContactTypeColor(contact.type)}`}>
                        {getContactIcon(contact.type)}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{contact.reason}</h5>
                        <p className="text-sm text-gray-600">
                          {format(contact.date, 'dd/MM/yyyy HH:mm', { locale: ptBR })} • {contact.responsible}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {getContactTypeLabel(contact.type)}
                      </Badge>
                      {getStatusBadge(contact.status)}
                    </div>
                  </div>
                  {contact.notes && (
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                      {contact.notes}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Nenhum contato registrado</p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Agendar Primeiro Contato
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeadContactsTab;
