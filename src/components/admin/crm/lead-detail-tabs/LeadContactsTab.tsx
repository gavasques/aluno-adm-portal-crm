
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { useCRMLeadContacts } from '@/hooks/crm/useCRMLeadContacts';
import ContactScheduleForm from '../contacts/ContactScheduleForm';
import ContactsList from '../contacts/ContactsList';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadContactsTabProps {
  leadId: string;
}

const LeadContactsTab = ({ leadId }: LeadContactsTabProps) => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const { 
    contacts, 
    loading, 
    createContact, 
    completeContact, 
    deleteContact 
  } = useCRMLeadContacts(leadId);

  const handleScheduleContact = async (contactData: any) => {
    await createContact(contactData);
    setShowScheduleForm(false);
  };

  const handleCompleteContact = async (contactId: string) => {
    await completeContact(contactId);
  };

  const handleDeleteContact = async (contactId: string) => {
    if (window.confirm('Tem certeza que deseja remover este contato?')) {
      await deleteContact(contactId);
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Contatos Agendados</h3>
            <span className="text-sm text-gray-500">({contacts.length})</span>
          </div>
          
          <Button
            onClick={() => setShowScheduleForm(!showScheduleForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agendar Contato
          </Button>
        </div>

        {/* Schedule Form */}
        <AnimatePresence>
          {showScheduleForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <h4 className="font-medium mb-4">Agendar Novo Contato</h4>
              <ContactScheduleForm
                leadId={leadId}
                onSubmit={handleScheduleContact}
                onCancel={() => setShowScheduleForm(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contacts List */}
        <div className="space-y-4">
          <ContactsList
            contacts={contacts}
            onCompleteContact={handleCompleteContact}
            onDeleteContact={handleDeleteContact}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadContactsTab;
