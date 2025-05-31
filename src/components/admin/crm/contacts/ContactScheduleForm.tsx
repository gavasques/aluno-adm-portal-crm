
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Phone, Mail, MessageSquare, Users } from 'lucide-react';
import { CRMLeadContactCreate } from '@/types/crm.types';
import { useCRMUsers } from '@/hooks/crm/useCRMUsers';

interface ContactScheduleFormProps {
  leadId: string;
  onSubmit: (contact: CRMLeadContactCreate) => Promise<void>;
  onCancel: () => void;
}

const ContactScheduleForm = ({ leadId, onSubmit, onCancel }: ContactScheduleFormProps) => {
  const [formData, setFormData] = useState<Partial<CRMLeadContactCreate>>({
    lead_id: leadId,
    contact_type: 'call',
    contact_reason: '',
    contact_date: '',
    responsible_id: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { users } = useCRMUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contact_date || !formData.responsible_id || !formData.contact_reason) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData as CRMLeadContactCreate);
      // Reset form
      setFormData({
        lead_id: leadId,
        contact_type: 'call',
        contact_reason: '',
        contact_date: '',
        responsible_id: '',
        notes: ''
      });
    } catch (error) {
      console.error('Erro ao agendar contato:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      default: return <Phone className="h-4 w-4" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact_date">Data e Hora do Contato</Label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="contact_date"
              type="datetime-local"
              value={formData.contact_date}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_date: e.target.value }))}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsible_id">Responsável</Label>
          <Select 
            value={formData.responsible_id} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, responsible_id: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o responsável" />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_type">Meio de Contato</Label>
        <Select 
          value={formData.contact_type} 
          onValueChange={(value: any) => setFormData(prev => ({ ...prev, contact_type: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o meio de contato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="call">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Ligação
              </div>
            </SelectItem>
            <SelectItem value="email">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </div>
            </SelectItem>
            <SelectItem value="whatsapp">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                WhatsApp
              </div>
            </SelectItem>
            <SelectItem value="meeting">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Reunião
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_reason">Motivo do Contato</Label>
        <Input
          id="contact_reason"
          value={formData.contact_reason}
          onChange={(e) => setFormData(prev => ({ ...prev, contact_reason: e.target.value }))}
          placeholder="Ex: Follow-up, apresentação, esclarecimento de dúvidas..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações (opcional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Informações adicionais sobre o contato..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Agendando...' : 'Agendar Contato'}
        </Button>
      </div>
    </form>
  );
};

export default ContactScheduleForm;
