
import { useCallback } from 'react';
import { isToday, isTomorrow, isPast } from 'date-fns';
import { CRMLeadContact, LeadWithContacts } from '@/types/crm.types';

export const useCRMLeadFilters = () => {
  const filterLeadsByContact = useCallback((leadsData: LeadWithContacts[], contactFilter?: string) => {
    if (!contactFilter) return leadsData;

    return leadsData.filter(lead => {
      const hasPendingContacts = lead.pending_contacts.length > 0;
      
      switch (contactFilter) {
        case 'today':
          return hasPendingContacts && lead.pending_contacts.some(contact => 
            isToday(new Date(contact.contact_date))
          );
        case 'tomorrow':
          return hasPendingContacts && lead.pending_contacts.some(contact => 
            isTomorrow(new Date(contact.contact_date))
          );
        case 'overdue':
          return hasPendingContacts && lead.pending_contacts.some(contact => {
            const contactDate = new Date(contact.contact_date);
            return isPast(contactDate) && !isToday(contactDate);
          });
        case 'no_contact':
          return !hasPendingContacts;
        default:
          return true;
      }
    });
  }, []);

  const filterLeadsByTags = useCallback((leadsData: LeadWithContacts[], tagIds?: string[]) => {
    if (!tagIds || tagIds.length === 0) return leadsData;

    return leadsData.filter(lead => {
      const leadTagIds = lead.tags?.map(tag => tag.id) || [];
      return tagIds.some(tagId => leadTagIds.includes(tagId));
    });
  }, []);

  return { filterLeadsByContact, filterLeadsByTags };
};
