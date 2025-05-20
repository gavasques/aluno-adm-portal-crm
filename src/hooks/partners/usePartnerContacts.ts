
import { useState } from "react";
import { Partner } from "@/types/partner.types";
import { useToast } from "@/hooks/use-toast";

export const usePartnerContacts = (
  selectedPartner: Partner | null, 
  setSelectedPartner: (partner: Partner | null) => void,
  updatePartner: (partner: Partner) => void
) => {
  const { toast } = useToast();
  
  // Form state for new contacts
  const [newContactName, setNewContactName] = useState("");
  const [newContactRole, setNewContactRole] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  
  const handleAddContact = () => {
    if (selectedPartner && newContactName && newContactEmail) {
      const newContact = {
        id: Date.now(),
        name: newContactName,
        role: newContactRole,
        email: newContactEmail,
        phone: newContactPhone
      };
      
      const updatedContacts = [...(selectedPartner.contacts || []), newContact];
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: `Contato adicionado: ${newContactName}`,
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        contacts: updatedContacts,
        history: updatedHistory
      };
      
      updatePartner(updatedPartner);
      setSelectedPartner(updatedPartner);
      
      // Reset form
      setNewContactName("");
      setNewContactRole("");
      setNewContactEmail("");
      setNewContactPhone("");
      
      toast({
        title: "Contato adicionado com sucesso!",
        variant: "default",
      });
    }
  };
  
  const handleDeleteContact = (contactId: number) => {
    if (selectedPartner) {
      const contactToDelete = selectedPartner.contacts.find(c => c.id === contactId);
      const updatedContacts = selectedPartner.contacts.filter(c => c.id !== contactId);
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: `Contato removido: ${contactToDelete?.name || 'Desconhecido'}`,
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        contacts: updatedContacts,
        history: updatedHistory
      };
      
      updatePartner(updatedPartner);
      setSelectedPartner(updatedPartner);
      
      toast({
        title: "Contato removido com sucesso!",
        variant: "default",
      });
    }
  };
  
  return {
    newContactName,
    newContactRole,
    newContactEmail,
    newContactPhone,
    setNewContactName,
    setNewContactRole,
    setNewContactEmail,
    setNewContactPhone,
    handleAddContact,
    handleDeleteContact
  };
};
