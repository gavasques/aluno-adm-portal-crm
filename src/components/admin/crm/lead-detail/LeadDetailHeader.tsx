import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  UserCheck,
  Edit,
  Building2,
  Globe,
  DollarSign
} from 'lucide-react';
import { CRMLead } from '@/types/crm.types';
import LeadDataTab from '../lead-detail-tabs/LeadDataTab';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LeadDetailHeaderProps {
  lead: CRMLead;
  onClose: () => void;
  onLeadUpdate?: () => void;
}

export const LeadDetailHeader = ({ lead, onClose, onLeadUpdate }: LeadDetailHeaderProps) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    // Forçar atualização dos dados do lead
    if (onLeadUpdate) {
      onLeadUpdate();
    }
    // Recarregar a página para garantir que os dados sejam atualizados
    window.location.reload();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white p-6 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        </div>

        <div className="relative z-10">
          {/* Header Top */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white/20">
                <AvatarFallback className="text-lg bg-white/20 text-white">
                  {getInitials(lead.name)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-2xl font-bold mb-1">{lead.name}</h1>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowEditModal(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status and Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: lead.column?.color || '#6b7280' }}
                />
                <span className="text-sm font-medium">Status</span>
              </div>
              <p className="text-white font-semibold">{lead.column?.name || 'Sem status'}</p>
            </div>

            {/* Responsável */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="h-4 w-4" />
                <span className="text-sm font-medium">Responsável</span>
              </div>
              <p className="text-white font-semibold">
                {lead.responsible ? lead.responsible.name : 'Não atribuído'}
              </p>
            </div>

            {/* Próximo Contato */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Próximo Contato</span>
              </div>
              <p className="text-white font-semibold">
                {lead.scheduled_contact_date 
                  ? formatDate(lead.scheduled_contact_date)
                  : 'Não agendado'
                }
              </p>
            </div>

            {/* Qualificação */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Qualificação</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {lead.has_company && (
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-100 border-blue-400/30 text-xs">
                    <Building2 className="h-3 w-3 mr-1" />
                    Empresa
                  </Badge>
                )}
                {lead.sells_on_amazon && (
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-100 border-orange-400/30 text-xs">
                    <Globe className="h-3 w-3 mr-1" />
                    Amazon
                  </Badge>
                )}
                {lead.ready_to_invest_3k && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-400/30 text-xs">
                    <DollarSign className="h-3 w-3 mr-1" />
                    R$ 3k
                  </Badge>
                )}
                {!lead.has_company && !lead.sells_on_amazon && !lead.ready_to_invest_3k && (
                  <span className="text-white/60 text-xs">Não qualificado</span>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {lead.tags.map(tag => (
                  <Badge
                    key={tag.id}
                    className="bg-white/20 text-white border-white/30"
                    style={{ 
                      backgroundColor: tag.color + '20', 
                      borderColor: tag.color + '50'
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal de Edição */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Editar Lead - {lead.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <LeadDataTab lead={lead} onUpdate={handleEditSuccess} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
