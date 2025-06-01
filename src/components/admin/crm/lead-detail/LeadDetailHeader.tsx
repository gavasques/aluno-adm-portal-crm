
import React, { useState } from 'react';
import { X, Edit, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CRMLead } from '@/types/crm.types';
import { motion } from 'framer-motion';
import ModernCRMLeadFormDialog from '../ModernCRMLeadFormDialog';

interface LeadDetailHeaderProps {
  lead: CRMLead;
  onClose: () => void;
  onLeadUpdate: () => void;
}

export const LeadDetailHeader = ({ lead, onClose, onLeadUpdate }: LeadDetailHeaderProps) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const getStatusBadge = () => {
    if (lead.column?.name) {
      return (
        <Badge 
          variant="outline" 
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          {lead.column.name}
        </Badge>
      );
    }
    return null;
  };

  const handleEditClick = () => {
    console.log('🔧 Edit button clicked for lead:', lead.id);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    console.log('✅ Lead updated successfully, refreshing data...');
    setShowEditModal(false);
    onLeadUpdate();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-white/50">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{lead.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-gray-600">{lead.email}</p>
                {lead.phone && (
                  <>
                    <span className="text-gray-300">•</span>
                    <p className="text-gray-600">{lead.phone}</p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge()}
                {lead.responsible?.name && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {lead.responsible.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditClick}
              className="bg-white/50 hover:bg-white/80"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-lg hover:bg-white/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Modal de edição */}
      <ModernCRMLeadFormDialog
        open={showEditModal}
        onOpenChange={setShowEditModal}
        leadId={lead.id}
        mode="edit"
        onSuccess={handleEditSuccess}
      />
    </>
  );
};
